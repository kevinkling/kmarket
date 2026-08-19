# KMarket frontend

PWA Angular offline-first. Persistencia local con Dexie; PocketBase es opcional para sync familiar.

La app se abre en modo local. `/login` sincroniza con la cuenta de la familia cuando el backend está disponible.

## Desarrollo

Desde la raíz del monorepo:

```bash
pnpm install
pnpm dev:frontend
```

App local: http://localhost:4200/

Login de la PWA: `kevin@kmarket.com` / `kmarket123`

El backend hace falta para sincronizar, no para usar la despensa en este dispositivo. PocketBase local: http://localhost:8090 (ver el README raíz).

## Deploy (GitHub Pages)

El push a `main` dispara el workflow y publica en:

**https://kevinkling.github.io/kmarket/**

Antes del build de producción, `apiUrl` en `src/environments/environment.prod.ts` tiene que ser la URL **HTTPS** pública de PocketBase. GitHub Pages no puede usar `http://localhost:8090`.

Build manual:

```bash
pnpm --filter frontend run build:gh-pages
```
