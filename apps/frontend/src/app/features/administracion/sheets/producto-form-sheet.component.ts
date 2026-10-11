import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Categoria, Producto } from '../../../domain';
import { textoUltimaCompra } from '../../../core/utils/fecha-compra';

export interface ProductoSheetData {
  producto?: Producto;
  categorias: Categoria[];
  productos: Producto[];
  categoriaIdPreseleccionada?: string;
  nombreInicial?: string;
  ultimaCompra?: Date | null;
}

@Component({
  selector: 'app-producto-form-sheet',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <div class="km-sheet-form">
      <div class="km-sheet-header">
        <h2 class="font-serif km-sheet-title">
          {{ data.producto ? 'Editar producto' : 'Nuevo producto' }}
        </h2>
        <p class="km-sheet-subtitle">
          Nombre, categoría y una nota si hace falta.
        </p>
      </div>

      <form [formGroup]="form" (ngSubmit)="guardar()" class="km-sheet-body">
        <div class="nombre-block full-width">
          <mat-form-field appearance="outline" subscriptSizing="dynamic" class="full-width">
            <mat-label>Nombre del producto</mat-label>
            <input
              #nombreInput
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

        <fieldset class="chips-field">
          <legend>Categoría</legend>
          <div class="chips" role="radiogroup" aria-label="Categoría">
            <button
              type="button"
              class="chip"
              *ngFor="let cat of data.categorias"
              role="radio"
              [attr.aria-checked]="form.get('categoriaId')?.value === cat.id"
              [class.is-selected]="form.get('categoriaId')?.value === cat.id"
              (click)="elegirCategoria(cat.id)"
            >
              {{ cat.nombre }}
            </button>
          </div>
          <p class="chip-error" *ngIf="form.get('categoriaId')?.touched && form.get('categoriaId')?.hasError('required')">
            Elegí una categoría.
          </p>
        </fieldset>

        <mat-form-field appearance="outline" subscriptSizing="dynamic" class="full-width">
          <mat-label>Nota</mat-label>
          <textarea
            matInput
            formControlName="notas"
            rows="2"
            maxlength="500"
            placeholder="Marca, tamaño o lo que quieras recordar"
          ></textarea>
          <mat-error *ngIf="form.get('notas')?.hasError('maxlength')">
            Usá hasta 500 caracteres.
          </mat-error>
        </mat-form-field>

        <p class="ultima-compra" *ngIf="data.producto">
          {{ data.ultimaCompra ? 'Última compra: ' + textoUltimaCompra(data.ultimaCompra) : 'Sin compras' }}
        </p>

        <label class="km-toggle-row" *ngIf="data.producto">
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
    .km-sheet-title {
      font-size: 1.25rem;
    }
    .km-sheet-body {
      display: flex;
      flex-direction: column;
      gap: 0;
    }
    .full-width {
      display: block;
      width: 100%;
    }
    .full-width + .full-width,
    .nombre-block + .chips-field,
    .chips-field + .full-width {
      margin-top: 16px;
    }
    .nombre-block {
      position: relative;
      z-index: 3;
    }
    .nombre-block .full-width {
      margin-top: 0;
    }
    .chips-field {
      margin: 16px 0 0;
      padding: 0;
      border: 0;
      min-width: 0;
    }
    .chips-field legend {
      padding: 0;
      margin: 0 0 8px;
      font-size: 0.8rem;
      color: var(--km-text-secondary);
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .chip {
      margin: 0;
      padding: 8px 12px;
      border: var(--km-border);
      border-radius: 999px;
      background: transparent;
      color: var(--km-text-primary);
      font: inherit;
      font-size: 0.85rem;
      line-height: 1.2;
      cursor: pointer;
    }
    .chip.is-selected {
      background: var(--km-btn-primary-bg);
      border-color: var(--km-btn-primary-bg);
      color: var(--km-btn-primary-text);
    }
    .chip:focus-visible {
      outline: 2px solid var(--km-text-primary);
      outline-offset: 2px;
    }
    .chip-error {
      margin: 8px 0 0;
      font-size: 0.75rem;
      color: var(--km-pastel-red-text);
    }
    .ultima-compra {
      margin: 12px 0 0;
      font-size: 0.85rem;
      color: var(--km-text-secondary);
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
export class ProductoFormSheetComponent implements OnInit, AfterViewInit {
  @ViewChild('nombreInput') nombreInput?: ElementRef<HTMLInputElement>;

  form!: FormGroup;
  nombreEnfocado = false;
  sugerenciasVisibles = true;
  readonly textoUltimaCompra = textoUltimaCompra;

  constructor(
    private fb: FormBuilder,
    private sheetRef: MatBottomSheetRef<ProductoFormSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: ProductoSheetData
  ) {}

  ngOnInit(): void {
    const prod = this.data.producto;
    const categoriaInicial = prod
      ? prod.categoriaId
      : (this.data.categoriaIdPreseleccionada || this.data.categorias[0]?.id || '');
    this.form = this.fb.group({
      nombre: [
        prod ? prod.nombre : (this.data.nombreInicial ?? ''),
        [Validators.required, Validators.maxLength(80), this.nombreDuplicado],
      ],
      categoriaId: [categoriaInicial, [Validators.required]],
      notas: [prod?.notas ?? '', [Validators.maxLength(500)]],
      activo: [prod ? prod.activo : true],
    });
  }

  ngAfterViewInit(): void {
    this.sheetRef.afterOpened().subscribe(() => {
      this.nombreInput?.nativeElement.focus();
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

  elegirCategoria(categoriaId: string): void {
    this.form.get('categoriaId')?.setValue(categoriaId);
    this.form.get('categoriaId')?.markAsTouched();
  }

  elegirCoincidencia(producto: Producto): void {
    this.sugerenciasVisibles = false;
    this.form.patchValue({
      nombre: producto.nombre,
      categoriaId: producto.categoriaId,
    });
    this.form.get('nombre')?.markAsTouched();
  }

  guardar(): void {
    if (this.form.invalid) return;
    const formValue = {
      ...this.form.value,
      notas: String(this.form.value.notas ?? '').trim(),
    };
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
