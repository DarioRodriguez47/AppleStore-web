# Apple Catalog Manager

Demo pública:
- GitHub Pages: **https://DarioRodriguez47.github.io/AppleStore-web/**
- Vercel: **https://frontend-productos-one.vercel.app**

Este proyecto es una aplicación web dividida en dos partes principales:

- **backend/**: API REST con Node.js, Express y MongoDB para la gestión de productos Apple y autenticación de usuarios. No está desplegado; queda disponible para desarrollo local o para una futura versión full-stack.
- **frontend-productos/**: SPA en React. Es lo único que se despliega: corre como sitio estático (catálogo en JSON + `localStorage` para simular altas/ediciones/borrados, login, carrito y pedidos), así que funciona sin necesitar el backend arriba.

El despliegue a GitHub Pages es automático vía GitHub Actions en cada push a `main` (ver `.github/workflows/deploy.yml`). El de Vercel se hace a mano con `vercel --prod` desde `frontend-productos/` (no está conectado al repo de GitHub).

### Qué incluye la demo

- Catálogo público con carrito de compra y checkout (nombre, teléfono, retiro en tienda o delivery) — comprar requiere iniciar sesión o registrarse.
- `/mis-pedidos`: historial de pedidos de la cuenta logueada.
- `/rastrear-pedido`: buscar el estado de un pedido por número + teléfono, sin necesitar cuenta.
- Panel administrativo en `/admin` (o el enlace "Admin" del footer) para gestionar pedidos y productos — cuenta de administrador: `admin@apple.com` / `admin123`.

La interfaz está pensada para verse y comportarse como un sitio real (nada
dice "demo" ni muestra la credencial de admin en pantalla) — por eso esa
cuenta solo queda documentada acá y en [ARCHITECTURE.md](ARCHITECTURE.md), no
en la propia app.

Para entender cómo están organizadas las capas, el flujo de datos y las decisiones de diseño, ver **[ARCHITECTURE.md](ARCHITECTURE.md)**.

## Estructura del proyecto

```
AppleWebSide/
  backend/
    app.js
    index.js
    package.json
    controllers/
    models/
    routes/
    uploads/
  frontend-productos/
    src/
    public/
    package.json
    README.md
```

---

# Cómo levantar el proyecto

## Backend

1. Instala las dependencias:
   ```bash
   cd backend
   npm install
   ```
2. (Opcional) Crea un archivo `.env` para tus variables de entorno (por ejemplo, cadena de conexión a MongoDB).
3. Inicia el servidor:
   ```bash
   npm start
   ```
   El backend estará disponible en `http://localhost:3001` (o el puerto configurado).

## Frontend

1. Instala las dependencias:
   ```bash
   cd frontend-productos
   npm install
   ```
2. Inicia la aplicación:
   ```bash
   npm start
   ```
   El frontend estará disponible en `http://localhost:3000`.

---

# Levantar ambos entornos

1. Abre dos terminales.
2. En una, ejecuta el backend:
   ```bash
   cd backend
   npm start
   ```
3. En otra, ejecuta el frontend:
   ```bash
   cd frontend-productos
   npm start
   ```

¡Listo! Ahora puedes desarrollar y probar la aplicación completa.

---

## Licencia

[MIT](LICENSE)
