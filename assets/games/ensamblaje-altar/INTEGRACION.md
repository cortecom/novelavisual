# Minijuego — Escena 42: "El Altar de las Ocho Maravillas"

Minijuego de 3 etapas dentro de una sola sesión de juego:

1. **El mapa de las maravillas** — arrastrar las 7 maravillas clásicas a
   la ciudad del Mediterráneo donde estuvieron o están.
2. **Los testigos** — arrastrar a 7 personajes históricos (uno por
   maravilla) a la ciudad de la maravilla con la que se les identifica.
3. **El altar** — las 7 maravillas clásicas en círculo por antigüedad
   real de construcción, más la octava luz en el centro (mecánica sin
   cambios desde la v4/v5).

Las 3 etapas viven en el mismo componente y se resuelven en una sola
sesión — el contrato externo hacia Monogatari no cambia: mismo verbo
`ensamblaje`, mismo evento final `ensamblaje:completado` (disparado solo
al terminar la etapa 3, no antes). Sigue el mismo patrón arquitectónico
que el resto de los minijuegos del proyecto: Web Component con Shadow
DOM, más una Action de Monogatari — ambos en **un solo archivo JS**
(`ensamblaje-altar.js`), cada uno en su propio IIFE.

## Archivos de este paquete

- `ensamblaje-altar.js` — archivo único: el componente `<ensamblaje-puzzle>`
  Y la Action que registra el verbo `ensamblaje`, uno detrás del otro.
- `index-snippet.html` — las líneas exactas a agregar en `index.html`.
- `escena42-snippet.js` — el bloque `Escena42` de referencia (ya lo
  tienes integrado con el patrón async + guarda de storage, igual que
  tus otros minijuegos) — **sin cambios por este rediseño de 3 etapas**,
  ya que el verbo y el evento final son los mismos.
- `script-js-parches.md` — referencia histórica: los 8 objetos ya son
  items reales de inventario en tu proyecto, no falta aplicar nada.

**Ya integrado en tu proyecto real.** Solo hace falta reemplazar
`ensamblaje-altar.js` por esta versión — nada más cambia:

1. Copiar `ensamblaje-altar.js` a `assets/games/ensamblaje-altar/`,
   reemplazando el archivo anterior.
2. `index-snippet.html`, `script-js-parches.md` y el bloque `Escena42`
   quedan exactamente igual que ya los tienes integrados — no hay que
   tocar nada más en `script.js` ni en `index.html`.
3. Para probar: `monogatari.run('jump Escena42')`.

## Por qué 3 etapas (v6)

El usuario reportó que el minijuego se sentía "muy sencillo, con una
sola etapa" y pidió agregar una Etapa 1 y una Etapa 2 antes del altar.
Se acordaron 2 mecánicas nuevas, ambas sobre un mapa compartido de las 7
ciudades del itinerario mediterráneo (Olimpia, Rodas, Éfeso, Halicarnaso,
Babilonia, Alejandría, Giza — la octava luz no participa, porque se
obtiene en Sidón, fuera de ese itinerario, y solo tiene sentido en el
centro del altar de la etapa 3):

- **Etapa 1**, con los mismos 7 objetos-maravilla que ya usa el altar
  (sin la octava luz): cada uno se arrastra a su ciudad.
- **Etapa 2**, con 7 testigos históricos nuevos — uno por maravilla —
  que se arrastran a la misma ciudad que su maravilla:

| Testigo | Rol | Ciudad |
|---|---|---|
| Hemiunu | Arquitecto real de la Gran Pirámide | Giza |
| Amitis | Reina para quien se habrían construido los Jardines | Babilonia |
| La Sacerdotisa de Artemisa | Guardiana del Templo de Artemisa (rol genérico, sin nombre propio en las fuentes) | Éfeso |
| Fidias | Escultor de la Estatua de Zeus | Olimpia |
| Artemisia II | Viuda de Mausolo, mandó construir el Mausoleo | Halicarnaso |
| Cares de Lindos | Escultor del Coloso de Rodas | Rodas |
| Sóstrato de Cnido | Arquitecto del Faro de Alejandría | Alejandría |

Al completar una etapa, un mensaje breve confirma el logro y el
minijuego avanza solo a la siguiente (sin pedir confirmación) — solo la
etapa 3 termina con la pantalla de victoria y el botón "Continuar".

## Ajustes v7: mapa con más carácter + sin pistas de ciudad regaladas

El usuario reportó dos problemas después de probar la v6:

