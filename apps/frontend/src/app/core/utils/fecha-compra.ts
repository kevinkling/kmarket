export function textoUltimaCompra(fecha: Date | string | null | undefined): string {
  if (!fecha) return 'Sin compras';
  const date = fecha instanceof Date ? fecha : new Date(fecha);
  if (Number.isNaN(date.getTime())) return 'Sin compras';
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
}
