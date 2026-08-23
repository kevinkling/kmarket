import { Injectable } from '@angular/core';
import { EstadoProductoRepository } from '../../domain';

@Injectable({ providedIn: 'root' })
export class AlternarProductoEnCompraUseCase {
  constructor(private estadoRepo: EstadoProductoRepository) {}

  async ejecutar(
    productoId: string,
    nuevoEstadoComprar?: boolean,
    ultimaCompra?: Date | null,
  ): Promise<boolean> {
    // If caller provides the desired value, persist it directly without an extra read.
    if (nuevoEstadoComprar !== undefined) {
      await this.estadoRepo.guardar({
        productoId,
        ultimaCompra: ultimaCompra ?? null,
        comprar: nuevoEstadoComprar,
      });
      return nuevoEstadoComprar;
    }

    const estadoActual = await this.estadoRepo.obtener(productoId);
    const comprarVal = estadoActual ? !estadoActual.comprar : true;

    await this.estadoRepo.guardar({
      productoId,
      ultimaCompra: estadoActual ? estadoActual.ultimaCompra : null,
      comprar: comprarVal,
    });

    return comprarVal;
  }
}
