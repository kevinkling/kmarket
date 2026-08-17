import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <nav class="bottom-nav" aria-label="Navegación principal">
      <div class="nav-container">
        <a
          routerLink="/"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{exact: true}"
          ariaCurrentWhenActive="page"
          class="nav-item"
        >
          <mat-icon>home</mat-icon>
          <span>Inicio</span>
        </a>
        <a
          routerLink="/administracion"
          routerLinkActive="active"
          ariaCurrentWhenActive="page"
          class="nav-item"
        >
          <mat-icon>tune</mat-icon>
          <span>Administrar</span>
        </a>
      </div>
    </nav>
  `,
  styles: [`
    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: var(--km-bg-surface);
      border-top: var(--km-border);
      z-index: 99;
      padding-bottom: env(safe-area-inset-bottom);
    }
    .nav-container {
      max-width: 600px;
      margin: 0 auto;
      display: flex;
      min-height: 56px;
    }
    .nav-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      color: var(--km-text-secondary);
      font-size: 0.725rem;
      gap: 3px;
      min-height: 56px;
      transition: color 0.15s ease;

      mat-icon {
        font-size: 22px;
        width: 22px;
        height: 22px;
      }

      &.active {
        color: var(--km-text-primary);
        font-weight: 600;
      }
    }
  `]
})
export class BottomNavComponent {}
