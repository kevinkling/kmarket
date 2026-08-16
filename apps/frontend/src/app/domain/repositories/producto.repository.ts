import { Producto } from '../entities';

export abstract class ProductoRepository {
  abstract listar(): Promise<Producto[]>;
  abstract obtener(id: string): Promise<Producto | null>;
  abstract listarPorCategoria(categoriaId: string): Promise<Producto[]>;
  abstract crear(producto: Producto): Promise<Producto>;
  abstract actualizar(producto: Producto): Promise<Producto>;
  abstract eliminar(id: string): Promise<void>;
  abstract activarDesactivar(id: string, activo: boolean): Promise<void>;
  abstract guardarTodos(productos: Producto[]): Promise<void>;
}
