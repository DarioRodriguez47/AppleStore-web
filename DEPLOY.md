# Deploy a GitHub Pages (static) for `frontend-productos`

Pasos preparados (no ejecutados):

1. Reemplaza `homepage` en `frontend-productos/package.json` por la URL real:

   "homepage": "https://<usuario>.github.io/<repositorio>"

2. Opciones para desplegar:

- Opción A (rápida, desde tu máquina) — usa `gh-pages`:

  ```bash
  # desde la raíz del repo
  cd frontend-productos
  npm install
  npm run deploy
  ```

  Esto creará la carpeta `build` y publicará su contenido en la rama `gh-pages`.

- Opción B (automática, GitHub Actions):

  - Ya añadí un workflow en `.github/workflows/deploy-frontend.yml` que construye `frontend-productos` y publica `frontend-productos/build` a GitHub Pages cuando haces push a `main`.
  - Ya añadí un workflow en `.github/workflows/deploy-frontend.yml` que construye `frontend-productos` y publica `frontend-productos/build` a GitHub Pages cuando haces push a `main`.
  - El workflow usa `peaceiris/actions-gh-pages` y publicará en la rama `gh-pages`. GitHub Pages servirá el sitio desde la rama `gh-pages` por defecto; no necesitas cambiar la configuración manualmente salvo revisar Settings → Pages si quieres otra fuente.

3. Alternativa: usar la carpeta `docs/`.

  - Si prefieres servir desde `docs/` en la rama `main`, copia `docs_static/*` a `docs/` y GitHub Pages servirá desde `main/docs`.

4. Nota sobre rutas y router:
  - Usé `HashRouter` en `frontend-productos/src/index.js` para evitar problemas de rutas en GitHub Pages.
  - Si usas `BrowserRouter`, debes configurar `basename` con `process.env.PUBLIC_URL`.

5. Imágenes y mutaciones:
  - Las operaciones que cambian datos no funcionan en sitio estático. Para imágenes, coloca archivos en `public/uploads` y referencia via `process.env.PUBLIC_URL + '/uploads/...'`.
