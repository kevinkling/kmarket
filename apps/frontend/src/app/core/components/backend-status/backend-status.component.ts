import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ConnectivityService } from '../../services/connectivity.service';
import { AuthService } from '../../services/auth.service';

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
      <mat-icon aria-hidden="true">{{ icon() }}</mat-icon>
      <span class="sr-only">{{ ariaLabel() }}</span>
    </button>
  `,
  styles: [`
    .backend-status {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      padding: 0;
      border: 0;
      border-radius: var(--km-radius-sm);
      background: transparent;
      color: var(--km-text-muted);
      cursor: pointer;
    }
    .backend-status:focus-visible {
      outline: 2px solid var(--km-text-primary);
      outline-offset: 2px;
    }
    .backend-status:active {
      transform: scale(0.98);
    }
    .backend-status.is-online {
      color: var(--km-pastel-green-text);
    }
    .backend-status.is-offline {
      color: var(--km-pastel-yellow-text);
    }
    .backend-status mat-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
    }
    .backend-status.is-checking mat-icon {
      animation: spin 1.2s linear infinite;
    }
    @media (prefers-reduced-motion: reduce) {
      .backend-status.is-checking mat-icon {
        animation: none;
      }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `],
})
export class BackendStatusComponent {
  readonly connectivity = inject(ConnectivityService);
  private auth = inject(AuthService);

  private syncing(): boolean {
    return this.connectivity.status() === 'online' && this.auth.sessionValid();
  }

  icon(): string {
    switch (this.connectivity.status()) {
      case 'online':
        return this.syncing() ? 'cloud_sync' : 'cloud';
      case 'offline':
        return 'cloud_off';
      default:
        return 'sync';
    }
  }

  ariaLabel(): string {
    switch (this.connectivity.status()) {
      case 'online':
        return this.syncing()
          ? 'Sincronizando con el servidor. Tocá para comprobar de nuevo.'
          : 'Servidor disponible. Entrá con la cuenta familiar para sincronizar. Tocá para comprobar de nuevo.';
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
