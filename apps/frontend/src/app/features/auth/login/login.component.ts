import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { ConnectivityService } from '../../../core/services/connectivity.service';
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

  readonly submitting = signal(false);
  readonly errorMessage = signal('');

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid || this.submitting()) {
      return;
    }

    if (!this.connectivity.connected()) {
      this.errorMessage.set('El servidor no está disponible. El login necesita PocketBase en marcha.');
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set('');
    const { email, password } = this.loginForm.value;

    try {
      await this.authService.login(email!, password!);
    } catch {
      this.errorMessage.set('Email o contraseña incorrectos.');
    } finally {
      this.submitting.set(false);
    }
  }
}
