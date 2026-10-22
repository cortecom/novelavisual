/**
 * <jardin-puzzle> — "Los Jardines Colgantes de Babilonia"
 * Minijuego de 3 etapas para Escena31_PuzzleJardin (Capítulo III, paleta índigo).
 *
 * Etapa 1 — "El Desierto": objeto-oculto en las ruinas del desierto, con Gabriel
 *            dando pistas limitadas.
 * Etapa 2 — "El Mercado Negro": objeto-oculto con riesgo — un vendedor vigilante
 *            "observa" ciertas zonas de forma intermitente; ser sorprendido
 *            demasiadas veces reinicia SOLO la etapa 2 (no se pierden piezas
 *            ya encontradas en la etapa 1).
 * Etapa 3 — "Reconstrucción Digital": arrastrar las 6 piezas encontradas a su
 *            lugar correcto sobre el plano en corte de la ziggurat/jardines.
 *
 * TODO EL ARCHIVO VIVE DENTRO DE UN IIFE (lección aprendida con
 * epigrama-puzzle.js / vaticano-maze.js: dos <script> clásicos que declaraban
 * `function _build(...)` en el scope global se pisaban entre sí sin ningún
 * error de consola). Aquí `_build`, `PIECES`, `THEMES`, etc. son privados a
 * este archivo y jamás tocan `window`.
 */
