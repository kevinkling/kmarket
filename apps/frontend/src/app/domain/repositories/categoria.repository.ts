import { Categoria } from '../entities';

export abstract class CategoriaRepository {
  abstract listar(): Promise<Categoria[]>;
  abstract obtener(id: string): Promise<Categoria | null>;
  abstract crear(categoria: Categoria): Promise<Categoria>;
  abstract actualizar(categoria: Categoria): Promise<Categoria>;
  abstract eliminar(id: string): Promise<void>;
  abstract guardarTodas(categorias: Categoria[]): Promise<void>;
}
