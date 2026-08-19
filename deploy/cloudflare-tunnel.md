# Cloudflare Tunnel para PocketBase

No hace falta ngrok. Ngrok y Cloudflare Tunnel hacen lo mismo (exponer `localhost:8090` con HTTPS). Para algo que queda prendido en casa, Tunnel es mejor: hostname estable y HTTPS incluido.

Caddy (el `Caddyfile.example`) es otro camino: abre puertos 80/443 en el router. Tunnel no abre puertos.

## Opción A — prueba rápida (como ngrok)

Sin dominio. La URL cambia cada vez que reiniciás el túnel.

1. Instalá [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/).
2. Con PocketBase ya corriendo (`docker compose up -d`):

```bash
cloudflared tunnel --url http://localhost:8090
```

3. Copiá la URL `https://….trycloudflare.com` a `apps/frontend/src/environments/environment.prod.ts` (`apiUrl`) y volvé a publicar GitHub Pages.

Sirve para probar el celular. No lo uses como setup definitivo.

## Opción B — túnel fijo (recomendado)

Hace falta una cuenta Cloudflare y un dominio (puede ser barato; Cloudflare DNS).

```bash
cloudflared tunnel login
cloudflared tunnel create kmarket
```

Anotá el Tunnel ID. En `~/.cloudflared/config.yml` (o `%USERPROFILE%\.cloudflared\config.yml` en Windows):

```yaml
tunnel: kmarket
credentials-file: C:\Users\PC\.cloudflared\<TUNNEL_ID>.json

ingress:
  - hostname: pb.tudominio.com
    service: http://localhost:8090
  - service: http_status:404
```

```bash
cloudflared tunnel route dns kmarket pb.tudominio.com
cloudflared tunnel run kmarket
```

Para que arranque con Windows: `cloudflared service install`.

Después:

1. `apiUrl: 'https://pb.tudominio.com'` en `environment.prod.ts`
2. Push a `main` (GitHub Pages)
3. En PocketBase Admin → Settings → Application, si hay “URL” o CORS, dejá el origen de la PWA (`https://kevinkling.github.io`)

PocketBase suele permitir cualquier origen; si el login falla por CORS, revisá eso.

## Qué tiene que estar prendido

| Proceso | Para qué |
| --- | --- |
| Docker (`kmarket_pocketbase`) | API y sync |
| `cloudflared tunnel run` | HTTPS público hacia tu PC |

Si se apaga alguno de los dos, la familia sigue con los datos locales; el login nuevo y el sync esperan a que vuelvan. La PWA se puede usar sin cuenta en cada dispositivo.
