# KMarket backend (PocketBase)

PocketBase en Docker: autenticación, SQLite, API REST y realtime.

## Levantar

Desde la raíz del monorepo:

```bash
docker compose up --build
```

- API: http://localhost:8090
- Admin: http://localhost:8090/_/

## Credenciales (local)

| Rol | Email | Contraseña |
| --- | --- | --- |
| Superusuario (admin `/_/`) | `admin@kmarket.local` | `kmarket123` |
| PWA | `kevin@kmarket.com` | `kmarket123` |

```bash
docker exec kmarket_pocketbase /pb/pocketbase superuser upsert admin@kmarket.local kmarket123 --dir=/pb/pb_data
```

El usuario de la PWA se crea en Admin → Collections → users (registro público cerrado).

Los datos quedan en `apps/backend/pb_data/` (gitignored).

## Usuarios de la familia

El registro público está cerrado. Creá cada cuenta en Admin → Collections → users.

## Backup

Con el contenedor detenido, copiá la carpeta `apps/backend/pb_data`.
También podés usar Settings → Backups en el admin.

## Cómo agregar un campo

PocketBase no es un ORM: el esquema no se sincroniza solo. Hay que tocarlo en tres capas.

Ejemplo: agregar `notas` a productos.

1. **PocketBase**
   - Admin UI: Collections → productos → New field, o
   - Nueva migración en `pb_migrations/` (timestamp + nombre). Al redesplegar, PocketBase aplica las pendientes. Agregar un campo no borra datos.
2. **Dexie** (`apps/frontend/src/app/infrastructure/persistence/kmarket.db.ts`)
   - Subí `this.version(n + 1)`.
   - Agregá el campo al `stores` de `productos`.
   - Si hace falta, `.upgrade()` para rellenar valores viejos.
3. **Angular**
   - Entidad `Producto`
   - Tipo de tabla Dexie
   - Mapeo en `SyncService`

Campos automáticos de PocketBase: `id`, `created`, `updated`. El `updated` se usa para last-write-wins.
