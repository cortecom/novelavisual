# Minijuego — Escena 45: "El Derrumbe"

Minijuego de acción para el Capítulo IV, construido a partir del guion
de la Escena 45 (derrumbe de la cámara subterránea). Sigue el mismo
patrón arquitectónico que el resto de los minijuegos del proyecto: un
Web Component con Shadow DOM (`<derrumbe-final>`) + una Acción de
Monogatari (verbo `derrumbe`), ambos en un solo archivo,
`derrumbe-final.js`, cada uno en su propio IIFE.

## Archivos entregados

- `derrumbe-final.js` — el componente (canvas 2D, sin dependencia de
  fotos/assets externos, arte dibujado con formas vectoriales) y la
  Acción, en un solo archivo.
- `index-snippet.html` — las dos líneas a agregar en `index.html`
  (script + elemento).
- `escena45-snippet.js` — reemplazo sugerido del bloque `Escena45`
  completo (quita el `Choice` de proteger/escapar/salvar y lo
  reemplaza por la llamada al minijuego).
- Este archivo.

## Las 3 etapas (una sola sesión, un solo evento final)

1. **Escapar del derrumbe** — corredor con rocas que caen (con sombra
   de aviso antes de impactar) y grietas que se abren en el piso.
   Moverse con flechas/WASD. 3 golpes = etapa fallida (se reintenta
   solo esa etapa, sin perder progreso).
2. **Salvar a Isidora** — primero hay que llegar hasta ella esquivando
   más rocas; al llegar comienza un QTE: mantener pulsado o golpear
   repetidamente ESPACIO para llenar la barra de "levantar la roca"
   antes de que se acabe el tiempo, mientras siguen cayendo rocas
   sueltas. Esta etapa es obligatoria — no existe una rama donde no se
   la rescate.
3. **Escapar y llegar a la cámara oculta** — versión más dura de la
   etapa 1 (más rocas, más rápido), con Isidora ya liberada corriendo
   como compañera visual detrás del jugador. Al llegar al final se
   revela la cámara oculta y se muestra la pantalla de victoria.

Solo la pantalla de victoria dispara el evento final
`derrumbe:completado`, y el botón "Continuar" llama a `self.close()`
antes de dispararlo (para no repetir el bug histórico de otros
minijuegos del proyecto en los que el overlay se quedaba pegado sobre
la escena siguiente).

## Banderas de resultado

Antes de resolver la Acción, el componente informa el resultado vía
`CustomEvent('derrumbe:completado', { detail: { muroIntacto, isidoraSalvada } })`.
La propia Acción (`DerrumbeAction.apply()`) lee ese `detail` y lo deja
en `monogatari.storage()`:

- `derrumbeMuroIntacto` — `true` solo si la Etapa 1 se completó sin
  recibir ningún golpe. Reemplaza a la vieja rama "Proteger la
  estructura" del guion original: aquí no es una elección narrativa
  sino una recompensa por jugar limpio. `escena45-snippet.js` usa esta
  bandera para decidir si otorgar `mural_intacto`.
- `derrumbeIsidoraSalvada` — siempre `true` al llegar a este punto (la
  Etapa 2 es obligatoria). Se deja igual por si en el futuro se agrega
  alguna variante donde no lo sea; hoy `escena45-snippet.js` otorga
  `relacion_isidora_mejorada` sin condicionarla a esta bandera.

**Nota:** `monogatari.storage()` se usa asumiendo el mismo patrón
documentado para otros minijuegos del proyecto (mutar el objeto
devuelto directamente). Si tu build usa una API distinta para guardar
banderas de partida, el `try/catch` en `DerrumbeAction.apply()` evita
que un error ahí bloquee el avance del guion, pero conviene
confirmarlo contra tu `script.js` real antes de integrar.

## Gotchas del proyecto ya cubiertos

Repasados contra las lecciones documentadas de minijuegos anteriores:

- IIFE en ambos bloques (componente y Acción) — evita colisión de
  nombres globales como la de `epigrama-puzzle.js`/`vaticano-maze.js`.
- `resize()` del canvas se llama dentro de `open()`, no en el
  constructor — evita el bug de canvas 0×0 con `:host` en
  `display:none`.
- Los listeners de teclado están guardados con
  `self.hasAttribute('open')`, tanto en `keydown`/`keyup` como en el
  bucle de animación (`loop()` corta si el componente está cerrado).
