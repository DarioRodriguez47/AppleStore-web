/**
 * Script de demo guiada para grabar video del sitio.
 *
 * Abre un Chromium VISIBLE (no headless), mueve el cursor de forma suave
 * hacia cada elemento antes de hacer click (en vez de teletransportarlo)
 * y hace pausas entre pasos para que puedas narrar mientras grabas la
 * pantalla con OBS o la herramienta que prefieras.
 *
 * Requisitos (una sola vez):
 *   npm install playwright
 *   npx playwright install chromium
 *
 * Uso:
 *   node record-demo-flow.js                 -> corre contra producción (Vercel)
 *   BASE_URL=http://localhost:3001/AppleStore-web node record-demo-flow.js
 *
 * Variables de ajuste rápido más abajo: PAUSE_MS (pausas entre pasos)
 * y MOVE_MS (duración del movimiento del cursor).
 */

const { chromium } = require("playwright");

const BASE_URL = process.env.BASE_URL || "https://applestore-shop.vercel.app";
const PAUSE_MS = 1800; // pausa entre pasos, para narrar
const MOVE_MS = 600; // duración del movimiento del cursor hacia cada elemento

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mueve el cursor real, en varios pasos intermedios, desde su posición
// actual hasta el centro del elemento indicado, y luego hace click.
async function moveAndClick(page, selector, { index = 0, pause = PAUSE_MS } = {}) {
  const locator = page.locator(selector).nth(index);
  await locator.waitFor({ state: "visible", timeout: 20000 });
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();
  if (!box) throw new Error(`No se pudo ubicar el elemento: ${selector}`);
  const targetX = box.x + box.width / 2;
  const targetY = box.y + box.height / 2;
  const steps = Math.max(10, Math.round(MOVE_MS / 16));
  await page.mouse.move(targetX, targetY, { steps });
  await wait(150);
  await locator.click();
  await wait(pause);
}

async function typeInto(page, selector, text, { pause = 500 } = {}) {
  const locator = page.locator(selector);
  await locator.waitFor({ state: "visible", timeout: 20000 });
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 15 });
  }
  await locator.click();
  await locator.fill("");
  await locator.pressSequentially(text, { delay: 45 });
  await wait(pause);
}

