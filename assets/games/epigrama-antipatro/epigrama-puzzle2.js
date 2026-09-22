/**
 * <epigrama-puzzle>
 * ------------------------------------------------------------------
 * Minijuego de 3 etapas para la Escena 14 (Biblioteca de la Universidad
 * de Atenas). Mismo patrón arquitectónico que <rune-puzzle> y <ruta7-race>:
 *
 *   - Web Component con Shadow DOM (aislamiento total de estilos).
 *   - :host{ all:initial; position:absolute; inset:0; z-index:5; display:none; }
 *     / :host([open]) para mostrarse solo cuando la Acción de Monogatari lo abre.
 *   - Toda la lógica vive dentro de _build(root, self), usando
 *     root.getElementById(...) en vez de document.getElementById(...)
 *     para que sobreviva a cualquier reconstrucción del DOM externo.
 *   - self.open() / self.close() son el contrato público que usa la Acción.
 *   - Al resolver la Etapa 3, dispara 'epigrama:completado' (bubbles+composed)
 *     sobre el propio elemento, igual que 'puzzle:completado' / 'race:completado'.
 *
 * Carga: epigrama-puzzle.js → epigrama-action.js → script.js
 * ------------------------------------------------------------------
 */

const TEMPLATE = `
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Cinzel+Decorative:wght@700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');

  :host{
    all:initial;
    --bg-deep:#181009; --bg-deep2:#241708;
    --ink:#2b1d10;
    --parchment:#e9dcb8; --parchment-dark:#d6c393; --parchment-shadow:#a6905f;
    --sepia:#6b4423; --sepia-light:#8a5c33;
    --wax:#7c2222; --wax-dark:#4f1414;
    --gold:#b6852c; --gold-bright:#e9c468;
    --red-warn:#8a2b2b;
    font-family:'EB Garamond', serif;
    color:var(--parchment);
    position:absolute; inset:0; z-index:5;
    display:none;
    overflow-y:auto;
    background:
      radial-gradient(ellipse at 50% 0%, #3a2712 0%, transparent 60%),
      radial-gradient(ellipse at 20% 90%, #2a1a0c 0%, transparent 55%),
      linear-gradient(180deg, var(--bg-deep2), var(--bg-deep));
  }
  :host([open]){ display:block; }
  *{ box-sizing:border-box; }
  .shell{ max-width:1120px; margin:0 auto; padding:30px 18px 70px; display:flex; flex-direction:column; align-items:center; user-select:none; -webkit-user-select:none; }

  .eyebrow{ font-family:'Cinzel',serif; letter-spacing:.32em; font-size:10.5px; color:var(--gold-bright); text-transform:uppercase; opacity:.85; margin-bottom:8px; }
  h1{ font-family:'Cinzel Decorative','Cinzel',serif; font-size:clamp(22px,3.6vw,34px); margin:0 0 14px; text-align:center; text-shadow:0 2px 12px rgba(0,0,0,.6); }

  .stage-dots{ display:flex; gap:14px; align-items:center; margin-bottom:14px; }
  .dot{ width:11px; height:11px; border-radius:50%; border:1.5px solid var(--parchment-shadow); background:transparent; transition:.3s; }
  .dot.done{ background:var(--gold); border-color:var(--gold); }
  .dot.active{ background:var(--gold-bright); border-color:var(--gold-bright); box-shadow:0 0 10px rgba(233,196,104,.7); }
  .dot-line{ width:34px; height:1.5px; background:var(--parchment-shadow); opacity:.5; }

  .stage-title{ font-family:'Cinzel',serif; font-size:13px; letter-spacing:.14em; text-transform:uppercase; color:var(--gold-bright); margin-bottom:6px; text-align:center; }
  .stage-instr{ font-style:italic; color:var(--parchment-shadow); font-size:14.5px; max-width:640px; text-align:center; margin-bottom:26px; line-height:1.5; }

  .screen{ width:100%; display:none; flex-direction:column; align-items:center; opacity:0; transform:translateY(10px); transition:opacity .4s, transform .4s; }
  .screen.active{ display:flex; opacity:1; transform:translateY(0); }

  .book-card{
    width:60px; height:210px;
    border-radius:3px 7px 7px 3px;
    padding:12px 5px;
    display:flex; flex-direction:column; align-items:center; justify-content:space-between;
    cursor:pointer; position:relative;
    border:2px solid transparent;
    box-shadow:
      inset -7px 0 10px -5px rgba(0,0,0,.45),
      inset 2px 0 0 rgba(255,255,255,.14),
      3px 5px 10px rgba(0,0,0,.5);
    transition:transform .18s cubic-bezier(.3,1.4,.6,1), box-shadow .18s, border-color .2s, opacity .3s;
  }
  .book-card::before{
    /* franjas doradas decorativas, como el filo de un lomo de cuero */
    content:''; position:absolute; top:20px; left:6px; right:6px; height:2px;
    background:rgba(255,255,255,.3);
    box-shadow:0 138px 0 rgba(255,255,255,.3);
  }
  .book-card:hover{ transform:translateY(-14px) rotate(-3deg); box-shadow:inset -7px 0 10px -5px rgba(0,0,0,.45), inset 2px 0 0 rgba(255,255,255,.14), 4px 14px 20px rgba(0,0,0,.6); z-index:3; }
  .spine-title{
    writing-mode:vertical-rl; transform:rotate(180deg);
    font-family:'Cinzel',serif; font-size:11px; font-weight:600; letter-spacing:.01em;
    color:rgba(255,255,255,.94); text-shadow:0 1px 2px rgba(0,0,0,.4);
    line-height:1.2; max-height:126px; overflow:hidden;
  }
  .spine-author{
    writing-mode:vertical-rl; transform:rotate(180deg);
    font-size:9.5px; font-style:italic; color:rgba(255,255,255,.68);
    max-height:46px; overflow:hidden;
  }
  .book-title{ font-family:'Cinzel',serif; font-size:11.5px; color:var(--ink); line-height:1.28; font-weight:600; }
  .book-author{ font-size:11px; font-style:italic; color:var(--sepia); }

  .book-tooltip{
    position:absolute; bottom:calc(100% + 12px); left:50%;
    transform:translateX(-50%) translateY(6px);
    width:200px; text-align:left;
    background:linear-gradient(160deg, var(--parchment), var(--parchment-dark));
    color:var(--ink); border-radius:6px; padding:10px 12px;
    box-shadow:0 10px 24px rgba(0,0,0,.55);
    opacity:0; visibility:hidden; pointer-events:none; z-index:50;
    transition:opacity .18s, transform .18s;
  }
  .book-tooltip::after{
    content:''; position:absolute; top:100%; left:50%; transform:translateX(-50%);
    border:6px solid transparent; border-top-color:var(--parchment-dark);
  }
  .tooltip-title{ font-family:'Cinzel',serif; font-size:12px; font-weight:600; margin-bottom:3px; }
  .tooltip-author{ font-size:11px; font-style:italic; color:var(--sepia); margin-bottom:5px; }
  .tooltip-blurb{ font-size:10.5px; line-height:1.35; color:#4a3826; }
  .book-card:hover .book-tooltip, .book-card:focus-visible .book-tooltip{
    opacity:1; visibility:visible; transform:translateX(-50%) translateY(0);
  }

  .book-card.found{ border-color:var(--gold); box-shadow:0 0 16px rgba(182,133,44,.6), inset -7px 0 10px -5px rgba(0,0,0,.45); cursor:default; }
  .book-card.found::after{ content:'✓'; position:absolute; top:4px; right:5px; font-family:'Cinzel',serif; font-size:11px; color:var(--gold-bright); text-shadow:0 1px 2px rgba(0,0,0,.6); }
  .book-card.wrong{ animation:shakeCard .4s; border-color:var(--red-warn); }
  @keyframes shakeCard{ 0%,100%{transform:translateX(0);} 25%{transform:translateX(-6px);} 75%{transform:translateX(6px);} }

  .book-card.mini{ width:84px; height:250px; padding:14px 7px; transform:none !important; }
  .book-card.mini:hover{ transform:none !important; }
  .book-card.mini .spine-title{ font-size:13.5px; max-height:150px; }
  .book-card.mini .spine-author{ font-size:12px; max-height:70px; }
  .book-card.ghost-drag{ position:fixed; z-index:999; pointer-events:none; opacity:.92; filter:drop-shadow(0 10px 14px rgba(0,0,0,.6)); }

  #grid1{
    display:grid; grid-template-columns:repeat(auto-fill,60px); justify-content:center; gap:16px 12px;
    width:100%; max-width:1080px; padding-bottom:10px;
    background-image:repeating-linear-gradient(to bottom,
      transparent 0px, transparent 210px,
      rgba(107,68,35,.4) 210px, rgba(74,47,24,.65) 218px,
      transparent 218px, transparent 226px);
  }
  .counter-line{ margin-top:20px; font-family:'Cinzel',serif; font-size:12px; letter-spacing:.1em; color:var(--parchment-shadow); }

  .tray2{ display:flex; flex-wrap:wrap; gap:16px 12px; justify-content:center; align-items:flex-end; min-height:150px; width:100%; max-width:1080px; margin-bottom:24px; padding-bottom:18px; border-bottom:1px solid rgba(233,220,184,.15); }
  .bins{ display:grid; grid-template-columns:repeat(4,1fr); gap:14px; width:100%; max-width:1080px; }
  @media (max-width:760px){ .bins{ grid-template-columns:repeat(2,1fr);} }
  .bin{ background:rgba(43,29,16,.5); border:2px dashed var(--parchment-shadow); border-radius:8px; padding:12px 10px; min-height:310px; display:flex; flex-direction:column; align-items:center; gap:8px; transition:background .2s, border-color .2s; }
  .bin.drag-over{ background:rgba(107,68,35,.25); border-color:var(--sepia-light); }
  .bin.complete{ border-style:solid; border-color:var(--gold); box-shadow:0 0 14px rgba(182,133,44,.35) inset; }
  .bin-label{ font-family:'Cinzel',serif; font-size:10.5px; letter-spacing:.05em; text-transform:uppercase; color:var(--gold-bright); text-align:center; line-height:1.3; }
  .bin-need{ font-size:10px; color:var(--parchment-shadow); font-style:italic; }
  .bin-slots{ display:flex; flex-direction:row; flex-wrap:wrap; gap:6px; width:100%; align-items:flex-end; justify-content:center; }

  .cards3a{ display:flex; gap:22px; flex-wrap:wrap; justify-content:center; margin-top:6px; perspective:1200px; }
  .flip-card{ width:200px; height:260px; position:relative; }
  .flip-inner{ width:100%; height:100%; position:relative; transform-style:preserve-3d; transition:transform .6s cubic-bezier(.4,.2,.2,1); }
  .flip-card.flipped .flip-inner{ transform:rotateY(180deg); }
  .flip-face{ position:absolute; inset:0; backface-visibility:hidden; border-radius:8px; padding:16px; display:flex; flex-direction:column; }
  .flip-front{ background:linear-gradient(160deg, var(--parchment), var(--parchment-dark)); box-shadow:0 6px 14px rgba(0,0,0,.45); cursor:pointer; justify-content:center; align-items:center; text-align:center; gap:10px; }
  .flip-front .book-title{ font-size:14px; } .flip-front .book-author{ font-size:12.5px; }
  .flip-front .tap-hint{ font-size:9.5px; color:var(--sepia); letter-spacing:.08em; text-transform:uppercase; margin-top:8px; opacity:.7; }
  .flip-back{ background:linear-gradient(200deg, #efe3c2, #cdb98a); transform:rotateY(180deg); box-shadow:0 6px 14px rgba(0,0,0,.45); justify-content:space-between; align-items:center; text-align:center; }
  .stamp{ width:74px; height:74px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-direction:column; margin-top:8px; }
  .stamp.official{ border:3px double var(--wax); color:var(--wax); font-family:'Cinzel',serif; }
  .stamp.official .snum{ font-size:8.5px; letter-spacing:.05em; }
  .stamp.official .slabel{ font-size:8.5px; letter-spacing:.05em; margin-top:2px; }
  .stamp.missing{ border:2px dashed var(--red-warn); color:var(--red-warn); font-family:'Cinzel',serif; font-size:9.5px; letter-spacing:.05em; text-align:center; padding:4px; transform:rotate(-8deg); }
  .select-btn{ font-family:'Cinzel',serif; font-size:10px; letter-spacing:.08em; text-transform:uppercase; background:linear-gradient(180deg, var(--sepia-light), var(--sepia)); color:var(--parchment); border:none; border-radius:16px; padding:8px 15px; cursor:pointer; margin-bottom:6px; box-shadow:0 3px 8px rgba(0,0,0,.35); }
  .select-btn:hover{ filter:brightness(1.1); }
  .select-btn:disabled{ opacity:.6; cursor:default; }
  .flip-msg{ font-size:10px; font-style:italic; color:var(--red-warn); min-height:14px; }
  .counter3a{ margin-top:20px; font-family:'Cinzel',serif; font-size:12px; letter-spacing:.1em; color:var(--parchment-shadow); }

  .scroll-wrap{ position:relative; width:min(920px,94vw); background:var(--parchment); border-radius:10px; padding:26px 26px 22px;
    box-shadow:0 0 0 1px rgba(0,0,0,.35), 0 18px 40px rgba(0,0,0,.55), inset 0 0 60px rgba(107,68,35,.25);
    background-image:repeating-linear-gradient(90deg, rgba(107,68,35,.04) 0 2px, transparent 2px 6px);
    margin-top:6px;
  }
  .scroll-rod{ position:absolute; top:-11px; left:-14px; right:-14px; height:22px; background:linear-gradient(180deg, var(--gold-bright), var(--gold) 55%, var(--sepia)); border-radius:11px; box-shadow:0 4px 10px rgba(0,0,0,.5); }
  .scroll-rod.bottom{ top:auto; bottom:-11px; }
  .scroll-rod::before, .scroll-rod::after{ content:''; position:absolute; top:-3px; width:16px; height:28px; border-radius:50%; background:radial-gradient(circle at 35% 30%, var(--gold-bright), var(--sepia) 70%); box-shadow:0 3px 6px rgba(0,0,0,.5); }
  .scroll-rod::before{ left:-6px; } .scroll-rod::after{ right:-6px; }
  .banner-label{ font-family:'Cinzel',serif; font-size:11px; letter-spacing:.2em; color:var(--sepia); text-transform:uppercase; margin-bottom:14px; text-align:center; opacity:.75; }
  .eg-slots{ display:flex; flex-wrap:wrap; gap:24px 14px; justify-content:center; align-items:flex-start; min-height:170px; }
  .eg-slot{ width:158px; height:78px; border:2px dashed var(--parchment-shadow); border-radius:6px; display:flex; align-items:center; justify-content:center; position:relative; background:rgba(166,144,95,.08); transition:background .2s, border-color .2s, box-shadow .2s; perspective:600px; }
  .eg-slot::before{ content:attr(data-num); position:absolute; top:-9px; left:8px; font-family:'Cinzel',serif; font-size:10px; color:var(--sepia); background:var(--parchment); padding:0 5px; opacity:.8; z-index:2; }
  .eg-slot.drag-over{ border-color:var(--sepia); background:rgba(107,68,35,.14); }
  .eg-slot.correct{ border-style:solid; border-color:var(--gold); box-shadow:0 0 14px rgba(182,133,44,.55) inset, 0 0 10px rgba(182,133,44,.35); }

  .eg-piece{ width:150px; height:70px; position:relative; cursor:grab; touch-action:none; transform-style:preserve-3d; transition:transform .5s cubic-bezier(.4,.2,.2,1); }
  .eg-piece.revealed{ transform:rotateX(180deg); }
  .eg-face{ position:absolute; inset:0; backface-visibility:hidden; display:flex; align-items:center; justify-content:center; text-align:center; padding:6px 9px;
    background:linear-gradient(160deg, var(--parchment) 0%, var(--parchment-dark) 100%);
    box-shadow:0 3px 6px rgba(0,0,0,.45), inset 0 0 12px rgba(107,68,35,.18);
    clip-path:polygon(3% 12%,9% 2%,22% 6%,34% 0%,48% 5%,61% 1%,75% 7%,88% 2%,97% 10%,100% 25%,96% 40%,100% 55%,95% 70%,100% 85%,91% 96%,78% 99%,64% 94%,50% 100%,37% 95%,24% 99%,11% 93%,2% 82%,6% 68%,0% 52%,5% 38%,0% 24%);
    line-height:1.2;
  }
  .eg-face-gr{ font-size:14px; color:var(--ink); font-weight:600; }
  .eg-face-es{ font-size:12.5px; color:var(--sepia); font-style:italic; transform:rotateX(180deg); }
  .eg-piece.locked .eg-face-gr{ color:var(--gold); }
  .eg-piece.locked .eg-face{ box-shadow:0 0 16px rgba(182,133,44,.6), inset 0 0 10px rgba(182,133,44,.3); }
  .eg-piece.ghost{ position:fixed; z-index:999; pointer-events:none; opacity:.92; filter:drop-shadow(0 10px 14px rgba(0,0,0,.6)); }
  .eg-piece.peek .eg-face-gr{ opacity:0; }
  .eg-piece.peek::after{ content:attr(data-es); position:absolute; inset:0; display:flex; align-items:center; justify-content:center; text-align:center; padding:6px 9px; font-size:12.5px; font-style:italic; color:var(--sepia); background:rgba(233,220,184,.97); border-radius:4px; line-height:1.2; }
  .eg-tray-wrap{ width:min(920px,94vw); margin-top:30px; }
  .eg-tray{ display:flex; flex-wrap:wrap; gap:26px 18px; justify-content:center; align-items:flex-start; min-height:100px; padding:20px 10px 6px; border-top:1px solid rgba(233,220,184,.15); }
  .eg-hint{ text-align:center; font-size:13px; color:var(--parchment-shadow); margin-top:6px; font-style:italic; }

  .win-overlay{ position:fixed; inset:0; background:rgba(10,6,3,.88); display:flex; align-items:center; justify-content:center; z-index:1000; opacity:0; pointer-events:none; transition:opacity .5s; }
  .win-overlay.show{ opacity:1; pointer-events:auto; }
  .win-card{ width:min(640px,92vw); background:linear-gradient(160deg, var(--parchment), var(--parchment-dark)); border-radius:12px; padding:40px 36px 34px; text-align:center; position:relative; box-shadow:0 30px 70px rgba(0,0,0,.7); transform:scale(.85); transition:transform .5s cubic-bezier(.34,1.56,.64,1); }
  .win-overlay.show .win-card{ transform:scale(1); }
  .seal{ width:88px; height:88px; margin:0 auto 18px; border-radius:50%; background:radial-gradient(circle at 35% 30%, #a83030, var(--wax) 55%, var(--wax-dark) 100%); display:flex; align-items:center; justify-content:center; font-family:'Cinzel Decorative',serif; font-size:34px; color:var(--gold-bright); box-shadow:0 8px 18px rgba(0,0,0,.5), inset 0 0 14px rgba(0,0,0,.4); transform:scale(0) rotate(-30deg); transition:transform .5s .15s cubic-bezier(.34,1.56,.64,1); }
  .win-overlay.show .seal{ transform:scale(1) rotate(0deg); }
  .win-card h2{ font-family:'Cinzel',serif; color:var(--sepia); font-size:15px; letter-spacing:.2em; text-transform:uppercase; margin:0 0 16px; }
  .win-phrase{ font-style:italic; font-size:clamp(17px,2.4vw,21px); line-height:1.6; color:var(--ink); margin:0 0 18px; }
  .win-phrase b{ color:var(--wax); font-weight:600; }
  .win-sig{ font-family:'Cinzel',serif; font-size:12px; letter-spacing:.1em; color:var(--sepia-light); margin-bottom:26px; }
  .continue-btn{ background:linear-gradient(180deg, var(--gold-bright), var(--gold)); border:none; color:var(--ink); font-family:'Cinzel',serif; font-weight:600; letter-spacing:.08em; text-transform:uppercase; font-size:13px; padding:13px 30px; border-radius:24px; cursor:pointer; box-shadow:0 6px 14px rgba(0,0,0,.35); transition:transform .15s; }
  .continue-btn:hover{ transform:translateY(-2px); }

  .advance-btn{ margin-top:24px; font-family:'Cinzel',serif; font-size:12px; letter-spacing:.1em; text-transform:uppercase; background:linear-gradient(180deg, var(--gold-bright), var(--gold)); color:var(--ink); border:none; padding:12px 26px; border-radius:22px; cursor:pointer; box-shadow:0 4px 10px rgba(0,0,0,.4); opacity:0; pointer-events:none; transform:translateY(6px); transition:opacity .4s, transform .4s; }
  .advance-btn.show{ opacity:1; pointer-events:auto; transform:translateY(0); }
</style>

<div class="shell">
  <div class="eyebrow">Escena 14 · Biblioteca de la Universidad de Atenas — Archivo Digitalizado</div>
  <h1>El Epigrama Perdido</h1>

  <div class="stage-dots" id="stageDots"></div>
  <div class="stage-title" id="stageTitle"></div>
  <p class="stage-instr" id="stageInstr"></p>

  <section class="screen active" id="screen1">
    <div id="grid1"></div>
    <div class="counter-line" id="counter1">Hallados 0 / 20</div>
    <button class="advance-btn" id="advance1">Continuar a la Etapa 2</button>
  </section>

  <section class="screen" id="screen2">
    <div class="tray2" id="tray2"></div>
    <div class="bins" id="bins2"></div>
    <button class="advance-btn" id="advance2">Continuar a la Etapa 3</button>
  </section>

  <section class="screen" id="screen3a">
    <div class="cards3a" id="cards3a"></div>
    <div class="counter3a" id="counter3a">Sin catalogar hallados: 0 / 2</div>
  </section>

  <section class="screen" id="screen3b">
    <div class="scroll-wrap">
      <div class="scroll-rod"></div>
      <div class="scroll-rod bottom"></div>
      <div class="banner-label">Pergamino restringido — texto en griego antiguo</div>
      <div class="eg-slots" id="egSlots"></div>
    </div>
    <div class="eg-tray-wrap">
      <div class="eg-tray" id="egTray"></div>
      <div class="eg-hint">Arrastra cada fragmento a su lugar · toca un fragmento para ver su significado</div>
    </div>
  </section>
</div>

<div class="win-overlay" id="winOverlay">
  <div class="win-card">
    <div class="seal">Α</div>
    <h2>Epigrama reconstruido</h2>
    <p class="win-phrase">"Las siete maravillas son testigos del <b>ingenio humano</b>, pero la <b>octava luz</b> guía a las siete desde el <b>sur del mundo</b>."</p>
    <div class="win-sig">— Antípatro de Sidón, fragmento no canónico</div>
    <button class="continue-btn" id="continueBtn">Continuar</button>
  </div>
</div>
`;

