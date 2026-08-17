import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { ConnectivityService } from '../../../core/services/connectivity.service';
import { ThemeService } from '../../../core/services/theme.service';
import { BackendStatusComponent } from '../../../core/components/backend-status/backend-status.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, BackendStatusComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  readonly connectivity = inject(ConnectivityService);
  readonly theme = inject(ThemeService);

  readonly submitting = signal(false);
  readonly errorMessage = signal('');
  readonly attempted = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
    password: ['', [Validators.required, Validators.maxLength(128)]],
  });

  showEmailError(): boolean {
    const control = this.loginForm.controls.email;
    return this.attempted() && control.invalid;
  }

  showPasswordError(): boolean {
    const control = this.loginForm.controls.password;
    return this.attempted() && control.invalid;
  }

  async onSubmit(): Promise<void> {
    this.attempted.set(true);
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid || this.submitting()) {
      return;
    }

    if (!this.connectivity.connected()) {
      this.errorMessage.set('El servidor no está disponible. El login necesita PocketBase en marcha. Podés reintentar cuando vuelva.');
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set('');
    this.loginForm.disable();
    const { email, password } = this.loginForm.getRawValue();

    try {
      await this.authService.login(email!, password!);
    } catch {
      this.errorMessage.set('Email o contraseña incorrectos. Revisá los datos e intentá de nuevo.');
      this.loginForm.enable();
      this.submitting.set(false);
    }
  }
}
