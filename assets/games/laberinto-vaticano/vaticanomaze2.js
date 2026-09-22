(function () {
  'use strict';

/**
 * <vaticano-maze> — Minijuego "El Laberinto del Vaticano" (Escena 32)
 *
 * Sigue el mismo contrato/arquitectura que <rune-puzzle> (cifrado-tres-ciudades)
 * y <ruta7-race> (ruta7-carretera-austral):
 *   - Web Component con Shadow DOM, oculto por defecto (:host{display:none}),
 *     visible solo con el atributo [open].
 *   - API pública: self.open() / self.close().
 *   - Evento de finalización: 'laberinto:completado' (bubbles:true, composed:true),
 *     que la Acción de Monogatari (laberinto-action.js) espera para resolver didApply().
 *   - Bucle de animación y listeners de teclado con guarda self.hasAttribute('open')
 *     para no consumir CPU ni robar teclas mientras está oculto.
 *   - resize() se re-ejecuta dentro de open() (mismo fix que ruta7 v6: el host está
 *     display:none al construirse, así que getBoundingClientRect() da 0x0 antes de abrir).
 *
 * Personaje: Gabriel (dibujado con primitivas de canvas — círculo + sombrero, no hay
 * foto recortada de Gabriel todavía; ver INTEGRACION.md para instrucciones de cómo
 * sustituirlo por un sprite/foto real si el usuario lo agrega más adelante).
 *
 * Las 3 etapas (mismo orden que el guion de la Escena 32):
 *   1) Plaza de San Pedro → Museos Vaticanos → Capilla Sixtina
 *   2) Zona Gubernamental y de Reserva: Jardines Vaticanos → Palacio de la Gobernación
 *   3) Zona Residencial y Administrativa: Ciudad Baja (Santa Ana) → Biblioteca Apostólica
 */

// ---------------------------------------------------------------------
// Imágenes reales (fotos hiperrealistas de los lugares + vistas superiores
// de Gabriel y de los curas). Se cargan como archivos externos junto al
// componente — igual que cualquier otro asset del proyecto (fondos,
// personajes) — no embebidas en base64, para no inflar este archivo .js.
// Rutas relativas al index.html del proyecto (mismo criterio que
// 'assets/games/...' usado en el resto del juego).
// ---------------------------------------------------------------------
const IMG_BASE = 'assets/games/laberinto-vaticano/images/';
function loadImg(file) {
  const img = new Image();
  img.src = IMG_BASE + file;
  return img;
}
const LOCATION_IMAGES = {
  plazaSanPedro: loadImg('plaza-san-pedro.png'),
  capillaSixtina: loadImg('capilla-sixtina.png'),
  jardinesVaticanos: loadImg('jardines-vaticanos.png'),
  palacioGobernacion: loadImg('palacio-gobernacion.png'),
  ciudadBaja: loadImg('ciudad-baja.png'),
  bibliotecaApostolica: loadImg('biblioteca-apostolica.png'),
};
const GABRIEL_TOPDOWN_IMG = loadImg('gabriel-topdown.png');
const CURA_TOPDOWN_IMG = loadImg('cura-topdown.png');

class VaticanoMaze extends HTMLElement {
  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    _build(root, this);
  }
}

function _build(root, self) {
  // ---------------------------------------------------------------------
  // Datos de las 3 etapas y paletas temáticas
  // ---------------------------------------------------------------------
  const STAGES = [
    {
      id: 'museos',
      seed: 20100,
      cols: 15,
      rows: 11,
      cellSize: 34,
      priestCriticalCount: 4,
      priestNoncriticalCount: 1,
      zone: 'Ciudad del Vaticano',
      title: 'Etapa 1 de 3',
      subtitle: 'Plaza de San Pedro → Museos Vaticanos → Capilla Sixtina',
      entranceLabel: 'Plaza de San Pedro',
      exitLabel: 'Capilla Sixtina',
      entranceImage: LOCATION_IMAGES.plazaSanPedro,
      exitImage: LOCATION_IMAGES.capillaSixtina,
      intro:
        'Gabriel cruza la columnata de Bernini y se interna en el laberinto de galerías de los Museos Vaticanos, buscando el camino hacia la Capilla Sixtina.',
      complete:
        'Gabriel llega a la Capilla Sixtina. Sobre su cabeza, los frescos de Miguel Ángel narran el principio y el fin de todas las cosas.',
      theme: 'museos',
    },
    {
      id: 'jardines',
      seed: 17874,
      cols: 14,
      rows: 9,
      cellSize: 34,
      priestCriticalCount: 3,
      priestNoncriticalCount: 1,
      zone: 'Zona Gubernamental y de Reserva',
      title: 'Etapa 2 de 3',
      subtitle: 'Jardines Vaticanos → Palacio de la Gobernación',
      entranceLabel: 'Jardines Vaticanos',
      exitLabel: 'Palacio de la Gobernación',
      entranceImage: LOCATION_IMAGES.jardinesVaticanos,
      exitImage: LOCATION_IMAGES.palacioGobernacion,
      intro:
        'Entre setos recortados y fuentes centenarias, Gabriel busca el camino hacia el Palacio de la Gobernación, sede administrativa del Estado Vaticano.',
      complete:
        'Gabriel alcanza el Palacio de la Gobernación. Los jardines quedan atrás, silenciosos y perfectos.',
      theme: 'jardines',
    },
    {
      id: 'biblioteca',
      seed: 3203,
      cols: 13,
      rows: 9,
      cellSize: 34,
      priestCriticalCount: 0,
      priestNoncriticalCount: 4,
      zone: 'Zona Residencial y Administrativa',
      title: 'Etapa 3 de 3',
      subtitle: 'Ciudad Baja (Zona de Santa Ana) → Biblioteca Apostólica',
      entranceLabel: 'Ciudad Baja · Santa Ana',
      exitLabel: 'Biblioteca Apostólica',
      entranceImage: LOCATION_IMAGES.ciudadBaja,
      exitImage: LOCATION_IMAGES.bibliotecaApostolica,
      intro:
        'Por las callejuelas de Santa Ana, la vida cotidiana del Vaticano transcurre entre talleres y oficinas. Gabriel busca la entrada a la Biblioteca Apostólica.',
      complete:
        'Gabriel entra a la Biblioteca Apostólica. Miles de manuscritos duermen entre sus muros centenarios — uno de ellos podría tener la respuesta que busca.',
      theme: 'biblioteca',
    },
  ];

  const THEMES = {
    museos: {
      bg: '#efe6d2',
      floorA: '#e8ddc4',
      floorB: '#dccfa9',
      wall: '#8a7355',
      wallDark: '#5f4d38',
      wallTop: '#a68f6b',
      accent: '#c9a961',
      text: '#3a2f1f',
    },
    jardines: {
      bg: '#e6efdb',
      floorA: '#87b071',
      floorB: '#729c5d',
      wall: '#3f5c33',
      wallDark: '#2a3f22',
      wallTop: '#527043',
      accent: '#d8c26a',
      text: '#22321c',
    },
    biblioteca: {
      bg: '#efe6d4',
      floorA: '#cdbc98',
      floorB: '#bfac83',
      wall: '#5c4a36',
      wallDark: '#3c2f22',
      wallTop: '#75604a',
      accent: '#9e7f4f',
      text: '#2e2417',
    },
  };

  // ---------------------------------------------------------------------
  // Generación de laberintos: recursive-backtracker con RNG con semilla fija
  // (perfect maze → garantiza que SIEMPRE existe un único camino entre
  // cualquier par de celdas, así que entrada y salida quedan conectadas).
  // ---------------------------------------------------------------------
  function mulberry32(seed) {
    let s = seed | 0;
    return function () {
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function generateMaze(cols, rows, seed) {
    const rand = mulberry32(seed);
    const W = cols * 2 + 1;
    const H = rows * 2 + 1;
    const grid = new Uint8Array(W * H); // 0 = muro, 1 = camino
    const idx = (x, y) => y * W + x;
    const visited = new Uint8Array(cols * rows);
    const cidx = (cx, cy) => cy * cols + cx;
    const carveCell = (cx, cy) => {
      grid[idx(cx * 2 + 1, cy * 2 + 1)] = 1;
    };

    const stack = [[0, 0]];
    visited[cidx(0, 0)] = 1;
    carveCell(0, 0);
    const dirs = [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
    ];

    while (stack.length) {
      const [cx, cy] = stack[stack.length - 1];
      const shuffled = dirs.slice();
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        const tmp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = tmp;
      }
      let carved = false;
      for (const [dx, dy] of shuffled) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
        if (visited[cidx(nx, ny)]) continue;
        grid[idx(cx * 2 + 1 + dx, cy * 2 + 1 + dy)] = 1;
        carveCell(nx, ny);
        visited[cidx(nx, ny)] = 1;
        stack.push([nx, ny]);
        carved = true;
        break;
      }
      if (!carved) stack.pop();
    }

    // Algunas conexiones extra (rompe un ~6% de muros internos) para que el
    // laberinto tenga pequeños loops y no sea un árbol 100% estricto — se
    // siente menos "artificial" sin dejar de ser resoluble (sigue conectado).
    const extraTries = Math.floor(cols * rows * 0.06);
    for (let i = 0; i < extraTries; i++) {
      const wx = 1 + Math.floor(rand() * (W - 2));
      const wy = 1 + Math.floor(rand() * (H - 2));
      const isWallCell = grid[idx(wx, wy)] === 0;
      const isInteriorEdge = wx > 0 && wy > 0 && wx < W - 1 && wy < H - 1;
      if (!isWallCell || !isInteriorEdge) continue;
      // Solo perforar muros que separan dos celdas de camino horizontal u
      // horizontal/vertical rectas (no esquinas), para no crear zonas 2x2 abiertas.
      const horizontalPair = grid[idx(wx - 1, wy)] === 1 && grid[idx(wx + 1, wy)] === 1 && grid[idx(wx, wy - 1)] === 0 && grid[idx(wx, wy + 1)] === 0;
      const verticalPair = grid[idx(wx, wy - 1)] === 1 && grid[idx(wx, wy + 1)] === 1 && grid[idx(wx - 1, wy)] === 0 && grid[idx(wx + 1, wy)] === 0;
      if (horizontalPair || verticalPair) grid[idx(wx, wy)] = 1;
    }

    return { grid, W, H };
  }

  // ---------------------------------------------------------------------
  // Curas patrullando — dificultad añadida. Buscan los corredores rectos
  // más largos del laberinto y hacen patrullar a un cura de un extremo a
  // otro (ping-pong). No persiguen a Gabriel: si él lo toca, se reinicia
  // la etapa actual (mismo botón/flujo que "Reiniciar etapa"). La selección
  // de qué corredores usar es determinística (semilla propia, distinta de
  // la de generación del laberinto) para que sea igual de reproducible que
  // el resto del diseño.
  //
  // La selección distingue dos modos por etapa (stageCfg.priestMode):
  //   - 'critical': el corredor patrullado debe cruzar la ruta más corta
  //     real (BFS) entre entrada y salida, para que esperar al cura sea
  //     parte obligatoria del desafío (etapas 1 y 2).
  //   - 'noncritical': el corredor patrullado NO debe tocar la ruta más
  //     corta en ningún punto — solo ramales/alternativas — para que el
  //     jugador siempre tenga por dónde seguir sin depender de esquivar al
  //     cura (etapa 3).
  // Además, la distancia a la entrada/salida se mide en PASOS reales del
  // laberinto (BFS), no en distancia euclidiana de la grilla interna (que
  // cuenta doble y podía dejar un cura casi pegado al punto de partida).
  // ---------------------------------------------------------------------
  function findCorridors(maze, minLen) {
    const { grid, W, H } = maze;
    const candidates = [];
    for (let y = 0; y < H; y++) {
      let start = null;
      for (let x = 0; x <= W; x++) {
        const open = x < W && grid[y * W + x] === 1;
        if (open && start === null) start = x;
        if ((!open || x === W) && start !== null) {
          const end = open ? x : x - 1;
          if (end - start + 1 >= minLen) candidates.push({ orient: 'h', fixed: y, a: start, b: end });
          start = null;
        }
      }
    }
    for (let x = 0; x < W; x++) {
      let start = null;
      for (let y = 0; y <= H; y++) {
        const open = y < H && grid[y * W + x] === 1;
        if (open && start === null) start = y;
        if ((!open || y === H) && start !== null) {
          const end = open ? y : y - 1;
          if (end - start + 1 >= minLen) candidates.push({ orient: 'v', fixed: x, a: start, b: end });
          start = null;
        }
      }
    }
    return candidates;
  }

  // BFS multi-destino: distancia (en pasos) desde (sx,sy) a cada celda de
  // camino del laberinto. Se usa tanto para medir "colchón" de seguridad
  // cerca de la entrada/salida como, con (1,1) y la celda de salida, para
  // reconstruir la ruta crítica real.
  function bfsDistanceAll(maze, sx, sy) {
    const dist = new Int32Array(maze.W * maze.H).fill(-1);
    dist[sy * maze.W + sx] = 0;
    let queue = [[sx, sy]];
    while (queue.length) {
      const next = [];
      for (const [x, y] of queue) {
        const d = dist[y * maze.W + x];
        const neighbors = [
          [x + 1, y],
          [x - 1, y],
          [x, y + 1],
          [x, y - 1],
        ];
        for (const [nx, ny] of neighbors) {
          if (nx < 0 || ny < 0 || nx >= maze.W || ny >= maze.H) continue;
          if (maze.grid[ny * maze.W + nx] !== 1) continue;
          if (dist[ny * maze.W + nx] !== -1) continue;
          dist[ny * maze.W + nx] = d + 1;
          next.push([nx, ny]);
        }
      }
      queue = next;
    }
    return dist;
  }

  function criticalPathSet(maze, distFromEntrance, tx, ty) {
    // Reconstruye la ruta más corta real caminando "cuesta abajo" en el
    // mapa de distancias desde la salida hasta la entrada.
    const set = new Set();
    let cx = tx;
    let cy = ty;
    set.add(`${cx},${cy}`);
    let guard = maze.W * maze.H; // por si acaso, para no loopear infinito
    while (!(cx === 1 && cy === 1) && guard-- > 0) {
      const d = distFromEntrance[cy * maze.W + cx];
      const neighbors = [
        [cx + 1, cy],
        [cx - 1, cy],
        [cx, cy + 1],
        [cx, cy - 1],
      ];
      let moved = false;
      for (const [nx, ny] of neighbors) {
        if (nx < 0 || ny < 0 || nx >= maze.W || ny >= maze.H) continue;
        if (maze.grid[ny * maze.W + nx] !== 1) continue;
        if (distFromEntrance[ny * maze.W + nx] === d - 1) {
          cx = nx;
          cy = ny;
          set.add(`${cx},${cy}`);
          moved = true;
          break;
        }
      }
      if (!moved) break;
    }
    return set;
  }

  // Constantes de juego usadas para calcular si un corredor da tiempo real
  // de cruzarlo: deben calzar con world.player.speed y con el rango de
  // velocidad de curas usado en buildPriests() más abajo.
  const PLAYER_SPEED_PX = 205;
  const PRIEST_SPEED_MIN = 60;
  const PRIEST_SPEED_MAX = 90;
  const PLAYER_R = 11;
  const PRIEST_R = 12;
  const SAFE_DIST = PLAYER_R + PRIEST_R * 0.85;
  const CROSSING_BUFFER_SEC = 0.5; // margen de reacción exigido, además del tiempo de cruce

  // Para un corredor candidato, calcula la ventana de tiempo CONTINUA más
  // larga (en el peor caso: el cura más rápido del rango) durante la cual
  // el cura queda lejos de TODO el tramo crítico que contiene ese corredor,
  // de un solo lado de su recorrido de ping-pong. Como el cura se mueve a
  // velocidad constante, el tiempo en un sub-tramo espacial es exactamente
  // proporcional a su longitud — no hace falta simular frame a frame.
  function corridorClearWindowSeconds(c, cs, inset, criticalSet) {
    const minPx = c.a * cs + cs / 2 + inset;
    const maxPx = c.b * cs + cs / 2 - inset;
    if (maxPx <= minPx) return 0;
    let critMin = Infinity;
    let critMax = -Infinity;
    let hasCritical = false;
    for (let p = c.a; p <= c.b; p++) {
      const cx = c.orient === 'h' ? p : c.fixed;
      const cy = c.orient === 'h' ? c.fixed : p;
      if (criticalSet.has(`${cx},${cy}`)) {
        hasCritical = true;
        const px = p * cs + cs / 2;
        if (px < critMin) critMin = px;
        if (px > critMax) critMax = px;
      }
    }
    if (!hasCritical) return Infinity; // no hay ruta crítica que cruzar aquí
    const dangerMin = critMin - SAFE_DIST;
    const dangerMax = critMax + SAFE_DIST;
    const leftClearPx = Math.max(0, Math.min(maxPx, dangerMin) - minPx);
    const rightClearPx = Math.max(0, maxPx - Math.max(minPx, dangerMax));
    const maxClearPx = Math.max(leftClearPx, rightClearPx);
    return maxClearPx / PRIEST_SPEED_MAX; // peor caso: el cura más rápido posible
  }

  function corridorCrossSeconds(c, cs) {
    const lenPx = (c.b - c.a + 1) * cs;
    return lenPx / PLAYER_SPEED_PX;
  }

  function selectPatrols(maze, stageCfg, count, mode, criticalSet, distEnt, distExit, usedCellsShared) {
    if (!count) return [];
    const cs = stageCfg.cellSize;
    const inset = cs * 0.75;
    const usedCells = usedCellsShared || new Set();
    // Intentos progresivamente menos estrictos, por si una semilla futura
    // no deja suficientes corredores válidos con los parámetros ideales.
    const attempts = [
      { minLen: 5, entBuffer: 6, exitBuffer: 5 },
      { minLen: 5, entBuffer: 4, exitBuffer: 3 },
      { minLen: 4, entBuffer: 3, exitBuffer: 2 },
      { minLen: 4, entBuffer: 1, exitBuffer: 1 },
    ];

    for (const attempt of attempts) {
      let candidates = findCorridors(maze, attempt.minLen).map((c) => {
        let minDEnt = Infinity;
        let minDExit = Infinity;
        let overlap = 0;
        for (let p = c.a; p <= c.b; p++) {
          const cx = c.orient === 'h' ? p : c.fixed;
          const cy = c.orient === 'h' ? c.fixed : p;
          const de = distEnt[cy * maze.W + cx];
          const dx = distExit[cy * maze.W + cx];
          if (de >= 0 && de < minDEnt) minDEnt = de;
          if (dx >= 0 && dx < minDExit) minDExit = dx;
          if (criticalSet.has(`${cx},${cy}`)) overlap++;
        }
        const windowSec = corridorClearWindowSeconds(c, cs, inset, criticalSet);
        const crossSec = corridorCrossSeconds(c, cs);
        return { ...c, minDEnt, minDExit, overlap, windowSec, crossSec, margin: windowSec - crossSec };
      });

      candidates = candidates.filter((c) => c.minDEnt > attempt.entBuffer && c.minDExit > attempt.exitBuffer);
      if (mode === 'critical') {
        candidates = candidates.filter((c) => c.overlap > 0);
        // El margen de seguridad NUNCA se relaja, en NINGÚN intento — solo
        // se relajan minLen/entBuffer/exitBuffer buscando más candidatos.
        // Relajar el margen fue exactamente el bug que dejaba curas
        // imposibles de esquivar cuando se pedían más curas de los que el
        // laberinto tenía espacio para ofrecer con seguridad.
        candidates = candidates.filter((c) => c.margin >= CROSSING_BUFFER_SEC);
        candidates.sort((a, b) => b.margin - a.margin); // preferir los de mejor margen
      } else {
        candidates = candidates.filter((c) => c.overlap === 0);
        const rand = mulberry32(stageCfg.seed + 777);
        for (let i = candidates.length - 1; i > 0; i--) {
          const j = Math.floor(rand() * (i + 1));
          const tmp = candidates[i];
          candidates[i] = candidates[j];
          candidates[j] = tmp;
        }
      }

      const chosen = [];
      for (const c of candidates) {
        if (chosen.length >= count) break;
        let overlapUsed = false;
        for (let p = c.a; p <= c.b; p++) {
          const key = c.orient === 'h' ? `${p},${c.fixed}` : `${c.fixed},${p}`;
          if (usedCells.has(key)) {
            overlapUsed = true;
            break;
          }
        }
        if (overlapUsed) continue;
        for (let p = c.a; p <= c.b; p++) {
          const key = c.orient === 'h' ? `${p},${c.fixed}` : `${c.fixed},${p}`;
          usedCells.add(key);
        }
        chosen.push(c);
      }

      if (chosen.length >= count) return chosen;
      if (attempt === attempts[attempts.length - 1] && chosen.length > 0) return chosen;
    }
    return [];
  }

  function buildPriests(maze, stageCfg) {
    const criticalCount = stageCfg.priestCriticalCount || 0;
    const noncriticalCount = stageCfg.priestNoncriticalCount || 0;
    if (!criticalCount && !noncriticalCount) {
      maze.criticalSet = new Set();
      return [];
    }
    const exGx = stageCfg.cols * 2 - 1;
    const exGy = stageCfg.rows * 2 - 1;
    const distEnt = bfsDistanceAll(maze, 1, 1);
    const distExit = bfsDistanceAll(maze, exGx, exGy);
    const criticalSet = criticalPathSet(maze, distEnt, exGx, exGy);
    maze.criticalSet = criticalSet; // se conserva por si se quiere depurar/dibujar

    const cs = stageCfg.cellSize;
    const inset = cs * 0.75; // margen para que el cura no roce la esquina/muro al llegar al extremo

    // Un único pool de celdas "usadas" compartido entre la tanda de curas
    // en ruta crítica (con margen de seguridad garantizado) y la tanda en
    // rutas alternativas (fuera de la ruta crítica), para que nunca se
    // solapen entre sí aunque vengan de corredores distintos.
    const usedCellsShared = new Set();
    const criticalPatrols = selectPatrols(maze, stageCfg, criticalCount, 'critical', criticalSet, distEnt, distExit, usedCellsShared);
    const noncriticalPatrols = selectPatrols(maze, stageCfg, noncriticalCount, 'noncritical', criticalSet, distEnt, distExit, usedCellsShared);
    const patrols = [...criticalPatrols, ...noncriticalPatrols];

    const rand = mulberry32(stageCfg.seed + 999);
    return patrols.map((p) => {
      const axis = p.orient === 'h' ? 'x' : 'y';
      const minPx = p.a * cs + cs / 2 + inset;
      const maxPx = p.b * cs + cs / 2 - inset;
      const fixedPx = p.fixed * cs + cs / 2;
      const speed = PRIEST_SPEED_MIN + rand() * (PRIEST_SPEED_MAX - PRIEST_SPEED_MIN); // más lento que Gabriel, da tiempo a esperar
      const startT = rand();
      return {
        axis,
        fixedPx,
        min: Math.min(minPx, maxPx),
        max: Math.max(minPx, maxPx),
        pos: Math.min(minPx, maxPx) + startT * Math.abs(maxPx - minPx),
        dir: rand() < 0.5 ? 1 : -1,
        speed,
        r: PRIEST_R,
        bob: rand() * Math.PI * 2,
      };
    });
  }

  // ---------------------------------------------------------------------
  // Markup + CSS (Shadow DOM)
  // ---------------------------------------------------------------------
  const style = document.createElement('style');
  style.textContent = `
    :host {
      all: initial;
      position: absolute;
      inset: 0;
      z-index: 5;
      display: none;
      font-family: Georgia, 'Times New Roman', serif;
    }
    :host([open]) { display: block; }
    * { box-sizing: border-box; }
    .wrap {
      position: absolute;
      inset: 0;
      background: #000;
      overflow: hidden;
      user-select: none;
      -webkit-user-select: none;
      touch-action: none;
    }
    canvas { display: block; width: 100%; height: 100%; }

    .hud {
      position: absolute;
      top: 0; left: 0; right: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
      background: linear-gradient(to bottom, rgba(0,0,0,.55), rgba(0,0,0,0));
      pointer-events: none;
      color: #f4ecd8;
    }
    .hud-titles { pointer-events: none; }
    .hud-stage { font-size: 13px; letter-spacing: .08em; text-transform: uppercase; opacity: .85; }
    .hud-subtitle { font-size: 15px; font-weight: bold; margin-top: 2px; text-shadow: 0 1px 3px rgba(0,0,0,.6); }
    .hud-dots { display: flex; gap: 6px; margin-top: 6px; }
    .dot { width: 9px; height: 9px; border-radius: 50%; background: rgba(244,236,216,.35); border: 1px solid rgba(244,236,216,.6); }
    .dot.done { background: #d8c26a; }
    .dot.current { background: #f4ecd8; box-shadow: 0 0 6px rgba(244,236,216,.9); }

    .restart-btn {
      pointer-events: auto;
      background: rgba(0,0,0,.45);
      border: 1px solid rgba(244,236,216,.5);
      color: #f4ecd8;
      font-family: inherit;
      font-size: 12px;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      letter-spacing: .03em;
    }
    .restart-btn:hover { background: rgba(0,0,0,.65); }
    .restart-btn:active { transform: translateY(1px); }

    .hint {
      position: absolute;
      bottom: 18px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,.5);
      color: #f4ecd8;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      letter-spacing: .02em;
      opacity: 1;
      transition: opacity .8s ease;
      pointer-events: none;
      white-space: nowrap;
    }
    .hint.fade { opacity: 0; }

    .minimap {
      position: absolute;
      top: 10px;
      right: 12px;
      border: 2px solid rgba(244,236,216,.7);
      border-radius: 4px;
      background: rgba(0,0,0,.35);
      box-shadow: 0 2px 8px rgba(0,0,0,.4);
    }

    .dpad {
      position: absolute;
      right: 18px;
      bottom: 18px;
      width: 132px;
      height: 132px;
      display: grid;
      grid-template-columns: 44px 44px 44px;
      grid-template-rows: 44px 44px 44px;
      gap: 0;
      opacity: .85;
    }
    .dpad button {
      pointer-events: auto;
      background: rgba(0,0,0,.45);
      border: 1px solid rgba(244,236,216,.55);
      color: #f4ecd8;
      font-size: 18px;
      cursor: pointer;
    }
    .dpad button:active { background: rgba(244,236,216,.35); }
    .dpad .up { grid-column: 2; grid-row: 1; border-radius: 8px 8px 0 0; }
    .dpad .left { grid-column: 1; grid-row: 2; border-radius: 8px 0 0 8px; }
    .dpad .right { grid-column: 3; grid-row: 2; border-radius: 0 8px 8px 0; }
    .dpad .down { grid-column: 2; grid-row: 3; border-radius: 0 0 8px 8px; }
    .dpad .mid { grid-column: 2; grid-row: 2; background: rgba(0,0,0,.2); border-color: rgba(244,236,216,.25); }

    .overlay {
      position: absolute;
      inset: 0;
      background: rgba(10,8,4,.82);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .overlay.show { display: flex; }
    .card {
      max-width: 480px;
      width: 100%;
      background: linear-gradient(180deg, #f6efe0, #ece0c4);
      border: 1px solid #b89f6d;
      border-radius: 10px;
      box-shadow: 0 12px 40px rgba(0,0,0,.5);
      padding: 28px 26px;
      color: #3a2f1f;
      text-align: center;
    }
    .card .eyebrow {
      font-size: 12px;
      letter-spacing: .12em;
      text-transform: uppercase;
      color: #8a7040;
      margin-bottom: 6px;
    }
    .card h2 {
      font-size: 22px;
      margin: 0 0 10px;
      line-height: 1.25;
    }
    .card p {
      font-size: 15px;
      line-height: 1.55;
      margin: 0 0 20px;
      color: #4a3d28;
    }
    .card .path {
      font-size: 13px;
      color: #6d5a37;
      margin-bottom: 18px;
      font-style: italic;
    }
    .card button.primary {
      pointer-events: auto;
      font-family: inherit;
      background: #6b4f2a;
      color: #f6efe0;
      border: none;
      padding: 11px 26px;
      border-radius: 6px;
      font-size: 15px;
      cursor: pointer;
      letter-spacing: .02em;
    }
    .card button.primary:hover { background: #7d5c32; }
    .card button.primary:active { transform: translateY(1px); }

    .card.caught { background: linear-gradient(180deg, #f6e0e0, #ecc4c4); border-color: #b86d6d; }
    .card.caught .eyebrow { color: #8a4040; }
  `;

  root.innerHTML = '';
  root.appendChild(style);

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  wrap.innerHTML = `
    <canvas class="game"></canvas>
    <canvas class="minimap"></canvas>
    <div class="hud">
      <div class="hud-titles">
        <div class="hud-stage"></div>
        <div class="hud-subtitle"></div>
        <div class="hud-dots">
          <span class="dot" data-i="0"></span>
          <span class="dot" data-i="1"></span>
          <span class="dot" data-i="2"></span>
        </div>
      </div>
      <button class="restart-btn" type="button">Reiniciar etapa</button>
    </div>
    <div class="hint">Usa las flechas o WASD para moverte</div>
    <div class="dpad">
      <button class="up" type="button" aria-label="Arriba">▲</button>
      <button class="left" type="button" aria-label="Izquierda">◀</button>
      <span class="mid"></span>
      <button class="right" type="button" aria-label="Derecha">▶</button>
      <button class="down" type="button" aria-label="Abajo">▼</button>
    </div>
    <div class="overlay intro">
      <div class="card">
        <div class="eyebrow"></div>
        <h2></h2>
        <p></p>
        <div class="path"></div>
        <button class="primary" type="button">Comenzar</button>
      </div>
    </div>
    <div class="overlay done">
      <div class="card">
        <div class="eyebrow">Etapa superada</div>
        <h2></h2>
        <p></p>
        <button class="primary" type="button">Continuar</button>
      </div>
    </div>
    <div class="overlay final">
      <div class="card">
        <div class="eyebrow">Ciudad del Vaticano</div>
        <h2>Gabriel ha completado su recorrido</h2>
        <p>Desde la Plaza de San Pedro hasta la Biblioteca Apostólica, cada laberinto de piedra y de poder ha quedado atrás. La historia continúa.</p>
        <button class="primary" type="button">Continuar</button>
      </div>
    </div>
    <div class="overlay caught">
      <div class="card caught">
        <div class="eyebrow">Descubierto</div>
        <h2>Un cura lo ha visto merodeando</h2>
        <p>Gabriel retrocede antes de despertar sospechas. Tendrá que volver a intentarlo desde el inicio de esta etapa.</p>
        <button class="primary" type="button">Reintentar</button>
      </div>
    </div>
  `;
  root.appendChild(wrap);

  const canvas = wrap.querySelector('canvas.game');
  const ctx = canvas.getContext('2d');
  const miniCanvas = wrap.querySelector('canvas.minimap');
  const miniCtx = miniCanvas.getContext('2d');
  const hudStage = wrap.querySelector('.hud-stage');
  const hudSubtitle = wrap.querySelector('.hud-subtitle');
  const dots = Array.from(wrap.querySelectorAll('.dot'));
  const restartBtn = wrap.querySelector('.restart-btn');
  const hint = wrap.querySelector('.hint');

  const introOverlay = wrap.querySelector('.overlay.intro');
  const introEyebrow = introOverlay.querySelector('.eyebrow');
  const introH2 = introOverlay.querySelector('h2');
  const introP = introOverlay.querySelector('p');
  const introPath = introOverlay.querySelector('.path');
  const introBtn = introOverlay.querySelector('button.primary');

  const doneOverlay = wrap.querySelector('.overlay.done');
  const doneH2 = doneOverlay.querySelector('h2');
  const doneP = doneOverlay.querySelector('p');
  const doneBtn = doneOverlay.querySelector('button.primary');

  const finalOverlay = wrap.querySelector('.overlay.final');
  const finalBtn = finalOverlay.querySelector('button.primary');

  const caughtOverlay = wrap.querySelector('.overlay.caught');
  const caughtBtn = caughtOverlay.querySelector('button.primary');

  const dpad = {
    up: wrap.querySelector('.dpad .up'),
    down: wrap.querySelector('.dpad .down'),
    left: wrap.querySelector('.dpad .left'),
    right: wrap.querySelector('.dpad .right'),
  };

  // ---------------------------------------------------------------------
  // Estado del juego
  // ---------------------------------------------------------------------
  const STATE = { INTRO: 'intro', PLAY: 'play', STAGE_DONE: 'stage_done', ALL_DONE: 'all_done', CAUGHT: 'caught' };

  const world = {
    state: STATE.INTRO,
    stageIndex: 0,
    maze: null, // { grid, W, H, cellSize, theme, entrancePx, exitPx }
    player: { x: 0, y: 0, r: 11, speed: 205 },
    keys: { up: false, down: false, left: false, right: false },
    camX: 0,
    camY: 0,
    lastTs: 0,
    hintTimer: 0,
    running: false,
  };

  function currentStage() {
    return STAGES[world.stageIndex];
  }

  function buildMaze(stageCfg) {
    const { grid, W, H } = generateMaze(stageCfg.cols, stageCfg.rows, stageCfg.seed);
    const cellSize = stageCfg.cellSize;
    const entrancePx = { x: 1 * cellSize + cellSize / 2, y: 1 * cellSize + cellSize / 2 };
    const exitCellX = stageCfg.cols * 2 - 1;
    const exitCellY = stageCfg.rows * 2 - 1;
    const exitPx = { x: exitCellX * cellSize + cellSize / 2, y: exitCellY * cellSize + cellSize / 2 };
    const theme = THEMES[stageCfg.theme];
    const maze = {
      grid,
      W,
      H,
      cellSize,
      theme,
      entrancePx,
      exitPx,
      floorPattern: null,
      wallColorCache: true,
    };
    maze.floorTile = makeFloorTile(theme, cellSize);
    maze.wallTile = makeWallTile(theme, cellSize);
    maze.priests = buildPriests(maze, stageCfg);
    return maze;
  }

  function isWallAtCell(maze, gx, gy) {
    if (gx < 0 || gy < 0 || gx >= maze.W || gy >= maze.H) return true;
    return maze.grid[gy * maze.W + gx] !== 1;
  }

  function isWallAtPixel(maze, px, py) {
    const gx = Math.floor(px / maze.cellSize);
    const gy = Math.floor(py / maze.cellSize);
    return isWallAtCell(maze, gx, gy);
  }

  // ---------------------------------------------------------------------
  // Texturas de piso y muro (offscreen canvas, cacheadas por tema —
  // mismo patrón que snowyVariant()/terrainTexture() de ruta7-race).
  // ---------------------------------------------------------------------
  const floorTileCache = {};
  const wallTileCache = {};

  function makeFloorTile(theme, cellSize) {
    const key = theme.floorA + theme.floorB + cellSize;
    if (floorTileCache[key]) return floorTileCache[key];
    const size = cellSize;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const tctx = c.getContext('2d');
    tctx.fillStyle = theme.floorA;
    tctx.fillRect(0, 0, size, size);
    const rand = mulberry32(1337);
    for (let i = 0; i < 10; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const r = 1 + rand() * 2.2;
      tctx.fillStyle = theme.floorB;
      tctx.globalAlpha = 0.5 + rand() * 0.3;
      tctx.beginPath();
      tctx.arc(x, y, r, 0, Math.PI * 2);
      tctx.fill();
    }
    tctx.globalAlpha = 1;
    floorTileCache[key] = c;
    return c;
  }

  function makeWallTile(theme, cellSize) {
    const key = theme.wall + theme.wallDark + cellSize;
    if (wallTileCache[key]) return wallTileCache[key];
    const size = cellSize;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const tctx = c.getContext('2d');
    tctx.fillStyle = theme.wall;
    tctx.fillRect(0, 0, size, size);
    tctx.fillStyle = theme.wallTop;
    tctx.fillRect(0, 0, size, Math.max(2, size * 0.18));
    tctx.strokeStyle = theme.wallDark;
    tctx.lineWidth = 1;
    tctx.strokeRect(0.5, 0.5, size - 1, size - 1);
    wallTileCache[key] = c;
    return c;
  }

  function buildMinimap(maze) {
    const scale = 3;
    miniCanvas.width = maze.W * scale;
    miniCanvas.height = maze.H * scale;
    miniCanvas.style.width = maze.W * scale + 'px';
    miniCanvas.style.height = maze.H * scale + 'px';
    miniCtx.fillStyle = 'rgba(0,0,0,.4)';
    miniCtx.fillRect(0, 0, miniCanvas.width, miniCanvas.height);
    for (let y = 0; y < maze.H; y++) {
      for (let x = 0; x < maze.W; x++) {
        if (maze.grid[y * maze.W + x] === 1) {
          miniCtx.fillStyle = 'rgba(244,236,216,.85)';
          miniCtx.fillRect(x * scale, y * scale, scale, scale);
        }
      }
    }
    maze.minimapScale = scale;
  }

  function drawMinimapOverlay(maze, player) {
    const s = maze.minimapScale;
    // Salida (parpadeo suave)
    const pulse = 0.55 + 0.45 * Math.sin(performance.now() / 300);
    miniCtx.save();
    miniCtx.globalAlpha = pulse;
    miniCtx.fillStyle = maze.theme.accent;
    const exGx = Math.floor(maze.exitPx.x / maze.cellSize);
    const exGy = Math.floor(maze.exitPx.y / maze.cellSize);
    miniCtx.beginPath();
    miniCtx.arc(exGx * s + s / 2, exGy * s + s / 2, s * 1.4, 0, Math.PI * 2);
    miniCtx.fill();
    miniCtx.restore();

    // Jugador
    const pgx = player.x / maze.cellSize;
    const pgy = player.y / maze.cellSize;
    miniCtx.fillStyle = '#e33';
    miniCtx.beginPath();
    miniCtx.arc(pgx * s, pgy * s, s * 1.3, 0, Math.PI * 2);
    miniCtx.fill();
  }

  // ---------------------------------------------------------------------
  // Dibujo de Gabriel (personaje) — figura simple vista desde arriba
  // (cabello + hombros), dibujada con primitivas de canvas, mismo criterio
  // de estilo que los curas: hombros/blazer en óvalo, cabello como círculo
  // central, y la correa de su bolso cruzada como detalle distintivo (su
  // gesto característico en la foto de referencia). No es una foto — es
  // una silueta reconocible, igual de simple que la de los curas.
  // ---------------------------------------------------------------------
  function drawGabriel(g, x, y, r, facing, moving) {
    const visualR = r * 1.3;
    const size = visualR * 2.7; // la imagen incluye hombros más anchos que un círculo simple
    const bob = moving ? Math.sin(performance.now() / 140) * 0.05 : 0; // leve pulso de escala al caminar

    g.save();

    // sombra
    g.fillStyle = 'rgba(0,0,0,.3)';
    g.beginPath();
    g.ellipse(x, y + visualR * 0.72, visualR * 0.85, visualR * 0.35, 0, 0, Math.PI * 2);
    g.fill();

    // vista superior real de Gabriel (cabello + hombros), rotada para
    // seguir la dirección real de movimiento (WASD/flechas). La imagen
    // fuente está compuesta "de espaldas" mirando hacia arriba de la
    // pantalla por defecto, así que se compensa con +90° (Math.PI/2) para
    // que 'facing' (0 = derecha) quede alineado correctamente.
    if (GABRIEL_TOPDOWN_IMG.complete && GABRIEL_TOPDOWN_IMG.naturalWidth) {
      const s = size * (1 + bob);
      g.translate(x, y);
      g.rotate(facing + Math.PI / 2);
      g.drawImage(GABRIEL_TOPDOWN_IMG, -s / 2, -s / 2, s, s);
    } else {
      // reserva mientras carga (debería ser casi instantáneo, archivo local)
      g.fillStyle = '#4f4d49';
      g.beginPath();
      g.arc(x, y, visualR, 0, Math.PI * 2);
      g.fill();
    }

    g.restore();
  }

  // ---------------------------------------------------------------------
  // Dibujo de un cura patrullando — figura vista desde arriba, dibujada con
  // primitivas de canvas (sotana negra ovalada + cuello clerical blanco +
  // bonete). No es una foto: es la silueta reconocible de una sotana desde
  // arriba, con un ligero bamboleo al caminar para que se lea como "en
  // movimiento" sin necesitar sprites.
  // ---------------------------------------------------------------------
  function drawPriest(g, x, y, r, axis, dirSign, walkPhase) {
    const visualR = r * 1.35;
    const size = visualR * 2.7;
    const bob = Math.sin(walkPhase) * 0.05; // leve pulso de escala al caminar

    // Igual criterio que Gabriel: la imagen viene "de espaldas" mirando
    // hacia arriba de la pantalla por defecto, se compensa con +90°.
    let facing;
    if (axis === 'x') facing = dirSign >= 0 ? 0 : Math.PI;
    else facing = dirSign >= 0 ? Math.PI / 2 : -Math.PI / 2;

    g.save();

    // sombra
    g.fillStyle = 'rgba(0,0,0,.3)';
    g.beginPath();
    g.ellipse(x, y + visualR * 0.75, visualR * 0.8, visualR * 0.32, 0, 0, Math.PI * 2);
    g.fill();

    // vista superior real del cura (cabello canoso + solideo + sotana),
    // rotada según hacia dónde patrulla (izquierda/derecha o arriba/abajo)
    if (CURA_TOPDOWN_IMG.complete && CURA_TOPDOWN_IMG.naturalWidth) {
      const s = size * (1 + bob);
      g.translate(x, y);
      g.rotate(facing + Math.PI / 2);
      g.drawImage(CURA_TOPDOWN_IMG, -s / 2, -s / 2, s, s);
    } else {
      // reserva mientras carga (debería ser casi instantáneo, archivo local)
      g.fillStyle = '#181614';
      g.beginPath();
      g.arc(x, y, visualR, 0, Math.PI * 2);
      g.fill();
    }

    g.restore();
  }

  // Medallón de entrada/salida — foto circular real del lugar, a tamaño de
  // 3x3 celdas del laberinto (mucho más grande que el marcador anterior),
  // con anillo decorativo ya horneado en la propia imagen. Mientras la
  // imagen carga (debería ser casi instantáneo, son archivos locales) se
  // dibuja un círculo de reserva para no dejar el punto vacío.
  function drawMarker(g, x, y, label, theme, kind, image, cellSize) {
    const diameter = cellSize * 3; // medallón de 3x3 celdas
    const radius = diameter / 2;

    g.save();
    if (image && image.complete && image.naturalWidth) {
      g.drawImage(image, x - radius, y - radius, diameter, diameter);
    } else {
      g.fillStyle = kind === 'exit' ? theme.accent : 'rgba(244,236,216,.55)';
      g.beginPath();
      g.arc(x, y, radius, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = theme.text;
      g.globalAlpha = 0.6;
      g.lineWidth = 3;
      g.stroke();
      g.globalAlpha = 1;
    }
    g.restore();

    g.save();
    g.font = 'bold 13px Georgia, serif';
    g.textAlign = 'center';
    const ty = y - radius - 10;
    const tw = g.measureText(label).width;
    g.fillStyle = 'rgba(0,0,0,.6)';
    g.fillRect(x - tw / 2 - 7, ty - 15, tw + 14, 20);
    g.fillStyle = '#f4ecd8';
    g.fillText(label, x, ty);
    g.restore();
  }

  // ---------------------------------------------------------------------
  // Render principal
  // ---------------------------------------------------------------------
  function resize() {
    const rect = wrap.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    world.viewW = w;
    world.viewH = h;
  }

  function render() {
    const maze = world.maze;
    if (!maze) return;
    const { viewW, viewH } = world;
    const worldW = maze.W * maze.cellSize;
    const worldH = maze.H * maze.cellSize;

    let camX = world.player.x - viewW / 2;
    let camY = world.player.y - viewH / 2;
    camX = Math.max(0, Math.min(camX, Math.max(0, worldW - viewW)));
    camY = Math.max(0, Math.min(camY, Math.max(0, worldH - viewH)));
    if (worldW < viewW) camX = -(viewW - worldW) / 2;
    if (worldH < viewH) camY = -(viewH - worldH) / 2;
    world.camX = camX;
    world.camY = camY;

    ctx.fillStyle = maze.theme.bg;
    ctx.fillRect(0, 0, viewW, viewH);

    ctx.save();
    ctx.translate(-camX, -camY);

    const cs = maze.cellSize;
    const startGx = Math.max(0, Math.floor(camX / cs) - 1);
    const endGx = Math.min(maze.W, Math.ceil((camX + viewW) / cs) + 1);
    const startGy = Math.max(0, Math.floor(camY / cs) - 1);
    const endGy = Math.min(maze.H, Math.ceil((camY + viewH) / cs) + 1);

    for (let gy = startGy; gy < endGy; gy++) {
      for (let gx = startGx; gx < endGx; gx++) {
        const wallCell = maze.grid[gy * maze.W + gx] !== 1;
        const tile = wallCell ? maze.wallTile : maze.floorTile;
        ctx.drawImage(tile, gx * cs, gy * cs);
      }
    }

    drawMarker(ctx, maze.entrancePx.x, maze.entrancePx.y, currentStage().entranceLabel, maze.theme, 'entrance', currentStage().entranceImage, maze.cellSize);
    drawMarker(ctx, maze.exitPx.x, maze.exitPx.y, currentStage().exitLabel, maze.theme, 'exit', currentStage().exitImage, maze.cellSize);

    for (const priest of maze.priests) {
      const px = priest.axis === 'x' ? priest.pos : priest.fixedPx;
      const py = priest.axis === 'x' ? priest.fixedPx : priest.pos;
      drawPriest(ctx, px, py, priest.r, priest.axis, priest.dir, priest.bob);
    }

    const p = world.player;
    drawGabriel(ctx, p.x, p.y, p.r, p.facing || 0, !!p.moving);

    ctx.restore();

    drawMinimapOverlay(maze, world.player);
  }

  // ---------------------------------------------------------------------
  // Física / colisión
  // ---------------------------------------------------------------------
  function canStandAt(maze, px, py, r) {
    const corners = [
      [px - r, py - r],
      [px + r, py - r],
      [px - r, py + r],
      [px + r, py + r],
    ];
    for (const [cx, cy] of corners) {
      if (isWallAtPixel(maze, cx, cy)) return false;
    }
    return true;
  }

  function update(dt) {
    if (world.state !== STATE.PLAY) return;
    const maze = world.maze;
    const p = world.player;
    const k = world.keys;

    let dx = (k.right ? 1 : 0) - (k.left ? 1 : 0);
    let dy = (k.down ? 1 : 0) - (k.up ? 1 : 0);
    p.moving = dx !== 0 || dy !== 0;
    if (dx !== 0 || dy !== 0) {
      const len = Math.hypot(dx, dy);
      dx /= len;
      dy /= len;
      p.facing = Math.atan2(dy, dx);

      const nx = p.x + dx * p.speed * dt;
      if (canStandAt(maze, nx, p.y, p.r)) p.x = nx;
      const ny = p.y + dy * p.speed * dt;
      if (canStandAt(maze, p.x, ny, p.r)) p.y = ny;
    }

    const distToExit = Math.hypot(p.x - maze.exitPx.x, p.y - maze.exitPx.y);
    if (distToExit < maze.cellSize * 0.55) {
      onStageReached();
      return;
    }

    // Curas patrullando: se mueven en ping-pong por su corredor y animan
    // su bamboleo de caminata; si tocan a Gabriel, la etapa se reinicia.
    for (const priest of maze.priests) {
      priest.pos += priest.dir * priest.speed * dt;
      if (priest.pos > priest.max) {
        priest.pos = priest.max;
        priest.dir = -1;
      } else if (priest.pos < priest.min) {
        priest.pos = priest.min;
        priest.dir = 1;
      }
      priest.bob += dt * 6;

      const px = priest.axis === 'x' ? priest.pos : priest.fixedPx;
      const py = priest.axis === 'x' ? priest.fixedPx : priest.pos;
      const dist = Math.hypot(p.x - px, p.y - py);
      if (dist < p.r + priest.r * 0.85) {
        onCaught();
        return;
      }
    }

    if (world.hintTimer > 0) {
      world.hintTimer -= dt;
      if (world.hintTimer <= 0) hint.classList.add('fade');
    }
  }

  // ---------------------------------------------------------------------
  // Flujo de estados / overlays
  // ---------------------------------------------------------------------
  function refreshDots() {
    dots.forEach((d, i) => {
      d.classList.toggle('done', i < world.stageIndex);
      d.classList.toggle('current', i === world.stageIndex && world.state !== STATE.ALL_DONE);
    });
  }

  function showIntro() {
    const cfg = currentStage();
    world.state = STATE.INTRO;
    hudStage.textContent = `${cfg.title} · ${cfg.zone}`;
    hudSubtitle.textContent = cfg.subtitle;
    refreshDots();

    introEyebrow.textContent = cfg.zone;
    introH2.textContent = cfg.subtitle;
    introP.textContent = cfg.intro;
    introPath.textContent = `Desde “${cfg.entranceLabel}” hasta “${cfg.exitLabel}”`;
    introOverlay.classList.add('show');
    doneOverlay.classList.remove('show');
    finalOverlay.classList.remove('show');
  }

  function startStage() {
    const cfg = currentStage();
    const maze = buildMaze(cfg);
    world.maze = maze;
    world.player.x = maze.entrancePx.x;
    world.player.y = maze.entrancePx.y;
    world.player.facing = 0;
    world.keys = { up: false, down: false, left: false, right: false };
    buildMinimap(maze);
    resize();
    world.state = STATE.PLAY;
    introOverlay.classList.remove('show');
    caughtOverlay.classList.remove('show');
    hint.classList.remove('fade');
    world.hintTimer = 4.5;
    refreshDots();
  }

  function onStageReached() {
    if (world.state !== STATE.PLAY) return;
    const cfg = currentStage();
    if (world.stageIndex >= STAGES.length - 1) {
      world.state = STATE.ALL_DONE;
      refreshDots();
      finalOverlay.classList.add('show');
    } else {
      world.state = STATE.STAGE_DONE;
      doneH2.textContent = cfg.exitLabel;
      doneP.textContent = cfg.complete;
      doneOverlay.classList.add('show');
    }
  }

  function goToNextStage() {
    doneOverlay.classList.remove('show');
    world.stageIndex += 1;
    showIntro();
  }

  function finishGame() {
    finalOverlay.classList.remove('show');
    // No nos cerramos a nosotros mismos aquí: laberinto-action.js escucha
    // este evento y llama a el.close() (mismo contrato que puzzle-action.js
    // con 'puzzle:cifrado-completo' → el.close()), así que solo avisamos.
    self.dispatchEvent(
      new CustomEvent('laberinto:completado', { bubbles: true, composed: true, detail: { escena: 32 } })
    );
  }

  function restartStage() {
    if (world.state !== STATE.PLAY) return;
    startStage();
  }

  function onCaught() {
    if (world.state !== STATE.PLAY) return;
    world.state = STATE.CAUGHT;
    caughtOverlay.classList.add('show');
  }

  function retryAfterCaught() {
    caughtOverlay.classList.remove('show');
    startStage();
  }

  // ---------------------------------------------------------------------
  // Input: teclado + d-pad táctil
  // ---------------------------------------------------------------------
  const KEY_MAP = {
    ArrowUp: 'up', KeyW: 'up',
    ArrowDown: 'down', KeyS: 'down',
    ArrowLeft: 'left', KeyA: 'left',
    ArrowRight: 'right', KeyD: 'right',
  };

  function onKeyDown(e) {
    if (!self.hasAttribute('open')) return;
    const dir = KEY_MAP[e.code];
    if (!dir) return;
    world.keys[dir] = true;
    e.preventDefault();
  }
  function onKeyUp(e) {
    if (!self.hasAttribute('open')) return;
    const dir = KEY_MAP[e.code];
    if (!dir) return;
    world.keys[dir] = false;
    e.preventDefault();
  }

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  function bindDpad(el, dir) {
    const press = (ev) => {
      ev.preventDefault();
      world.keys[dir] = true;
    };
    const release = (ev) => {
      ev.preventDefault();
      world.keys[dir] = false;
    };
    el.addEventListener('pointerdown', press);
    el.addEventListener('pointerup', release);
    el.addEventListener('pointerleave', release);
    el.addEventListener('pointercancel', release);
  }
  bindDpad(dpad.up, 'up');
  bindDpad(dpad.down, 'down');
  bindDpad(dpad.left, 'left');
  bindDpad(dpad.right, 'right');

  introBtn.addEventListener('click', startStage);
  doneBtn.addEventListener('click', goToNextStage);
  finalBtn.addEventListener('click', finishGame);
  restartBtn.addEventListener('click', restartStage);
  caughtBtn.addEventListener('click', retryAfterCaught);

  window.addEventListener('resize', () => {
    if (self.hasAttribute('open')) resize();
  });

  // ---------------------------------------------------------------------
  // Bucle de animación (siempre agendado; se sale rápido si está cerrado)
  // ---------------------------------------------------------------------
  function loop(ts) {
    requestAnimationFrame(loop);
    if (!self.hasAttribute('open')) return;
    if (!world.lastTs) world.lastTs = ts;
    let dt = (ts - world.lastTs) / 1000;
    world.lastTs = ts;
    if (dt > 0.05) dt = 0.05; // evita saltos grandes si la pestaña estuvo en background
    update(dt);
    render();
  }
  requestAnimationFrame(loop);

  // ---------------------------------------------------------------------
  // API pública
  // ---------------------------------------------------------------------
  self.open = function () {
    self.setAttribute('open', '');
    world.stageIndex = 0;
    world.lastTs = 0;
    doneOverlay.classList.remove('show');
    finalOverlay.classList.remove('show');
    caughtOverlay.classList.remove('show');
    requestAnimationFrame(() => {
      resize();
      showIntro();
    });
  };

  self.close = function () {
    self.removeAttribute('open');
    world.keys = { up: false, down: false, left: false, right: false };
  };
}

customElements.define('vaticano-maze', VaticanoMaze);

})();
