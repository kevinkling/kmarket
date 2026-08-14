import { Injectable } from '@angular/core';
import { EstadoProductoRepository } from '../../domain';

@Injectable({ providedIn: 'root' })
export class AlternarProductoEnCompraUseCase {
  constructor(private estadoRepo: EstadoProductoRepository) {}

  async ejecutar(productoId: string, nuevoEstadoComprar?: boolean): Promise<boolean> {
    const estadoActual = await this.estadoRepo.obtener(productoId);
    const comprarVal =
      nuevoEstadoComprar !== undefined
        ? nuevoEstadoComprar
        : estadoActual
        ? !estadoActual.comprar
        : true;

    await this.estadoRepo.guardar({
      productoId,
      ultimaCompra: estadoActual ? estadoActual.ultimaCompra : null,
      comprar: comprarVal,
    });

    return comprarVal;
  }
}
