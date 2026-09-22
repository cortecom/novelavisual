# Minijuego — Escena 23: Reconstrucción del Coloso de Rodas

Componente nativo de Monogatari (`<coloso-puzzle>`), mismo patrón arquitectónico que
`rune-puzzle`, `epigrama-puzzle`, `vaticano-maze` y `ruta7-race`: Web Component +
Shadow DOM + Acción de Monogatari, IIFE desde el inicio en ambos archivos (lección
aprendida con la colisión de `_build` global entre epigrama y laberinto).

## Archivos entregados

```
assets/games/coloso-rodas/
├── coloso-puzzle.js   (componente <coloso-puzzle>, ~1.15 MB — incluye las 16 imágenes en base64)
├── coloso-action.js   (registra el verbo 'coloso' como Acción de Monogatari)
├── index-snippet.html (líneas a agregar en index.html)
├── escena-ejemplo.js  (Escena23 completa, lista para pegar en script.js)
├── images/            (las 16 imágenes fuente por separado, por si las reutilizas en otra escena)
└── INTEGRACION.md     (este archivo)
```

Nota: solo `coloso-puzzle.js`, `coloso-action.js`, `index-snippet.html` y
`escena-ejemplo.js` van dentro del proyecto Monogatari real. La carpeta `images/` es
solo de referencia/respaldo — el juego no la lee en tiempo de ejecución porque las
imágenes ya están incrustadas como `data:` URIs dentro de `coloso-puzzle.js`.

## Pasos de integración

1. Copia la carpeta `coloso-rodas/` completa a `assets/games/` dentro del proyecto real
   (`OneDrive/.../Novela Visual/assets/games/coloso-rodas/`).
2. En `index.html`: agrega las dos etiquetas `<script>` (después de `main.js`, antes de
   `script.js`) y el elemento `<coloso-puzzle id="colosoPuzzle"></coloso-puzzle>` dentro
   de `<game-screen>` — ver `index-snippet.html`.
3. En `js/script.js`: reemplaza el bloque completo del label `'Escena23'` por el que está
   en `escena-ejemplo.js`. El `addItem('simulacion_coloso')` y el `Choice` final de
   decisión (Alejandría / Atenas / alineación solar) se mantienen exactamente igual que
   antes — solo se reemplaza el placeholder de texto por la llamada real al minijuego
   (`'coloso colosoPuzzle'`).

## Contrato de la Acción (`coloso-action.js`)

Igual que `PuzzleAction` / `RaceAction`:
- `apply()` llama a `document.getElementById('colosoPuzzle').open()` y espera el evento
  `coloso:completado`.
- `didApply()` devuelve `{ advance: true }` para que el guion siga solo.
- `static id` como campo (no método), `static matchString([action])`, constructor con
  tokens destructurados `([verb, elementId])` — todo según los aprendizajes ya
  documentados del motor.

## Las 3 etapas

**Etapa 1 — Buceo por coordenadas** (canvas, vista cenital, WASD/flechas)
El jugador recupera 3 hallazgos (dos bloques de bronce + el anclaje de plomo) mientras
esquiva a 2 buzos rivales del mercado negro. Igual que en `ruta7-race`: 3 choques →
pantalla "Buzo a la deriva" → botón "Reintentar la etapa" (reinicia posición, buzos
rivales y los 3 hallazgos de esta etapa; no hay progreso de etapas previas que perder,
ya que es la única etapa de búsqueda).

**Etapa 2 — Tablero de pistas** (corcho, point-and-click)
Los 3 hallazgos (izquierda) deben conectarse con su registro correspondiente del
mercado negro (derecha), leyendo las descripciones de cada tarjeta. Conexión correcta
→ tarjetas bloqueadas + hilo dorado dibujado con SVG. Conexión incorrecta → sacudida
breve, sin penalización dura. Al completar las 3, se habilita "Continuar".

**Etapa 3 — Ensamblaje** (drag & drop sobre la imagen real del Coloso)
Los 3 fragmentos autenticados se arrastran a su zona anatómica correcta (corona/antorcha,
torso, piernas/base) sobre `simulacion_coloso.png`, mostrada primero en escala de grises
y semitransparente como guía. Al completar las 3 zonas, la imagen se revela a todo color
con una animación de brillo pulsante sobre el pectoral (donde ya está grabado el símbolo
de doble espiral en tu imagen de referencia) → pantalla de victoria → evento
`coloso:completado`.

