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
        recogido: false,
      });
      return nuevoEstadoComprar;
    }

    const estadoActual = await this.estadoRepo.obtener(productoId);
    const comprarVal = estadoActual ? !estadoActual.comprar : true;

    await this.estadoRepo.guardar({
      productoId,
      ultimaCompra: estadoActual ? estadoActual.ultimaCompra : null,
      comprar: comprarVal,
      recogido: false,
    });

    return comprarVal;
  }

  async ejecutarRecogido(
    productoId: string,
    recogido: boolean,
    comprar: boolean,
    ultimaCompra?: Date | null,
  ): Promise<void> {
    await this.estadoRepo.guardar({
      productoId,
      ultimaCompra: ultimaCompra ?? null,
      comprar,
      recogido,
    });
  }
}
