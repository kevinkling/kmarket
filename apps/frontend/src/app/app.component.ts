import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { HeaderComponent } from './core/components/header/header.component';
import { BottomNavComponent } from './core/components/bottom-nav/bottom-nav.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, BottomNavComponent],
  template: `
    <a class="skip-link" href="#contenido">Ir al contenido</a>
    @if (!hideChrome()) {
      <app-header></app-header>
    }
    <main
      id="contenido"
      class="app-main"
      [class.app-main--chrome]="!hideChrome()"
      tabindex="-1"
    >
      <router-outlet></router-outlet>
    </main>
    @if (!hideChrome()) {
      <app-bottom-nav></app-bottom-nav>
    }
  `,
  styles: [`
    .skip-link {
      position: absolute;
      left: 12px;
      top: 12px;
      z-index: 400;
      transform: translateY(-160%);
      padding: 10px 14px;
      border-radius: var(--km-radius-sm);
      background: var(--km-btn-primary-bg);
      color: var(--km-btn-primary-text);
      font-size: 0.9rem;
      font-weight: 600;
      text-decoration: none;
    }
    .skip-link:focus {
      transform: none;
    }
    .app-main {
      min-height: 100%;
      outline: none;
    }
    .app-main--chrome {
      padding-bottom: calc(64px + env(safe-area-inset-bottom, 0px));
    }
  `],
})
export class AppComponent {
  private router = inject(Router);
  private theme = inject(ThemeService);

  readonly hideChrome = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => this.shouldHideChrome(event.urlAfterRedirects)),
      startWith(this.shouldHideChrome(this.router.url)),
    ),
    { initialValue: this.shouldHideChrome(this.router.url) },
  );

  private shouldHideChrome(url: string): boolean {
    return url.startsWith('/login') || url.includes('/preparar-compra');
  }
}