async function log(step) {
  console.log(`\n▶ ${step}`);
}

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 60 });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  // 1. Landing
  await log("Landing page");
  await page.goto(`${BASE_URL}/productos`, { waitUntil: "networkidle" });
  await wait(PAUSE_MS);
  await page.mouse.wheel(0, 600);
  await wait(1200);
  await page.mouse.wheel(0, 600);
  await wait(PAUSE_MS);

  // 2. Catálogo
  await log("Ir al catálogo");
  await moveAndClick(page, 'a:has-text("Tienda")');
  await page.waitForSelector(".product-card", { timeout: 20000 });
  await wait(PAUSE_MS);

  // 3. Vista rápida de producto
  await log("Vista rápida de producto (modal)");
  await moveAndClick(page, ".product-card", { index: 0 });
  await page.waitForSelector(".quick-view-title", { timeout: 20000 });
  await wait(PAUSE_MS);
  await page.keyboard.press("Escape");
  await wait(800);

  // 4. Registro de cliente
  await log("Registro de cliente nuevo");
  await page.goto(`${BASE_URL}/productos`, { waitUntil: "networkidle" });
  await page.waitForSelector("button.nav-login-button", { timeout: 20000 });
  await moveAndClick(page, "button.nav-login-button");
  await page.waitForSelector(".login-overlay", { timeout: 20000 });
  await wait(1000);
  await moveAndClick(page, 'button:has-text("¿No tienes una cuenta?")');
  await page.waitForSelector('input[placeholder="Nombre"]', { timeout: 20000 });

  const email = `demo${Date.now()}@example.com`;
  await typeInto(page, 'input[placeholder="Nombre"]', "Camila Torres");
  await typeInto(page, 'input[placeholder="Correo electrónico"]', email);
  await typeInto(page, 'input[placeholder="Contraseña"]', "clave123");
  await typeInto(page, 'input[placeholder="Confirmar Contraseña"]', "clave123");
  await moveAndClick(page, 'button:has-text("Registrarse")');
  await page.waitForSelector(".nav-session", { timeout: 20000 });
  await wait(PAUSE_MS);

  // 5. Agregar productos al carrito
  await log("Agregar productos al carrito");
  await page.goto(`${BASE_URL}/catalogo`, { waitUntil: "networkidle" });
  await page.waitForSelector(".product-card", { timeout: 20000 });
  await moveAndClick(page, ".add-to-cart-button", { index: 0, pause: 900 });
  await moveAndClick(page, ".add-to-cart-button", { index: 3, pause: 900 });

  // 6. Carrito + checkout
  await log("Carrito y checkout");
  await page.goto(`${BASE_URL}/carrito`, { waitUntil: "networkidle" });
  await page.waitForSelector(".checkout-form", { timeout: 20000 });
  await wait(PAUSE_MS);
  await typeInto(page, '.checkout-form input[type=text]', "Camila Torres");
  await typeInto(page, '.checkout-form input[type=tel]', "0991112233");
  await moveAndClick(page, 'button:has-text("Confirmar pedido")', { pause: 1200 });
  await page.waitForSelector(".order-confirmation", { timeout: 20000 });
  await wait(PAUSE_MS * 2);

  // 7. Mis pedidos
  await log("Mis pedidos (con historial y seguimiento visual)");
  await moveAndClick(page, 'a:has-text("Ver mis pedidos")');
  await page.waitForSelector(".order-card", { timeout: 20000 });
  await wait(PAUSE_MS * 2);

  // 8. Rastreo público (sin sesión)
  await log("Cerrar sesión y rastrear pedido públicamente");
  await page.goto(`${BASE_URL}/productos`, { waitUntil: "networkidle" });
  await moveAndClick(page, 'button.nav-login-button:has-text("Cerrar sesión")');
  await page.waitForSelector('button.nav-login-button:has-text("Iniciar Sesión")', { timeout: 20000 });
  await moveAndClick(page, 'a:has-text("Rastrear pedido")');
  await page.waitForSelector(".track-order-form", { timeout: 20000 });
  await typeInto(page, "#numero-pedido", "600000");
  await typeInto(page, "#telefono-pedido", "0991234567");
  await moveAndClick(page, 'button:has-text("Buscar pedido")', { pause: 1200 });
  await page.waitForSelector(".order-card", { timeout: 20000 });
  await wait(PAUSE_MS * 2);

  // 9. Panel administrativo
  await log("Iniciar sesión como administrador");
  await page.goto(`${BASE_URL}/productos`, { waitUntil: "networkidle" });
  await moveAndClick(page, "button.nav-login-button");
  await page.waitForSelector(".login-overlay", { timeout: 20000 });
  await typeInto(page, 'input[type=email]', "admin@apple.com");
  await typeInto(page, 'input[type=password]', "admin123");
  await moveAndClick(page, "button.primary-button", { pause: 1200 });
  await page.waitForSelector(".orders-table", { timeout: 20000 });
  await wait(PAUSE_MS * 2);

  await log("Gestión de productos en el panel admin");
  await moveAndClick(page, '.admin-tabs button:has-text("Productos")');
  await page.waitForSelector(".products-admin-grid", { timeout: 20000 });
  await wait(PAUSE_MS);
  await moveAndClick(page, ".products-admin-card >> nth=0 >> .admin-edit-button");
  await page.waitForSelector(".products-modal", { timeout: 20000 });
  await wait(PAUSE_MS * 2);
  await page.keyboard.press("Escape");
  await wait(800);

  await log("Cerrar sesión de administrador");
  await moveAndClick(page, "button.nav-login-button", { pause: 1500 });

  await log("Demo terminada. Cerrando navegador en 3 segundos...");
  await wait(3000);
  await browser.close();
})().catch((e) => {
  console.error("FALLÓ:", e);
  process.exit(1);
});
