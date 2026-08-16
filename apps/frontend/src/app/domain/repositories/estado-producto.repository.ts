import { EstadoProducto } from '../entities';

export abstract class EstadoProductoRepository {
  abstract obtener(productoId: string): Promise<EstadoProducto | null>;
  abstract listarTodos(): Promise<EstadoProducto[]>;
  abstract guardar(estado: EstadoProducto): Promise<void>;
  abstract guardarTodos(estados: EstadoProducto[]): Promise<void>;
}
