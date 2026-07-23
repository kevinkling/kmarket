import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import {
  IniciarPreparacionDeCompraUseCase,
  ObtenerSugerenciasUseCase,
  ObtenerListaDeCompraUseCase,
} from '../../application';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <div class="km-container page-home">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="subtitle font-serif">Tu despensa</div>
        <h1 class="title font-serif">Estado de la compra</h1>
        <p class="description">
          KMarket no administra listas. Controla tu despensa y sugiere lo que necesitas reponer.
        </p>
      </section>

      <!-- Main Status Card -->
      <div class="km-card status-card">
        <div class="status-header">
          <span class="km-badge km-badge-yellow" *ngIf="sugeridosCount > 0">
            <mat-icon style="font-size: 14px; width: 14px; height: 14px;">auto_awesome</mat-icon>
            {{ sugeridosCount }} sugerencias hoy
          </span>
          <span class="km-badge km-badge-green" *ngIf="sugeridosCount === 0">
            <mat-icon style="font-size: 14px; width: 14px; height: 14px;">check_circle</mat-icon>
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

        <div class="status-actions">
          <button
            mat-flat-button
            class="km-btn-primary full-width cta-button"
            (click)="iniciarPreparacion()"
          >
            <mat-icon>shopping_cart_checkout</mat-icon>
            {{ enProgresoCount > 0 ? 'Continuar compra' : 'Preparar compra' }}
          </button>
        </div>
      </div>

      <!-- Quick Actions Grid -->
      <div class="quick-grid">
        <div class="km-card grid-card" routerLink="/administracion/productos">
          <div class="card-icon">
            <mat-icon>inventory_2</mat-icon>
          </div>
          <div class="card-info">
            <h3>Productos</h3>
            <p>Administra el catálogo de tu despensa</p>
          </div>
          <mat-icon class="arrow">chevron_right</mat-icon>
        </div>

        <div class="km-card grid-card" routerLink="/administracion/categorias">
          <div class="card-icon">
            <mat-icon>category</mat-icon>
          </div>
          <div class="card-info">
            <h3>Categorías</h3>
            <p>Organiza las secciones del recorrido</p>
          </div>
          <mat-icon class="arrow">chevron_right</mat-icon>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-home {
      padding-bottom: 80px;
    }
    .hero-section {
      margin-top: 12px;
      margin-bottom: 24px;
    }
    .subtitle {
      font-size: 1.1rem;
      color: var(--km-text-secondary);
      font-style: italic;
    }
    .title {
      font-size: 2rem;
      font-weight: 500;
      margin: 4px 0 8px 0;
      letter-spacing: -0.02em;
    }
    .description {
      color: var(--km-text-secondary);
      font-size: 0.95rem;
      line-height: 1.5;
      margin: 0;
    }

    .status-card {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 24px;
      padding: 24px;
    }
    .status-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
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

    .quick-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .grid-card {
      display: flex;
      align-items: center;
      gap: 16px;
      cursor: pointer;
      transition: border-color 0.15s ease, background-color 0.15s ease;

      &:hover {
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

      h3 {
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
    this.sugeridosCount = await this.obtenerSugerenciasUseCase.obtenerConteo();
    const lista = await this.obtenerListaCompraUseCase.obtenerAgrupadoPorCategoria(true);
    this.enProgresoCount = lista.reduce((acc, cat) => acc + cat.items.length, 0);
  }

  async iniciarPreparacion(): Promise<void> {
    if (this.enProgresoCount === 0) {
      await this.iniciarPreparacionUseCase.ejecutar();
    }
    this.router.navigate(['/preparar-compra']);
  }
}
