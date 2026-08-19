import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  IniciarPreparacionDeCompraUseCase,
  ObtenerSugerenciasUseCase,
  ObtenerListaDeCompraUseCase,
} from '../../application';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="km-container page-home">
      <section class="hero-section">
        <h1 class="title font-serif">Estado de la compra</h1>
        <p class="description">
          KMarket no administra listas. Controla tu despensa y sugiere lo que necesitas reponer.
        </p>
        <a *ngIf="!auth.sessionValid()" routerLink="/login" class="local-hint">
          Esta despensa queda en este dispositivo. Entrá para sincronizar con la familia.
        </a>
      </section>

      <div class="km-card status-card" [attr.aria-busy]="cargando">
        <ng-container *ngIf="!cargando; else loadingHome">
          <div class="status-header">
            <span class="km-badge km-badge-yellow" *ngIf="sugeridosCount > 0">
              <mat-icon class="badge-icon">auto_awesome</mat-icon>
              {{ sugeridosCount }} sugerencias hoy
            </span>
            <span class="km-badge km-badge-green" *ngIf="sugeridosCount === 0">
              <mat-icon class="badge-icon">check_circle</mat-icon>
              Despensa al día
            </span>
          </div>

          <div class="status-body">
            <div class="metric">
              <span class="metric-number">{{ sugeridosCount }}</span>
              <span class="metric-label">
                {{ sugeridosCount === 1 ? 'producto sugerido para reponer' : 'productos sugeridos para reponer' }}
              </span>
            </div>

            <div class="metric-secondary" *ngIf="enProgresoCount > 0">
              <span class="km-badge km-badge-blue">
                {{ enProgresoCount }} marcados en la lista actual
              </span>
            </div>
          </div>

          <div class="status-actions km-vt-stage">
            <button
              mat-flat-button
              class="km-btn-primary full-width cta-button"
              type="button"
              (click)="iniciarPreparacion()"
            >
              <mat-icon>shopping_cart_checkout</mat-icon>
              {{ enProgresoCount > 0 ? 'Continuar compra' : 'Preparar compra' }}
            </button>
          </div>
        </ng-container>
        <ng-template #loadingHome>
          <p class="km-loading">Cargando tu despensa…</p>
        </ng-template>
      </div>

      <div class="quick-grid">
        <a class="km-card grid-card" routerLink="/administracion/productos">
          <div class="card-icon" aria-hidden="true">
            <mat-icon>inventory_2</mat-icon>
          </div>
          <div class="card-info">
            <h2>Productos</h2>
            <p>Administra el catálogo de tu despensa</p>
          </div>
          <mat-icon class="arrow" aria-hidden="true">chevron_right</mat-icon>
        </a>

        <a class="km-card grid-card" routerLink="/administracion/categorias">
          <div class="card-icon" aria-hidden="true">
            <mat-icon>category</mat-icon>
          </div>
          <div class="card-info">
            <h2>Categorías</h2>
            <p>Organiza las secciones del recorrido</p>
          </div>
          <mat-icon class="arrow" aria-hidden="true">chevron_right</mat-icon>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .page-home {
      padding-bottom: 16px;
    }
    .hero-section {
      margin-top: 12px;
      margin-bottom: 24px;
    }
    .title {
      font-size: 2rem;
      font-weight: 500;
      margin: 0 0 8px;
      letter-spacing: -0.02em;
    }
    .description {
      color: var(--km-text-secondary);
      font-size: 0.95rem;
      line-height: 1.5;
      margin: 0;
      overflow-wrap: anywhere;
    }
    .local-hint {
      display: block;
      margin-top: 10px;
      color: var(--km-text-secondary);
      font-size: 0.85rem;
      line-height: 1.45;
      text-decoration: underline;
      text-underline-offset: 3px;
    }

    .status-card {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 24px;
      padding: 24px;
      min-height: 168px;
    }
    .status-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .badge-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }
    .status-body {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .metric {
      display: flex;
      align-items: baseline;
      gap: 12px;
    }
    .metric-number {
      font-size: 3rem;
      font-weight: 700;
      line-height: 1;
      letter-spacing: -0.03em;
    }
    .metric-label {
      font-size: 0.95rem;
      color: var(--km-text-secondary);
      overflow-wrap: anywhere;
    }
    .full-width {
      width: 100%;
      height: 48px;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .km-vt-stage {
      width: 100%;
    }

    .quick-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .grid-card {
      display: flex;
      align-items: center;
      gap: 16px;
      min-width: 0;
      text-decoration: none;
      color: inherit;
      cursor: pointer;
      transition: border-color 0.15s ease, background-color 0.15s ease;

      &:hover,
      &:focus-visible {
        border-color: var(--km-text-muted);
        background-color: var(--km-bg-elevated);
      }
    }
    .card-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background-color: var(--km-pastel-gray-bg);
      color: var(--km-text-primary);
      display: flex;
      align-items: center;
      justify-content: center;

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }
    .card-info {
      flex: 1;
      min-width: 0;

      h2 {
        margin: 0 0 2px 0;
        font-size: 0.95rem;
        font-weight: 600;
      }
      p {
        margin: 0;
        font-size: 0.8rem;
        color: var(--km-text-secondary);
      }
    }
    .arrow {
      color: var(--km-text-muted);
    }
  `]
})
export class HomeComponent implements OnInit {
  sugeridosCount = 0;
  enProgresoCount = 0;
  cargando = true;
  readonly auth = inject(AuthService);

  constructor(
    private router: Router,
    private obtenerSugerenciasUseCase: ObtenerSugerenciasUseCase,
    private iniciarPreparacionUseCase: IniciarPreparacionDeCompraUseCase,
    private obtenerListaCompraUseCase: ObtenerListaDeCompraUseCase
  ) {}

  async ngOnInit(): Promise<void> {
    await this.cargarDatos();
  }

  async cargarDatos(): Promise<void> {
    this.cargando = true;
    try {
      this.sugeridosCount = await this.obtenerSugerenciasUseCase.obtenerConteo();
      const lista = await this.obtenerListaCompraUseCase.obtenerAgrupadoPorCategoria(true);
      this.enProgresoCount = lista.reduce((acc, cat) => acc + cat.items.length, 0);
    } finally {
      this.cargando = false;
    }
  }

  async iniciarPreparacion(): Promise<void> {
    if (this.enProgresoCount === 0) {
      await this.iniciarPreparacionUseCase.ejecutar();
    }
    this.router.navigate(['/preparar-compra']);
  }
}
