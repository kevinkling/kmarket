import { Injectable } from '@angular/core';
import {
  Categoria,
  CategoriaRepository,
  EstadoProducto,
  EstadoProductoRepository,
  Producto,
  ProductoRepository,
  SeedMetaRepository,
} from '../../domain';
import { CATEGORIAS_SEED, PRODUCTOS_SEED } from '../../infrastructure/seed/seed-data';

@Injectable({ providedIn: 'root' })
export class ImportarSeedInicialUseCase {
  constructor(
    private seedMetaRepo: SeedMetaRepository,
    private categoriaRepo: CategoriaRepository,
    private productoRepo: ProductoRepository,
    private estadoRepo: EstadoProductoRepository
  ) {}

  async ejecutar(): Promise<boolean> {
    const yaImportado = await this.seedMetaRepo.fueImportado();
    if (yaImportado) {
      return false;
    }

    const importadoEn = new Date();
    const categorias: Categoria[] = CATEGORIAS_SEED.map((c) => ({
      id: c.id,
      nombre: c.nombre,
      orden: c.orden,
      activa: true,
      updatedAt: importadoEn,
    }));

    const productos: Producto[] = PRODUCTOS_SEED.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      categoriaId: p.categoria,
      notas: '',
      activo: true,
      updatedAt: importadoEn,
    }));

    const estados: EstadoProducto[] = PRODUCTOS_SEED.map((p) => ({
      productoId: p.id,
      ultimaCompra: null,
      comprar: false,
      recogido: false,
      updatedAt: importadoEn,
    }));

    await this.categoriaRepo.guardarTodas(categorias);
    await this.productoRepo.guardarTodos(productos);
    await this.estadoRepo.guardarTodos(estados);
    await this.seedMetaRepo.marcarImportado(importadoEn);

    return true;
  }
}
