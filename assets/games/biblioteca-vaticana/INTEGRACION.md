# Biblioteca Secreta Vaticana — Integración

Minijuego para **Escena 33** (Capítulo III), entre el Laberinto del Vaticano
(Escena 32) y `Escena34_ObjetoOcultoVaticano` (sin cambios). Estructura de
3 etapas, análoga a la Biblioteca de Atenas (`epigrama-puzzle`) pero
agrupando por maravilla en vez de por autor:

1. **Selección** — de 19 libros (12 sobre las 6 maravillas conocidas + 1
   fragmento sobre una maravilla desconocida + 6 señuelos sin relación),
   arrastrar cada uno a "Relevante" o "Descartar". El fragmento desconocido
   cuenta como relevante (habla de una maravilla, aunque no se sepa cuál).
2. **Agrupación** — los 13 libros seleccionados se arrastran a su maravilla
   (2 libros por maravilla, 6 grupos) o, en el caso del fragmento anónimo,
   a un séptimo casillero "Sin identificar".
3. **Deducción** — con los 2 libros ya agrupados por maravilla como pista,
   elegir entre 3 opciones cuál fue el destino final real de esa maravilla.
   El fragmento sin identificar queda visible como tarjeta de misterio
   durante toda la etapa 3, sin resolverse — es la pista que conecta con
   "Eso... no debería estar ahí" y con el manuscrito de la Escena 34.

## 1. Copiar archivos

```
assets/games/biblioteca-vaticana/biblioteca-vaticana.js
assets/games/biblioteca-vaticana/biblioteca-action.js
```

## 2. `index.html`

```html
<script src="assets/games/biblioteca-vaticana/biblioteca-vaticana.js"></script>
<script src="assets/games/biblioteca-vaticana/biblioteca-action.js"></script>
```

```html
<game-screen>
  ...
  <biblioteca-vaticana id="bibliotecaVaticana"></biblioteca-vaticana>
  ...
</game-screen>
```

Ver `index-snippet.html`.

## 3. `js/script.js` — Escena 33

Ver `escena33-snippet.js`, listo para pegar. Verbo: `'biblioteca bibliotecaVaticana'`.
Termina en `'jump Escena34_ObjetoOcultoVaticano'`, conectando directo con el
bloque que ya tenías.

## 4. Contrato

- Dispara `biblioteca:completado` en el host al pulsar "Continuar" en la
  victoria (un solo botón, sin rejugar).
- `didApply()` devuelve `{advance: true}`.
- `mandatory` se setea antes de `open()` → botón ✕ oculto automáticamente.
- Sin estado de fallo duro: una colocación incorrecta en cualquier etapa
  rebota con feedback visual (rojo) y se puede reintentar sin límite —
  mismo criterio "sin penalización dura" que el resto de los puzzles de
  documentos del proyecto.

## 5. Diseño visual

Los libros ahora tienen forma de tomo antiguo (lomo oscuro a la izquierda +
canto de páginas a la derecha, vía `::before`/`::after` en `.card`), no
tarjetas planas. El fragmento sin identificar usa un lomo violeta oscuro
distintivo (`.card.unknown`) para diferenciarse a simple vista sobre la mesa.

## 6. Contenido (editable en `WONDERS` / `DECOY_BOOKS` / `UNKNOWN_WONDER_BOOK` al inicio del archivo)

- 6 maravillas × 2 libros-pista cada una (18 en total para la etapa 1, junto
  a 6 señuelos). Las pistas están escritas para requerir lectura, no solo
  reconocer el nombre de la maravilla.
- Para cada maravilla, el destino "correcto" reproduce literalmente la
  frase que ya tenías en la Escena 33 original (Zeus/obispos,
  Artemisa/incendio, Coloso/venta como metal, Mausoleo/cruzados,
  Jardines/invasores cristianos, Faro/islamización y terremotos). Los 2
  "señuelos" por maravilla son teorías históricas alternativas reales o
  verosímiles (p. ej. la leyenda de que la Estatua de Zeus se perdió en un
  incendio en Constantinopla), para que la deducción no sea trivial por
  descarte de redacción.

## 7. Pendiente / no incluido

- Íconos SVG dibujados a mano (sin fotos) — igual que el resto de los
  minijuegos de este proyecto que aún esperan pipeline de imágenes, no
  bloquea la entrega. Puedo generar los 6 prompts hiperrealistas en
  español si más adelante quieres reemplazarlos.
- No se probó contra tu `script.js`/`index.html` reales (sin conexión al
  dispositivo esta sesión). Validado con una prueba de humo en jsdom que
  recorre las 3 etapas completas (18→12 libros clasificados, 12 agrupados
  en 6 carpetas, 6 destinos deducidos, evento de victoria disparado).
  Validación en Chromium real queda pendiente para la próxima sesión con
  el puente conectado.
