# Arquitectura del proyecto

Este documento describe cómo está organizado el proyecto y por qué, para que sirva
de referencia al retomarlo o extenderlo.

## Visión general

El repositorio contiene **dos aplicaciones independientes** que comparten el mismo
dominio (un catálogo de productos Apple), pero que se ejecutan en modos distintos:

```
AppleStore-web/
  frontend-productos/   SPA en React — el único artefacto que se despliega
  backend/               API REST en Express + MongoDB (uso local/futuro)
  .github/workflows/     Automatización de despliegue (GitHub Actions)
  ARCHITECTURE.md         <- este documento
  README.md
```

- **Modo demo (producción actual):** `frontend-productos` se compila como sitio
  estático y se publica en GitHub Pages. No depende de ningún servidor: el
  catálogo vive en `public/data/productos.json` y las mutaciones (crear/editar/
  borrar) se guardan en `localStorage` del navegador. Es intencional — permite
  tener una demo funcional y gratuita sin mantener infraestructura.
- **Modo full-stack (desarrollo local):** `backend/` implementa la misma API
  contra MongoDB. Hoy no está conectado al frontend desplegado, pero existe
  para cuando se quiera pasar de "datos quemados" a datos reales (ver
  [Cómo reconectar el backend](#cómo-reconectar-el-backend)).

## Frontend (`frontend-productos/`)

React 18 + React Router 6, creado con Create React App (`react-scripts`).

```
src/
  App.js                 Definición de rutas (única fuente de verdad del ruteo)
  index.js                Bootstrap: BrowserRouter con basename = PUBLIC_URL
  components/
    ProductosApple.js      Landing (marketing) — hero, secciones por categoría, nav
    ProductoList.js         Catálogo (/catalogo) — grid de productos + alta rápida
    ProductoForm.js          Formulario de alta (se embebe dentro de ProductoList)
    ProductoDetail.js        Detalle de un producto (/producto/:id)
    ProductoEdit.js           Edición de un producto (/producto/editar/:id)
    LoginView.js / RegisterView.js / modals/   Autenticación (modal, sin backend real)
  services/
    productoService.js      Capa de datos del catálogo (ver abajo)
    AuthService.js            Capa de datos de autenticación (localStorage)
```

**Capas y flujo de datos:** los componentes nunca hablan con `fetch`/`localStorage`
directamente — todo pasa por `services/`. Esa es la costura pensada para poder
cambiar el modo demo por el modo full-stack sin tocar los componentes.

```
Componente (ProductoList, ProductoDetail, ...)
        │  llama a
        ▼
services/productoService.js   <-- única capa que sabe de dónde vienen los datos
        │
        ├── hoy:   fetch('/data/productos.json') + localStorage
        └── mañana: axios hacia backend/ (mismo shape de respuesta)
```

`productoService.js` combina el catálogo base (`productos.json`) con lo que el
usuario crea/edita/borra en `localStorage`, para que el CRUD se sienta completo
sin backend. Todas las funciones devuelven `{ data: { producto(s) } }`, el mismo
shape que devolvería la API real — por eso los componentes no necesitan cambiar
si mañana se apunta a `backend/`.

### Rutas

| Ruta                     | Componente       | Qué hace                                   |
|--------------------------|------------------|---------------------------------------------|
| `/`                      | → redirige       | a `/productos`                               |
| `/productos`             | `ProductosApple` | Landing con secciones por categoría          |
| `/catalogo`              | `ProductoList`   | Grid de productos, alta y borrado            |
| `/producto/:id`          | `ProductoDetail` | Ficha de un producto                         |
| `/producto/editar/:id`   | `ProductoEdit`   | Edición de un producto                       |

### Cómo reconectar el backend

Cuando se quiera dejar de usar datos quemados:

1. Reescribir `services/productoService.js` y `services/AuthService.js` para
   usar `axios` contra la URL del backend, manteniendo el mismo shape de
   retorno (`{ data: { producto } }`, `{ data: { productos } }`) — así ningún
   componente cambia.
2. Añadir una variable de entorno (`REACT_APP_API_URL`) en vez de hardcodear
   la URL.
3. El sitio dejaría de ser 100% estático: habría que desplegar `backend/` en
   algún servicio (Render, Railway, Fly.io, etc.) además de GitHub Pages para
   el frontend.

## Backend (`backend/`)

Express + MongoDB (Mongoose), no desplegado actualmente — pensado para
desarrollo local o para una futura versión full-stack.

```
backend/
  index.js                  Arranque del servidor
  app.js                     Configuración de Express + CORS
  routes/productos.routes.js  Definición de endpoints
  controllers/                Lógica de cada endpoint (productos, auth)
  models/                      Esquemas de Mongoose (Producto, User)
```

Capas: `routes` (qué URL existe) → `controllers` (qué hace) → `models`
(cómo se guarda). Es el mismo patrón MVC simplificado en el que ya está escrito;
no requirió cambios para este trabajo.

## Despliegue y automatización

Un único workflow de GitHub Actions (`.github/workflows/deploy.yml`) construye
y publica el frontend en cada push a `main` que toque `frontend-productos/`:

```
push a main (frontend-productos/**)
        │
        ▼
GitHub Actions: checkout → npm install → npm run build
        │
        ▼
peaceiris/actions-gh-pages publica frontend-productos/build en la rama gh-pages
        │
        ▼
GitHub Pages sirve esa rama → https://DarioRodriguez47.github.io/AppleStore-web
```

Puntos a tener en cuenta:

- **No hay `package-lock.json` commiteado** (está en `.gitignore`), por eso el
  workflow usa `npm install` en vez de `npm ci`. Como contrapartida, cada build
  resuelve las versiones más nuevas compatibles — así se detectó y arregló un
  problema real: `react-scripts` + `eslint` más reciente rompía el build
  (ver `overrides.eslint` en `frontend-productos/package.json`). Si el build
  vuelve a romperse por una dependencia nueva, ese es el primer lugar a mirar.
- **404.html:** como es una SPA con rutas de cliente (`react-router`) y GitHub
  Pages es un host estático, se genera `build/404.html` (copia de `index.html`)
  con un script `postbuild`, para que entrar directo a `/producto/1` o
  refrescar la página no rompa.
- Antes había **dos workflows** que competían entre sí (uno con
  `actions/deploy-pages`, que requiere que "Pages source" esté en
  "GitHub Actions", y otro con `peaceiris/actions-gh-pages`, que publica en la
  rama `gh-pages`). Se dejó solo el segundo porque es el que coincide con la
  configuración real del repo (la rama `gh-pages` ya existía con commits de
  ese action). Si en algún momento se cambia el "Pages source" del repo a
  "GitHub Actions", hay que revisar este documento antes de tocar el workflow.

## Decisiones de diseño (por qué está así)

- **Datos quemados en vez de backend real:** GitHub Pages solo sirve estático;
  meter una API real habría requerido pagar/mantener un servidor solo para una
  demo. `productoService.js`/`AuthService.js` simulan el backend con
  `localStorage` para que el flujo (crear, editar, borrar, login) se sienta
  completo igual.
- **`docs/`, `docs_static/`, `dist/` eliminados:** eran tres copias
  prácticamente idénticas de una versión anterior en HTML/JS plano (previa a
  la SPA en React), que ya no se usaban para nada — quedaban solo como ruido.
  Si hace falta recuperarlas, están en el historial de git.
