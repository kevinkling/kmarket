import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Categoria, Producto } from '../../../domain';

export interface ProductoSheetData {
  producto?: Producto;
  categorias: Categoria[];
}

@Component({
  selector: 'app-producto-form-sheet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSlideToggleModule,
  ],
  template: `
    <div class="sheet-form">
      <div class="sheet-header">
        <h2 class="font-serif sheet-title">
          {{ data.producto ? 'Editar producto' : 'Nuevo producto' }}
        </h2>
        <p class="sheet-subtitle">
          Configura el intervalo estimado de compra en días.
        </p>
      </div>

      <form [formGroup]="form" (ngSubmit)="guardar()" class="form-body">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre del producto</mat-label>
          <input matInput formControlName="nombre" placeholder="Ej: Arroz, Detergente" />
          <mat-error *ngIf="form.get('nombre')?.hasError('required')">
            El nombre es obligatorio.
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Categoría</mat-label>
          <mat-select formControlName="categoriaId">
            <mat-option *ngFor="let cat of data.categorias" [value]="cat.id">
              {{ cat.nombre }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="form.get('categoriaId')?.hasError('required')">
            Debes seleccionar una categoría.
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Intervalo de compra (días)</mat-label>
          <input
            matInput
            type="number"
            formControlName="intervaloDias"
            placeholder="Ej: 15, 30"
            min="1"
          />
          <mat-hint>Días estimados entre cada compra</mat-hint>
          <mat-error *ngIf="form.get('intervaloDias')?.hasError('required')">
            El intervalo es obligatorio.
          </mat-error>
          <mat-error *ngIf="form.get('intervaloDias')?.hasError('min')">
            Debe ser mayor a 0.
          </mat-error>
        </mat-form-field>

        <div class="toggle-row">
          <span>Producto activo</span>
          <mat-slide-toggle formControlName="activo"></mat-slide-toggle>
        </div>

        <div class="sheet-actions">
          <button
            type="button"
            mat-stroked-button
            class="km-btn-secondary flex-1"
            (click)="cancelar()"
          >
            Cancelar
          </button>
          <button
            type="submit"
            mat-flat-button
            class="km-btn-primary flex-1"
            [disabled]="form.invalid"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .sheet-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .sheet-header {
      margin-bottom: 4px;
    }
    .sheet-title {
      font-size: 1.5rem;
      margin: 0 0 4px 0;
    }
    .sheet-subtitle {
      font-size: 0.85rem;
      color: var(--km-text-secondary);
      margin: 0;
    }
    .form-body {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .full-width {
      width: 100%;
    }
    .toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 0.95rem;
      color: var(--km-text-primary);
    }
    .sheet-actions {
      display: flex;
      gap: 12px;
      margin-top: 16px;
    }
    .flex-1 {
      flex: 1;
      height: 44px;
    }
  `]
})
export class ProductoFormSheetComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private sheetRef: MatBottomSheetRef<ProductoFormSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: ProductoSheetData
  ) {}

  ngOnInit(): void {
    const prod = this.data.producto;
    this.form = this.fb.group({
      nombre: [prod ? prod.nombre : '', [Validators.required]],
      categoriaId: [prod ? prod.categoriaId : (this.data.categorias[0]?.id || ''), [Validators.required]],
      intervaloDias: [prod ? prod.intervaloDias : 30, [Validators.required, Validators.min(1)]],
      activo: [prod ? prod.activo : true],
    });
  }

  guardar(): void {
    if (this.form.invalid) return;
    const formValue = this.form.value;
    if (this.data.producto) {
      this.sheetRef.dismiss({
        ...this.data.producto,
        ...formValue,
      });
    } else {
      this.sheetRef.dismiss(formValue);
    }
  }

  cancelar(): void {
    this.sheetRef.dismiss();
  }
}
