# Minijuego — Escena 36: "Saqueo del Archivo de Sidón"

Minijuego de acción en 3 etapas para `Escena36_SaqueoSiria`, construido con el
mismo patrón arquitectónico que los minijuegos existentes del proyecto
(`cifrado-tres-ciudades`, `epigrama-antipatro`, `laberinto-vaticano`,
`ruta7-carretera-austral`): Web Component + Shadow DOM + Action de Monogatari.

## Contenido de esta carpeta

```
saqueo-archivo/
├── archivo-escape.js   ← archivo único: componente + Action
├── index-snippet.html           ← qué agregar en index.html
├── escena-ejemplo.js            ← Escena36_SaqueoSiria con el minijuego insertado
└── INTEGRACION.md               ← este archivo
```

`archivo-escape.js` contiene, en un solo IIFE, tanto el Web
Component `<archivo-escape>` como `SaqueoAction` (el registro del verbo
`saqueo`). A diferencia de los minijuegos anteriores del proyecto (que
separan componente y Action en dos archivos), aquí ambos viven juntos
porque el usuario pidió un solo archivo — el contrato externo y el
comportamiento son idénticos, solo cambia dónde vive el código. No hay
ningún costo funcional en tenerlo así: siguen dentro de un único IIFE, así
que nada se filtra a `window` de todas formas.

## Pasos de instalación

1. Copiar la carpeta completa a:
   `assets/games/saqueo-archivo/` dentro del proyecto real
   (`Juego Maravillas de la Antiguedad/Novela Visual/`).

2. En `index.html`:
   - Agregar la etiqueta `<script>` de `index-snippet.html`
     **después de `main.js` y antes de `script.js`**, junto a las de
     `rune-puzzle.js` / `ruta7-race.js`.
   - Agregar `<archivo-escape id="archivoEscape"></archivo-escape>`
     dentro de `<game-screen>`, junto a `<rune-puzzle>`, `<epigrama-puzzle>`
     y `<vaticano-maze>`.

3. En `js/script.js`: reemplazar el label `Escena36_SaqueoSiria` existente
   por el contenido de `escena-ejemplo.js` (se agregó una sola línea nueva:
   `'saqueo archivoEscape'`, justo después del `[EFECTO]` del extintor y
   antes de la `TRANSICIÓN REFORZADA`). El resto de la escena, incluyendo
   el `Choice` final con las tres rutas de escape, queda intacto.

## Por qué esta ubicación en el guion

El texto original narra el resultado del incendio (`[EFECTO]: Ciega
temporalmente a los atacantes...`) y luego pasa directo a la transición y
a la elección de ruta de escape. El minijuego se inserta **entre ambos
puntos**: el jugador vive en carne propia lo que el texto ya anunciaba
(sofocar el fuego), y solo entonces la narración confirma la huida y
presenta la decisión. Así el `Choice` sigue funcionando exactamente igual
que antes — el minijuego no lo toca ni depende de él.

## Diseño del minijuego

Personaje controlable en vista cenital (flechas o WASD), sin arte
fotográfico por ahora (formas vectoriales con resplandor, paleta índigo +
acentos naranja/fuego del Capítulo III). Igual que en `ruta7-race`, se
puede reemplazar por fotos recortadas más adelante siguiendo el mismo
pipeline (numpy + scipy.ndimage + Pillow) usado para el jeep/camión/muralla,
sin tocar la lógica.

### Etapa 1 — Sofocar el incendio
- 6 focos de fuego fijos en la sala. Pararse encima ~0.9s los apaga
  (barra de progreso circular alrededor del foco).
- 5 brasas a la deriva rebotando por el escenario; el contacto cuenta
  como impacto.
- Objetivo: apagar los 6 focos. Sin límite de tiempo.

### Etapa 2 — Recoger los fragmentos
- 6 códices esparcidos por la sala (recolección por contacto).
- 3 saqueadores que se desplazan lentamente hacia la posición del
  jugador (persecución simple, más lentos que el jugador — siempre
  esquivables).
- Objetivo: recoger los 6 fragmentos.

### Etapa 3 — Escapar por el pasillo
- Scroll vertical continuo (pasillo hacia la salida), movimiento lateral
  del jugador.
- Obstáculos generados proceduralmente: estantes caídos (fijos), fuego
  (fijo), saqueadores (se desplazan lateralmente). Con invulnerabilidad
  breve tras cada impacto (1.1s) para evitar perder varias vidas de golpe
  contra el mismo obstáculo.
- Objetivo: alcanzar la meta dorada al final del scroll.

