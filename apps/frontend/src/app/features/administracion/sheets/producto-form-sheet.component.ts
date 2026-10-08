import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Categoria, Producto } from '../../../domain';

export interface ProductoSheetData {
  producto?: Producto;
  categorias: Categoria[];
  productos: Producto[];
  categoriaIdPreseleccionada?: string;
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
  ],
  template: `
    <div class="km-sheet-form">
      <div class="km-sheet-header">
        <h2 class="font-serif km-sheet-title">
          {{ data.producto ? 'Editar producto' : 'Nuevo producto' }}
        </h2>
        <p class="km-sheet-subtitle">
          Configurá cada cuántos días suele reponerse.
        </p>
      </div>

      <form [formGroup]="form" (ngSubmit)="guardar()" class="km-sheet-body">
        <div class="nombre-block full-width">
          <mat-form-field appearance="outline" subscriptSizing="dynamic" class="full-width">
            <mat-label>Nombre del producto</mat-label>
            <input
              matInput
              formControlName="nombre"
              placeholder="Ej: Arroz, Detergente"
              maxlength="80"
              autocomplete="off"
              (focus)="nombreEnfocado = true"
              (blur)="nombreEnfocado = false"
              (input)="sugerenciasVisibles = true"
            />
            <mat-error *ngIf="form.get('nombre')?.hasError('required')">
              El nombre es obligatorio.
            </mat-error>
            <mat-error *ngIf="form.get('nombre')?.hasError('maxlength')">
              Usá hasta 80 caracteres.
            </mat-error>
            <mat-error *ngIf="form.get('nombre')?.hasError('nombreDuplicado')">
              Ya existe un producto con ese nombre.
            </mat-error>
          </mat-form-field>

          <ul class="sugerencias" *ngIf="nombreEnfocado && sugerenciasVisibles && coincidencias.length > 0">
            <li *ngFor="let prod of coincidencias">
              <button
                type="button"
                class="sugerencia"
                (mousedown)="$event.preventDefault()"
                (click)="elegirCoincidencia(prod)"
              >
                <span class="sugerencia-nombre">{{ prod.nombre }}</span>
                <span class="sugerencia-cat">{{ nombreCategoria(prod.categoriaId) }}</span>
              </button>
            </li>
          </ul>
        </div>

        <mat-form-field appearance="outline" subscriptSizing="dynamic" class="full-width">
          <mat-label>Categoría</mat-label>
          <mat-select formControlName="categoriaId">
            <mat-option *ngFor="let cat of data.categorias" [value]="cat.id">
              {{ cat.nombre }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="form.get('categoriaId')?.hasError('required')">
            Elegí una categoría.
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" subscriptSizing="dynamic" class="full-width">
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

        <label class="km-toggle-row">
          <span>Producto activo</span>
          <span class="km-check">
            <input type="checkbox" formControlName="activo" class="sr-only" />
            <span class="check-visual" aria-hidden="true"></span>
          </span>
        </label>

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
    .km-sheet-body {
      display: flex;
      flex-direction: column;
      gap: 0;
    }
    .full-width {
      display: block;
      width: 100%;
    }
    .full-width + .full-width {
      margin-top: 24px;
    }
    .nombre-block {
      position: relative;
      z-index: 3;
    }
    .nombre-block .full-width {
      margin-top: 0;
    }
    .sugerencias {
      position: absolute;
      left: 0;
      right: 0;
      top: 100%;
      z-index: 4;
      list-style: none;
      margin: -10px 0 0;
      padding: 0;
      max-height: 196px;
      overflow-x: hidden;
      overflow-y: auto;
      background: var(--km-bg-surface);
      border: var(--km-border);
      border-radius: 6px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }
    .sugerencia {
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
    .sugerencias li:last-child .sugerencia {
      border-bottom: none;
    }
    .sugerencia:hover,
    .sugerencia:focus-visible {
      background: var(--km-bg-elevated);
    }
    .sugerencia:focus-visible {
      outline: 2px solid var(--km-text-primary);
      outline-offset: -2px;
    }
    .sugerencia-nombre {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--km-text-primary);
    }
    .sugerencia-cat {
      font-size: 0.8rem;
      color: var(--km-text-secondary);
    }
  `]
})
export class ProductoFormSheetComponent implements OnInit {
  form!: FormGroup;
  nombreEnfocado = false;
  sugerenciasVisibles = true;

  constructor(
    private fb: FormBuilder,
    private sheetRef: MatBottomSheetRef<ProductoFormSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: ProductoSheetData
  ) {}

  ngOnInit(): void {
    const prod = this.data.producto;
    this.form = this.fb.group({
      nombre: [
        prod ? prod.nombre : '',
        [Validators.required, Validators.maxLength(80), this.nombreDuplicado],
      ],
      categoriaId: [prod ? prod.categoriaId : (this.data.categoriaIdPreseleccionada || this.data.categorias[0]?.id || ''), [Validators.required]],
      intervaloDias: [prod ? prod.intervaloDias : 30, [Validators.required, Validators.min(1), Validators.max(3650)]],
      activo: [prod ? prod.activo : true],
    });
  }

  get coincidencias(): Producto[] {
    if (this.data.producto || !this.form) return [];
    const q = String(this.form.get('nombre')?.value ?? '').toLowerCase().trim();
    if (q.length < 2) return [];
    return (this.data.productos ?? [])
      .filter((p) => p.nombre.toLowerCase().includes(q))
      .slice(0, 6);
  }

  nombreCategoria(categoriaId: string): string {
    return this.data.categorias.find((c) => c.id === categoriaId)?.nombre ?? 'Sin categoría';
  }

  elegirCoincidencia(producto: Producto): void {
    this.sugerenciasVisibles = false;
    this.form.patchValue({
      nombre: producto.nombre,
      categoriaId: producto.categoriaId,
      intervaloDias: producto.intervaloDias,
    });
    this.form.get('nombre')?.markAsTouched();
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

  private nombreDuplicado = (control: AbstractControl): ValidationErrors | null => {
    const nombre = String(control.value ?? '').trim().toLowerCase();
    if (!nombre) return null;
    const idActual = this.data.producto?.id;
    const existe = (this.data.productos ?? []).some(
      (p) => p.nombre.trim().toLowerCase() === nombre && p.id !== idActual,
    );
    return existe ? { nombreDuplicado: true } : null;
  };
}
