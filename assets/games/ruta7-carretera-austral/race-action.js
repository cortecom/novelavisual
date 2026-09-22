/*!
 * race-action.js
 * Convierte al minijuego <ruta7-race> en una Accion nativa de Monogatari,
 * usable directamente en tu guion como si fuera "show background" o "jump".
 * Misma estructura que puzzle-action.js (assets/games/cifrado-tres-ciudades/).
 *
 * Requiere que ruta7-race.js ya este cargado y que exista un elemento
 * <ruta7-race id="..."></ruta7-race> en el index.html (ver INTEGRACION.md).
 *
 * Uso en el guion:
 *
 *   monogatari.script({
 *     'Escena5_Patagonia': [
 *       'show scene ruta7 with fadeIn',
 *       'erik (...) La tormenta se esta cerrando rapido...',
 *       'gabriel (...) No podemos dar la vuelta ahora...',
 *       'race ruta7Race',                    // <- pausa la historia y abre el minijuego
 *       'jump Escena6_Caverna'
 *     ]
 *   });
 *
 * La historia se detiene en la linea "race ruta7Race" hasta que el jugador
 * completa las 5 etapas (evento "race:completado" disparado por el propio
 * componente al pulsar "Continuar" en la pantalla final -- sin preguntar si
 * quiere volver a jugar); despues continua sola con la siguiente linea del
 * guion.
 */
(function(){

  class RaceAction extends Monogatari.Action {

    // Identificador unico de la accion
    static id = 'Race';

    // Reconoce statements que empiezan con 'race', ej: "race ruta7Race"
    static matchString([action]){
      return action === 'race';
    }

    constructor([race, elementId]){
      super();
      // Si no se especifica id, usa 'ruta7Race' por defecto
      this.elementId = elementId || 'ruta7Race';
    }

    apply(){
      return new Promise((resolve)=>{
        const el = document.getElementById(this.elementId);

        if(!el){
          console.warn(`[Race] No se encontro <ruta7-race id="${this.elementId}">`);
          resolve();
          return;
        }

        const onComplete = ()=>{
          el.removeEventListener('race:completado', onComplete);
          el.removeAttribute('mandatory');
          el.close();
          resolve();
        };

        el.addEventListener('race:completado', onComplete);
        // "mandatory" no tiene efecto visual propio en este componente (no
        // hay boton de cerrar que ocultar, a diferencia del rompecabezas),
        // pero se deja por consistencia y como gancho para quien quiera
        // añadir una salida de emergencia mas adelante.
        el.setAttribute('mandatory', '');
        el.open();
      });
    }

    didApply(){
      // Una vez completadas las 5 etapas, la historia avanza sola
      // a la siguiente linea del guion (como si fuera un "Next" automatico).
      return Promise.resolve({ advance: true });
    }

    revert(){
      // Si el jugador retrocede sobre esta linea, simplemente cerramos
      // el minijuego si estuviera abierto; no lo reabrimos.
      const el = document.getElementById(this.elementId);
      if(el){ el.removeAttribute('mandatory'); el.close(); }
      return Promise.resolve();
    }

    didRevert(){
      return Promise.resolve({ advance: true, step: true });
    }
  }

  monogatari.registerAction(RaceAction);

})();
