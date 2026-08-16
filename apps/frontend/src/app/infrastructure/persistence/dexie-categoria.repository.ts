import { Injectable } from '@angular/core';
import { Categoria, CategoriaRepository } from '../../domain';
import { db } from './kmarket.db';

@Injectable({ providedIn: 'root' })
export class DexieCategoriaRepository implements CategoriaRepository {
  async listar(): Promise<Categoria[]> {
    const records = await db.categorias.toArray();
    return records.sort((a, b) => a.orden - b.orden);
  }

  async obtener(id: string): Promise<Categoria | null> {
    const record = await db.categorias.get(id);
    return record || null;
  }

  async crear(categoria: Categoria): Promise<Categoria> {
    const record = { ...categoria, updatedAt: new Date() };
    await db.categorias.put(record);
    return record;
  }

  async actualizar(categoria: Categoria): Promise<Categoria> {
    const record = { ...categoria, updatedAt: new Date() };
    await db.categorias.put(record);
    return record;
  }

  async eliminar(id: string): Promise<void> {
    await db.categorias.delete(id);
  }

  async guardarTodas(categorias: Categoria[]): Promise<void> {
    const now = new Date();
    await db.categorias.bulkPut(categorias.map((categoria) => ({
      ...categoria,
      updatedAt: categoria.updatedAt ?? now,
    })));
  }
}
