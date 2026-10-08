import { Injectable } from '@angular/core';
import { EstadoProducto, EstadoProductoRepository } from '../../domain';
import { db } from './kmarket.db';

@Injectable({ providedIn: 'root' })
export class DexieEstadoProductoRepository implements EstadoProductoRepository {
  async obtener(productoId: string): Promise<EstadoProducto | null> {
    const record = await db.estadosProducto.get(productoId);
    if (!record) return null;
    return {
      productoId: record.productoId,
      ultimaCompra: record.ultimaCompra ? new Date(record.ultimaCompra) : null,
      comprar: record.comprar,
      recogido: Boolean(record.recogido),
      updatedAt: record.updatedAt,
    };
  }

  async listarTodos(): Promise<EstadoProducto[]> {
    const records = await db.estadosProducto.toArray();
    return records.map((r) => ({
      productoId: r.productoId,
      ultimaCompra: r.ultimaCompra ? new Date(r.ultimaCompra) : null,
      comprar: r.comprar,
      recogido: Boolean(r.recogido),
      updatedAt: r.updatedAt,
    }));
  }

  async guardar(estado: EstadoProducto): Promise<void> {
    await db.estadosProducto.put({
      productoId: estado.productoId,
      ultimaCompra: estado.ultimaCompra ? estado.ultimaCompra.toISOString() : null,
      comprar: estado.comprar,
      recogido: Boolean(estado.recogido),
      updatedAt: new Date(),
    });
  }

  async guardarTodos(estados: EstadoProducto[]): Promise<void> {
    const tableRecords = estados.map((e) => ({
      productoId: e.productoId,
      ultimaCompra: e.ultimaCompra ? e.ultimaCompra.toISOString() : null,
      comprar: e.comprar,
      recogido: Boolean(e.recogido),
      updatedAt: e.updatedAt ?? new Date(),
    }));
    await db.estadosProducto.bulkPut(tableRecords);
  }
}
