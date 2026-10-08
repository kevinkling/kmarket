import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Producto } from '../../../domain';

export interface AgregarProductoCompraSheetData {
  productosDisponibles: Producto[];
  nombreCategoria: (categoriaId: string) => string;
}

export type AgregarProductoCompraResultado =
  | { accion: 'agregar'; producto: Producto }
  | { accion: 'crear' };

@Component({
  selector: 'app-agregar-producto-compra-sheet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  template: `
    <div class="km-sheet-form">
      <div class="km-sheet-header">
        <h2 class="font-serif km-sheet-title">Agregar producto</h2>
        <p class="km-sheet-subtitle">
          Sumá uno que ya exista o creá uno nuevo para esta compra.
        </p>
      </div>

      <div class="km-sheet-body">
        <mat-form-field appearance="outline" subscriptSizing="dynamic" class="full-width">
          <mat-label>Buscar producto</mat-label>
          <input
            matInput
            [(ngModel)]="busqueda"
            placeholder="Ej: Arroz, Jabón"
            autocomplete="off"
          />
        </mat-form-field>

        <ul class="resultados" *ngIf="filtrados.length > 0">
          <li *ngFor="let prod of filtrados">
            <button type="button" class="resultado" (click)="agregar(prod)">
              <span class="resultado-nombre">{{ prod.nombre }}</span>
              <span class="resultado-cat">{{ data.nombreCategoria(prod.categoriaId) }}</span>
            </button>
          </li>
        </ul>

        <p class="sin-resultados" *ngIf="busqueda.trim() && filtrados.length === 0">
          No hay productos disponibles con ese nombre.
        </p>

        <div class="km-sheet-actions">
          <button type="button" mat-stroked-button class="km-btn-secondary km-flex-1" (click)="cancelar()">
            Cancelar
          </button>
          <button type="button" mat-flat-button class="km-btn-primary km-flex-1" (click)="crear()">
            Crear producto
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .full-width {
      display: block;
      width: 100%;
    }
    .resultados {
      list-style: none;
      margin: 0 0 8px;
      padding: 0;
      max-height: 240px;
      overflow-y: auto;
      border: var(--km-border);
      border-radius: 6px;
    }
    .resultado {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
      width: 100%;
      margin: 0;
      padding: 12px 14px;
      border: 0;
      border-bottom: 1px solid var(--km-border-color);
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: left;
      cursor: pointer;
    }
    .resultados li:last-child .resultado {
      border-bottom: none;
    }
    .resultado:hover,
    .resultado:focus-visible {
      background: var(--km-bg-canvas);
    }
    .resultado-nombre {
      font-weight: 600;
    }
    .resultado-cat,
    .sin-resultados {
      font-size: 0.8rem;
      color: var(--km-text-secondary);
    }
    .sin-resultados {
      margin: 0 0 8px;
    }
  `],
})
export class AgregarProductoCompraSheetComponent {
  busqueda = '';

  constructor(
    private sheetRef: MatBottomSheetRef<AgregarProductoCompraSheetComponent, AgregarProductoCompraResultado>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: AgregarProductoCompraSheetData,
  ) {}

  get filtrados(): Producto[] {
    const q = this.busqueda.toLowerCase().trim();
    const lista = this.data.productosDisponibles;
    if (!q) {
      return lista.slice(0, 8);
    }
    return lista.filter((p) => p.nombre.toLowerCase().includes(q)).slice(0, 8);
  }

  agregar(producto: Producto): void {
    this.sheetRef.dismiss({ accion: 'agregar', producto });
  }

  crear(): void {
    this.sheetRef.dismiss({ accion: 'crear' });
  }

  cancelar(): void {
    this.sheetRef.dismiss();
  }
}
