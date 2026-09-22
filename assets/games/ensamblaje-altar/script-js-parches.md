# Parches para `js/script.js`

**Estado: ya aplicados.** Los 8 objetos de la Escena 42 son, sin
excepción, items reales de `monogatari.storage('player').inventory` en
tu proyecto real:

- `epigrama_antipatro` (la octava luz) — `Escena37_Biblioteca_Sidon`.
- `inscripcion_secreta` (Templo de Artemisa) — `Escena19`.
- `jardines_reconstruidos` (Jardines Colgantes) — `Escena30_PuzzleJardin`.
- `fragmento_marfil` (Estatua de Zeus).
- `miniatura_cuadriga` (Mausoleo de Halicarnaso).
- `simulacion_coloso` (Coloso de Rodas).
- `pergamino_faro` (Faro de Alejandría).
- `grabado_piramide_giza` (Gran Pirámide de Giza) — ya tiene ícono real
  (`assets/icons/grabado_piramide_giza.png`) y su propio `addItem()`
  (lo agregaste en la escena de la biblioteca/archivo de Diodoro, junto
  al diálogo de Layla — funciona igual sin importar en qué escena se
  agregue, el minijuego solo necesita que el objeto esté en el
  inventario antes de llegar al altar).

No queda ningún ítem con ícono placeholder. Esta guía se deja como
referencia histórica de qué se integró y por qué; no hace falta aplicar
nada más de aquí.

## Reemplazo del bloque de la Escena 42

Ver `escena42-snippet.js` en este mismo paquete — es el mismo mecanismo
que ya tienes integrado (bloque `'Escena42'` único, sin las variantes
`_Historico`/`_Geografico`/`_Intuicion`, con la guarda
`monogatari.storage('player').ensamblajeAltar` para no repetir el
minijuego si el jugador vuelve a pasar por la escena).

## Objetos que quedaron FUERA del minijuego (a propósito)

La primera versión de este minijuego usaba 10 objetos. De ahí se sacaron
3 que no son en sí mismos una maravilla sino las *pistas* que llevan a
descubrirlas: `fragmento_diodoro` (el texto que documenta las 7
maravillas), `manuscrito_vaticano` y `simbolo_babilonico` (las pistas que
apuntan hacia la octava luz antes de que Antípatro la nombrara
explícitamente). `simbolo_babilonico` fue reemplazado por
`jardines_reconstruidos` como el objeto que sí representa la maravilla de
Babilonia.

`epigrama_antipatro` sí volvió a entrar — inicialmente también se había
sacado por ser "una pista y no una maravilla", pero es el objeto que
contiene la línea más explícita del guion sobre la octava luz ("La octava
luz guía a las siete desde el sur del mundo"), así que ahora representa
esa octava maravilla en el altar, en su ranura central.

`inscripcion_efeso` (ítem inventado en una versión anterior de este
paquete) se retiró y se reemplazó por `inscripcion_secreta`, que es el
objeto real que tu guion ya usa para el Templo de Artemisa en Éfeso.
