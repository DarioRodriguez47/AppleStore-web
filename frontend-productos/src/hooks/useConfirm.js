import { useCallback, useState } from "react";

// Centraliza el patrón "pedir confirmación antes de ejecutar una acción"
// usado en varios lugares de la app (borrar producto, quitar del carrito,
// cerrar sesión, cambiar estado de un pedido, confirmar compra) para no
// repetir el mismo par de estados (pendiente / onConfirm) en cada uno.
export function useConfirm() {
  const [pending, setPending] = useState(null);

  const requestConfirm = useCallback((options, onConfirm) => {
    setPending({ ...options, onConfirm });
  }, []);

  const handleConfirm = useCallback(() => {
    pending?.onConfirm();
    setPending(null);
  }, [pending]);

  const handleCancel = useCallback(() => setPending(null), []);

  return { pending, requestConfirm, handleConfirm, handleCancel };
}
