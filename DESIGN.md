---
name: KMarket
description: Despensa editorial — PWA de pasillo, tinta negra sobre papel cálido
colors:
  tinta: "#111111"
  tinta-hover: "#333333"
  tinta-invertida: "#FFFFFF"
  papel: "#FBFBFA"
  superficie: "#FFFFFF"
  elevado: "#FAF9F6"
  borde: "#EAEAEA"
  texto-secundario: "#5C5B58"
  texto-apagado: "#6E6D6A"
  overlay: "rgba(0, 0, 0, 0.05)"
  pastel-amarillo-fondo: "#FBF3DB"
  pastel-amarillo-tinta: "#956400"
  pastel-verde-fondo: "#EDF3EC"
  pastel-verde-tinta: "#346538"
  pastel-rojo-fondo: "#FDEBEC"
  pastel-rojo-tinta: "#9F2F2D"
  pastel-azul-fondo: "#E1F3FE"
  pastel-azul-tinta: "#1F6C9F"
  pastel-gris-fondo: "#F1F1EF"
  pastel-gris-tinta: "#5A5A58"
typography:
  display:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "2rem"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "1.75rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body:
    fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif"
    fontSize: "0.725rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.03em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
  pill: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  touch: "48px"
components:
  button-primary:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.tinta-invertida}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.tinta-hover}"
    textColor: "{colors.tinta-invertida}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
    height: "48px"
  button-secondary:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
    height: "48px"
  badge:
    backgroundColor: "{colors.pastel-gris-fondo}"
    textColor: "{colors.pastel-gris-tinta}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "3px 10px"
  card:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.md}"
    padding: "16px"
  list-item:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.tinta}"
    padding: "14px 16px"
  input:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.sm}"
    padding: "12px 14px"
    height: "48px"
  nav-item:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.texto-secundario}"
    typography: "{typography.label}"
    height: "56px"
---

# Design System: KMarket

## Overview

**Creative North Star: "La despensa editorial"**

KMarket se lee como una revista de cocina impresa en papel cálido, no como un dashboard de inventario. El visitante está en el pasillo: una columna estrecha, títulos en Newsreader, cuerpo en sans de sistema, y un CTA de tinta negra. Los pasteles existen como recortes de revista (badges, selección, mensajes), nunca como la voz principal.

La densidad es de herramienta Operate: scanable, pocos pesos visuales, chrome mínimo. El carácter es refinado y contenido — radius pequeño, hover tonal, press `scale(0.98)`. No hay gradientes, no hay sombras de tarjeta, no hay acento saturado de marca. El negro (`tinta`) es el único gesto de autoridad.

Rechazos confirmados por el código: Material elevation, paleta de producto “tech” (azules de SaaS), botones pastel, layouts anchos de consola.

**Key Characteristics:**

- Columna única de 600px sobre papel `#FBFBFA`
- Newsreader solo en títulos, marca y hojas; SF Pro / sistema en UI
- Botón primario = tinta sobre blanco, no color de acento
- Pasteles emparejados fondo+tinta, solo en chips y estados semánticos
- Plano: borde 1px; profundidad por capas tonales
- Tema oscuro invertido: papel `#141413`, tinta `#F5F4F1` (mismas roles, otros hex)

## Colors

Paleta cálida monocroma con cinco pasteles semánticos. El acento de marca es la tinta, no un hue saturado.

### Primary

- **Tinta de despensa**: texto, iconos, checkbox marcado, indicador de tabs, botón primario, anillo de foco. En oscuro el rol se invierte a `#F5F4F1`.
- **Tinta hover** (`tinta-hover`): único alivio del CTA; no usar pasteles al hover.
- **Tinta invertida**: texto sobre botón primario (luz) / fondo del checkmark.

### Neutral

- **Papel**: canvas de página y `theme-color` del PWA.
- **Superficie**: header, nav inferior, cards, sheets, campos.
- **Elevado**: hover de fila, card de estado, snackbar, opción seleccionada — un tono más cálido que el blanco, no una sombra.
- **Borde**: hairline `#EAEAEA` (oscuro `#2E2E2B`).
- **Texto secundario / apagado**: jerarquía; nunca por debajo del contraste ya subido en polish (`#5C5B58` / `#6E6D6A` en luz).
- **Overlay**: velo al 5% para la única sombra permitida (sheet) y el aplastado de elevation Material.

### Secondary (pasteles — chips, no chrome)

