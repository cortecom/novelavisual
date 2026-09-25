# El Cifrado de las Tres Ciudades — módulo listo para Monogatari

Esta carpeta es autocontenida: cópiala entera dentro de tu proyecto en

```
tu-proyecto/
  assets/
    games/
      cifrado-tres-ciudades/   <- esta carpeta, sin modificar su contenido
        rune-puzzle.js          (componente + Acción de Monogatari, un solo archivo)
        mare-nostrum-bg.png
        INTEGRACION.md
        index-snippet.html
        escena-ejemplo.js
```

No hace falta tocar nada dentro de la carpeta — todas las rutas ya están
pre-configuradas para vivir en `assets/games/cifrado-tres-ciudades/`.

## Paso 1 — Cargar el script en tu `index.html`

`rune-puzzle.js` incluye **todo**: el componente `<rune-puzzle>` (Web
Component, Shadow DOM) y el registro de la Acción `puzzle` de Monogatari, en
un único archivo. Ábrelo y busca donde cargas tu propio `script.js`
(normalmente cerca del final del `<body>`, después de que Monogatari ya esté
inicializado). Justo antes de esa línea, agrega:

```html
<script src="assets/games/cifrado-tres-ciudades/rune-puzzle.js"></script>
```

Este archivo necesita que la variable global `monogatari` ya exista, así que
si tu `main.js` crea la instancia, cárgalo **después** de ese archivo (pero
antes de `script.js`, donde escribes tu guion). Si `Monogatari`/`monogatari`
todavía no existen cuando se carga, el componente `<rune-puzzle>` igual
queda definido con normalidad — solo el registro de la Acción se salta, con
un aviso en la consola.

## Paso 2 — Colocar el elemento dentro de la pantalla de juego

Monogatari v2 estructura su `index.html` así (verificado contra la
documentación oficial):

```html
<div id="monogatari">
  <visual-novel>
    <language-selection-screen></language-selection-screen>
    <loading-screen></loading-screen>
    <main-screen>
      <main-menu></main-menu>
    </main-screen>
    <game-screen>
      <dialog-log></dialog-log>
      <text-box></text-box>
      <quick-menu></quick-menu>
    </game-screen>
    <!-- ...gallery-screen, settings-screen, etc... -->
  </visual-novel>
</div>
```

Agrega `<rune-puzzle>` **dentro de `<game-screen>`, como primer hijo**
(antes de `<dialog-log>`), para que quede detrás del menú rápido y del
cuadro de texto tanto en el orden del DOM como en el `z-index`:

```html
<game-screen>
  <rune-puzzle id="cityPuzzle"></rune-puzzle>

  <dialog-log></dialog-log>
  <text-box></text-box>
  <quick-menu></quick-menu>
</game-screen>
```

Con esto, el rompecabezas se comporta **como el fondo de una escena más**:
ocupa el área de juego, pero el `quick-menu` (guardar, cargar, ajustes) y el
`text-box` siguen visibles y funcionando encima, tal como en cualquier otra
escena — el jugador nunca pierde el acceso al menú mientras resuelve el
acertijo, y visualmente da la sensación de seguir en el mismo lugar de la
historia (el fondo detrás del pergamino se atenúa, pero no lo cubre un
recuadro opaco de pantalla completa).

> Si en tu tema el rompecabezas igual tapa el `quick-menu`, es porque tu CSS
> le da a `quick-menu`/`text-box` un `z-index` menor a 5 (poco común, pero
> depende de tu tema). Solución: en tu propio CSS, agrega
> `quick-menu, text-box { z-index: 50; }` para asegurarte de que siempre
> queden por encima.

No necesitas indicar el atributo `background`: por defecto ya apunta a
`assets/games/cifrado-tres-ciudades/mare-nostrum-bg.png`. El componente
permanece oculto hasta que se invoca desde el guion, así que no interfiere
con el menú principal ni con ninguna otra escena mientras tanto.

Ver `index-snippet.html` en esta misma carpeta para el bloque exacto listo
para copiar y pegar.

## Paso 3 — Usarlo como una escena más de tu guion

En tu `script.js`, en cualquier capítulo/label:

```js
monogatari.script({
  'Templo-Perdido': [
    'show background templo-interior',
    'Cristian Aquí está el pergamino con las tres coordenadas...',
    'puzzle cityPuzzle',
    'Cristian ¡Las tres ciudades reveladas!',
    'jump Camara-Siguiente'
  ]
});
```

La línea `'puzzle cityPuzzle'` funciona igual que `'show background ...'` o
`'jump ...'`: el motor se detiene ahí, muestra el rompecabezas a pantalla
completa sobre la escena actual, y en cuanto el jugador resuelve las tres
coordenadas, la historia avanza sola a la siguiente línea.

