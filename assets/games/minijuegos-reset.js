(function () {
  'use strict';

  /**
   * Reinicio de minijuegos al volver al menú principal / cargar partida.
   *
   * Problema que resuelve: los minijuegos son Web Components que NO conocen el
   * ciclo de vida del motor. Cuando el jugador sale al menú ("end") o carga
   * una partida, Monogatari ejecuta resetGame(), que llama a reset() en cada
   * Action y onReset() en cada Component propio del motor — pero nuestros
   * elementos no son Components del motor y ninguna Action nuestra define
   * reset(). Resultado: el elemento seguía con el atributo `open` (overlay
   * pantalla completa) y con el listener de `*:completado` de la Action ya
   * ejecutada, así que al pulsar "Comenzar" reaparecía el minijuego.
   *
   * Solución: esta Action no responde a ningún verbo del guion; solo usa el
   * hook estático reset() que el motor invoca en cada reinicio. Para cada
   * minijuego presente se cierra y se reemplaza por un elemento nuevo (mismo
   * tag, mismos atributos salvo `open`/`mandatory`), lo que descarta el estado
   * interno y cualquier listener huérfano de una Action pendiente.
   *
   * Para añadir un minijuego nuevo, agregar su tag a TAGS.
   */
  const TAGS = [
    'rune-puzzle',
    'ruta7-race',
    'epigrama-puzzle',
    'vaticano-maze',
    'coloso-puzzle',
    'jardin-puzzle',
    'biblioteca-vaticana',
    'archivo-oculto',
    'archivo-escape',
    'ensamblaje-puzzle',
    'derrumbe-final'
  ];

  function reiniciarMinijuegos() {
    document.querySelectorAll(TAGS.join(',')).forEach((el) => {
      try {
        if (typeof el.close === 'function') el.close();
      } catch (e) {
        console.warn('[MinijuegosReset] close() falló en', el.tagName, e);
      }

      const fresco = el.cloneNode(false);        // copia atributos, no listeners ni estado
      fresco.removeAttribute('open');
      fresco.removeAttribute('mandatory');       // las Actions lo vuelven a poner al abrir
      el.replaceWith(fresco);
    });
  }

  class MinijuegosResetAction extends Monogatari.Action {

    static id = 'MinijuegosReset';

    // No es un verbo de guion: nunca coincide con una línea.
    static matchString() {
      return false;
    }

    // Hook del motor: se invoca en resetGame() (volver al menú, cargar partida).
    static async reset() {
      reiniciarMinijuegos();
    }
  }

  monogatari.registerAction(MinijuegosResetAction);
})();
