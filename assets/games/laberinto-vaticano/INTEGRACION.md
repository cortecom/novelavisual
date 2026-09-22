# Integración — "El Laberinto del Vaticano" (Escena 32)

## Novedad: +2 curas por etapa (diseño híbrido crítico + alternativo) y rotación de personajes

### Los personajes ahora rotan según la dirección real de movimiento

Gabriel y los curas ya no se dibujan siempre "de frente a la pantalla" con
una flechita aparte indicando hacia dónde van — la imagen misma rota para
apuntar hacia donde se mueven:

- **Gabriel**: rota según la tecla que estés presionando (flechas o WASD),
  usando el mismo ángulo `facing` que ya se usaba internamente para el
  movimiento.
- **Curas**: rotan según el eje y sentido de su patrulla actual (si van
  hacia la derecha, izquierda, arriba o abajo del corredor).

Se quitó la flecha indicadora separada que existía antes — ya no hace
falta, la propia imagen cumple ese rol.

### +2 curas por etapa — diseño híbrido para que sea más difícil SIN volverse imposible

Pediste 2 curas más por escena que dificulten el camino a la solución sin
bloquearlo. Investigué cuántos curas en **ruta crítica** (con margen de
seguridad garantizado — ver sección de abajo) caben realmente en cada
laberinto, y **el límite estructural real es de 3 a 4** — no importa cuánto
agrande el laberinto o pruebe semillas distintas, no logré encontrar más de
4 corredores independientes que sean parte de la ruta de solución Y tengan
un hueco de cruce seguro al mismo tiempo. Pedir 5 curas "en ruta crítica"
en Museos, por ejemplo, obligaba al sistema a rellenar con corredores sin
margen garantizado — exactamente el bug que causó que la Etapa 1 fuera
imposible la vez anterior.

**Solución aplicada**: cada etapa ahora tiene dos categorías de curas,
independientes y sin solaparse entre sí:

| Etapa | En ruta crítica (`priestCriticalCount`) | En rutas alternativas (`priestNoncriticalCount`) | Total |
|---|---|---|---|
| Museos | 4 (el máximo seguro encontrado) | 1 | 5 |
| Jardines | 3 (el máximo seguro encontrado) | 1 | 4 |
| Biblioteca | 0 (se mantiene como pediste antes: solo alternativas) | 4 | 4 |

Los curas "en ruta crítica" siguen garantizando margen ≥0.5s (nunca
bloquean). Los curas "en rutas alternativas" nunca tocan la ruta de
solución — dificultan la exploración lateral y dan más presencia/ambiente
sin arriesgar la solvencia del laberinto. De paso, ajusté las semillas de
Museos (`7342`→`20100`) y Jardines (`7747`→`17874`) a las que sí alcanzan
ese máximo de curas seguros en ruta crítica.

**Verificación** (código real extraído del archivo, no una aproximación):
los 3 laberintos obtienen exactamente los curas pedidos (5/5, 4/4, 4/4),
con margen positivo en absolutamente todos los críticos.

Si en el futuro quieres ajustar estos números, están al principio de cada
etapa en `STAGES` (`priestCriticalCount`/`priestNoncriticalCount`). Ten en
cuenta el límite estructural: pedir más `priestCriticalCount` del que el
laberinto realmente puede ofrecer con margen simplemente no aumenta el
conteo (nunca vuelve a agregar curas inseguros — es un techo duro, no un
bug).

## Novedad: imágenes reales (medallones 3x3 + Gabriel/curas vistos desde arriba)

### Medallones de entrada/salida — ahora fotos reales a tamaño 3x3 celdas

Los 6 marcadores (entrada y salida de cada una de las 3 etapas) pasaron de
ser un círculo abstracto pequeño (radio 14px) a un **medallón circular de
3x3 celdas del laberinto** (~102px de diámetro con `cellSize=34`) con la
foto hiperrealista real del lugar, recortada del panel de 6 imágenes que
subiste. El anillo dorado decorativo ya viene "horneado" en el propio
archivo de imagen.

Mapeo aplicado:

