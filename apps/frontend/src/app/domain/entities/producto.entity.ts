export interface Producto {
  id: string;
  nombre: string;
  categoriaId: string;
  notas: string;
  activo: boolean;
  updatedAt?: Date;
}
