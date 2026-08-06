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
  index.js                Bootstrap: BrowserRouter + AuthProvider + CartProvider
  components/
    ProductosApple.js      Landing (marketing) — hero, secciones por categoría, nav
    ProductoList.js         Catálogo público (/catalogo) — grid + "Agregar al carrito"
    ProductoForm.js          Formulario de alta/edición (reutilizado por el admin)
    ProductoDetail.js        Detalle de un producto (/producto/:id)
    LoginView.js / RegisterView.js / modals/   Autenticación (modal, sin backend real)
  services/
    productoService.js      Capa de datos del catálogo (ver abajo)
    AuthService.js            Capa de datos de autenticación (localStorage)
  context/
    AuthContext.js           Sesión (público vs. administrador)
  cart/                      Feature carrito+checkout (ver más abajo)
  admin/                     Feature panel administrativo (ver más abajo)
```

Las carpetas `cart/` y `admin/` son las únicas organizadas con **atomic design**
(atoms/molecules/organisms/pages) — se decidió aplicarlo solo al código nuevo
y dejar el catálogo existente (`components/`) como está, para no arriesgar
romper algo que ya funcionaba y estaba desplegado.

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

### Sesión y vistas (público vs. administrador)

La app tiene una sola sesión (no hay un rol de "cliente" separado): **estar
logueado equivale a ser administrador**, con su propia área separada en
`/admin`. Sin sesión, la app se ve en modo público (catálogo + compra).

```
context/AuthContext.js   Estado de sesión (usuario logueado o no), persistido
                          en localStorage. `isAdmin` = !!user.
```

- **Vista pública (sin sesión):** navega el catálogo, ve el detalle de cada
  producto, arma un carrito y completa una compra (ver sección Carrito).
  No ve controles de gestión de inventario en ningún lado del sitio público.
- **Vista administrador (`/admin`, con sesión):** área separada del sitio
  público, con pestañas para gestionar **Pedidos** (ver estado, cambiarlo) y
  **Productos** (crear, editar, borrar — el CRUD que antes vivía embebido en
  `/catalogo`). Entrar a `/admin` sin sesión muestra un login dedicado en vez
  del contenido.
- **Credencial de demo** (sembrada automáticamente la primera vez que carga la
  app, ver `seedDemoAdmin` en `services/AuthService.js`):
  `admin@apple.com` / `admin123`. Se muestra como pista tanto en el modal de
  login público como en el de `/admin`.
- **Límite real de esta separación:** al ser un sitio 100% estático, "público
  vs. administrador" es solo interfaz (oculta controles, redirige rutas) — no
  hay backend que lo haga cumplir. Alguien con DevTools podría editar el
  `localStorage` y saltárselo. No reemplaza autorización real del lado
  servidor.

### Carrito y checkout (`cart/`)

```
cart/
  context/CartContext.js    Estado del carrito (localStorage), expone
                             addItem/removeItem/updateQuantity/clearCart
  services/orderService.js  Pedidos: createOrder/getOrders/getMyOrders/
                             updateOrderStatus (localStorage, mismo patrón
                             que productoService)
  atoms/       QuantityStepper, StatusBadge — piezas mínimas sin lógica propia
  molecules/   CartLineItem, OrderCard — una fila de carrito / una tarjeta de pedido
  organisms/   CartSummary, CheckoutForm — bloques completos de UI
  pages/       CarritoPage (/carrito), MisPedidosPage (/mis-pedidos)
