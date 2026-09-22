/* ============================================================
   Minijuego — Escena 45: "El Derrumbe" (Capítulo IV)
   <derrumbe-final> — Web Component (Shadow DOM)
   Verbo Monogatari: derrumbe
   Evento final: derrumbe:completado
   3 etapas en una sola sesión:
     1) Escapar del derrumbe (esquivar rocas / grietas)
     2) Salvar a Isidora (llegar hasta ella + QTE de levantar la roca)
     3) Escapar y llegar a la cámara oculta (versión más dura de la 1,
        con Isidora como compañera visual)
   ============================================================ */

(function () {
  'use strict';

  /* ---------- imágenes (opcionales) ----------
     Se buscan en la carpeta images/ junto a este archivo. Si alguna no
     existe (o no cargó todavía), el juego sigue funcionando con las
     formas vectoriales dibujadas en canvas que ya tenía — nada se
     rompe por no tener las imágenes puestas. */
  const SCRIPT_BASE = (function () {
    var cs = document.currentScript;
    return (cs && cs.src) ? cs.src.replace(/[^/]*$/, '') : '';
  })();
  const IMAGE_FILES = {
    wall: 'images/muro.png',
    floor: 'images/piso.png',
    rock: 'images/roca.png',
    crack: 'images/grieta.png',
    player: 'images/jugador.png',
    isidora: 'images/isidora.png'
  };
  const IMAGES = {};
  Object.keys(IMAGE_FILES).forEach(function (key) {
    var img = new Image();
    img.onload = function () { IMAGES[key] = img; };
    img.onerror = function () { /* se conserva el dibujo vectorial de respaldo */ };
    img.src = SCRIPT_BASE + IMAGE_FILES[key];
  });

  /* ---------- estilos ---------- */
  const STYLES = `
    :host {
      all: initial;
      position: absolute;
      inset: 0;
      z-index: 5;
      display: none;
      font-family: 'EB Garamond', Georgia, serif;
    }
    :host([open]) { display: block; }
    * { box-sizing: border-box; }
    .root {
      position: absolute;
      inset: 0;
      background: #0b0806;
      overflow: hidden;
      color: #f2e6d0;
    }
    canvas.game-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
      touch-action: none;
    }
    .screen {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 18px;
      padding: 32px;
      text-align: center;
      background: radial-gradient(ellipse at center, rgba(20,14,10,.72) 0%, rgba(6,4,3,.92) 100%);
    }
    .screen.hidden { display: none; }
    .screen h1 {
      font-size: clamp(28px, 4.2vw, 46px);
      letter-spacing: .04em;
      color: #f4b942;
      text-shadow: 0 0 18px rgba(244,185,66,.45);
      margin: 0;
    }
    .screen h2 {
      font-size: clamp(22px, 3.2vw, 32px);
      color: #e2705a;
      margin: 0;
    }
    .screen p {
      max-width: 560px;
      font-size: clamp(15px, 1.7vw, 19px);
      line-height: 1.5;
      color: #e8dcc4;
      margin: 0;
    }
    .stage-tag {
      font-size: 13px;
      letter-spacing: .18em;
      text-transform: uppercase;
      color: #8fb8b0;
      margin: 0 0 -6px;
    }
    .btn {
      font-family: inherit;
      font-size: 17px;
      letter-spacing: .04em;
      padding: 12px 30px;
      border-radius: 3px;
      border: 1px solid #f4b942;
      background: linear-gradient(180deg, #3a2a14, #241a0c);
      color: #f4e2b0;
      cursor: pointer;
      transition: transform .15s ease, box-shadow .15s ease;
    }
    .btn:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(244,185,66,.25); }
    .btn:active { transform: translateY(0); }
    .btn.secondary { border-color: #7a5c33; color: #cbb98a; }
    .hint {
      font-size: 13px;
      color: #a89678;
      letter-spacing: .03em;
    }
  `;

  /* ---------- plantilla ---------- */
  const TEMPLATE = document.createElement('template');
  TEMPLATE.innerHTML = `
    <style>${STYLES}</style>
    <div class="root">
      <canvas class="game-canvas"></canvas>

      <div class="screen intro-screen">
        <p class="stage-tag">Escena 45 — Capítulo IV</p>
        <h1>El Derrumbe</h1>
        <p>El techo de la cámara cede. Rocas y grietas cortan el paso, e Isidora ha quedado
        atrapada más adelante. Muévete con las flechas o WASD para esquivar; en el rescate,
        haz clic repetidamente (o mantén presionado) sobre la roca para levantarla.</p>
        <button class="btn start-btn" type="button">Correr</button>
        <p class="hint">Flechas / WASD — mover · Clic — levantar la roca (etapa 2)</p>
      </div>

      <div class="screen fail-screen hidden">
        <h2 class="fail-title">Atrapado</h2>
        <p class="fail-text"></p>
        <button class="btn retry-btn" type="button">Reintentar</button>
      </div>

      <div class="screen stageclear-screen hidden">
        <p class="stage-tag stageclear-tag"></p>
        <h2 class="stageclear-title"></h2>
        <p class="stageclear-text"></p>
        <button class="btn continue-stage-btn" type="button">Continuar</button>
      </div>

      <div class="screen victory-screen hidden">
        <p class="stage-tag">La cámara oculta</p>
        <h1>La luz que esperaba</h1>
        <p>El polvo se asienta. Ante ustedes, una cámara que el derrumbe mismo acaba de
        revelar se abre en la roca — nadie la había visto en siglos.</p>
        <button class="btn victory-btn" type="button">Continuar</button>
      </div>
    </div>
  `;

  /* ---------- constantes de juego ---------- */
  const STATE = { INTRO: 'intro', RUN: 'run', RESCUE_QTE: 'rescue_qte', FAIL: 'fail', STAGE_CLEAR: 'stage_clear', VICTORY: 'victory' };
  const HP_MAX = 3;
  const PLAYER_R = 16;
  const PLAYER_SPEED = 300;
  const PLAYER_BAND_TOP = 0.42;
  const PLAYER_BAND_BOTTOM = 0.86;
  const INVULN_MS = 950;
  const TELEGRAPH_MS = 1150;
  const HAZARD_GRACE_MS = 150;
  const RUBBLE_MS = 900;
  const QTE_TIME_S = 8;
  const QTE_TARGET = 100;
  const QTE_TAP_GAIN = 9;
  const QTE_HOLD_GAIN_PER_S = 34;
  const QTE_DECAY_PER_S = 14;
  const COMPANION_LAG_FRAMES = 14;

  const OBSTACLE_R = { rock: 22, crack: 26 };

  const STAGES = [
    null,
    {
      n: 1,
      key: 'escape',
      label: 'Etapa 1 · Escapar del derrumbe',
      distance: 1900,
      scrollSpeed: 130,
      scrollAccel: 2.5,
      spawnMs: [1000, 1500],
      types: ['rock', 'rock', 'crack'],
      failTitle: 'La roca te alcanza',
      failText: 'El polvo te ciega un instante. Recupera el aliento e inténtalo de nuevo.',
      clearTitle: 'Sales al corredor principal',
      clearText: 'Delante, entre el polvo, una voz pide ayuda: Isidora ha quedado atrapada.'
    },
    {
      n: 2,
      key: 'rescue',
      label: 'Etapa 2 · Salvar a Isidora',
      distance: 800,
      scrollSpeed: 100,
      scrollAccel: 1.5,
      spawnMs: [1050, 1500],
      types: ['rock'],
      failTitle: 'No llegaste a tiempo',
      failText: 'Otra roca cae demasiado cerca de Isidora. Vuelve a intentarlo.',
      clearTitle: '¡La levantaste!',
      clearText: 'Isidora se pone de pie, agradecida. Ahora corre a tu lado, hacia la salida.'
    },
    {
      n: 3,
      key: 'final',
      label: 'Etapa 3 · Llegar a la cámara oculta',
      distance: 2300,
      scrollSpeed: 155,
      scrollAccel: 3.5,
      spawnMs: [780, 1150],
      types: ['rock', 'crack', 'rock'],
      failTitle: 'El paso se cierra',
      failText: 'Una grieta se abre bajo tus pies. Retrocede e inténtalo de nuevo.',
      clearTitle: '',
      clearText: ''
    }
  ];

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function circlesHit(ax, ay, ar, bx, by, br) {
    const dx = ax - bx, dy = ay - by;
    const r = ar + br;
    return (dx * dx + dy * dy) < (r * r);
  }

  /* ---------- construcción del componente ---------- */
  function _build(root, self) {
    const canvas = root.querySelector('.game-canvas');
    const ctx = canvas.getContext('2d');

    const introScreen = root.querySelector('.intro-screen');
    const failScreen = root.querySelector('.fail-screen');
    const failTitleEl = root.querySelector('.fail-title');
    const failTextEl = root.querySelector('.fail-text');
    const stageClearScreen = root.querySelector('.stageclear-screen');
    const stageClearTag = root.querySelector('.stageclear-tag');
    const stageClearTitle = root.querySelector('.stageclear-title');
    const stageClearText = root.querySelector('.stageclear-text');
    const victoryScreen = root.querySelector('.victory-screen');
    const startBtn = root.querySelector('.start-btn');
    const retryBtn = root.querySelector('.retry-btn');
    const continueStageBtn = root.querySelector('.continue-stage-btn');
    const victoryBtn = root.querySelector('.victory-btn');

    let W = 480, H = 640;
    let floorPattern = null, floorPatternImg = null;
    let wallPattern = null, wallPatternImg = null;
    let state = STATE.INTRO;
    let stageIdx = 1;
    let cfg = STAGES[1];

    let worldY = 0;
    let scrollSpeed = 0;
    let elapsed = 0;
    let hp = HP_MAX;
    let hitsThisStage = 0;
    let stage1Hits = 0;
    let invulnUntil = 0;
    let shakeUntil = 0;
    let nextSpawnAt = 0;

    let player = { x: 0.5, vx: 0 };
    let posHistory = [];
    let isidoraRescued = false;
    let isidoraTargetY = 0;
    let isidoraFreed = false;

    let obstacles = []; // {type, lane(0..1), spawnAt, r, seed}
    let dust = [];

    let qteProgress = 0;
    let qteTimeLeft = QTE_TIME_S;
    let qteHolding = false;

    const keys = Object.create(null);

    function resize() {
      const rect = root.host.getBoundingClientRect
        ? root.host.getBoundingClientRect()
        : canvas.parentElement.getBoundingClientRect();
      W = Math.max(320, Math.round(rect.width || 320));
      H = Math.max(320, Math.round(rect.height || 480));
      const dpr = window.devicePixelRatio || 1;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function showScreen(el) {
      [introScreen, failScreen, stageClearScreen, victoryScreen].forEach((s) => {
        s.classList.toggle('hidden', s !== el);
      });
    }
    function hideAllScreens() {
      [introScreen, failScreen, stageClearScreen, victoryScreen].forEach((s) => s.classList.add('hidden'));
    }

    function resetStageRuntime() {
      cfg = STAGES[stageIdx];
      worldY = 0;
      scrollSpeed = cfg.scrollSpeed;
      hp = HP_MAX;
      hitsThisStage = 0;
      invulnUntil = 0;
      shakeUntil = 0;
      obstacles = [];
      dust = [];
      posHistory = [];
      player.x = 0.5;
      player.vx = 0;
      nextSpawnAt = performance.now() + rand(cfg.spawnMs[0], cfg.spawnMs[1]);
      if (stageIdx === 2) {
        isidoraFreed = false;
        qteProgress = 0;
        qteTimeLeft = QTE_TIME_S;
        qteHolding = false;
      }
    }

    function startGame() {
      stageIdx = 1;
      stage1Hits = 0;
      isidoraRescued = false;
      resetStageRuntime();
      state = STATE.RUN;
      hideAllScreens();
      lastTs = performance.now();
    }

    function retryStage() {
      resetStageRuntime();
      state = STATE.RUN;
      hideAllScreens();
      lastTs = performance.now();
    }

    function failStage() {
      state = STATE.FAIL;
      failTitleEl.textContent = cfg.failTitle;
      failTextEl.textContent = cfg.failText;
      showScreen(failScreen);
    }

    function clearStage() {
      if (stageIdx === 1) stage1Hits = hitsThisStage;
      state = STATE.STAGE_CLEAR;
      stageClearTag.textContent = cfg.label;
      stageClearTitle.textContent = cfg.clearTitle;
      stageClearText.textContent = cfg.clearText;
      showScreen(stageClearScreen);
    }

    function advanceStage() {
      if (stageIdx >= 3) {
        state = STATE.VICTORY;
        showScreen(victoryScreen);
        return;
      }
      stageIdx += 1;
      resetStageRuntime();
      state = STATE.RUN;
      hideAllScreens();
      lastTs = performance.now();
    }

    function spawnObstacle() {
      const type = cfg.types[Math.floor(Math.random() * cfg.types.length)];
      const r = OBSTACLE_R[type];
      // 55% de las veces apunta cerca de donde está el jugador AHORA
      // (con margen de reacción durante el tiempo de caída): fuerza a
      // moverse en vez de poder quedarse quieto. El resto cae en un
      // punto aleatorio del corredor, para que no sea 100% predecible.
      let lane0;
      if (Math.random() < 0.4) {
        const marginPx = PLAYER_R + r + 70;
        lane0 = clamp(player.x + rand(-marginPx, marginPx) / W, 0.06, 0.94);
      } else {
        lane0 = rand(0.08, 0.92);
      }
      const obstacle = {
        type,
        lane0,
        driftPerSec: type === 'rock' ? rand(-0.07, 0.07) : 0,
        bornAt: performance.now(),
        r,
        landed: false,
        rubbleAt: 0,
        hit: false
      };
      if (type === 'rock') {
        const pointCount = 7 + Math.floor(Math.random() * 3);
        obstacle.points = Array.from({ length: pointCount }, (_, idx) => ({
          ang: (idx / pointCount) * Math.PI * 2,
          jitter: rand(0.72, 1.08)
        }));
      }
      obstacles.push(obstacle);
    }

    /* Posición real (x,y) de un obstáculo en el instante `now`:
       - `crack`: no cae, solo se abre en el piso (y fija en la banda del jugador).
       - `rock`: cae de verdad desde arriba de la pantalla hasta la banda del
         jugador durante TELEGRAPH_MS, con una leve deriva horizontal
         (`driftPerSec`) — movimiento vertical Y horizontal reales, no solo
         una mancha creciendo en el mismo punto. */
    function obstaclePos(o, now) {
      const age = now - o.bornAt;
      const bandY = H * PLAYER_BAND_TOP + (H * (PLAYER_BAND_BOTTOM - PLAYER_BAND_TOP)) * 0.5;
      const laneNow = clamp(o.lane0 + o.driftPerSec * (age / 1000), 0.03, 0.97);
      if (o.type === 'crack') {
        return { x: laneNow * W, y: bandY, age };
      }
      const t = clamp(age / TELEGRAPH_MS, 0, 1);
      const eased = t * t;
      const topY = H * 0.1;
      return { x: laneNow * W, y: topY + (bandY - topY) * eased, age, t };
    }

    function damagePlayer() {
      const now = performance.now();
      if (now < invulnUntil) return;
      hp -= 1;
      hitsThisStage += 1;
      invulnUntil = now + INVULN_MS;
      shakeUntil = now + 260;
      if (hp <= 0) failStage();
    }

    function stepObstacles(now) {
      const playerPxX = player.x * W;
      const playerPxY = H * ((PLAYER_BAND_TOP + PLAYER_BAND_BOTTOM) / 2);
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const o = obstacles[i];
        const age = now - o.bornAt;
        if (!o.landed && age >= TELEGRAPH_MS) {
          o.landed = true;
          o.rubbleAt = now;
        }
        // el impacto es peligroso mientras cae y un instante después de
        // aterrizar (escombro recién caído); luego queda inerte.
        if (!o.hit && age <= TELEGRAPH_MS + HAZARD_GRACE_MS) {
          const pos = obstaclePos(o, now);
          if (circlesHit(pos.x, pos.y, o.r, playerPxX, playerPxY, PLAYER_R)) {
            o.hit = true;
            damagePlayer();
          }
        }
        if (o.landed && now - o.rubbleAt > RUBBLE_MS) {
          obstacles.splice(i, 1);
        }
      }
    }

    function updateRun(dt, now) {
      const move = (keys.ArrowLeft || keys.a || keys.A ? -1 : 0) + (keys.ArrowRight || keys.d || keys.D ? 1 : 0);
      player.vx = move * (PLAYER_SPEED / W);
      player.x = clamp(player.x + player.vx * dt, 0.06, 0.94);

      posHistory.push(player.x);
      if (posHistory.length > COMPANION_LAG_FRAMES) posHistory.shift();

      scrollSpeed += cfg.scrollAccel * dt;
      worldY += scrollSpeed * dt;

      if (now >= nextSpawnAt) {
        spawnObstacle();
        nextSpawnAt = now + rand(cfg.spawnMs[0], cfg.spawnMs[1]);
      }

      stepObstacles(now);

      if (dust.length < 40 && Math.random() < 0.5) {
        dust.push({ x: Math.random(), y: Math.random(), vy: rand(6, 18), r: rand(0.6, 1.8), a: rand(.08, .22) });
      }
      dust.forEach((d) => { d.y += d.vy * dt / H; if (d.y > 1) d.y = 0; });

      if (state === STATE.RUN && worldY >= cfg.distance) {
        if (stageIdx === 2) {
          state = STATE.RESCUE_QTE;
          qteProgress = 0;
          qteTimeLeft = QTE_TIME_S;
        } else {
          clearStage();
        }
      }
    }

    function updateRescueQte(dt, now) {
      const move = (keys.ArrowLeft || keys.a || keys.A ? -1 : 0) + (keys.ArrowRight || keys.d || keys.D ? 1 : 0);
      player.vx = move * (PLAYER_SPEED / W) * 0.6;
      player.x = clamp(player.x + player.vx * dt, 0.06, 0.94);

      if (now >= nextSpawnAt) {
        spawnObstacle();
        nextSpawnAt = now + rand(cfg.spawnMs[0], cfg.spawnMs[1]);
      }
      stepObstacles(now);
      if (state !== STATE.RESCUE_QTE) return;

      if (qteHolding) {
        qteProgress += QTE_HOLD_GAIN_PER_S * dt;
      } else {
        qteProgress -= QTE_DECAY_PER_S * dt;
      }
      qteProgress = clamp(qteProgress, 0, QTE_TARGET);
      qteTimeLeft -= dt;

      if (qteProgress >= QTE_TARGET) {
        isidoraFreed = true;
        isidoraRescued = true;
        clearStage();
      } else if (qteTimeLeft <= 0) {
        failStage();
      }
    }

    let lastTs = 0;
    function loop(ts) {
      if (!self.hasAttribute('open')) return;
      const dt = Math.min(0.05, (ts - (lastTs || ts)) / 1000);
      lastTs = ts;
      const now = performance.now();

      if (state === STATE.RUN) updateRun(dt, now);
      else if (state === STATE.RESCUE_QTE) updateRescueQte(dt, now);

      render(now);
      requestAnimationFrame(loop);
    }

    /* ---------- render ---------- */
    function drawBackground(now) {
      const laneLeft = 0.06 * W, laneRight = 0.94 * W;

      if (IMAGES.floor) {
        if (floorPatternImg !== IMAGES.floor) {
          floorPattern = ctx.createPattern(IMAGES.floor, 'repeat');
          floorPatternImg = IMAGES.floor;
        }
        const tile = IMAGES.floor.naturalHeight || 256;
        const offset = worldY % tile;
        ctx.save();
        ctx.fillStyle = floorPattern;
        ctx.translate(0, -offset);
        ctx.fillRect(0, 0, W, H + tile * 2);
        ctx.restore();
      } else {
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        if (stageIdx === 3) {
          grad.addColorStop(0, '#150f0a');
          grad.addColorStop(1, '#241a10');
        } else {
          grad.addColorStop(0, '#0f0b08');
          grad.addColorStop(1, '#1c140d');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      }

      if (IMAGES.wall) {
        if (wallPatternImg !== IMAGES.wall) {
          wallPattern = ctx.createPattern(IMAGES.wall, 'repeat');
          wallPatternImg = IMAGES.wall;
        }
        const tile = IMAGES.wall.naturalHeight || 256;
        const offset = worldY % tile;
        ctx.save();
        ctx.fillStyle = wallPattern;
        ctx.translate(0, -offset);
        ctx.fillRect(-tile, 0, laneLeft + tile, H + tile * 2);
        ctx.fillRect(laneRight, 0, W - laneRight + tile, H + tile * 2);
        ctx.restore();
        ctx.fillStyle = 'rgba(0,0,0,.32)';
        ctx.fillRect(0, 0, laneLeft, H);
        ctx.fillRect(laneRight, 0, W - laneRight, H);
      } else {
        ctx.strokeStyle = 'rgba(120,90,55,.35)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 6; i++) {
          const cx = ((i * 137 + worldY * 0.15) % (W + 200)) - 100;
          ctx.beginPath();
          ctx.moveTo(cx, 0);
          ctx.lineTo(cx - 40, H);
          ctx.stroke();
        }
      }

      ctx.fillStyle = 'rgba(230,220,200,.9)';
      dust.forEach((d) => {
        ctx.globalAlpha = d.a;
        ctx.beginPath();
        ctx.arc(d.x * W, d.y * H, d.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      ctx.strokeStyle = 'rgba(255,140,60,.18)';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(laneLeft, 0); ctx.lineTo(laneLeft, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(laneRight, 0); ctx.lineTo(laneRight, H); ctx.stroke();
    }

    function drawObstacle(o, now) {
      const pos = obstaclePos(o, now);
      const bandY = H * PLAYER_BAND_TOP + (H * (PLAYER_BAND_BOTTOM - PLAYER_BAND_TOP)) * 0.5;

      if (o.type === 'crack') {
        if (!o.landed) {
          const t = clamp(pos.age / TELEGRAPH_MS, 0, 1);
          ctx.strokeStyle = `rgba(255,90,60,${0.25 + 0.55 * t})`;
          ctx.lineWidth = 2 + 3 * t;
          ctx.beginPath();
          ctx.moveTo(pos.x - o.r * 0.6, bandY);
          ctx.lineTo(pos.x + o.r * 0.6, bandY);
          ctx.stroke();
          return;
        }
        const age = now - o.rubbleAt;
        const alpha = 1 - clamp(age / RUBBLE_MS, 0, 1) * 0.4;
        if (IMAGES.crack) {
          ctx.save();
          ctx.globalAlpha = alpha;
          const cw = o.r * 2.6, ch = o.r * 1.4;
          ctx.drawImage(IMAGES.crack, pos.x - cw / 2, bandY - ch / 2, cw, ch);
          ctx.restore();
        } else {
          ctx.strokeStyle = `rgba(20,10,5,${alpha})`;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(pos.x - o.r, bandY - 4);
          ctx.lineTo(pos.x - 4, bandY + 6);
          ctx.lineTo(pos.x + 6, bandY - 6);
          ctx.lineTo(pos.x + o.r, bandY + 4);
          ctx.stroke();
        }
        return;
      }

      // marca de impacto en el suelo: dónde va a caer, mientras cae
      if (!o.landed) {
        const t = clamp(pos.age / TELEGRAPH_MS, 0, 1);
        const markR = o.r * (0.4 + 0.5 * t);
        ctx.fillStyle = `rgba(0,0,0,${0.18 + 0.3 * t})`;
        ctx.beginPath();
        ctx.ellipse(pos.x, bandY, markR * 1.15, markR * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        if (t > 0.5) {
          ctx.strokeStyle = `rgba(255,90,60,${(t - 0.5) / 0.5})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(pos.x, bandY, markR * 1.4, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // la roca misma, cayendo (o ya como escombro en el suelo)
      const age = o.landed ? now - o.rubbleAt : 0;
      const alpha = o.landed ? 1 - clamp(age / RUBBLE_MS, 0, 1) * 0.5 : 1;
      if (IMAGES.rock) {
        ctx.save();
        ctx.globalAlpha = alpha;
        const size = o.r * 2.4;
        ctx.drawImage(IMAGES.rock, pos.x - size / 2, pos.y - size / 2, size, size);
        ctx.restore();
      } else {
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.fillStyle = `rgba(76,62,48,${alpha})`;
        ctx.beginPath();
        o.points.forEach((p, idx) => {
          const rr = o.r * p.jitter;
          const px = Math.cos(p.ang) * rr;
          const py = Math.sin(p.ang) * rr * 0.85;
          if (idx === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = `rgba(30,22,14,${alpha * 0.8})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }
    }

    function drawRunner(px, py, color, bob, imageKey) {
      ctx.save();
      ctx.translate(px, py + bob);
      ctx.fillStyle = 'rgba(0,0,0,.35)';
      ctx.beginPath();
      ctx.ellipse(0, PLAYER_R * 0.9, PLAYER_R * 0.8, PLAYER_R * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
      const img = imageKey && IMAGES[imageKey];
      if (img) {
        const w = PLAYER_R * 2.6, h = PLAYER_R * 3.6;
        ctx.drawImage(img, -w / 2, -h * 0.72, w, h);
      } else {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(0, 0, PLAYER_R * 0.62, PLAYER_R * 0.9, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, -PLAYER_R * 0.95, PLAYER_R * 0.42, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    function drawPlayer(now) {
      const px = player.x * W;
      const py = H * ((PLAYER_BAND_TOP + PLAYER_BAND_BOTTOM) / 2);
      const bob = Math.sin(now / 90) * 3;
      const flashing = now < invulnUntil && Math.floor(now / 90) % 2 === 0;
      ctx.globalAlpha = flashing ? 0.4 : 1;
      drawRunner(px, py, '#3f8f8a', bob, 'player');
      ctx.globalAlpha = 1;
    }

    function drawCompanion(now) {
      if (!isidoraRescued || stageIdx !== 3) return;
      const lagX = posHistory.length ? posHistory[0] : player.x;
      const px = clamp(lagX, 0.06, 0.94) * W - 34;
      const py = H * ((PLAYER_BAND_TOP + PLAYER_BAND_BOTTOM) / 2) + 6;
      const bob = Math.sin(now / 90 + 1.4) * 3;
      drawRunner(px, py, '#c46a3a', bob, 'isidora');
    }

    function drawIsidoraTrapped(now) {
      const px = W * 0.5;
      const py = H * ((PLAYER_BAND_TOP + PLAYER_BAND_BOTTOM) / 2) - 18;
      const bob = Math.sin(now / 260) * 1.4;
      ctx.save();
      ctx.translate(px, py + bob);
      ctx.fillStyle = 'rgba(0,0,0,.35)';
      ctx.beginPath();
      ctx.ellipse(0, 18, 22, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      if (IMAGES.isidora) {
        const w = PLAYER_R * 2.6, h = PLAYER_R * 3.6;
        ctx.drawImage(IMAGES.isidora, -w / 2, -h * 0.72, w, h);
      } else {
        ctx.fillStyle = '#c46a3a';
        ctx.beginPath();
        ctx.ellipse(0, 4, 12, 16, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, -13, 8, 0, Math.PI * 2);
        ctx.fill();
      }
      if (IMAGES.rock) {
        ctx.save();
        ctx.globalAlpha = 0.95;
        const rw = 36, rh = 24;
        ctx.drawImage(IMAGES.rock, 4 - rw / 2, 10 - rh / 2, rw, rh);
        ctx.restore();
      } else {
        ctx.fillStyle = '#5a4634';
        ctx.beginPath();
        ctx.ellipse(6, 10, 20, 9, -0.15, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    function drawHud(now) {
      for (let i = 0; i < HP_MAX; i++) {
        ctx.fillStyle = i < hp ? '#e2705a' : 'rgba(226,112,90,.25)';
        ctx.beginPath();
        ctx.arc(24 + i * 26, 26, 8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#f4e2b0';
      ctx.font = '13px Georgia, serif';
      ctx.textAlign = 'right';
      ctx.fillText(cfg ? cfg.label : '', W - 14, 22);

      const progress = clamp(worldY / (cfg ? cfg.distance : 1), 0, 1);
      const barW = W - 28;
      ctx.strokeStyle = 'rgba(244,226,176,.5)';
      ctx.strokeRect(14, H - 22, barW, 8);
      ctx.fillStyle = '#f4b942';
      ctx.fillRect(14, H - 22, barW * progress, 8);

      if (state === STATE.RESCUE_QTE) {
        const qw = W * 0.6, qx = (W - qw) / 2, qy = H * 0.18;
        ctx.fillStyle = '#f2e6d0';
        ctx.textAlign = 'center';
        ctx.font = '15px Georgia, serif';
        ctx.fillText('¡Levanta la roca! Haz clic o mantén presionado', W / 2, qy - 12);
        ctx.strokeStyle = 'rgba(244,226,176,.6)';
        ctx.strokeRect(qx, qy, qw, 14);
        ctx.fillStyle = '#8fd6c8';
        ctx.fillRect(qx, qy, qw * (qteProgress / QTE_TARGET), 14);
        ctx.fillStyle = '#e2705a';
        ctx.textAlign = 'left';
        ctx.fillText(Math.max(0, qteTimeLeft).toFixed(1) + 's', qx + qw + 10, qy + 12);
      }
      ctx.textAlign = 'left';
    }

    function render(now) {
      ctx.save();
      if (now < shakeUntil) {
        ctx.translate(rand(-4, 4), rand(-4, 4));
      }
      drawBackground(now);
      obstacles.forEach((o) => drawObstacle(o, now));
      if (state === STATE.RESCUE_QTE || (stageIdx === 2 && state === STATE.RUN && worldY / cfg.distance > 0.75)) {
        drawIsidoraTrapped(now);
      }
      drawCompanion(now);
      drawPlayer(now);
      drawHud(now);
      ctx.restore();
    }

    /* ---------- input ---------- */
    function onKeyDown(e) {
      if (!self.hasAttribute('open')) return;
      keys[e.key] = true;
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) e.preventDefault();
    }
    function onKeyUp(e) {
      if (!self.hasAttribute('open')) return;
      keys[e.key] = false;
    }
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // Etapa 2: levantar la roca con clic/toque en vez de teclado —
    // clic o toque suma un impulso inmediato; mantener presionado sigue
    // llenando la barra mientras dura la presión.
    function onCanvasPointerDown(e) {
      if (!self.hasAttribute('open') || state !== STATE.RESCUE_QTE) return;
      e.preventDefault();
      qteHolding = true;
      qteProgress = clamp(qteProgress + QTE_TAP_GAIN, 0, QTE_TARGET);
    }
    function onPointerUpAnywhere() {
      qteHolding = false;
    }
    canvas.addEventListener('pointerdown', onCanvasPointerDown);
    canvas.addEventListener('pointerup', onPointerUpAnywhere);
    canvas.addEventListener('pointerleave', onPointerUpAnywhere);
    canvas.addEventListener('pointercancel', onPointerUpAnywhere);

    root.addEventListener('click', (e) => { e.stopPropagation(); });

    startBtn.addEventListener('click', () => startGame());
    retryBtn.addEventListener('click', () => retryStage());
    continueStageBtn.addEventListener('click', () => advanceStage());
    victoryBtn.addEventListener('click', () => {
      self.close();
      self.dispatchEvent(new CustomEvent('derrumbe:completado', {
        detail: { muroIntacto: stage1Hits === 0, isidoraSalvada: isidoraRescued }
      }));
    });

    window.addEventListener('resize', () => { if (self.hasAttribute('open')) resize(); });

    /* ---------- API pública ---------- */
    self.open = function () {
      self.setAttribute('open', '');
      resize();
      state = STATE.INTRO;
      hideAllScreens();
      showScreen(introScreen);
      lastTs = performance.now();
      requestAnimationFrame(loop);
    };
    self.close = function () {
      self.removeAttribute('open');
    };
  }

  class DerrumbeFinal extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    }
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      _build(this.shadowRoot, this);
    }
  }

  if (!customElements.get('derrumbe-final')) {
    customElements.define('derrumbe-final', DerrumbeFinal);
  }
})();

/* ============================================================
   Monogatari Action — verbo `derrumbe`
   ============================================================ */
(function () {
  'use strict';

  class DerrumbeAction extends Monogatari.Action {
    static id = 'DerrumbeAction';

    static matchString([action]) {
      return action === 'derrumbe';
    }

    constructor([verb, elementId]) {
      super();
      this.elementId = elementId;
      this._onDone = null;
    }

    willApply() {
      return Promise.resolve();
    }

    apply() {
      return new Promise((resolve) => {
        const el = document.getElementById(this.elementId);
        this._onDone = (evt) => {
          el.removeEventListener('derrumbe:completado', this._onDone);
          try {
            const detail = evt && evt.detail ? evt.detail : {};
            const storage = monogatari.storage();
            storage.derrumbeMuroIntacto = !!detail.muroIntacto;
            storage.derrumbeIsidoraSalvada = !!detail.isidoraSalvada;
          } catch (err) {
            /* si la API de storage difiere, no bloquea el avance del guion */
          }
          resolve();
        };
        el.addEventListener('derrumbe:completado', this._onDone);
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

  monogatari.registerAction(DerrumbeAction);
})();
