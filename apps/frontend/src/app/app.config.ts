import { ApplicationConfig, APP_INITIALIZER, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideServiceWorker } from '@angular/service-worker';
import { routes } from './app.routes';
import {
  CategoriaRepository,
  EstadoProductoRepository,
  ProductoRepository,
  SeedMetaRepository,
} from './domain';
import {
  DexieCategoriaRepository,
  DexieEstadoProductoRepository,
  DexieProductoRepository,
  DexieSeedMetaRepository,
} from './infrastructure/persistence';
import { ImportarSeedInicialUseCase } from './application';
import { SyncService } from './infrastructure/sync/sync.service';
import { ConnectivityService } from './core/services/connectivity.service';

export function initializeApp(
  seedUseCase: ImportarSeedInicialUseCase,
  syncService: SyncService,
  connectivity: ConnectivityService,
) {
  return async () => {
    await seedUseCase.ejecutar();
    void connectivity.check();
    syncService.init();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions({ skipInitialTransition: true })),
    provideAnimationsAsync(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    { provide: CategoriaRepository, useClass: DexieCategoriaRepository },
    { provide: ProductoRepository, useClass: DexieProductoRepository },
    { provide: EstadoProductoRepository, useClass: DexieEstadoProductoRepository },
    { provide: SeedMetaRepository, useClass: DexieSeedMetaRepository },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ImportarSeedInicialUseCase, SyncService, ConnectivityService],
      multi: true,
    },
  ],
};
