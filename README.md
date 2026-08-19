<p align="center">
  <img src="apps/frontend/public/icons/logo.svg" alt="KMarket" width="96" height="96">
</p>

# KMarket

PWA offline-first para administrar la despensa y preparar la compra mensual, con sync familiar vía PocketBase.

## Stack

- Frontend: Angular 19 PWA + Dexie (IndexedDB)
- Backend: PocketBase en Docker
- Uso: una familia, varios dispositivos, mismos datos

## Credenciales (local)

| Rol | Dónde se usa | Email | Contraseña |
| --- | --- | --- | --- |
| Superusuario | Admin de PocketBase (`http://localhost:8090/_/`) | `admin@kmarket.local` | `kmarket123` |
| Familia | PWA (`http://localhost:4200/` o GitHub Pages) | `kevin@kmarket.com` | `kmarket123` |

El superusuario **no** entra en la PWA. La PWA usa cuentas de Collections → users.

Si el admin pide login y no tenés el superusuario:

```bash
docker exec kmarket_pocketbase /pb/pocketbase superuser upsert admin@kmarket.local kmarket123 --dir=/pb/pb_data
```

## Estructura

```
apps/frontend   Angular PWA
apps/backend    PocketBase (Dockerfile + migraciones)
deploy/         Caddyfile de ejemplo para HTTPS
```

## Cómo probar en local

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Levantar PocketBase

Hace falta Docker Desktop.

```bash
docker compose up --build
```

- API: [http://localhost:8090](http://localhost:8090)
- Admin: [http://localhost:8090/_/](http://localhost:8090/_/)

### 3. Levantar la PWA

```bash
pnpm dev:frontend
```

Abrí [http://localhost:4200/](http://localhost:4200/). La despensa se usa sin cuenta. Para sincronizar, iniciá sesión con `kevin@kmarket.com` / `kmarket123`.

### 4. Probar sync

Entrá en un navegador, marcá un producto, y en una ventana privada usá la misma cuenta. El cambio debería aparecer en el otro lado.

## ¿Y si el backend está apagado?

**Sí podés seguir usando la app**, con matices:

- Dexie guarda todo en el navegador. Productos, categorías y la lista de compra siguen ahí.
- No hace falta cuenta para usar este dispositivo: el login es solo para sync familiar.
- Si ya hay sesión, la PWA refresca el JWT cuando hay red (token de 90 días).
- Cuando PocketBase vuelva y haya sesión, se sincroniza solo.
- **Sí hace falta backend:** el primer login de la cuenta familiar, o si la sesión se invalidó y querés volver a sincronizar.

Es offline-first: PocketBase es la fuente compartida entre dispositivos, no un requisito para cada toque.

## Deploy

El frontend en GitHub Pages es HTTPS (`https://kevinkling.github.io/kmarket/`). El backend en tu PC, en crudo, es HTTP en `localhost:8090`. Eso **no alcanza** para la PWA publicada:

- `localhost` en el celular es el celular, no tu PC.
- Una página HTTPS no puede llamar a una API HTTP (mixed content).

### Frontend (igual que ahora)

Push a `main` publica GitHub Pages. Antes, poné la URL **HTTPS** pública de PocketBase en [apps/frontend/src/environments/environment.prod.ts](apps/frontend/src/environments/environment.prod.ts):

```ts
export const environment = {
  production: true,
  apiUrl: 'https://pb.tudominio.com',
};
```

### Backend en casa

Dejá Docker corriendo y exponé PocketBase con HTTPS. **No uses ngrok y Cloudflare a la vez**: son dos túneles distintos.

- **Cloudflare Tunnel** (recomendado, sin abrir puertos): [deploy/cloudflare-tunnel.md](deploy/cloudflare-tunnel.md)
- **Caddy** si ya tenés dominio y puertos 80/443 abiertos: [deploy/Caddyfile.example](deploy/Caddyfile.example)

Si apagás la PC o Docker, el resto de la familia sigue usando **lo último que sincronizó** cada dispositivo. Los cambios se suben cuando el backend vuelva.

### Si no querés exponer el backend a internet

Opciones: Tailscale (solo tus dispositivos), o usar la PWA solo en local (`pnpm dev:frontend` + Docker). GitHub Pages no va a poder hablar con `localhost`.

## Más detalle

- [Frontend](apps/frontend/README.md)
- [Backend](apps/backend/README.md)
