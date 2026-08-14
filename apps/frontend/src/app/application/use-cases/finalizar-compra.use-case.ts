import { Injectable } from '@angular/core';
import { EstadoProducto, EstadoProductoRepository } from '../../domain';

@Injectable({ providedIn: 'root' })
export class FinalizarCompraUseCase {
  constructor(private estadoRepo: EstadoProductoRepository) {}

  async ejecutar(fechaActual: Date = new Date()): Promise<number> {
    const estados = await this.estadoRepo.listarTodos();
    const comprados = estados.filter((e) => e.comprar);

    const actualizados: EstadoProducto[] = comprados.map((e) => ({
      productoId: e.productoId,
      ultimaCompra: fechaActual,
      comprar: false,
    }));

    if (actualizados.length > 0) {
      await this.estadoRepo.guardarTodos(actualizados);
    }

    return actualizados.length;
  }
}
