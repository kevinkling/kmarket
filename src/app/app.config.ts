import { ApplicationConfig, APP_INITIALIZER, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
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

export function initializeApp(seedUseCase: ImportarSeedInicialUseCase) {
  return () => seedUseCase.ejecutar();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
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
      deps: [ImportarSeedInicialUseCase],
      multi: true,
    },
  ],
};
