export interface EstadoProducto {
  productoId: string;
  ultimaCompra: Date | null;
  comprar: boolean;
  recogido: boolean;
  updatedAt?: Date; // Campo opcional para sincronización
}
