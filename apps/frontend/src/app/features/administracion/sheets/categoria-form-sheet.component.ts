import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Categoria } from '../../../domain';

export interface CategoriaSheetData {
  categoria?: Categoria;
  siguienteOrden?: number;
}

@Component({
  selector: 'app-categoria-form-sheet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <div class="km-sheet-form">
      <div class="km-sheet-header">
        <h2 class="font-serif km-sheet-title">
          {{ data.categoria ? 'Editar categoría' : 'Nueva categoría' }}
        </h2>
        <p class="km-sheet-subtitle">
          Organizá las secciones del recorrido.
        </p>
      </div>

      <form [formGroup]="form" (ngSubmit)="guardar()" class="km-sheet-body">
        <mat-form-field appearance="outline" subscriptSizing="dynamic" class="full-width">
          <mat-label>Nombre de la categoría</mat-label>
          <input matInput formControlName="nombre" placeholder="Ej: Bebidas, Mascotas" maxlength="80" />
          <mat-error *ngIf="form.get('nombre')?.hasError('required')">
            El nombre es obligatorio.
          </mat-error>
          <mat-error *ngIf="form.get('nombre')?.hasError('maxlength')">
            Usá hasta 80 caracteres.
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" subscriptSizing="dynamic" class="full-width">
          <mat-label>Orden de aparición</mat-label>
          <input
            matInput
            type="number"
            formControlName="orden"
            placeholder="Ej: 1, 2"
            min="1"
          />
          <mat-hint>Posición durante el recorrido</mat-hint>
          <mat-error *ngIf="form.get('orden')?.hasError('required')">
            El orden es obligatorio.
          </mat-error>
        </mat-form-field>

        <label class="km-toggle-row">
          <span>Categoría activa</span>
          <span class="km-check">
            <input type="checkbox" formControlName="activa" class="sr-only" />
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
  `]
})
export class CategoriaFormSheetComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private sheetRef: MatBottomSheetRef<CategoriaFormSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: CategoriaSheetData
  ) {}

  ngOnInit(): void {
    const cat = this.data.categoria;
    this.form = this.fb.group({
      nombre: [cat ? cat.nombre : '', [Validators.required, Validators.maxLength(80)]],
      orden: [cat ? cat.orden : (this.data.siguienteOrden || 1), [Validators.required, Validators.min(1), Validators.max(999)]],
      activa: [cat ? cat.activa : true],
    });
  }

  guardar(): void {
    if (this.form.invalid) return;
    const formValue = this.form.value;
    if (this.data.categoria) {
      this.sheetRef.dismiss({
        ...this.data.categoria,
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
