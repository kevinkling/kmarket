import { Injectable, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ClientResponseError } from 'pocketbase';
import { pb } from '../../infrastructure/pocketbase/pocketbase-client';
import { User } from '../entities/user.entity';
import { ConnectivityService } from './connectivity.service';

const REFRESH_IF_EXPIRES_WITHIN_MS = 14 * 24 * 60 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private connectivity = inject(ConnectivityService);

  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  readonly sessionValid = signal(pb.authStore.isValid);

  private refreshing = false;
  private refreshedThisSession = false;

  constructor() {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.parseUser(pb.authStore.model));
    this.currentUser = this.currentUserSubject.asObservable();

    pb.authStore.onChange(() => {
      this.currentUserSubject.next(this.parseUser(pb.authStore.model));
      this.sessionValid.set(pb.authStore.isValid);
    }, true);

    effect(() => {
      if (this.connectivity.connected()) {
        void this.refreshIfNeeded();
      }
    });
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  async login(email: string, password: string): Promise<void> {
    try {
      await pb.collection('users').authWithPassword(email, password);
      this.refreshedThisSession = true;
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error de login:', error);
      throw error;
    }
  }

  logout(): void {
    pb.authStore.clear();
    this.refreshedThisSession = false;
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return pb.authStore.isValid;
  }

  async refreshIfNeeded(): Promise<void> {
    if (this.refreshing || !pb.authStore.token || !this.connectivity.connected()) {
      return;
    }

    if (!this.shouldRefreshToken()) {
      return;
    }

    this.refreshing = true;
    try {
      await pb.collection('users').authRefresh();
      this.refreshedThisSession = true;
    } catch (error) {
      const status = error instanceof ClientResponseError ? error.status : 0;
      if (status === 401 || status === 403) {
        pb.authStore.clear();
        this.refreshedThisSession = false;
      }
    } finally {
      this.refreshing = false;
    }
  }

  private shouldRefreshToken(): boolean {
    if (!this.refreshedThisSession) {
      return true;
    }

    const expiresAt = this.tokenExpiryMs();
    if (expiresAt === null) {
      return true;
    }

    return expiresAt - Date.now() < REFRESH_IF_EXPIRES_WITHIN_MS;
  }

  private tokenExpiryMs(): number | null {
    const token = pb.authStore.token;
    if (!token) {
      return null;
    }

    try {
      const payload = token.split('.')[1];
      if (!payload) {
        return null;
      }
      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      const json = JSON.parse(atob(normalized));
      return typeof json.exp === 'number' ? json.exp * 1000 : null;
    } catch {
      return null;
    }
  }

  private parseUser(model: any): User | null {
    if (!model) {
      return null;
    }
    return {
      id: model.id,
      email: model.email,
      username: model.username,
      avatar: model.avatar,
    };
  }
}
