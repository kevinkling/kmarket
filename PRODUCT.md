# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Kevin, solo, por ahora. Usa KMarket en casa o en el súper para controlar la despensa y armar la compra. La familia es una audiencia posible más adelante, no la actual.

## Product Purpose

KMarket es una PWA offline-first para saber qué falta en la despensa y preparar la compra recorriendo el catálogo. El éxito es salir a comprar con lo que falta marcado, sin armar una lista a mano.

## Positioning

La compra se arma como un pasillo: se recorren las categorías y se marca únicamente lo que falta. No es un inventario genérico ni una lista que el usuario construye ítem por ítem.

## Operating Context

Se usa en el teléfono (PWA) frente a la despensa o en el súper. Dexie guarda productos, categorías y el estado de la compra en el dispositivo. PocketBase existe para sync entre dispositivos; el login no es requisito para usar esta despensa. Una cuenta familiar y varios dispositivos son capacidad del producto, no el uso de hoy.

## Capabilities and Constraints

- Inicio muestra el estado de la compra y sugerencias de reposición.
- Preparar compra recorre categorías, marca lo que falta, resume y cierra la compra.
- Administración carga y edita productos y categorías.
- El modo local funciona sin cuenta. El login sincroniza cuando hay backend y sesión.
- Una familia, no un SaaS multi-tenant. Multi-usuario familiar queda abierto: hoy opera una sola persona.
- Copy existente en voseo argentino; no se pidió como compromiso de marca en este init.
- Stack ya resuelto: Angular 19 PWA + Dexie; PocketBase en Docker. Frontend en GitHub Pages; backend en casa con HTTPS si se publica.

## Brand Commitments

Nombre: KMarket. No hay logo, paleta o personalidad de marca fijados en este archivo; el mundo visual vigente vive en DESIGN.md y no se redefine aquí.

## Evidence on Hand

Catálogo y estados reales de la despensa del hogar. No hay testimonios, casos de clientes, prensa ni benchmarks. Trabajo futuro no debe fabricarlos.

## Product Principles

1. El pasillo es el trabajo: recorrer categorías y marcar lo que falta.
2. Este dispositivo alcanza: la despensa se usa sin cuenta.
3. Una persona hoy, con espacio para el hogar después — no diseñar como si la familia ya operara.
4. Herramienta a mano alzada: se usa de pie, en el pasillo o en el súper, no en un escritorio.

## Accessibility & Inclusion

Piso táctil de lo que ya hay: destinos de toque, contraste y uso en el teléfono como PWA. No hay estándar formal (WCAG u otro) exigido.
