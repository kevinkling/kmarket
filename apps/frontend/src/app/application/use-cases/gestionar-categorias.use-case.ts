import { Injectable } from '@angular/core';
import { Categoria, CategoriaRepository } from '../../domain';

@Injectable({ providedIn: 'root' })
export class GestionarCategoriasUseCase {
  constructor(private categoriaRepo: CategoriaRepository) {}

  async listar(): Promise<Categoria[]> {
    return await this.categoriaRepo.listar();
  }

  async crear(categoria: Omit<Categoria, 'id'>): Promise<Categoria> {
    const id = 'cat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const nuevaCategoria: Categoria = {
      ...categoria,
      id,
    };
    return await this.categoriaRepo.crear(nuevaCategoria);
  }

  async actualizar(categoria: Categoria): Promise<Categoria> {
    return await this.categoriaRepo.actualizar(categoria);
  }

  async eliminar(id: string): Promise<void> {
    await this.categoriaRepo.eliminar(id);
  }
}