1. **"Falta un mapa de fondo"** — el fondo de las etapas 1 y 2 era solo
   una textura de pergamino lisa, sin nada que lo hiciera lucir como un
   mapa real. Se agregó una capa decorativa dibujada inline como SVG
   (`MAPA_DECOR_SVG`, sin depender de ningún archivo de imagen nuevo):
   una rosa de los vientos, oleaje en las esquinas libres, esquineros
   ornamentales y el rótulo "MARE NOSTRUM" — todo ubicado a mano en las
   zonas donde no cae ningún pin de ciudad, usando el mismo sistema de
   coordenadas porcentuales que ya usa `CIUDADES`. Si más adelante se
   genera un mapa ilustrado real (ver el prompt más abajo), esta capa se
   reemplaza por un `<img>` de fondo dentro de `.mapa-wrap` sin tocar el
   resto del componente.
2. **"Sacar de los objetos y personajes de dónde son, si no será muy
   fácil ubicarlo en la ciudad"** — varios nombres formales de las
   maravillas incluyen la ciudad de forma literal (ej. "Coloso de
   **Rodas**", "Mausoleo de **Halicarnaso**", "Faro de **Alejandría**",
   "Gran Pirámide de **Giza**", "Jardines Colgantes de **Babilonia**"),
   y el tooltip de la Etapa 1 mostraba ese nombre completo — delatando
   la respuesta sin que el jugador tuviera que saber nada. Se corrigió
   así:
   - Los 5 objetos afectados ahora tienen un campo `apodo` (el nombre
     corriente de la maravilla, sin la ciudad: "La Gran Pirámide", "Los
     Jardines Colgantes", "El Mausoleo", "El Coloso", "El Faro"), y el
     tooltip de la Etapa 1 usa `apodo` en vez del nombre formal.
   - En la Etapa 2, los roles de Cares de Lindos ("Escultor del Coloso
     de Rodas") y Sóstrato de Cnido ("Arquitecto del Faro de
     Alejandría") también mencionaban la ciudad de forma literal — se
     recortaron a "Escultor del Coloso" y "Arquitecto del Faro". Los
     otros 5 testigos ya no mencionaban su ciudad de forma literal, se
     revisaron uno por uno para confirmarlo.
   - Se agregó un test de regresión (`test-city-leak`, no se incluye en
     este ZIP) que verifica programáticamente que ningún tooltip de la
     Etapa 1 ni ningún rol de la Etapa 2 contenga el nombre de su propia
     ciudad — para que este tipo de filtración no se vuelva a colar en
     futuros cambios de contenido.

   El resto del contexto (el ícono, el nombre del objeto/testigo, y en
   la Etapa 2 el vínculo histórico con la maravilla) se mantiene, para
   que el desafío siga siendo "saber a qué maravilla corresponde esto y
   dónde estuvo esa maravilla" y no "leer la ciudad en la pantalla".

## Ajustes v8: luz azul + bug del mensaje final

Dos ajustes puntuales pedidos por el usuario después de la v7:

1. **Luz dorada → luz azul.** El halo pulsante de la ranura central
   (la octava luz) y el texto del mensaje final eran dorados, pero la
   narración de la propia Escena 42, fuera del minijuego (ver
   `escena42-snippet.js`), dice explícitamente *"El altar se ilumina
   con una luz azul"*. Se cambió el color del halo de la ranura central
   (`.slot-centro`, `.slot-centro.dragover`, `@keyframes pulseCentro`,
   `.hint-centro`) y la palabra "dorada" del mensaje final a "azul",
   para que ambos coincidan. El resto de la paleta del minijuego (el
   título, los números de las 7 ranuras exteriores, el botón
   "Continuar", etc.) se dejó igual — son dorados por diseño general del
   altar, no representan "la luz" en sí.
2. **Bug real: la imagen y la etiqueta de la octava luz quedaban
   pegadas sobre el mensaje final.** La ranura central tiene su propio
   `z-index` (para destacarse mientras se juega, sobre el resto del
   altar). Ninguno de sus contenedores (`.root`, `.altar-wrap`,
   `.slots`) crea su propio contexto de apilamiento CSS, así que ese
   `z-index` terminaba compitiendo directamente contra la pantalla de
   victoria (`.victory`, sin `z-index` propio) y le ganaba — el
   navegador ignora el orden del DOM cuando hay un `z-index` explícito
   de por medio. Resultado: al terminar la etapa 3, la imagen de la
   octava luz y el texto "la octava luz — el origen" quedaban visibles
   encima del mensaje de victoria. Corregido ocultando explícitamente
   `.altar-wrap` dentro de `showVictory()`, igual que ya se hacía al
   cambiar de etapa — verificado con un test de Chromium real que
   comprueba `display: none` en `.altar-wrap` una vez visible la
   victoria.

## Assets: qué necesitas generar (y qué no)

**Fondo del mapa:** se dibuja con CSS + un SVG decorativo inline (rosa de
los vientos, oleaje, esquineros, rótulo "MARE NOSTRUM"), sin depender de
ningún archivo de imagen, así que las etapas 1 y 2 funcionan de
inmediato. Si más adelante quieres reemplazarlo por un mapa ilustrado
real, agrega el `<img>` de fondo dentro de `.mapa-wrap` en el componente
(delante de `.pines`, detrás o en vez de `.mapa-bg`/`.mapa-decor`) — no
es necesario para que el minijuego funcione. Prompt sugerido, en el
mismo estilo hiperrealista del resto del arte del proyecto:

**`mapa_mediterraneo_antiguo.jpg`**
> Fotografía hiperrealista de un mapa antiguo de pergamino del
> Mediterráneo oriental, estilo cartografía del siglo XVIII, con tinta
> sepia, ilustraciones de barcos y una rosa de los vientos, sin nombres
> de ciudades marcados (los nombres los agrega el propio minijuego).
> Textura de papel envejecido, iluminación de estudio, fondo ligeramente
> oscurecido en los bordes, formato cuadrado.

**Retratos de los 7 testigos:** por ahora usan un medallón genérico
dibujado con un SVG embebido en el propio archivo (sin depender de
ningún archivo externo) — el minijuego es jugable de inmediato sin
esperar arte nuevo. Cuando quieras retratos reales, en español y en el
mismo estilo hiperrealista del resto de los íconos del inventario (fondo
blanco o transparente, retrato centrado, estilo busto/grabado clásico):

**`hemiunu.png`**
> Fotografía hiperrealista de un busto de piedra caliza estilo egipcio
> antiguo, representando a un arquitecto egipcio de la IV dinastía,
> tocado nemes tradicional, expresión serena y autoritaria. Iluminación
> de estudio, fondo blanco liso, retrato centrado, estilo fotografía de
> catálogo de museo.

**`amitis.png`**
> Fotografía hiperrealista de un busto o relieve estilo mesopotámico
> antiguo de una reina persa/media, con joyería y tocado ornamentado
> propio de la corte de Media, expresión digna. Iluminación de estudio,
> fondo blanco liso, retrato centrado, estilo fotografía de catálogo de
> museo.

**`sacerdotisa_efeso.png`**
> Fotografía hiperrealista de un busto o estatua de mármol de una
> sacerdotisa griega del culto a Artemisa, con velo y diadema ritual,
> expresión solemne. Iluminación de estudio, fondo blanco liso, retrato
> centrado, estilo fotografía de catálogo de museo.

**`fidias.png`**
> Fotografía hiperrealista de un busto de mármol griego clásico de un
> escultor ateniense del siglo V a.C., barba y cabello cortos al estilo
> griego clásico, expresión concentrada de artista. Iluminación de
> estudio, fondo blanco liso, retrato centrado, estilo fotografía de
> catálogo de museo.

**`artemisia_ii.png`**
> Fotografía hiperrealista de un busto de mármol helenístico de una
> reina de Caria del siglo IV a.C., diadema real, expresión de duelo
> digno (viuda gobernante). Iluminación de estudio, fondo blanco liso,
> retrato centrado, estilo fotografía de catálogo de museo.

**`cares_de_lindos.png`**
> Fotografía hiperrealista de un busto de bronce o mármol de un escultor
> griego de Rodas del siglo III a.C., complexión robusta de artesano,
> expresión decidida. Iluminación de estudio, fondo blanco liso, retrato
> centrado, estilo fotografía de catálogo de museo.

**`sostrato_de_cnido.png`**
> Fotografía hiperrealista de un busto de mármol de un arquitecto griego
> del siglo III a.C., expresión intelectual y observadora, propia de un
> erudito de la corte ptolemaica. Iluminación de estudio, fondo blanco
> liso, retrato centrado, estilo fotografía de catálogo de museo.

Una vez generados, pasarlos por el mismo pipeline de recorte (PIL +
detección de componente alfa + chroma-key) que ya usas para el resto de
los íconos, guardarlos en `assets/icons/` con esos nombres, y cambiar el
campo `icon` de cada testigo en `TESTIGOS` (dentro de
`ensamblaje-altar.js`) de `BUSTO_SVG` al path real — no hace falta tocar
ninguna otra parte del componente.

## Mapeo de maravillas (sin cambios desde la v5)

| # | Maravilla | Item usado | Ciudad | Testigo (etapa 2) |
|---|---|---|---|---|
| — (centro, etapa 3 solamente) | **La Octava Luz** | `epigrama_antipatro` | Sidón (fuera del mapa) | — |
| 1 | Gran Pirámide de Giza (~2560 a.C.) | `grabado_piramide_giza` | Giza | Hemiunu |
| 2 | Jardines Colgantes de Babilonia (~600 a.C.) | `jardines_reconstruidos` | Babilonia | Amitis |
| 3 | Templo de Artemisa, Éfeso (~550 a.C.) | `inscripcion_secreta` | Éfeso | La Sacerdotisa de Artemisa |
| 4 | Estatua de Zeus, Olimpia (~435 a.C.) | `fragmento_marfil` | Olimpia | Fidias |
| 5 | Mausoleo de Halicarnaso (~350 a.C.) | `miniatura_cuadriga` | Halicarnaso | Artemisia II |
| 6 | Coloso de Rodas (~280 a.C.) | `simulacion_coloso` | Rodas | Cares de Lindos |
| 7 | Faro de Alejandría (~280 a.C.) | `pergamino_faro` | Alejandría | Sóstrato de Cnido |

Ya no queda ningún ícono placeholder entre los 7 objetos-maravilla: los
7 usan su propio ícono real, incluido `grabado_piramide_giza.png` (arte
ya generado e integrado en `itemIcons`).

## Mecánica del minijuego

- **Etapas 1 y 2 (mapa):** 7 "pines" de ciudad, con el nombre de la
  ciudad siempre visible debajo — el desafío es saber a qué ciudad
  corresponde cada maravilla/testigo, no encontrar la ciudad en el mapa.
  El tooltip de cada objeto/testigo (al pasar el mouse) nunca menciona
  su propia ciudad de forma literal (ver "Ajustes v7" más arriba), así
  que no se puede resolver solo leyendo la pantalla.
  Un intento incorrecto rebota con una sacudida y un mensaje ("[objeto]
  no corresponde a esa ciudad" / "[testigo] no está vinculado con esa
  ciudad"), sin penalización — se puede reintentar indefinidamente. Al
  completar las 7, un mensaje de éxito breve y la etapa avanza sola.
- **Etapa 3 (altar):** sin cambios desde la v4/v5 — ranura central para
  la octava luz (más grande, halo dorado pulsante) + 7 ranuras
  exteriores en círculo por antigüedad real de construcción.
- Solo la etapa 3 dispara `ensamblaje:completado` (al pulsar
  "Continuar" en la pantalla de victoria) — las etapas 1 y 2 avanzan
  internamente, sin que la Action se entere de la transición.
- Arrastre por Pointer Events (mouse y touch), sin depender de
  `document.elementFromPoint()` — detección geométrica con
  `getBoundingClientRect()`, igual que el resto de los minijuegos.
- El botón "Continuar" llama a `self.close()` antes de disparar el
  evento final (bug real corregido en la v5 — el componente antes no se
  cerraba nunca).
- El botón X de cierre se oculta mientras `mandatory` esté activo (lo
  fija la Action al abrir), igual que el resto de los minijuegos.
- Toda la configuración de cada etapa (qué items arrastra, contra qué
  zona se valida cada uno, los textos de instrucciones/errores) vive en
  una sola función `etapaConfig(n)` dentro del componente — agregar o
  quitar una etapa, o cambiar sus reglas, no requiere tocar la lógica de
  arrastre ni de detección de zonas, que es genérica para las 3 etapas.

## Pendiente / próximo paso natural

Con los 8 objetos como items reales de inventario, el siguiente paso ya
anotado como trabajo futuro es convertir el acceso a la Escena 42 en un
"inventory gate" real (bloquear el salto a la escena si falta alguno de
los 8 objetos), igual que el patrón de `Escena4_Decision`. No se incluyó
en esta entrega. Los 7 retratos placeholder de los testigos (etapa 2)
también quedan como trabajo pendiente de arte, con los prompts ya listos
más arriba.
