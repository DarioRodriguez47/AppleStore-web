import { useEffect } from "react";

// Comportamiento estándar de todos los modales de la app (login, quick
// view de producto, formulario de admin): bloquear el scroll del body
// mientras está abierto, cerrar con Escape, y devolver el handler para
// cerrar al hacer click fuera del contenido (en el overlay).
export function useModalDismiss(onClose) {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return handleOverlayClick;
}
