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
    <div class="km-sheet-form">
      <div class="km-sheet-header">
        <h2 class="font-serif km-sheet-title">
          {{ data.producto ? 'Editar producto' : 'Nuevo producto' }}
        </h2>
        <p class="km-sheet-subtitle">
          Configura el intervalo estimado de compra en días.
        </p>
      </div>

      <form [formGroup]="form" (ngSubmit)="guardar()" class="km-sheet-body">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre del producto</mat-label>
          <input matInput formControlName="nombre" placeholder="Ej: Arroz, Detergente" maxlength="80" />
          <mat-error *ngIf="form.get('nombre')?.hasError('required')">
            El nombre es obligatorio.
          </mat-error>
          <mat-error *ngIf="form.get('nombre')?.hasError('maxlength')">
            Usá hasta 80 caracteres.
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
            max="3650"
          />
          <mat-hint>Días estimados entre cada compra</mat-hint>
          <mat-error *ngIf="form.get('intervaloDias')?.hasError('required')">
            El intervalo es obligatorio.
          </mat-error>
          <mat-error *ngIf="form.get('intervaloDias')?.hasError('min')">
            Debe ser mayor a 0.
          </mat-error>
          <mat-error *ngIf="form.get('intervaloDias')?.hasError('max')">
            El intervalo no puede superar 3650 días.
          </mat-error>
        </mat-form-field>

        <div class="km-toggle-row">
          <span id="producto-activo-label">Producto activo</span>
          <mat-slide-toggle formControlName="activo" aria-labelledby="producto-activo-label"></mat-slide-toggle>
        </div>

        <div class="km-sheet-actions">
          <button
            type="button"
            mat-stroked-button
            class="km-btn-secondary km-flex-1"
            (click)="cancelar()"
          >
            Cancelar
          </button>
          <button
            type="submit"
            mat-flat-button
            class="km-btn-primary km-flex-1"
            [disabled]="form.invalid"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .full-width {
      width: 100%;
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
      nombre: [prod ? prod.nombre : '', [Validators.required, Validators.maxLength(80)]],
      categoriaId: [prod ? prod.categoriaId : (this.data.categorias[0]?.id || ''), [Validators.required]],
      intervaloDias: [prod ? prod.intervaloDias : 30, [Validators.required, Validators.min(1), Validators.max(3650)]],
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