(function () {
  'use strict';

  const STATE = {
    STAGE1: 'stage1',
    STAGE2: 'stage2',
    STAGE3: 'stage3',
    DONE: 'done'
  };

  // Las 6 piezas arquitectónicas de los Jardines Colgantes.
  // `stage` indica en qué etapa de búsqueda aparece (1 = desierto, 2 = mercado negro).
  // `slot` es el id de la zona de ensamblaje correcta en la Etapa 3.
  const PIECES = [
    { id: 'terraza_baja',  stage: 1, slot: 'slot_terraza_baja',  name: 'Terraza Inferior',        icon: 'assets/games/jardines-colgantes-babilonia/images/pieza_terraza_baja.png' },
    { id: 'terraza_media', stage: 1, slot: 'slot_terraza_media', name: 'Terraza Media',            icon: 'assets/games/jardines-colgantes-babilonia/images/pieza_terraza_media.png' },
    { id: 'terraza_alta',  stage: 1, slot: 'slot_terraza_alta',  name: 'Terraza Superior',         icon: 'assets/games/jardines-colgantes-babilonia/images/pieza_terraza_alta.png' },
    { id: 'arcos',         stage: 2, slot: 'slot_arcos',         name: 'Arcos de Sostén',          icon: 'assets/games/jardines-colgantes-babilonia/images/pieza_arcos.png' },
    { id: 'tornillo',      stage: 2, slot: 'slot_tornillo',      name: 'Tornillo de Riego',        icon: 'assets/games/jardines-colgantes-babilonia/images/pieza_tornillo.png' },
    { id: 'vegetacion',    stage: 2, slot: 'slot_vegetacion',    name: 'Vegetación Colgante',      icon: 'assets/games/jardines-colgantes-babilonia/images/pieza_vegetacion.png' }
  ];

  // Hotspots de la Etapa 1 (desierto). Coordenadas en % sobre el fondo.
  // Incluye señuelos (isDecoy) que no cuentan como pieza real.
  const IMG = 'assets/games/jardines-colgantes-babilonia/images/';
  // Zona de vigilancia del mercado según la posición horizontal del objeto.
  const zoneOf = (x) => (x < 34 ? 'A' : x < 67 ? 'B' : 'C');
  // Señuelo: r=4 (cuadrado de 8% del ancho). `fb` = imagen de respaldo (ya existente)
  // que se muestra mientras la imagen nueva todavía no esté en la carpeta images/.
  const D = (id, x, y, file, hint, fb) => ({ id, x, y, r: 4, isDecoy: true, hint, icon: IMG + file + '.png', fallback: IMG + fb + '.png' });

  // ETAPA 1 — DESIERTO. Todo sobre la franja de arena del fondo (y 50–80), en 3 filas escalonadas.
  const STAGE1_SPOTS = [
    // piezas reales
    { id: 'terraza_baja',  x: 28, y: 65, r: 4, isDecoy: false },
    { id: 'terraza_media', x: 50, y: 50, r: 4, isDecoy: false },
    { id: 'terraza_alta',  x: 71, y: 65, r: 4, isDecoy: false },
    // señuelos originales (8)
    D('decoy1',  7, 50, 'decoy_hueso_camello',      'Solo un hueso de camello.', 'decoy_hueso_camello'),
    D('decoy2', 93, 50, 'decoy_roca_lisa',          'Una roca cualquiera, nada tallado en ella.', 'decoy_roca_lisa'),
    D('decoy3', 36, 80, 'decoy_chatarra',           'Chatarra de una expedición anterior.', 'decoy_chatarra'),
    D('decoy4',  7, 80, 'decoy_replica_barata',     'Una figura de piedra reconstituida... esto es del mercado, no de aquí.', 'decoy_replica_barata'),
    D('decoy5', 79, 80, 'decoy_ceramica_moderna',   'Cerámica pintada de algún puesto de mercader. No pertenece a estas ruinas.', 'decoy_ceramica_moderna'),
    D('decoy6', 64, 50, 'decoy_lampara_cobre',      'Una lámpara de cobre de algún mercader. Nada que ver con los jardines.', 'decoy_lampara_cobre'),
    D('decoy7', 64, 80, 'decoy_alfombra_enrollada', 'Solo una alfombra vieja, olvidada por algún viajero.', 'decoy_alfombra_enrollada'),
    D('decoy8', 21, 50, 'decoy_cofre_madera',       'Un cofre de madera vacío. No es lo que buscamos.', 'decoy_cofre_madera'),
    // señuelos NUEVOS (8) — imágenes por crear (ver PROMPTS_IMAGENES.md)
    D('decoy9',  36, 50, 'decoy_balanza_bronce',    'Una balanza de mercader. No sirve para construir nada.', 'decoy_lampara_cobre'),
    D('decoy10', 79, 50, 'decoy_cantimplora_cuero', 'Una cantimplora vacía de algún viajero.', 'decoy_chatarra'),
    D('decoy11', 14, 65, 'decoy_sandalia_vieja',    'Una sandalia gastada, olvidada hace décadas.', 'decoy_hueso_camello'),
    D('decoy12', 43, 65, 'decoy_vasija_barro_rota', 'Barro cocido sin ningún grabado. Cerámica común.', 'decoy_ceramica_moderna'),
    D('decoy13', 57, 65, 'decoy_monedas_oxidadas',  'Unas monedas corroídas. Valen poco y no sirven aquí.', 'decoy_chatarra'),
    D('decoy14', 86, 65, 'decoy_sacos_grano',       'Un saco de grano roto por el sol.', 'decoy_alfombra_enrollada'),
    D('decoy15', 93, 80, 'decoy_jarra_vidrio_azul', 'Vidrio moderno, de un puesto de mercado.', 'decoy_ceramica_moderna'),
    D('decoy16', 21, 80, 'decoy_lanza_oxidada',     'Una lanza oxidada. Nada que ver con los jardines.', 'decoy_chatarra')
  ];

  // Hotspots de la Etapa 2 (mercado negro), cada uno con una zona de "vigilancia"
  // asociada (watchZone) que se enciende/apaga con el tiempo.
  // ETAPA 2 — MERCADO NEGRO. Todo sobre los mostradores/tiendas del fondo (y 52–82), 3 filas escalonadas.
  const STAGE2_SPOTS = [
    // piezas reales
    { id: 'arcos',      x: 22, y: 67, r: 4, isDecoy: false, watchZone: zoneOf(22) },
    { id: 'tornillo',   x: 50, y: 67, r: 4, isDecoy: false, watchZone: zoneOf(50) },
    { id: 'vegetacion', x: 80, y: 52, r: 4, isDecoy: false, watchZone: zoneOf(80) },
    // señuelos originales (7)
    ...[
      D('decoy1', 10, 52, 'decoy_replica_barata',  'Una réplica barata, no sirve.', 'decoy_replica_barata'),
      D('decoy2', 36, 52, 'decoy_ceramica_moderna','Cerámica moderna pintada como antigua.', 'decoy_ceramica_moderna'),
      D('decoy3', 93, 52, 'decoy_hueso_camello',   'Otro hueso más, esta vez lo trajeron del desierto por error.', 'decoy_hueso_camello'),
      D('decoy4', 51, 52, 'decoy_roca_lisa',       'Una roca del desierto, alguien la dejó aquí sin razón.', 'decoy_roca_lisa'),
      D('decoy5', 65, 67, 'decoy_chatarra',        'Chatarra vieja, no vale nada.', 'decoy_chatarra'),
      D('decoy6', 10, 82, 'decoy_calavera_animal', 'La calavera de algún animal del desierto. No es una pieza de los jardines.', 'decoy_calavera_animal'),
      D('decoy7', 66, 82, 'decoy_piedra_arenisca', 'Un fragmento de arenisca sin tallar. No sirve.', 'decoy_piedra_arenisca'),
      // señuelos NUEVOS (7) — imágenes por crear (ver PROMPTS_IMAGENES.md)
      D('decoy8',  36, 67, 'decoy_arbusto_seco',    'Un arbusto seco del desierto. Aquí no pinta nada.', 'decoy_roca_lisa'),
      D('decoy9',  80, 67, 'decoy_concha_fosil',    'Una concha fósil. Bonita, pero no es lo que buscamos.', 'decoy_piedra_arenisca'),
      D('decoy10', 93, 67, 'decoy_cuerno_cabra',    'Un cuerno de cabra montés. No sirve para armar nada.', 'decoy_hueso_camello'),
      D('decoy11', 50, 82, 'decoy_tronco_petrificado','Madera petrificada sin forma. No es arquitectura.', 'decoy_roca_lisa'),
      D('decoy12', 22, 82, 'decoy_geoda_partida',   'Una geoda partida. Es mineral, no un fragmento tallado.', 'decoy_piedra_arenisca'),
      D('decoy13', 80, 82, 'decoy_costilla_animal', 'Una costilla de animal. Nada que ver con los jardines.', 'decoy_calavera_animal'),
      D('decoy14', 93, 82, 'decoy_escorpion_seco',  'Un escorpión disecado. Curioso, pero inútil.', 'decoy_calavera_animal')
    ]
  ].map(sp => (sp.watchZone ? sp : Object.assign({}, sp, { watchZone: zoneOf(sp.x) })));

  const WATCH_ZONES = ['A', 'B', 'C'];
  const WATCH_CYCLE_MS = 2600; // cuánto dura cada fase de vigilancia
  const MAX_STRIKES = 3;       // sorpresas permitidas antes de reiniciar la Etapa 2

  const TEMPLATE = `
    <style>
      :host {
        all: initial;
        position: absolute;
        inset: 0;
        z-index: 5;
        display: none;
        font-family: 'EB Garamond', serif;
      }
      :host([open]) { display: block; }
      * { box-sizing: border-box; }

      .wrap {
        position: absolute; inset: 0;
        background: #0d0a1a;
        color: #f3e9d2;
        overflow: hidden;
      }

      .scene {
        position: absolute; inset: 0;
        background-size: cover;
        background-position: center;
        transition: opacity .5s ease;
      }
      .scene.stage1 {
        background-color: #3a2a17;
        background-image: url('assets/games/jardines-colgantes-babilonia/images/bg_desierto.png');
      }
      .scene.stage2 {
        background-color: #1c1430;
        background-image: url('assets/games/jardines-colgantes-babilonia/images/bg_mercado_negro.png');
      }
      .scene.stage3 { background-color: #14102a; }

      .vignette {
        position: absolute; inset: 0;
        pointer-events: none;
        background: radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(10,7,20,.75) 100%);
      }

      .hud {
        position: absolute; top: 0; left: 0; right: 0;
        padding: 14px 22px;
        display: flex; align-items: center; justify-content: space-between;
        background: linear-gradient(to bottom, rgba(10,7,20,.85), transparent);
        z-index: 4;
      }
      .hud h1 {
        font-family: 'Cinzel', serif;
        font-size: 20px;
        letter-spacing: .04em;
        margin: 0;
        color: #d8b26b;
        text-shadow: 0 2px 6px rgba(0,0,0,.6);
      }
      .hud .sub {
        font-size: 14px;
        color: #c9bfe0;
        opacity: .85;
      }
      .piece-tray {
        display: flex; gap: 8px;
      }
      .piece-chip {
        width: 34px; height: 34px;
        border-radius: 50%;
        border: 2px solid #6a5a2f;
        background: #241a3a center/70% no-repeat;
        opacity: .25;
        transition: opacity .3s, transform .3s;
      }
      .piece-chip.got { opacity: 1; transform: scale(1.05); border-color: #d8b26b; }

      /* --- Etapas 1 y 2: objeto oculto --- */
      .hotspot {
        position: absolute;
        transform: translate(-50%, -50%);
        cursor: pointer;
        background-color: transparent;
        aspect-ratio: 1 / 1;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        filter: drop-shadow(0 5px 7px rgba(0,0,0,.55));
        transition: transform .15s, opacity .3s, filter .3s;
      }
      .hotspot:hover { transform: translate(-50%, -50%) scale(1.06); }
      .hotspot.debug { outline: 1px dashed rgba(255,255,255,.15); }
      .hotspot.found {
        pointer-events: none;
        opacity: .55;
        filter: drop-shadow(0 5px 7px rgba(0,0,0,.55)) grayscale(55%);
      }

      .spark {
        position: absolute; transform: translate(-50%, -50%);
        pointer-events: none;
        font-size: 28px;
        animation: spark-pop .6s ease forwards;
      }
      @keyframes spark-pop {
        0% { opacity: 0; transform: translate(-50%,-50%) scale(.4); }
        40% { opacity: 1; transform: translate(-50%,-50%) scale(1.15); }
        100% { opacity: 0; transform: translate(-50%,-65%) scale(1); }
      }

      .toast {
        position: absolute; left: 50%; bottom: 92px;
        transform: translateX(-50%);
        background: rgba(20,14,36,.92);
        border: 1px solid #6a5a2f;
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 15px;
        opacity: 0;
        transition: opacity .25s;
        max-width: 70%;
        text-align: center;
      }
      .toast.show { opacity: 1; }

      /* Gabriel / vendedor: retrato + globo de diálogo, esquina inferior izq. */
      .npc {
        position: absolute; left: 18px; bottom: 18px;
        display: flex; align-items: flex-end; gap: 10px;
        max-width: 46%;
      }
      .npc img {
        width: 92px; height: 92px;
        border-radius: 10px;
        border: 2px solid #d8b26b;
        object-fit: cover;
        background: #241a3a;
        cursor: pointer;
      }
      .npc .bubble {
        background: rgba(243,233,210,.95);
        color: #241a3a;
        border-radius: 10px;
        padding: 8px 12px;
        font-size: 14px;
        line-height: 1.3;
        position: relative;
      }
      .npc .hint-count {
        font-size: 11px;
        opacity: .7;
        display: block;
        margin-top: 4px;
      }

      /* Etapa 2: indicadores de vigilancia por zona */
      .watch-lamp {
        position: absolute;
        width: 16px; height: 16px;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 8px 2px currentColor;
        transition: color .3s, box-shadow .3s;
      }
      .watch-lamp.safe { color: #6fbf73; }
      .watch-lamp.watched { color: #d9534f; }

      .strikes {
        position: absolute; top: 60px; right: 22px;
        display: flex; gap: 6px;
      }
      .strike-dot {
        width: 12px; height: 12px; border-radius: 50%;
        background: rgba(217,83,79,.25);
        border: 1px solid #d9534f;
      }
      .strike-dot.lost { background: #d9534f; }

      /* --- Etapa 3: ensamblaje --- */
      .blueprint {
        position: absolute;
        top: 76px; bottom: 120px; left: 0; right: 0;
        display: flex; align-items: center; justify-content: center;
      }
      .blueprint { container-type: size; }
      .blueprint-art {
        position: relative;
        /* siempre proporción 4:5 (los espacios van en % del plano) y lo más grande posible */
        width: min(98cqw, 80cqh);
        height: auto;
        aspect-ratio: 4 / 5;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        filter: drop-shadow(0 10px 30px rgba(0,0,0,.5));
      }
      .blueprint-dark {
        position: absolute; inset: 0;
        background: rgba(6, 4, 14, .45);
        border-radius: 4px;
        pointer-events: none;
      }
      .slot {
        position: absolute;
        transform: translate(-50%, -50%);
        width: 15%;
        aspect-ratio: 1;
        border: 2px dashed rgba(216,178,107,.55);
        border-radius: 10px;
        display: flex; align-items: center; justify-content: center;
        background: rgba(216,178,107,.06);
      }
      .slot.filled {
        border-style: solid;
        background: rgba(216,178,107,.18);
      }
      .slot img { width: 100%; height: 100%; object-fit: contain; }

      .tray {
        position: absolute; left: 0; right: 0; bottom: 0;
        padding: 16px 22px 20px;
        display: flex; gap: 14px; justify-content: center;
        background: linear-gradient(to top, rgba(10,7,20,.9), transparent);
      }
      .tray-piece {
        width: 64px; height: 64px;
        border-radius: 10px;
        border: 2px solid #6a5a2f;
        background: #241a3a center/72% no-repeat;
        cursor: grab;
        touch-action: none;
        transition: opacity .2s, transform .15s;
      }
      .tray-piece.placed { opacity: .15; pointer-events: none; }
      .tray-piece.dragging { opacity: .35; }

      .drag-ghost {
        position: absolute;
        width: 64px; height: 64px;
        border-radius: 10px;
        border: 2px solid #d8b26b;
        background: #241a3a center/72% no-repeat;
        pointer-events: none;
        z-index: 20;
        transform: translate(-50%, -50%);
      }

      .progress-bar {
        position: absolute; top: 60px; left: 22px; right: 22px;
        height: 6px; border-radius: 3px;
        background: rgba(255,255,255,.12);
        overflow: hidden;
      }
      .progress-fill {
        height: 100%; width: 0%;
        background: linear-gradient(90deg, #6a5a2f, #d8b26b);
        transition: width .4s ease;
      }

      /* --- Pantallas intermedias / overlays --- */
      .overlay {
        position: absolute; inset: 0;
        background: rgba(8,6,16,.92);
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        text-align: center; gap: 16px; padding: 40px;
        z-index: 10;
      }
      .overlay.hidden { display: none; }
      .overlay h2 {
        font-family: 'Cinzel', serif;
        color: #d8b26b;
        font-size: 26px;
        margin: 0;
        letter-spacing: .03em;
      }
      .overlay p { max-width: 560px; font-size: 16px; line-height: 1.5; color: #e6dcc6; margin: 0; }
      .overlay .reveal-img {
        width: auto; height: auto;
        max-width: min(92vw, 680px);
        max-height: calc(100vh - 230px);
        max-height: calc(100dvh - 230px);
        object-fit: contain;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0,0,0,.6);
        opacity: 0;
        transform: scale(.96);
        transition: opacity 1.1s ease, transform 1.1s ease;
        flex: 0 1 auto;
        min-height: 0;
      }
      .overlay .reveal-img.show { opacity: 1; transform: scale(1); }

      /* Pantalla de victoria: nunca debe quedar el botón fuera de vista */
      #overlayWin { overflow-y: auto; padding: 16px 20px; gap: 12px; }
      #overlayWin .win-side {
        display: flex; flex-direction: column; align-items: center;
        gap: 10px; flex: 0 0 auto;
      }
      #overlayWin .win-side h2 { font-size: 22px; }

      /* Celular en horizontal (pantalla baja): imagen a la izquierda,
         título + texto + botón Continuar a la derecha, todo visible. */
      @media (max-height: 540px) {
        #overlayWin {
          flex-direction: row; align-items: center; justify-content: center;
          gap: 22px; padding: 12px 18px;
        }
        #overlayWin .reveal-img {
          max-width: 58vw;
          max-height: calc(100vh - 24px);
          max-height: calc(100dvh - 24px);
        }
        #overlayWin .win-side { flex: 1 1 0; min-width: 0; max-width: 300px; }
        #overlayWin .win-side h2 { font-size: 18px; }
        #overlayWin .win-side p { font-size: 14px; line-height: 1.35; }
        button.btn { padding: 9px 20px; }
      }

      button.btn {
        font-family: 'Cinzel', serif;
        background: linear-gradient(180deg, #d8b26b, #a8823f);
        color: #241a3a;
        border: none;
        padding: 11px 26px;
        border-radius: 8px;
        font-size: 15px;
        letter-spacing: .03em;
        cursor: pointer;
        box-shadow: 0 4px 14px rgba(0,0,0,.4);
      }
      button.btn:hover { filter: brightness(1.08); }
      button.btn.secondary {
        background: transparent;
        border: 1px solid #d8b26b;
        color: #d8b26b;
      }

      /* ===== Celulares ===== */
      /* El mensaje de Gabriel / del vendedor ya NO queda fijo tapando objetos:
         solo el retrato (chico) queda en la esquina; el globo aparece unos
         segundos cuando hay una pista o un aviso, y deja pasar los toques. */
      @media (max-height: 540px), (max-width: 700px) {
        .hud { padding: 8px 12px; }
        .hud h1 { font-size: 15px; }
        .hud .sub { font-size: 12px; }
        .piece-chip { width: 28px; height: 28px; }
        .npc { left: 8px; bottom: 8px; max-width: 60%; gap: 6px; pointer-events: none; }
        .npc img { width: 52px; height: 52px; pointer-events: auto; }
        .npc .bubble {
          font-size: 12px; padding: 5px 9px; max-width: 46vw;
          opacity: 0; transition: opacity .3s; pointer-events: none;
        }
        .npc .bubble.flash { opacity: 1; }
        .npc .hint-count { font-size: 10px; margin-top: 2px; }
        .strikes { top: 52px; right: 12px; }
        .toast { bottom: 70px; font-size: 13px; padding: 6px 12px; }
        .tray-piece, .drag-ghost { width: 52px; height: 52px; }
        .slot { width: 19%; }
        button.btn { padding: 9px 20px; }
      }

      /* Etapa 3 en celular HORIZONTAL: el plano usa toda la altura y las
         piezas pasan a una columna a la derecha (antes quedaba diminuto). */
      @media (max-height: 540px) {
        #scene3 .hud { padding: 6px 12px; }
        #scene3 .hud .sub { display: none; }
        #scene3 .progress-bar { top: 34px; left: 12px; right: 160px; }
        #scene3 .blueprint { top: 42px; bottom: 6px; left: 6px; right: 156px; }
        #scene3 .tray {
          left: auto; right: 6px; top: 42px; bottom: 6px; width: 146px;
          padding: 4px; gap: 8px; flex-wrap: wrap; align-content: center;
          justify-content: center; background: rgba(10,7,20,.55);
          border-radius: 10px;
        }
      }

      /* Etapa 3 en celular VERTICAL: bandeja en 1 sola fila sin desbordar */
      @media (max-width: 700px) and (min-height: 541px) {
        #scene3 .tray { padding: 8px 8px 12px; gap: 6px; flex-wrap: wrap; }
        #scene3 .blueprint { top: 70px; bottom: 90px; }
      }
    </style>

    <div class="wrap">

      <!-- ETAPA 1: DESIERTO -->
      <div class="scene stage1" id="scene1" style="display:none;">
        <div class="hud">
          <div>
            <h1>Los Jardines Colgantes — El Desierto</h1>
            <div class="sub" id="sub1">Busca los fragmentos enterrados en la arena.</div>
          </div>
          <div class="piece-tray" id="tray1"></div>
        </div>
        <div class="hotspots" id="hotspots1"></div>
        <div class="npc" id="npc1">
          <img id="gabrielImg" alt="Gabriel" src="assets/games/jardines-colgantes-babilonia/images/gabriel_desierto.png">
          <div class="bubble">
            <span id="gabrielLine">Debe haber algo bajo esta arena… busquemos con cuidado.</span>
            <span class="hint-count" id="hintCount1">Pistas restantes: 3</span>
          </div>
        </div>
        <div class="toast" id="toast1"></div>
        <div class="vignette"></div>
      </div>

      <!-- ETAPA 2: MERCADO NEGRO -->
      <div class="scene stage2" id="scene2" style="display:none;">
        <div class="hud">
          <div>
            <h1>Los Jardines Colgantes — El Mercado Negro</h1>
            <div class="sub" id="sub2">Encuentra las piezas sin llamar la atención del vendedor.</div>
          </div>
          <div class="piece-tray" id="tray2"></div>
        </div>
        <div class="hotspots" id="hotspots2"></div>
        <div class="watch-lamps" id="watchLamps2"></div>
        <div class="strikes" id="strikes2"></div>
        <div class="npc" id="npc2">
          <img alt="Vendedor" src="assets/games/jardines-colgantes-babilonia/images/vendedor_mercado.png">
          <div class="bubble">
            <span id="vendorLine">Mira lo que quieras… pero no toques lo que no vas a pagar.</span>
          </div>
        </div>
        <div class="toast" id="toast2"></div>
        <div class="vignette"></div>
      </div>

      <!-- ETAPA 3: RECONSTRUCCIÓN DIGITAL -->
      <div class="scene stage3" id="scene3" style="display:none;">
        <div class="hud">
          <div>
            <h1>Reconstrucción Digital de los Jardines</h1>
            <div class="sub" id="sub3">Arrastra cada pieza a su lugar en la estructura.</div>
          </div>
        </div>
        <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
        <div class="blueprint">
          <div class="blueprint-art" id="blueprintArt"
               style="background-image:url('assets/games/jardines-colgantes-babilonia/images/plano_ziggurat.png');">
            <div class="blueprint-dark"></div>
            <div class="slot" id="slot_terraza_baja"  style="left:50%; top:86%;"></div>
            <div class="slot" id="slot_terraza_media" style="left:50%; top:60%;"></div>
            <div class="slot" id="slot_terraza_alta"  style="left:50%; top:34%;"></div>
            <div class="slot" id="slot_arcos"          style="left:20%; top:72%;"></div>
            <div class="slot" id="slot_tornillo"       style="left:80%; top:66%;"></div>
            <div class="slot" id="slot_vegetacion"     style="left:50%; top:14%;"></div>
          </div>
        </div>
        <div class="tray" id="tray3"></div>
        <div class="toast" id="toast3"></div>
        <div class="vignette"></div>
      </div>

      <!-- OVERLAY: transición entre etapas -->
      <div class="overlay hidden" id="overlayTransition">
        <h2 id="transTitle"></h2>
        <p id="transText"></p>
        <button class="btn" id="transContinue">Continuar</button>
      </div>

      <!-- OVERLAY: fallo etapa 2 -->
      <div class="overlay hidden" id="overlayCaught">
        <h2>El vendedor sospecha</h2>
        <p>Te han pedido que te retires del puesto. Vuelve a intentarlo con más discreción — no perderás lo que ya encontraste en el desierto.</p>
        <button class="btn" id="retryStage2">Reintentar el mercado</button>
      </div>

      <!-- OVERLAY: victoria final -->
      <div class="overlay hidden" id="overlayWin">
        <img class="reveal-img" id="revealImg"
             src="assets/games/jardines-colgantes-babilonia/images/jardines_reconstruidos_hero.png"
             alt="Jardines Colgantes de Babilonia reconstruidos">
        <div class="win-side">
          <h2>Los Jardines Colgantes, reconstruidos</h2>
          <p>Pieza a pieza, la maravilla vuelve a tomar forma ante ustedes.</p>
          <button class="btn" id="winContinue">Continuar</button>
        </div>
      </div>

    </div>
  `;

  class JardinPuzzle extends HTMLElement {

    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = TEMPLATE;
      this._root = root;
      this._built = false;
    }

    connectedCallback() {
      if (!this._built) {
        _build(this._root, this);
        this._built = true;
      }
    }

    open() {
      this.setAttribute('open', '');
      _build_reset(this._root, this);
      _goToStage1(this._root, this);
    }

    close() {
      this.removeAttribute('open');
      _clearWatchTimer(this);
    }
  }

  // ---------------------------------------------------------------------
  // Lógica interna. Todo colgado de `self._state` (instancia del elemento),
  // nunca de variables de módulo compartidas, para que múltiples aperturas
  // del componente partan siempre desde cero.
  // ---------------------------------------------------------------------

  function _build(root, self) {
    self._state = {
      current: STATE.STAGE1,
      found: new Set(),      // ids de piezas ya encontradas (persisten entre etapas)
      hintsLeft: 3,
      strikes: 0,
      watchTimer: null,
      watchPhase: 0,
      dragging: null
    };

    // --- referencias ---
    const q = (sel) => root.getElementById(sel);
    self._el = {
      scene1: q('scene1'), scene2: q('scene2'), scene3: q('scene3'),
      hotspots1: q('hotspots1'), hotspots2: q('hotspots2'),
      tray1: q('tray1'), tray2: q('tray2'), tray3: q('tray3'),
      toast1: q('toast1'), toast2: q('toast2'), toast3: q('toast3'),
      gabrielLine: q('gabrielLine'), gabrielImg: q('gabrielImg'), hintCount1: q('hintCount1'),
      vendorLine: q('vendorLine'),
      watchLamps2: q('watchLamps2'), strikes2: q('strikes2'),
      progressFill: q('progressFill'),
      blueprintArt: q('blueprintArt'),
      overlayTransition: q('overlayTransition'), transTitle: q('transTitle'), transText: q('transText'), transContinue: q('transContinue'),
      overlayCaught: q('overlayCaught'), retryStage2: q('retryStage2'),
      overlayWin: q('overlayWin'), revealImg: q('revealImg'), winContinue: q('winContinue')
    };

    // pistas de Gabriel (rotan)
    self._gabrielLines = [
      'Debe haber algo bajo esta arena… busquemos con cuidado.',
      'Los mercaderes de Babilonia enterraban lo valioso, no lo abandonaban.',
      'Si algo parece fuera de lugar, probablemente lo esté.'
    ];

    // eventos fijos (una sola vez)
    self._el.gabrielImg.addEventListener('click', () => _useHint(root, self));
    const vImg = root.querySelector('#npc2 img');
    if (vImg) vImg.addEventListener('click', () => _flashBubble(self._el.vendorLine));
    self._el.transContinue.addEventListener('click', () => _onTransitionContinue(root, self));
    self._el.retryStage2.addEventListener('click', () => _goToStage2(root, self, true));
    self._el.winContinue.addEventListener('click', () => _finish(root, self));

    // Evita que un click dentro del minijuego se propague al click-to-advance
    // de Monogatari (mismo patrón usado en los otros minijuegos del proyecto).
    self.addEventListener('click', (e) => e.stopPropagation());

    _renderTray(self._el.tray1, 1);
    _renderTray(self._el.tray2, 2);
  }

  // Reinicia el estado de piezas/hints/strikes cada vez que se abre el
  // minijuego desde cero (por si Escena31_PuzzleJardin se reintenta).
  function _build_reset(root, self) {
    self._state.current = STATE.STAGE1;
    self._state.found = new Set();
    self._state.hintsLeft = 3;
    self._state.strikes = 0;
    _clearWatchTimer(self);
    self._el.hintCount1.textContent = 'Pistas restantes: 3';
    _updateTray(self._el.tray1);
    _updateTray(self._el.tray2);
    _renderTray3(root, self);
    _updateProgress(self);
  }

  function _renderTray(trayEl, stageNum) {
    trayEl.innerHTML = '';
    PIECES.filter(p => p.stage === stageNum).forEach(p => {
      const chip = document.createElement('div');
      chip.className = 'piece-chip';
      chip.dataset.piece = p.id;
      chip.style.backgroundImage = `url('${p.icon}')`;
      trayEl.appendChild(chip);
    });
  }

  function _updateTray(trayEl) {
    // marca como "got" los chips cuyo id ya está en el set global de encontrados
  }

  // ---------------- ETAPA 1: DESIERTO ----------------

  function _goToStage1(root, self) {
    self._state.current = STATE.STAGE1;
    _hideAllScenes(self);
    self._el.scene1.style.display = 'block';
    _flashBubble(self._el.gabrielLine);

    const container = self._el.hotspots1;
    container.innerHTML = '';
    STAGE1_SPOTS.forEach(spot => {
      const already = !spot.isDecoy && self._state.found.has(spot.id);
      const el = document.createElement('div');
      el.className = 'hotspot' + (already ? ' found' : '');
      el.style.left = spot.x + '%';
      el.style.top = spot.y + '%';
      el.style.width = (spot.r * 2) + '%';
      el.style.height = 'auto';
      _setSpotImage(el, spot);
      el.dataset.id = spot.id;
      if (!already) {
        el.addEventListener('click', () => _onStage1Click(root, self, spot, el));
      }
      container.appendChild(el);
    });

    _checkStage1Complete(root, self);
  }

  function _onStage1Click(root, self, spot, el) {
    if (spot.isDecoy) {
      _toast(self._el.toast1, spot.hint || 'No hay nada aquí.');
      return;
    }
    _collectPiece(self, spot.id);
    _spark(el.parentElement, spot.x, spot.y);
    el.classList.add('found');
    el.replaceWith(el.cloneNode(false)); // suelta el listener, ya no es clickeable
    _toast(self._el.toast1, `Encontraste: ${_pieceName(spot.id)}`);
    _checkStage1Complete(root, self);
  }

  function _checkStage1Complete(root, self) {
    const need = PIECES.filter(p => p.stage === 1).every(p => self._state.found.has(p.id));
    if (need) {
      _showTransition(
        self,
        'El desierto ha entregado sus secretos',
        'Con tres fragmentos en la mochila, solo queda buscar el resto donde nadie hace preguntas: el mercado negro.',
        () => _goToStage2(root, self, false)
      );
    }
  }

  function _useHint(root, self) {
    if (self._state.current !== STATE.STAGE1) return;
    if (self._state.hintsLeft <= 0) {
      _toast(self._el.toast1, 'No quedan más pistas.');
      return;
    }
    const pending = STAGE1_SPOTS.find(s => !s.isDecoy && !self._state.found.has(s.id));
    if (!pending) return;
    self._state.hintsLeft -= 1;
    self._el.hintCount1.textContent = `Pistas restantes: ${self._state.hintsLeft}`;
    self._el.gabrielLine.textContent = self._gabrielLines[(3 - self._state.hintsLeft) % self._gabrielLines.length];
    _flashBubble(self._el.gabrielLine);
    const target = self._el.hotspots1.querySelector(`[data-id="${pending.id}"]`);
    if (target) {
      target.style.boxShadow = '0 0 0 3px rgba(216,178,107,.9)';
      target.style.borderRadius = '50%';
      setTimeout(() => { if (target) target.style.boxShadow = 'none'; }, 1400);
    }
  }

  // ---------------- ETAPA 2: MERCADO NEGRO ----------------

  function _goToStage2(root, self, isRetry) {
    self._state.current = STATE.STAGE2;
    if (isRetry) {
      // solo se reinician las piezas de la etapa 2, no las de la etapa 1
      PIECES.filter(p => p.stage === 2).forEach(p => self._state.found.delete(p.id));
      self._state.strikes = 0;
    }
    _hideAllScenes(self);
    self._el.scene2.style.display = 'block';
    _flashBubble(self._el.vendorLine);
    self._el.overlayCaught.classList.add('hidden');

    _renderStrikes(self);

    const container = self._el.hotspots2;
    container.innerHTML = '';
    STAGE2_SPOTS.forEach(spot => {
      const already = !spot.isDecoy && self._state.found.has(spot.id);
      const el = document.createElement('div');
      el.className = 'hotspot' + (already ? ' found' : '');
      el.style.left = spot.x + '%';
      el.style.top = spot.y + '%';
      el.style.width = (spot.r * 2) + '%';
      el.style.height = 'auto';
      _setSpotImage(el, spot);
      el.dataset.id = spot.id;
      el.dataset.zone = spot.watchZone;
      if (!already) {
        el.addEventListener('click', () => _onStage2Click(root, self, spot, el));
      }
      container.appendChild(el);
    });

    _startWatchCycle(root, self);
    _checkStage2Complete(root, self);
  }

  function _startWatchCycle(root, self) {
    _clearWatchTimer(self);
    self._el.watchLamps2.innerHTML = '';
    WATCH_ZONES.forEach((zone, i) => {
      const lamp = document.createElement('div');
      lamp.className = 'watch-lamp safe';
      lamp.dataset.zone = zone;
      // posiciona la lámpara cerca del centroide de los hotspots de esa zona
      const spots = STAGE2_SPOTS.filter(s => s.watchZone === zone);
      const avgX = spots.reduce((a, s) => a + s.x, 0) / spots.length;
      lamp.style.left = avgX + '%';
      lamp.style.top = '14%';
      self._el.watchLamps2.appendChild(lamp);
    });

    self._state.watchPhase = 0;
    const tick = () => {
      self._state.watchPhase = (self._state.watchPhase + 1) % WATCH_ZONES.length;
      const activeZone = WATCH_ZONES[self._state.watchPhase];
      self._el.watchLamps2.querySelectorAll('.watch-lamp').forEach(lamp => {
        const watched = lamp.dataset.zone === activeZone;
        lamp.classList.toggle('watched', watched);
        lamp.classList.toggle('safe', !watched);
      });
    };
    tick();
    self._state.watchTimer = setInterval(tick, WATCH_CYCLE_MS);
  }

  function _clearWatchTimer(self) {
    if (self._state && self._state.watchTimer) {
      clearInterval(self._state.watchTimer);
      self._state.watchTimer = null;
    }
  }

  function _currentWatchedZone(self) {
    return WATCH_ZONES[self._state.watchPhase];
  }

  function _onStage2Click(root, self, spot, el) {
    const watched = spot.watchZone === _currentWatchedZone(self);
    if (watched) {
      self._state.strikes += 1;
      _renderStrikes(self);
      _toast(self._el.toast2, '¡El vendedor te vio revisar ahí!');
      self._el.vendorLine.textContent = '¿Se te perdió algo entre mis cosas?';
      _flashBubble(self._el.vendorLine);
      if (self._state.strikes >= MAX_STRIKES) {
        _clearWatchTimer(self);
        self._el.overlayCaught.classList.remove('hidden');
        return;
      }
      // si es una pieza real, igual se pierde el intento: hay que volver a
      // hacer click cuando la zona esté "safe".
      return;
    }
    if (spot.isDecoy) {
      _toast(self._el.toast2, spot.hint || 'No es lo que buscas.');
      return;
    }
    _collectPiece(self, spot.id);
    _spark(el.parentElement, spot.x, spot.y);
    el.classList.add('found');
    el.replaceWith(el.cloneNode(false));
    _toast(self._el.toast2, `Conseguiste: ${_pieceName(spot.id)}`);
    _checkStage2Complete(root, self);
  }

  function _renderStrikes(self) {
    const el = self._el.strikes2;
    el.innerHTML = '';
    for (let i = 0; i < MAX_STRIKES; i++) {
      const dot = document.createElement('div');
      dot.className = 'strike-dot' + (i < self._state.strikes ? ' lost' : '');
      el.appendChild(dot);
    }
  }

  function _checkStage2Complete(root, self) {
    const need = PIECES.filter(p => p.stage === 2).every(p => self._state.found.has(p.id));
    if (need) {
      _clearWatchTimer(self);
      _showTransition(
        self,
        'Seis fragmentos, una sola maravilla',
        'Con todas las piezas reunidas, es momento de ordenarlas y devolverle su forma a los Jardines Colgantes.',
        () => _goToStage3(root, self)
      );
    }
  }

  // ---------------- ETAPA 3: RECONSTRUCCIÓN ----------------

  function _goToStage3(root, self) {
    self._state.current = STATE.STAGE3;
    _hideAllScenes(self);
    self._el.scene3.style.display = 'block';
    _renderTray3(root, self);
    _updateProgress(self);
  }

  function _renderTray3(root, self) {
    const tray = self._el.tray3;
    tray.innerHTML = '';
    PIECES.forEach(p => {
      const el = document.createElement('div');
      el.className = 'tray-piece';
      el.dataset.piece = p.id;
      el.style.backgroundImage = `url('${p.icon}')`;
      el.title = p.name;
      const placed = self._state.placedSlots && self._state.placedSlots.has(p.id);
      if (placed) el.classList.add('placed');
      el.addEventListener('pointerdown', (e) => _startDrag(root, self, e, p, el));
      tray.appendChild(el);
    });
    if (!self._state.placedSlots) self._state.placedSlots = new Set();
  }

  function _startDrag(root, self, evt, piece, sourceEl) {
    if (sourceEl.classList.contains('placed')) return;
    evt.preventDefault();
    const shadowHost = self._el.blueprintArt.getRootNode(); // ShadowRoot
    const ghost = document.createElement('div');
    ghost.className = 'drag-ghost';
    ghost.style.backgroundImage = `url('${piece.icon}')`;
    // Se agrega al mismo Shadow Root (no a document.body) para heredar los
    // estilos del componente — lección aprendida en los otros minijuegos.
    self._root.querySelector('.wrap').appendChild(ghost);

    const move = (e) => {
      const rect = self._root.host.getBoundingClientRect();
      ghost.style.left = (e.clientX - rect.left) + 'px';
      ghost.style.top = (e.clientY - rect.top) + 'px';
    };
    move(evt);
    sourceEl.classList.add('dragging');

    const up = (e) => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      ghost.remove();
      sourceEl.classList.remove('dragging');
      _dropPiece(root, self, piece, sourceEl, e);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  function _dropPiece(root, self, piece, sourceEl, evt) {
    // Tolerancia de 14 px alrededor de cada espacio (el dedo tapa y es impreciso);
    // si caen varios, gana el más cercano al punto donde se soltó.
    const MARGIN = 14;
    let landedSlot = null, best = Infinity;
    self._root.querySelectorAll('.slot').forEach(s => {
      const r = s.getBoundingClientRect();
      if (evt.clientX >= r.left - MARGIN && evt.clientX <= r.right + MARGIN &&
          evt.clientY >= r.top - MARGIN && evt.clientY <= r.bottom + MARGIN) {
        const d = Math.hypot(evt.clientX - (r.left + r.right) / 2, evt.clientY - (r.top + r.bottom) / 2);
        if (d < best) { best = d; landedSlot = s; }
      }
    });

    if (!landedSlot) return; // se soltó fuera de cualquier slot, no pasa nada

    if (landedSlot.id === piece.slot) {
      landedSlot.classList.add('filled');
      landedSlot.innerHTML = `<img src="${piece.icon}" alt="${piece.name}">`;
      sourceEl.classList.add('placed');
      self._state.placedSlots.add(piece.id);
      _toast(self._el.toast3, `${piece.name}: encaja perfectamente.`);
      _updateProgress(self);
      _checkStage3Complete(self);
    } else {
      landedSlot.animate(
        [{ transform: 'translate(-50%,-50%) scale(1)' }, { transform: 'translate(-52%,-50%) scale(1.03)' }, { transform: 'translate(-50%,-50%) scale(1)' }],
        { duration: 260 }
      );
      _toast(self._el.toast3, 'Esa pieza no va ahí.');
    }
  }

  function _updateProgress(self) {
    const total = PIECES.length;
    const placed = self._state.placedSlots ? self._state.placedSlots.size : 0;
    self._el.progressFill.style.width = Math.round((placed / total) * 100) + '%';
  }

  function _checkStage3Complete(self) {
    if (self._state.placedSlots.size === PIECES.length) {
      self._state.current = STATE.DONE;
      setTimeout(() => {
        self._el.overlayWin.classList.remove('hidden');
        requestAnimationFrame(() => self._el.revealImg.classList.add('show'));
      }, 500);
    }
  }

  // ---------------- utilidades compartidas ----------------

  function _collectPiece(self, id) {
    self._state.found.add(id);
    [self._el.tray1, self._el.tray2].forEach(tray => {
      const chip = tray.querySelector(`[data-piece="${id}"]`);
      if (chip) chip.classList.add('got');
    });
  }

  function _pieceName(id) {
    const p = PIECES.find(p => p.id === id);
    return p ? p.name : id;
  }

  // Muestra la imagen del objeto; si el archivo todavía no existe en images/,
  // usa la imagen de respaldo (así el juego es jugable mientras se crean las nuevas).
  function _setSpotImage(el, spot) {
    const main = spot.isDecoy ? spot.icon : _pieceIcon(spot.id);
    el.style.backgroundImage = `url('${main}')`;
    if (spot.isDecoy && spot.fallback && spot.fallback !== main) {
      const probe = new Image();
      probe.onerror = () => { el.style.backgroundImage = `url('${spot.fallback}')`; };
      probe.src = main;
    }
  }

  // Muestra el globo de diálogo unos segundos (en celular está oculto por defecto).
  function _flashBubble(el) {
    if (!el) return;
    const bubble = el.closest ? el.closest('.bubble') : null;
    if (!bubble) return;
    bubble.classList.add('flash');
    clearTimeout(bubble._t);
    bubble._t = setTimeout(() => bubble.classList.remove('flash'), 4200);
  }

  function _pieceIcon(id) {
    const p = PIECES.find(p => p.id === id);
    return p ? p.icon : '';
  }

  function _hideAllScenes(self) {
    self._el.scene1.style.display = 'none';
    self._el.scene2.style.display = 'none';
    self._el.scene3.style.display = 'none';
  }

  function _toast(el, msg) {
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 2200);
  }

  function _spark(container, xPct, yPct) {
    const s = document.createElement('div');
    s.className = 'spark';
    s.style.left = xPct + '%';
    s.style.top = yPct + '%';
    s.textContent = '✨';
    container.appendChild(s);
    setTimeout(() => s.remove(), 650);
  }

  function _showTransition(self, title, text, onContinue) {
    self._el.transTitle.textContent = title;
    self._el.transText.textContent = text;
    self._el.overlayTransition.classList.remove('hidden');
    self._pendingContinue = onContinue;
  }

  function _onTransitionContinue(root, self) {
    self._el.overlayTransition.classList.add('hidden');
    if (self._pendingContinue) {
      const fn = self._pendingContinue;
      self._pendingContinue = null;
      fn();
    }
  }

  function _finish(root, self) {
    self.dispatchEvent(new CustomEvent('jardin:completado', { bubbles: true, composed: true }));
    self.close();
  }

  customElements.define('jardin-puzzle', JardinPuzzle);

})();


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