| Etapa | Entrada | Salida |
|---|---|---|
| 1 — Museos | `plaza-san-pedro.png` | `capilla-sixtina.png` |
| 2 — Jardines | `jardines-vaticanos.png` | `palacio-gobernacion.png` |
| 3 — Biblioteca | `ciudad-baja.png` | `biblioteca-apostolica.png` |

El tamaño del medallón es puramente visual — el punto exacto donde se
detecta que Gabriel "llegó" (`maze.cellSize * 0.55` de radio) no cambió,
así que la mecánica de juego es idéntica a antes, solo se ve mejor.

### Gabriel y los curas — vista superior real en vez de dibujo con canvas

Reemplacé las figuras dibujadas con primitivas de canvas (óvalos, círculos)
por las dos imágenes reales que generaste (`gabriel-topdown.png` y
`cura-topdown.png` — cabello + hombros vistos desde arriba, ya con fondo
transparente). Gabriel mantiene el leve bamboleo al caminar y la flecha de
dirección; los curas mantienen el bamboleo de "caminata" a lo largo de su
eje de patrulla. El radio de colisión (el que importa para el gameplay) no
cambió — solo el tamaño/forma visual del token, ajustado a lo que se ve
bien con la imagen real.

### ⚠️ Estructura de archivos: ahora incluye una carpeta `images/`

**Importante**: a diferencia del resto de este proyecto (que embebe fotos
como `data:` URI dentro del `.js`, como se hizo con jeep/roca/árbol/muralla
en `ruta7-race`), aquí opté por **archivos de imagen externos** en vez de
incrustarlos en base64 dentro de `vaticano-maze.js`. Son 8 imágenes,
~1.2 MB en total — incrustarlas en base64 habría inflado el `.js` a más de
1.5 MB de puro texto, dificultando abrirlo/editarlo. En su lugar:

```
assets/games/laberinto-vaticano/
├── images/
│   ├── plaza-san-pedro.png
│   ├── capilla-sixtina.png
│   ├── jardines-vaticanos.png
│   ├── palacio-gobernacion.png
│   ├── ciudad-baja.png
│   ├── biblioteca-apostolica.png
│   ├── gabriel-topdown.png
│   └── cura-topdown.png
├── vaticano-maze.js
├── laberinto-action.js
└── INTEGRACION.md
```

**Al copiar la carpeta a tu proyecto real, asegúrate de incluir `images/`
completa** — si falta, el juego sigue funcionando (hay un círculo de
reserva mientras la imagen no carga) pero nunca vas a ver las fotos.

Las rutas están escritas de forma relativa al `index.html`
(`assets/games/laberinto-vaticano/images/...`), igual que el resto de los
assets del proyecto (fondos, personajes), así que no hace falta tocar
`index.html` de nuevo — ya apunta a `vaticano-maze.js`, que es quien carga
estas imágenes internamente.

## Corrección crítica: Etapa 1 (y potencialmente otras) podían ser IMPOSIBLES

Tenías razón — encontré la causa raíz exacta y era más profunda que el
ajuste anterior.

**El bug real**: mi filtro original solo exigía que el corredor patrullado
"tocara" la ruta crítica en algún punto (`overlap > 0`), pero no verificaba
que el cura realmente dejara un hueco cruzable. En el caso concreto que
reportaste (Museos, cura3), el rango de patrulla del cura quedaba
**completamente contenido dentro del tramo crítico** — el cura nunca salía
de esa zona en ninguna dirección, así que no existía ningún instante en que
el tramo quedara despejado. Calculé la "ventana libre continua" real
(cuánto tiempo, de un solo tirón, el cura queda lejos de la ruta) contra el
tiempo que Gabriel necesita para cruzar ese mismo tramo a su velocidad real
(205 px/s) — y en ese caso daba **0.00 segundos de ventana** contra 0.83
segundos necesarios. Literalmente imposible, no solo difícil.

**Corrección aplicada** en `selectPatrols()` (`vaticano-maze.js`):

