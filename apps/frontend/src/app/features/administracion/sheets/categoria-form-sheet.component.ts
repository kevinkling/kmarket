import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
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
    MatSlideToggleModule,
  ],
  template: `
    <div class="sheet-form">
      <div class="sheet-header">
        <h2 class="font-serif sheet-title">
          {{ data.categoria ? 'Editar categoría' : 'Nueva categoría' }}
        </h2>
        <p class="sheet-subtitle">
          Organiza las secciones del recorrido de compra.
        </p>
      </div>

      <form [formGroup]="form" (ngSubmit)="guardar()" class="form-body">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre de la categoría</mat-label>
          <input matInput formControlName="nombre" placeholder="Ej: Bebidas, Mascotas" />
          <mat-error *ngIf="form.get('nombre')?.hasError('required')">
            El nombre es obligatorio.
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
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

        <div class="toggle-row">
          <span>Categoría activa</span>
          <mat-slide-toggle formControlName="activa"></mat-slide-toggle>
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
      nombre: [cat ? cat.nombre : '', [Validators.required]],
      orden: [cat ? cat.orden : (this.data.siguienteOrden || 1), [Validators.required, Validators.min(1)]],
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
