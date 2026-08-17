import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ConnectivityService } from '../../services/connectivity.service';

@Component({
  selector: 'app-backend-status',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <button
      type="button"
      class="backend-status"
      [class.is-online]="connectivity.status() === 'online'"
      [class.is-offline]="connectivity.status() === 'offline'"
      [class.is-checking]="connectivity.status() === 'checking'"
      [title]="ariaLabel()"
      (click)="onRefresh()"
    >
      <mat-icon>{{ icon() }}</mat-icon>
      <span class="sr-only">{{ ariaLabel() }}</span>
      <span class="backend-status-text">{{ shortLabel() }}</span>
    </button>
  `,
  styles: [`
    .backend-status {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      min-height: 32px;
      height: 32px;
      padding: 0 10px 0 6px;
      border: var(--km-border);
      border-radius: var(--km-radius-pill);
      background: var(--km-pastel-gray-bg);
      color: var(--km-pastel-gray-text);
      font-size: 0.65rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      cursor: pointer;
      line-height: 1;
    }
    .backend-status:focus-visible {
      outline: 2px solid var(--km-text-primary);
      outline-offset: 2px;
    }
    .backend-status:active {
      transform: scale(0.98);
    }
    .backend-status.is-online {
      background: var(--km-pastel-green-bg);
      color: var(--km-pastel-green-text);
    }
    .backend-status.is-offline {
      background: var(--km-pastel-yellow-bg);
      color: var(--km-pastel-yellow-text);
    }
    .backend-status mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    .backend-status.is-checking mat-icon {
      animation: spin 1.2s linear infinite;
    }
    .backend-status-text {
      display: none;
    }
    @media (min-width: 400px) {
      .backend-status-text {
        display: inline;
      }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `],
})
export class BackendStatusComponent {
  readonly connectivity = inject(ConnectivityService);

  icon(): string {
    switch (this.connectivity.status()) {
      case 'online':
        return 'cloud';
      case 'offline':
        return 'cloud_off';
      default:
        return 'sync';
    }
  }

  shortLabel(): string {
    switch (this.connectivity.status()) {
      case 'online':
        return 'Sync';
      case 'offline':
        return 'Local';
      default:
        return '…';
    }
  }

  ariaLabel(): string {
    switch (this.connectivity.status()) {
      case 'online':
        return 'Conectado al servidor. Tocá para comprobar de nuevo.';
      case 'offline':
        return 'Sin servidor. Los datos quedan en este dispositivo. Tocá para reintentar.';
      default:
        return 'Comprobando el servidor…';
    }
  }

  onRefresh(): void {
    void this.connectivity.check({ showChecking: true });
  }
}