Cada pastel es un par fondo + tinta. Usar siempre el par.

- **Amarillo**: sugerencias, selección de texto (`::selection`).
- **Verde**: estado ok / activo (marca del logo, badges positivos).
- **Rojo**: error, peligro, borrar; el botón destructivo usa `pastel-rojo-tinta` con texto blanco.
- **Azul**: información / sync, no links genéricos.
- **Gris**: V1, estados neutros, chip de backend.

**The Tinta Rule.** El único relleno de acción primaria es tinta. Los pasteles no pintan botones, fondos de pantalla ni navegación.

**The Pair Rule.** Un pastel de fondo siempre viaja con su tinta emparejada. No mezclar amarillo-fondo con verde-tinta.

## Typography

**Display Font:** Newsreader (Georgia)
**Body Font:** SF Pro Display / sistema (-apple-system, Segoe UI, Helvetica Neue)
**Icons:** Material Symbols Outlined, weight 500, fill 0, 24px (22px en bottom nav)

**Character:** Titular de revista sobre UI de utensilio. El serif da autoridad; el sans ejecuta la tarea. Letter-spacing negativo en títulos (`-0.02em`); tracking amplio solo en labels uppercase.

### Hierarchy

- **Display** (Newsreader 500, 2rem, -0.02em): título de Inicio.
- **Headline** (Newsreader 500, 1.75rem–1.8rem): paso del wizard, marca de login.
- **Title** (Newsreader 600, 1.35rem–1.5rem): wordmark del header, títulos de bottom sheet.
- **Body** (sans 0.95rem–1rem, line-height 1.5): párrafos, filas, descripciones. Vacíos: max ~28ch.
- **Label** (sans 0.725rem, 600, 0.03em, uppercase): badges. Chip de backend aún más chico (0.65rem, 0.05em). Nav inferior: 0.725rem, no uppercase, peso 600 solo en activo.

### Named Rules

**The Serif Title Rule.** Newsreader (`.font-serif`) solo en títulos, wordmark y sheets. Nunca en botones, campos, nav ni badges.

**The Measure Rule.** El cuerpo no se estira: contenedor 600px, vacíos ~28ch, nombres de producto con `overflow-wrap: anywhere`.

## Layout

Modelo espacial: **una columna de pasillo**. `.km-container` centra a `max-width: 600px` con padding 16px. Header, bottom nav y footer del wizard se anclan al viewport pero su contenido interno también se ciñe a 600px.

Ritmo: 8 / 12 / 16 / 20 / 24. Gaps de lista 12; padding de fila 14×16; sheets 24×20; cards de estado 24. Objetivos táctiles 44–48px (nav 56px). Safe-area en header (`padding-top`) y nav/footer (`padding-bottom`).

Chrome: header sticky + bottom nav fijos; se ocultan en login y en el wizard de compra. Un solo `<main id="contenido">` en el shell; skip-link al contenido. Padding inferior del main reserva la nav.

Breakpoints observados: subtítulo del header desde 480px; no hay layout de dos columnas de producto. Login se centra en viewport con card max 380px.

**The Aisle Rule.** Nada de producto usa más de 600px de medida. Si una pantalla pide “desktop wide”, es un error de sistema, no una excepción.

## Elevation & Depth

Sistema **plano por defecto**. Las superficies se distinguen por papel / superficie / elevado y un borde de 1px. Las clases `mat-elevation-z*` se aplastan a `0 1px 3px overlay` y las cards Material no llevan sombra.

La única sombra estructural es el bottom sheet: `0 -4px 20px overlay`, radio superior 16px, como papel que sube desde el borde inferior.

### Shadow Vocabulary

- **Sheet lift** (`box-shadow: 0 -4px 20px var(--km-overlay)`): solo `.mat-bottom-sheet-container`.
- **Elevation leftover** (`0 1px 3px overlay`): residuo de Material; no introducir sombras nuevas en cards.

### Named Rules

**The Flat-By-Default Rule.** En reposo, cero sombra de tarjeta. La profundidad es tonal (elevado) o un hairline. La sombra aparece cuando un sheet se levanta del pasillo.

## Shapes

Esquinas cortés, no juguetonas: **6px** controles (botones, inputs), **10px** cards y paneles, **16px** solo el labio superior del sheet, **pill** badges y chip de estado.

Bordes: 1px sólido `borde`. Sin dashed, sin grosor 2px salvo el anillo de foco (outline 2px tinta, offset 2px; en filas offset -2px).