```

Flujo: `ProductoList`/`ProductoDetail` llaman a `useCart().addItem(producto)`
→ el nav muestra el contador → `/carrito` deja editar cantidades y pedir los
datos de contacto y entrega (`CheckoutForm`) → al confirmar, `orderService.
createOrder` guarda el pedido y el carrito se vacía. El pedido queda
disponible de inmediato en `/admin` → Pedidos, y también en `/mis-pedidos`
para quien lo hizo.

**"Mis pedidos" vs. lo que ve el administrador:** como no hay cuentas de
cliente reales, `getOrders()` (admin, ve todo) y `getMyOrders()` (visitante,
solo lo suyo) son funciones distintas. `getMyOrders` filtra por una lista de
ids guardada aparte (`mis_pedidos_ids`) que se llena solo cuando ESTE
navegador completa un checkout — así el comprador no ve mezclados los
pedidos de demo sembrados para el admin.

Se siembran 2 pedidos de ejemplo la primera vez que carga la app (ver
`seedDemoOrders` en `orderService.js`), visibles solo en `/admin` → Pedidos
(no aparecen en `/mis-pedidos` de nadie), para que el panel de administrador
no se vea vacío al grabar una demo.

### Panel administrativo (`admin/`)

```
admin/
  organisms/   AdminLoginForm, OrdersTable, ProductsAdminPanel
  pages/       AdminPage (/admin) — pestañas Pedidos | Productos
```

`ProductsAdminPanel` reutiliza el `ProductoForm` y el `productoService` ya
existentes (no duplica el CRUD); `OrdersTable` reutiliza los atoms de
`cart/` (`StatusBadge`) para no repetir la lista de estados en dos lugares.

**Cuidado con selectores de etiqueta global:** `components/AppleProducts.css`
tiene reglas como `nav { position: fixed; ... }` y `header { height: calc(100vh
- 44px); ... }` que aplican a **cualquier** `<nav>`/`<header>` de toda la app
(el CSS no está scopeado por componente). Por eso en `cart/` y `admin/` se usan
`<div>` en vez de `<nav>`/`<header>`/`<section>`/`<footer>` para el layout —
usar esas etiquetas ahí rompe el layout heredando estilos pensados para la
landing pública. Si se agrega una página nueva, evitar esas 4 etiquetas para
contenedores de layout (usar `<div>` con una clase propia).

### Rutas

| Ruta              | Componente        | Qué hace                                            |
|-------------------|--------------------|------------------------------------------------------|
| `/`               | → redirige         | a `/productos`                                        |
| `/productos`      | `ProductosApple`   | Landing con secciones por categoría                   |
| `/catalogo`       | `ProductoList`     | Grid de productos público + "Agregar al carrito"      |
| `/producto/:id`   | `ProductoDetail`   | Ficha de un producto + "Agregar al carrito"           |
| `/carrito`        | `CarritoPage`      | Carrito + checkout (nombre, teléfono, retiro/delivery) |
| `/mis-pedidos`    | `MisPedidosPage`   | Pedidos hechos desde este navegador (solo lectura)     |
| `/admin`          | `AdminPage`        | Login si no hay sesión; si no, pestañas Pedidos/Productos |

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
- **`CI=true` convierte los warnings de ESLint en errores de build.** GitHub
  Actions define esa variable automáticamente, así que un `npm run build`
  local que compila con warnings puede fallar en CI aunque en tu máquina se
  vea bien. Antes de dar por buena una build, probarla con
  `CI=true npm run build` (así es exactamente como corre en el workflow).
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
- **Atomic design solo en `cart/` y `admin/`:** reestructurar todo `components/`
  a atoms/molecules/organisms habría sido invasivo sobre código que ya
  funciona y está desplegado, sin beneficio real para este trabajo. Se aplicó
  la estructura al carrito/checkout y al panel admin (código nuevo, sin
  usuarios dependiendo de su forma actual) para que sirva de referencia de
  cómo escribir el resto del proyecto hacia adelante.
- **Gestión de productos movida a `/admin`:** antes vivía embebida en
  `/catalogo` (mostraba/ocultaba botones según sesión). Se separó en una
  página propia para que `/catalogo` y `ProductoDetail` no necesiten saber
  nada de `isAdmin` (una responsabilidad menos cada uno) y para que la
  gestión de pedidos y productos esté en un solo lugar coherente.
