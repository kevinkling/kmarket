import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  AlternarProductoEnCompraUseCase,
  CategoriaConProductos,
  FinalizarCompraUseCase,
  GestionarCategoriasUseCase,
  GestionarProductosUseCase,
  ObtenerListaDeCompraUseCase,
  ProductoConEstado,
} from '../../application';
import { Categoria, Producto, SeedMetaRepository } from '../../domain';
import { runViewTransition } from '../../core/utils/view-transition';
import { ProductoFormSheetComponent } from '../administracion/sheets/producto-form-sheet.component';
import { AgregarProductoCompraSheetComponent } from './sheets/agregar-producto-compra-sheet.component';

const OMITIR_REVISION_SESSION_KEY = 'kmarket.omitirRevision';

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
    MatBottomSheetModule,
  ],
  template: `
    <div class="preparar-wrapper" [class.has-footer]="modo === 'recorrido' || modo === 'revision'">
      <!-- Top Wizard Header -->
      <header class="wizard-header">
        <div class="wizard-header-content">
          <button mat-icon-button type="button" (click)="salir()">
            <mat-icon>close</mat-icon>
            <span class="sr-only">Volver al inicio</span>
          </button>
          <div class="wizard-title font-serif km-vt-stage">
            <span *ngIf="modo === 'resumen'">Preparar compra</span>
            <span *ngIf="modo === 'recorrido'">Recorrido por categoría</span>
            <span *ngIf="modo === 'revision'">Revisión final</span>
          </div>
          <span class="header-spacer" aria-hidden="true"></span>
        </div>

        <!-- Progress bar during category recorrido -->
        <mat-progress-bar
          *ngIf="modo === 'recorrido' && categorias.length > 0"
          mode="determinate"
          [value]="progresoPorcentaje"
          class="wizard-progress"
        >
        </mat-progress-bar>
        <span class="sr-only" *ngIf="modo === 'recorrido' && categorias.length > 0">
          Progreso del recorrido: categoría {{ indiceCategoria + 1 }} de {{ categorias.length }}
        </span>
      </header>

      <!-- Main Content Area -->
      <div class="wizard-body km-container">
        <div *ngIf="cargando" class="view-step">
          <p class="km-loading">Cargando el recorrido…</p>
        </div>

        <div *ngIf="!cargando && categorias.length === 0" class="view-step">
          <div class="step-card km-card km-empty">
            <mat-icon class="empty-icon">inventory_2</mat-icon>
            <h1 class="font-serif step-title">Todavía no hay categorías</h1>
            <p class="step-desc">
              Cargá categorías y productos en Administración para poder preparar una compra.
            </p>
            <button mat-flat-button class="km-btn-primary full-width" type="button" (click)="irAAdministracion()">
              Ir a administración
            </button>
          </div>
        </div>

        <!-- VISTA 1: RESUMEN INICIAL -->
        <div *ngIf="!cargando && categorias.length > 0 && modo === 'resumen'" class="view-step fade-in">
          <div class="step-card km-card km-vt-sheet">
            <div class="step-icon">
              <mat-icon>checklist_rtl</mat-icon>
            </div>
            <h1 class="font-serif step-title km-vt-leaf">¿Listo para la compra?</h1>
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
            <h1 class="category-title font-serif km-vt-leaf">{{ categoriaActual.categoria.nombre }}</h1>
            <button mat-stroked-button class="km-btn-secondary add-product-btn" type="button" (click)="abrirAgregarProducto()">
              <mat-icon>add</mat-icon>
              Agregar producto
            </button>
          </div>

          <div class="km-card list-card km-vt-sheet">
            <div
              *ngFor="let item of categoriaActual.items; trackBy: trackByProducto"
              class="km-list-item"
              [class.is-selected]="item.estado.comprar"
              role="button"
              tabindex="0"
              [attr.aria-pressed]="item.estado.comprar"
              (click)="toggleProducto(item)"
              (keydown.enter)="toggleProducto(item)"
              (keydown.space)="$event.preventDefault(); toggleProducto(item)"
            >
              <div class="item-info">
                <span class="item-name">{{ item.producto.nombre }}</span>
                <span class="km-badge km-badge-yellow" *ngIf="item.estado.comprar && !item.estado.ultimaCompra">
                  Nuevo / Sin compra
                </span>
              </div>
              <div class="check-visual" [class.checked]="item.estado.comprar" aria-hidden="true"></div>
            </div>

            <div *ngIf="categoriaActual.items.length === 0" class="empty-cat">
              No hay productos activos en esta categoría.
            </div>
          </div>
        </div>

        <!-- VISTA 3: REVISIÓN FINAL -->
        <div *ngIf="modo === 'revision'" class="view-step fade-in">
          <div class="revision-header">
            <h1 class="font-serif revision-title km-vt-leaf">Resumen de compra</h1>
            <p class="revision-desc">
              Destildá cada producto al meterlo en el changuito. Quedan {{ pendientesRecoger }} de {{ totalSeleccionados }} por guardar.
            </p>
            <button mat-stroked-button class="km-btn-secondary add-product-btn" type="button" (click)="abrirAgregarProducto()">
              <mat-icon>add</mat-icon>
              Agregar producto
            </button>
          </div>

          <div class="revision-content km-vt-sheet">
            <div
              *ngFor="let catGroup of categoriasConSeleccionados"
              class="revision-group km-card"
            >
              <div class="group-title font-serif">{{ catGroup.categoria.nombre }}</div>
              <div class="km-divider"></div>

              <div
                *ngFor="let item of catGroup.items; trackBy: trackByProducto"
                class="km-list-item"
                [class.is-selected]="!item.estado.recogido"
                role="button"
                tabindex="0"
                [attr.aria-pressed]="!item.estado.recogido"
                (click)="toggleRecogido(item)"
                (keydown.enter)="toggleRecogido(item)"
                (keydown.space)="$event.preventDefault(); toggleRecogido(item)"
              >
                <span class="item-name">{{ item.producto.nombre }}</span>
                <div class="check-visual" [class.checked]="!item.estado.recogido" aria-hidden="true"></div>
              </div>
            </div>

            <div *ngIf="totalSeleccionados === 0" class="empty-revision km-card km-empty">
              <mat-icon class="empty-icon">remove_shopping_cart</mat-icon>
              <p>No has seleccionado ningún producto para comprar.</p>
              <button mat-stroked-button class="km-btn-secondary" type="button" (click)="volverAlRecorrido()">
                Volver al recorrido
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Wizard Bottom Navigation -->
      <footer class="wizard-footer" *ngIf="modo === 'recorrido' || modo === 'revision'">
        <div class="footer-container km-container">
          <p class="footer-error" *ngIf="modo === 'revision' && errorFinalizar" role="alert">{{ errorFinalizar }}</p>
          <div class="footer-actions">
            <ng-container *ngIf="modo === 'recorrido'">
            <button
              mat-stroked-button
              class="km-btn-secondary nav-btn"
              type="button"
              [disabled]="indiceCategoria === 0"
              (click)="anteriorCategoria()"
            >
              <mat-icon>chevron_left</mat-icon>
              Anterior
            </button>

            <button
              mat-flat-button
              class="km-btn-primary nav-btn"
              type="button"
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
              type="button"
              [disabled]="procesando"
              (click)="confirmandoFinalizar ? cancelarFinalizar() : volverAlRecorrido()"
            >
              <mat-icon>{{ confirmandoFinalizar ? 'close' : 'edit' }}</mat-icon>
              {{ confirmandoFinalizar ? 'Cancelar' : 'Modificar' }}
            </button>

            <button
              mat-flat-button
              class="km-btn-primary nav-btn"
              type="button"
              [disabled]="!puedeFinalizar || procesando"
              (click)="pedirOConfirmarFinalizar()"
            >
              <mat-icon>check</mat-icon>
              {{ etiquetaFinalizar }}
            </button>
          </ng-container>
          </div>
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
      padding-bottom: env(safe-area-inset-bottom, 0px);

      &.has-footer {
        padding-bottom: calc(108px + env(safe-area-inset-bottom, 0px));
      }
    }

    .wizard-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background-color: var(--km-bg-surface);
      border-bottom: var(--km-border);
      padding-top: env(safe-area-inset-top, 0px);
    }
    .wizard-header-content {
      max-width: 880px;
      width: 100%;
      box-sizing: border-box;
      margin: 0 auto;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 8px;
    }
    .header-spacer {
      width: 40px;
      height: 40px;
    }
    .wizard-title {
      font-size: 1.1rem;
      font-weight: 600;
      flex: 1;
      min-width: 0;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .wizard-progress {
      height: 3px !important;
    }

    .wizard-body {
      flex: 1;
      width: 100%;
      box-sizing: border-box;
      padding-top: 20px;
      padding-inline: 12px;
      max-width: 880px;
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
      background-color: var(--km-pastel-gray-bg);
      color: var(--km-text-primary);
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
      overflow-wrap: anywhere;
    }
    .step-desc {
      color: var(--km-text-secondary);
      font-size: 0.95rem;
      margin: 0;
      line-height: 1.5;
      overflow-wrap: anywhere;
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
      overflow-wrap: anywhere;
    }

    .list-card {
      padding: 0;
      overflow: hidden;
    }
    /* settling animation removed to make toggles feel instant on mobile */
    .item-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
      flex: 1;
    }
    .item-name {
      font-size: 1rem;
      font-weight: 500;
      overflow-wrap: anywhere;
    }
    /* Compact check visual used in the recorrido list to avoid MDC checkbox animations */
    .check-visual {
      width: 28px;
      height: 28px;
      border: 1px solid var(--km-border-color);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background: transparent;
      transition: background-color 0.12s linear, border-color 0.12s linear;
    }
    .check-visual.checked {
      background-color: var(--km-btn-primary-bg);
      border-color: var(--km-btn-primary-bg);
    }
    .check-visual.checked::after {
      content: '';
      display: block;
      width: 10px;
      height: 6px;
      border-left: 2px solid var(--km-btn-primary-text);
      border-bottom: 2px solid var(--km-btn-primary-text);
      transform: rotate(-45deg);
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
      overflow-wrap: anywhere;
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
      overflow-wrap: anywhere;
    }
    .empty-revision {
      padding: 32px 20px;
    }
    .empty-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: var(--km-text-muted);
    }
    .add-product-btn {
      width: 100%;
      margin-top: 12px;
      min-height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
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
      flex-direction: column;
      gap: 8px;
      width: 100%;
      box-sizing: border-box;
      padding: 0;
      max-width: 880px;
    }
    .footer-actions {
      display: flex;
      gap: 12px;
    }
    .footer-error {
      margin: 0;
      color: var(--km-pastel-red-text);
      font-size: 0.85rem;
      line-height: 1.4;
      overflow-wrap: anywhere;
    }
    .nav-btn {
      flex: 1;
      min-height: 48px;
      height: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-size: 0.95rem;
      white-space: normal;
      line-height: 1.2;
      padding-block: 10px;
    }

    .fade-in {
      animation: fadeIn 0.28s cubic-bezier(0.22, 1, 0.36, 1);
    }
    @supports (view-transition-name: none) {
      html:active-view-transition .fade-in {
        animation: none;
      }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); filter: blur(2px); }
      to { opacity: 1; transform: none; filter: none; }
    }
    @media (prefers-reduced-motion: reduce) {
      .fade-in {
        animation: none;
      }
    }
  `]
})
export class PrepararCompraComponent implements OnInit {
  modo: ModoVista = 'resumen';
  categorias: CategoriaConProductos[] = [];
  productos: Producto[] = [];
  catalogoCategorias: Categoria[] = [];
  indiceCategoria = 0;
  procesando = false;
  cargando = true;
  confirmandoFinalizar = false;
  errorFinalizar = '';

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private bottomSheet: MatBottomSheet,
    private obtenerListaCompraUseCase: ObtenerListaDeCompraUseCase,
    private alternarProductoUseCase: AlternarProductoEnCompraUseCase,
    private finalizarCompraUseCase: FinalizarCompraUseCase,
    private gestionarProductosUseCase: GestionarProductosUseCase,
    private gestionarCategoriasUseCase: GestionarCategoriasUseCase,
    private seedMeta: SeedMetaRepository,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.cargarDatos();
    if (await this.seedMeta.revisionEnCurso()) {
      this.modo = 'revision';
    }
  }

  async cargarDatos(): Promise<void> {
    this.cargando = true;
    try {
      const [categorias, productos, catalogo] = await Promise.all([
        this.obtenerListaCompraUseCase.obtenerAgrupadoPorCategoria(false),
        this.gestionarProductosUseCase.listar(),
        this.gestionarCategoriasUseCase.listar(),
      ]);
      this.categorias = categorias;
      this.productos = productos;
      this.catalogoCategorias = catalogo.filter((c) => c.activa).sort((a, b) => a.orden - b.orden);
    } finally {
      this.cargando = false;
    }
  }

  get categoriaActual(): CategoriaConProductos | null {
    if (this.categorias.length === 0 || this.indiceCategoria >= this.categorias.length) {
      return null;
    }
    return this.categorias[this.indiceCategoria];
  }

  get totalSugeridos(): number {
    return this.totalSeleccionados;
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

  get pendientesRecoger(): number {
    let count = 0;
    for (const cat of this.categorias) {
      for (const item of cat.items) {
        if (item.estado.comprar && !item.estado.recogido) {
          count++;
        }
      }
    }
    return count;
  }

  get puedeFinalizar(): boolean {
    return this.totalSeleccionados > 0 && this.pendientesRecoger === 0;
  }

  get etiquetaFinalizar(): string {
    if (this.procesando) {
      return 'Cerrando compra…';
    }
    if (this.confirmandoFinalizar) {
      return this.totalSeleccionados === 1
        ? 'Sí, cerrar 1 producto'
        : `Sí, cerrar ${this.totalSeleccionados} productos`;
    }
    if (this.pendientesRecoger > 0) {
      return this.pendientesRecoger === 1
        ? 'Destildá 1 producto'
        : `Destildá ${this.pendientesRecoger} productos`;
    }
    return `Finalizar compra (${this.totalSeleccionados})`;
  }

  comenzarRecorrido(): void {
    runViewTransition(this.cdr, 'forward', () => {
      this.modo = 'recorrido';
      this.indiceCategoria = 0;
    });
  }

  irARevision(): void {
    this.confirmandoFinalizar = false;
    this.errorFinalizar = '';
    void this.seedMeta.marcarRevisionEnCurso();
    runViewTransition(this.cdr, 'forward', () => {
      this.modo = 'revision';
    });
  }

  volverAlRecorrido(): void {
    this.confirmandoFinalizar = false;
    this.errorFinalizar = '';
    runViewTransition(this.cdr, 'back', () => {
      this.modo = 'recorrido';
    });
  }

  siguienteCategoria(): void {
    this.confirmandoFinalizar = false;
    this.errorFinalizar = '';
    runViewTransition(this.cdr, 'forward', () => {
      if (this.esUltimaCategoria) {
        void this.seedMeta.marcarRevisionEnCurso();
        this.modo = 'revision';
      } else {
        this.indiceCategoria++;
      }
    });
  }

  anteriorCategoria(): void {
    if (this.indiceCategoria === 0) return;
    runViewTransition(this.cdr, 'back', () => {
      this.indiceCategoria--;
    });
  }

  async toggleProducto(item: ProductoConEstado): Promise<void> {
    const nuevoValor = !item.estado.comprar;
    // update UI immediately
    item.estado.comprar = nuevoValor;
    item.estado.recogido = false;
    this.cdr.detectChanges();
    // persist in background without blocking the UI
    void this.alternarProductoUseCase.ejecutar(item.producto.id, nuevoValor, item.estado.ultimaCompra).catch((err) => {
      // on error, revert state and inform user minimally
      console.error('Error guardando estado de producto', err);
      item.estado.comprar = !nuevoValor;
      item.estado.recogido = false;
      this.cdr.detectChanges();
      this.snackBar.open('No se pudo actualizar el producto. Intentá de nuevo.', 'Cerrar', { duration: 3000 });
    });
  }

  trackByProducto(_: number, item: ProductoConEstado): string {
    return item.producto.id;
  }

  async toggleRecogido(item: ProductoConEstado): Promise<void> {
    const nuevoValor = !item.estado.recogido;
    item.estado.recogido = nuevoValor;
    this.cdr.detectChanges();
    void this.alternarProductoUseCase
      .ejecutarRecogido(item.producto.id, nuevoValor, item.estado.comprar, item.estado.ultimaCompra)
      .catch((err) => {
        console.error('Error guardando recogido', err);
        item.estado.recogido = !nuevoValor;
        this.cdr.detectChanges();
        this.snackBar.open('No se pudo actualizar el producto. Intentá de nuevo.', 'Cerrar', { duration: 3000 });
      });
  }

  pedirOConfirmarFinalizar(): void {
    if (this.procesando || !this.puedeFinalizar) return;
    this.errorFinalizar = '';
    if (!this.confirmandoFinalizar) {
      this.confirmandoFinalizar = true;
      return;
    }
    void this.finalizarCompra();
  }

  cancelarFinalizar(): void {
    this.confirmandoFinalizar = false;
    this.errorFinalizar = '';
  }

  async finalizarCompra(): Promise<void> {
    if (this.procesando) return;
    this.procesando = true;
    this.errorFinalizar = '';

    try {
      const cantidad = await this.finalizarCompraUseCase.ejecutar();
      await this.seedMeta.limpiarRevisionEnCurso();
      sessionStorage.removeItem(OMITIR_REVISION_SESSION_KEY);
      this.snackBar.open(
        `Compra cerrada. Se actualizaron ${cantidad} productos en la despensa.`,
        'Cerrar',
        { duration: 4000 }
      );
      this.router.navigate(['/']);
    } catch {
      this.errorFinalizar = 'No se pudo cerrar la compra. Revisá la conexión e intentá de nuevo.';
      this.procesando = false;
      this.confirmandoFinalizar = true;
    }
  }

  irAAdministracion(): void {
    this.router.navigate(['/administracion']);
  }

  abrirAgregarProducto(): void {
    const idsEnLista = new Set(
      this.categorias.flatMap((cat) =>
        cat.items.filter((item) => item.estado.comprar).map((item) => item.producto.id),
      ),
    );
    const productosDisponibles = this.productos.filter((p) => p.activo && !idsEnLista.has(p.id));
    const sheetRef = this.bottomSheet.open(AgregarProductoCompraSheetComponent, {
      panelClass: 'km-producto-sheet',
      data: {
        productosDisponibles,
        nombreCategoria: (categoriaId: string) =>
          this.catalogoCategorias.find((c) => c.id === categoriaId)?.nombre ?? 'Sin categoría',
      },
    });

    sheetRef.afterDismissed().subscribe((resultado) => {
      if (!resultado) return;
      if (resultado.accion === 'agregar') {
        void this.marcarProductoEnLista(resultado.producto);
        return;
      }
      this.abrirCrearProducto();
    });
  }

  abrirCrearProducto(): void {
    const sheetRef = this.bottomSheet.open(ProductoFormSheetComponent, {
      panelClass: 'km-producto-sheet',
      data: {
        categorias: this.catalogoCategorias,
        productos: this.productos,
        categoriaIdPreseleccionada: this.categoriaActual?.categoria.id,
      },
    });

    sheetRef.afterDismissed().subscribe(async (formValue) => {
      if (!formValue) return;
      const creado = await this.gestionarProductosUseCase.crear(formValue);
      this.productos = [...this.productos, creado];
      if (creado.activo) {
        await this.marcarProductoEnLista(creado);
      }
      this.snackBar.open('Producto creado', 'Cerrar', { duration: 2000 });
    });
  }

  private async marcarProductoEnLista(producto: Producto): Promise<void> {
    const grupo = this.categorias.find((cat) => cat.categoria.id === producto.categoriaId);
    let item = grupo?.items.find((i) => i.producto.id === producto.id);
    if (item) {
      item.estado.comprar = true;
      item.estado.recogido = false;
    } else if (grupo) {
      item = {
        producto,
        estado: {
          productoId: producto.id,
          ultimaCompra: null,
          comprar: true,
          recogido: false,
        },
      };
      grupo.items = [...grupo.items, item];
    } else {
      const categoria = this.catalogoCategorias.find((c) => c.id === producto.categoriaId);
      if (categoria) {
        item = {
          producto,
          estado: {
            productoId: producto.id,
            ultimaCompra: null,
            comprar: true,
            recogido: false,
          },
        };
        this.categorias = [...this.categorias, { categoria, items: [item] }];
      }
    }

    this.cdr.detectChanges();
    try {
      await this.alternarProductoUseCase.ejecutar(producto.id, true, item?.estado.ultimaCompra ?? null);
    } catch {
      this.snackBar.open('No se pudo agregar el producto. Intentá de nuevo.', 'Cerrar', { duration: 3000 });
    }
  }

  salir(): void {
    sessionStorage.setItem(OMITIR_REVISION_SESSION_KEY, '1');
    this.router.navigate(['/']);
  }
}