### Sistema de vidas / reintento (checkpoint por etapa)
- 3 impactos en cualquier etapa → pantalla "¡Alcanzado!" → botón
  "Reintentar la etapa". Solo se reinicia la etapa actual — el progreso
  de etapas anteriores (fuegos ya apagados, fragmentos ya recogidos en
  una partida previa a esta etapa) no se pierde, porque cada etapa parte
  de cero al reintentarla, igual que en `ruta7-race` (v6: `state = STATE.DRIVE`
  se reestablece explícitamente al reintentar, evitando el bug de "jeep
  pegado").

### Pantalla final
- Al completar la etapa 3: pantalla "Escapaste del Archivo" con un único
  botón "Continuar" (sin opción de "jugar de nuevo", siguiendo la misma
  corrección aplicada a `ruta7-race` v6) que dispara `saqueo:completado`
  y cierra el componente.

## Contrato técnico (idéntico al resto de minijuegos del proyecto)

- **IIFE**: todo el contenido de `archivo-escape.js` (componente
  y Action juntos) está envuelto en un único
  `(function () { 'use strict'; ... })();` — nada se filtra a `window`.
  Esto es obligatorio en este proyecto: ya hubo una
  colisión real de nombres global (`_build`) entre `epigrama-puzzle.js`
  y `vaticano-maze.js` por no hacerlo (ver
  `claude/minijuegos-epigrama-laberinto-escenas14-32.md`).
- `:host{ all:initial; position:absolute; inset:0; z-index:5; display:none; }`
  y `:host([open])` para mostrarse solo cuando la Action lo abre.
- `self.open()` / `self.close()` como API pública.
- Evento `'saqueo:completado'` (bubbles + composed) disparado al pulsar
  "Continuar" en la pantalla de victoria.
- `resize()` se vuelve a ejecutar dentro de `open()` — el canvas mide
  0×0 mientras el host está `display:none`, el mismo bug ya corregido
  en `ruta7-race` v6.
- Teclado con guardas `self.hasAttribute('open')` (no captura teclas ni
  consume CPU mientras el componente está oculto).
- `monogatari.registerAction()` en minúscula; `static id` como campo;
  `static matchString([action])`; constructor con tokens desestructurados
  `([verb, elementId])` — mismo contrato que `PuzzleAction` y `RaceAction`.

## Pendiente / posibles mejoras futuras

- Si se desea, agregar una línea de diálogo ambiental breve entre etapas
  (por ejemplo, Layla advirtiendo sobre los saqueadores) — hoy la
  transición entre etapas es solo la pantalla de introducción con texto
  de instrucciones, sin diálogo de personajes.
- Verificar overlap de `z-index: 5` contra `text-box`/`quick-menu` reales
  del proyecto (mismo valor usado por `ruta7-race`, ya validado ahí).

## Imágenes (carpeta `images/`)

Los sprites (personaje, saqueador, fragmento, estante, brasa, fuego) se
recortaron de imágenes generadas por IA con `numpy` + `scipy.ndimage` +
`Pillow` (mismo pipeline que `ruta7-race`) y **no van incrustadas** como
`data:` URI dentro del `.js` — se cargan por ruta completa desde
`assets/games/saqueo-archivo/images/` (ruta completa desde la raíz del
proyecto, no relativa al `.js` — ver "Bug corregido: rutas de imagen"
más abajo):

```
saqueo-archivo/
├── archivo-escape.js
└── images/
    ├── personaje.png
    ├── saqueador.png
    ├── fragmento.png
    ├── estante.png
    ├── brasa.png
    ├── fuego.png
    ├── bg-etapa1.jpg
    ├── bg-etapa2.jpg
    └── bg-etapa3.jpg
```

Copia la carpeta `images/` completa junto con `archivo-escape.js` — si
falta algún sprite, el componente sigue funcionando (cada sprite tiene
un respaldo vectorial automático mientras la imagen no carga), pero se
verá con las formas de color planas en vez de las fotos. Los 3 fondos
(`bg-etapa1/2/3.jpg`) no tienen respaldo vectorial equivalente al de
los sprites — si faltan, cada etapa simplemente vuelve al patrón de
piso/pasillo plano que tenía antes (código ya preparado para eso, ver
`drawBackgroundRoom()` y `drawCorridorBackground()`).

### Fondos de las 3 etapas

- `bg-etapa1.jpg` / `bg-etapa2.jpg`: fondo fijo, se dibuja una vez por
  frame cubriendo todo el canvas (800×560) detrás de fuegos/fragmentos/
  saqueadores. Las imágenes originales generadas venían en formato
  vertical (retrato); se giraron 90° y se recortaron al centro para
  encajar en el canvas horizontal del juego (ver "Nota sobre formato"
  más abajo).
- `bg-etapa3.jpg`: a diferencia de los otros dos, este se usa como
  **patrón repetible verticalmente** (`ctx.createPattern(...,'repeat')`
  + `CanvasPattern.setTransform` desplazado según `world.scrollY`,
  mismo mecanismo que `terrainTexture`/`roadTexture` en `ruta7-race`),
  porque el pasillo hace scroll continuo. La imagen ya viene
  redimensionada al ancho exacto del canvas (800px) y con los bordes
  superior/inferior mezclados entre sí (`blend` de 120px, técnica de
  "hacer seamless" wrap-around) para que la costura de la repetición no
  se note. Si se reemplaza esta imagen por otra, conviene aplicarle el
  mismo tratamiento o la costura volverá a ser visible.

### Nota sobre formato: fondos verticales vs. canvas horizontal

Al pedirle a la IA fondos para las etapas 1 y 2 con proporción 10:7
(horizontal, para calzar con el canvas), las imágenes generadas
llegaron en formato vertical (retrato) de todas formas — un
recordatorio de que conviene revisar la proporción real de lo que
entrega el generador antes de integrarlo, en vez de asumir que respetó
el aspect ratio pedido en el prompt.

El fuego (focos de la etapa 1 y el obstáculo "fuego" de la etapa 3)
también usa foto (`images/fuego.png`) desde la segunda entrega — la
imagen del fuego traía un humo semitransparente que dejaba un halo claro
alrededor de las brasas incluso después de recortarla; se ajustó el
umbral del recorte (doble rampa: una firme para las brasas, otra más
suave solo para el humo) y quedó aceptable a la escala en que se ve en
el juego, aunque perdió parte del humo más tenue. Sigue teniendo
respaldo vectorial (círculo con resplandor) si la imagen no carga.

## Bugs corregidos tras el primer despliegue

- **Rutas de imagen relativas al `.js` en vez de a la página**: la
  primera versión usaba `images/personaje.png` (relativo). El navegador
  resuelve rutas relativas contra la URL de la **página** (`index.html`,
  en la raíz del proyecto), no contra el archivo `.js` que las
  referencia — así que buscaba `(raíz)/images/personaje.png` en vez de
  `assets/games/saqueo-archivo/images/personaje.png`, y ninguna imagen
  cargaba. Corregido usando la ruta completa desde la raíz del proyecto
  en las 9 entradas de `SPRITE_SRC` (`assets/games/saqueo-archivo/images/...`),
  igual que ya está referenciado el propio `archivo-escape.js` en
  `index.html`.

- **Personaje y saqueador "corrían de espaldas"**: la fórmula de
  rotación (`Math.atan2(dy, dx) + Math.PI / 2`) asumía que el sprite
  mira "hacia arriba" por defecto. Corregido a
  `Math.atan2(dy, dx) - Math.PI / 2` en las tres rotaciones dependientes
  de movimiento (jugador etapa 1, jugador etapa 2, saqueadores etapa 2).
- **Etapa 3 sin obstáculos**: los obstáculos se generaban con
  `y: world.scrollY - LH - rand(0, 200)`, lo que los colocaba ya fuera
  de la zona jugable desde el instante de su creación (nunca llegaban a
  cruzar la posición del jugador). Primer intento de arreglo (ya
  superado, ver el siguiente punto): `y: world.scrollY + LH + rand(0, 200)`.
- **Etapa 3 con dirección de scroll invertida respecto a `ruta7-race`**:
  el arreglo anterior sí lograba que los obstáculos cruzaran al
  jugador, pero lo hacían entrando por ABAJO y subiendo hacia arriba —
  al revés que en `ruta7-race`, donde el jugador corre "hacia arriba"
  del pasillo y los obstáculos entran por ARRIBA y bajan hacia él. Esto
  hacía la etapa confusa y artificialmente difícil. Corregido de raíz:
  ahora `screenY = world.scrollY - o.y + playerY` (antes era
  `o.y - world.scrollY + LH`), tanto para los obstáculos como para la
  barra de meta y el scroll del piso a rayas. El punto de aparición de
  cada obstáculo se fija por delante del jugador
  (`y: world.scrollY + playerY + rand(40, 240)`), de modo que entra
  por arriba ya con margen de reacción y "se alcanza" al llegar a la
  altura del jugador. También se corrigió el ángulo inicial del
  personaje en `resetStage3()` (`world.player.angle = Math.PI`, antes
  `0`) para que quede mirando hacia arriba, en la dirección de avance.
