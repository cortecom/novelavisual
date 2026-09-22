# Carretera Austral: 5 Etapas — módulo listo para Monogatari

Esta carpeta es autocontenida: cópiala entera dentro de tu proyecto en

```
tu-proyecto/
  assets/
    games/
      ruta7-carretera-austral/   <- esta carpeta, sin modificar su contenido
        ruta7-race.js
        race-action.js
        INTEGRACION.md
        index-snippet.html
        escena-ejemplo.js
```

No hace falta tocar nada dentro de la carpeta — el jeep, la roca, el árbol,
la muralla y el camión viajan embebidos como `data:` URIs dentro de
`ruta7-race.js`, así que no hay imágenes sueltas que copiar ni rutas
relativas que romper.

## Paso 1 — Cargar los scripts en tu `index.html`

Justo antes de donde cargas tu propio `script.js` (después de que Monogatari
ya esté inicializado, igual que `rune-puzzle.js`/`puzzle-action.js`), agrega:

```html
<script src="assets/games/ruta7-carretera-austral/ruta7-race.js"></script>
<script src="assets/games/ruta7-carretera-austral/race-action.js"></script>
```

`race-action.js` necesita que la variable global `monogatari` ya exista, así
que carga estos dos scripts **después** de tu `main.js` (pero antes de
`script.js`, donde escribes tu guion).

## Paso 2 — Colocar el elemento dentro de la pantalla de juego

Igual que `<rune-puzzle>`, agrega `<ruta7-race>` **dentro de `<game-screen>`**
(puede ir junto a otros minijuegos que ya tengas ahí, como primer hijo):

```html
<game-screen>
  <rune-puzzle id="cityPuzzle"></rune-puzzle>
  <ruta7-race id="ruta7Race"></ruta7-race>

  <dialog-log></dialog-log>
  <text-box></text-box>
  <quick-menu></quick-menu>
</game-screen>
```

El componente permanece oculto (`display:none`) hasta que se invoca desde el
guion, así que no interfiere con el menú principal ni con ninguna otra
escena mientras tanto. A diferencia del rompecabezas de coordenadas, la
conducción ocupa la pantalla por completo (es de noche, con tormenta — no
hay una escena de fondo detrás que deba seguir viéndose), pero el
`quick-menu` sigue por encima (mismo `z-index:5` en el host, misma
convención) por si necesitas ajustar sonido o pausar.

Ver `index-snippet.html` en esta misma carpeta para el bloque exacto listo
para copiar y pegar.

## Paso 3 — Usarlo como una escena más de tu guion

En tu `script.js`, en cualquier capítulo/label:

```js
monogatari.script({
  'Escena5_Patagonia': [
    'show scene ruta7 with fadeIn',
    'erik (...) La tormenta se está cerrando rápido...',
    'gabriel (...) No podemos dar la vuelta ahora...',
    'race ruta7Race',              // <- pausa la historia y abre el minijuego
    'jump Escena6_Caverna'
  ]
});
```

La línea `'race ruta7Race'` funciona igual que `'puzzle cityPuzzle'`,
`'show background ...'` o `'jump ...'`: el motor se detiene ahí, muestra el
minijuego a pantalla completa, y en cuanto el jugador termina las 5 etapas y
pulsa "Continuar" en la pantalla final, la historia avanza sola a la
siguiente línea — **no se le pregunta si quiere volver a jugar**.

Ver `escena-ejemplo.js` para el bloque completo ya aplicado a
`Escena5_Patagonia` (diálogo de Erik y Gabriel antes del minijuego, tal como
en tu guion original).

## Qué pasa dentro del minijuego

- **5 etapas**: Bosque Lluvioso → Quebrada Rocosa → Desfiladero del Viento →
  Glaciar Fracturado → Paso Helado, con 17 camiones repartidos entre todas.
- **Vista cenital** (estilo Motorace USA): el jeep esquiva camiones, rocas,
  árboles y murallas de roca hasta llegar a la cascada congelada.
- **Checkpoint por etapa**: si el jeep queda varado, reintenta la misma
  etapa — no pierde el progreso de las etapas ya superadas.
- **Sin minijuego de brújula por separado**: el beat narrativo de la Brújula
  de Marinos Antiguos + la Libreta con Diagrama de Espiral se conserva como
  una línea de narración ambiental justo antes del final de la etapa 5 (sin
  pausa, sin interacción aparte de conducir).
- **Sprites hiperrealistas** (jeep, roca, árbol, muralla, camión) con un
  espolvoreado de nieve en las dos etapas heladas.

## Referencia rápida

| Archivo | Qué es | ¿Hay que tocarlo? |
|---|---|---|
| `ruta7-race.js` | El componente `<ruta7-race>` (Web Component, Shadow DOM) | No |
| `race-action.js` | Registra el verbo `race` como Acción de Monogatari | No |
| `index-snippet.html` | Bloque para copiar en tu `index.html` | Copiar, no editar la carpeta original |
| `escena-ejemplo.js` | Ejemplo de guion usando `'race ruta7Race'` | Copiar/adaptar a tu propio `script.js` |

## Ajustar las etapas, los camiones o la dificultad

Todo vive dentro de `_build()` en `ruta7-race.js`, en el array `STAGES`
(longitud de cada etapa, curvas del camino via `keyframes`, posición de cada
obstáculo/camión). Los radios de colisión están en `OBSTACLE_R`/`TRUCK_R`, y
la velocidad lateral máxima de los camiones en `maxLat` (dentro de
`update()`) — deliberadamente más lenta que el jeep para que siempre exista
forma de esquivarlos reaccionando a tiempo.
