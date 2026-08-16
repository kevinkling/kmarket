import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { BackendStatusComponent } from '../backend-status/backend-status.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule, BackendStatusComponent],
  template: `
    <header class="header">
      <div class="header-container">
        <a routerLink="/" class="brand" aria-label="KMarket inicio">
          <span class="brand-mark" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none">
              <rect class="brand-accent" x="3" y="19" width="15" height="13" rx="3"/>
              <path
                stroke="currentColor"
                stroke-width="2.75"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10 23h20l-2.2 11H12.2L10 23z"
              />
              <path stroke="currentColor" stroke-width="2.75" stroke-linecap="round" d="M8.5 23h23"/>
              <path stroke="currentColor" stroke-width="2.25" stroke-linecap="round" d="M16.5 25.5v6M23.5 25.5v6"/>
              <path fill="currentColor" d="M14 7h4.6v9.4L26.4 7H31L23.2 17.4 31.6 33h-4.9L20.2 21.2V33H14V7z"/>
            </svg>
          </span>
          <span class="brand-title font-serif">KMarket</span>
          <span class="brand-badge km-badge km-badge-gray">V1</span>
        </a>
        <div class="header-actions">
          <span class="header-subtitle">Despensa inteligente</span>
          <app-backend-status></app-backend-status>
          <button
            mat-icon-button
            type="button"
            class="theme-toggle"
            [attr.aria-label]="theme.mode() === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo nocturno'"
            (click)="theme.toggle()"
          >
            <mat-icon>{{ theme.mode() === 'dark' ? 'light_mode' : 'dark_mode' }}</mat-icon>
          </button>
          <button
            mat-icon-button
            type="button"
            aria-label="Cerrar sesión"
            (click)="logout()"
            *ngIf="auth.isAuthenticated()"
          >
            <mat-icon>logout</mat-icon>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background-color: var(--km-bg-surface);
      border-bottom: var(--km-border);
      padding: 10px 12px 10px 20px;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .header-container {
      max-width: 600px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      color: var(--km-text-primary);
    }
    .brand-mark {
      display: inline-flex;
      width: 28px;
      height: 28px;
      flex-shrink: 0;
      color: var(--km-text-primary);
    }
    .brand-mark svg {
      width: 100%;
      height: 100%;
      display: block;
    }
    .brand-accent {
      fill: var(--km-pastel-green-bg);
    }
    .brand-title {
      font-size: 1.35rem;
      font-weight: 600;
      letter-spacing: -0.02em;
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .header-subtitle {
      font-size: 0.8rem;
      color: var(--km-text-secondary);
      font-weight: 400;
      display: none;
    }
    @media (min-width: 480px) {
      .header-subtitle {
        display: inline;
        margin-right: 4px;
      }
    }
    .theme-toggle {
      color: var(--km-text-primary);
    }
  `]
})
export class HeaderComponent {
  constructor(public theme: ThemeService, public auth: AuthService) {}

  logout(): void {
    this.auth.logout();
  }
}
