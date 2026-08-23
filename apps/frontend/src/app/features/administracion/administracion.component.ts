import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { Categoria, Producto } from '../../domain';
import { GestionarCategoriasUseCase, GestionarProductosUseCase } from '../../application';
import { ProductoFormSheetComponent } from './sheets/producto-form-sheet.component';
import { CategoriaFormSheetComponent } from './sheets/categoria-form-sheet.component';
import { ConfirmSheetComponent } from '../../core/components/confirm-sheet/confirm-sheet.component';

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatBottomSheetModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="km-container page-admin">
      <div class="admin-header">
        <h1 class="font-serif admin-title">Administración</h1>
        <p class="admin-subtitle">Gestioná productos y categorías de la despensa</p>
      </div>

      <p class="km-loading" *ngIf="cargando">Cargando catálogo…</p>

      <mat-tab-group
        class="admin-tabs"
        animationDuration="150ms"
        [selectedIndex]="selectedTab"
        (selectedIndexChange)="onTabChange($event)"
      >
        <!-- TAB 1: PRODUCTOS -->
        <mat-tab label="Productos">
          <div class="tab-content">
            <!-- Toolbar & Filters -->
            <div class="admin-toolbar">
              <mat-form-field appearance="outline" subscriptSizing="dynamic" class="search-field">
                <mat-label>Buscar producto...</mat-label>
                <input
                  matInput
                  type="search"
                  [(ngModel)]="busquedaProducto"
                  (ngModelChange)="filtrarProductos()"
                  autocomplete="off"
                />
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>

              <button
                mat-flat-button
                class="km-btn-primary add-btn"
                (click)="abrirModalProducto()"
              >
                <mat-icon>add</mat-icon>
                Nuevo
              </button>
            </div>

            <!-- Filter Category Dropdown -->
            <div class="filter-row">
              <mat-form-field appearance="outline" subscriptSizing="dynamic" class="full-width">
                <mat-label>Filtrar por categoría</mat-label>
                <mat-select [(ngModel)]="categoriaFiltroId" (ngModelChange)="filtrarProductos()">
                  <mat-option value="todas">Todas las categorías</mat-option>
                  <mat-option *ngFor="let cat of categorias" [value]="cat.id">
                    {{ cat.nombre }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <!-- Product List -->
            <div class="km-card list-container">
              <div
                *ngFor="let prod of productosFiltrados"
                class="km-list-item admin-item"
                [class.is-disabled]="!prod.activo"
              >
                <button type="button" class="item-main" (click)="abrirModalProducto(prod)">
                  <div class="item-title-row">
                    <span class="item-title">{{ prod.nombre }}</span>
                    <span
                      class="km-badge"
                      [class.km-badge-green]="prod.activo"
                      [class.km-badge-gray]="!prod.activo"
                    >
                      {{ prod.activo ? 'Activo' : 'Inactivo' }}
                    </span>
                  </div>
                  <div class="item-meta">
                    <span class="meta-tag">{{ getNombreCategoria(prod.categoriaId) }}</span>
                    <span class="dot">•</span>
                    <span>Cada {{ prod.intervaloDias }} días</span>
                  </div>
                </button>

                <div class="item-actions">
                  <button mat-icon-button type="button" (click)="abrirModalProducto(prod)">
                    <mat-icon class="action-icon">edit</mat-icon>
                    <span class="sr-only">Editar {{ prod.nombre }}</span>
                  </button>
                  <button
                    mat-icon-button
                    type="button"
                    color="warn"
                    (click)="eliminarProducto(prod)"
                  >
                    <mat-icon class="action-icon">delete</mat-icon>
                    <span class="sr-only">Eliminar {{ prod.nombre }}</span>
                  </button>
                </div>
              </div>

              <div *ngIf="productosFiltrados.length === 0" class="empty-state km-empty">
                <mat-icon class="empty-icon" *ngIf="productos.length > 0">search_off</mat-icon>
                <p *ngIf="productos.length === 0">Todavía no hay productos. Creá el primero para armar la despensa.</p>
                <p *ngIf="productos.length > 0">No hay productos que coincidan con la búsqueda o el filtro.</p>
                <button
                  *ngIf="productos.length === 0"
                  mat-flat-button
                  type="button"
                  class="km-btn-primary"
                  (click)="abrirModalProducto()"
                >
                  Nuevo producto
                </button>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- TAB 2: CATEGORÍAS -->
        <mat-tab label="Categorías">
          <div class="tab-content">
            <div class="admin-toolbar">
              <span class="toolbar-info">{{ categorias.length }} categorías configuradas</span>
              <button
                mat-flat-button
                class="km-btn-primary add-btn"
                (click)="abrirModalCategoria()"
              >
                <mat-icon>add</mat-icon>
                Nueva
              </button>
            </div>

            <div class="km-card list-container">
              <div
                *ngFor="let cat of categorias"
                class="km-list-item admin-item"
                [class.is-disabled]="!cat.activa"
              >
                <button type="button" class="item-main" (click)="abrirModalCategoria(cat)">
                  <div class="item-title-row">
                    <span class="item-title">{{ cat.nombre }}</span>
                    <span
                      class="km-badge"
                      [class.km-badge-green]="cat.activa"
                      [class.km-badge-gray]="!cat.activa"
                    >
                      {{ cat.activa ? 'Activa' : 'Inactiva' }}
                    </span>
                  </div>
                  <div class="item-meta">
                    <span>Orden en recorrido: #{{ cat.orden }}</span>
                  </div>
                </button>

                <div class="item-actions">
                  <button mat-icon-button type="button" (click)="abrirModalCategoria(cat)">
                    <mat-icon class="action-icon">edit</mat-icon>
                    <span class="sr-only">Editar {{ cat.nombre }}</span>
                  </button>
                  <button
                    mat-icon-button
                    type="button"
                    color="warn"
                    (click)="eliminarCategoria(cat)"
                  >
                    <mat-icon class="action-icon">delete</mat-icon>
                    <span class="sr-only">Eliminar {{ cat.nombre }}</span>
                  </button>
                </div>
              </div>

              <div *ngIf="categorias.length === 0" class="empty-state km-empty">
                <p>Todavía no hay categorías. Creá la primera para organizar el recorrido.</p>
                <button
                  mat-flat-button
                  type="button"
                  class="km-btn-primary"
                  (click)="abrirModalCategoria()"
                >
                  Nueva categoría
                </button>
              </div>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .page-admin {
      padding-bottom: 16px;
    }
    .admin-header {
      margin-top: 12px;
      margin-bottom: 16px;
    }
    .admin-title {
      font-size: 2rem;
      font-weight: 500;
      margin: 0 0 4px 0;
    }
    .admin-subtitle {
      color: var(--km-text-secondary);
      margin: 0;
      font-size: 0.9rem;
    }

    .tab-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-top: 16px;
    }

    .admin-toolbar {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }
    .search-field {
      flex: 1;
      min-width: 0;
    }
    .add-btn {
      height: 48px;
      padding: 0 16px;
      display: flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;
    }
    .toolbar-info {
      flex: 1;
      font-size: 0.9rem;
      color: var(--km-text-secondary);
    }

    .filter-row {
      .full-width {
        width: 100%;
      }
    }

    .list-container {
      padding: 0;
      overflow: hidden;
      margin-top: 8px;
    }

    .admin-item {
      &.is-disabled {
        opacity: 0.55;
      }
    }

    .item-title {
      font-size: 1rem;
      font-weight: 600;
      overflow-wrap: anywhere;
      min-width: 0;
    }
    .item-main {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
      flex: 1;
      margin: 0;
      padding: 0;
      border: 0;
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: left;
      cursor: pointer;
    }
    .item-main:focus-visible {
      outline: 2px solid var(--km-text-primary);
      outline-offset: 2px;
    }
    .item-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }
    .item-meta {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8rem;
      color: var(--km-text-secondary);
    }
    .dot {
      color: var(--km-text-muted);
    }

    .item-actions {
      display: flex;
      align-items: center;
    }

    .empty-state {
      padding: 32px 16px;
    }
    .empty-icon,
    .action-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    .empty-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }
  `]
})
export class AdministracionComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categorias: Categoria[] = [];

  busquedaProducto = '';
  categoriaFiltroId = 'todas';
  selectedTab = 0;
  cargando = true;

  constructor(
    private bottomSheet: MatBottomSheet,
    private snackBar: MatSnackBar,
    private router: Router,
    private gestionarProductosUseCase: GestionarProductosUseCase,
    private gestionarCategoriasUseCase: GestionarCategoriasUseCase
  ) {}

  async ngOnInit(): Promise<void> {
    this.syncTabFromUrl();
    await this.cargarDatos();
  }

  onTabChange(index: number): void {
    this.selectedTab = index;
    const path = index === 1 ? '/administracion/categorias' : '/administracion/productos';
    void this.router.navigate([path], { replaceUrl: true });
  }

  private syncTabFromUrl(): void {
    this.selectedTab = this.router.url.includes('/categorias') ? 1 : 0;
  }

  async cargarDatos(): Promise<void> {
    this.cargando = true;
    try {
      this.categorias = await this.gestionarCategoriasUseCase.listar();
      this.productos = await this.gestionarProductosUseCase.listar();
      this.filtrarProductos();
    } finally {
      this.cargando = false;
    }
  }

  getNombreCategoria(categoriaId: string): string {
    const cat = this.categorias.find((c) => c.id === categoriaId);
    return cat ? cat.nombre : 'Sin categoría';
  }

  filtrarProductos(): void {
    let result = [...this.productos];

    if (this.categoriaFiltroId !== 'todas') {
      result = result.filter((p) => p.categoriaId === this.categoriaFiltroId);
    }

    if (this.busquedaProducto.trim()) {
      const q = this.busquedaProducto.toLowerCase().trim();
      result = result.filter((p) => p.nombre.toLowerCase().includes(q));
    }

    this.productosFiltrados = result;
  }

  abrirModalProducto(producto?: Producto): void {
    const sheetRef = this.bottomSheet.open(ProductoFormSheetComponent, {
      data: {
        producto,
        categorias: this.categorias,
      },
    });

    sheetRef.afterDismissed().subscribe(async (resultado) => {
      if (!resultado) return;

      if (producto) {
        await this.gestionarProductosUseCase.actualizar(resultado);
        this.snackBar.open('Producto actualizado', 'Cerrar', { duration: 2000 });
      } else {
        await this.gestionarProductosUseCase.crear(resultado);
        this.snackBar.open('Producto creado', 'Cerrar', { duration: 2000 });
      }
      await this.cargarDatos();
    });
  }

  async eliminarProducto(producto: Producto): Promise<void> {
    const sheetRef = this.bottomSheet.open(ConfirmSheetComponent, {
      data: {
        title: 'Eliminar producto',
        message: `¿Eliminar «${producto.nombre}» de la despensa? Esta acción no se puede deshacer.`,
        confirmLabel: 'Eliminar',
        destructive: true,
      },
    });

    const ok = await firstValueFrom(sheetRef.afterDismissed());
    if (!ok) return;
    await this.gestionarProductosUseCase.eliminar(producto.id);
    this.snackBar.open('Producto eliminado', 'Cerrar', { duration: 2000 });
    await this.cargarDatos();
  }

  abrirModalCategoria(categoria?: Categoria): void {
    const siguienteOrden = this.categorias.length + 1;
    const sheetRef = this.bottomSheet.open(CategoriaFormSheetComponent, {
      data: {
        categoria,
        siguienteOrden,
      },
    });

    sheetRef.afterDismissed().subscribe(async (resultado) => {
      if (!resultado) return;

      if (categoria) {
        await this.gestionarCategoriasUseCase.actualizar(resultado);
        this.snackBar.open('Categoría actualizada', 'Cerrar', { duration: 2000 });
      } else {
        await this.gestionarCategoriasUseCase.crear(resultado);
        this.snackBar.open('Categoría creada', 'Cerrar', { duration: 2000 });
      }
      await this.cargarDatos();
    });
  }

  async eliminarCategoria(categoria: Categoria): Promise<void> {
    const prods = this.productos.filter((p) => p.categoriaId === categoria.id);
    if (prods.length > 0) {
      this.bottomSheet.open(ConfirmSheetComponent, {
        data: {
          title: 'No se puede eliminar',
          message: `«${categoria.nombre}» tiene ${prods.length} productos. Movélos o eliminalos antes de borrar la categoría.`,
          confirmLabel: 'Entendido',
          cancelLabel: 'Cerrar',
        },
      });
      return;
    }

    const sheetRef = this.bottomSheet.open(ConfirmSheetComponent, {
      data: {
        title: 'Eliminar categoría',
        message: `¿Eliminar «${categoria.nombre}»? Esta acción no se puede deshacer.`,
        confirmLabel: 'Eliminar',
        destructive: true,
      },
    });

    const ok = await firstValueFrom(sheetRef.afterDismissed());
    if (!ok) return;
    await this.gestionarCategoriasUseCase.eliminar(categoria.id);
    this.snackBar.open('Categoría eliminada', 'Cerrar', { duration: 2000 });
    await this.cargarDatos();
  }
}
