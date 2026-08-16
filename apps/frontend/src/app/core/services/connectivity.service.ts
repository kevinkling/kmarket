import { Injectable, computed, signal } from '@angular/core';
import { pb } from '../../infrastructure/pocketbase/pocketbase-client';

export type BackendStatus = 'checking' | 'online' | 'offline';

const POLL_MS = 15_000;
const PING_TIMEOUT_MS = 4_000;

@Injectable({ providedIn: 'root' })
export class ConnectivityService {
  readonly status = signal<BackendStatus>('checking');
  readonly connected = computed(() => this.status() === 'online');

  constructor() {
    window.addEventListener('online', () => {
      void this.check();
    });
    window.addEventListener('offline', () => {
      this.status.set('offline');
    });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        void this.check();
      }
    });
    window.setInterval(() => {
      void this.check();
    }, POLL_MS);
  }

  async check(options?: { showChecking?: boolean }): Promise<boolean> {
    if (!navigator.onLine) {
      this.status.set('offline');
      return false;
    }

    if (options?.showChecking) {
      this.status.set('checking');
    }

    try {
      await Promise.race([
        pb.health.check(),
        new Promise<never>((_, reject) => {
          window.setTimeout(() => reject(new Error('timeout')), PING_TIMEOUT_MS);
        }),
      ]);
      this.status.set('online');
      return true;
    } catch {
      this.status.set('offline');
      return false;
    }
  }
}
