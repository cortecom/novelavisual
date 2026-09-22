/*!
 * epigrama-action.js
 * Convierte a <epigrama-puzzle> en una Acción nativa de Monogatari, con el
 * mismo contrato que puzzle-action.js (rune-puzzle) y race-action.js
 * (ruta7-race).
 *
 * Uso en el guion:
 *
 *   'epigrama epigramaPuzzle',   // pausa la historia y abre el minijuego
 *
 * La historia se detiene hasta que el jugador resuelve la Etapa 3 (evento
 * "epigrama:completado" disparado por el propio componente); después
 * continúa sola con la siguiente línea del guion.
 */
(function(){

  class EpigramaAction extends Monogatari.Action {

    // Identificador único de la acción
    static id = 'Epigrama';

    // Reconoce statements que empiezan con 'epigrama', ej: "epigrama epigramaPuzzle"
    static matchString([action]){
      return action === 'epigrama';
    }

    constructor([epigrama, elementId]){
      super();
      // Si no se especifica id, usa 'epigramaPuzzle' por defecto
      this.elementId = elementId || 'epigramaPuzzle';
    }

    apply(){
      return new Promise((resolve)=>{
        const el = document.getElementById(this.elementId);

        if(!el){
          console.warn(`[Epigrama] No se encontró <epigrama-puzzle id="${this.elementId}">`);
          resolve();
          return;
        }

        const onComplete = ()=>{
          el.removeEventListener('epigrama:completado', onComplete);
          el.removeAttribute('mandatory');
          el.close();
          console.log('[Epigrama] minijuego cerrado. Esperando antes de devolver el control al guion...');
          // setTimeout en vez de requestAnimationFrame: le da al navegador
          // un margen de tiempo real (no solo un frame de pintado) para
          // terminar de asentar el display:none del host antes de que
          // Monogatari dispare la siguiente línea del guion. Mismo criterio
          // que ya usan en snowyVariant()/transitionend: nunca confiar solo
          // en el timing del navegador, siempre respaldar con un timeout.
          setTimeout(() => {
            console.log('[Epigrama] resolviendo apply() — Monogatari debería avanzar a "show character tomas..." ahora.');
            resolve();
          }, 80);
        };

        el.addEventListener('epigrama:completado', onComplete);
        // "mandatory" oculta cualquier cierre externo: mientras esta línea
        // del guion esté bloqueando la historia, la única salida es
        // resolver las 3 etapas (mismo criterio que puzzle-action.js).
        el.setAttribute('mandatory', '');
        console.log('[Epigrama] apply() iniciado, abriendo <epigrama-puzzle>...');
        try {
          el.open();
        } catch (err) {
          // Si open() lanzara una excepción, la promesa de apply() jamás
          // se resolvería y el guion quedaría bloqueado sin ningún aviso
          // visible. Lo dejamos loggeado y resolvemos de todos modos para
          // no trabar la historia.
          console.error('[Epigrama] Error al abrir el minijuego:', err);
          el.removeEventListener('epigrama:completado', onComplete);
          resolve();
        }
      });
    }

    didApply(){
      // Una vez resuelto el epigrama, la historia avanza sola
      // a la siguiente línea del guion (como si fuera un "Next" automático).
      return Promise.resolve({ advance: true });
    }

    revert(){
      // Si el jugador retrocede sobre esta línea, simplemente cerramos
      // el minijuego si estuviera abierto; no lo reabrimos.
      const el = document.getElementById(this.elementId);
      if(el){ el.removeAttribute('mandatory'); el.close(); }
      return Promise.resolve();
    }

    didRevert(){
      return Promise.resolve({ advance: true, step: true });
    }
  }

  monogatari.registerAction(EpigramaAction);

})();
