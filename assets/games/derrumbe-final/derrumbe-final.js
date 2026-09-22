/* ============================================================
   Minijuego — Escena 45: "El Derrumbe" (Capítulo IV)
   <derrumbe-final> — Web Component (Shadow DOM)
   Verbo Monogatari: derrumbe
   Evento final: derrumbe:completado
   Plataformero horizontal (estilo Mario): el jugador avanza
   automáticamente de izquierda a derecha, salta las grietas que se
   abren en el piso y esquiva/salta las rocas que caen del techo. El
   muro va al fondo (parallax) y el piso queda bajo los pies.
   3 etapas en una sola sesión:
     1) Escapar del derrumbe (saltar grietas / rocas)
     2) Salvar a Isidora (llegar hasta ella + QTE de clic para levantar la roca)
     3) Escapar y llegar a la cámara oculta (versión más dura de la 1,
        con Isidora como compañera visual que salta detrás tuyo)
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
        <p>Avanzas por el corredor mientras el techo se derrumba. Salta
        las grietas que se abren en el piso y las rocas que caen — con
        ESPACIO, flecha arriba o un toque/clic en la pantalla — y
        adelanta o retrasa el paso con las flechas izquierda/derecha
        (o A/D) para ganar el timing justo. Más adelante, Isidora
        quedó atrapada: mantén presionado o haz clic repetidamente
        para levantar la roca que la aplasta.</p>
        <button class="btn start-btn" type="button">Correr</button>
        <p class="hint">Espacio / ↑ / clic — saltar · ←/→ — adelantar/atrasar · Clic — levantar la roca (etapa 2)</p>
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
  const PLAYER_R = 18;
  const GROUND_Y_FRAC = 0.76;
  const PLAYER_SCREEN_X_FRAC = 0.24;
  const GRAVITY = 2200;
  const JUMP_VELOCITY = 760;
  const JUMP_AIR_TIME = (2 * JUMP_VELOCITY) / GRAVITY;
  const INVULN_MS = 950;
  const FALL_MS = 1800; // más lento: cuánto tarda en caer una roca "congelada" durante el rescate (etapa 2)
  const ROCK_SKY_Y = -40; // arriba de la ventana del navegador, no solo "8% de la pantalla"
  const CRACK_CLEAR_HEIGHT = 42;
  const CRACK_MIN_W = 60;
  const CRACK_MAX_W = 130;
  const QTE_TIME_S = 8;
  const QTE_TARGET = 100;
  const QTE_TAP_GAIN = 9;
  const QTE_HOLD_GAIN_PER_S = 34;
  const QTE_DECAY_PER_S = 14;
  const COMPANION_JUMP_DELAY_MS = 260;
  const COMPANION_OFFSET_PX = 46;
  const PLAYER_MOVE_SPEED = 260;
  const MIN_OBSTACLE_GAP_PX = 145;
  const FALL_PORTION_MIN = 0.22; // algunas ya están en el suelo mucho antes de llegar al jugador
  const FALL_PORTION_MAX = 0.85; // otras siguen cayendo casi hasta el momento de saltarlas

  const OBSTACLE_R = { rock: 24 };

  const STAGES = [
    null,
    {
      n: 1,
      key: 'escape',
      label: 'Etapa 1 · Escapar del derrumbe',
      distance: 4400,
      scrollSpeed: 150,
      scrollAccel: 3,
      spawnMs: [350, 475],
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
      distance: 3800,
      scrollSpeed: 115,
      scrollAccel: 1.5,
      spawnMs: [260, 375],
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
      distance: 5600,
      scrollSpeed: 175,
      scrollAccel: 4,
      spawnMs: [300, 400],
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

    let distanceTravelled = 0; // avance horizontal acumulado
    let scrollSpeed = 0;
    let hp = HP_MAX;
    let hitsThisStage = 0;
    let stage1Hits = 0;
    let invulnUntil = 0;
    let shakeUntil = 0;
    let nextSpawnAt = 0;
    let lastTrackEnd = 0; // fin (en el mundo) del último obstáculo generado, para no apilar dos seguidos

    // El jugador tiene una posición FIJA en pantalla (PLAYER_SCREEN_X_FRAC);
    // solo controla el salto (eje Y). El avance lo hace el mundo, no el sprite.
    const player = { y: 0, vy: 0, grounded: true };
    const companion = { y: 0, vy: 0, grounded: true };
    let playerOffsetX = 0; // adelante/atrás manual, relativo al ancla (baseX)
    let jumpHistory = []; // timestamps de salto del jugador, para que Isidora lo siga con un pequeño retraso
    const keys = Object.create(null);
    let isidoraRescued = false;

    let obstacles = []; // {type, trackPos|relAtSpawn, width?(crack), r?(rock), bornAt, hit}
    let dust = [];

    let qteProgress = 0;
    let qteTimeLeft = QTE_TIME_S;
    let qteHolding = false;

    function groundY() { return H * GROUND_Y_FRAC; }
    // baseX: el ancla fija del "mundo" — los obstáculos se ubican en
    // pantalla relativos a este punto, sin importar dónde esté el jugador.
    function baseX() { return W * PLAYER_SCREEN_X_FRAC; }
    // playerScreenX: la posición real del jugador en pantalla — el ancla
    // más el desplazamiento manual hacia adelante/atrás (playerOffsetX).
    function playerScreenX() { return baseX() + playerOffsetX; }
    function obstacleRel(o) { return o.frozen ? o.relAtSpawn : (o.trackPos - distanceTravelled); }
    // Progreso de caída de una roca (0 = arriba, fuera de la ventana;
    // 1 = ya en el suelo). Para las que avanzan por el track, cada roca
    // tiene su propia fracción de caída (`o.fallPortion`) — así no
    // todas terminan de caer en el mismo punto del recorrido: algunas
    // ya están asentadas en el suelo mucho antes de que el jugador
    // llegue, otras siguen bajando casi hasta el momento justo de
    // saltarlas. Las "congeladas" del rescate (etapa 2) no tienen esa
    // referencia de distancia (el mundo no avanza durante el QTE), así
    // que caen con el reloj.
    function rockFallT(o, worldOffset, age) {
      if (o.frozen) return clamp(age / FALL_MS, 0, 1);
      const fallDistance = Math.max(40, o.spawnOffset * o.fallPortion);
      return clamp((o.spawnOffset - worldOffset) / fallDistance, 0, 1);
    }
    function offsetBounds() { return { min: -W * 0.10, max: W * 0.30 }; }

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
      distanceTravelled = 0;
      scrollSpeed = cfg.scrollSpeed;
      hp = HP_MAX;
      hitsThisStage = 0;
      invulnUntil = 0;
      shakeUntil = 0;
      obstacles = [];
      dust = [];
      jumpHistory = [];
      player.y = 0; player.vy = 0; player.grounded = true;
      playerOffsetX = 0;
      companion.y = 0; companion.vy = 0; companion.grounded = true;
      nextSpawnAt = performance.now() + rand(cfg.spawnMs[0], cfg.spawnMs[1]);
      lastTrackEnd = 0;
      if (stageIdx === 2) {
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

    function doJump() {
      if (state !== STATE.RUN && state !== STATE.RESCUE_QTE) return;
      if (!player.grounded) return;
      player.vy = JUMP_VELOCITY;
      player.grounded = false;
      jumpHistory.push(performance.now());
    }

    function spawnObstacle() {
      const type = cfg.types[Math.floor(Math.random() * cfg.types.length)];
      const obstacle = { type, bornAt: performance.now(), hit: false };
      if (state === STATE.RESCUE_QTE) {
        // Durante el rescate el mundo no avanza: las rocas caen en un
        // punto fijo de la pantalla en vez de acercarse por el track.
        obstacle.frozen = true;
        obstacle.relAtSpawn = rand(W * 0.08, W * 0.6) - baseX();
      } else {
        obstacle.frozen = false;
        const leadPx = (W - baseX()) + rand(20, 160);
        obstacle.trackPos = distanceTravelled + leadPx;
        obstacle.spawnOffset = leadPx; // para que la roca caiga durante TODO el recorrido, no solo al final
      }
      if (type === 'rock') {
        obstacle.r = OBSTACLE_R.rock;
        // Entra desde un punto distinto de la parte superior cada vez
        // (no siempre por el mismo lugar) — el desvío se desvanece a
        // medida que cae, así que aterriza exactamente donde debe.
        obstacle.entrySway = rand(-W * 0.32, W * 0.32);
        obstacle.fallPortion = rand(FALL_PORTION_MIN, FALL_PORTION_MAX);
        const pointCount = 7 + Math.floor(Math.random() * 3);
        obstacle.points = Array.from({ length: pointCount }, (_, idx) => ({
          ang: (idx / pointCount) * Math.PI * 2,
          jitter: rand(0.72, 1.08)
        }));
      } else {
        const maxClear = cfg.scrollSpeed * JUMP_AIR_TIME;
        obstacle.width = clamp(maxClear * rand(0.5, 0.78), CRACK_MIN_W, CRACK_MAX_W);
        const jagSegs = 6;
        obstacle.jag = Array.from({ length: jagSegs + 1 }, () => rand(-3, 5));
      }
      // Nunca se apilan dos obstáculos demasiado cerca en el mundo — si
      // eso pasa, se vuelve literalmente imposible de saltar. Se exige
      // un colchón mínimo desde el final del obstáculo anterior.
      if (!obstacle.frozen) {
        const prevEnd = lastTrackEnd;
        const ownStart = obstacle.trackPos - (type === 'rock' ? obstacle.r : 0);
        if (ownStart < prevEnd) {
          const shift = prevEnd - ownStart;
          obstacle.trackPos += shift;
        }
        lastTrackEnd = obstacle.trackPos + (type === 'rock' ? obstacle.r : obstacle.width) + MIN_OBSTACLE_GAP_PX + rand(0, 110);
      }
      obstacles.push(obstacle);
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
      const playerWorldPos = distanceTravelled + playerOffsetX;
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const o = obstacles[i];
        const worldOffset = obstacleRel(o);
        const relToPlayer = worldOffset - playerOffsetX;
        const age = now - o.bornAt;

        if (o.frozen) {
          if (age > FALL_MS + 1600) { obstacles.splice(i, 1); continue; }
        } else if (worldOffset < -(baseX() + 150)) {
          obstacles.splice(i, 1); continue;
        }

        if (o.type === 'crack') {
          const overGap = playerWorldPos >= o.trackPos - PLAYER_R * 0.4 &&
                           playerWorldPos <= o.trackPos + o.width + PLAYER_R * 0.4;
          if (overGap && !o.hit && player.y < CRACK_CLEAR_HEIGHT) {
            o.hit = true;
            damagePlayer();
          }
          continue;
        }

        // roca: cae de verdad mientras se acerca al jugador (no ya
        // resuelta desde que aparece) — ver rockFallT().
        const t = rockFallT(o, worldOffset, age);
        const eased = t * t;
        const topY = ROCK_SKY_Y;
        const landedCenterY = groundY() - o.r * 0.7;
        const rockCenterY = topY + (landedCenterY - topY) * eased;
        if (!o.hit) {
          const playerCenterY = groundY() - player.y - PLAYER_R;
          if (circlesHit(relToPlayer, rockCenterY, o.r, 0, playerCenterY, PLAYER_R)) {
            o.hit = true;
            damagePlayer();
          }
        }
      }
    }

    function updatePlayerOffset(dt) {
      const move = (keys.ArrowLeft || keys.a || keys.A ? -1 : 0) + (keys.ArrowRight || keys.d || keys.D ? 1 : 0);
      if (!move) return;
      const bounds = offsetBounds();
      playerOffsetX = clamp(playerOffsetX + move * PLAYER_MOVE_SPEED * dt, bounds.min, bounds.max);
    }

    function updateRun(dt, now) {
      updatePlayerOffset(dt);
      player.vy -= GRAVITY * dt;
      player.y += player.vy * dt;
      if (player.y <= 0) { player.y = 0; player.vy = 0; player.grounded = true; }

      if (jumpHistory.length && companion.grounded && (now - jumpHistory[0]) >= COMPANION_JUMP_DELAY_MS) {
        jumpHistory.shift();
        companion.vy = JUMP_VELOCITY;
        companion.grounded = false;
      }
      companion.vy -= GRAVITY * dt;
      companion.y += companion.vy * dt;
      if (companion.y <= 0) { companion.y = 0; companion.vy = 0; companion.grounded = true; }

      scrollSpeed += cfg.scrollAccel * dt;
      distanceTravelled += scrollSpeed * dt;

      if (now >= nextSpawnAt) {
        spawnObstacle();
        nextSpawnAt = now + rand(cfg.spawnMs[0], cfg.spawnMs[1]);
      }

      stepObstacles(now);

      if (dust.length < 36 && Math.random() < 0.5) {
        dust.push({ x: 1.05, y: rand(0.5, 0.98), r: rand(0.6, 1.8), a: rand(.08, .22) });
      }
      dust.forEach((d) => {
        d.x -= (scrollSpeed * 0.55) * dt / W;
        if (d.x < -0.05) { d.x = 1.05; d.y = rand(0.5, 0.98); }
      });

      if (state === STATE.RUN && distanceTravelled >= cfg.distance) {
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
      updatePlayerOffset(dt);
      player.vy -= GRAVITY * dt;
      player.y += player.vy * dt;
      if (player.y <= 0) { player.y = 0; player.vy = 0; player.grounded = true; }

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
      const gy = groundY();

      const grad = ctx.createLinearGradient(0, 0, 0, gy);
      if (stageIdx === 3) {
        grad.addColorStop(0, '#1a130d');
        grad.addColorStop(1, '#241a10');
      } else {
        grad.addColorStop(0, '#120d09');
        grad.addColorStop(1, '#1c140d');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, gy);

      // Muro de fondo: parallax (se mueve más lento que el piso, como
      // si estuviera detrás, lejos del camino).
      if (IMAGES.wall) {
        if (wallPatternImg !== IMAGES.wall) {
          wallPattern = ctx.createPattern(IMAGES.wall, 'repeat');
          wallPatternImg = IMAGES.wall;
        }
        const tile = IMAGES.wall.naturalWidth || 256;
        if (wallPattern.setTransform) {
          try {
            const parallax = distanceTravelled * 0.35;
            wallPattern.setTransform(new DOMMatrix().translate(-(parallax % tile), 0));
          } catch (e) { /* navegador sin soporte: el muro no se desplaza, no rompe nada */ }
        }
        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = wallPattern;
        ctx.fillRect(0, 0, W, gy);
        ctx.restore();
        const vgrad = ctx.createLinearGradient(0, gy - 46, 0, gy);
        vgrad.addColorStop(0, 'rgba(0,0,0,0)');
        vgrad.addColorStop(1, 'rgba(0,0,0,.45)');
        ctx.fillStyle = vgrad;
        ctx.fillRect(0, gy - 46, W, 46);
      } else {
        ctx.fillStyle = 'rgba(0,0,0,.32)';
        for (let i = 0; i < 7; i++) {
          const bx = ((i * 160 - distanceTravelled * 0.35) % (W + 220)) - 110;
          const bh = 40 + (i % 3) * 22;
          ctx.beginPath();
          ctx.moveTo(bx - 70, gy);
          ctx.lineTo(bx, gy - bh);
          ctx.lineTo(bx + 70, gy);
          ctx.closePath();
          ctx.fill();
        }
      }

      // Piso: bajo los pies, se desplaza 1:1 con el avance.
      if (IMAGES.floor) {
        if (floorPatternImg !== IMAGES.floor) {
          floorPattern = ctx.createPattern(IMAGES.floor, 'repeat');
          floorPatternImg = IMAGES.floor;
        }
        const tile = IMAGES.floor.naturalWidth || 256;
        if (floorPattern.setTransform) {
          try { floorPattern.setTransform(new DOMMatrix().translate(-(distanceTravelled % tile), 0)); } catch (e) { /* respaldo: piso fijo, no rompe nada */ }
        }
        ctx.fillStyle = floorPattern;
        ctx.fillRect(0, gy, W, H - gy);
      } else {
        ctx.fillStyle = '#241a10';
        ctx.fillRect(0, gy, W, H - gy);
      }
      ctx.strokeStyle = 'rgba(255,180,110,.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(W, gy);
      ctx.stroke();

      ctx.fillStyle = 'rgba(230,220,200,.9)';
      dust.forEach((d) => {
        ctx.globalAlpha = d.a;
        ctx.beginPath();
        ctx.arc(d.x * W, d.y * H, d.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    }

    function drawObstacle(o, now) {
      const rel = obstacleRel(o);
      const screenX = baseX() + rel;
      const gy = groundY();

      if (o.type === 'crack') {
        if (screenX > W + 40 || screenX + o.width < -40) return;
        const w = o.width;
        const floorH = H - gy;
        if (IMAGES.crack) {
          ctx.drawImage(IMAGES.crack, screenX, gy - 6, w, floorH + 6);
        } else {
          // Grieta real: un vacío que corta todo el piso, no una
          // marca superficial — se dibuja de borde a borde del piso,
          // con bordes irregulares y un resplandor cálido dentro.
          const jagTop = o.jag.map((j) => gy + j);
          const segs = jagTop.length - 1;
          ctx.fillStyle = '#040201';
          ctx.beginPath();
          ctx.moveTo(screenX, jagTop[0]);
          for (let i = 1; i <= segs; i++) {
            ctx.lineTo(screenX + (w * i) / segs, jagTop[i]);
          }
          ctx.lineTo(screenX + w, H);
          ctx.lineTo(screenX, H);
          ctx.closePath();
          ctx.fill();
          const glow = ctx.createLinearGradient(0, gy, 0, gy + floorH * 0.5);
          glow.addColorStop(0, 'rgba(255,120,60,.35)');
          glow.addColorStop(1, 'rgba(255,120,60,0)');
          ctx.fillStyle = glow;
          ctx.fillRect(screenX, gy, w, floorH * 0.5);
          ctx.strokeStyle = 'rgba(255,150,80,.5)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(screenX, jagTop[0]);
          for (let i = 1; i <= segs; i++) ctx.lineTo(screenX + (w * i) / segs, jagTop[i]);
          ctx.stroke();
        }
        return;
      }

      if (screenX < -60 || screenX > W + 60) return;

      const age = now - o.bornAt;
      const t = rockFallT(o, rel, age);
      const eased = t * t;
      const topY = ROCK_SKY_Y;
      const landedCenterY = gy - o.r * 0.7;
      const rockCenterY = topY + (landedCenterY - topY) * eased;

      if (t < 1) {
        const markR = o.r * (0.4 + 0.5 * t);
        ctx.fillStyle = `rgba(0,0,0,${0.18 + 0.3 * t})`;
        ctx.beginPath();
        ctx.ellipse(screenX, gy, markR * 1.15, markR * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Entra desviada desde otro punto de la pantalla; el desvío se
      // desvanece a medida que cae, así que aterriza en su lugar real
      // (la marca de impacto de arriba siempre queda en ese lugar real,
      // sin desvío, para que el aviso sea justo).
      const swayFade = (1 - t) * (1 - t);
      const drawX = screenX + o.entrySway * swayFade;

      if (IMAGES.rock) {
        const size = o.r * 2.4;
        ctx.drawImage(IMAGES.rock, drawX - size / 2, rockCenterY - size / 2, size, size);
      } else {
        ctx.save();
        ctx.translate(drawX, rockCenterY);
        ctx.fillStyle = '#4c3e30';
        ctx.beginPath();
        o.points.forEach((p, idx) => {
          const rr = o.r * p.jitter;
          const px = Math.cos(p.ang) * rr;
          const py = Math.sin(p.ang) * rr * 0.85;
          if (idx === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(30,22,14,.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }
    }

    function drawRunner(screenX, height, color, imageKey) {
      const gy = groundY();
      ctx.save();
      ctx.translate(screenX, gy - height);
      const shadowScale = clamp(1 - height / 140, 0.35, 1);
      ctx.fillStyle = 'rgba(0,0,0,.35)';
      ctx.beginPath();
      ctx.ellipse(0, height, PLAYER_R * 0.9 * shadowScale, PLAYER_R * 0.32 * shadowScale, 0, 0, Math.PI * 2);
      ctx.fill();

      const img = imageKey && IMAGES[imageKey];
      if (img) {
        const w = PLAYER_R * 4.4, h = PLAYER_R * 6.0;
        ctx.drawImage(img, -w / 2, -h, w, h);
      } else {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(0, -PLAYER_R * 0.4, PLAYER_R * 0.62, PLAYER_R * 0.9, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, -PLAYER_R * 1.5, PLAYER_R * 0.42, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    function drawPlayer(now) {
      const flashing = now < invulnUntil && Math.floor(now / 90) % 2 === 0;
      ctx.globalAlpha = flashing ? 0.4 : 1;
      drawRunner(playerScreenX(), player.y, '#3f8f8a', 'player');
      ctx.globalAlpha = 1;
    }

    function drawCompanion(now) {
      if (!isidoraRescued || stageIdx !== 3) return;
      drawRunner(playerScreenX() - COMPANION_OFFSET_PX, companion.y, '#c46a3a', 'isidora');
    }

    function drawIsidoraTrapped(now) {
      const rel = Math.max(cfg.distance - distanceTravelled, 0);
      const screenX = baseX() + rel;
      const gy = groundY();
      ctx.save();
      ctx.translate(screenX, gy);
      ctx.fillStyle = 'rgba(0,0,0,.35)';
      ctx.beginPath();
      ctx.ellipse(0, 0, 22, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      if (IMAGES.isidora) {
        const w = PLAYER_R * 4.4, h = PLAYER_R * 6.0;
        ctx.drawImage(IMAGES.isidora, -w / 2, -h * 0.94, w, h);
      } else {
        ctx.fillStyle = '#c46a3a';
        ctx.beginPath();
        ctx.ellipse(0, -40, 12, 16, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, -62, 8, 0, Math.PI * 2);
        ctx.fill();
      }
      if (IMAGES.rock) {
        ctx.save();
        ctx.globalAlpha = 0.95;
        const rw = 36, rh = 24;
        ctx.drawImage(IMAGES.rock, 4 - rw / 2, -30 - rh / 2, rw, rh);
        ctx.restore();
      } else {
        ctx.fillStyle = '#5a4634';
        ctx.beginPath();
        ctx.ellipse(6, -30, 20, 9, -0.15, 0, Math.PI * 2);
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

      const progress = clamp(distanceTravelled / (cfg ? cfg.distance : 1), 0, 1);
      const barW = W - 28;
      ctx.strokeStyle = 'rgba(244,226,176,.5)';
      ctx.strokeRect(14, H - 22, barW, 8);
      ctx.fillStyle = '#f4b942';
      ctx.fillRect(14, H - 22, barW * progress, 8);

      if (state === STATE.RESCUE_QTE) {
        const qw = W * 0.6, qx = (W - qw) / 2, qy = H * 0.16;
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
      if (state === STATE.RESCUE_QTE || (stageIdx === 2 && state === STATE.RUN && distanceTravelled / cfg.distance > 0.6)) {
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
      if (e.code === 'Space' || e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        doJump();
        return;
      }
      if (['ArrowLeft', 'ArrowRight', 'a', 'A', 'd', 'D'].includes(e.key)) {
        e.preventDefault();
        keys[e.key] = true;
      }
    }
    function onKeyUp(e) {
      if (!self.hasAttribute('open')) return;
      keys[e.key] = false;
    }
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // Un clic/toque en el juego salta (etapas 1 y 3); durante el
    // rescate (etapa 2) ese mismo gesto llena la barra de "levantar".
    function onCanvasPointerDown(e) {
      if (!self.hasAttribute('open')) return;
      if (state === STATE.RESCUE_QTE) {
        e.preventDefault();
        qteHolding = true;
        qteProgress = clamp(qteProgress + QTE_TAP_GAIN, 0, QTE_TARGET);
      } else if (state === STATE.RUN) {
        e.preventDefault();
        doJump();
      }
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
