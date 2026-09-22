/*!
 * laberinto-action.js
 * Convierte a <vaticano-maze> en una Acción nativa de Monogatari, siguiendo
 * EXACTAMENTE el mismo contrato verificado contra tu puzzle-action.js real
 * (assets/games/cifrado-tres-ciudades/puzzle-action.js).
 *
 * Requiere que vaticano-maze.js ya esté cargado y que exista un elemento
 * <vaticano-maze id="..."></vaticano-maze> en el index.html.
 *
 * Uso en el guion:
 *
 *   'Escena32_Vaticano': [
 *     'show scene bg_vaticano with fadeIn',
 *     'El Vaticano es un laberinto de mármol, silencio y secretos.',
 *     'laberinto vaticanoMaze',              // <- pausa la historia y abre el minijuego
 *     'show scene bg_documentos_vaticano with fadeIn',
 *     ...
 *   ]
 *
 * La historia se detiene en "laberinto vaticanoMaze" hasta que Gabriel
 * completa las 3 etapas (evento "laberinto:completado" disparado por el
 * propio componente); después continúa sola con la siguiente línea.
 */
(function(){

  class LaberintoAction extends Monogatari.Action {

    // Identificador único de la acción
    static id = 'Laberinto';

    // Reconoce statements que empiezan con 'laberinto', ej: "laberinto vaticanoMaze"
    static matchString([action]){
      return action === 'laberinto';
    }

    constructor([laberinto, elementId]){
      super();
      // Si no se especifica id, usa 'vaticanoMaze' por defecto
      this.elementId = elementId || 'vaticanoMaze';
    }

    apply(){
      return new Promise((resolve)=>{
        const el = document.getElementById(this.elementId);

        if(!el){
          console.warn(`[Laberinto] No se encontró <vaticano-maze id="${this.elementId}">`);
          resolve();
          return;
        }

        const onComplete = ()=>{
          el.removeEventListener('laberinto:completado', onComplete);
          el.removeAttribute('mandatory');
          el.close();
          resolve();
        };

        el.addEventListener('laberinto:completado', onComplete);
        // "mandatory" no tiene efecto visual propio en <vaticano-maze> (no
        // tiene una X de cierre como <rune-puzzle>), pero se setea/limpia
        // igual para mantener el mismo contrato por si más adelante se
        // agrega un botón de salida que deba ocultarse mientras bloquea.
        el.setAttribute('mandatory', '');
        el.open();
      });
    }

    didApply(){
      // Una vez resuelto el laberinto, la historia avanza sola
      // a la siguiente línea del guion (como si fuera un "Next" automático).
      return Promise.resolve({ advance: true });
    }

    revert(){
      // Si el jugador retrocede sobre esta línea, simplemente cerramos
      // el laberinto si estuviera abierto; no lo re-abrimos.
      const el = document.getElementById(this.elementId);
      if(el){ el.removeAttribute('mandatory'); el.close(); }
      return Promise.resolve();
    }

    didRevert(){
      return Promise.resolve({ advance: true, step: true });
    }
  }

  monogatari.registerAction(LaberintoAction);

})();
