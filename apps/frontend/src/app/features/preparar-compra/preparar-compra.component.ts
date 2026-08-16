import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  AlternarProductoEnCompraUseCase,
  CategoriaConProductos,
  FinalizarCompraUseCase,
  ObtenerListaDeCompraUseCase,
  ProductoConEstado,
} from '../../application';

export type ModoVista = 'resumen' | 'recorrido' | 'revision';

@Component({
  selector: 'app-preparar-compra',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="preparar-wrapper">
      <!-- Top Wizard Header -->
      <header class="wizard-header">
        <div class="wizard-header-content">
          <button mat-icon-button (click)="salir()" aria-label="Salir">
            <mat-icon>close</mat-icon>
          </button>
          <div class="wizard-title font-serif">
            <span *ngIf="modo === 'resumen'">Preparar compra</span>
            <span *ngIf="modo === 'recorrido'">Recorrido por categoría</span>
            <span *ngIf="modo === 'revision'">Revisión final</span>
          </div>
          <div style="width: 40px;"></div>
        </div>

        <!-- Progress bar during category recorrido -->
        <mat-progress-bar
          *ngIf="modo === 'recorrido' && categorias.length > 0"
          mode="determinate"
          [value]="progresoPorcentaje"
          class="wizard-progress"
        ></mat-progress-bar>
      </header>

      <!-- Main Content Area -->
      <main class="wizard-body km-container">
        <!-- VISTA 1: RESUMEN INICIAL -->
        <div *ngIf="modo === 'resumen'" class="view-step fade-in">
          <div class="step-card km-card">
            <div class="step-icon">
              <mat-icon>checklist_rtl</mat-icon>
            </div>
            <h2 class="font-serif step-title">¿Listo para la compra?</h2>
            <p class="step-desc">
              Recorrerás tu despensa categoría por categoría para marcar únicamente los productos que faltan.
            </p>

            <div class="summary-box">
              <div class="summary-item">
                <span class="summary-label">Categorías a revisar</span>
                <span class="summary-value">{{ categorias.length }}</span>
              </div>
              <div class="km-divider"></div>
              <div class="summary-item">
                <span class="summary-label">Sugeridos automáticamente</span>
                <span class="summary-value highlight">{{ totalSugeridos }}</span>
              </div>
            </div>

            <div class="step-actions">
              <button
                mat-flat-button
                class="km-btn-primary full-width"
                (click)="comenzarRecorrido()"
              >
                Comenzar recorrido
                <mat-icon>arrow_forward</mat-icon>
              </button>
              <button
                mat-stroked-button
                class="km-btn-secondary full-width"
                (click)="irARevision()"
              >
                Ir directo a revisión ({{ totalSeleccionados }})
              </button>
            </div>
          </div>
        </div>

        <!-- VISTA 2: RECORRIDO POR CATEGORÍA -->
        <div *ngIf="modo === 'recorrido' && categoriaActual" class="view-step fade-in">
          <div class="category-header">
            <div class="category-meta">
              <span class="km-badge km-badge-gray">
                Categoría {{ indiceCategoria + 1 }} de {{ categorias.length }}
              </span>
              <span class="selected-count">
                {{ marcadosEnCategoriaActual }} de {{ categoriaActual.items.length }} marcados
              </span>
            </div>
            <h1 class="category-title font-serif">{{ categoriaActual.categoria.nombre }}</h1>
          </div>

          <div class="km-card list-card">
            <div
              *ngFor="let item of categoriaActual.items"
              class="km-list-item"
              [class.is-selected]="item.estado.comprar"
              (click)="toggleProducto(item)"
            >
              <div class="item-info">
                <span class="item-name">{{ item.producto.nombre }}</span>
                <span class="km-badge km-badge-yellow" *ngIf="item.estado.comprar && !item.estado.ultimaCompra">
                  Nuevo / Sin compra
                </span>
              </div>
              <mat-checkbox
                [checked]="item.estado.comprar"
                (click)="$event.stopPropagation()"
                (change)="toggleProducto(item)"
              ></mat-checkbox>
            </div>

            <div *ngIf="categoriaActual.items.length === 0" class="empty-cat">
              No hay productos activos en esta categoría.
            </div>
          </div>
        </div>

        <!-- VISTA 3: REVISIÓN FINAL -->
        <div *ngIf="modo === 'revision'" class="view-step fade-in">
          <div class="revision-header">
            <h1 class="font-serif revision-title">Resumen de compra</h1>
            <p class="revision-desc">
              Revisa los {{ totalSeleccionados }} productos seleccionados antes de finalizar.
            </p>
          </div>

          <div class="revision-content">
            <div
              *ngFor="let catGroup of categoriasConSeleccionados"
              class="revision-group km-card"
            >
              <div class="group-title font-serif">{{ catGroup.categoria.nombre }}</div>
              <div class="km-divider"></div>

              <div
                *ngFor="let item of catGroup.items"
                class="km-list-item"
                [class.is-selected]="item.estado.comprar"
                (click)="toggleProducto(item)"
              >
                <span class="item-name">{{ item.producto.nombre }}</span>
                <mat-checkbox
                  [checked]="item.estado.comprar"
                  (click)="$event.stopPropagation()"
                  (change)="toggleProducto(item)"
                ></mat-checkbox>
              </div>
            </div>

            <div *ngIf="totalSeleccionados === 0" class="empty-revision km-card">
              <mat-icon style="font-size: 36px; width: 36px; height: 36px; color: var(--km-text-muted);">remove_shopping_cart</mat-icon>
              <p>No has seleccionado ningún producto para comprar.</p>
              <button mat-stroked-button class="km-btn-secondary" (click)="modo = 'recorrido'">
                Volver al recorrido
              </button>
            </div>
          </div>
        </div>
      </main>

      <!-- Wizard Bottom Navigation -->
      <footer class="wizard-footer" *ngIf="modo === 'recorrido' || modo === 'revision'">
        <div class="footer-container km-container">
          <ng-container *ngIf="modo === 'recorrido'">
            <button
              mat-stroked-button
              class="km-btn-secondary nav-btn"
              [disabled]="indiceCategoria === 0"
              (click)="anteriorCategoria()"
            >
              <mat-icon>chevron_left</mat-icon>
              Anterior
            </button>

            <button
              mat-flat-button
              class="km-btn-primary nav-btn"
              (click)="siguienteCategoria()"
            >
              {{ esUltimaCategoria ? 'Ver revisión (' + totalSeleccionados + ')' : 'Siguiente' }}
              <mat-icon>chevron_right</mat-icon>
            </button>
          </ng-container>

          <ng-container *ngIf="modo === 'revision'">
            <button
              mat-stroked-button
              class="km-btn-secondary nav-btn"
              (click)="modo = 'recorrido'"
            >
              <mat-icon>edit</mat-icon>
              Modificar
            </button>

            <button
              mat-flat-button
              class="km-btn-primary nav-btn"
              [disabled]="totalSeleccionados === 0 || procesando"
              (click)="finalizarCompra()"
            >
              <mat-icon>check</mat-icon>
              Finalizar compra ({{ totalSeleccionados }})
            </button>
          </ng-container>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .preparar-wrapper {
      min-height: 100vh;
      background-color: var(--km-bg-canvas);
      display: flex;
      flex-direction: column;
      padding-bottom: 90px;
    }

    .wizard-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background-color: var(--km-bg-surface);
      border-bottom: var(--km-border);
    }
    .wizard-header-content {
      max-width: 600px;
      margin: 0 auto;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 8px;
    }
    .wizard-title {
      font-size: 1.1rem;
      font-weight: 600;
    }
    .wizard-progress {
      height: 3px !important;
      ::ng-deep .mdc-linear-progress__bar-inner {
        border-color: var(--km-text-primary) !important;
      }
    }

    .wizard-body {
      flex: 1;
      padding-top: 20px;
    }

    .step-card {
      padding: 32px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 16px;
    }
    .step-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      background-color: var(--km-pastel-yellow-bg);
      color: var(--km-pastel-yellow-text);
      display: flex;
      align-items: center;
      justify-content: center;

      mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }
    }
    .step-title {
      font-size: 1.75rem;
      margin: 0;
    }
    .step-desc {
      color: var(--km-text-secondary);
      font-size: 0.95rem;
      margin: 0;
      line-height: 1.5;
    }

    .summary-box {
      width: 100%;
      background-color: var(--km-bg-canvas);
      border: var(--km-border);
      border-radius: var(--km-radius-sm);
      padding: 16px;
      margin: 8px 0;
    }
    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 0;
      font-size: 0.9rem;
    }
    .summary-label {
      color: var(--km-text-secondary);
    }
    .summary-value {
      font-weight: 600;
      &.highlight {
        color: var(--km-pastel-yellow-text);
      }
    }

    .step-actions {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .full-width {
      width: 100%;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 0.95rem;
    }

    /* Recorrido Category Styles */
    .category-header {
      margin-bottom: 20px;
    }
    .category-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .selected-count {
      font-size: 0.8rem;
      color: var(--km-text-secondary);
    }
    .category-title {
      font-size: 2rem;
      font-weight: 500;
      margin: 0;
      letter-spacing: -0.02em;
    }

    .list-card {
      padding: 0;
      overflow: hidden;
    }
    .item-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .item-name {
      font-size: 1rem;
      font-weight: 500;
    }
    .empty-cat {
      padding: 24px;
      text-align: center;
      color: var(--km-text-secondary);
      font-size: 0.9rem;
    }

    /* Revision Styles */
    .revision-header {
      margin-bottom: 20px;
    }
    .revision-title {
      font-size: 2rem;
      margin: 0 0 6px 0;
    }
    .revision-desc {
      color: var(--km-text-secondary);
      margin: 0;
      font-size: 0.95rem;
    }
    .revision-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .revision-group {
      padding: 0;
      overflow: hidden;
    }
    .group-title {
      font-size: 1.15rem;
      font-weight: 600;
      padding: 14px 16px;
      background-color: var(--km-bg-canvas);
    }
    .empty-revision {
      padding: 32px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 12px;
      color: var(--km-text-secondary);
    }

    /* Wizard Bottom Footer */
    .wizard-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: var(--km-bg-surface);
      border-top: var(--km-border);
      padding: 12px 16px env(safe-area-inset-bottom);
      z-index: 100;
    }
    .footer-container {
      display: flex;
      gap: 12px;
      padding: 0;
    }
    .nav-btn {
      flex: 1;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-size: 0.95rem;
    }

    .fade-in {
      animation: fadeIn 0.2s ease-in-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class PrepararCompraComponent implements OnInit {
  modo: ModoVista = 'resumen';
  categorias: CategoriaConProductos[] = [];
  indiceCategoria = 0;
  procesando = false;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private obtenerListaCompraUseCase: ObtenerListaDeCompraUseCase,
    private alternarProductoUseCase: AlternarProductoEnCompraUseCase,
    private finalizarCompraUseCase: FinalizarCompraUseCase
  ) {}

  async ngOnInit(): Promise<void> {
    await this.cargarDatos();
  }

  async cargarDatos(): Promise<void> {
    this.categorias = await this.obtenerListaCompraUseCase.obtenerAgrupadoPorCategoria(false);
  }

  get categoriaActual(): CategoriaConProductos | null {
    if (this.categorias.length === 0 || this.indiceCategoria >= this.categorias.length) {
      return null;
    }
    return this.categorias[this.indiceCategoria];
  }

  get totalSugeridos(): number {
    let count = 0;
    for (const cat of this.categorias) {
      for (const item of cat.items) {
        if (item.estado.comprar) {
          count++;
        }
      }
    }
    return count;
  }

  get totalSeleccionados(): number {
    let count = 0;
    for (const cat of this.categorias) {
      for (const item of cat.items) {
        if (item.estado.comprar) {
          count++;
        }
      }
    }
    return count;
  }

  get marcadosEnCategoriaActual(): number {
    if (!this.categoriaActual) return 0;
    return this.categoriaActual.items.filter((i) => i.estado.comprar).length;
  }

  get progresoPorcentaje(): number {
    if (this.categorias.length === 0) return 0;
    return ((this.indiceCategoria + 1) / this.categorias.length) * 100;
  }

  get esUltimaCategoria(): boolean {
    return this.indiceCategoria === this.categorias.length - 1;
  }

  get categoriasConSeleccionados(): CategoriaConProductos[] {
    return this.categorias
      .map((cat) => ({
        categoria: cat.categoria,
        items: cat.items.filter((i) => i.estado.comprar),
      }))
      .filter((cat) => cat.items.length > 0);
  }

  comenzarRecorrido(): void {
    this.modo = 'recorrido';
    this.indiceCategoria = 0;
  }

  irARevision(): void {
    this.modo = 'revision';
  }

  siguienteCategoria(): void {
    if (this.esUltimaCategoria) {
      this.modo = 'revision';
    } else {
      this.indiceCategoria++;
    }
  }

  anteriorCategoria(): void {
    if (this.indiceCategoria > 0) {
      this.indiceCategoria--;
    }
  }

  async toggleProducto(item: ProductoConEstado): Promise<void> {
    const nuevoValor = !item.estado.comprar;
    item.estado.comprar = nuevoValor;
    await this.alternarProductoUseCase.ejecutar(item.producto.id, nuevoValor);
  }

  async finalizarCompra(): Promise<void> {
    if (this.procesando) return;
    this.procesando = true;

    try {
      const cantidad = await this.finalizarCompraUseCase.ejecutar();
      this.snackBar.open(
        `¡Compra finalizada! Se actualizaron ${cantidad} productos.`,
        'Cerrar',
        { duration: 4000 }
      );
      this.router.navigate(['/']);
    } catch (err) {
      this.snackBar.open('Ocurrió un error al finalizar la compra.', 'Cerrar', {
        duration: 3000,
      });
    } finally {
      this.procesando = false;
    }
  }

  salir(): void {
    this.router.navigate(['/']);
  }
}