Ver `escena-ejemplo.js` para un ejemplo un poco más largo, con la llegada al
templo antes del acertijo y la reacción de después.

## Referencia rápida

| Archivo | Qué es | ¿Hay que tocarlo? |
|---|---|---|
| `rune-puzzle.js` | El componente `<rune-puzzle>` + la Acción `puzzle` de Monogatari, en un solo archivo | No |
| `mare-nostrum-bg.png` | Fondo del mapa | No, salvo que quieras cambiar la imagen |
| `index-snippet.html` | Bloque para copiar en tu `index.html` | Copiar, no editar la carpeta original |
| `escena-ejemplo.js` | Ejemplo de guion usando `'puzzle cityPuzzle'` | Copiar/adaptar a tu propio `script.js` |

## Ajustar el cifrado, las ciudades o el mapa

Todo vive dentro de `_build()` en `rune-puzzle.js`, en el array `CITIES`
(coordenadas cifradas en numerales griegos + posición en píxeles sobre
`mare-nostrum-bg.png`, que mide 603×730). Está comentado línea por línea;
no debería hacer falta tocar nada más del archivo para ese tipo de ajustes.
La Acción de Monogatari (clase `PuzzleAction`) está en la segunda mitad del
mismo archivo, en su propio IIFE, después de `customElements.define(...)`.

## Coordenadas reales usadas como base del cifrado

| Ciudad       | Lat/Lon reales (aprox.) | Cifrado                |
|--------------|----------------------------|----------------------------|
| Alejandría   | 31°12′N, 29°55′E             | `ΛΑ'ΙΒ'Β, ΚΘ'ΝΕ'Α`            |
| Halicarnaso  | 37°02′N, 27°26′E             | `ΛΖ'Β'Β, ΚΖ'Κϛ'Α`             |
| Babilonia    | 32°32′N, 44°25′E             | `ΛΒ'ΛΒ'Β, ΜΔ'ΚΕ'Α`            |

## Notas de la última corrección

**Un solo archivo.** `rune-puzzle.js` y `puzzle-action.js` se fusionaron en
un único `rune-puzzle.js` (el componente y la Acción viven en dos IIFEs
separados dentro del mismo archivo). Si tenías `puzzle-action.js` cargado
por separado en tu `index.html`, quita esa línea — ya no existe como archivo
aparte.

**Texto más grande.** Se aumentó el tamaño de fuente en todo el rompecabezas
(claves, fichas, pergamino, mapa) para que se lea mejor, especialmente en
pantallas pequeñas.

**El mapa no se veía en teléfonos — corregido.** En pantallas angostas
(menos de 880px), el rompecabezas ahora muestra un selector "Pistas / Mapa"
en la parte superior: cada vista ocupa su propio espacio completo en vez de
apilarse todo verticalmente y depender de hacer scroll para llegar al mapa
(que en la práctica no se podía alcanzar en varios celulares/tabletas). El
sello y el mensaje de acierto/error ahora son una franja compartida, visible
en ambas vistas — y en cuanto las tres runas de una coordenada quedan
correctas, el rompecabezas cambia automáticamente a la vista "Mapa" para que
el jugador no tenga que adivinar que debe tocar el botón. En pantallas
anchas (escritorio) el selector permanece oculto y el diseño se ve igual que
antes, con ambos paneles visibles a la vez.

Bugs corregidos previamente (siguen vigentes en esta versión):

1. **La X cerraba el rompecabezas sin forma de volver a abrirlo, dejando la
   narración pegada.** Como esta línea del guion *bloquea* la historia hasta
   que se resuelve, no existe ningún hotspot externo que pueda reabrirlo una
   vez cerrado — cerrarlo dejaba la promesa de la Acción esperando para
   siempre. Ahora, mientras el rompecabezas está abierto por el guion (la
   Acción marca el elemento con el atributo `mandatory`), la X se oculta
   automáticamente. Si en cambio abres el componente tú mismo con `.open()`
   desde un hotspot opcional (sin pasar por la Acción de guion), la X sigue
   disponible normalmente porque en ese caso sí existe una forma de volver a
   abrirlo.

2. **La narración se quedaba pegada justo al hablar Isidora por primera vez,
   inmediatamente después de resolver el acertijo.** La causa: los clics
   dentro del rompecabezas (incluyendo el botón "Continuar") se propagaban
   hacia afuera del Shadow Root y llegaban también al manejador de "clic para
   avanzar diálogo" del propio Monogatari, generando un avance duplicado que
   desincronizaba el guion. Ahora el evento `click` (solo ese, no
   mousedown/mouseup/touch — necesarios para el arrastre del sello) detiene
   su propagación antes de salir hacia el DOM del juego.
