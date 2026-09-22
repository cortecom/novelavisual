/**
 * Escena36_SaqueoSiria — "Saqueo del Archivo de Sidón"
 * Archivo único: componente <archivo-escape> (Web Component, Shadow DOM)
 * + SaqueoAction (verbo 'saqueo' para Monogatari), en el mismo IIFE.
 *
 * Minijuego de acción en 3 etapas:
 *   Etapa 1 — Sofocar el incendio: pararse sobre los focos de fuego para
 *             apagarlos (dwell time) mientras se esquivan brasas a la deriva.
 *   Etapa 2 — Recoger los fragmentos: recolectar los códices esparcidos por
 *             la sala mientras los saqueadores se acercan lentamente.
 *   Etapa 3 — Escapar por el pasillo: scroll vertical esquivando estantes
 *             caídos, fuego y saqueadores hasta la salida.
 *
 * Sigue el mismo contrato que <ruta7-race> / <rune-puzzle> y sus Actions:
 * - IIFE único: nada se filtra a `window` (lección de la colisión real
 *   epigrama/laberinto — ver claude/minijuegos-epigrama-laberinto-escenas14-32.md).
 * - :host{ all:initial; position:absolute; inset:0; z-index:5; display:none; }
 *   :host([open]) { display:block; } — oculto hasta que la Action lo abre.
 * - self.open() / self.close() — API pública que usa SaqueoAction.
 * - Evento 'saqueo:completado' en el propio elemento al terminar la etapa 3.
 * - resize() se re-ejecuta dentro de open() (el canvas mide 0×0 mientras
 *   :host está display:none — mismo bug corregido en ruta7-race v6).
 * - monogatari.registerAction() en minúscula; static id como campo;
 *   static matchString([action]); constructor con tokens desestructurados.
 *
 * Uso en script.js:  'saqueo archivoEscape'
 * Uso en index.html: <archivo-escape id="archivoEscape"></archivo-escape>
 */