## Origen de las imágenes embebidas

Extraídas de la imagen-montaje de 8 assets que adjuntaste (`1788883191360_image.png`),
que ya traía cada objeto con transparencia real por separado (canal alfa), separada
mediante detección de componentes conectados (`scipy.ndimage.label`). A cada sprite de
personaje/objeto (bloques de bronce, anclaje, ambos buzos) se le quitó además el fondo
blanco individual de su celda mediante chroma-key + feather (mismo tipo de pipeline que
usaste para jeep/roca/camión en `ruta7-race`), y se limpiaron restos sueltos quedándose
solo con el componente conectado más grande. Las texturas (fondo marino, corcho) y la
foto de mercado negro se dejaron opacas (convertidas a JPEG para aligerar peso). El
`simulacion_coloso.png` y el fondo `rodas_puerto.png` que adjuntaste se incluyeron tal
cual — a este último se le cubrió la marca de agua "Made with AI" de la esquina superior
derecha con un parche del mismo tono de cielo (no se usa directamente en el minijuego,
solo quedó optimizado en la carpeta por si quieres usarlo como fondo de escena).

## Cambios v2

Petición del usuario: dividir la Etapa 1 en 3 escenas/rondas, agrandar el fondo marino y
los sprites poco visibles, hacer más lentos a los buzos rivales, agrandar las tarjetas
de la Etapa 2 para mejorar la lectura, y en la Etapa 3 usar más fragmentos (de los 9
disponibles en la Etapa 1, 3 deben quedar necesariamente sin encontrar) con zonas de
ensamblaje más ajustadas.

- **Etapa 1 — 3 rondas**: "Muelle Norte", "Canal de Entrada" y "Rompeolas Sur". Cada
  ronda tiene 3 puntos de interés: 2 fragmentos reales recuperables + 1 hallazgo bajo
  candado (🔒) marcado visualmente como imposible de recuperar — así el jugador sabe de
  inmediato que ese punto no cuenta, en vez de perder tiempo con un señuelo indistinguible.
  Al fallar 3 veces se reintenta solo la ronda actual; los fragmentos ya recolectados en
  rondas previas (y en el intento actual) no se pierden.
- **Canvas y sprites más grandes**: canvas de 640×420 a 820×520; buzos, hallazgos y
  buzos rivales dibujados a mayor escala; el patrón del fondo marino ahora se escala
  1.7× (`CanvasPattern.setTransform`, mismo recurso ya usado en `roadTexture()` de
  `ruta7-race`) para que la textura se lea con claridad en vez de verse como un moteado
  fino.
- **Buzos rivales más lentos**: velocidad de persecución bajada a 88 u/s (antes 130) y
  velocidad angular de patrullaje reducida a la mitad aproximadamente.
- **Etapa 2 — tarjetas más grandes**: miniaturas de 44px → 64px, texto de 12.5px →
  14.5px, columnas con `overflow-y:auto` para acomodar los 6 pares (antes 3) sin
  romper el layout.
- **Etapa 3 — 6 fragmentos, no 3**: los 6 fragmentos recuperables (2 por ronda) se
  arrastran a 6 zonas anatómicas (corona, brazo con antorcha, torso, manto, piernas,
  pies/base) recalibradas para no solaparse y ajustarse mejor a la silueta real de
  `simulacion_coloso.png`. Como solo se pueden recuperar 3 de los 3 sprites base
  (bloque A, bloque B, anclaje), cada uno se reutiliza dos veces con una variante de
  `ctx.filter`/CSS `filter` (hue-rotate, saturación, brillo) para que los 6 fragmentos
  se vean lo bastante distintos entre sí tanto en el canvas de la Etapa 1 como en las
  tarjetas/tokens de las etapas 2 y 3.

## Cambios v3

Petición del usuario: buzos rivales aún más lentos, cambiar por completo la lógica de
la Etapa 2, y que la imagen del Coloso ocupe todo el fondo de la Etapa 3.

