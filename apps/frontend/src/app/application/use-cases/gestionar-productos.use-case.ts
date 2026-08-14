import { Injectable } from '@angular/core';
import { Producto, ProductoRepository } from '../../domain';

@Injectable({ providedIn: 'root' })
export class GestionarProductosUseCase {
  constructor(private productoRepo: ProductoRepository) {}

  async listar(): Promise<Producto[]> {
    return await this.productoRepo.listar();
  }

  async listarPorCategoria(categoriaId: string): Promise<Producto[]> {
    return await this.productoRepo.listarPorCategoria(categoriaId);
  }

  async crear(producto: Omit<Producto, 'id'>): Promise<Producto> {
    const id = 'prod_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const nuevoProducto: Producto = {
      ...producto,
      id,
    };
    return await this.productoRepo.crear(nuevoProducto);
  }

  async actualizar(producto: Producto): Promise<Producto> {
    return await this.productoRepo.actualizar(producto);
  }

  async eliminar(id: string): Promise<void> {
    await this.productoRepo.eliminar(id);
  }

  async activarDesactivar(id: string, activo: boolean): Promise<void> {
    await this.productoRepo.activarDesactivar(id, activo);
  }
}
