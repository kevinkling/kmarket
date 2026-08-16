import Dexie, { Table } from 'dexie';

export interface CategoriaTable {
  id: string;
  nombre: string;
  orden: number;
  activa: boolean;
  updatedAt?: Date;
}

export interface ProductoTable {
  id: string;
  nombre: string;
  categoriaId: string;
  intervaloDias: number;
  activo: boolean;
  updatedAt?: Date;
}

export interface EstadoProductoTable {
  productoId: string;
  ultimaCompra: string | null;
  comprar: boolean;
  updatedAt?: Date;
}

export interface MetaTable {
  key: string;
  value: any;
}

export class KMarketDB extends Dexie {
  categorias!: Table<CategoriaTable, string>;
  productos!: Table<ProductoTable, string>;
  estadosProducto!: Table<EstadoProductoTable, string>;
  meta!: Table<MetaTable, string>;

  constructor() {
    super('KMarketDB');
    this.version(1).stores({
      categorias: '&id, nombre, orden, activa',
      productos: '&id, nombre, categoriaId, intervaloDias, activo',
      estadosProducto: '&productoId, ultimaCompra, comprar',
      meta: '&key',
    });
    this.version(2).stores({
      categorias: '&id, nombre, orden, activa, updatedAt',
      productos: '&id, nombre, categoriaId, intervaloDias, activo, updatedAt',
      estadosProducto: '&productoId, ultimaCompra, comprar, updatedAt',
      meta: '&key',
    }).upgrade((tx) => {
      return tx.table('categorias').toCollection().modify((categoria) => {
        if (!categoria.updatedAt) categoria.updatedAt = new Date();
      }).then(() => {
        return tx.table('productos').toCollection().modify((producto) => {
          if (!producto.updatedAt) producto.updatedAt = new Date();
        });
      }).then(() => {
        return tx.table('estadosProducto').toCollection().modify((estado) => {
          if (!estado.updatedAt) estado.updatedAt = new Date();
        });
      });
    });
  }
}

export const db = new KMarketDB();
