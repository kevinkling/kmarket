import { Injectable } from '@angular/core';
import {
  EstadoProducto,
  EstadoProductoRepository,
  ProductoRepository,
  debeSugerirse,
} from '../../domain';

@Injectable({ providedIn: 'root' })
export class ObtenerSugerenciasUseCase {
  constructor(
    private productoRepo: ProductoRepository,
    private estadoRepo: EstadoProductoRepository
  ) {}

  async obtenerConteo(fechaActual: Date = new Date()): Promise<number> {
    const productos = await this.productoRepo.listar();
    const productosActivos = productos.filter((p) => p.activo);
    const estados = await this.estadoRepo.listarTodos();
    const estadosMap = new Map<string, EstadoProducto>(estados.map((e) => [e.productoId, e]));

    let count = 0;
    for (const prod of productosActivos) {
      const estado = estadosMap.get(prod.id) || null;
      if (debeSugerirse(prod, estado, fechaActual)) {
        count++;
      }
    }
    return count;
  }
}