- `stopPropagation` solo en `click`, no en otros eventos.
- Pantalla de victoria con un único botón "Continuar" (sin opción de
  repetir todo desde el principio).
- El botón "Continuar" llama a `self.close()` antes de disparar el
  evento de completado.
- Ningún elemento interno usa `z-index` propio — las 4 pantallas
  (`intro` / `fail` / `stage-clear` / `victory`) se alternan solo con
  una clase `.hidden` (`display:none`), evitando por diseño el tipo de
  bug de apilamiento que afectó al Altar (Escena 42) v4→v8.
- El Action extiende `Monogatari.Action` (namespace en mayúscula), usa
  `static id` como campo (no método), `static matchString([action])`,
  y el constructor destructura `[verb, elementId]` — mismo contrato
  confirmado en `laberinto-action.js`.

## Validación realizada

- `node --check derrumbe-final.js`: sin errores de sintaxis.
- Revisión manual completa de la lógica de juego contra el checklist
  de gotchas de arriba.

**Pendiente (no se pudo hacer en esta sesión):** no hubo acceso a un
navegador real ni al puente con tu computador para correr un
smoke test en Chromium con `monogatari.run('jump Escena45')` como sí
se hizo con `ruta7-race` o el Altar — ni una simulación de playthrough
en Node. Antes de dar esto por cerrado conviene probarlo a mano en tu
proyecto real (las 3 etapas, el reintento tras 3 golpes en cada una,
el QTE de rescate, y que "Continuar" en la pantalla final efectivamente
cierra el overlay y avanza el guion).

## Historial de correcciones tras integrarlo

- **v1 → v1.1**: el `<style>` del componente estaba definido (`STYLES`)
  pero nunca se insertaba dentro del `TEMPLATE` del Shadow DOM — por
  eso las 4 pantallas (intro/fallo/etapa-completada/victoria) no tenían
  `position:absolute` ni `display:none` y se veían todas apiladas al
  mismo tiempo, sin fondo ni color. Corregido agregando
  `<style>${STYLES}</style>` al `TEMPLATE.innerHTML`.
