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

    const categoriasMap = new Map<string, number>();

    const categorias: Categoria[] = CATEGORIAS_SEED.map((c) => {
      categoriasMap.set(c.id, c.intervaloPorDefecto);
      return {
        id: c.id,
        nombre: c.nombre,
        orden: c.orden,
        activa: true,
      };
    });

    const productos: Producto[] = PRODUCTOS_SEED.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      categoriaId: p.categoria,
      intervaloDias: categoriasMap.get(p.categoria) ?? 30,
      activo: true,
    }));

    const estados: EstadoProducto[] = PRODUCTOS_SEED.map((p) => ({
      productoId: p.id,
      ultimaCompra: null,
      comprar: false,
    }));

    await this.categoriaRepo.guardarTodas(categorias);
    await this.productoRepo.guardarTodos(productos);
    await this.estadoRepo.guardarTodos(estados);
    await this.seedMetaRepo.marcarImportado();

    return true;
  }
}