function _build(root, self) {
  // ============================================================
  // DATA
  // ============================================================
  const WONDERS = [
    { id:'a1', title:'Sobre las Siete Maravillas del Mundo', author:'Antípatro de Sidón', blurb:'Compendio poético que enumera las obras humanas dignas de asombro perpetuo.', bin:'antipatro', catalogued:true, catNum:'AΘ-114' },
    { id:'a2', title:'Cantos al Coloso y la Gran Pirámide', author:'Antípatro de Sidón', blurb:'Versos dedicados al gigante de bronce de Rodas y a la tumba más antigua entre las siete.', bin:'antipatro', catalogued:true, catNum:'AΘ-119' },
    { id:'a3', title:'Fragmentos del Jardín Suspendido', author:'Antípatro de Sidón', blurb:'Copia incompleta que describe terrazas colgantes regadas por un mecanismo oculto.', bin:'antipatro', catalogued:false },
    { id:'a4', title:'Elegías del Templo de Ártemis', author:'Antípatro de Sidón', blurb:'Lamento por el santuario de Éfeso, entre columnas y ofrendas de mármol.', bin:'antipatro', catalogued:true, catNum:'AΘ-122' },
    { id:'a5', title:'Versos sobre la Estatua de Zeus', author:'Antípatro de Sidón', blurb:'Oda a la figura crisoelefantina que dominaba el templo de Olimpia.', bin:'antipatro', catalogued:true, catNum:'AΘ-126' },
    { id:'a6', title:'El Mausoleo y otros Epigramas Perdidos', author:'Antípatro de Sidón', blurb:'Serie de epitafios sobre la tumba de Halicarnaso, hallada sin colofón.', bin:'antipatro', catalogued:false },
    { id:'f1', title:'De Septem Mundi Miraculis', author:'Filón de Bizancio', blurb:'Tratado técnico que explica, maravilla por maravilla, el ingenio detrás de su construcción.', bin:'filon', catalogued:true },
    { id:'f2', title:'Mecánica y Maravillas: el Faro', author:'Filón de Bizancio', blurb:'Estudio de los espejos y fuegos que guiaban a los navíos hacia Alejandría.', bin:'filon', catalogued:true },
    { id:'f3', title:'Sobre el Coloso: Fundición y Bronce', author:'Filón de Bizancio', blurb:'Descripción del proceso de fundición empleado para erigir al gigante de Rodas.', bin:'filon', catalogued:true },
    { id:'f4', title:'Ingeniería del Templo de Éfeso', author:'Filón de Bizancio', blurb:'Análisis de los cimientos pantanosos sobre los que se alzó el santuario de Ártemis.', bin:'filon', catalogued:true },
    { id:'f5', title:'Tratado de las Máquinas de Babilonia', author:'Filón de Bizancio', blurb:'Reconstrucción del sistema de tornillos que regaba los jardines colgantes.', bin:'filon', catalogued:true },
    { id:'d1', title:'Bibliotheca Historica, Libro II', author:'Diodoro Sículo', blurb:'Relato histórico de los jardines colgantes construidos por orden de un rey babilonio.', bin:'diodoro', catalogued:true },
    { id:'d2', title:'Bibliotheca Historica, Libro XVII', author:'Diodoro Sículo', blurb:'Crónica de Egipto que describe las pirámides como tumbas de proporciones descomunales.', bin:'diodoro', catalogued:true },
    { id:'d3', title:'Bibliotheca Historica, Libro XVIII', author:'Diodoro Sículo', blurb:'Narración del asedio de Rodas y el origen del coloso erigido tras la victoria.', bin:'diodoro', catalogued:true },
    { id:'d4', title:'Bibliotheca Historica: el Templo de Ártemis', author:'Diodoro Sículo', blurb:'Descripción del santuario efesio y de los pueblos que peregrinaban hasta él.', bin:'diodoro', catalogued:true },
    { id:'d5', title:'Bibliotheca Historica: la Estatua de Olimpia', author:'Diodoro Sículo', blurb:'Relato de la talla criselefantina de Zeus realizada por Fidias.', bin:'diodoro', catalogued:true },
    { id:'o1', title:'Pínakes de las Maravillas Célebres', author:'Calímaco de Cirene', blurb:'Catálogo bibliográfico que enumera templos, estatuas y sepulcros dignos de fama eterna.', bin:'otros', catalogued:true },
    { id:'o2', title:'Historias, Libro II: Egipto y sus Portentos', author:'Heródoto', blurb:'Descripción de las pirámides y los prodigios que rodean al Nilo.', bin:'otros', catalogued:true },
    { id:'o3', title:'Geografía: Maravillas del Oriente', author:'Estrabón', blurb:'Recuento geográfico de los monumentos más admirados entre Asia y Egipto.', bin:'otros', catalogued:true },
    { id:'o4', title:'Naturalis Historia: De Mirabilibus Mundi', author:'Plinio el Viejo', blurb:'Enciclopedia romana que dedica un capítulo a las obras más asombrosas del mundo.', bin:'otros', catalogued:true }
  ];

  const DECOYS = [
    { title:'Elementos de Geometría', author:'Euclides', blurb:'Axiomas y demostraciones sobre puntos, líneas y figuras planas.' },
    { title:'Los Persas', author:'Esquilo', blurb:'Tragedia que narra la derrota naval del imperio persa en Salamina.' },
    { title:'Historia de la Guerra del Peloponeso', author:'Tucídides', blurb:'Crónica del enfrentamiento entre Atenas y Esparta.' },
    { title:'Metafísica', author:'Aristóteles', blurb:'Indagación sobre el ser, la causa primera y la sustancia.' },
    { title:'Odas', author:'Safo', blurb:'Poemas líricos dedicados al amor y a la isla de Lesbos.' },
    { title:'Sobre las Enfermedades', author:'Hipócrates', blurb:'Tratado médico sobre síntomas, fiebres y remedios.' },
    { title:'Almagesto', author:'Claudio Ptolomeo', blurb:'Modelo matemático del movimiento de los astros y planetas.' },
    { title:'Retórica a Alejandro', author:'Anónimo peripatético', blurb:'Manual de argumentación y persuasión para la oratoria pública.' },
    { title:'Anábasis', author:'Jenofonte', blurb:'Relato de la retirada de diez mil mercenarios griegos por Persia.' },
    { title:'La República', author:'Platón', blurb:'Diálogo sobre la justicia y el diseño de la ciudad ideal.' },
    { title:'Las Nubes', author:'Aristófanes', blurb:'Comedia que satiriza a los filósofos y sus escuelas.' },
    { title:'Historia de las Plantas', author:'Teofrasto', blurb:'Clasificación sistemática de especies vegetales.' },
    { title:'Versos Áureos', author:'Atribuido a Pitágoras', blurb:'Máximas de conducta ligadas a la armonía de los números.' },
    { title:'Filípicas', author:'Demóstenes', blurb:'Discursos de advertencia contra la expansión de Macedonia.' },
    { title:'Fragmentos', author:'Heráclito', blurb:'Sentencias breves sobre el cambio perpetuo y la naturaleza del fuego.' },
    { title:'Sobre el Uso de las Partes', author:'Galeno', blurb:'Tratado de anatomía y fisiología del cuerpo humano.' },
    { title:'Sátiras', author:'Jenófanes', blurb:'Crítica a la representación antropomórfica de los dioses.' },
    { title:'El Misántropo', author:'Menandro', blurb:'Comedia de costumbres sobre un hombre que rehúye a sus vecinos.' },
    { title:'Sobre la Esfera y el Cilindro', author:'Arquímedes', blurb:'Demostraciones geométricas sobre volúmenes de sólidos.' },
    { title:'Carta a Meneceo', author:'Epicuro', blurb:'Exposición de una ética fundada en el placer moderado.' },
    { title:'Odas Olímpicas', author:'Píndaro', blurb:'Cantos corales en honor a los atletas vencedores.' },
    { title:'Sobre la Vejez', author:'Jenócrates', blurb:'Reflexiones morales sobre el paso de los años.' },
    { title:'Indica', author:'Ctesias', blurb:'Relatos fantásticos sobre pueblos y bestias de la India.' },
    { title:'Discursos Forenses', author:'Antifonte', blurb:'Defensas y acusaciones preparadas para tribunales atenienses.' },
    { title:'Sobre la Naturaleza', author:'Anaximandro', blurb:'Especulación sobre el origen del cosmos a partir del ápeiron.' },
    { title:'Elementos de Armonía', author:'Aristóxeno', blurb:'Teoría musical griega sobre intervalos y escalas.' },
    { title:'Panegírico', author:'Isócrates', blurb:'Discurso que reclama la unidad de las ciudades griegas.' },
    { title:'Terapéutica', author:'Nicandro', blurb:'Catálogo de venenos, mordeduras de serpiente y sus remedios.' },
    { title:'Sobre los Autómatas Hidráulicos', author:'Ctesibio', blurb:'Descripción de mecanismos y relojes movidos por agua.' },
    { title:'Económico', author:'Jenofonte', blurb:'Diálogo sobre la administración del hogar y la agricultura.' }
  ].map((b, i) => ({ id:'x' + i, title:b.title, author:b.author, blurb:b.blurb, bin:null }));

  const wonderIds = new Set(WONDERS.map(w => w.id));
  const BOOKS = [...WONDERS, ...DECOYS].map(b => ({ ...b, isWonder: wonderIds.has(b.id) }));

  const BIN_DEFS = [
    { id:'antipatro', label:'Antípatro de Sidón', need:6 },
    { id:'filon', label:'Filón de Bizancio', need:5 },
    { id:'diodoro', label:'Diodoro Sículo', need:5 },
    { id:'otros', label:'Descartar — no pertenece a la colección', need:4 }
  ];

  const FRAGMENTS = [
    { gr:'Ἑπτὰ θαύματα', es:'Las siete maravillas' },
    { gr:'μάρτυρές εἰσι', es:'son testigos' },
    { gr:'ἀνθρωπίνης τέχνης,', es:'del ingenio humano,' },
    { gr:'ἀλλὰ τὸ ὄγδοον φῶς', es:'pero la octava luz' },
    { gr:'τὰς ἑπτὰ ἡγεῖται', es:'guía a las siete' },
    { gr:'ἀπὸ νότου', es:'desde el sur' },
    { gr:'τοῦ κόσμου.', es:'del mundo.' }
  ];

  function shuffle(arr){ const a=arr.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; }

  // ============================================================
  // HEADER / PROGRESS
  // ============================================================
  const STAGES = [
    { title:'Etapa 1 de 3 — Rastrear los textos', instr:'El archivo digitalizado contiene 50 volúmenes de toda la Antigüedad. Encuentra los 20 que describen las Siete Maravillas del Mundo.' },
    { title:'Etapa 2 de 3 — Clasificar la colección', instr:'De los 20 libros hallados, separa cuáles pertenecen a la colección de Antípatro de Sidón, Filón de Bizancio o Diodoro Sículo. Descarta los que no pertenecen a ninguno de los tres.' },
    { title:'Etapa 3 de 3 — Los volúmenes sin catalogar', instr:'Inspecciona los seis volúmenes de Antípatro de Sidón y descubre cuáles dos nunca fueron registrados en el catálogo oficial.' },
    { title:'Etapa 3 de 3 — El pergamino restringido', instr:'Los volúmenes sin catalogar ocultaban un pergamino roto, escrito en griego antiguo. Reconstruye el orden correcto de los versos.' }
  ];
  const dotsEl = root.getElementById('stageDots');
  const titleEl = root.getElementById('stageTitle');
  const instrEl = root.getElementById('stageInstr');
  function renderDots(active){
    dotsEl.innerHTML = '';
    for(let i=0;i<3;i++){
      const d = document.createElement('div');
      d.className = 'dot' + (i < active ? ' done' : (i === active ? ' active' : ''));
      dotsEl.appendChild(d);
      if(i<2){ const line=document.createElement('div'); line.className='dot-line'; dotsEl.appendChild(line); }
    }
  }
  function setHeader(stageIndex){
    const s = STAGES[stageIndex];
    titleEl.textContent = s.title;
    instrEl.textContent = s.instr;
    renderDots(stageIndex >= 3 ? 2 : stageIndex);
  }
  function showScreen(id){
    root.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    root.getElementById(id).classList.add('active');
  }

  // ============================================================
  // GENERIC DRAG (clone-follow, ghost vive DENTRO del shadow root
  // para heredar los estilos escopados — NUNCA en document.body)
  // ============================================================
  function findDropZone(x, y){
    // Detección por geometría propia (no document.elementFromPoint):
    // si el text-box, quick-menu u otro elemento de Monogatari con mayor
    // z-index queda por encima de una casilla, elementFromPoint devolvería
    // ESE elemento en vez de la casilla y el drop nunca se resolvería.
    // Comparar contra el rect real de cada [data-dropzone] es inmune a eso.
    const zones = root.querySelectorAll('[data-dropzone]');
    for (const z of zones){
      const r = z.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return z;
    }
    return null;
  }

  function makeDraggable(el, { onTap, onDrop, ghostClass }){
    let startX, startY, moved, dragging, ghost, offsetX, offsetY;
    el.addEventListener('pointerdown', (e) => {
      startX = e.clientX; startY = e.clientY; moved = false; dragging = false;
      const rect = el.getBoundingClientRect();
      offsetX = e.clientX - rect.left; offsetY = e.clientY - rect.top;
      try{ el.setPointerCapture(e.pointerId); }catch(err){}

      const onMove = (ev) => {
        const dx = ev.clientX - startX, dy = ev.clientY - startY;
        if(!dragging && Math.hypot(dx,dy) > 6){
          dragging = true; moved = true;
          ghost = el.cloneNode(true);
          ghost.className = el.className + ' ' + ghostClass;
          ghost.style.width = el.offsetWidth + 'px';
          ghost.style.height = el.offsetHeight + 'px';
          ghost.style.pointerEvents = 'none';
          root.appendChild(ghost);
          el.style.visibility = 'hidden';
        }
        if(dragging && ghost){
          ghost.style.left = (ev.clientX - offsetX) + 'px';
          ghost.style.top = (ev.clientY - offsetY) + 'px';
          root.querySelectorAll('.drag-over').forEach(x=>x.classList.remove('drag-over'));
          const dz = findDropZone(ev.clientX, ev.clientY);
          if(dz) dz.classList.add('drag-over');
        }
      };
      const onUp = (ev) => {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
        root.querySelectorAll('.drag-over').forEach(x=>x.classList.remove('drag-over'));
        if(dragging && ghost){
          const dz = findDropZone(ev.clientX, ev.clientY);
          ghost.remove();
          el.style.visibility = 'visible';
          onDrop && onDrop(dz, el);
        } else if(!moved){
          onTap && onTap(el);
        }
        dragging = false;
      };
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    });
  }

  // ============================================================
  // STAGE 1
  // ============================================================
  const grid1 = root.getElementById('grid1');
  const counter1 = root.getElementById('counter1');
  const advance1 = root.getElementById('advance1');
  let foundCount = 0;

  // Paleta de "cuero"/tela de encuadernación — cada libro obtiene un color
  // estable (determinado por su id) para que la estantería se vea variada
  // pero consistente entre Etapa 1 y Etapa 2.
  const SPINE_COLORS = [
    ['#7c2b2b','#5a1d1d'], ['#2b4a3d','#1c332a'], ['#25344f','#182338'],
    ['#6b4423','#4a2f18'], ['#5c3a6b','#3f2749'], ['#7a5c1e','#54400f'],
    ['#2f5c5c','#1f3d3d'], ['#6b2f45','#4a2030'], ['#4a5c2f','#333f20'],
    ['#3a3a5c','#272740']
  ];
  function spineColors(id){
    let hash = 0;
    for (let i=0;i<id.length;i++) hash = (hash*31 + id.charCodeAt(i)) >>> 0;
    return SPINE_COLORS[hash % SPINE_COLORS.length];
  }

  function buildCard(book, opts){
    opts = opts || {};
    const el = document.createElement('div');
    el.className = 'book-card';
    el.dataset.id = book.id;
    el.tabIndex = 0;
    const [c1, c2] = spineColors(book.id);
    el.style.background = `linear-gradient(100deg, ${c1} 0%, ${c1} 78%, ${c2} 100%)`;
    const tooltip = opts.tooltip === false ? '' : `
      <div class="book-tooltip">
        <div class="tooltip-title">${book.title}</div>
        <div class="tooltip-author">${book.author}</div>
        <div class="tooltip-blurb">${book.blurb}</div>
      </div>`;
    el.innerHTML = `
      <div class="spine-title">${book.title}</div>
      <div class="spine-author">${book.author}</div>
      ${tooltip}
    `;
    return el;
  }

  function buildStage1(){
    grid1.innerHTML = '';
    foundCount = 0;
    counter1.textContent = `Hallados 0 / ${WONDERS.length}`;
    advance1.classList.remove('show');
    shuffle(BOOKS).forEach(book => {
      const el = buildCard(book);
      el.addEventListener('click', () => {
        if(el.classList.contains('found')) return;
        if(book.isWonder){
          el.classList.add('found');
          foundCount++;
          counter1.textContent = `Hallados ${foundCount} / ${WONDERS.length}`;
          if(foundCount === WONDERS.length) advance1.classList.add('show');
        } else {
          el.classList.add('wrong');
          setTimeout(() => el.classList.remove('wrong'), 450);
        }
      });
      grid1.appendChild(el);
    });
  }

  advance1.addEventListener('click', () => {
    setHeader(1);
    showScreen('screen2');
    buildStage2();
  });

  // ============================================================
  // STAGE 2
  // ============================================================
  const tray2 = root.getElementById('tray2');
  const bins2 = root.getElementById('bins2');
  const advance2 = root.getElementById('advance2');
  let sortedCorrect = 0;

  function buildStage2(){
    tray2.innerHTML = ''; bins2.innerHTML = ''; sortedCorrect = 0;
    advance2.classList.remove('show');
    BIN_DEFS.forEach(def => {
      const bin = document.createElement('div');
      bin.className = 'bin';
      bin.dataset.dropzone = 'bin2';
      bin.dataset.bin = def.id;
      bin.innerHTML = `<div class="bin-label">${def.label}</div><div class="bin-need">${def.need} esperados</div><div class="bin-slots"></div>`;
      bins2.appendChild(bin);
    });

    shuffle(WONDERS).forEach(book => {
      const el = buildCard(book, { tooltip: false });
      el.classList.add('mini');
      makeDraggable(el, {
        ghostClass: 'ghost-drag',
        onDrop: (dz, dragEl) => {
          if(!dz){ tray2.appendChild(dragEl); return; }
          const binId = dz.dataset.bin;
          if(binId === book.bin){
            dz.querySelector('.bin-slots').appendChild(dragEl);
            dragEl.classList.add('found');
            sortedCorrect++;
            const need = BIN_DEFS.find(b=>b.id===binId).need;
            const have = dz.querySelectorAll('.book-card.found').length;
            if(have >= need) dz.classList.add('complete');
            if(sortedCorrect === WONDERS.length) advance2.classList.add('show');
          } else {
            tray2.appendChild(dragEl);
            dragEl.classList.add('wrong');
            setTimeout(()=>dragEl.classList.remove('wrong'), 450);
          }
        }
      });
      tray2.appendChild(el);
    });
  }

  advance2.addEventListener('click', () => {
    setHeader(2);
    showScreen('screen3a');
    buildStage3a();
  });

  // ============================================================
  // STAGE 3A
  // ============================================================
  const cards3a = root.getElementById('cards3a');
  const counter3a = root.getElementById('counter3a');
  let missingFound = 0;
  const NEED_MISSING = WONDERS.filter(b => b.bin==='antipatro' && !b.catalogued).length;

  function buildStage3a(){
    cards3a.innerHTML = ''; missingFound = 0;
    counter3a.textContent = `Sin catalogar hallados: 0 / ${NEED_MISSING}`;
    const antipatroBooks = WONDERS.filter(b => b.bin === 'antipatro');
    shuffle(antipatroBooks).forEach(book => {
      const wrap = document.createElement('div');
      wrap.className = 'flip-card';
      wrap.innerHTML = `
        <div class="flip-inner">
          <div class="flip-face flip-front">
            <div class="book-title">${book.title}</div>
            <div class="book-author">${book.author}</div>
            <div class="tap-hint">Toca para inspeccionar el sello</div>
          </div>
          <div class="flip-face flip-back">
            ${book.catalogued
              ? `<div class="stamp official"><div class="snum">${book.catNum}</div><div class="slabel">Registrado</div></div>`
              : `<div class="stamp missing">SIN<br>CATALOGAR</div>`}
            <button class="select-btn">Elegir este volumen</button>
            <div class="flip-msg"></div>
          </div>
        </div>
      `;
      const front = wrap.querySelector('.flip-front');
      const btn = wrap.querySelector('.select-btn');
      const msg = wrap.querySelector('.flip-msg');
      front.addEventListener('click', () => wrap.classList.add('flipped'));
      btn.addEventListener('click', () => {
        if(btn.disabled) return;
        if(!book.catalogued){
          btn.disabled = true;
          btn.textContent = 'Volumen seleccionado';
          missingFound++;
          counter3a.textContent = `Sin catalogar hallados: ${missingFound} / ${NEED_MISSING}`;
          if(missingFound === NEED_MISSING){
            setTimeout(() => {
              setHeader(3);
              showScreen('screen3b');
              buildStage3b();
            }, 500);
          }
        } else {
          msg.textContent = 'Este volumen ya está registrado — no es este.';
          wrap.style.animation = 'none';
          void wrap.offsetWidth;
          wrap.style.animation = 'shakeCard .4s';
        }
      });
      cards3a.appendChild(wrap);
    });
  }

  // ============================================================
  // STAGE 3B
  // ============================================================
  const egSlots = root.getElementById('egSlots');
  const egTray = root.getElementById('egTray');
  const winOverlay = root.getElementById('winOverlay');
  let egSolved = false;

  function buildStage3b(){
    egSlots.innerHTML = ''; egTray.innerHTML = ''; egSolved = false;
    const N = FRAGMENTS.length;
    const slotState = new Array(N).fill(null);
    const slotEls = [];
    for(let i=0;i<N;i++){
      const s = document.createElement('div');
      s.className = 'eg-slot';
      s.dataset.dropzone = 'egslot';
      s.dataset.slot = i;
      s.dataset.num = i+1;
      egSlots.appendChild(s);
      slotEls.push(s);
    }

    const order = shuffle([...Array(N).keys()]);
    const pieces = order.map((correctIndex,i) => ({ id:'p'+i, correctIndex }));
    const pieceEls = {};

    function checkSlotVisual(el){
      const parent = el.parentElement.classList.contains('eg-slot') ? el.parentElement : null;
      if(!parent){ el.classList.remove('locked'); return; }
      const piece = pieces.find(p => p.id === el.dataset.id);
      const idx = parseInt(parent.dataset.slot,10);
      el.classList.toggle('locked', piece.correctIndex === idx);
    }
    function updateSlots(){
      slotEls.forEach((slot,i) => {
        const id = slotState[i];
        let ok = false;
        if(id){ const p = pieces.find(pp=>pp.id===id); ok = p.correctIndex===i; }
        slot.classList.toggle('correct', ok);
      });
    }
    function checkWin(){
      if(egSolved) return;
      if(slotState.some(s=>s===null)) return;
      const allOk = slotState.every((id,i) => { const p = pieces.find(pp=>pp.id===id); return p.correctIndex===i; });
      if(allOk){ egSolved = true; revealSequence(); }
    }
    function revealSequence(){
      slotEls.forEach((slot, i) => {
        setTimeout(() => {
          const el = slot.querySelector('.eg-piece');
          if(el) el.classList.add('revealed');
        }, i * 180);
      });
      setTimeout(() => {
        winOverlay.classList.add('show');
      }, N * 180 + 700);
    }

    pieces.forEach(piece => {
      let peekTimeout = null;
      const el = document.createElement('div');
      el.className = 'eg-piece';
      el.dataset.id = piece.id;
      el.innerHTML = `
        <div class="eg-face eg-face-gr">${FRAGMENTS[piece.correctIndex].gr}</div>
        <div class="eg-face eg-face-es">${FRAGMENTS[piece.correctIndex].es}</div>
      `;
      pieceEls[piece.id] = el;

      makeDraggable(el, {
        ghostClass: 'ghost',
        onTap: (tappedEl) => {
          if(tappedEl.classList.contains('revealed')) return;
          clearTimeout(peekTimeout);
          tappedEl.classList.add('peek');
          tappedEl.dataset.es = FRAGMENTS[piece.correctIndex].es;
          peekTimeout = setTimeout(() => tappedEl.classList.remove('peek'), 1400);
        },
        onDrop: (dz, dragEl) => {
          if(dz && dz.classList.contains('eg-slot')){
            const slotIndex = parseInt(dz.dataset.slot,10);
            const occupantId = slotState[slotIndex];
            const prevIdx = slotState.indexOf(piece.id);
            if(prevIdx !== -1) slotState[prevIdx] = null;
            if(occupantId && occupantId !== piece.id) egTray.appendChild(pieceEls[occupantId]);
            slotState[slotIndex] = piece.id;
            dz.appendChild(dragEl);
          } else {
            const prevIdx = slotState.indexOf(piece.id);
            if(prevIdx !== -1) slotState[prevIdx] = null;
            egTray.appendChild(dragEl);
          }
          checkSlotVisual(dragEl);
          updateSlots();
          checkWin();
        }
      });
      egTray.appendChild(el);
    });
  }

  root.getElementById('continueBtn').addEventListener('click', () => {
    winOverlay.classList.remove('show');
    console.log('[Epigrama] "Continuar" clickeado, disparando epigrama:completado...');
    // Evento público que escucha EpigramaAction (bubbles+composed para
    // que se pueda escuchar desde fuera del Shadow DOM).
    self.dispatchEvent(new CustomEvent('epigrama:completado', {
      bubbles: true, composed: true, detail: { scene: 'Escena14' }
    }));
  });

  // ============================================================
  // CONTRATO PÚBLICO: self.open() / self.close()
  // ============================================================
  self.open = function () {
    winOverlay.classList.remove('show');
    setHeader(0);
    showScreen('screen1');
    buildStage1();
    self.setAttribute('open', '');
  };
  self.close = function () {
    self.removeAttribute('open');
  };
}

class EpigramaPuzzle extends HTMLElement {
  connectedCallback() {
    if (this._built) return;
    this._built = true;
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = TEMPLATE;
    _build(root, this);
  }
}

customElements.define('epigrama-puzzle', EpigramaPuzzle);
