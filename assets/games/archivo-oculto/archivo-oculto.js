/* ============================================================
   MINIJUEGO — ATENTADO AL ARCHIVO OCULTO (Escena 27)
   Componente: <archivo-oculto>, Web Component con Shadow DOM.

   Va junto a atentado-action.js (la Acción de Monogatari que lo
   abre y espera su evento de finalización). Ver INTEGRACION.md.
   ============================================================ */

(function () {
  'use strict';

  // Ruta base de este minijuego dentro del proyecto. Las imágenes se
  // referencian con la ruta completa (no solo "images/...") porque el
  // navegador resuelve las rutas relativas del <img> contra index.html,
  // no contra este archivo .js.
  const BASE = 'assets/games/archivo-oculto/';

  const TEMPLATE = document.createElement('template');
  TEMPLATE.innerHTML = `
  <style>
    :host{ all:initial; position:absolute; inset:0; z-index:5; display:none; }
    :host([open]){ display:block; }

    *{box-sizing:border-box; -webkit-tap-highlight-color:transparent;}

    #juego{
      position:absolute; inset:0; width:100%; height:100%;
      background:radial-gradient(ellipse at 50% 0%, rgba(198,154,58,0.10), transparent 55%),
        linear-gradient(180deg, #12100b 0%, #1c1712 55%, #241c14 100%);
      overflow:hidden;display:flex;flex-direction:column;
      font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;color:#e9dcbd;

      --agua-profunda:#0d3436; --agua-media:#155e5b; --agua-clara:#3f9c93;
      --papiro:#e9dcbd; --papiro-osc:#cbb787; --oro:#c69a3a; --oro-claro:#e2bc63;
      --antorcha:#c9723c; --carbon:#1c1712; --rojo-peligro:#a13d2f; --verde-ok:#4a7c4e;
    }

    #cabecera{padding:16px 20px 8px;display:flex;justify-content:space-between;align-items:flex-start;z-index:40;position:relative;}
    #titulo-escena{font-family:Georgia, 'Times New Roman', serif;font-weight:700;font-size:1.4rem;color:var(--oro-claro);margin:0;text-shadow:0 2px 10px rgba(0,0,0,0.6);}
    #titulo-escena small{display:block;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;font-weight:500;font-size:0.68rem;color:var(--papiro-osc);letter-spacing:0.08em;margin-top:2px;}

    #progreso-etapas{display:flex;gap:6px;margin-top:6px;}
    .punto-etapa{width:26px;height:5px;border-radius:3px;background:rgba(198,154,58,0.25);transition:background 0.3s ease;}
    .punto-etapa.hecha{background:var(--verde-ok);}
    .punto-etapa.activa{background:var(--oro-claro);}

    #escenario{position:relative;flex:1;margin:0 16px 16px;border-radius:14px;overflow:hidden;border:1px solid rgba(198,154,58,0.25);box-shadow:inset 0 0 80px rgba(0,0,0,0.65);}
    #fondo-escena{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(0.72) saturate(1.05);}
    .placeholder-imagen{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;
      background:repeating-linear-gradient(135deg, rgba(198,154,58,0.06) 0 12px, transparent 12px 24px),
        linear-gradient(160deg, #14312f 0%, #0d2321 60%, #0a1a19 100%);
      text-align:center;padding:20px;z-index:1;}
    .placeholder-imagen .icono{font-size:2.2rem;margin-bottom:8px;opacity:0.7;}
    .placeholder-imagen .etiqueta{font-family:Georgia, 'Times New Roman', serif;font-style:italic;font-size:0.95rem;color:var(--papiro-osc);max-width:300px;}

    #velo-escenario{position:absolute;inset:0;background:linear-gradient(180deg, rgba(12,10,6,0.10) 0%, rgba(12,10,6,0.5) 75%, rgba(12,10,6,0.9) 100%);z-index:2;}

    #agua{position:absolute;left:0;right:0;bottom:0;height:0%;
      background:linear-gradient(180deg, rgba(63,156,147,0.55) 0%, var(--agua-media) 35%, var(--agua-profunda) 100%);
      transition:height 0.4s linear;z-index:6;border-top:2px solid rgba(210,235,230,0.5);}
    #agua::before{content:'';position:absolute;top:-6px;left:0;right:0;height:12px;
      background:repeating-linear-gradient(90deg, rgba(255,255,255,0.18) 0 22px, transparent 22px 44px);animation:ondear 2.4s linear infinite;}
    @keyframes ondear{0%{transform:translateX(0);}100%{transform:translateX(-44px);}}

    #capa-mundo{position:absolute;inset:0;z-index:12;}

    #capa-contenido{position:absolute;inset:0;z-index:30;display:flex;flex-direction:column;justify-content:flex-start;pointer-events:none;}
    /* Los paneles de texto NO deben capturar clics/touch (dejan pasar el arrastre de objetos
       que están debajo, en #capa-mundo). Solo los botones reales son interactivos. */
    #capa-contenido .pantalla{pointer-events:none;}
    #capa-contenido .boton-principal{pointer-events:auto;}

    .pantalla{padding:18px 22px;display:none;flex-direction:column;gap:10px;}
    .pantalla.activa{display:flex;}

    .etiqueta-sistema{font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;font-weight:600;font-size:0.68rem;letter-spacing:0.05em;color:var(--antorcha);}
    .narrativa{font-family:Georgia, 'Times New Roman', serif;font-size:1.15rem;line-height:1.4;color:var(--papiro);max-width:620px;text-shadow:0 2px 12px rgba(0,0,0,0.8);}
    .instruccion{font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;font-size:0.78rem;color:var(--oro-claro);background:rgba(18,15,10,0.7);border:1px solid rgba(198,154,58,0.3);
      border-radius:8px;padding:8px 12px;max-width:460px;}

    .boton-principal{align-self:flex-start;background:var(--oro);color:#1c1712;border:none;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;font-weight:700;font-size:0.88rem;
      padding:11px 20px;border-radius:8px;cursor:pointer;transition:background 0.18s ease, transform 0.12s ease;}
    .boton-principal:hover{background:var(--oro-claro);transform:translateY(-1px);}
    .boton-principal:disabled{opacity:0.4;cursor:not-allowed;transform:none;}

    .hud-etapa{display:flex;gap:10px;flex-wrap:wrap;}
    .hud-caja{background:rgba(18,15,10,0.78);border:1px solid rgba(198,154,58,0.35);border-radius:9px;padding:6px 12px;font-size:0.72rem;font-weight:600;display:flex;align-items:center;gap:6px;}

    /* ---------- Objetos arrastrables (genérico etapas 1 y 3) ---------- */
    .item-arrastrable{
      position:absolute;display:flex;flex-direction:column;align-items:center;gap:2px;
      cursor:grab;touch-action:none;z-index:15;user-select:none;
    }
    .item-arrastrable .icono-item{
      width:54px;height:54px;display:flex;align-items:center;justify-content:center;font-size:1.6rem;
      background:radial-gradient(circle at 35% 30%, rgba(198,154,58,0.35), rgba(20,16,10,0.85));
      border:1.5px solid rgba(198,154,58,0.55);border-radius:10px;box-shadow:0 4px 14px rgba(0,0,0,0.5);
      transition:transform 0.15s ease;overflow:hidden;
    }
    .item-arrastrable .icono-item img{width:100%;height:100%;object-fit:cover;border-radius:8px;}
    .item-arrastrable .nombre-item{
      font-size:0.6rem;font-weight:600;color:var(--papiro);background:rgba(12,10,6,0.75);
      padding:2px 6px;border-radius:5px;white-space:nowrap;max-width:110px;overflow:hidden;text-overflow:ellipsis;
    }
    .item-arrastrable.arrastrando{z-index:100;cursor:grabbing;}
    .item-arrastrable.arrastrando .icono-item{transform:scale(1.12);border-color:var(--oro-claro);}
    .item-arrastrable.resuelto{transition:opacity 0.35s ease, transform 0.35s ease;opacity:0;pointer-events:none;transform:scale(0.7);}
    .item-arrastrable.perdido .icono-item{filter:grayscale(1) brightness(0.5);border-color:var(--rojo-peligro);}
    .item-arrastrable.correcto .icono-item{border-color:var(--verde-ok);box-shadow:0 0 14px rgba(74,124,78,0.7);}
    .item-arrastrable.incorrecto .icono-item{animation:sacudir 0.4s ease;border-color:var(--rojo-peligro);}
    @keyframes sacudir{0%,100%{transform:translateX(0);}25%{transform:translateX(-6px);}75%{transform:translateX(6px);}}
    @keyframes flotar{0%,100%{transform:translateY(0);}50%{transform:translateY(-5px);}}
    .item-arrastrable:not(.arrastrando):not(.resuelto) .icono-item{animation:flotar 3.2s ease-in-out infinite;}

    /* ---------- Etapa 1: maletín ---------- */
    #zona-maletin{
      position:absolute;left:50%;bottom:6%;transform:translateX(-50%);z-index:14;
      width:190px;min-height:120px;border:2px dashed rgba(198,154,58,0.6);border-radius:12px;
      background-size:cover;background-position:center;
      display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:4px;padding:8px;
      transition:border-color 0.2s ease;
    }
    #zona-maletin::before{
      content:'';position:absolute;inset:0;border-radius:10px;
      background:linear-gradient(180deg, rgba(12,10,6,0.25) 0%, rgba(12,10,6,0.85) 100%);z-index:-1;
    }
    #zona-maletin.resaltada{border-color:var(--oro-claro);}
    #zona-maletin .titulo-maletin{font-size:0.68rem;font-weight:700;color:var(--oro-claro);text-shadow:0 2px 6px rgba(0,0,0,0.8);}
    #contenido-maletin{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;}
    #contenido-maletin span{font-size:1.15rem;text-shadow:0 2px 6px rgba(0,0,0,0.8);}

    /* ---------- Etapa 2: escotilla ---------- */
    #zona-escotilla{position:absolute;left:50%;top:12%;transform:translateX(-50%);z-index:14;display:flex;flex-direction:column;align-items:center;gap:10px;}
    #foto-escotilla{
      width:220px;height:140px;border-radius:12px;object-fit:cover;
      border:2px solid rgba(198,154,58,0.5);box-shadow:0 6px 20px rgba(0,0,0,0.6);
      transition:transform 0.15s ease;
    }
    #foto-escotilla.forzando{transform:scale(1.03);border-color:var(--oro-claro);}
    #medidor-cont{width:220px;height:16px;background:rgba(255,255,255,0.1);border:1px solid rgba(198,154,58,0.4);border-radius:9px;overflow:hidden;}
    #medidor-relleno{height:100%;width:0%;background:linear-gradient(90deg, var(--antorcha), var(--oro-claro));transition:width 0.15s ease;}
    #boton-llave{
      background:var(--oro);color:#1c1712;border:none;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;font-weight:700;font-size:0.95rem;
      padding:14px 26px;border-radius:50px;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,0.4);
      transition:transform 0.08s ease, background 0.15s ease;
    }
    #boton-llave:active{transform:scale(0.92);background:var(--oro-claro);}

    /* ---------- Etapa 3: cofres ---------- */
    .cofre{position:absolute;display:flex;flex-direction:column;align-items:center;gap:3px;z-index:11;width:100px;}
    .cofre .caja-cofre{
      width:78px;height:58px;border:2px solid rgba(198,154,58,0.45);border-radius:8px;
      background:rgba(18,15,10,0.55);display:flex;align-items:center;justify-content:center;font-size:1.3rem;
      transition:border-color 0.2s ease, background 0.2s ease;
    }
    .cofre.resaltado .caja-cofre{border-color:var(--oro-claro);background:rgba(198,154,58,0.2);}
    .cofre.ocupado .caja-cofre{border-color:var(--verde-ok);background:rgba(74,124,78,0.18);}
    .cofre .etiqueta-cofre{font-size:0.6rem;font-weight:600;text-align:center;color:var(--papiro-osc);max-width:96px;line-height:1.2;}

    #aviso-flash{position:absolute;top:44%;left:50%;transform:translate(-50%,-50%) scale(0.9);z-index:50;
      font-family:Georgia, 'Times New Roman', serif;font-style:italic;font-size:1.4rem;color:var(--oro-claro);
      text-shadow:0 2px 14px rgba(0,0,0,0.9);opacity:0;pointer-events:none;transition:opacity 0.3s ease, transform 0.3s ease;text-align:center;}
    #aviso-flash.mostrar{opacity:1;transform:translate(-50%,-50%) scale(1);}

    @media (max-width:640px){
      .narrativa{font-size:1rem;}
      #titulo-escena{font-size:1.1rem;}
      .item-arrastrable .icono-item{width:46px;height:46px;font-size:1.3rem;}
      #zona-maletin{width:140px;}
      #foto-escotilla{width:160px;height:104px;}
      #medidor-cont{width:160px;}
      .cofre{width:78px;}
      .cofre .caja-cofre{width:60px;height:46px;}
    }
  </style>

  <div id="juego">
    <div id="cabecera">
      <h1 id="titulo-escena">Atentado al Archivo Oculto<small>ESCENA 27 · MINIJUEGO DE ACCIÓN EN 3 ETAPAS</small>
        <div id="progreso-etapas">
          <div class="punto-etapa" id="punto-1"></div>
          <div class="punto-etapa" id="punto-2"></div>
          <div class="punto-etapa" id="punto-3"></div>
        </div>
      </h1>
    </div>

    <div id="escenario">
      <img id="fondo-escena" src="${BASE}images/hero_archivo_tormenta.jpg" alt="">
      <div id="velo-escenario"></div>
      <div id="agua"></div>
      <div id="capa-mundo"></div>
      <div id="aviso-flash"></div>

      <div id="capa-contenido">

        <div class="pantalla activa" id="pantalla-intro">
          <span class="etiqueta-sistema">[MINIJUEGO ACCIÓN: ATENTADO AL ARCHIVO OCULTO]</span>
          <p class="narrativa">Un atentado ha saboteado las compuertas del archivo oculto. El agua entra a borbotones por los conductos forzados y sube desde los cimientos. Gabriel y Omar tienen tres tareas por delante: <em>resguardar el equipo</em>, <em>detener la inundación</em> y <em>clasificar lo rescatado</em> antes de que el archivo quede perdido.</p>
          <button class="boton-principal" id="btn-entrar">Entrar al archivo →</button>
        </div>

        <div class="pantalla" id="pantalla-etapa1">
          <span class="etiqueta-sistema">[ETAPA 1 · RESGUARDAR EL ARCHIVO]</span>
          <p class="narrativa">El agua sube. Arrastra cada <em>manuscrito</em>, <em>mapa</em> y <em>objeto</em> hacia el maletín estanque antes de que se sumerjan. <em>No puede perderse ninguno</em> — si alguno queda bajo el agua, hay que empezar la etapa de nuevo.</p>
          <div class="instruccion">👆 Mantén el dedo o clic sobre cada archivo y suéltalo dentro del maletín marcado en el centro. Deben rescatarse todos.</div>
          <div class="hud-etapa">
            <div class="hud-caja">⏳ <span id="e1-tiempo">50</span>s</div>
            <div class="hud-caja">💼 En el maletín: <span id="e1-contador">0</span>/<span id="e1-total">9</span></div>
          </div>
        </div>

        <div class="pantalla" id="pantalla-etapa2">
          <span class="etiqueta-sistema">[ETAPA 2 · DETENER LA INUNDACIÓN]</span>
          <p class="narrativa">El maletín está sellado y a salvo. Ahora hay que usar la <em>llave de grifo</em> sobre la escotilla de ventilación superior para forzarla y drenar el agua.</p>
          <div class="instruccion">🔧 Pulsa el botón repetidamente para acumular presión antes de que se agote el tiempo. Si no lo logras, hay que empezar todo de nuevo desde la Etapa 1.</div>
          <div class="hud-etapa">
            <div class="hud-caja">⏳ <span id="e2-tiempo">14</span>s</div>
            <div class="hud-caja">💪 Presión: <span id="e2-porcentaje">0</span>%</div>
          </div>
        </div>

        <div class="pantalla" id="pantalla-etapa3">
          <span class="etiqueta-sistema">[ETAPA 3 · CLASIFICAR EL ARCHIVO]</span>
          <p class="narrativa">La inundación se detuvo. Ayuda a Omar: son los mismos archivos que rescataste en la Etapa 1 — arrastra cada uno al cofre de su categoría: <em>Manuscritos</em>, <em>Mapas</em> u <em>Objetos</em>.</p>
          <div class="instruccion">👆 Lee el nombre del archivo y súbelo al cofre de su categoría correcta.</div>
          <div class="hud-etapa">
            <div class="hud-caja">⏳ <span id="e3-tiempo">30</span>s</div>
            <div class="hud-caja">🗂️ Clasificados: <span id="e3-contador">0</span>/<span id="e3-total">0</span></div>
          </div>
        </div>

        <div class="pantalla" id="pantalla-epilogo">
          <span class="etiqueta-sistema">[FIN DEL MINIJUEGO]</span>
          <p class="narrativa" id="texto-epilogo"></p>
          <button class="boton-principal" id="btn-continuar">Continuar →</button>
        </div>

      </div>
    </div>
  </div>
  `;

  // Categorías compartidas entre la Etapa 1 (rescate) y la Etapa 3 (clasificación).
  const CATEGORIAS = {
    manuscrito: {etiqueta:'Manuscritos', icono:'📜'},
    mapa:       {etiqueta:'Mapas',       icono:'🗺️'},
    objeto:     {etiqueta:'Objetos',     icono:'🧰'}
  };

  // El archivo completo del subterráneo: se usa tal cual en la Etapa 1 (rescate)
  // y luego solo los que se lograron rescatar pasan a la Etapa 3 (clasificación).
  // 'imagen' es opcional: si existe, el ícono usa la foto en vez del emoji.
  const ARCHIVO_COMPLETO = [
    {nombre:'Tratado de Heródoto', icono:'📜', imagen:'pergamino_generico.jpg', categoria:'manuscrito', izquierda:6, altura:55},
    {nombre:'Rollo de Aristarco', icono:'📜', imagen:'pergamino_generico.jpg', categoria:'manuscrito', izquierda:17, altura:35},
    {nombre:'Crónica de Manetón', icono:'📜', imagen:'pergamino_generico.jpg', categoria:'manuscrito', izquierda:28, altura:62},
    {nombre:'Mapa del Mediterráneo', icono:'🗺️', categoria:'mapa', izquierda:39, altura:42},
    {nombre:'Mapa de Rutas Comerciales', icono:'🗺️', categoria:'mapa', izquierda:50, altura:68},
    {nombre:'Mapa de las Constelaciones', icono:'🗺️', categoria:'mapa', izquierda:61, altura:30},
    {nombre:'Astrolabio de Bronce', icono:'🧭', categoria:'objeto', izquierda:72, altura:58},
    {nombre:'Cilindro Hermético de Transporte', icono:'🛢️', imagen:'cilindro_hermetico.jpg', categoria:'objeto', izquierda:83, altura:45},
    {nombre:'Medallón de Bronce Grabado', icono:'🪙', categoria:'objeto', izquierda:94, altura:65}
  ];

  class ArchivoOculto extends HTMLElement {
    constructor(){
      super();
      const shadow = this.attachShadow({mode:'open'});
      shadow.appendChild(TEMPLATE.content.cloneNode(true));
    }

    connectedCallback(){
      if(this._construido) return;
      this._construido = true;
      _build(this.shadowRoot, this);
    }

    // Llamado por la Acción de Monogatari para mostrar el minijuego.
    open(){
      this.setAttribute('open', '');
      if(typeof this._reiniciar === 'function') this._reiniciar();
    }

    // Se llama sola al completar el minijuego (ver finalizarJuego más abajo).
    close(){
      this.removeAttribute('open');
    }
  }

  function _build(root, self){
    // Evita que Monogatari interprete los clics dentro del minijuego
    // como "avanzar diálogo" (ver gotcha de propagación de clics).
    self.addEventListener('click', (e) => e.stopPropagation());

    const contenidoIcono = (d) => d.imagen ? `<img src="${BASE}images/${d.imagen}" alt="">` : d.icono;

    function mezclar(array){
      const copia = array.slice();
      for(let i = copia.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
      }
      return copia;
    }

    function imagenConReemplazo(elemento, archivo){
      elemento.onerror = function(){
        elemento.onerror = null;
        const padre = elemento.parentElement;
        const div = document.createElement('div');
        div.className = 'placeholder-imagen';
        div.innerHTML = `<div class="icono">🖼️</div><div class="etiqueta">Pendiente: images/${archivo}</div>`;
        padre.insertBefore(div, elemento);
        elemento.style.display = 'none';
      };
    }
    function cambiarFondo(archivo){
      const img = root.getElementById('fondo-escena');
      const previoPlaceholder = img.parentElement.querySelector('.placeholder-imagen');
      if(previoPlaceholder) previoPlaceholder.remove();
      img.style.display = '';
      imagenConReemplazo(img, archivo);
      img.src = BASE + 'images/' + archivo;
    }
    function irA(nombre){
      root.querySelectorAll('.pantalla').forEach(p => p.classList.remove('activa'));
      root.getElementById('pantalla-' + nombre).classList.add('activa');
    }
    function marcarEtapa(n, estadoClase){
      const punto = root.getElementById('punto-' + n);
      punto.className = 'punto-etapa ' + estadoClase;
    }
    function mostrarAviso(texto){
      const aviso = root.getElementById('aviso-flash');
      aviso.textContent = texto;
      aviso.classList.add('mostrar');
      clearTimeout(mostrarAviso._t);
      mostrarAviso._t = setTimeout(() => aviso.classList.remove('mostrar'), 1100);
    }
    function limpiarMundo(){
      root.getElementById('capa-mundo').innerHTML = '';
    }

    // -------------------- Arrastre genérico (pointer events) --------------------
    function habilitarArrastre(item, obtenerZonas, alSoltar){
      item.style.touchAction = 'none';
      item.addEventListener('pointerdown', (e) => {
        if(item.dataset.bloqueado === '1') return;
        e.preventDefault();
        const escenario = root.getElementById('escenario');
        const rectEsc = escenario.getBoundingClientRect();
        const rectItem = item.getBoundingClientRect();
        const offsetX = e.clientX - rectItem.left;
        const offsetY = e.clientY - rectItem.top;

        item.classList.add('arrastrando');
        item.setPointerCapture(e.pointerId);

        function mover(ev){
          const x = ev.clientX - rectEsc.left - offsetX;
          const y = ev.clientY - rectEsc.top - offsetY;
          item.style.left = x + 'px';
          item.style.top = y + 'px';
          item.style.right = 'auto';
          item.style.bottom = 'auto';
          obtenerZonas().forEach(z => {
            const r = z.getBoundingClientRect();
            const dentro = ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom;
            z.classList.toggle('resaltada', dentro);
            z.classList.toggle('resaltado', dentro);
          });
        }
        function soltar(ev){
          item.classList.remove('arrastrando');
          item.removeEventListener('pointermove', mover);
          item.removeEventListener('pointerup', soltar);
          let zonaEncontrada = null;
          obtenerZonas().forEach(z => {
            z.classList.remove('resaltada','resaltado');
            const r = z.getBoundingClientRect();
            if(ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom){
              zonaEncontrada = z;
            }
          });
          alSoltar(item, zonaEncontrada);
        }
        item.addEventListener('pointermove', mover);
        item.addEventListener('pointerup', soltar);
      });
    }

    function regresarAPosicion(item, izqPct, bottomPct){
      item.style.left = izqPct + '%';
      item.style.bottom = bottomPct + '%';
      item.style.top = 'auto';
      item.style.right = 'auto';
    }

    // -------------------- Temporizador genérico --------------------
    let _timerRAF = null;
    function correrTemporizador({duracionSeg, idTexto, onTick, onFin}){
      detenerTemporizador();
      const inicio = performance.now();
      const duracionMs = duracionSeg * 1000;
      function paso(ahora){
        const transcurrido = ahora - inicio;
        const progreso = Math.min(transcurrido / duracionMs, 1);
        const restante = Math.max(duracionSeg - transcurrido/1000, 0);
        root.getElementById(idTexto).textContent = Math.ceil(restante);
        onTick(progreso);
        if(progreso >= 1){ onFin(); return; }
        _timerRAF = requestAnimationFrame(paso);
      }
      _timerRAF = requestAnimationFrame(paso);
    }
    function detenerTemporizador(){
      if(_timerRAF) cancelAnimationFrame(_timerRAF);
      _timerRAF = null;
    }

    // ============================================================
    // ETAPA 1 — Arrastrar manuscritos, mapas y objetos al maletín
    // ============================================================
    const e1 = { items:[], enMaletin:0, perdidos:0, total:0 };

    function iniciarEtapa1(){
      irA('etapa1');
      marcarEtapa(1,'activa');
      limpiarMundo();
      root.getElementById('agua').style.transition = 'height 0.4s linear';
      root.getElementById('agua').style.height = '0%';
      cambiarFondo('hero_archivo_tormenta.jpg');

      const mundo = root.getElementById('capa-mundo');
      const maletin = document.createElement('div');
      maletin.id = 'zona-maletin';
      maletin.style.backgroundImage = `url('${BASE}images/maletin_estanque.jpg')`;
      maletin.innerHTML = `<span class="titulo-maletin">💼 MALETÍN ESTANQUE</span><div id="contenido-maletin"></div>`;
      mundo.appendChild(maletin);

      const definicion = ARCHIVO_COMPLETO;
      e1.items = []; e1.enMaletin = 0; e1.perdidos = 0; e1.total = definicion.length;
      root.getElementById('e1-total').textContent = e1.total;
      root.getElementById('e1-contador').textContent = '0';

      definicion.forEach((d) => {
        const el = document.createElement('div');
        el.className = 'item-arrastrable';
        el.style.left = d.izquierda + '%';
        el.style.bottom = d.altura + '%';
        el.dataset.alturaLimite = d.altura;
        el.dataset.estado = 'suelto';
        el.innerHTML = `<div class="icono-item">${contenidoIcono(d)}</div><div class="nombre-item">${d.nombre}</div>`;
        mundo.appendChild(el);
        e1.items.push({el, def:d});

        habilitarArrastre(el, () => [root.getElementById('zona-maletin')], (item, zona) => {
          if(item.dataset.estado !== 'suelto') return;
          if(zona){
            item.dataset.estado = 'en_maletin';
            item.dataset.bloqueado = '1';
            item.classList.add('resuelto');
            root.getElementById('contenido-maletin').innerHTML += `<span title="${d.nombre}">${d.icono}</span>`;
            e1.enMaletin++;
            root.getElementById('e1-contador').textContent = e1.enMaletin;
            mostrarAviso(d.nombre + ' — a salvo ✅');
            comprobarFinEtapa1();
          } else {
            regresarAPosicion(item, d.izquierda, d.altura);
          }
        });
      });

      correrTemporizador({
        duracionSeg: 50,
        idTexto:'e1-tiempo',
        onTick:(progreso) => {
          root.getElementById('agua').style.height = (progreso*100) + '%';
          e1.items.forEach(({el, def}) => {
            if(el.dataset.estado !== 'suelto') return;
            if(progreso*100 >= def.altura){
              el.dataset.estado = 'perdido';
              el.dataset.bloqueado = '1';
              el.classList.add('perdido');
              setTimeout(() => el.classList.add('resuelto'), 500);
              e1.perdidos++;
              mostrarAviso(def.nombre + ' — perdido bajo el agua 💧');
              comprobarFinEtapa1();
            }
          });
        },
        onFin: () => terminarEtapa1()
      });
    }
    function comprobarFinEtapa1(){
      if(e1.enMaletin + e1.perdidos >= e1.total){
        detenerTemporizador();
        terminarEtapa1();
      }
    }
    function terminarEtapa1(){
      detenerTemporizador();

      if(e1.perdidos > 0){
        marcarEtapa(1,'');
        mostrarAviso(`Se perdieron ${e1.perdidos} archivo(s) bajo el agua — hay que empezar la etapa de nuevo 💧`);
        setTimeout(() => iniciarEtapa1(), 1700);
        return;
      }

      marcarEtapa(1,'hecha');
      const zonaMaletin = root.getElementById('zona-maletin');
      if(zonaMaletin) zonaMaletin.style.backgroundImage = `url('${BASE}images/maletin_sellado.jpg')`;
      mostrarAviso('Maletín sellado — todo el archivo a salvo 💼🔒');
      setTimeout(() => iniciarEtapa2(), 1400);
    }

    // ============================================================
    // ETAPA 2 — Forzar la escotilla (mecánica de presión)
    // ============================================================
    const e2 = { presion:0, resuelta:false };

    function iniciarEtapa2(){
      irA('etapa2');
      marcarEtapa(2,'activa');
      limpiarMundo();
      cambiarFondo('escotilla_drenaje.jpg');
      e2.presion = 0; e2.resuelta = false;
      root.getElementById('e2-porcentaje').textContent = '0';

      const mundo = root.getElementById('capa-mundo');
      const zona = document.createElement('div');
      zona.id = 'zona-escotilla';
      zona.innerHTML = `
        <img id="foto-escotilla" src="${BASE}images/gabriel_forzando_escotilla.jpg" alt="Gabriel forzando la escotilla">
        <div id="medidor-cont"><div id="medidor-relleno"></div></div>
        <button id="boton-llave" type="button">🔧 Forzar escotilla</button>
      `;
      mundo.appendChild(zona);

      const boton = root.getElementById('boton-llave');
      const foto = root.getElementById('foto-escotilla');
      boton.addEventListener('click', () => {
        if(e2.resuelta) return;
        e2.presion = Math.min(100, e2.presion + 8 + Math.random()*3);
        root.getElementById('e2-porcentaje').textContent = Math.round(e2.presion);
        root.getElementById('medidor-relleno').style.width = e2.presion + '%';
        foto.classList.add('forzando');
        setTimeout(() => foto.classList.remove('forzando'), 120);
        if(e2.presion >= 100){
          e2.resuelta = true;
          detenerTemporizador();
          terminarEtapa2(true);
        }
      });

      correrTemporizador({
        duracionSeg: 14,
        idTexto:'e2-tiempo',
        onTick:() => {
          if(!e2.resuelta){
            e2.presion = Math.max(0, e2.presion - 0.5);
            root.getElementById('e2-porcentaje').textContent = Math.round(e2.presion);
            root.getElementById('medidor-relleno').style.width = e2.presion + '%';
          }
        },
        onFin: () => { if(!e2.resuelta) terminarEtapa2(false); }
      });
    }
    function terminarEtapa2(exito){
      detenerTemporizador();
      const agua = root.getElementById('agua');
      agua.style.transition = 'height 1.6s ease-in';

      if(!exito){
        marcarEtapa(1,'');
        marcarEtapa(2,'');
        mostrarAviso('La escotilla no cedió a tiempo — el agua vuelve a subir, hay que empezar de nuevo 💧');
        agua.style.height = '100%';
        setTimeout(() => iniciarEtapa1(), 1800);
        return;
      }

      marcarEtapa(2,'hecha');
      mostrarAviso('¡La escotilla cede! El agua empieza a drenar 🌊➡️');
      agua.style.height = '0%';
      setTimeout(() => iniciarEtapa3(), 1700);
    }

    // ============================================================
    // ETAPA 3 — Clasificar por categoría los mismos archivos rescatados
    // ============================================================
    const e3 = { items:[], correctos:0, total:0 };

    function iniciarEtapa3(){
      irA('etapa3');
      marcarEtapa(3,'activa');
      limpiarMundo();
      cambiarFondo('estanteria_archivo.jpg');
      root.getElementById('agua').style.transition = 'height 0.4s linear';
      root.getElementById('agua').style.height = '0%';

      const rescatados = e1.items
        .filter(({el}) => el.dataset.estado === 'en_maletin')
        .map(({def}) => def);

      e3.items = []; e3.correctos = 0; e3.total = rescatados.length;
      root.getElementById('e3-total').textContent = e3.total;
      root.getElementById('e3-contador').textContent = '0';

      if(e3.total === 0){
        root.querySelector('#pantalla-etapa3 .narrativa').textContent =
          'El agua se llevó todo antes de poder sellar el maletín. No queda nada que clasificar.';
        setTimeout(() => terminarEtapa3(), 1200);
        return;
      }

      const mundo = root.getElementById('capa-mundo');
      const nombresCategorias = mezclar(Object.keys(CATEGORIAS));
      const posicionesCofres = [22, 50, 78];

      nombresCategorias.forEach((cat, i) => {
        const info = CATEGORIAS[cat];
        const cofre = document.createElement('div');
        cofre.className = 'cofre';
        cofre.style.left = posicionesCofres[i] + '%';
        cofre.style.bottom = '8%';
        cofre.dataset.categoria = cat;
        cofre.innerHTML = `<div class="caja-cofre">${info.icono}</div><div class="etiqueta-cofre">${info.etiqueta}</div>`;
        mundo.appendChild(cofre);
      });

      // Posiciones dispersas (no en fila, no agrupadas por categoría) para que
      // los archivos no queden visualmente ordenados de la misma forma que
      // los cofres — se mezclan en cada partida.
      const POOL_POSICIONES = [
        {izquierda:10, altura:62}, {izquierda:30, altura:72}, {izquierda:50, altura:56},
        {izquierda:70, altura:68}, {izquierda:88, altura:52}, {izquierda:18, altura:40},
        {izquierda:40, altura:36}, {izquierda:60, altura:44}, {izquierda:80, altura:38}
      ];
      const posiciones = mezclar(POOL_POSICIONES);
      const ordenItems = mezclar(rescatados);

      ordenItems.forEach((def, i) => {
        const {izquierda, altura} = posiciones[i % posiciones.length];

        const el = document.createElement('div');
        el.className = 'item-arrastrable';
        el.style.left = izquierda + '%';
        el.style.bottom = altura + '%';
        el.dataset.estado = 'suelto';
        el.dataset.categoria = def.categoria;
        el.innerHTML = `<div class="icono-item">${contenidoIcono(def)}</div><div class="nombre-item">${def.nombre}</div>`;
        mundo.appendChild(el);
        e3.items.push({el, def, izq:izquierda, alt:altura});

        habilitarArrastre(el, () => Array.from(root.querySelectorAll('.cofre')), (item, zonaCofre) => {
          if(item.dataset.estado !== 'suelto') return;
          if(zonaCofre && zonaCofre.dataset.categoria === def.categoria){
            item.dataset.estado = 'correcto';
            item.dataset.bloqueado = '1';
            item.classList.add('correcto');
            setTimeout(() => item.classList.add('resuelto'), 450);
            zonaCofre.classList.add('ocupado');
            e3.correctos++;
            root.getElementById('e3-contador').textContent = e3.correctos;
            mostrarAviso(def.nombre + ' → ' + CATEGORIAS[def.categoria].etiqueta + ' ✅');
            comprobarFinEtapa3();
          } else {
            if(zonaCofre){
              item.classList.add('incorrecto');
              mostrarAviso('Ese no es su cofre — revisa la categoría');
              setTimeout(() => item.classList.remove('incorrecto'), 450);
            }
            regresarAPosicion(item, izquierda, altura);
          }
        });
      });

      correrTemporizador({
        duracionSeg: 30,
        idTexto:'e3-tiempo',
        onTick: () => {},
        onFin: () => terminarEtapa3()
      });
    }
    function comprobarFinEtapa3(){
      if(e3.correctos >= e3.total){
        detenerTemporizador();
        terminarEtapa3();
      }
    }
    function terminarEtapa3(){
      detenerTemporizador();
      marcarEtapa(3,'hecha');
      const total = e3.total;
      let texto;
      if(total === 0){
        texto = 'No quedó ningún archivo para clasificar.';
      } else if(e3.correctos === total){
        texto = 'Cada archivo quedó en el cofre de su categoría. El archivo oculto, o lo que queda de él tras el atentado, está a salvo y en orden.';
      } else {
        texto = `Se clasificaron ${e3.correctos} de ${total} archivos antes de que el tiempo se agotara. El resto queda para más tarde, pero lo esencial está resguardado.`;
      }
      root.getElementById('texto-epilogo').textContent =
        `El maletín estanque guardó ${e1.enMaletin} de ${e1.total} archivos, la escotilla drenó el subterráneo y ${e3.correctos} de ${total} quedaron bien clasificados por categoría. ` + texto;
      cambiarFondo('omar_clasificando.jpg');
      irA('epilogo');
    }

    // -------------------- Cierre y evento de finalización --------------------
    function finalizarJuego(){
      const datos = {
        equipoResguardado: e1.enMaletin, equipoTotal: e1.total,
        escotillaForzada: e2.resuelta,
        archivosClasificados: e3.correctos, archivosTotal: e3.total
      };
      self.dispatchEvent(new CustomEvent('archivo-oculto:completado', {
        detail: datos, bubbles: true, composed: true
      }));
      self.close();
    }

    // -------------------- Reinicio (cada vez que se abre el minijuego) --------------------
    function reiniciar(){
      detenerTemporizador();
      limpiarMundo();
      e1.items = []; e1.enMaletin = 0; e1.perdidos = 0; e1.total = 0;
      e2.presion = 0; e2.resuelta = false;
      e3.items = []; e3.correctos = 0; e3.total = 0;
      marcarEtapa(1,''); marcarEtapa(2,''); marcarEtapa(3,'');
      cambiarFondo('hero_archivo_tormenta.jpg');
      root.getElementById('agua').style.transition = 'height 0.4s linear';
      root.getElementById('agua').style.height = '0%';
      irA('intro');
    }
    self._reiniciar = reiniciar;

    // -------------------- Cableado inicial (una sola vez) --------------------
    root.getElementById('btn-entrar').addEventListener('click', iniciarEtapa1);
    root.getElementById('btn-continuar').addEventListener('click', finalizarJuego);
    imagenConReemplazo(root.getElementById('fondo-escena'), 'hero_archivo_tormenta.jpg');
  }

  customElements.define('archivo-oculto', ArchivoOculto);
})();


/* ============================================================
   ACCIÓN DE MONOGATARI — verbo "atentado" (Escena 27)
   Uso en script.js:  'atentado archivoOculto'

   Va junto a archivo-oculto.js (el componente <archivo-oculto>
   que esta Acción abre y espera). Ver INTEGRACION.md.
   ============================================================ */
(function () {
  'use strict';

  class AtentadoAction extends Monogatari.Action {
    static id = 'AtentadoAction';

    static matchString([action]) {
      return action === 'atentado';
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
          el.removeEventListener('archivo-oculto:completado', onDone);
          resolve();
        };
        el.addEventListener('archivo-oculto:completado', onDone);
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

  monogatari.registerAction(AtentadoAction);
})();
