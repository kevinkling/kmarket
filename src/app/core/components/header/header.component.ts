import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule],
  template: `
    <header class="header">
      <div class="header-container">
        <a routerLink="/" class="brand">
          <span class="brand-title font-serif">KMarket</span>
          <span class="brand-badge km-badge km-badge-gray">V1</span>
        </a>
        <div class="header-actions">
          <span class="header-subtitle">Despensa inteligente</span>
          <button
            mat-icon-button
            type="button"
            class="theme-toggle"
            [attr.aria-label]="theme.mode() === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo nocturno'"
            (click)="theme.toggle()"
          >
            <mat-icon>{{ theme.mode() === 'dark' ? 'light_mode' : 'dark_mode' }}</mat-icon>
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
  constructor(public theme: ThemeService) {}
}
