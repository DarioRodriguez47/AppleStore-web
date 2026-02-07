## Deploy: preparar `docs/` y publicar en GitHub Pages

He copiado la versión estática que corregimos a la carpeta `docs/`, lista para publicarse como sitio estático.

Opciones para publicar en GitHub Pages:

- Opción A — usar la carpeta `docs/` en la rama `main` (rápido):

  1. Asegúrate de commitear los cambios locales:

     ```bash
     git add docs/ DEPLOY.md
     git commit -m "Deploy: actualizar docs con demo estática y login localStorage"
     git push origin main
     ```

  2. En GitHub: Settings → Pages → Source → Elige `main` branch y carpeta `/docs`.

- Opción B — publicar en `gh-pages` (si prefieres rama separada):

  1. Desde `frontend-productos` configura `homepage` en `package.json`.
  2. Instala `gh-pages` y ejecuta `npm run build` y `npm run deploy`.

Notas:
- El sitio en `docs/` ahora sirve la demo estática (index + `css/main.css`, `js/main.js`, `data/productos.json`).
- Las acciones que requieren backend (registro real, editar productos) no funcionarán—el login es local y usa `localStorage`.

Si quieres, puedo:
- Hacer el `git commit` aquí (necesito confirmación), o
- Crear un workflow de GitHub Actions para publicar automáticamente desde `main/docs` cuando hagas push.
\nTrigger: redeploy forced at 2026-02-07T04:38:30Z
