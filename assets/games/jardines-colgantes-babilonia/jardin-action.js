/**
 * Acción de Monogatari para el verbo `jardin`.
 * Uso en script.js:  'jardin jardinPuzzle'
 *
 * Mismo contrato que las otras acciones del proyecto (PuzzleAction,
 * EpigramaAction, LaberintoAction, RaceAction):
 *   - apply() abre el componente y espera el evento de finalización.
 *   - didApply() devuelve {advance:true} para que el guion siga solo.
 *
 * Envuelto en IIFE por la misma razón que jardin-puzzle.js: dos <script>
 * clásicos declarando funciones/clases sueltas en el scope global ya
 * causaron una colisión real en este proyecto (ver Escena14/Escena32).
 */
(function () {
  'use strict';

  class JardinAction extends Monogatari.Action {

    static get id() {
      return 'Jardin';
    }

    static matchString([action]) {
      return action === 'jardin';
    }

    constructor([verb, elementId]) {
      super();
      this.elementId = elementId;
    }

    willApply() {
      return Promise.resolve();
    }

    apply() {
      return new Promise((resolve) => {
        const el = document.getElementById(this.elementId);
        if (!el) {
          console.error(`[JardinAction] No se encontró <jardin-puzzle id="${this.elementId}">`);
          resolve();
          return;
        }

        const onDone = () => {
          el.removeEventListener('jardin:completado', onDone);
          this._resolved = true;
          resolve();
        };
        el.addEventListener('jardin:completado', onDone);
        el.open();
      });
    }

    didApply() {
      return Promise.resolve({ advance: true });
    }

    willRevert() {
      return Promise.resolve();
    }

    revert() {
      return Promise.resolve();
    }

    didRevert() {
      return Promise.resolve({ advance: true });
    }
  }

  monogatari.registerAction(JardinAction);

})();
