import { Injectable, NgZone } from '@angular/core';
import { RecordModel, ClientResponseError } from 'pocketbase';
import { AuthService } from '../../core/services/auth.service';
import {
  CategoriaTable,
  EstadoProductoTable,
  ProductoTable,
  db,
} from '../persistence/kmarket.db';
import { pb } from '../pocketbase/pocketbase-client';

@Injectable({ providedIn: 'root' })
export class SyncService {
  private applyingRemote = false;
  private hooksInstalled = false;
  private unsubscribes: Array<() => Promise<void>> = [];

  constructor(
    private authService: AuthService,
    private ngZone: NgZone,
  ) {
    this.authService.currentUser.subscribe((user) => {
      if (user) {
        void this.startSync();
      } else {
        void this.stopSync();
      }
    });

    window.addEventListener('online', () => {
      if (this.authService.isAuthenticated()) {
        void this.startSync();
      }
    });
  }

  private started = false;

  init(): void {
    if (this.authService.isAuthenticated()) {
      void this.startSync();
    }
  }

  private async startSync(): Promise<void> {
    if (!this.authService.isAuthenticated() || !navigator.onLine) {
      return;
    }

    this.installLocalHooks();

    if (this.started) {
      await this.pullChanges();
      await this.pushAllLocal();
      return;
    }

    this.started = true;
    await this.pullChanges();
    await this.pushAllLocal();
    await this.subscribeToRealtime();
  }

  private async stopSync(): Promise<void> {
    this.started = false;
    await this.unsubscribeRealtime();
  }

  private async unsubscribeRealtime(): Promise<void> {
    for (const unsubscribe of this.unsubscribes) {
      try {
        await unsubscribe();
      } catch {
        // ignore
      }
    }
    this.unsubscribes = [];
  }

  private installLocalHooks(): void {
    if (this.hooksInstalled) {
      return;
    }
    this.hooksInstalled = true;

    db.categorias.hook('creating', (_pk, obj) => {
      obj.updatedAt = obj.updatedAt ?? new Date();
      this.queueLocalPush('categorias', () => this.pushCategoria(obj));
    });
    db.categorias.hook('updating', (mods, _pk, obj) => {
      if (this.applyingRemote) {
        return;
      }
      const next = { ...obj, ...(mods as Partial<CategoriaTable>), updatedAt: new Date() };
      this.queueLocalPush('categorias', () => this.pushCategoria(next));
      return { updatedAt: next.updatedAt };
    });
    db.categorias.hook('deleting', (pk) => {
      this.queueLocalPush('categorias', () => this.deleteRemote('categorias', String(pk)));
    });

    db.productos.hook('creating', (_pk, obj) => {
      obj.updatedAt = obj.updatedAt ?? new Date();
      this.queueLocalPush('productos', () => this.pushProducto(obj));
    });
    db.productos.hook('updating', (mods, _pk, obj) => {
      if (this.applyingRemote) {
        return;
      }
      const next = { ...obj, ...(mods as Partial<ProductoTable>), updatedAt: new Date() };
      this.queueLocalPush('productos', () => this.pushProducto(next));
      return { updatedAt: next.updatedAt };
    });
    db.productos.hook('deleting', (pk) => {
      this.queueLocalPush('productos', () => this.deleteRemote('productos', String(pk)));
    });

    db.estadosProducto.hook('creating', (_pk, obj) => {
      obj.updatedAt = obj.updatedAt ?? new Date();
      this.queueLocalPush('estados_producto', () => this.pushEstado(obj));
    });
    db.estadosProducto.hook('updating', (mods, _pk, obj) => {
      if (this.applyingRemote) {
        return;
      }
      const next = { ...obj, ...(mods as Partial<EstadoProductoTable>), updatedAt: new Date() };
      this.queueLocalPush('estados_producto', () => this.pushEstado(next));
      return { updatedAt: next.updatedAt };
    });
    db.estadosProducto.hook('deleting', (pk) => {
      this.queueLocalPush('estados_producto', () => this.deleteRemote('estados_producto', String(pk)));
    });
  }

  private queueLocalPush(label: string, task: () => Promise<void>): void {
    if (this.applyingRemote || !this.authService.isAuthenticated() || !navigator.onLine) {
      return;
    }
    queueMicrotask(() => {
      void task().catch((error) => {
        console.error(`Error al sincronizar ${label}:`, error);
      });
    });
  }

  private async pullChanges(): Promise<void> {
    try {
      const [categorias, productos, estados] = await Promise.all([
        pb.collection('categorias').getFullList(),
        pb.collection('productos').getFullList(),
        pb.collection('estados_producto').getFullList(),
      ]);

      this.applyingRemote = true;
      try {
        await this.mergeCategorias(categorias);
        await this.mergeProductos(productos);
        await this.mergeEstados(estados);
      } finally {
        this.applyingRemote = false;
      }
    } catch (error) {
      console.error('Error durante el pull de PocketBase:', error);
    }
  }

