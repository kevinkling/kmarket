import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmSheetData {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
}

@Component({
  selector: 'app-confirm-sheet',
  standalone: true,
  imports: [MatButtonModule],
  template: `
    <div class="km-sheet-form" role="alertdialog" aria-labelledby="km-confirm-title">
      <div class="km-sheet-header">
        <h2 class="font-serif km-sheet-title" id="km-confirm-title">{{ data.title }}</h2>
        <p class="km-sheet-subtitle wrap">{{ data.message }}</p>
      </div>
      <div class="km-sheet-actions">
        <button
          type="button"
          mat-stroked-button
          class="km-btn-secondary km-flex-1"
          (click)="cancelar()"
        >
          {{ data.cancelLabel || 'Cancelar' }}
        </button>
        <button
          type="button"
          mat-flat-button
          class="km-flex-1"
          [class.km-btn-primary]="!data.destructive"
          [class.km-btn-danger]="data.destructive"
          (click)="confirmar()"
        >
          {{ data.confirmLabel }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .km-sheet-title {
      overflow-wrap: anywhere;
    }
    .wrap {
      overflow-wrap: anywhere;
    }
    .km-btn-danger {
      background-color: var(--km-pastel-red-text) !important;
      color: #fff !important;
    }
  `],
})
export class ConfirmSheetComponent {
  constructor(
    private sheetRef: MatBottomSheetRef<ConfirmSheetComponent, boolean>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: ConfirmSheetData,
  ) {}

  confirmar(): void {
    this.sheetRef.dismiss(true);
  }

  cancelar(): void {
    this.sheetRef.dismiss(false);
  }
}