(function () {
  'use strict';

  const TEMPLATE = document.createElement('template');
  TEMPLATE.innerHTML = `
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
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse at center, #241c3d 0%, #100c1f 70%, #070510 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }

      canvas {
        display: block;
        width: 100%;
        height: 100%;
        touch-action: none;
        cursor: crosshair;
      }

      .hud {
        position: absolute;
        top: 14px;
        left: 14px;
        right: 14px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        pointer-events: none;
        font-family: 'Cinzel', serif;
        color: #e9dcc3;
        text-shadow: 0 2px 6px rgba(0,0,0,.8);
      }

      .hud .stage-label {
        font-size: 15px;
        letter-spacing: .04em;
        background: rgba(20, 14, 40, .55);
        border: 1px solid #6a5acd66;
        padding: 6px 14px;
        border-radius: 4px;
      }

      .hud .hits {
        display: flex;
        gap: 6px;
        background: rgba(20, 14, 40, .55);
        border: 1px solid #d97a3466;
        padding: 6px 10px;
        border-radius: 4px;
      }
      .hud .hits .heart {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #d97a34;
        box-shadow: 0 0 6px #d97a34aa;
      }
      .hud .hits .heart.lost {
        background: transparent;
        border: 1px solid #6a5acd88;
        box-shadow: none;
      }

      .hud .objective {
        position: absolute;
        top: 46px;
        left: 0;
        font-size: 13px;
        color: #cbb9e6;
        background: rgba(20, 14, 40, .55);
        border: 1px solid #6a5acd44;
        padding: 4px 12px;
        border-radius: 4px;
      }

      .overlay {
        position: absolute;
        inset: 0;
        display: none;
        align-items: center;
        justify-content: center;
        background: rgba(8, 5, 18, .82);
        text-align: center;
        padding: 24px;
      }
      .overlay.show { display: flex; }

      .panel {
        max-width: 560px;
        color: #ecdfc4;
      }
      .panel h1 {
        font-family: 'Cinzel', serif;
        font-size: 30px;
        letter-spacing: .05em;
        color: #d97a34;
        margin: 0 0 6px;
        text-shadow: 0 0 18px #d97a3455;
      }
      .panel h2 {
        font-family: 'Cinzel', serif;
        font-size: 19px;
        letter-spacing: .04em;
        color: #cbb9e6;
        margin: 0 0 16px;
        font-weight: 400;
      }
      .panel p {
        font-size: 17px;
        line-height: 1.5;
        color: #d9cdb0;
        margin: 0 0 20px;
      }
      .panel .btn {
        font-family: 'Cinzel', serif;
        letter-spacing: .04em;
        font-size: 15px;
        color: #10081f;
        background: linear-gradient(180deg, #e2a35f, #d97a34);
        border: none;
        padding: 12px 30px;
        border-radius: 3px;
        cursor: pointer;
        box-shadow: 0 4px 14px rgba(217,122,52,.4);
        transition: transform .12s ease, box-shadow .12s ease;
      }
      .panel .btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(217,122,52,.55); }
      .panel .btn.secondary {
        background: linear-gradient(180deg, #7568b8, #5a4d9c);
        color: #efe9ff;
        margin-left: 10px;
      }

      .hint-keys {
        display: inline-flex;
        gap: 4px;
        margin-top: 4px;
      }
      .hint-keys kbd {
        font-family: 'EB Garamond', serif;
        border: 1px solid #cbb9e688;
        border-radius: 3px;
        padding: 1px 7px;
        font-size: 13px;
        color: #cbb9e6;
      }
    </style>

    <div class="wrap">
      <canvas></canvas>
      <div class="hud">
        <div>
          <div class="stage-label" data-el="stageLabel">Etapa 1 / 3</div>
          <div class="objective" data-el="objective">Sofoca los incendios</div>
        </div>
        <div class="hits" data-el="hits"></div>
      </div>

      <div class="overlay show" data-el="ov-intro">
        <div class="panel">
          <h1>Saqueo del Archivo de Sidón</h1>
          <h2 data-el="introSubtitle">Etapa 1 — Sofocar el incendio</h2>
          <p data-el="introText"></p>
          <div class="hint-keys"><kbd>&larr;</kbd><kbd>&uarr;</kbd><kbd>&rarr;</kbd><kbd>&darr;</kbd> &nbsp;o&nbsp; <kbd>WASD</kbd></div>
          <div style="margin-top:22px;">
            <button class="btn" data-el="btnStart">Comenzar</button>
          </div>
        </div>
      </div>

      <div class="overlay" data-el="ov-fail">
        <div class="panel">
          <h1>¡Alcanzado!</h1>
          <h2 data-el="failSubtitle">La etapa se reinicia</h2>
          <p data-el="failText"></p>
          <button class="btn" data-el="btnRetry">Reintentar la etapa</button>
        </div>
      </div>

      <div class="overlay" data-el="ov-victory">
        <div class="panel">
          <h1>Escapaste del Archivo</h1>
          <h2>Los fragmentos están a salvo</h2>
          <p>El equipo logra salir con los códices antes de que los saqueadores cierren el paso. Alguien más ya sabe lo que ustedes buscan.</p>
          <button class="btn" data-el="btnContinue">Continuar</button>
        </div>
      </div>
    </div>
  `;

  // ---- Constantes de mundo lógico -----------------------------------
  const LW = 800;
  const LH = 560;
  const PLAYER_R = 13;
  const MAX_HITS = 3;

  // ---- Sprites (fotos recortadas, fondo eliminado con numpy+scipy.ndimage+Pillow) ----
  const SPRITE_SRC = {
    personaje: 'assets/games/saqueo-archivo/images/personaje.png',
    saqueador: 'assets/games/saqueo-archivo/images/saqueador.png',
    fragmento: 'assets/games/saqueo-archivo/images/fragmento.png',
    estante: 'assets/games/saqueo-archivo/images/estante.png',
    brasa: 'assets/games/saqueo-archivo/images/brasa.png',
    fuego: 'assets/games/saqueo-archivo/images/fuego.png',
    bgEtapa1: 'assets/games/saqueo-archivo/images/bg-etapa1.jpg',
    bgEtapa2: 'assets/games/saqueo-archivo/images/bg-etapa2.jpg',
    bgEtapa3: 'assets/games/saqueo-archivo/images/bg-etapa3.jpg'
  };

  const SPRITES = {};
  const SPRITES_READY = {};
  Object.keys(SPRITE_SRC).forEach((key) => {
    const im = new Image();
    SPRITES_READY[key] = false;
    im.onload = () => { SPRITES_READY[key] = true; };
    im.src = SPRITE_SRC[key];
    SPRITES[key] = im;
  });

  function drawSprite(ctx, key, x, y, w, h, angle) {
    if (!SPRITES_READY[key]) return false;
    ctx.save();
    ctx.translate(x, y);
    if (angle) ctx.rotate(angle);
    ctx.drawImage(SPRITES[key], -w / 2, -h / 2, w, h);
    ctx.restore();
    return true;
  }

  // Fondo repetible del pasillo de la etapa 3: la imagen ya viene al
  // ancho exacto del canvas (LW) y se repite verticalmente como patrón,
  // desplazada según scrollY para que se sienta parte del mundo.
  let corridorPattern = null;
  let corridorPatternImg = null;
  function drawCorridorBackground(ctx2, scrollY) {
    if (!SPRITES_READY.bgEtapa3) return false;
    if (corridorPatternImg !== SPRITES.bgEtapa3) {
      corridorPattern = ctx2.createPattern(SPRITES.bgEtapa3, 'repeat');
      corridorPatternImg = SPRITES.bgEtapa3;
    }
    if (!corridorPattern) return false;
    const tileH = SPRITES.bgEtapa3.height;
    const offsetY = scrollY % tileH;
    const m = new DOMMatrix().translate(0, offsetY);
    corridorPattern.setTransform(m);
    ctx2.fillStyle = corridorPattern;
    ctx2.fillRect(0, 0, LW, LH);
    return true;
  }

  const THEME = {
    floor: '#1c1530',
    floorAlt: '#241c3d',
    wall: '#0e0a1c',
    accentFire: '#e2733a',
    accentEmber: '#ff9d52',
    accentFragment: '#e9c46a',
    accentRaider: '#8a2f2f',
    accentPlayer: '#cbb9e6',
    corridorA: '#221a3a',
    corridorB: '#2a2049',
    exit: '#e2a35f'
  };

  const STATE = {
    INTRO: 'INTRO',
    STAGE1: 'STAGE1',
    STAGE1_FAIL: 'STAGE1_FAIL',
    STAGE2: 'STAGE2',
    STAGE2_FAIL: 'STAGE2_FAIL',
    STAGE3: 'STAGE3',
    STAGE3_FAIL: 'STAGE3_FAIL',
    VICTORY: 'VICTORY'
  };

  const STAGE_META = [
    {
      key: 1,
      label: 'Etapa 1 / 3',
      objective: 'Sofoca los incendios',
      subtitle: 'Etapa 1 — Sofocar el incendio',
      intro: 'Un incendio provocado avanza entre los estantes. Muévete sobre cada foco de fuego y quédate encima un instante para sofocarlo con el extintor. Evita las brasas que saltan a la deriva: tres impactos y deberás reintentar la etapa.',
      failSubtitle: 'El fuego se descontrola',
      failText: 'Una brasa te alcanza demasiadas veces. Vuelve a intentarlo — los incendios ya sofocados no se reinician.'
    },
    {
      key: 2,
      label: 'Etapa 2 / 3',
      objective: 'Recoge los 6 fragmentos',
      subtitle: 'Etapa 2 — Recoger los fragmentos',
      intro: 'Los códices quedaron esparcidos por la sala durante el ataque. Recoge los 6 fragmentos antes de que los saqueadores te acorralen. Se acercan lentamente hacia ti — mantén la distancia.',
      failSubtitle: 'Te han rodeado',
      failText: 'Los saqueadores te alcanzan demasiadas veces. La etapa se reinicia; deberás volver a reunir los fragmentos.'
    },
    {
      key: 3,
      label: 'Etapa 3 / 3',
      objective: 'Llega a la salida',
      subtitle: 'Etapa 3 — Escapar por el pasillo',
      intro: 'Con el maletín asegurado, corres por el pasillo principal hacia la salida. Esquiva los estantes caídos, el fuego y a los saqueadores que intentan cerrarte el paso.',
      failSubtitle: 'Te cortan el paso',
      failText: 'Te alcanzan antes de llegar a la salida. Retomas el pasillo desde el punto de control de la etapa.'
    }
  ];

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function dist(ax, ay, bx, by) { return Math.hypot(ax - bx, ay - by); }
  function rand(min, max) { return min + Math.random() * (max - min); }

  class ArchivoEscape extends HTMLElement {
    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.appendChild(TEMPLATE.content.cloneNode(true));
      this._root = root;
      this._build(root, this);
    }

    // ---- API pública (usada por SaqueoAction) ------------------------
    open() {
      this.setAttribute('open', '');
      this._resetAll();
      this._resize();
      if (!this._raf) this._loop();
    }

    close() {
      this.removeAttribute('open');
    }

    // -------------------------------------------------------------------
    _build(root, self) {
      const canvas = root.querySelector('canvas');
      const ctx = canvas.getContext('2d');

      const els = {};
      root.querySelectorAll('[data-el]').forEach((n) => { els[n.dataset.el] = n; });

      const world = {
        state: STATE.INTRO,
        stageIndex: 0,
        hits: 0,
        keys: Object.create(null),
        player: { x: LW / 2, y: LH / 2, vx: 0, vy: 0, angle: 0 },
        // Etapa 1
        fires: [],
        embers: [],
        // Etapa 2
        fragments: [],
        raiders2: [],
        // Etapa 3
        scrollY: 0,
        scrollTarget: 4200,
        obstacles3: [],
        spawnTimer: 0,
        invuln: 0
      };

      function setStageChrome(meta) {
        els.stageLabel.textContent = meta.label;
        els.objective.textContent = meta.objective;
      }

      function renderHits() {
        els.hits.innerHTML = '';
        for (let i = 0; i < MAX_HITS; i++) {
          const d = document.createElement('div');
          d.className = 'heart' + (i < world.hits ? ' lost' : '');
          els.hits.appendChild(d);
        }
      }

      // ---------------- Reset / setup por etapa -------------------------
      function resetStage1() {
        world.hits = 0;
        world.player.x = LW / 2;
        world.player.y = LH - 60;
        world.player.angle = 0;
        world.fires = [];
        const spots = [
          [120, 120], [400, 90], [670, 130],
          [160, 320], [640, 330], [400, 260]
        ];
        spots.forEach(([x, y]) => world.fires.push({ x, y, r: 22, progress: 0, done: false }));
        world.embers = [];
        for (let i = 0; i < 5; i++) {
          world.embers.push(spawnEmber());
        }
        renderHits();
      }

      function spawnEmber() {
        const edge = Math.floor(rand(0, 4));
        let x, y;
        if (edge === 0) { x = 0; y = rand(0, LH); }
        else if (edge === 1) { x = LW; y = rand(0, LH); }
        else if (edge === 2) { x = rand(0, LW); y = 0; }
        else { x = rand(0, LW); y = LH; }
        const angle = rand(0, Math.PI * 2);
        return {
          x, y,
          vx: Math.cos(angle) * rand(40, 90),
          vy: Math.sin(angle) * rand(40, 90),
          r: 7,
          life: rand(3, 6)
        };
      }

      function resetStage2() {
        world.hits = 0;
        world.player.x = LW / 2;
        world.player.y = LH - 60;
        world.player.angle = 0;
        world.fragments = [];
        const spots = [
          [90, 100], [710, 100], [90, 460], [710, 460], [400, 80], [400, 480]
        ];
        spots.forEach(([x, y]) => world.fragments.push({ x, y, r: 11, collected: false }));
        world.raiders2 = [];
        // Cuadrantes bien separados de la sala para que los saqueadores
        // salgan de puntos repartidos (no agrupados en el centro), y se
        // baraja el orden para que varíen entre partidas.
        const quadrants = [
          { x: [90, 260], y: [90, 230] },   // arriba-izquierda
          { x: [540, 710], y: [90, 230] },  // arriba-derecha
          { x: [90, 260], y: [330, 470] },  // abajo-izquierda
          { x: [540, 710], y: [330, 470] }  // abajo-derecha
        ];
        const order = [0, 1, 2, 3];
        for (let i = order.length - 1; i > 0; i--) {
          const j = Math.floor(rand(0, i + 1));
          const tmp = order[i]; order[i] = order[j]; order[j] = tmp;
        }
        order.slice(0, 3).forEach((qi) => {
          const q = quadrants[qi];
          world.raiders2.push({ x: rand(q.x[0], q.x[1]), y: rand(q.y[0], q.y[1]), r: 15 });
        });
        renderHits();
      }

      function resetStage3() {
        world.hits = 0;
        world.player.x = LW / 2;
        world.player.y = LH - 90;
        world.player.angle = Math.PI; // corre hacia "arriba" del pasillo
        world.scrollY = 0;
        world.obstacles3 = [];
        world.spawnTimer = 0;
        world.invuln = 0;
        renderHits();
      }

      function _resetAll() {
        world.state = STATE.INTRO;
        world.stageIndex = 0;
        showIntro(0);
      }
      self._resetAll = _resetAll;

      function showIntro(i) {
        const meta = STAGE_META[i];
        setStageChrome(meta);
        els.introSubtitle.textContent = meta.subtitle;
        els.introText.textContent = meta.intro;
        hideAllOverlays();
        els['ov-intro'].classList.add('show');
      }

      function hideAllOverlays() {
        els['ov-intro'].classList.remove('show');
        els['ov-fail'].classList.remove('show');
        els['ov-victory'].classList.remove('show');
      }

      function startCurrentStage() {
        hideAllOverlays();
        const i = world.stageIndex;
        if (i === 0) { world.state = STATE.STAGE1; resetStage1(); }
        else if (i === 1) { world.state = STATE.STAGE2; resetStage2(); }
        else { world.state = STATE.STAGE3; resetStage3(); }
      }

      function failCurrentStage() {
        const meta = STAGE_META[world.stageIndex];
        els.failSubtitle.textContent = meta.failSubtitle;
        els.failText.textContent = meta.failText;
        hideAllOverlays();
        els['ov-fail'].classList.add('show');
        if (world.stageIndex === 0) world.state = STATE.STAGE1_FAIL;
        else if (world.stageIndex === 1) world.state = STATE.STAGE2_FAIL;
        else world.state = STATE.STAGE3_FAIL;
      }

      function advanceStage() {
        world.state = STATE.INTRO;
        world.stageIndex++;
        if (world.stageIndex >= STAGE_META.length) {
          world.state = STATE.VICTORY;
          hideAllOverlays();
          els['ov-victory'].classList.add('show');
        } else {
          showIntro(world.stageIndex);
        }
      }

      // ---------------- Input --------------------------------------------
      function keyDown(e) {
        if (!self.hasAttribute('open')) return;
        world.keys[e.key.toLowerCase()] = true;
      }
      function keyUp(e) {
        world.keys[e.key.toLowerCase()] = false;
      }
      document.addEventListener('keydown', keyDown);
      document.addEventListener('keyup', keyUp);

      function inputVector() {
        let dx = 0, dy = 0;
        if (world.keys['arrowleft'] || world.keys['a']) dx -= 1;
        if (world.keys['arrowright'] || world.keys['d']) dx += 1;
        if (world.keys['arrowup'] || world.keys['w']) dy -= 1;
        if (world.keys['arrowdown'] || world.keys['s']) dy += 1;
        const len = Math.hypot(dx, dy) || 1;
        return { dx: dx / len, dy: dy / len };
      }

      // ---------------- Update: Etapa 1 -----------------------------------
      function updateStage1(dt) {
        const { dx, dy } = inputVector();
        const speed = 210;
        world.player.x = clamp(world.player.x + dx * speed * dt, 20, LW - 20);
        world.player.y = clamp(world.player.y + dy * speed * dt, 20, LH - 20);
        if (dx !== 0 || dy !== 0) world.player.angle = Math.atan2(dy, dx) - Math.PI / 2;

        let allDone = true;
        world.fires.forEach((f) => {
          if (f.done) return;
          allDone = false;
          const d = dist(world.player.x, world.player.y, f.x, f.y);
          if (d < f.r + PLAYER_R) {
            f.progress += dt;
            if (f.progress >= 0.9) f.done = true;
          } else {
            f.progress = Math.max(0, f.progress - dt * 0.5);
          }
        });

        world.embers.forEach((em) => {
          em.x += em.vx * dt;
          em.y += em.vy * dt;
          em.life -= dt;
          if (em.x < -20 || em.x > LW + 20 || em.y < -20 || em.y > LH + 20 || em.life <= 0) {
            Object.assign(em, spawnEmber());
          }
          const d = dist(world.player.x, world.player.y, em.x, em.y);
          if (d < em.r + PLAYER_R) registerHit();
        });

        if (allDone) advanceStage();
      }

      let hitCooldown = 0;
      function registerHit() {
        if (hitCooldown > 0) return;
        hitCooldown = 1.0;
        world.hits++;
        renderHits();
        if (world.hits >= MAX_HITS) failCurrentStage();
      }

      // ---------------- Update: Etapa 2 -----------------------------------
      function updateStage2(dt) {
        const { dx, dy } = inputVector();
        const speed = 220;
        world.player.x = clamp(world.player.x + dx * speed * dt, 20, LW - 20);
        world.player.y = clamp(world.player.y + dy * speed * dt, 20, LH - 20);
        if (dx !== 0 || dy !== 0) world.player.angle = Math.atan2(dy, dx) - Math.PI / 2;

        let remaining = 0;
        world.fragments.forEach((fr) => {
          if (fr.collected) return;
          const d = dist(world.player.x, world.player.y, fr.x, fr.y);
          if (d < fr.r + PLAYER_R) fr.collected = true;
          else remaining++;
        });

        world.raiders2.forEach((r) => {
          const toPx = world.player.x - r.x;
          const toPy = world.player.y - r.y;
          const d = Math.hypot(toPx, toPy) || 1;
          const raiderSpeed = 95;
          r.x += (toPx / d) * raiderSpeed * dt;
          r.y += (toPy / d) * raiderSpeed * dt;
          if (d < r.r + PLAYER_R) registerHit();
        });

        if (remaining === 0) advanceStage();
      }

      // ---------------- Update: Etapa 3 -----------------------------------
      function updateStage3(dt) {
        const { dx } = inputVector();
        const speed = 260;
        world.player.x = clamp(world.player.x + dx * speed * dt, 60, LW - 60);

        const scrollSpeed = 230;
        world.scrollY += scrollSpeed * dt;
        const playerY = LH - 90;

        world.spawnTimer -= dt;
        if (world.spawnTimer <= 0) {
          world.spawnTimer = rand(0.55, 0.95);
          const kinds = ['estante', 'fuego', 'saqueador'];
          const kind = kinds[Math.floor(rand(0, kinds.length))];
          world.obstacles3.push({
            kind,
            x: rand(90, LW - 90),
            // El obstáculo "alinea" con el jugador cuando scrollY llega a
            // este valor; se fija por delante (aún no visible) para dar
            // tiempo a que entre desde arriba antes de llegar a la altura
            // del jugador.
            y: world.scrollY + playerY + rand(40, 240),
            r: kind === 'estante' ? 34 : kind === 'fuego' ? 20 : 16,
            vx: kind === 'saqueador' ? rand(-65, 65) : 0
          });
        }

        world.invuln = Math.max(0, world.invuln - dt);

        world.obstacles3.forEach((o) => {
          if (o.kind === 'saqueador') o.x = clamp(o.x + o.vx * dt, 70, LW - 70);
          const screenY = world.scrollY - o.y + playerY;
          if (screenY > -40 && screenY < LH + 40) {
            const d = dist(world.player.x, playerY, o.x, screenY);
            if (d < o.r + PLAYER_R && world.invuln <= 0) {
              world.invuln = 1.1;
              registerHit();
            }
          }
        });

        world.obstacles3 = world.obstacles3.filter((o) => (world.scrollY - o.y + playerY) < LH + 60);

        if (world.scrollY >= world.scrollTarget) advanceStage();
      }

      // ---------------- Render --------------------------------------------
      function drawBackgroundRoom(bgKey) {
        const drawn = drawSprite(ctx, bgKey, LW / 2, LH / 2, LW, LH, 0);
        if (!drawn) {
          ctx.fillStyle = THEME.floor;
          ctx.fillRect(0, 0, LW, LH);
          ctx.fillStyle = THEME.floorAlt;
          for (let y = 0; y < LH; y += 40) {
            for (let x = (y / 40 % 2 === 0 ? 0 : 40); x < LW; x += 80) {
              ctx.fillRect(x, y, 36, 36);
            }
          }
        }
        ctx.strokeStyle = '#0e0a1c';
        ctx.lineWidth = 18;
        ctx.strokeRect(0, 0, LW, LH);
      }

      function drawPlayer() {
        const p = world.player;
        const w = 32, h = 54;
        const drawn = drawSprite(ctx, 'personaje', p.x, p.y, w, h, p.angle || 0);
        if (drawn) return;
        // Respaldo vectorial mientras la imagen aún no termina de cargar
        ctx.save();
        ctx.shadowColor = '#00000088';
        ctx.shadowBlur = 8;
        ctx.fillStyle = THEME.accentPlayer;
        ctx.beginPath();
        ctx.arc(p.x, p.y, PLAYER_R, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#3a2f66';
        ctx.beginPath();
        ctx.arc(p.x, p.y - 4, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      function renderStage1() {
        drawBackgroundRoom('bgEtapa1');
        world.fires.forEach((f) => {
          if (f.done) {
            ctx.fillStyle = '#4a4a4a55';
            ctx.beginPath(); ctx.arc(f.x, f.y, f.r * 0.6, 0, Math.PI * 2); ctx.fill();
            return;
          }
          const pulse = 1 + Math.sin(performance.now() / 120 + f.x) * 0.06;
          const size = f.r * 2.4 * pulse;
          const drawn = drawSprite(ctx, 'fuego', f.x, f.y, size, size * 1.04, 0);
          if (!drawn) {
            ctx.save();
            ctx.shadowColor = THEME.accentFire;
            ctx.shadowBlur = 18;
            ctx.fillStyle = THEME.accentFire;
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.r * pulse, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
          if (f.progress > 0) {
            ctx.strokeStyle = '#e9dcc3';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.r + 8, -Math.PI / 2, -Math.PI / 2 + (f.progress / 0.9) * Math.PI * 2);
            ctx.stroke();
          }
        });
        world.embers.forEach((em) => {
          const drawn = drawSprite(ctx, 'brasa', em.x, em.y, 22, 30, 0);
          if (!drawn) {
            ctx.save();
            ctx.shadowColor = THEME.accentEmber;
            ctx.shadowBlur = 10;
            ctx.fillStyle = THEME.accentEmber;
            ctx.beginPath();
            ctx.arc(em.x, em.y, em.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        });
        drawPlayer();
      }

      function renderStage2() {
        drawBackgroundRoom('bgEtapa2');
        world.fragments.forEach((fr) => {
          if (fr.collected) return;
          const wobble = Math.sin(performance.now() / 400 + fr.x) * 0.15;
          const drawn = drawSprite(ctx, 'fragmento', fr.x, fr.y, 40, 35, wobble);
          if (!drawn) {
            ctx.save();
            ctx.translate(fr.x, fr.y);
            ctx.rotate(wobble);
            ctx.fillStyle = THEME.accentFragment;
            ctx.shadowColor = THEME.accentFragment;
            ctx.shadowBlur = 10;
            ctx.fillRect(-fr.r, -fr.r * 0.7, fr.r * 2, fr.r * 1.4);
            ctx.restore();
          }
        });
        world.raiders2.forEach((r) => {
          const toPx = world.player.x - r.x;
          const toPy = world.player.y - r.y;
          const angle = (toPx || toPy) ? Math.atan2(toPy, toPx) - Math.PI / 2 : 0;
          const drawn = drawSprite(ctx, 'saqueador', r.x, r.y, 34, 58, angle);
          if (!drawn) {
            ctx.save();
            ctx.fillStyle = THEME.accentRaider;
            ctx.shadowColor = '#000000aa';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        });
        drawPlayer();
      }

      function renderStage3() {
        // Corredor con scroll vertical (el fondo se desplaza hacia abajo,
        // igual que los obstáculos, para reforzar la sensación de avance)
        const playerY = LH - 90;
        const bgDrawn = drawCorridorBackground(ctx, world.scrollY);
        if (!bgDrawn) {
          ctx.fillStyle = THEME.corridorA;
          ctx.fillRect(0, 0, LW, LH);
          const tile = 90;
          const offset = world.scrollY % tile;
          ctx.fillStyle = THEME.corridorB;
          for (let y = -tile; y < LH + tile; y += tile) {
            ctx.fillRect(60, y + offset, LW - 120, tile / 2);
          }
          ctx.fillStyle = THEME.wall;
          ctx.fillRect(0, 0, 55, LH);
          ctx.fillRect(LW - 55, 0, 55, LH);
        }

        // Meta de salida: entra desde arriba y "se alcanza" cuando llega
        // a la altura del jugador (scrollY == scrollTarget)
        const exitScreenY = world.scrollY - world.scrollTarget + playerY;
        if (exitScreenY > -60 && exitScreenY < LH + 60) {
          ctx.save();
          ctx.shadowColor = THEME.exit;
          ctx.shadowBlur = 20;
          ctx.fillStyle = THEME.exit;
          ctx.fillRect(55, exitScreenY, LW - 110, 14);
          ctx.restore();
        }

        world.obstacles3.forEach((o) => {
          const screenY = world.scrollY - o.y + playerY;
          if (screenY < -40 || screenY > LH + 40) return;
          if (o.kind === 'estante') {
            const drawn = drawSprite(ctx, 'estante', o.x, screenY, 130, 66, 0);
            if (!drawn) {
              ctx.save();
              ctx.fillStyle = '#3a2f5a';
              ctx.shadowColor = '#000000aa';
              ctx.shadowBlur = 6;
              ctx.fillRect(o.x - o.r, screenY - 12, o.r * 2, 24);
              ctx.restore();
            }
          } else if (o.kind === 'fuego') {
            const size = o.r * 2.6;
            const drawn = drawSprite(ctx, 'fuego', o.x, screenY, size, size * 1.04, 0);
            if (!drawn) {
              ctx.save();
              ctx.shadowColor = THEME.accentFire;
              ctx.shadowBlur = 16;
              ctx.fillStyle = THEME.accentFire;
              ctx.beginPath();
              ctx.arc(o.x, screenY, o.r, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
          } else {
            let drawn = false;
            if (SPRITES_READY.saqueador) {
              ctx.save();
              ctx.translate(o.x, screenY);
              if (o.vx < 0) ctx.scale(-1, 1);
              ctx.drawImage(SPRITES.saqueador, -17, -29, 34, 58);
              ctx.restore();
              drawn = true;
            }
            if (!drawn) {
              ctx.save();
              ctx.shadowColor = '#000000aa';
              ctx.shadowBlur = 6;
              ctx.fillStyle = THEME.accentRaider;
              ctx.beginPath();
              ctx.arc(o.x, screenY, o.r, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
          }
        });

        drawPlayer();
      }

      // ---------------- Loop ------------------------------------------------
      let last = performance.now();
      function loop(now) {
        if (!self.hasAttribute('open')) { self._raf = null; return; }
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;

        hitCooldown = Math.max(0, hitCooldown - dt);

        if (world.state === STATE.STAGE1) { updateStage1(dt); renderStage1(); }
        else if (world.state === STATE.STAGE2) { updateStage2(dt); renderStage2(); }
        else if (world.state === STATE.STAGE3) { updateStage3(dt); renderStage3(); }
        else if (world.state === STATE.STAGE1_FAIL) { renderStage1(); }
        else if (world.state === STATE.STAGE2_FAIL) { renderStage2(); }
        else if (world.state === STATE.STAGE3_FAIL) { renderStage3(); }
        else {
          ctx.fillStyle = THEME.floor;
          ctx.fillRect(0, 0, LW, LH);
        }

        self._raf = requestAnimationFrame(loop);
      }
      self._loop = () => { last = performance.now(); self._raf = requestAnimationFrame(loop); };

      // ---------------- Resize ------------------------------------------------
      function _resize() {
        const rect = canvas.getBoundingClientRect();
        const w = Math.max(320, rect.width || 320);
        const h = Math.max(240, rect.height || 240);
        canvas.width = w;
        canvas.height = h;
        const scale = Math.min(w / LW, h / LH);
        ctx.setTransform(scale, 0, 0, scale, (w - LW * scale) / 2, (h - LH * scale) / 2);
      }
      self._resize = _resize;
      window.addEventListener('resize', _resize);

      // ---------------- Botones ------------------------------------------------
      els.btnStart.addEventListener('click', startCurrentStage);
      els.btnRetry.addEventListener('click', startCurrentStage);
      els.btnContinue.addEventListener('click', () => {
        self.dispatchEvent(new CustomEvent('saqueo:completado', { bubbles: true, composed: true }));
        self.close();
      });

      renderHits();
    }
  }

  customElements.define('archivo-escape', ArchivoEscape);

  // ------------------------------------------------------------------------
  // Action de Monogatari (verbo 'saqueo')
  // ------------------------------------------------------------------------
  class SaqueoAction extends Monogatari.Action {
    static id = 'SaqueoAction';

    static matchString([action]) {
      return action === 'saqueo';
    }

    constructor([verb, elementId]) {
      super();
      this.elementId = elementId;
      this._resolved = false;
    }

    willApply() {
      return Promise.resolve();
    }

    apply() {
      return new Promise((resolve) => {
        const el = document.getElementById(this.elementId);
        if (!el) {
          console.error(`[SaqueoAction] No se encontró el elemento #${this.elementId}`);
          resolve();
          return;
        }

        const onDone = () => {
          if (this._resolved) return;
          this._resolved = true;
          el.removeEventListener('saqueo:completado', onDone);
          resolve();
        };

        el.addEventListener('saqueo:completado', onDone);
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

  monogatari.registerAction(SaqueoAction);
})();
