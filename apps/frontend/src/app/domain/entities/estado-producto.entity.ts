export interface EstadoProducto {
  productoId: string;
  ultimaCompra: Date | null;
  comprar: boolean;
  updatedAt?: Date; // Campo opcional para sincronización
}
