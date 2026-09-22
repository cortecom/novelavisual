/*!
 * rune-puzzle.js
 * Minijuego "El Cifrado de las Tres Ciudades" — componente independiente
 * para integrarse en Monogatari como un Web Component (<rune-puzzle>).
 *
 * Uso:
 *   1. Copia este archivo y "mare-nostrum-bg.png" a tu carpeta de assets/js.
 *   2. En tu index.html del proyecto Monogatari:
 *        <script src="js/rune-puzzle.js"></script>
 *        ...
 *        <rune-puzzle id="cityPuzzle" background="assets/mare-nostrum-bg.png"></rune-puzzle>
 *   3. Para abrirlo desde un hotspot (script.js):
 *        document.getElementById('cityPuzzle').open();
 *   4. Para reaccionar a que el jugador resuelva las tres coordenadas:
 *        document.getElementById('cityPuzzle').addEventListener('puzzle:cifrado-completo', (e) => {
 *          monogatari.run('jump Camara-Siguiente');
 *        });
 *
 * El componente encapsula su propio CSS y DOM en un Shadow Root, por lo que
 * no choca con los estilos ni el quick-menu de Monogatari, y sobrevive a que
 * <game-screen> reconstruya su innerHTML (no vive dentro de ese nodo).
 */
(function(){
  const TEMPLATE = document.createElement("template");
  TEMPLATE.innerHTML = `
<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Cinzel+Decorative:wght@700;900&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap');

  :host{
    --stone-dark:#151a17;
    --stone-mid:#22281f;
    --parchment:#e8d9b3;
    --parchment-2:#dcc898;
    --parchment-edge:#b89a63;
    --ink:#2c2013;
    --ink-soft:#4a3a24;
    --blood:#8a2b26;
    --blood-bright:#b33a2f;
    --bronze:#8c6a3f;
    --bronze-light:#c9a464;
    --verdigris:#4f7a6c;
    --glow:#e8b95a;
  }
  *{box-sizing:border-box;}
.rp-root{
    height:100%;
    background:
      linear-gradient(rgba(8,10,7,0.55), rgba(8,10,7,0.55));
    font-family:'EB Garamond', serif;
    color:var(--parchment);
    padding:28px 16px 60px;
    display:flex;
    flex-direction:column;
    align-items:center;
  }

  /* ---------- Header ---------- */
  .title-wrap{ text-align:center; margin-bottom:22px; }
  .eyebrow{
    font-family:'Cinzel', serif; letter-spacing:0.35em; font-size:11px;
    color:var(--bronze-light); text-transform:uppercase; margin-bottom:6px;
  }
  h1{
    font-family:'Cinzel Decorative', serif;
    font-size:clamp(24px,4vw,40px);
    margin:0; color:var(--glow);
    text-shadow:0 2px 0 #000, 0 0 24px rgba(232,185,90,0.25);
    letter-spacing:0.02em;
  }
  .subtitle{
    font-style:italic; color:#cbb98a; max-width:620px; margin:10px auto 0;
    font-size:15px; line-height:1.5;
  }

  /* ---------- Layout ---------- */
  .stage{
    width:100%; max-width:1180px;
    display:grid;
    grid-template-columns:280px 1fr;
    gap:22px;
  }
  @media (max-width:880px){ .stage{grid-template-columns:1fr;} }

  /* ---------- Codex (cipher key) ---------- */
  .codex{
    background:
      linear-gradient(160deg, var(--parchment) 0%, var(--parchment-2) 100%);
    border:2px solid var(--parchment-edge);
    border-radius:6px;
    box-shadow:0 10px 30px rgba(0,0,0,0.55), inset 0 0 40px rgba(120,90,40,0.25);
    color:var(--ink);
    padding:16px 16px 18px;
    align-self:start;
    position:relative;
  }
  .codex::before{
    content:"";
    position:absolute; inset:6px;
    border:1px solid rgba(80,55,20,0.35);
    pointer-events:none;
  }
  .codex h2{
    font-family:'Cinzel', serif; font-size:14px; letter-spacing:0.12em;
    margin:0 0 4px; text-transform:uppercase; color:var(--blood);
    text-align:center;
  }
  .codex .hint{
    font-size:12.5px; text-align:center; color:var(--ink-soft); margin:0 0 12px;
    font-style:italic;
  }
  table.numerals{ width:100%; border-collapse:collapse; font-size:13px; }
  table.numerals caption{
    font-family:'Cinzel', serif; font-size:11px; letter-spacing:0.08em;
    text-transform:uppercase; color:var(--ink-soft); margin-bottom:4px; text-align:left;
  }
  table.numerals td{ padding:2px 4px; border-bottom:1px dotted rgba(80,55,20,0.3); }
  table.numerals td.g{ font-family:'Cinzel', serif; font-weight:700; font-size:15px; width:28px; }
  .numeral-block{ margin-bottom:12px; }
  .directions{ margin-top:10px; padding-top:10px; border-top:2px solid rgba(80,55,20,0.35); }
  .directions h3{
    font-family:'Cinzel', serif; font-size:11.5px; letter-spacing:0.08em;
    text-transform:uppercase; margin:0 0 6px; color:var(--blood);
  }
  .dir-row{ display:flex; justify-content:space-between; font-size:13px; padding:2px 0; }
  .dir-row b{ font-family:'Cinzel', serif; }
  .codex-note{
    margin-top:12px; font-size:12px; color:var(--ink-soft); line-height:1.4;
    border-top:1px dashed rgba(80,55,20,0.35); padding-top:8px;
  }

  /* ---------- Right column ---------- */
  .right-col{ display:flex; flex-direction:column; gap:20px; }

  /* Clue tabs */
  .clue-tabs{ display:flex; gap:8px; flex-wrap:wrap; }
  .clue-tab{
    font-family:'Cinzel', serif; font-size:12px; letter-spacing:0.06em;
    text-transform:uppercase; padding:8px 16px; border-radius:4px 4px 0 0;
    background:rgba(140,106,63,0.18); color:#cbb98a; border:1px solid var(--bronze);
    border-bottom:none; cursor:pointer; transition:background .2s;
    white-space:nowrap; text-align:center; line-height:1.3;
  }
  .clue-tab[aria-selected="true"]{ background:var(--parchment); color:var(--ink); }
  .clue-tab.solved::after{ content:" ✓"; color:var(--verdigris); font-weight:700; }

  /* Scroll card */
  .scroll{
    background:
      linear-gradient(160deg, var(--parchment) 0%, var(--parchment-2) 100%);
    border:2px solid var(--parchment-edge);
    border-radius:4px 10px 10px 4px;
    box-shadow:0 14px 36px rgba(0,0,0,0.6), inset 0 0 50px rgba(120,90,40,0.28);
    color:var(--ink);
    padding:22px 26px 26px;
    position:relative;
  }
  .scroll h2{
    font-family:'Cinzel Decorative', serif; font-size:22px; text-align:center;
    margin:0 0 4px; color:var(--blood);
  }
  .scroll .loc-sub{ text-align:center; font-size:12px; letter-spacing:0.1em; color:var(--ink-soft);
    text-transform:uppercase; margin-bottom:16px; font-family:'Cinzel', serif; }

  .rune-line{
    display:flex; align-items:flex-start; justify-content:center; gap:14px;
    flex-wrap:wrap; margin-bottom:16px;
  }
  .rune-line .lbl{
    font-family:'Cinzel', serif; font-size:11px; color:var(--ink-soft);
    text-align:right; text-transform:uppercase; letter-spacing:0.06em;
    padding-top:18px; width:56px;
  }
  .rune-group{
    display:flex; gap:5px; padding:0 6px; border-right:1px dashed rgba(80,55,20,0.35);
  }
  .rune-group:last-of-type{ border-right:none; }

  .tile{ width:54px; display:flex; flex-direction:column; align-items:center; gap:5px; }
  .tile-face{
    width:100%; height:56px; border-radius:5px; display:flex;
    align-items:center; justify-content:center;
    background:linear-gradient(160deg,#3a2c19,#241a0e);
    color:var(--bronze-light); font-family:'Cinzel', serif; font-size:24px; font-weight:700;
    box-shadow:inset 0 0 10px rgba(0,0,0,.6); border:1px solid var(--bronze);
    transition:border-color .2s, box-shadow .2s;
  }
  .tile.dir .tile-face{ color:var(--verdigris); font-size:20px; }
  .tile select{
    width:100%; font-family:'Cinzel', serif; font-size:11px; text-align:center;
    padding:4px 2px; border-radius:4px; border:1px solid var(--bronze);
    background:var(--parchment); color:var(--ink); cursor:pointer;
  }
  .tile.correct .tile-face{ border-color:var(--verdigris); box-shadow:0 0 10px rgba(79,122,108,0.6); }
  .tile.correct select{ border-color:var(--verdigris); color:var(--verdigris); pointer-events:none; opacity:0.85; }
  .tile.wrong .tile-face{ border-color:var(--blood-bright); }
  .tile.wrong-flash select{ animation:tileShake .35s; }
  @keyframes tileShake{
    0%,100%{transform:translateX(0);} 25%{transform:translateX(-4px);}
    75%{transform:translateX(4px);}
  }

  .comma{ font-family:'Cinzel', serif; font-size:20px; color:var(--ink-soft); margin:0 2px; }

  .readout{
    margin-top:6px; padding:12px 14px; border-radius:6px;
    background:rgba(255,255,255,0.35); border:1px dashed var(--bronze);
    text-align:center; font-family:'Cinzel', serif; font-size:15px; letter-spacing:0.03em;
    min-height:22px; color:var(--ink);
  }
  .readout .waiting{ color:var(--ink-soft); font-style:italic; font-family:'EB Garamond',serif; font-size:13px; }

  .drop-hint{
    text-align:center; font-size:12.5px; color:var(--ink-soft); margin-top:8px; font-style:italic;
  }

  .marker-source{
    display:flex; justify-content:center; margin-top:10px;
  }
  .seal{
    width:54px; height:54px; border-radius:50%;
    background:radial-gradient(circle at 35% 30%, #c24b3e, var(--blood) 70%);
    border:2px solid #5e1a15;
    box-shadow:0 4px 10px rgba(0,0,0,.5);
    display:flex; align-items:center; justify-content:center;
    color:#f4dcc0; font-family:'Cinzel Decorative'; font-size:11px; text-align:center;
    cursor:grab; user-select:none; touch-action:none;
    opacity:0.35; pointer-events:none; transition:opacity .3s;
  }
  .seal.active{ opacity:1; pointer-events:auto; }
  .seal.dragging{ position:fixed; z-index:999; cursor:grabbing; }

  .feedback{
    text-align:center; margin-top:10px; font-family:'Cinzel', serif; font-size:12.5px;
    min-height:16px; letter-spacing:0.03em;
  }
  .feedback.ok{ color:var(--verdigris); }
  .feedback.bad{ color:var(--blood); }

  /* Map */
  .map-wrap{
    background:#1a1510;
    border:2px solid var(--parchment-edge); border-radius:8px;
    box-shadow:0 14px 30px rgba(0,0,0,.55);
    padding:10px; position:relative;
  }
  .map-frame{ position:relative; width:100%; border-radius:4px; overflow:hidden; }
  .map-bg{ display:block; width:100%; height:auto; }
  svg#worldmap{ position:absolute; inset:0; width:100%; height:100%; }
  .map-wrap h3{
    font-family:'Cinzel', serif; font-size:12px; letter-spacing:0.12em;
    text-transform:uppercase; color:var(--blood); text-align:center; margin:2px 0 6px;
  }
  svg#worldmap{ width:100%; height:auto; display:block; }
  .landmass{ fill:#c9b482; stroke:#8a6f42; stroke-width:1.5; }
  .sea-line{ fill:none; stroke:#8a6f42; stroke-width:0.6; opacity:0.5; }
  .city-node{ cursor:pointer; }
  .city-node circle.ring{
    fill:none; stroke:var(--blood); stroke-width:2; opacity:0; transition:opacity .25s;
  }
  .city-node.hover circle.ring{ opacity:1; }
  .city-node.solved circle.pin{ fill:var(--verdigris); }
  .city-node circle.pin{ fill:#b23a2c; stroke:#f4e6c9; stroke-width:2; }
  .city-node text{
    font-family:'Cinzel', serif; fill:#2c2013; pointer-events:none;
    paint-order:stroke; stroke:#f4e6c9; stroke-width:3px;
  }

  /* Victory overlay */
  .victory{
    position:fixed; inset:0; background:rgba(10,14,10,0.88);
    display:none; align-items:center; justify-content:center; z-index:1200;
  }
  .victory.show{ display:flex; }
  .victory-card{
    background:linear-gradient(160deg, var(--parchment), var(--parchment-2));
    border:2px solid var(--bronze-light); border-radius:8px;
    padding:34px 40px; text-align:center; max-width:420px;
    box-shadow:0 20px 60px rgba(0,0,0,.7);
    color:var(--ink);
  }
  .victory-card h2{ font-family:'Cinzel Decorative'; color:var(--blood); margin-top:0; }
  .victory-card p{ font-size:14.5px; line-height:1.5; }
  .continue-btn{
    margin-top:14px; font-family:'Cinzel', serif; letter-spacing:0.08em;
    text-transform:uppercase; font-size:13px; padding:10px 22px;
    background:var(--blood); color:#f4e6c9; border:none; border-radius:4px;
    cursor:pointer; transition:background .2s;
  }
  .continue-btn:hover{ background:var(--blood-bright); }

  .shake{ animation:shake .4s; }
  @keyframes shake{
    0%,100%{transform:translateX(0);}
    20%{transform:translateX(-6px);}
    40%{transform:translateX(6px);}
    60%{transform:translateX(-4px);}
    80%{transform:translateX(4px);}
  }


:host{
  all: initial;
  position: absolute; /* fills its positioned ancestor — meant to live inside <game-screen> */
  inset: 0;
  /* Low, "scene layer" z-index: Monogatari's quick-menu and text-box should render
     above this so the player keeps the normal game chrome while the puzzle is open.
     If your theme still shows the puzzle covering the quick-menu, give the quick-menu
     an explicit higher z-index in your own CSS, e.g. quick-menu{ z-index:50; }. */
  z-index: 5;
  display: none;
}
:host([open]){ display:block; }
.rp-root{ overflow:auto; box-sizing:border-box; }
.rp-close{
  position:absolute; top:16px; right:20px; z-index:20;
  width:38px; height:38px; border-radius:50%;
  background:rgba(20,16,10,0.75); color:#e8d9b3; border:1px solid var(--bronze-light);
  font-family:'Cinzel', serif; font-size:16px; cursor:pointer; line-height:1;
}
.rp-close:hover{ background:rgba(138,43,38,0.85); }
:host([mandatory]) .rp-close{ display:none; }
.seal.dragging{ z-index:5000 !important; }

</style>
<div class="rp-root">
  <button class="rp-close" id="rpClose" title="Cerrar">&times;</button>
  <div class="title-wrap">
    <div class="eyebrow">Fragmento recuperado &middot; Cifrado numeral griego</div>
    <h1>El Cifrado de las Tres Ciudades</h1>
    <p class="subtitle">El pergamino indica las coordenadas de tres ciudades escritas en el antiguo sistema de numerales griegos. Descifra cada runa y traza su lugar en el mapa.</p>
  </div>

  <div class="stage">
    <!-- CODEX / CIPHER KEY -->
    <aside class="codex">
      <h2>Clave de Runas</h2>
      <p class="hint">Cada letra representa un valor. El acento (') cierra un grupo numeral.</p>

      <div class="numeral-block">
        <table class="numerals">
          <caption>Unidades</caption>
          <tr><td class="g">Α</td><td>1</td><td class="g">Δ</td><td>4</td><td class="g">Ζ</td><td>7</td></tr>
          <tr><td class="g">Β</td><td>2</td><td class="g">Ε</td><td>5</td><td class="g">Η</td><td>8</td></tr>
          <tr><td class="g">Γ</td><td>3</td><td class="g">Ϛ</td><td>6</td><td class="g">Θ</td><td>9</td></tr>
        </table>
      </div>
      <div class="numeral-block">
        <table class="numerals">
          <caption>Decenas</caption>
          <tr><td class="g">Ι</td><td>10</td><td class="g">Μ</td><td>40</td><td class="g">Ο</td><td>70</td></tr>
          <tr><td class="g">Κ</td><td>20</td><td class="g">Ν</td><td>50</td><td class="g">Π</td><td>80</td></tr>
          <tr><td class="g">Λ</td><td>30</td><td class="g">Ξ</td><td>60</td><td class="g">Ϟ</td><td>90</td></tr>
        </table>
      </div>

      <div class="directions">
        <h3>Rumbos</h3>
        <div class="dir-row"><span><b>Β</b> &mdash; Βορράς</span><span>Norte</span></div>
        <div class="dir-row"><span><b>Ν</b> &mdash; Νότος</span><span>Sur</span></div>
        <div class="dir-row"><span><b>Α</b> &mdash; Ἀνατολή</span><span>Este</span></div>
        <div class="dir-row"><span><b>Δ</b> &mdash; Δύσις</span><span>Oeste</span></div>
      </div>

      <p class="codex-note">Lectura: <b>grados' minutos' rumbo</b>, repetido para latitud y longitud,
        separadas por coma. Elige el valor de cada runa en su lista desplegable.</p>
    </aside>

    <!-- RIGHT COLUMN -->
    <div class="right-col">
      <div class="clue-tabs" id="clueTabs"></div>

      <div class="scroll" id="scrollCard">
        <h2 id="scrollTitle">&mdash;</h2>
        <div class="loc-sub">Coordenada cifrada</div>

        <div class="rune-line" id="latLine"></div>
        <div class="rune-line" id="lonLine"></div>

        <div class="readout" id="readout"><span class="waiting">Elige el valor de cada runa consultando la clave…</span></div>
        <div class="marker-source">
          <div class="seal" id="sealSource">Sello<br>del lugar</div>
        </div>
        <div class="drop-hint">Arrastra el sello descifrado y suéltalo sobre la ciudad correcta del mapa.</div>
        <div class="feedback" id="feedback"></div>
      </div>

      <div class="map-wrap">
        <h3>Mapa del Mare Nostrum</h3>
        <div class="map-frame">
          <img src="mare-nostrum-bg.png" alt="Mapa antiguo del Mare Nostrum" class="map-bg">
          <svg id="worldmap" viewBox="0 0 603 730" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"></svg>
        </div>
      </div>
    </div>
  </div>

  <div class="victory" id="victory">
    <div class="victory-card">
      <h2>Las tres ciudades reveladas</h2>
      <p>Alejandría, Halicarnaso y Babilonia han sido marcadas sobre el mapa. El camino hacia la siguiente
        cámara se abre ante ti.</p>
      <button class="continue-btn" id="continueBtn">Continuar</button>
    </div>
  </div>
</div>
`;

  class RunePuzzle extends HTMLElement {
    static get observedAttributes(){ return ["background"]; }

    constructor(){
      super();
      this.attachShadow({ mode:"open" });
      this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    }

    connectedCallback(){
      const bg = this.getAttribute("background") || "assets/games/cifrado-tres-ciudades/mare-nostrum-bg.png";
      const img = this.shadowRoot.querySelector(".map-bg");
      if(img) img.src = bg;

      this._build(this.shadowRoot, this);

      const closeBtn = this.shadowRoot.getElementById("rpClose");
      if(closeBtn) closeBtn.addEventListener("click", ()=>{
        if(this.hasAttribute("mandatory")) return; // no salida mientras bloquea el guion
        this.close();
      });

      // Evita que cualquier clic dentro del rompecabezas (dropdowns, fichas,
      // el sello, "Continuar", la X) se filtre hacia el DOM de Monogatari.
      // Sin esto, el mismo clic que usamos internamente puede además ser
      // interpretado por el "clic para avanzar diálogo" del motor y
      // desincronizar el guion (síntoma: la narración se queda pegada justo
      // después de resolver el acertijo).
      // Solo "click": mousedown/mouseup/touchstart/touchend deben seguir
      // llegando a los listeners en window que maneja el arrastre del sello
      // (endDrag se engancha ahí precisamente para detectar la suelta sobre
      // el mapa, que vive dentro de este mismo Shadow Root). Detenerlos aquí
      // rompía el drag-and-drop: el mouseup nunca llegaba a window y el
      // sello quedaba pegado al cursor.
      ["click"].forEach(type=>{
        this.addEventListener(type, e=>e.stopPropagation());
      });
    }

    attributeChangedCallback(name, oldVal, newVal){
      if(name === "background" && this.shadowRoot){
        const img = this.shadowRoot.querySelector(".map-bg");
        if(img) img.src = newVal;
      }
    }

    /** Muestra el rompecabezas. */
    open(){
      this.setAttribute("open", "");
      this.dispatchEvent(new CustomEvent("puzzle:abierto", { bubbles:true, composed:true }));
    }

    /** Oculta el rompecabezas sin perder el progreso resuelto hasta ahora. */
    close(){
      this.removeAttribute("open");
      this.dispatchEvent(new CustomEvent("puzzle:cerrado", { bubbles:true, composed:true }));
    }

    /** true si las tres coordenadas ya fueron resueltas. */
    get isSolved(){
      return !!(this._solved && Object.keys(this._solved).length === 3);
    }

    // ---------------------------------------------------------------
    // Lógica interna del rompecabezas (adaptada del prototipo standalone)
    // ---------------------------------------------------------------
    _build(root, self){


  // ---------- Greek numeral helpers ----------
  const UNIT = {"Α":1,"Β":2,"Γ":3,"Δ":4,"Ε":5,"Ϛ":6,"Ζ":7,"Η":8,"Θ":9};
  const TEN  = {"Ι":10,"Κ":20,"Λ":30,"Μ":40,"Ν":50,"Ξ":60,"Ο":70,"Π":80,"Ϟ":90};
  const DIR  = {"Β":"N","Ν":"S","Α":"E","Δ":"W"};
  const DIRNAME = {"N":"Norte","S":"Sur","E":"Este","W":"Oeste"};

  function letterValue(ch){ return UNIT[ch] || TEN[ch] || 0; }

  // A "group" like "ΛΑ'" -> value 31. Represent as array of letters.
  function groupValue(letters){ return letters.reduce((s,ch)=>s+letterValue(ch),0); }

  // ---------- Puzzle data ----------
  // Each coordinate: degrees-letters, minutes-letters, direction-letter
  const CITIES = [
    {
      id:"alejandria", name:"Alejandría",
      lat:{deg:["Λ","Α"], min:["Ι","Β"], dir:"Β"}, // 31°12' N
      lon:{deg:["Κ","Θ"], min:["Ν","Ε"], dir:"Α"}, // 29°55' E
      mapX:372, mapY:468 // Nile delta, north of AEGYPTUS
    },
    {
      id:"halicarnaso", name:"Halicarnaso",
      lat:{deg:["Λ","Ζ"], min:["Β"],     dir:"Β"}, // 37°02' N
      lon:{deg:["Κ","Ζ"], min:["Κ","Ϛ"], dir:"Α"}, // 27°26' E
      mapX:300, mapY:290 // SW Asia Minor coast, opposite the Aegean isles
    },
    {
      id:"babilonia", name:"Babilonia",
      lat:{deg:["Λ","Β"], min:["Λ","Β"], dir:"Β"}, // 32°32' N
      lon:{deg:["Μ","Δ"], min:["Κ","Ε"], dir:"Α"}, // 44°25' E
      mapX:555, mapY:350 // Mesopotamia, past Syria at the map's eastern edge
    }
  ];

  // Decoy cities shown on the map for challenge (not solvable clues)
  const DECOYS = [
    {id:"atenas", name:"Atenas", mapX:190, mapY:230},
    {id:"rodas", name:"Rodas", mapX:260, mapY:300},
    {id:"jerusalen", name:"Jerusalén", mapX:500, mapY:440},
    {id:"constantinopla", name:"Constantinopla", mapX:210, mapY:155}
  ];

  const solved = {};

  // ---------- Build clue tabs ----------
  const tabsEl = root.getElementById("clueTabs");
  let activeId = CITIES[0].id;

  function renderTabs(){
    tabsEl.innerHTML = "";
    CITIES.forEach((c,i)=>{
      const btn = document.createElement("button");
      btn.className = "clue-tab" + (solved[c.id] ? " solved" : "");
      btn.textContent = "Coordenada " + (i+1);
      btn.setAttribute("aria-selected", c.id === activeId ? "true" : "false");
      btn.onclick = ()=>{ activeId = c.id; renderTabs(); renderScroll(); };
      tabsEl.appendChild(btn);
    });
  }

  // All possible unit + ten numeral values, for the dropdown option pool
  const ALL_VALUES = [...new Set([...Object.values(UNIT), ...Object.values(TEN)])].sort((a,b)=>a-b);
  const ALL_DIRECTIONS = ["Norte","Sur","Este","Oeste"];

  function buildLetterTile(letter, kind){
    const tile = document.createElement("div");
    tile.className = "tile";
    const correctValue = letterValue(letter);

    const face = document.createElement("div");
    face.className = "tile-face";
    face.textContent = letter;
    tile.appendChild(face);

    const select = document.createElement("select");
    const placeholder = document.createElement("option");
    placeholder.value = ""; placeholder.textContent = "?";
    select.appendChild(placeholder);
    ALL_VALUES.forEach(v=>{
      const opt = document.createElement("option");
      opt.value = v; opt.textContent = v;
      select.appendChild(opt);
    });
    tile.appendChild(select);

    select.addEventListener("change", ()=>{
      if(select.value === "" ) return;
      if(Number(select.value) === correctValue){
        tile.classList.add("correct");
        tile.classList.remove("wrong");
        select.disabled = true;
      } else {
        tile.classList.add("wrong");
        tile.classList.remove("wrong-flash");
        void tile.offsetWidth;
        tile.classList.add("wrong-flash");
        setTimeout(()=>{ select.value = ""; }, 300);
      }
      updateReadout();
    });

    return tile;
  }

  function buildDirTile(letter){
    const tile = document.createElement("div");
    tile.className = "tile dir";
    const correctName = DIRNAME[DIR[letter]];

    const face = document.createElement("div");
    face.className = "tile-face";
    face.textContent = letter;
    tile.appendChild(face);

    const select = document.createElement("select");
    const placeholder = document.createElement("option");
    placeholder.value = ""; placeholder.textContent = "?";
    select.appendChild(placeholder);
    ALL_DIRECTIONS.forEach(d=>{
      const opt = document.createElement("option");
      opt.value = d; opt.textContent = d;
      select.appendChild(opt);
    });
    tile.appendChild(select);

    select.addEventListener("change", ()=>{
      if(select.value === "") return;
      if(select.value === correctName){
        tile.classList.add("correct");
        tile.classList.remove("wrong");
        select.disabled = true;
      } else {
        tile.classList.add("wrong");
        tile.classList.remove("wrong-flash");
        void tile.offsetWidth;
        tile.classList.add("wrong-flash");
        setTimeout(()=>{ select.value = ""; }, 300);
      }
      updateReadout();
    });

    return tile;
  }

  function renderCoordLine(container, labelText, coord){
    container.innerHTML = "";
    const lbl = document.createElement("span");
    lbl.className = "lbl";
    lbl.textContent = labelText;
    container.appendChild(lbl);

    const degGroup = document.createElement("div");
    degGroup.className = "rune-group";
    coord.deg.forEach(ch=>degGroup.appendChild(buildLetterTile(ch,"deg")));
    container.appendChild(degGroup);

    const minGroup = document.createElement("div");
    minGroup.className = "rune-group";
    coord.min.forEach(ch=>minGroup.appendChild(buildLetterTile(ch,"min")));
    container.appendChild(minGroup);

    const dirGroup = document.createElement("div");
    dirGroup.className = "rune-group";
    dirGroup.appendChild(buildDirTile(coord.dir));
    container.appendChild(dirGroup);
  }

  function updateReadout(){
    const city = CITIES.find(c=>c.id===activeId);
    const latLine = root.getElementById("latLine");
    const lonLine = root.getElementById("lonLine");
    const latTiles = latLine.querySelectorAll(".tile");
    const lonTiles = lonLine.querySelectorAll(".tile");
    const allCorrect = [...latTiles,...lonTiles].every(t=>t.classList.contains("correct"));
    const readout = root.getElementById("readout");
    const seal = root.getElementById("sealSource");

    if(allCorrect){
      const latDeg = groupValue(city.lat.deg);
      const latMin = groupValue(city.lat.min);
      const lonDeg = groupValue(city.lon.deg);
      const lonMin = groupValue(city.lon.min);
      readout.innerHTML = `${latDeg}°${String(latMin).padStart(2,"0")}′ ${DIR[city.lat.dir]},
        ${lonDeg}°${String(lonMin).padStart(2,"0")}′ ${DIR[city.lon.dir]}`;
      seal.classList.add("active");
    } else {
      readout.innerHTML = '<span class="waiting">Elige el valor de cada runa consultando la clave…</span>';
      seal.classList.remove("active");
    }
  }

  function renderScroll(){
    const city = CITIES.find(c=>c.id===activeId);
    const idx = CITIES.findIndex(c=>c.id===activeId);
    root.getElementById("scrollTitle").textContent = "Coordenada " + (idx+1);
    root.getElementById("feedback").textContent = "";
    root.getElementById("feedback").className = "feedback";
    renderCoordLine(root.getElementById("latLine"), "Latitud", city.lat);
    renderCoordLine(root.getElementById("lonLine"), "Longitud", city.lon);
    updateReadout();
    if(solved[city.id]){
      root.getElementById("sealSource").style.visibility = "hidden";
    } else {
      root.getElementById("sealSource").style.visibility = "visible";
    }
  }

  // ---------- Map ----------
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = root.getElementById("worldmap");

  function makeLandmass(){
    // Background art now comes from the uploaded hyperrealistic map image (mare-nostrum-bg.png).
    // This SVG layer only holds the transparent, clickable city markers on top of it.
  }

  function makeCityNode(cfg, opts){
    const g = document.createElementNS(svgNS,"g");
    g.setAttribute("class","city-node");
    g.setAttribute("data-id", cfg.id);
    g.setAttribute("transform", `translate(${cfg.mapX},${cfg.mapY})`);

    const hitArea = document.createElementNS(svgNS,"circle");
    hitArea.setAttribute("r","16");
    hitArea.setAttribute("fill","transparent");
    g.appendChild(hitArea);

    const ring = document.createElementNS(svgNS,"circle");
    ring.setAttribute("class","ring");
    ring.setAttribute("r","12");
    g.appendChild(ring);

    const pin = document.createElementNS(svgNS,"circle");
    pin.setAttribute("class","pin");
    pin.setAttribute("r","5");
    g.appendChild(pin);

    const label = document.createElementNS(svgNS,"text");
    label.setAttribute("x","8");
    label.setAttribute("y","3");
    label.setAttribute("font-size","10");
    label.textContent = opts.showLabel ? cfg.name : "";
    g.appendChild(label);

    g.addEventListener("mouseenter", ()=>g.classList.add("hover"));
    g.addEventListener("mouseleave", ()=>g.classList.remove("hover"));

    svg.appendChild(g);
    return g;
  }

  makeLandmass();
  CITIES.forEach(c=>makeCityNode(c, {showLabel:false}));
  DECOYS.forEach(c=>makeCityNode(c, {showLabel:false}));

  // ---------- Drag the wax seal onto the map (same movement pattern as the inventory) ----------
  const sealSource = root.getElementById("sealSource");
  let dragClone = null;
  let dragging = false;

  function startDrag(clientX, clientY){
    if(dragging || !sealSource.classList.contains("active")) return;
    dragging = true;
    dragClone = sealSource.cloneNode(true);
    dragClone.classList.add("dragging");
    dragClone.style.left = (clientX-27)+"px";
    dragClone.style.top = (clientY-27)+"px";
    dragClone.style.pointerEvents = "none"; // let elementFromPoint see what's underneath, not the clone itself
    // IMPORTANT: append inside the shadow root (not document.body) — the component's
    // CSS is scoped to its Shadow Root and does not leak into the light DOM, so a
    // clone appended to document.body would render unstyled/invisible.
    root.appendChild(dragClone);
  }

  function moveDrag(clientX, clientY){
    if(!dragClone) return;
    dragClone.style.left = (clientX-27)+"px";
    dragClone.style.top = (clientY-27)+"px";
  }

  function cleanupDragClone(){
    // Class-based sweep, in case a previous clone was ever left orphaned.
    root.querySelectorAll(".seal.dragging").forEach(el=>el.remove());
    dragClone = null;
    dragging = false;
  }

  function endDrag(clientX, clientY){
    if(!dragClone){ dragging = false; return; }
    const el = (root.elementFromPoint ? root.elementFromPoint(clientX, clientY) : document.elementFromPoint(clientX, clientY));
    const node = el && el.closest ? el.closest(".city-node") : null;

    if(!node){
      cleanupDragClone();
      return;
    }

    // ---- Smooth "snap into place" animation, same idea as dropIconAt() in the inventory ----
    const pin = node.querySelector("circle.pin");
    const targetRect = (pin || node).getBoundingClientRect();
    const targetX = targetRect.left + targetRect.width/2 - 27;
    const targetY = targetRect.top + targetRect.height/2 - 27;
    const cityId = node.getAttribute("data-id");
    const clone = dragClone;

    let finished = false;
    const finish = ()=>{
      if(finished) return;
      finished = true;
      cleanupDragClone();
      checkAnswer(cityId);
    };

    clone.style.pointerEvents = "none";
    clone.style.transition = "left .35s ease, top .35s ease, transform .35s ease";
    clone.style.transform = "scale(0.8)";
    void clone.offsetWidth; // force reflow so the transition runs from the current position
    clone.style.left = targetX + "px";
    clone.style.top = targetY + "px";

    clone.addEventListener("transitionend", finish, { once:true });
    setTimeout(finish, 450); // safety net in case transitionend doesn't fire
  }

  sealSource.addEventListener("mousedown", e=>{ startDrag(e.clientX,e.clientY); e.preventDefault(); });
  window.addEventListener("mousemove", e=>moveDrag(e.clientX,e.clientY));
  window.addEventListener("mouseup", e=>endDrag(e.clientX,e.clientY));

  sealSource.addEventListener("touchstart", e=>{
    const t=e.touches[0]; startDrag(t.clientX,t.clientY);
  }, {passive:true});
  window.addEventListener("touchmove", e=>{
    if(!dragClone) return;
    const t=e.touches[0]; moveDrag(t.clientX,t.clientY);
  }, {passive:true});
  window.addEventListener("touchend", e=>{
    const t=e.changedTouches[0]; endDrag(t.clientX,t.clientY);
  });

  function checkAnswer(droppedId){
    const city = CITIES.find(c=>c.id===activeId);
    const feedback = root.getElementById("feedback");
    const scroll = root.getElementById("scrollCard");

    if(droppedId === city.id){
      solved[city.id] = true;
      feedback.textContent = "Correcto — el sello reposa sobre " + city.name + ".";
      feedback.className = "feedback ok";
      const node = svg.querySelector(`.city-node[data-id="${city.id}"]`);
      node.classList.add("solved");
      node.querySelector("text").textContent = city.name;
      renderTabs();
      renderScroll();
      checkVictory();
    } else {
      feedback.textContent = "No es ese lugar. Vuelve a leer las runas con calma.";
      feedback.className = "feedback bad";
      scroll.classList.remove("shake"); void scroll.offsetWidth; scroll.classList.add("shake");
    }
  }

  function checkVictory(){
    if(CITIES.every(c=>solved[c.id])){
      root.getElementById("victory").classList.add("show");
    }
  }

  root.getElementById("continueBtn").addEventListener("click", ()=>{
    root.getElementById("victory").classList.remove("show");
    // Integration hook for Monogatari — see README-integracion.md
    self.dispatchEvent(new CustomEvent("puzzle:cifrado-completo", {
      detail:{ solved:Object.keys(solved) },
      bubbles:true, composed:true
    }));
  });

  renderTabs();
  renderScroll();


      this._solved = solved;
    }
  }

  customElements.define("rune-puzzle", RunePuzzle);
})();
