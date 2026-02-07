// main.js - versión estática que consume ./data/productos.json
(function () {
  const app = document.getElementById("app");
  let productos = [];

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
