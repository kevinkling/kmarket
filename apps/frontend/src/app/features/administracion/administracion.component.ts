import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Categoria, Producto } from '../../domain';
import { GestionarCategoriasUseCase, GestionarProductosUseCase } from '../../application';
import { ProductoFormSheetComponent } from './sheets/producto-form-sheet.component';
import { CategoriaFormSheetComponent } from './sheets/categoria-form-sheet.component';

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
        <p class="admin-subtitle">Gestiona los productos y categorías de tu despensa</p>
      </div>

      <mat-tab-group class="admin-tabs" animationDuration="150ms">
        <!-- TAB 1: PRODUCTOS -->
        <mat-tab label="Productos">
          <div class="tab-content">
            <!-- Toolbar & Filters -->
            <div class="admin-toolbar">
              <mat-form-field appearance="outline" class="search-field">
                <mat-label>Buscar producto...</mat-label>
                <input matInput [(ngModel)]="busquedaProducto" (ngModelChange)="filtrarProductos()" />
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
              <mat-form-field appearance="outline" class="full-width">
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
                <div class="item-main">
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
                </div>

                <div class="item-actions">
                  <button mat-icon-button (click)="abrirModalProducto(prod)" aria-label="Editar">
                    <mat-icon style="font-size: 20px;">edit</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    color="warn"
                    (click)="eliminarProducto(prod)"
                    aria-label="Eliminar"
                  >
                    <mat-icon style="font-size: 20px;">delete</mat-icon>
                  </button>
                </div>
              </div>

              <div *ngIf="productosFiltrados.length === 0" class="empty-state">
                <mat-icon style="font-size: 32px; width: 36px; height: 36px;">search_off</mat-icon>
                <p>No se encontraron productos.</p>
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
                <div class="item-main">
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
                </div>

                <div class="item-actions">
                  <button mat-icon-button (click)="abrirModalCategoria(cat)" aria-label="Editar">
                    <mat-icon style="font-size: 20px;">edit</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    color="warn"
                    (click)="eliminarCategoria(cat)"
                    aria-label="Eliminar"
                  >
                    <mat-icon style="font-size: 20px;">delete</mat-icon>
                  </button>
                </div>
              </div>

              <div *ngIf="categorias.length === 0" class="empty-state">
                <p>No hay categorías cargadas.</p>
              </div>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .page-admin {
      padding-bottom: 90px;
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

    .admin-tabs {
      ::ng-deep .mat-mdc-tab-body-content {
        padding-top: 16px;
      }
    }

    .tab-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .admin-toolbar {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .search-field {
      flex: 1;
      margin-bottom: -1.25em;
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
      margin-top: 4px;
      .full-width {
        width: 100%;
        margin-bottom: -1.25em;
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

    .item-main {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .item-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .item-title {
      font-size: 1rem;
      font-weight: 600;
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
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      color: var(--km-text-secondary);
      font-size: 0.9rem;
    }
  `]
})
export class AdministracionComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categorias: Categoria[] = [];

  busquedaProducto = '';
  categoriaFiltroId = 'todas';

  constructor(
    private bottomSheet: MatBottomSheet,
    private snackBar: MatSnackBar,
    private gestionarProductosUseCase: GestionarProductosUseCase,
    private gestionarCategoriasUseCase: GestionarCategoriasUseCase
  ) {}

  async ngOnInit(): Promise<void> {
    await this.cargarDatos();
  }

  async cargarDatos(): Promise<void> {
    this.categorias = await this.gestionarCategoriasUseCase.listar();
    this.productos = await this.gestionarProductosUseCase.listar();
    this.filtrarProductos();
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
        this.snackBar.open('Producto actualizado', 'Ok', { duration: 2000 });
      } else {
        await this.gestionarProductosUseCase.crear(resultado);
        this.snackBar.open('Producto creado', 'Ok', { duration: 2000 });
      }
      await this.cargarDatos();
    });
  }

  async eliminarProducto(producto: Producto): Promise<void> {
    if (confirm(`¿Eliminar el producto "${producto.nombre}"?`)) {
      await this.gestionarProductosUseCase.eliminar(producto.id);
      this.snackBar.open('Producto eliminado', 'Ok', { duration: 2000 });
      await this.cargarDatos();
    }
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
        this.snackBar.open('Categoría actualizada', 'Ok', { duration: 2000 });
      } else {
        await this.gestionarCategoriasUseCase.crear(resultado);
        this.snackBar.open('Categoría creada', 'Ok', { duration: 2000 });
      }
      await this.cargarDatos();
    });
  }

  async eliminarCategoria(categoria: Categoria): Promise<void> {
    const prods = this.productos.filter((p) => p.categoriaId === categoria.id);
    if (prods.length > 0) {
      alert(`No se puede eliminar la categoría porque contiene ${prods.length} productos.`);
      return;
    }

    if (confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) {
      await this.gestionarCategoriasUseCase.eliminar(categoria.id);
      this.snackBar.open('Categoría eliminada', 'Ok', { duration: 2000 });
      await this.cargarDatos();
    }
  }
}