- **Etapa 1 — buzos más lentos todavía**: velocidad de persecución bajada de 88 a 52
  u/s, y la velocidad angular de patrullaje de cada ronda reducida a casi la mitad de
  la v2.
- **Etapa 2 — lógica invertida por completo**: ya no se trata de emparejar los 6
  hallazgos recuperados con su registro correspondiente. Ahora se presentan 9 tarjetas
  del mercado negro (los 6 registros de las piezas que YA tienes, como señuelo, más 3
  registros nuevos que corresponden a los 3 hallazgos que quedaron bajo candado en la
  Etapa 1) y el jugador debe seleccionar exactamente esos 3 —guiándose por las pistas
  de ubicación en el texto de cada tarjeta ("Muelle Norte", "Canal de Entrada",
  "Rompeolas Sur", que coinciden con las rondas donde apareció el candado 🔒)— y
  confirmar. Selección incorrecta: sacudida + reintento libre, sin penalización dura.
  Selección correcta: esos 3 fragmentos se suman al inventario, quedando 9 fragmentos
  en total para la Etapa 3 (ya no 3 quedan "perdidos para siempre" — el mercado negro
  permite recuperarlos por otra vía, lo cual además es un giro narrativo agradable).
- **Etapa 3 — el Coloso como fondo completo**: `simulacion_coloso.png` ahora se
  muestra a `position:absolute; inset:0` cubriendo TODO el área de la etapa (antes era
  una columna angosta de 320px al lado de la bandeja). Las 9 zonas de ensamblaje están
  recalibradas sobre esa superficie completa (se agregaron 3 zonas nuevas: rostro,
  mano con la antorcha, cinturón). La bandeja de fragmentos arrastrables pasó de ser
  una columna lateral a una barra horizontal semitransparente en la parte inferior
  (`overflow-x:auto`, con `pointer-events:none` en el contenedor y `pointer-events:auto`
  solo en cada token, para no bloquear el resto de la imagen).

## Cambios v4

Petición del usuario: mover `assets-fuente/` a `images/`, buzos rivales partiendo
arriba lejos del jugador, desplazamiento más realista (con inercia) y volteo del
sprite según la dirección, Etapa 2 más fácil de leer (panel de lo ya recuperado +
6 señuelos que no tienen nada que ver con el Coloso) y feedback de aciertos parciales.

- **Carpeta renombrada**: `assets-fuente/` → `images/` (mismo contenido, más los 6
  señuelos nuevos).
- **Etapa 1 — spawn de los buzos rivales**: las 3 rondas ahora inician a los buzos
  rivales arriba del canvas (y≈70-100), lejos del punto de partida del jugador
  (siempre abajo, al centro).
- **Etapa 1 — movimiento con inercia**: tanto el jugador como los buzos rivales ahora
  aceleran/frenan en vez de moverse a velocidad constante instantánea
  (`moveWithInertia()`, con `PLAYER_ACCEL=7` para el jugador —responde rápido— y
  `RIVAL_ACCEL=2.6` para los rivales —sensación de arrastre en el agua, coherente con
  que además son más lentos—).
- **Etapa 1 — sprite orientado a la dirección**: el sprite del buzo (jugador y
  rivales) ahora se voltea horizontalmente (`ctx.scale(-1,1)`) según hacia qué lado se
  esté moviendo, en vez de quedar siempre mirando hacia el mismo lado.
