/*
 * <biblioteca-vaticana>
 * Minijuego "Biblioteca Secreta Vaticana" — Escena 33, Capítulo III.
 * Mismo espíritu que el minijuego de la Biblioteca de Atenas (epigrama-puzzle):
 * criba de libros en una mesa, agrupados por criterio — aquí el criterio es
 * "de qué maravilla habla" en vez de "de qué autor es".
 *
 * 3 ETAPAS:
 *   1) Selección  — de ~18 libros, separar los que hablan de las maravillas
 *                    perdidas de los que no (se descartan).
 *   2) Agrupación — los libros seleccionados se agrupan por la maravilla
 *                    de la que hablan (2 libros por maravilla, 6 grupos).
 *   3) Deducción  — a partir de cada grupo ya formado, deducir cuál fue el
 *                    destino final real de esa maravilla (opción múltiple).
 *
 * Contrato (igual que epigrama-puzzle / vaticano-maze / ruta7-race):
 *   - Archivo COMPLETO envuelto en IIFE.
 *   - :host oculto por defecto, visible con [open].
 *   - self.open() / self.close().
 *   - Al completar la etapa 3, dispara CustomEvent('biblioteca:completado').
 */
(function () {
  'use strict';

  const WONDERS = [
    {
      id: 'zeus',
      nombre: 'Estatua de Zeus',
      lugar: 'Olimpia, Grecia',
      icon: `<svg viewBox="0 0 64 64"><path d="M32 6c-3 0-5 2-5 5 0 2 1 4 3 5l-2 6h8l-2-6c2-1 3-3 3-5 0-3-2-5-5-5z"/><path d="M20 24h24l4 8-6 2v22h-4V36h-4v20h-8V36h-4v20h-4V34l-6-2z"/></svg>`,
      libros: [
        { titulo: 'Fragmento de Pausanias', excerpt: 'Describe una imagen sedente de marfil y oro, tan alta que casi toca el techo del templo, obra de Fidias.' },
        { titulo: 'Carta de un peregrino, s. IV', excerpt: 'Menciona un edicto imperial contra los "ídolos paganos" que aún se veneraban en Olimpia.' }
      ],
      correcto: 'La Estatua de Zeus fue destruida por obispos locales.',
      decoys: [
        'La Estatua de Zeus fue trasladada a Constantinopla y allí se perdió en un incendio del palacio.',
        'La Estatua de Zeus se derrumbó por un terremoto y sus restos se dispersaron.'
      ]
    },
    {
      id: 'artemisa',
      nombre: 'Templo de Artemisa',
      lugar: 'Éfeso, Asia Menor',
      icon: `<svg viewBox="0 0 64 64"><path d="M10 54h44v4H10zM14 50l4-2v-22h4V26h4v22h4V24h4v24h4V26h4v22h4V28h4v20l4 2H14z"/><path d="M32 6l-14 10h28z"/></svg>`,
      libros: [
        { titulo: 'Registro de un arquitecto bizantino', excerpt: 'La columnata del templo aún se usaba como cantera de mármol para nuevas iglesias.' },
        { titulo: 'Homilía de un obispo de Éfeso', excerpt: 'Condena los ritos "idólatras" que todavía se celebraban junto a las ruinas del templo.' }
      ],
      correcto: 'El Templo de Artemisa fue quemado por cristianos.',
      decoys: [
        'El Templo de Artemisa fue destruido por invasores godos y nunca reconstruido.',
        'El Templo de Artemisa se hundió lentamente en el pantano sobre el que fue construido.'
      ]
    },
    {
      id: 'coloso',
      nombre: 'Coloso de Rodas',
      lugar: 'Rodas, Grecia',
      icon: `<svg viewBox="0 0 64 64"><circle cx="32" cy="12" r="6"/><path d="M32 18v14M14 58l16-26M50 58L34 32M20 58l12-18M44 58L32 40"/></svg>`,
      libros: [
        { titulo: 'Inventario de un comerciante sirio', excerpt: '"Bronce de estatua antigua, vendido por peso, origen Rodas."' },
        { titulo: 'Crónica árabe', excerpt: 'Menciona setecientos camellos necesarios para transportar el metal fundido.' }
      ],
      correcto: 'El Coloso fue desmantelado y vendido como metal.',
      decoys: [
        'El Coloso permaneció en pie, oculto bajo escombros, hasta la actualidad.',
        'El Coloso fue fundido para acuñar monedas del imperio bizantino.'
      ]
    },
    {
      id: 'mausoleo',
      nombre: 'Mausoleo de Halicarnaso',
      lugar: 'Halicarnaso, Caria',
      icon: `<svg viewBox="0 0 64 64"><path d="M12 56h40v-4H12zM16 50h32V30H16zM20 30V16h24v14M26 16V10h12v6M28 30v20M36 30v20"/></svg>`,
      libros: [
        { titulo: 'Informe de los Caballeros de San Juan', excerpt: 'Reutilizan bloques de mármol tallado del monumento para fortificar su castillo.' },
        { titulo: 'Diario de un viajero veneciano', excerpt: 'Describe relieves de la Amazonomaquia arrancados de la tumba del rey Mausolo, en Halicarnaso, antes de perderse entre canteras y fortalezas.' }
      ],
      correcto: 'El Mausoleo fue saqueado por cruzados.',
      decoys: [
        'El Mausoleo colapsó por un terremoto y sus piedras se hundieron en el mar.',
        'El Mausoleo fue convertido en iglesia cristiana y sigue en pie.'
      ]
    },
    {
      id: 'jardines',
      nombre: 'Jardines Colgantes',
      lugar: 'Babilonia',
      icon: `<svg viewBox="0 0 64 64"><path d="M10 56h44M14 56V44h36v12M18 44V34h28v10M22 34V26h20v8"/><path d="M20 26c0-4 3-6 6-6s6 2 6-2 3-6 6-6 6 3 6 7"/></svg>`,
      libros: [
        { titulo: 'Tablilla cuneiforme incompleta', excerpt: 'Menciona terrazas regadas por un mecanismo de tornillo.' },
        { titulo: 'Relato de un cronista persa', excerpt: 'Describe la ciudad "ya sin verdor, solo polvo y muros caídos" tras una conquista.' }
      ],
      correcto: 'Los Jardines fueron arrasados por invasores cristianos.',
      decoys: [
        'Los Jardines se secaron lentamente cuando el río cambió su curso.',
        'Los Jardines nunca existieron: fueron una leyenda tardía sin base arqueológica.'
      ]
    },
    {
      id: 'faro',
      nombre: 'Faro de Alejandría',
      lugar: 'Alejandría, Egipto',
      icon: `<svg viewBox="0 0 64 64"><path d="M24 58h16l-2-38h-12zM22 20h20l-2-6H24zM26 14h12l-1-5H27z"/><path d="M14 26l8-4M50 26l-8-4" stroke-dasharray="2 2"/></svg>`,
      libros: [
        { titulo: 'Bitácora de un navegante árabe', excerpt: 'Describe la torre ya inclinada, con la parte superior derrumbada.' },
        { titulo: 'Registro de un cadí de El Cairo, s. XIV', excerpt: 'Ordena usar las piedras caídas para construir una fortaleza.' }
      ],
      correcto: 'El Faro fue abandonado tras la islamización y destruido por terremotos.',
      decoys: [
        'El Faro fue destruido deliberadamente por una flota enemiga.',
        'El Faro se apagó cuando el aceite dejó de llegar por la guerra, pero la torre sigue intacta bajo el mar.'
      ]
    }
  ];

  const DECOY_BOOKS = [
    { titulo: 'Tratado sobre el cultivo de la vid', autor: 'Anónimo, Galia romana' },
    { titulo: 'Correspondencia sobre el cobro de diezmos', autor: 'Un obispo provincial' },
    { titulo: 'Crónica de una epidemia en Constantinopla', autor: 'Año 542' },
    { titulo: 'Compendio de derecho canónico sobre el ayuno', autor: 'Concilio menor' },
    { titulo: 'Vida de un santo local', autor: 'Milagros y reliquias menores' },
    { titulo: 'Registro de impuestos aduaneros', autor: 'Puerto de Ostia' }
  ];

  // Categoría especial: un manuscrito habla de una maravilla, pero de
  // ninguna de las 6 conocidas. Es relevante (etapa 1), pero no encaja en
  // ningún grupo (etapa 2) — se aparta en un séptimo casillero "Sin
  // identificar" y queda como misterio abierto en la etapa 3, conectando
  // con "Eso... no debería estar ahí" y con el manuscrito de la Escena 34.
  const UNKNOWN_WONDER_BOOK = {
    titulo: 'Fragmento anónimo, sin sello ni firma',
    excerpt: 'Habla de una "maravilla sin nombre", al otro lado del mundo, guardada por hielo y silencio. No hay templo, no hay estatua — solo una luz.'
  };

  const BASE_CSS = `
    :host {
      all: initial; position: absolute; inset: 0; z-index: 5; display: none;
      font-family: 'EB Garamond', Georgia, serif;
    }
    :host([open]) { display: block; }
    * { box-sizing: border-box; }
    .wrap {
      position: absolute; inset: 0;
      background:
        radial-gradient(ellipse at 50% 0%, rgba(90,70,30,.35), transparent 60%),
        linear-gradient(180deg, #241933 0%, #150f22 55%, #0c0916 100%);
      color: #f1e6c8; overflow: hidden; display: flex; flex-direction: column;
    }
    .close-btn {
      position: absolute; top: 14px; right: 16px; z-index: 20;
      background: rgba(0,0,0,.4); color: #f1e6c8; border: 1px solid #6b5a3a;
      border-radius: 50%; width: 34px; height: 34px; font-size: 18px; cursor: pointer; line-height: 1;
    }
    .close-btn.hidden { display: none; }
    .hud { flex: 0 0 auto; padding: 16px 28px 8px; text-align: center; }
    .hud h1 { margin: 0 0 2px; font-size: clamp(19px,2.6vw,27px); letter-spacing: .05em; color: #e7c873; text-shadow: 0 0 14px rgba(231,200,115,.35); }
    .hud .stage-label { margin: 0 0 4px; font-size: 13px; letter-spacing: .12em; text-transform: uppercase; color: #c9b98a; }
    .hud .sub { margin: 0; font-size: 13.5px; opacity: .85; }
    .stepper { display: flex; justify-content: center; gap: 18px; margin: 8px 0 2px; }
    .stepper .step { font-size: 11px; letter-spacing: .06em; opacity: .45; padding-bottom: 4px; border-bottom: 2px solid transparent; }
    .stepper .step.active { opacity: 1; color: #e7c873; border-color: #e7c873; }
    .stepper .step.done { opacity: .8; color: #6fbf73; }

    .board { flex: 1 1 auto; position: relative; min-height: 0; padding: 8px 26px 22px; overflow: hidden; }
    .board-inner { position: relative; width: 100%; height: 100%; display: grid; grid-template-columns: 1fr 260px; gap: 16px; }
    .board-inner.full { grid-template-columns: 1fr; overflow-y: auto; padding-right: 4px; }
    @media (max-width: 760px) { .board-inner { grid-template-columns: 1fr; } }

    .mesa { position: relative; border: 1px solid rgba(231,200,115,.25); border-radius: 10px; background: rgba(0,0,0,.18); overflow: hidden; }
    .zones { display: flex; flex-direction: column; gap: 12px; overflow-y: auto; padding-right: 2px; }
    .zone {
      border: 1.5px dashed rgba(231,200,115,.45); border-radius: 8px; padding: 10px 12px;
      min-height: 90px; display: flex; flex-direction: column; gap: 4px; transition: background .15s, border-color .15s;
    }
    .zone .ztitle { font-weight: 600; color: #e7c873; font-size: 13.5px; }
    .zone .zcount { font-size: 11px; opacity: .65; }
    .zone.hover { background: rgba(231,200,115,.12); border-color: #e7c873; }
    .zone.wrong { background: rgba(200,60,50,.18); border-color: #c85a4a; }
    .zone.full { border-style: solid; }

    .folder {
      position: relative; border: 1.5px dashed rgba(231,200,115,.45); border-radius: 8px;
      padding: 8px 10px 8px 44px; min-height: 58px; display: flex; align-items: center;
      font-size: 13px; line-height: 1.25; transition: background .15s, border-color .15s;
    }
    .folder .ficon { position: absolute; left: 8px; top: 10px; width: 26px; height: 26px; opacity: .55; }
    .folder .ficon svg { width: 100%; height: 100%; fill: none; stroke: #e7c873; stroke-width: 3; }
    .folder .fname { font-weight: 600; color: #e7c873; display: block; }
    .folder .fplace { font-size: 11px; opacity: .7; font-style: italic; }
    .folder .fcount { font-size: 11px; opacity: .7; margin-top: 2px; }
    .folder.hover { background: rgba(231,200,115,.12); border-color: #e7c873; }
    .folder.wrong { background: rgba(200,60,50,.18); border-color: #c85a4a; }
    .folder.full { border-style: solid; border-color: #6fbf73; background: rgba(111,191,115,.10); }
    .folder.unknown { border-color: rgba(183,164,230,.55); }
    .folder.unknown .fname { color: #b7a4e6; }
    .folder.unknown .ficon svg { stroke: #b7a4e6; }
    .folder.unknown.full { border-color: #6fbf73; }

    .mystery-card {
      border: 1px dashed rgba(183,164,230,.55); border-radius: 10px; padding: 14px 16px; margin-bottom: 16px;
      background: rgba(36,26,58,.35);
    }
    .mystery-card .dhead { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
    .mystery-card .qmark {
      width: 30px; height: 30px; flex: 0 0 auto; border-radius: 50%;
      border: 1.5px solid #b7a4e6; color: #b7a4e6; display: flex; align-items: center;
      justify-content: center; font-weight: 700; font-size: 15px;
    }
    .mystery-card h3 { margin: 0; font-size: 15px; color: #b7a4e6; }
    .mystery-card p { margin: 0; font-size: 12.5px; line-height: 1.5; opacity: .85; font-style: italic; }

    .card {
      position: absolute; width: 168px; padding: 12px 12px 12px 24px;
      border-radius: 2px 5px 5px 2px;
      background: linear-gradient(160deg, #efe0b8, #e2d0a0); color: #2c2210;
      box-shadow: 2px 3px 8px rgba(0,0,0,.45), inset 0 0 0 1px rgba(120,90,40,.3);
      cursor: grab; font-size: 12px; line-height: 1.3;
      user-select: none; touch-action: none; transform: rotate(var(--rot, 0deg)); transition: box-shadow .15s;
    }
    .card::before {
      /* lomo del libro */
      content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 13px;
      background: linear-gradient(180deg, #6b4a2f, #3f2717);
      border-radius: 2px 0 0 2px;
      box-shadow: inset -2px 0 3px rgba(0,0,0,.5), inset 1px 0 0 rgba(255,255,255,.1);
    }
    .card::after {
      /* canto de páginas */
      content: ''; position: absolute; right: -3px; top: 3px; bottom: 3px; width: 3px;
      background: repeating-linear-gradient(180deg, #fff8e6 0, #fff8e6 2px, #d9c896 2px, #d9c896 3px);
      border-radius: 0 2px 2px 0;
      box-shadow: 1px 0 2px rgba(0,0,0,.2);
    }
    .card:active { cursor: grabbing; box-shadow: 3px 5px 14px rgba(0,0,0,.55), inset 0 0 0 1px rgba(120,90,40,.3); }
    .card .tag { display: block; font-size: 9.5px; letter-spacing: .06em; text-transform: uppercase; opacity: .55; margin-bottom: 3px; }
    .card .titulo { font-weight: 700; display: block; margin-bottom: 2px; }
    .card.dragging { z-index: 50; transition: none; }
    .card.placed { pointer-events: none; opacity: 0; }
    .card.returning { transition: left .35s ease, top .35s ease; }
    .card.unknown::before { background: linear-gradient(180deg, #241a3a, #120c1f); }
    .card.unknown { box-shadow: 2px 3px 8px rgba(0,0,0,.5), inset 0 0 0 1px rgba(150,120,230,.35); }
    .card.unknown .tag { color: #b7a4e6; opacity: .8; }

    .dossier {
      border: 1px solid rgba(231,200,115,.3); border-radius: 10px; padding: 14px 16px; margin-bottom: 14px;
      background: rgba(0,0,0,.22);
    }
    .dossier.solved { border-color: #6fbf73; background: rgba(111,191,115,.08); }
    .dossier .dhead { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
    .dossier .dicon { width: 30px; height: 30px; flex: 0 0 auto; }
    .dossier .dicon svg { width: 100%; height: 100%; fill: none; stroke: #e7c873; stroke-width: 3; }
    .dossier h3 { margin: 0; font-size: 16px; color: #e7c873; }
    .dossier .dplace { font-size: 11.5px; opacity: .7; font-style: italic; }
    .dossier .clues { display: flex; flex-direction: column; gap: 4px; margin: 6px 0 10px; }
    .dossier .clue { font-size: 12px; opacity: .85; padding-left: 10px; border-left: 2px solid rgba(231,200,115,.35); }
    .dossier .clue b { color: #d8c48f; font-weight: 600; }
    .dossier .options { display: flex; flex-direction: column; gap: 6px; }
    .opt-btn {
      text-align: left; font-family: inherit; font-size: 12.5px; line-height: 1.3;
      padding: 8px 10px; border-radius: 6px; border: 1px solid rgba(231,200,115,.35);
      background: rgba(255,255,255,.03); color: #f1e6c8; cursor: pointer; transition: background .15s, border-color .15s;
    }
    .opt-btn:hover { background: rgba(231,200,115,.1); }
    .opt-btn.correct { background: rgba(111,191,115,.22); border-color: #6fbf73; }
    .opt-btn.wrong-pick { background: rgba(200,60,50,.22); border-color: #c85a4a; }
    .dossier.solved .opt-btn:not(.correct) { display: none; }
    .dossier.solved .opt-btn.correct { cursor: default; }

    .intro, .victory { position: absolute; inset: 0; z-index: 15; background: rgba(10,7,16,.94); display: flex; align-items: center; justify-content: center; text-align: center; padding: 30px; }
    .intro .box, .victory .box { max-width: 540px; }
    .intro h2, .victory h2 { color: #e7c873; font-size: clamp(20px,3vw,28px); margin: 0 0 14px; letter-spacing: .04em; }
    .intro p, .victory p { font-size: 15px; line-height: 1.6; opacity: .9; margin: 0 0 10px; }
    .intro ol { text-align: left; font-size: 14px; line-height: 1.6; opacity: .9; margin: 12px 0; padding-left: 22px; }
    .btn { margin-top: 14px; padding: 11px 26px; border-radius: 999px; border: 1px solid #e7c873; background: transparent; color: #e7c873; font-family: inherit; font-size: 14px; letter-spacing: .05em; cursor: pointer; transition: background .15s, color .15s; }
    .btn:hover { background: #e7c873; color: #201535; }
    .hidden { display: none !important; }
  `;

  const TEMPLATE = `
    <style>${BASE_CSS}</style>
    <div class="wrap">
      <button class="close-btn" data-close>✕</button>

      <div class="intro">
        <div class="box">
          <h2>Biblioteca Secreta Vaticana</h2>
          <p>Marcus abre, a regañadientes, los anaqueles que nadie fuera de Roma ha visto.</p>
          <ol>
            <li><b>Selección</b> — separa los libros que hablan de las maravillas perdidas del resto.</li>
            <li><b>Agrupación</b> — reúne cada libro con la maravilla de la que trata.</li>
            <li><b>Deducción</b> — con esos libros, determina qué fue lo que realmente ocurrió con cada una.</li>
          </ol>
          <button class="btn" data-start>Entrar a la biblioteca</button>
        </div>
      </div>

      <div class="victory hidden">
        <div class="box">
          <h2>Seis maravillas, seis silencios rotos</h2>
          <p>“Una luz en el sur preservará lo que el norte destruye.”</p>
          <p style="font-size:13px;opacity:.7;">— nota marginal, mano desconocida</p>
          <button class="btn" data-continue>Continuar</button>
        </div>
      </div>

      <div class="hud">
        <h1>Biblioteca Secreta Vaticana</h1>
        <p class="stage-label" data-stage-label></p>
        <div class="stepper">
          <span class="step" data-step="1">1 · Selección</span>
          <span class="step" data-step="2">2 · Agrupación</span>
          <span class="step" data-step="3">3 · Deducción</span>
        </div>
        <p class="sub" data-sub></p>
      </div>

      <div class="board"><div class="board-inner" data-board></div></div>
    </div>
  `;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function _build(root, self) {
    root.innerHTML = TEMPLATE;

    const wrap = root.querySelector('.wrap');
    const introEl = root.querySelector('.intro');
    const victoryEl = root.querySelector('.victory');
    const closeBtn = root.querySelector('[data-close]');
    const boardEl = root.querySelector('[data-board]');
    const stageLabelEl = root.querySelector('[data-stage-label]');
    const subEl = root.querySelector('[data-sub]');
    const stepEls = root.querySelectorAll('.step');

    let dragging = null;

    function setStepper(n) {
      stepEls.forEach((el) => {
        const s = Number(el.dataset.step);
        el.classList.toggle('active', s === n);
        el.classList.toggle('done', s < n);
      });
    }

    // ---- Drag & drop genérico por geometría (Shadow DOM: no elementFromPoint) ----
    function bindDrag(card, mesaEl, zonesEl, resolveDrop) {
      card.addEventListener('pointerdown', (ev) => {
        if (card.classList.contains('placed')) return;
        ev.preventDefault();
        card.setPointerCapture && card.setPointerCapture(ev.pointerId);
        const cRect = card.getBoundingClientRect();
        dragging = { card, offX: ev.clientX - cRect.left, offY: ev.clientY - cRect.top };
        card.classList.add('dragging');
        card.classList.remove('returning');
        card.style.position = 'fixed';
        card.style.left = cRect.left + 'px';
        card.style.top = cRect.top + 'px';
        card.style.width = cRect.width + 'px';
      });

      card.addEventListener('pointermove', (ev) => {
        if (!dragging || dragging.card !== card) return;
        card.style.left = (ev.clientX - dragging.offX) + 'px';
        card.style.top = (ev.clientY - dragging.offY) + 'px';
        clearHover(zonesEl);
        const z = findZone(zonesEl, ev.clientX, ev.clientY);
        if (z && !z.classList.contains('full')) z.classList.add('hover');
      });

      card.addEventListener('pointerup', (ev) => {
        if (!dragging || dragging.card !== card) return;
        const zone = findZone(zonesEl, ev.clientX, ev.clientY);
        clearHover(zonesEl);
        card.classList.remove('dragging');
        if (zone) {
          resolveDrop(card, zone);
        } else {
          returnCard(card, mesaEl);
        }
        dragging = null;
      });

      card.addEventListener('pointercancel', () => {
        if (dragging && dragging.card === card) { returnCard(card, mesaEl); dragging = null; }
      });
    }

    function findZone(zonesEl, x, y) {
      const zones = zonesEl.querySelectorAll('[data-zone], [data-wonder]');
      for (const z of zones) {
        const r = z.getBoundingClientRect();
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return z;
      }
      return null;
    }

    function clearHover(zonesEl) {
      zonesEl.querySelectorAll('.hover').forEach((z) => z.classList.remove('hover'));
    }

    function returnCard(card, mesaEl) {
      card.classList.add('returning');
      card.style.position = 'absolute';
      card.style.left = card.dataset.baseLeft || '14px';
      card.style.top = card.dataset.baseTop || '14px';
      card.style.width = '168px';
      let done = false;
      const finish = () => { if (done) return; done = true; card.classList.remove('returning'); };
      card.addEventListener('transitionend', finish, { once: true });
      setTimeout(finish, 450);
    }

    function flashWrong(zone) {
      zone.classList.add('wrong');
      setTimeout(() => zone.classList.remove('wrong'), 380);
    }

    function lockCard(card, targetRect) {
      card.style.transition = 'left .25s ease, top .25s ease, opacity .25s ease .1s';
      card.style.left = (targetRect.left + 6) + 'px';
      card.style.top = (targetRect.top + 4) + 'px';
      let done = false;
      const finish = () => { if (done) return; done = true; card.classList.add('placed'); };
      card.addEventListener('transitionend', finish, { once: true });
      setTimeout(finish, 500);
    }

    function layoutCards(mesaEl, cardEls) {
      const rect = mesaEl.getBoundingClientRect();
      const cardW = 168, cardH = 84;
      const cols = Math.max(1, Math.floor((rect.width - 20) / (cardW + 12)));
      cardEls.forEach((card, i) => {
        if (card.classList.contains('placed')) return;
        const col = i % cols, row = Math.floor(i / cols);
        const jx = Math.random() * 8 - 4, jy = Math.random() * 8 - 4;
        const left = 12 + col * (cardW + 12) + jx;
        const top = 12 + row * (cardH + 14) + jy;
        card.style.left = Math.max(6, Math.min(rect.width - cardW - 6, left)) + 'px';
        card.style.top = Math.max(6, top) + 'px';
        card.style.setProperty('--rot', (Math.random() * 6 - 3) + 'deg');
        card.dataset.baseLeft = card.style.left;
        card.dataset.baseTop = card.style.top;
      });
    }

    // ================= ETAPA 1: Selección =================
    function renderStage1() {
      setStepper(1);
      stageLabelEl.textContent = 'Etapa 1 · Selección de fuentes';
      subEl.textContent = 'Arrastra cada libro a "Relevante para las maravillas" o a "Descartar".';
      boardEl.className = 'board-inner';
      const relTarget = WONDERS.length * 2 + 1; // 12 libros de maravillas + 1 desconocido
      const desTarget = DECOY_BOOKS.length;
      boardEl.innerHTML = `
        <div class="mesa" data-mesa></div>
        <div class="zones" data-zones>
          <div class="zone" data-zone="relevante"><span class="ztitle">Relevante para las maravillas</span><span class="zcount" data-zcount="relevante">0 / ${relTarget}</span></div>
          <div class="zone" data-zone="descarte"><span class="ztitle">Descartar</span><span class="zcount" data-zcount="descarte">0 / ${desTarget}</span></div>
        </div>
      `;
      const mesaEl = boardEl.querySelector('[data-mesa]');
      const zonesEl = boardEl.querySelector('[data-zones]');
      const zRel = zonesEl.querySelector('[data-zone="relevante"]');
      const zDes = zonesEl.querySelector('[data-zone="descarte"]');
      const cntRel = zonesEl.querySelector('[data-zcount="relevante"]');
      const cntDes = zonesEl.querySelector('[data-zcount="descarte"]');

      const pool = [];
      WONDERS.forEach((w) => w.libros.forEach((libro) => pool.push({
        kind: 'wonder', wonderId: w.id, titulo: libro.titulo, excerpt: libro.excerpt
      })));
      pool.push({ kind: 'unknown', wonderId: 'unknown', titulo: UNKNOWN_WONDER_BOOK.titulo, excerpt: UNKNOWN_WONDER_BOOK.excerpt });
      DECOY_BOOKS.forEach((d) => pool.push({ kind: 'decoy', titulo: d.titulo, excerpt: d.autor }));
      const order = shuffle(pool);

      const cardEls = [];
      let doneRel = 0, doneDes = 0;

      order.forEach((book) => {
        const card = document.createElement('div');
        card.className = 'card' + (book.kind === 'unknown' ? ' unknown' : '');
        card.dataset.kind = book.kind;
        if (book.wonderId) card.dataset.wonder = book.wonderId;
        const tag = book.kind === 'unknown' ? 'Fragmento sin sello' : 'Manuscrito';
        card.innerHTML = `<span class="tag">${tag}</span><span class="titulo">${book.titulo}</span>${book.excerpt}`;
        mesaEl.appendChild(card);
        cardEls.push(card);

        bindDrag(card, mesaEl, zonesEl, (c, zone) => {
          const isRelevantZone = zone.dataset.zone === 'relevante';
          const isRelevantBook = c.dataset.kind !== 'decoy';
          const correct = isRelevantZone === isRelevantBook;
          if (!correct) { flashWrong(zone); returnCard(c, mesaEl); return; }
          const r = zone.getBoundingClientRect();
          lockCard(c, r);
          if (isRelevantZone) { doneRel++; cntRel.textContent = doneRel + ' / ' + relTarget; if (doneRel === relTarget) zRel.classList.add('full'); }
          else { doneDes++; cntDes.textContent = doneDes + ' / ' + desTarget; if (doneDes === desTarget) zDes.classList.add('full'); }
          checkStage1Done();
        });
      });

      requestAnimationFrame(() => layoutCards(mesaEl, cardEls));

      function checkStage1Done() {
        if (doneRel === relTarget && doneDes === desTarget) {
          setTimeout(renderStage2, 650);
        }
      }
    }

    // ================= ETAPA 2: Agrupación =================
    function renderStage2() {
      setStepper(2);
      stageLabelEl.textContent = 'Etapa 2 · Agrupación por maravilla';
      subEl.textContent = 'Arrastra cada libro seleccionado a la maravilla de la que habla.';
      boardEl.className = 'board-inner';
      boardEl.innerHTML = `<div class="mesa" data-mesa></div><div class="zones" data-zones></div>`;
      const mesaEl = boardEl.querySelector('[data-mesa]');
      const zonesEl = boardEl.querySelector('[data-zones]');

      const counts = {};
      const maxCounts = { unknown: 1 };
      WONDERS.forEach((w) => {
        counts[w.id] = 0;
        maxCounts[w.id] = 2;
        const folder = document.createElement('div');
        folder.className = 'folder';
        folder.dataset.wonder = w.id;
        folder.innerHTML = `
          <span class="ficon">${w.icon}</span>
          <span class="fname">${w.nombre}</span>
          <span class="fplace">${w.lugar}</span>
          <span class="fcount" data-fcount>0 / 2</span>
        `;
        zonesEl.appendChild(folder);
      });

      // Séptimo casillero: el fragmento no encaja en ninguna maravilla conocida.
      counts.unknown = 0;
      const unknownFolder = document.createElement('div');
      unknownFolder.className = 'folder unknown';
      unknownFolder.dataset.wonder = 'unknown';
      unknownFolder.innerHTML = `
        <span class="ficon"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="22"/><path d="M26 24a6 6 0 1 1 8 5c-2 1-3 3-3 5v2M31 42h1"/></svg></span>
        <span class="fname">Sin identificar</span>
        <span class="fplace">No coincide con ninguna maravilla conocida</span>
        <span class="fcount" data-fcount>0 / 1</span>
      `;
      zonesEl.appendChild(unknownFolder);

      const pool = [];
      WONDERS.forEach((w) => w.libros.forEach((libro) => pool.push({
        wonderId: w.id, titulo: libro.titulo, excerpt: libro.excerpt
      })));
      pool.push({ wonderId: 'unknown', titulo: UNKNOWN_WONDER_BOOK.titulo, excerpt: UNKNOWN_WONDER_BOOK.excerpt, unknown: true });
      const order = shuffle(pool);
      const cardEls = [];
      let totalDone = 0;

      order.forEach((book) => {
        const card = document.createElement('div');
        card.className = 'card' + (book.unknown ? ' unknown' : '');
        card.dataset.wonder = book.wonderId;
        const tag = book.unknown ? 'Fragmento sin sello' : 'Manuscrito';
        card.innerHTML = `<span class="tag">${tag}</span><span class="titulo">${book.titulo}</span>${book.excerpt}`;
        mesaEl.appendChild(card);
        cardEls.push(card);

        bindDrag(card, mesaEl, zonesEl, (c, folder) => {
          const correct = folder.dataset.wonder === c.dataset.wonder;
          if (!correct) { flashWrong(folder); returnCard(c, mesaEl); return; }
          const r = folder.getBoundingClientRect();
          lockCard(c, r);
          const id = c.dataset.wonder;
          counts[id]++;
          const fcount = folder.querySelector('[data-fcount]');
          fcount.textContent = counts[id] + ' / ' + maxCounts[id];
          if (counts[id] === maxCounts[id]) folder.classList.add('full');
          totalDone++;
          if (totalDone === pool.length) setTimeout(renderStage3, 650);
        });
      });

      requestAnimationFrame(() => layoutCards(mesaEl, cardEls));
    }

    // ================= ETAPA 3: Deducción =================
    function renderStage3() {
      setStepper(3);
      stageLabelEl.textContent = 'Etapa 3 · Deducción del destino final';
      subEl.textContent = 'A partir de los libros ya agrupados, elige qué ocurrió realmente con cada maravilla.';
      boardEl.className = 'board-inner full';
      boardEl.innerHTML = '';

      const mystery = document.createElement('div');
      mystery.className = 'mystery-card';
      mystery.innerHTML = `
        <div class="dhead">
          <span class="qmark">?</span>
          <div>
            <h3>${UNKNOWN_WONDER_BOOK.titulo}</h3>
          </div>
        </div>
        <p>${UNKNOWN_WONDER_BOOK.excerpt}</p>
      `;
      boardEl.appendChild(mystery);

      let solvedCount = 0;

      WONDERS.forEach((w) => {
        const dossier = document.createElement('div');
        dossier.className = 'dossier';
        dossier.dataset.wonder = w.id;

        const cluesHtml = w.libros.map((l) => `<div class="clue"><b>${l.titulo}:</b> ${l.excerpt}</div>`).join('');
        const opciones = shuffle([w.correcto, ...w.decoys]);
        const optsHtml = opciones.map((texto) => `<button class="opt-btn" data-correct="${texto === w.correcto}">${texto}</button>`).join('');

        dossier.innerHTML = `
          <div class="dhead">
            <span class="dicon">${w.icon}</span>
            <div>
              <h3>${w.nombre}</h3>
              <span class="dplace">${w.lugar}</span>
            </div>
          </div>
          <div class="clues">${cluesHtml}</div>
          <div class="options">${optsHtml}</div>
        `;
        boardEl.appendChild(dossier);

        dossier.querySelectorAll('.opt-btn').forEach((btn) => {
          btn.addEventListener('click', () => {
            if (dossier.classList.contains('solved')) return;
            const isCorrect = btn.dataset.correct === 'true';
            if (isCorrect) {
              btn.classList.add('correct');
              dossier.classList.add('solved');
              solvedCount++;
              if (solvedCount === WONDERS.length) setTimeout(showVictory, 500);
            } else {
              btn.classList.add('wrong-pick');
              setTimeout(() => btn.classList.remove('wrong-pick'), 380);
            }
          });
        });
      });
    }

    function showVictory() {
      victoryEl.classList.remove('hidden');
    }

    // ---- Intro / cierre ----
    root.querySelector('[data-start]').addEventListener('click', () => {
      introEl.classList.add('hidden');
      renderStage1();
    });

    root.querySelector('[data-continue]').addEventListener('click', () => {
      self.dispatchEvent(new CustomEvent('biblioteca:completado', { bubbles: true, composed: true }));
      self.close();
    });

    closeBtn.addEventListener('click', () => {
      if (self.hasAttribute('mandatory')) return;
      self.close();
    });

    // Solo 'click' — nunca mouseup, o se rompe la liberación del arrastre.
    wrap.addEventListener('click', (ev) => ev.stopPropagation());

    // ---- API pública ----
    self.open = function () {
      self.setAttribute('open', '');
      closeBtn.classList.toggle('hidden', self.hasAttribute('mandatory'));
    };
    self.close = function () {
      self.removeAttribute('open');
    };
  }

  class BibliotecaVaticana extends HTMLElement {
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      const root = this.attachShadow({ mode: 'open' });
      _build(root, this);
    }
  }

  customElements.define('biblioteca-vaticana', BibliotecaVaticana);
})();