1. Nueva función `corridorClearWindowSeconds()`: calcula, para cada
   corredor candidato, la ventana de tiempo continua más larga (en el peor
   caso — el cura más rápido del rango 60-90 px/s) durante la cual el
   tramo crítico completo queda fuera del radio de colisión del cura. Como
   el cura se mueve a velocidad constante en ping-pong, esto se calcula de
   forma exacta (geometría, sin necesidad de simular frame a frame).
2. Nueva función `corridorCrossSeconds()`: tiempo que Gabriel tarda en
   cruzar ese mismo corredor a su velocidad real.
3. **Un corredor solo se acepta en modo `'critical'` si `ventana - cruce ≥
   0.5s`** (medio segundo de margen de reacción, además del tiempo de
   cruce). Corredores como el cura3 original, con ventana=0, quedan
   descartados automáticamente.
4. Además, ajusté la **semilla** de Museos (`3201`→`7342`) y de Jardines
   (`3202`→`7747`, y de paso 13×9→14×9 — un poco más ancho) a
   combinaciones que sí tienen suficientes corredores con margen cómodo
   para los 3 y 2 curas respectivamente. La disposición anterior de
   Jardines, aunque se corrigiera el filtro, no tenía NINGÚN corredor con
   margen positivo en ese tamaño — el laberinto era estructuralmente
   demasiado chico para un cura "justo" en la ruta crítica.

**Verificación** (con el código real extraído directamente del archivo
final, no una reconstrucción aparte):

| Etapa | Curas obtenidos | Margen de cada uno |
|---|---|---|
| Museos (`critical`) | 3/3 | 1.10s, 1.10s, 0.68s |
| Jardines (`critical`) | 2/2 | 1.10s, 0.54s |
| Biblioteca (`noncritical`) | 2/2 | sin límite (no tocan la ruta) |

Y una simulación de partida completa (avanzar por la ruta más corta real,
con la física de colisión exacta del juego) confirma que las 3 etapas se
completan de principio a fin sin bloqueo.

Si en el futuro cambias `priestCount`, `priestMode`, el tamaño de una etapa,
o agregas una etapa nueva, el propio `selectPatrols()` ahora garantiza —no
solo intenta— que cualquier cura en modo `critical` tenga un margen real
igual o mayor a `CROSSING_BUFFER_SEC` (0.5s, ajustable al principio del
archivo). Si no encuentra suficientes corredores que cumplan esa condición,
cae a intentos más permisivos (documentado en el propio código) antes de
rendirse.

## Ajustes de esta entrega: dificultad de curas corregida + Gabriel simplificado

### 1. Los curas ahora sí obligan a esperar (etapas 1 y 2) y dejan alternativa (etapa 3)

**El problema que reportaste tenía una causa concreta**: el filtro de
"distancia a la entrada/salida" medía distancia euclidiana en la grilla
interna del laberinto (que cuenta doble respecto a celdas reales), así que
el colchón de seguridad era mucho más chico de lo que parecía — en algunos
casos casi inexistente. Y la selección de corredores no distinguía si un
corredor formaba parte de la ruta de solución real o era un ramal muerto
que el jugador nunca recorre.

**Corregido con dos cambios:**

1. **Colchón real por pasos (BFS), no por distancia euclidiana.** Ahora se
   mide en pasos reales del laberinto desde la entrada/salida hasta cada
   corredor candidato, con un mínimo de 6 pasos desde la entrada y 5 desde
   la salida (con una escalera de intentos más permisivos como respaldo,
   por si una semilla futura no deja suficientes corredores válidos).
2. **Selección dirigida por la ruta crítica real (BFS shortest path)**,
   con un modo por etapa (`stageCfg.priestMode`):
   - `'critical'` (Museos y Jardines): el corredor patrullado **debe**
     cruzar la ruta de solución real, para que esperar al cura sea parte
     obligatoria del desafío.
   - `'noncritical'` (Biblioteca): el corredor patrullado **no puede**
     tocar la ruta de solución en ningún punto — solo ramales — para que
     siempre haya cómo seguir sin depender de esquivar a nadie.

**Verificación**: simulé una partida completa (avanzar por la ruta crítica
real, deteniéndose cada vez que un cura bloquea el paso, siguiendo apenas
se despeja) para las 3 etapas con la lógica final:

