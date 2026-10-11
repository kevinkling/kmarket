import { Injectable } from '@angular/core';
import { Producto, ProductoRepository } from '../../domain';
import { db } from './kmarket.db';

@Injectable({ providedIn: 'root' })
export class DexieProductoRepository implements ProductoRepository {
  async listar(): Promise<Producto[]> {
    const records = await db.productos.toArray();
    return records.map((record) => this.map(record));
  }

  async obtener(id: string): Promise<Producto | null> {
    const record = await db.productos.get(id);
    return record ? this.map(record) : null;
  }

  async listarPorCategoria(categoriaId: string): Promise<Producto[]> {
    const records = await db.productos.where('categoriaId').equals(categoriaId).toArray();
    return records.map((record) => this.map(record));
  }

  private map(record: Producto): Producto {
    return {
      ...record,
      notas: record.notas ?? '',
    };
  }

  async crear(producto: Producto): Promise<Producto> {
    const record = { ...producto, updatedAt: new Date() };
    await db.productos.put(record);
    return record;
  }

  async actualizar(producto: Producto): Promise<Producto> {
    const record = { ...producto, updatedAt: new Date() };
    await db.productos.put(record);
    return record;
  }

  async eliminar(id: string): Promise<void> {
    await db.productos.delete(id);
    await db.estadosProducto.delete(id);
  }

  async activarDesactivar(id: string, activo: boolean): Promise<void> {
    await db.productos.update(id, { activo, updatedAt: new Date() });
  }

  async guardarTodos(productos: Producto[]): Promise<void> {
    const now = new Date();
    await db.productos.bulkPut(productos.map((producto) => ({
      ...producto,
      updatedAt: producto.updatedAt ?? now,
    })));
  }
}
