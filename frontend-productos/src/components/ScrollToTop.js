import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// React Router no resetea el scroll al navegar entre rutas (a diferencia de
// un sitio tradicional) — sin esto, ir de /productos (scrolleado hasta
// abajo) a /catalogo te deja en esa misma posición en la página nueva.
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
