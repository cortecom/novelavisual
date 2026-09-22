/*!
 * puzzle-action.js
 * Convierte al rompecabezas <rune-puzzle> en una Acción nativa de Monogatari,
 * usable directamente en tu guion como si fuera "show background" o "jump".
 *
 * Requiere que rune-puzzle.js ya esté cargado y que exista un elemento
 * <rune-puzzle id="..."></rune-puzzle> en el index.html (ver más abajo).
 *
 * Uso en el guion:
 *
 *   monogatari.script({
 *     'Templo-Perdido': [
 *       'show background templo-interior',
 *       'Cristian Aquí está el pergamino con las tres coordenadas...',
 *       'puzzle cityPuzzle',                 // <- pausa la historia y abre el minijuego
 *       'Cristian ¡Las tres ciudades reveladas!',
 *       'jump Camara-Siguiente'
 *     ]
 *   });
 *
 * La historia se detiene en la línea "puzzle cityPuzzle" hasta que el
 * jugador resuelve las tres coordenadas (evento "puzzle:cifrado-completo"
 * disparado por el propio componente); después continúa sola con la
 * siguiente línea del guion.
 */
(function(){

  class PuzzleAction extends Monogatari.Action {

    // Identificador único de la acción
    static id = 'Puzzle';

    // Reconoce statements que empiezan con 'puzzle', ej: "puzzle cityPuzzle"
    static matchString([action]){
      return action === 'puzzle';
    }

    constructor([puzzle, elementId]){
      super();
      // Si no se especifica id, usa 'cityPuzzle' por defecto
      this.elementId = elementId || 'cityPuzzle';
    }

    apply(){
      return new Promise((resolve)=>{
        const el = document.getElementById(this.elementId);

        if(!el){
          console.warn(`[Puzzle] No se encontró <rune-puzzle id="${this.elementId}">`);
          resolve();
          return;
        }

        const onComplete = ()=>{
          el.removeEventListener('puzzle:cifrado-completo', onComplete);
          el.removeAttribute('mandatory');
          el.close();
          resolve();
        };

        el.addEventListener('puzzle:cifrado-completo', onComplete);
        // "mandatory" oculta la X de cierre: mientras esta línea del guion
        // esté bloqueando la historia, no hay forma de reabrir el rompecabezas
        // salvo resolviéndolo (no existe un hotspot externo que lo reabra aquí).
        el.setAttribute('mandatory', '');
        el.open();
      });
    }

    didApply(){
      // Una vez resuelto el rompecabezas, la historia avanza sola
      // a la siguiente línea del guion (como si fuera un "Next" automático).
      return Promise.resolve({ advance: true });
    }

    revert(){
      // Si el jugador retrocede sobre esta línea, simplemente cerramos
      // el rompecabezas si estuviera abierto; no re-abrimos el minijuego.
      const el = document.getElementById(this.elementId);
      if(el){ el.removeAttribute('mandatory'); el.close(); }
      return Promise.resolve();
    }

    didRevert(){
      return Promise.resolve({ advance: true, step: true });
    }
  }

  monogatari.registerAction(PuzzleAction);

})();
