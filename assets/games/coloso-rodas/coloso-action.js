(function () {
  'use strict';

  class ColosoAction extends Monogatari.Action {
    static id = 'ColosoAction';

    static matchString([action]) {
      return action === 'coloso';
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
          resolve();
          return;
        }
        const onDone = () => {
          el.removeEventListener('coloso:completado', onDone);
          resolve();
        };
        el.addEventListener('coloso:completado', onDone);
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

  monogatari.registerAction(ColosoAction);
})();
