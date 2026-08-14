import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { pb } from '../../infrastructure/pocketbase/pocketbase-client';
import { User } from '../entities/user.entity';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.parseUser(pb.authStore.model));
    this.currentUser = this.currentUserSubject.asObservable();

    // Escucha cambios en el authStore de PocketBase
    pb.authStore.onChange(() => {
      this.currentUserSubject.next(this.parseUser(pb.authStore.model));
    }, true);
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  async login(email: string, password: string): Promise<void> {
    try {
      await pb.collection('users').authWithPassword(email, password);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error de login:', error);
      throw error; // Re-lanza el error para que el componente lo maneje
    }
  }

  logout(): void {
    pb.authStore.clear();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return pb.authStore.isValid;
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