Geometría recurrente: filas full-bleed con divisor inferior; sheets de formulario en columna con gap 16; badges pastilla.

**The Small Radius Rule.** Controles a 6px. 16px no es “card grande”; es el gesto del sheet.

## Components

Refinado y contenido: hover cambia tono, no elevación; active escala 0.98 en el primario; disabled opacity 0.4.

### Buttons

- **Shape:** 6px; peso 500; letter-spacing -0.01em; altura mínima 48px (`.km-flex-1` permite wrap).
- **Primary** (`.km-btn-primary`): tinta / tinta-invertida; hover `tinta-hover`; active `scale(0.98)`.
- **Secondary** (`.km-btn-secondary`, stroked): superficie, borde hairline; hover elevado.
- **Danger:** fondo `pastel-rojo-tinta`, texto blanco — solo confirmaciones destructivas.
- **Icon button:** tinta, sin relleno; nombre accesible con `.sr-only` dentro del botón (no `aria-label` bindeado en Angular 19).
- **Focus:** outline 2px tinta.

### Chips

- **Style:** `.km-badge` pastilla, 3px 10px, uppercase, 0.725rem / 600 / 0.03em. Variantes yellow / green / red / blue / gray con el par pastel.
- **State:** no hay chip “seleccionado” de filtro; el estado de fila usa fondo elevado, no un segundo borde.

### Cards / Containers

- **Corner:** 10px. **Background:** superficie. **Shadow:** none. **Border:** hairline. **Padding:** 16px (`.km-card`); 24px en la card de estado de Inicio (min-height 168px al cargar).
- Atajos de Inicio: misma card, flex, `min-width: 0`, hover y `:focus-visible` con borde muted + elevado.

### Inputs / Fields

- **Login (custom):** borde hairline, 6px, padding 12×14, min-height 48px, width 100%. Focus: outline 2px tinta, offset 1px. Error: texto `pastel-rojo-tinta` 0.85rem.
- **Admin (Material outlined):** outline `borde`, hover `texto-apagado`, focus `tinta`; label secundario.
- **Toggles:** track seleccionado = tinta; handle = canvas.

### Navigation

- **Header:** sticky, superficie + hairline inferior, wordmark Newsreader 1.35rem + badge gris V1, acciones a la derecha (estado backend, tema, logout).
- **Bottom nav:** fija, 56px + safe-area, dos destinos (Inicio / Administrar). Inactivo = texto secundario; activo = tinta + 600. Iconos 22px.
- **Wizard footer:** fija, primario + secundario; confirmación de Finalizar en el mismo footer (no diálogo nativo).
- **Tabs admin:** label secundario; activo e indicador = tinta.

### List item (signature)

Fila de despensa / catálogo: padding 14×16, divisor, `min-width: 0`. Seleccionada: fondo elevado. Un solo control por fila en el recorrido (checkbox visual, no anidado como botón). Focus inset.

### Bottom sheet (signature)

Formularios y confirmaciones. Título Newsreader 1.5rem, subtítulo 0.85rem secundario, acciones en fila con gap 12. Confirmación usa `role="alertdialog"`.

## Do's and Don'ts

### Do:

- **Do** usar tokens `--km-*` (o estos nombres de frontmatter) en lugar de hex sueltos.
- **Do** poner Newsreader solo en títulos y aplicar `.font-serif`.
- **Do** mantener la columna a 600px y objetivos táctiles ≥ 44px.
- **Do** emparejar cada pastel (fondo + tinta) y reservarlos a badges, selección y semántica.
- **Do** nombrar botones icono con `.sr-only`; `aria-label` estático vale en `<a>` y `<nav>`.
- **Do** respetar `prefers-reduced-motion`: sin view-transition names ni blur de página.

### Don't:

- **Don't** pintar el CTA de verde, azul o cualquier pastel.
- **Don't** añadir `box-shadow` a cards, header o nav.
- **Don't** introducir una segunda columna de contenido o un max-width de “dashboard”.
- **Don't** usar `[aria-label]` / `[attr.aria-label]` en `<button>` o `mat-icon-button` (NG8002).
- **Don't** anidar un checkbox interactivo dentro de una fila `role="button"`.
- **Don't** duplicar `<main>`: el wizard usa un `div`, no un landmark extra.
- **Don't** poner `user-scalable=no` en el viewport.
