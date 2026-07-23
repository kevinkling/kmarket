import { Injectable } from '@angular/core';
import { Producto, ProductoRepository } from '../../domain';
import { db } from './kmarket.db';

@Injectable({ providedIn: 'root' })
export class DexieProductoRepository implements ProductoRepository {
  async listar(): Promise<Producto[]> {
    return await db.productos.toArray();
  }

  async obtener(id: string): Promise<Producto | null> {
    const record = await db.productos.get(id);
    return record || null;
  }

  async listarPorCategoria(categoriaId: string): Promise<Producto[]> {
    return await db.productos.where('categoriaId').equals(categoriaId).toArray();
  }

  async crear(producto: Producto): Promise<Producto> {
    await db.productos.put(producto);
    return producto;
  }

  async actualizar(producto: Producto): Promise<Producto> {
    await db.productos.put(producto);
    return producto;
  }

  async eliminar(id: string): Promise<void> {
    await db.productos.delete(id);
    await db.estadosProducto.delete(id);
  }

  async activarDesactivar(id: string, activo: boolean): Promise<void> {
    await db.productos.update(id, { activo });
  }

  async guardarTodos(productos: Producto[]): Promise<void> {
    await db.productos.bulkPut(productos);
  }
}
