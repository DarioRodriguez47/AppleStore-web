// Copia de dist/js/main.js
(function () {
  const app = document.getElementById("app");
  let productos = [];
  const STORAGE_KEY = "static_demo_user";
  let currentUser = null;

  function loadUserFromStorage() {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s) currentUser = JSON.parse(s);
    } catch (e) {
      currentUser = null;
    }
  }

  async function loadData() {
    try {
      const res = await fetch("./data/productos.json");
      productos = await res.json();
    } catch (e) {
      productos = [];
      console.error("No se pudo cargar data:", e);
    }
  }

  function renderList() {
    document.title = "Productos";
    renderHeader();
    const html = [];
    html.push("<section>");
    html.push("<h2>Lista de Productos</h2>");
    html.push('<ul class="product-list">');
    productos.forEach((p) => {
      html.push(`<li class="product-item" data-id="${p._id}">`);
      html.push(
        `<div class="product-info"><span class="product-name">${escapeHtml(p.nombre)}</span><span class="product-description">${escapeHtml(p.descripcion)}</span></div>`,
      );
      html.push("</li>");
    });
    html.push("</ul>");
    html.push("</section>");
    app.innerHTML = html.join("");
    document.querySelectorAll(".product-item").forEach((el) => {
      el.addEventListener("click", () => {
        const id = el.getAttribute("data-id");
        location.hash = "#/producto/" + id;
      });
    });
  }

  function renderHeader() {
    const headerEl = document.querySelector("header");
    if (!headerEl) return;
    const username = currentUser && currentUser.username;
    headerEl.innerHTML = "<h1>Apple Products (Static)</h1>";
    let right = document.createElement("div");
    right.className = "header-login-area";
    if (username) {
      right.innerHTML = `<span class=\"user-badge\">Usuario: ${escapeHtml(username)}</span> <button id=\"logout-btn\">Salir</button>`;
    } else {
      right.innerHTML = `<button id=\"login-btn\">Iniciar sesión</button>`;
    }
    // replace existing right area
    // remove any previous area
    const prev = headerEl.querySelector('.header-login-area');
    if (prev) prev.remove();
    headerEl.appendChild(right);
    const btnLogin = document.getElementById("login-btn");
    if (btnLogin) btnLogin.addEventListener("click", showLoginModal);
    const btnLogout = document.getElementById("logout-btn");
    if (btnLogout) btnLogout.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      currentUser = null;
      renderHeader();
      alert('Sesión cerrada');
    });
  }

  function showLoginModal() {
    // if already present, don't duplicate
    if (document.querySelector('.login-overlay')) return;
    const overlay = document.createElement('div');
    overlay.className = 'login-overlay';
    overlay.innerHTML = `
      <div class="login-container">
        <button class="login-close-small" aria-label="Cerrar">×</button>
        <h3>Iniciar Sesión</h3>
        <div class="row">
          <input type="text" id="login-username" placeholder="Usuario" />
        </div>
        <div class="row">
          <input type="password" id="login-password" placeholder="Contraseña" />
        </div>
        <div class="actions">
          <button id="login-submit">Ingresar</button>
          <button id="login-cancel" style="background:#666">Cancelar</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    // focus
    setTimeout(()=>{ const u=document.getElementById('login-username'); if(u)u.focus(); },50);

    function close() { overlay.remove(); }
    overlay.querySelector('.login-close-small').addEventListener('click', close);
    overlay.querySelector('#login-cancel').addEventListener('click', close);
    overlay.addEventListener('click', (e)=>{ if(e.target===overlay) close(); });
    overlay.querySelector('#login-submit').addEventListener('click', ()=>{
      const u = document.getElementById('login-username').value.trim();
      const p = document.getElementById('login-password').value;
      if (!u || !p) { alert('Ingrese usuario y contraseña'); return; }
      // store minimal user in localStorage
      currentUser = { username: u };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser)); } catch(e){}
      close();
      renderHeader();
      alert('Sesión iniciada como: ' + u);
    });
    // allow enter key to submit
    overlay.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); overlay.querySelector('#login-submit').click(); } });
  }

  function renderDetail(id) {
    const p = productos.find((x) => x._id == id);
    if (!p) {
      app.innerHTML =
        '<p>Producto no encontrado</p><a class="back-button" href="#/">Volver</a>';
      return;
    }
    document.title = p.nombre;
    const html = [];
    html.push('<article class="detail-container">');
    html.push(`<h2>${escapeHtml(p.nombre)}</h2>`);
    html.push(`<p>${escapeHtml(p.descripcion)}</p>`);
    html.push(`<p>Edición: ${escapeHtml(p.edicion || "")}</p>`);
    html.push(`<p>Año: ${escapeHtml(p.anio || "")}</p>`);
    html.push(`<p>Precio: $${escapeHtml(p.precio || "")}</p>`);
    html.push('<a class="back-button" href="#/">Volver al listado</a>');
    html.push("</article>");
    app.innerHTML = html.join("");
  }

  function router() {
    const hash = location.hash || "#/";
    const parts = hash.replace(/^#\/?/, "").split("/");
    if (parts[0] === "producto" && parts[1]) {
      renderDetail(parts[1]);
    } else {
      renderList();
    }
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str).replace(/[&<>"']/g, function (m) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[m];
    });
  }

  // inicio
  loadData().then(() => {
    window.addEventListener("hashchange", router);
    router();
  });
})();
