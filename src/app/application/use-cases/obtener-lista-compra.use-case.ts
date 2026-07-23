import { Injectable } from '@angular/core';
import {
  Categoria,
  CategoriaRepository,
  EstadoProducto,
  EstadoProductoRepository,
  Producto,
  ProductoRepository,
} from '../../domain';

export interface ProductoConEstado {
  producto: Producto;
  estado: EstadoProducto;
}

export interface CategoriaConProductos {
  categoria: Categoria;
  items: ProductoConEstado[];
}

@Injectable({ providedIn: 'root' })
export class ObtenerListaDeCompraUseCase {
  constructor(
    private categoriaRepo: CategoriaRepository,
    private productoRepo: ProductoRepository,
    private estadoRepo: EstadoProductoRepository
  ) {}

  async obtenerAgrupadoPorCategoria(
    soloSeleccionados: boolean = false
  ): Promise<CategoriaConProductos[]> {
    const categorias = await this.categoriaRepo.listar();
    const categoriasActivas = categorias.filter((c) => c.activa).sort((a, b) => a.orden - b.orden);
    const productos = await this.productoRepo.listar();
    const estados = await this.estadoRepo.listarTodos();

    const estadosMap = new Map<string, EstadoProducto>(
      estados.map((e) => [e.productoId, e])
    );

    const resultado: CategoriaConProductos[] = [];

    for (const cat of categoriasActivas) {
      const productosDeCat = productos.filter((p) => p.categoriaId === cat.id && p.activo);
      const items: ProductoConEstado[] = [];

      for (const prod of productosDeCat) {
        const estado = estadosMap.get(prod.id) || {
          productoId: prod.id,
          ultimaCompra: null,
          comprar: false,
        };

        if (!soloSeleccionados || estado.comprar) {
          items.push({ producto: prod, estado });
        }
      }

      if (items.length > 0 || !soloSeleccionados) {
        resultado.push({ categoria: cat, items });
      }
    }

    return resultado;
  }
}
