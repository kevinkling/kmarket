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
    @if (!isLogin()) {
      <app-header></app-header>
    }
    <router-outlet></router-outlet>
    @if (!isLogin()) {
      <app-bottom-nav></app-bottom-nav>
    }
  `
})
export class AppComponent {
  private router = inject(Router);
  private theme = inject(ThemeService);

  readonly isLogin = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects.startsWith('/login')),
      startWith(this.router.url.startsWith('/login')),
    ),
    { initialValue: this.router.url.startsWith('/login') },
  );
}