  private async pushAllLocal(): Promise<void> {
    const [categorias, productos, estados] = await Promise.all([
      db.categorias.toArray(),
      db.productos.toArray(),
      db.estadosProducto.toArray(),
    ]);

    for (const categoria of categorias) {
      await this.pushCategoria(categoria);
    }
    for (const producto of productos) {
      await this.pushProducto(producto);
    }
    for (const estado of estados) {
      await this.pushEstado(estado);
    }
  }

  private async subscribeToRealtime(): Promise<void> {
    await this.unsubscribeRealtime();

    const collections = ['categorias', 'productos', 'estados_producto'] as const;
    for (const collection of collections) {
      const unsubscribe = await pb.collection(collection).subscribe('*', (event) => {
        this.ngZone.run(() => {
          void this.handleRealtime(collection, event.action, event.record);
        });
      });
      this.unsubscribes.push(unsubscribe);
    }
  }

  private async handleRealtime(
    collection: 'categorias' | 'productos' | 'estados_producto',
    action: string,
    record: RecordModel,
  ): Promise<void> {
    this.applyingRemote = true;
    try {
      if (action === 'delete') {
        if (collection === 'estados_producto') {
          await db.estadosProducto.delete(record.id);
        } else if (collection === 'categorias') {
          await db.categorias.delete(record.id);
        } else {
          await db.productos.delete(record.id);
        }
        return;
      }

      if (collection === 'categorias') {
        await this.mergeCategorias([record]);
      } else if (collection === 'productos') {
        await this.mergeProductos([record]);
      } else {
        await this.mergeEstados([record]);
      }
    } finally {
      this.applyingRemote = false;
    }
  }

  private async mergeCategorias(records: RecordModel[]): Promise<void> {
    for (const record of records) {
      const mapped = this.mapCategoria(record);
      const local = await db.categorias.get(mapped.id);
        if (!local || this.isRemoteNewer(String(record['updated'] ?? ''), local.updatedAt)) {
        await db.categorias.put(mapped);
      }
    }
  }

  private async mergeProductos(records: RecordModel[]): Promise<void> {
    for (const record of records) {
      const mapped = this.mapProducto(record);
      const local = await db.productos.get(mapped.id);
        if (!local || this.isRemoteNewer(String(record['updated'] ?? ''), local.updatedAt)) {
        await db.productos.put(mapped);
      }
    }
  }

  private async mergeEstados(records: RecordModel[]): Promise<void> {
    for (const record of records) {
      const mapped = this.mapEstado(record);
      const local = await db.estadosProducto.get(mapped.productoId);
        if (!local || this.isRemoteNewer(String(record['updated'] ?? ''), local.updatedAt)) {
        await db.estadosProducto.put(mapped);
      }
    }
  }

  private isRemoteNewer(remoteUpdated: string, localUpdated?: Date): boolean {
    if (!localUpdated) {
      return true;
    }
    return new Date(remoteUpdated).getTime() >= localUpdated.getTime();
  }

  private mapCategoria(record: RecordModel): CategoriaTable {
    return {
      id: record.id,
      nombre: String(record['nombre'] ?? ''),
      orden: Number(record['orden'] ?? 0),
      activa: Boolean(record['activa']),
      updatedAt: new Date(String(record['updated'] ?? Date.now())),
    };
  }

  private mapProducto(record: RecordModel): ProductoTable {
    return {
      id: record.id,
      nombre: String(record['nombre'] ?? ''),
      categoriaId: String(record['categoriaId'] ?? ''),
      intervaloDias: Number(record['intervaloDias'] ?? 0),
      activo: Boolean(record['activo']),
      updatedAt: new Date(String(record['updated'] ?? Date.now())),
    };
  }

  private mapEstado(record: RecordModel): EstadoProductoTable {
    const productoId = String(record['productoId'] || record.id);
    const ultimaCompra = record['ultimaCompra'] ? String(record['ultimaCompra']) : null;
    return {
      productoId,
      ultimaCompra,
      comprar: Boolean(record['comprar']),
      updatedAt: new Date(String(record['updated'] ?? Date.now())),
    };
  }

  private async pushCategoria(categoria: CategoriaTable): Promise<void> {
    await this.upsert('categorias', categoria.id, {
      nombre: categoria.nombre,
      orden: categoria.orden,
      activa: categoria.activa,
    });
  }

  private async pushProducto(producto: ProductoTable): Promise<void> {
    await this.upsert('productos', producto.id, {
      nombre: producto.nombre,
      categoriaId: producto.categoriaId,
      intervaloDias: producto.intervaloDias,
      activo: producto.activo,
    });
  }

  private async pushEstado(estado: EstadoProductoTable): Promise<void> {
    await this.upsert('estados_producto', estado.productoId, {
      productoId: estado.productoId,
      ultimaCompra: estado.ultimaCompra,
      comprar: estado.comprar,
    });
  }

  private async upsert(collection: string, id: string, body: Record<string, unknown>): Promise<void> {
    try {
      await pb.collection(collection).update(id, body);
    } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
        await pb.collection(collection).create({ id, ...body });
        return;
      }
      throw error;
    }
  }

  private async deleteRemote(collection: string, id: string): Promise<void> {
    try {
      await pb.collection(collection).delete(id);
    } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
        return;
      }
      throw error;
    }
  }
}
