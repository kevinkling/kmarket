import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/header/header.component';
import { BottomNavComponent } from './core/components/bottom-nav/bottom-nav.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, BottomNavComponent],
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
    <app-bottom-nav></app-bottom-nav>
  `
})
export class AppComponent {
  constructor(private theme: ThemeService) {}
}
