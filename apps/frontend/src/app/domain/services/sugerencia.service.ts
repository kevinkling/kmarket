import { EstadoProducto, Producto } from '../entities';

export function debeSugerirse(
  producto: Producto,
  estado: EstadoProducto | null,
  fechaActual: Date = new Date()
): boolean {
  if (!producto.activo) {
    return false;
  }
  if (!estado || !estado.ultimaCompra) {
    return true;
  }
  const diffMs = fechaActual.getTime() - new Date(estado.ultimaCompra).getTime();
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDias >= producto.intervaloDias;
}
