export interface Categoria {
  id: string;
  nombre: string;
  orden: number;
  activa: boolean;
  updatedAt?: Date; // Campo opcional para sincronización
}
