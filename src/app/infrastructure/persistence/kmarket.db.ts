import Dexie, { Table } from 'dexie';

export interface CategoriaTable {
  id: string;
  nombre: string;
  orden: number;
  activa: boolean;
}

export interface ProductoTable {
  id: string;
  nombre: string;
  categoriaId: string;
  intervaloDias: number;
  activo: boolean;
}

export interface EstadoProductoTable {
  productoId: string;
  ultimaCompra: string | null;
  comprar: boolean;
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
      meta: '&key'
    });
  }
}

export const db = new KMarketDB();
