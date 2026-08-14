# KMarket frontend

PWA Angular offline-first. Persistencia local con Dexie; sync con PocketBase cuando hay sesión.

## Desarrollo

Desde la raíz del monorepo:

```bash
pnpm install
pnpm dev:frontend
```

App local: http://localhost:4200/

Login de la PWA: `kevin@kmarket.com` / `kmarket123`

El backend tiene que estar en http://localhost:8090 (ver el README raíz).

## Deploy (GitHub Pages)

El push a `main` dispara el workflow y publica en:

**https://kevinkling.github.io/kmarket/**

Antes del build de producción, `apiUrl` en `src/environments/environment.prod.ts` tiene que ser la URL **HTTPS** pública de PocketBase. GitHub Pages no puede usar `http://localhost:8090`.

Build manual:

```bash
pnpm --filter frontend run build:gh-pages
```
