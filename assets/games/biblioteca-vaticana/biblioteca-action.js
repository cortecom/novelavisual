/*
 * Acción de Monogatari para <biblioteca-vaticana>.
 * Mismo contrato que EpigramaAction / LaberintoAction / PuzzleAction:
 *   verbo de guion: 'biblioteca bibliotecaVaticana'
 *   -> abre <biblioteca-vaticana id="bibliotecaVaticana">, espera
 *      'biblioteca:completado', avanza solo.
 */
(function () {
  'use strict';

  class BibliotecaVaticanaAction extends Monogatari.Action {
    static id = 'BibliotecaVaticanaAction';

    static matchString([action]) {
      return action === 'biblioteca';
    }

    constructor([verb, elementId]) {
      super();
      this._elementId = elementId;
    }

    willApply() {
      return Promise.resolve();
    }

    apply() {
      return new Promise((resolve) => {
        const el = document.getElementById(this._elementId);
        if (!el) {
          console.error('[BibliotecaVaticanaAction] No se encontró #' + this._elementId);
          resolve();
          return;
        }

        monogatari.distractionFree();

        const onDone = () => {
          el.removeEventListener('biblioteca:completado', onDone);
          resolve();
        };
        el.addEventListener('biblioteca:completado', onDone);

        el.setAttribute('mandatory', '');
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

  monogatari.registerAction(BibliotecaVaticanaAction);
})();