| Etapa | Se completa | Tiempo total | Tiempo esperando curas |
|---|---|---|---|
| Museos (`critical`) | ✅ | 23.0s | 1.8s |
| Jardines (`critical`) | ✅ | 17.4s | 2.0s |
| Biblioteca (`noncritical`) | ✅ | 16.9s | 0.0s |

Museos y Jardines ahora exigen esperar de verdad; Biblioteca se completa
sin ninguna espera porque los curas quedan en ramales opcionales, tal como
pediste.

Ajustable en `vaticano-maze.js`: el campo `priestMode` de cada etapa en
`STAGES`, y los umbrales `entBuffer`/`exitBuffer`/`minLen` dentro de
`selectPatrols()`.

### 2. Gabriel: de retrato-foto a figura simple vista desde arriba

Se reemplazó el token-foto (recorte circular de `gabriel_normal.png`) por
una figura dibujada con primitivas de canvas, con el mismo criterio de
estilo que los curas: hombros/blazer como óvalo (gris tweed, su color
real), un círculo central para el cabello (con un par de manchas más
claras sugiriendo canas en las sienes) y la correa de su bolso cruzada como
detalle distintivo. Incluye un leve bamboleo mientras camina.

Como ya no se usa la imagen, se quitó del archivo la constante
`GABRIEL_TOKEN_SRC` (el `data:` URI en base64) — `vaticano-maze.js` bajó de
~126 KB a ~47 KB. Si más adelante prefieres volver al retrato-foto, la
versión anterior de este archivo (entrega previa) todavía lo tiene.

## Novedad: curas patrullando (dificultad)