- **Etapa 2 — mucho más legible**:
  - Se agregó un panel de referencia arriba del tablero que muestra los 6 fragmentos
    ya recuperados por buceo (miniatura + nombre), para poder compararlos contra los
    9 registros del mercado negro.
  - Los 6 señuelos ya NO son las mismas fotos de fragmentos del Coloso (antes esto
    obligaba a leer cada texto con mucho cuidado). Ahora son 6 objetos completamente
    distintos y sin relación con el Coloso —ánfora, monedas, anillo, daga, lámpara de
    aceite, máscara funeraria— generados como placeholder simple (`images/anfora.jpg`,
    etc.) para que el archivo funcione ya mismo. **Quedan pendientes de reemplazo por
    versiones hiperrealistas** — prompts abajo.
  - Al confirmar una selección incorrecta, ahora se indica cuántos de los 3
    seleccionados eran efectivamente correctos ("2 de 3 eran correctos. Vuelve a
    intentarlo."), en vez de solo decir que estaba mal.

### Prompts para reemplazar los 6 señuelos placeholder

> "Top-down aerial view of an ancient ceramic amphora, resting on dark velvet cloth, black market auction photography, dramatic single-light photography, hyperrealistic, isolated on dark background"

> "Close-up photograph of a small pile of ancient silver Rhodian coins on black velvet cloth, auction documentation style, dramatic single-light photography, hyperrealistic"

> "Close-up photograph of an ancient gold ring with a red gemstone, resting on black velvet cloth, auction/black market documentation style, hyperrealistic, dramatic single-light photography"

> "Close-up photograph of an ancient ceremonial dagger with a bone handle, resting on black velvet cloth, black market auction photography, hyperrealistic, dramatic lighting"

> "Close-up photograph of an ancient terracotta oil lamp, resting on black velvet cloth, auction documentation style, hyperrealistic, dramatic single-light photography"

> "Close-up photograph of an ancient bronze funerary mask, resting on black velvet cloth, black market auction photography, hyperrealistic, dramatic single-light photography"

Cuando tengas las 6 imágenes reales, reemplaza los archivos en `images/anfora.jpg`,
`moneda.jpg`, `anillo.jpg`, `daga.jpg`, `lampara.jpg` y `mascara.jpg` (incluso puedes
mantener la extensión `.jpg`), y avísame para regenerar `coloso-puzzle.js` con esas
imágenes incrustadas en vez del placeholder.

## Cambios v5

Petición del usuario: cambiar la narrativa de "custodia permanente" a "fragmentos
perdidos que probablemente fueron rescatados y vendidos en el mercado negro"; bajar la
zona del cinturón en la Etapa 3, que estaba muy arriba; y rellenar los espacios en
blanco de la silueta con 6 zonas decorativas que no requieren fragmento.

- **Etapa 1 — narrativa cambiada**: el ícono pasó de 🔒 (candado / custodia) a ❔
  (fragmento perdido). Instrucciones, mensaje al tocar el punto y texto de ronda
  completada actualizados: ya no se dice que el hallazgo está "bajo custodia
  permanente", sino que "alguien se te adelantó y lo rescató antes — seguramente
  terminó en el mercado negro". La mecánica no cambió (sigue sin poder recogerse en la
  Etapa 1), solo el motivo narrado. La instrucción de la Etapa 2 también se ajustó para
  ser consistente con esta nueva narrativa (mecánica sin cambios, quedó bien como
  estaba).
- **Etapa 3 — cinturón reposicionado**: de `top:31` (pegado al torso) a `top:44`, a la
  altura de la cadera, dejando el espacio correcto entre el torso (termina en 31) y las
  piernas (empiezan en 56).
- **Etapa 3 — 6 zonas decorativas nuevas**: `hombro_derecho`, `costado_izquierdo`,
  `cintura_baja`, `pliegue_manto_inferior`, `pantorrillas` y `pedestal` — rellenan los
  huecos que quedaban entre las 9 zonas jugables. Son puramente visuales (borde y
  relleno sutil, `pointer-events:none`), no aceptan fragmentos ni afectan la lógica de
  victoria; solo hacen que la silueta se sienta completa desde el principio en vez de
  tener partes en blanco alrededor de las 9 zonas reales.

## Un supuesto a verificar

El listener de limpieza al usar el botón "Salir" del menú rápido de Monogatari asume el
selector `[data-action="quit"]`. Si tu quick-menu usa otro atributo/clase para el botón
de salir, avísame el selector real y lo ajusto — si no, el componente igual funciona
normalmente, solo no se cerraría automáticamente al salir a mitad del minijuego.

## Pendiente para probar

- Reemplazar los archivos manualmente en OneDrive (recuerda: el picker de subida de
  OneDrive no es automatizable, así que esta parte la haces tú).
- Probar con `monogatari.run('jump Escena23')` en la consola para saltar directo a la
  escena y verificar las 3 etapas de corrido.
- Si el quick-menu de "Reintentar" o el diseño de las tarjetas se ve descuadrado en tu
  resolución real, cuéntame el síntoma exacto y ajustamos — mismo flujo iterativo de
  siempre.