- **v1.1 → v1.2** (a pedido del usuario, tras probar la v1.1: "no se
  entiende, aparecen personajes que se mueven en forma horizontal, ni
  siquiera vertical, y si me quedo quieto el juego termina con éxito"):
  dos problemas reales de diseño, no solo de comunicación visual.
  1. Las rocas no caían: solo aparecían en el centro de la banda del
     jugador y crecían en el mismo punto (de ahí la sensación de
     "personajes" quietos moviéndose raro). Corregido con
     `obstaclePos()`: ahora una roca nace arriba de la pantalla y cae
     de verdad (con aceleración tipo gravedad) hasta la banda del
     jugador a lo largo de `TELEGRAPH_MS`, con una leve deriva
     horizontal propia — movimiento vertical y horizontal reales, no
     una mancha creciendo. El sprite de la roca también se cambió de
     dos círculos superpuestos (parecía una cara) a un polígono
     irregular tipo roca.
  2. El progreso de la etapa dependía solo del tiempo (auto-scroll):
     si ninguna roca caía exactamente sobre la posición del jugador,
     ganaba sin moverse. Corregido en `spawnObstacle()`: un 55% de las
     rocas ahora apunta cerca de la posición actual del jugador al
     generarse (con margen suficiente para reaccionar durante la
     caída), forzando a esquivar activamente en vez de poder quedarse
     quieto. La colisión también pasó de revisarse una sola vez en el
     instante del aterrizaje a revisarse continuamente mientras la
     roca cae y un instante después de aterrizar (escombro recién
     caído), vía `stepObstacles()`.

## v1.3 (versión actual) — más lento, rescate con clic, imágenes

A pedido del usuario tras probar la v1.2 ("está muy difícil, hacerlo
más lento; el rescate de Isidora debería ser con clic del mouse;
poner imágenes de fondo/rocas/personajes/grietas en la carpeta
images"):

1. **Ritmo más lento en las 3 etapas.** Se redujo `scrollSpeed` y
   `scrollAccel` de las 3 etapas (~35-40% más lento), se espaciaron los
   intervalos de aparición de obstáculos (`spawnMs`), se subió
   `TELEGRAPH_MS` de 700 a 1150 (casi el doble de tiempo de reacción
   desde que se ve la marca de impacto hasta que la roca realmente
   llega al suelo), se bajó la probabilidad de rocas "dirigidas" al
   jugador de 55% a 40% y se amplió el margen de puntería de esas rocas
   (de ~50px a ~140px) para que dejen más espacio real para esquivar.
   También se subió `INVULN_MS` (750→950) para dar un respiro mayor
   tras cada golpe. Todo esto son constantes al principio del archivo
   — si sigue sintiéndose muy rápido o muy lento, son los primeros
   números a tocar.
2. **Rescate con clic en vez de tecla.** La barra de "levantar la
   roca" de la Etapa 2 ya no se llena con ESPACIO: ahora se llena
   haciendo clic (o tocando en pantalla táctil) repetidamente sobre el
   canvas, o manteniendo el clic/toque presionado. El movimiento
   lateral para esquivar mientras dura el rescate sigue siendo con
   flechas/WASD.
3. **Carpeta `images/`.** El componente ahora intenta cargar 6
   archivos desde `images/` (junto a `derrumbe-final.js`, calculado
   automáticamente vía `document.currentScript`, así que funciona sin
   importar en qué carpeta del proyecto lo pongas):
   `muro.png`, `piso.png`, `roca.png`, `grieta.png`, `jugador.png`,
   `isidora.png`. Si un archivo no existe (o todavía no cargó), el
   juego sigue funcionando con el dibujo vectorial que ya tenía para
   esa pieza — nada se rompe por no tener alguna imagen puesta.

## Arte

**Importante:** en este entorno no tengo generación de imágenes con
IA disponible (ni acceso a Midjourney/DALL·E/Stable Diffusion como en
tu flujo habitual). Lo que incluye el ZIP en `images/` son 6
imágenes **generadas de forma procedural con Python/Pillow** —
formas geométricas y texturas de ruido con la misma paleta de color
que ya tenía el minijuego, pensadas para que el juego se vea con
imágenes reales desde ya (piso y muro son texturas tileable de
verdad, sin costuras) y no como un simple placeholder de color plano.
No son arte fotorrealista ni están hechas por un modelo generativo:

- `piso.png`, `muro.png` — 256×256, tileable (`ctx.createPattern`).
- `roca.png` — 220×220, con transparencia.
- `grieta.png` — 340×150, con transparencia.
- `jugador.png`, `isidora.png` — 160×220, con transparencia, siluetas
  simples (teal vs. terracota, con cola de caballo para diferenciar a
  Isidora).

Si más adelante quieres arte hiperrealista de verdad (mismo pipeline
que `ruta7-carretera-austral`: fotos con fondo blanco → recorte con
Python/scipy → `data:` URI o archivo en `images/`), estos son los
prompts en español que puedes usar en Midjourney/DALL·E/Stable
Diffusion — el nombre de archivo final debe ser el mismo (para
reemplazar el placeholder sin tocar el código):

- **`piso.png`** — "Textura de piso de tierra y grava de una cueva
  subterránea, vista cenital, iluminación tenue y polvorienta, tonos
  marrón oscuro, fotografía hiperrealista, sin personajes, textura
  repetible sin costuras."
- **`muro.png`** — "Textura de pared de roca de una caverna
  subterránea, estratos de piedra irregular, humedad y vetas
  minerales, iluminación tenue lateral, fotografía hiperrealista, sin
  personajes, textura repetible sin costuras."
- **`roca.png`** — "Una sola roca desprendida de tamaño mediano,
  fondo blanco liso, iluminación de estudio, fotografía
  hiperrealista, superficie irregular con fracturas visibles, vista
  de tres cuartos."
- **`grieta.png`** — "Grieta profunda en el suelo de piedra, vista
  cenital, bordes irregulares con un leve resplandor anaranjado como
  de calor o polvo iluminado, fondo transparente, fotografía
  hiperrealista."
- **`jugador.png`** — "Personaje aventurero corriendo en pose
  dinámica, vista de tres cuartos, ropa de expedición color verde
  azulado, fondo blanco liso, iluminación de estudio, fotografía
  hiperrealista, cuerpo completo."
- **`isidora.png`** — "Personaje femenino, Isidora, corriendo en pose
  dinámica, cabello atado en cola de caballo, ropa de expedición color
  terracota, fondo blanco liso, iluminación de estudio, fotografía
  hiperrealista, cuerpo completo."

Como con `ruta7-carretera-austral`, una vez generadas las fotos reales
avísame para preparar el recorte de fondo (Python + scipy/numpy) antes
de dejarlas en `images/`.