Cada laberinto ahora tiene curas patrullando algunos de sus corredores más
largos (3 en Museos Vaticanos, 2 en Jardines, 2 en Biblioteca). Se mueven en
línea recta de un extremo a otro del corredor (ping-pong), más lento que
Gabriel (60-90 px/s vs 205 px/s), y **no lo persiguen** — solo hay que
esperar a que se alejen y aprovechar la ventana para pasar. Si Gabriel los
toca, aparece el overlay "Un cura lo ha visto merodeando" y, al pulsar
"Reintentar", se reinicia la etapa actual (mismo criterio que "Reiniciar
etapa", no pierde el progreso de etapas ya completadas).

Detalles técnicos:
- Los corredores donde patrullan se eligen automáticamente entre los tramos
  rectos más largos del laberinto (≥5 celdas), evitando los que estén
  demasiado cerca de la entrada o la salida, y sin que dos patrullas se
  solapen. La selección usa una semilla propia (`seed + 777`), así que es
  igual de reproducible que el resto del diseño — mismo layout de curas en
  cada partida.
- Los curas se dibujan con primitivas de canvas (sotana ovalada + cuello
  clerical + bonete + fajín violeta), como una figura vista desde arriba,
  sin necesitar ninguna imagen/foto.
- Ajustables en `vaticano-maze.js`: `priestCount` de cada etapa en
  `STAGES`, rango de velocidad en `buildPriests()` (`60 + rand()*30`), y el
  radio de colisión (`r: 12` dentro de `buildPriests()`).

## Pendiente: imágenes hiperrealistas de entrada/salida

Se pidieron fotos hiperrealistas del lugar físico en la entrada y salida de
cada laberinto (Gabriel se mantiene como token visto desde arriba; las
imágenes de los lugares no necesitan ese tratamiento). Esta sesión no tiene
herramienta de generación de imágenes disponible, así que **falta
generarlas y subirlas** para integrarlas — mismo pipeline que se usó con
`gabriel_normal.png` (recorte + medallón circular + `data:` URI embebido).

Se necesitan 6 imágenes, una por punto de entrada/salida:

| Etapa | Entrada | Salida |
|---|---|---|
| 1 | Plaza de San Pedro | Capilla Sixtina |
| 2 | Jardines Vaticanos | Palacio de la Gobernación |
| 3 | Ciudad Baja (Zona de Santa Ana) | Biblioteca Apostólica |

Sugerencia de prompts (para Midjourney/DALL·E/Stable Diffusion, ajusta el
estilo a lo que ya vienes usando en el resto del juego):
- *"Plaza de San Pedro, Vaticano, vista realista a nivel de calle, luz de
  atardecer, hiperrealista, sin personas en primer plano"*
- *"Interior de la Capilla Sixtina, frescos de Miguel Ángel, luz dorada
  ambiental, hiperrealista"*
- *"Jardines Vaticanos, setos geométricos y fuente, día soleado,
  hiperrealista"*
- *"Palacio de la Gobernación del Vaticano, fachada institucional italiana,
  hiperrealista"*
- *"Callejuela de Ciudad Baja / Zona de Santa Ana, Vaticano, arquitectura
  residencial modesta, hiperrealista"*
- *"Biblioteca Apostólica Vaticana, interior con estanterías antiguas y luz
  cálida, hiperrealista"*

Cuando las tengas, súbelas y las integro como: (a) un medallón circular en
el marcador de entrada/salida dentro del laberinto (mismo tratamiento que
el token de Gabriel), y (b) una imagen más grande en las tarjetas de
"Comenzar etapa" / "Etapa superada".


## Estado de esta entrega

| Archivo | Estado |
|---|---|
| `assets/games/laberinto-vaticano/vaticano-maze.js` | Listo, sin cambios pendientes |
| `assets/games/laberinto-vaticano/laberinto-action.js` | ✅ **Verificado** contra tu `puzzle-action.js` real — ya no es una reconstrucción especulativa |
| `index.html` | ✅ **Ya viene modificado** — es tu archivo real, con los 2 `<script>` y `<vaticano-maze id="vaticanoMaze">` agregados. Reemplaza el tuyo por este directamente. |
| `js/script.js` | ⚠️ **No viene modificado completo** — ver sección de abajo |

## `js/script.js`: por qué no viene ya modificado

Alcancé a leer tu `script.js` real completo y localizar `Escena32_Vaticano`
(era una escena de diálogo con Marcus Vitelli en el archivo de documentos,
no una escena de exploración al aire libre — ver más abajo). Pero el
archivo se volvió inaccesible en esta sesión antes de que pudiera generarte
el archivo completo ya parcheado (es un archivo grande; el acceso a
uploads grandes a veces se pierde a mitad de sesión).

Tengo el bloque exacto de `Escena32_Vaticano` capturado verbatim — está en
`escena-ejemplo.js` (ANTES / DESPUÉS) dentro de esta carpeta. Solo tienes
que buscar ese bloque en tu `script.js` real y agregar la línea
`'laberinto vaticanoMaze',` en el punto indicado (o pegarla tú mismo, es
una sola línea).

Si prefieres que te devuelva el `script.js` completo ya parcheado, vuelve a
subirlo en un mensaje nuevo y lo hago en el momento.

## ⚠️ Decisión narrativa que tomé — confírmala

Tu `Escena32_Vaticano` real **no es** una escena de exploración por Plaza
San Pedro / Museos / Jardines / Ciudad Baja como yo había asumido al
construir el minijuego originalmente — es una escena de diálogo con Marcus
Vitelli dentro de un archivo de documentos (`bg_vaticano` →
`bg_documentos_vaticano`), con un choice sobre cómo presionarlo por
archivos restringidos.

Como la escena arranca literalmente con *"El Vaticano es un laberinto de
mármol, silencio y secretos"*, inserté `'laberinto vaticanoMaze'` justo
después de esa línea introductoria y **antes** de `'show scene
bg_documentos_vaticano with fadeIn'` — es decir, Gabriel atraviesa
físicamente el laberinto (las 3 etapas ya construidas) como el trayecto
literal hacia el archivo donde lo espera Marcus.

Si preferías el laberinto en otro punto —una escena aparte antes de
`Escena32_Vaticano`, después del diálogo con Marcus, o repensar las 3
etapas para que representen mejor lo que pasa en *esta* escena en
particular (un archivo/biblioteca, no jardines/plazas)— dímelo y lo ajusto.
Las etapas actuales (Plaza de San Pedro → Museos → Capilla Sixtina /
Jardines → Gobernación / Ciudad Baja → Biblioteca Apostólica) siguen siendo
válidas como "el trayecto físico de Gabriel por la Ciudad del Vaticano",
pero no estaban atadas a nada del guion real hasta ahora.

## ✅ Contrato de `laberinto-action.js` — ya verificado, no especulado

A diferencia de la entrega anterior, esta vez comparé línea por línea contra
tu `puzzle-action.js` real y corregí `laberinto-action.js` para calzar
exactamente:

| En tu `puzzle-action.js` real | Ya aplicado en `laberinto-action.js` |
|---|---|
| `static id = 'Puzzle';` (campo, no método) | `static id = 'Laberinto';` |
| `static matchString([action]){ return action === 'puzzle'; }` | `static matchString([action]){ return action === 'laberinto'; }` |
| `constructor([puzzle, elementId]){ this.elementId = elementId \|\| 'cityPuzzle'; }` | `constructor([laberinto, elementId]){ this.elementId = elementId \|\| 'vaticanoMaze'; }` |
| `apply()` hace `el.setAttribute('mandatory','')` → `el.open()`, espera el evento, luego `el.removeAttribute('mandatory'); el.close(); resolve();` | Idéntico, con el evento `laberinto:completado` |
| `didApply()` → `Promise.resolve({advance:true})` | Igual |
| `revert()` / `didRevert()` con `{advance:true, step:true}` | Igual |
| `monogatari.registerAction(PuzzleAction)` (minúscula) | `monogatari.registerAction(LaberintoAction)` |

**Cambio correspondiente en `vaticano-maze.js`**: como es la Acción quien
ahora llama `el.close()` tras recibir el evento (no el componente mismo),
`finishGame()` ya no se auto-cierra — solo dispara
`'laberinto:completado'` y deja que `laberinto-action.js` haga el resto,
igual que `puzzle:cifrado-completo` → `el.close()` en tu rompecabezas real.

Nota: tu `<rune-puzzle>` sí tiene una X de cierre que `mandatory` oculta;
`<vaticano-maze>` no tiene ese botón (solo "Reiniciar etapa", que no cierra
el minijuego). Igual seteo/limpio el atributo `mandatory` para mantener el
mismo contrato, por si más adelante agregas algo que debiera ocultarse.

## Pasos que te faltan

1. **Copia la carpeta** `assets/games/laberinto-vaticano/` completa a tu
   proyecto en OneDrive (junto a `cifrado-tres-ciudades/`,
   `ruta7-carretera-austral/` y `epigrama-antipatro/`).
2. **Reemplaza tu `index.html`** por el de este paquete (ya tiene todo
   aplicado — puedes hacer diff contra el tuyo si quieres confirmar que
   solo se agregaron las 3 líneas nuevas).
3. **Edita tu `js/script.js`** a mano con el bloque de `escena-ejemplo.js`
   (una sola línea nueva: `'laberinto vaticanoMaze',`), o vuelve a
   subírmelo para que te lo devuelva ya parcheado completo.
4. Prueba en el navegador (`index.html` con doble clic) saltando a
   `Escena32_Vaticano` — confirma que el laberinto se ve bien, Gabriel se
   mueve, y al terminar las 3 etapas la conversación con Marcus arranca
   sola.

## Verificación realizada en esta sesión

- `node --check` sobre `vaticano-maze.js` y `laberinto-action.js`: sin
  errores.
- `diff` entre tu `index.html` real y el modificado: confirma que el único
  cambio son las 2 líneas `<script>` y la línea `<vaticano-maze>` — nada
  más se tocó.
- Contrato de `laberinto-action.js` comparado método por método contra tu
  `puzzle-action.js` real (tabla arriba) — ya no es una reconstrucción
  especulativa.
- Lógica de generación/colisión de los 3 laberintos, validada por
  simulación en Node (ver entrega anterior): 0 colisiones en el camino
  óptimo real de cada etapa, conectividad 100% verificada por BFS.

**Sigue pendiente** (no se pudo probar en esta sesión, sin navegador
headless disponible): comportamiento visual real en tu build (z-index
contra `text-box`/`quick-menu`, tamaño/sensación de Gabriel en pantalla).
