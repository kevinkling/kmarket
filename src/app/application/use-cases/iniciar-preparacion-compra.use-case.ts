import { Injectable } from '@angular/core';
import {
  EstadoProducto,
  EstadoProductoRepository,
  ProductoRepository,
  debeSugerirse,
} from '../../domain';

export interface ResumenPreparacion {
  totalSugeridos: number;
  totalProductosActivos: number;
}

@Injectable({ providedIn: 'root' })
export class IniciarPreparacionDeCompraUseCase {
  constructor(
    private productoRepo: ProductoRepository,
    private estadoRepo: EstadoProductoRepository
  ) {}

  async ejecutar(fechaActual: Date = new Date()): Promise<ResumenPreparacion> {
    const productos = await this.productoRepo.listar();
    const productosActivos = productos.filter((p) => p.activo);
    const estados = await this.estadoRepo.listarTodos();
    const estadosMap = new Map<string, EstadoProducto>(estados.map((e) => [e.productoId, e]));

    let totalSugeridos = 0;
    const nuevosEstados: EstadoProducto[] = [];

    for (const prod of productosActivos) {
      const estadoActual = estadosMap.get(prod.id) || null;
      const esSugerido = debeSugerirse(prod, estadoActual, fechaActual);

      if (esSugerido) {
        totalSugeridos++;
      }

      nuevosEstados.push({
        productoId: prod.id,
        ultimaCompra: estadoActual ? estadoActual.ultimaCompra : null,
        comprar: esSugerido,
      });
    }

    await this.estadoRepo.guardarTodos(nuevosEstados);

    return {
      totalSugeridos,
      totalProductosActivos: productosActivos.length,
    };
  }
}
