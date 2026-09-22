/* ============================================================
   Minijuego Escena 42 — "El Altar de las Ocho Maravillas"
   Archivo único: contiene el Web Component <ensamblaje-puzzle>
   Y la Action de Monogatari que registra el verbo 'ensamblaje'.

   v6: el minijuego pasó de 1 a 3 etapas, a pedido del usuario
   ("me da la impresión que el minijuego está muy sencillo, tiene una
   sola etapa"). Las 3 etapas viven dentro del MISMO componente y se
   resuelven en una sola sesión de juego — el contrato externo no
   cambia (mismo verbo 'ensamblaje', mismo evento final
   'ensamblaje:completado', disparado solo al terminar la etapa 3):

     - Etapa 1 — "El Mapa de las Maravillas": arrastrar cada una de las
       7 maravillas clásicas (los mismos 7 objetos del altar, sin la
       octava luz) hasta la ciudad del Mediterráneo donde estuvo o está.
     - Etapa 2 — "Los Testigos": arrastrar a 7 personajes históricos
       (uno por maravilla — el arquitecto, la reina, el escultor, etc.)
       hasta la misma ciudad de la maravilla con la que se le identifica.
     - Etapa 3 — el altar original: las 7 maravillas clásicas en círculo
       por antigüedad real de construcción + la octava luz
       (epigrama_antipatro) en el centro. Sin cambios de mecánica desde
       la v4/v5.

   Las etapas 1 y 2 comparten el mismo "mapa" (7 ciudades, mismas
   posiciones) — se vacía y se rellena con un elenco distinto de
   objetos arrastrables entre una etapa y la otra. La etapa 3 usa el
   altar circular ya existente. El fondo del mapa se dibuja con CSS
   (gradiente tipo pergamino antiguo) para que el minijuego funcione de
   inmediato sin depender de un nuevo asset de imagen; los 7 retratos de
   los testigos usan un medallón dibujado inline (SVG embebido, sin
   depender de archivos de arte nuevos) hasta que se genere arte
   dedicado — ver INTEGRACION.md para los prompts de esos 7 retratos.

   Ensamblaje de los 8 objetos ligados a las 8 maravillas que menciona
   el guion: las 7 Maravillas del Mundo Antiguo (Antípatro/Diodoro) más
   "la octava luz". El objeto que la representa en el altar es
   'epigrama_antipatro' — se obtiene en 'Escena37_Biblioteca_Sidon'
   (Sidón, Capítulo III), donde al combinarlo con el reactivo ácido
   revela el texto: "La octava luz guía a las siete desde el sur del
   mundo" (jump Escena38_EpigramaOriginal). Es la línea más explícita
   de todo el guion sobre la octava luz guiando a las demás, y el
   objeto se obtiene bien antes del Capítulo 4 — NO depende de la
   Escena 43. La Escena 43 (posterior a este minijuego, Escena 42) solo
   revela más tarde qué es en verdad la octava luz — una pirámide — y
   confirma narrativamente que "es la primera maravilla del mundo
   antiguo", de la que "las otras siete fueron construidas como réplicas
   simbólicas". El minijuego no depende de la Escena 43 en ningún
   sentido: los 8 objetos que arrastra el jugador ya están en su
   inventario desde antes del Capítulo 4. Por eso la octava luz NO
   participa de las etapas 1 y 2 (no tiene una "ciudad" en el itinerario
   griego/egipcio/mesopotámico: se obtiene en Sidón) — solo aparece en
   la etapa 3, en el centro del altar.

   Templo de Artemisa (Éfeso): representado por 'inscripcion_secreta',
   objeto real que ya se obtiene en 'Escena19' (cámara subterránea de
   Éfeso, jump desde Escena17/18). 'grabado_piramide_giza' ya tiene
   ícono real (assets/icons/grabado_piramide_giza.png, generado por el
   usuario) — no queda ningún ícono placeholder entre los 7 objetos de
   las maravillas.

   Bug real corregido en la v5: al terminar el minijuego, el componente
   nunca se cerraba — solo se disparaba el evento 'ensamblaje:completado'
   y la Action resolvía su promesa, pero el overlay (:host([open]) hace
   display:block, position:absolute, inset:0, z-index:5) seguía
   cubriendo toda la pantalla para siempre, porque nada quitaba el
   atributo 'open'. El botón "Continuar" (al final de la etapa 3) llama
   a self.close() antes de disparar el evento, y close() también limpia
   'mandatory' para dejar el elemento en un estado limpio.

   v7: el usuario reportó, tras probar la v6, que el fondo de las
   etapas 1 y 2 era solo pergamino liso (sin nada de mapa) y que varios
   tooltips/roles delataban la ciudad correcta de forma literal (ej.
   "Coloso de Rodas"), haciendo el arrastre demasiado fácil. Se agregó
   una capa decorativa SVG inline para el mapa (rosa de los vientos,
   oleaje, esquineros) y se recortaron los textos que mencionaban la
   ciudad de forma literal (campo 'apodo' en 5 objetos, 'rol' de 2
   testigos) — ver INTEGRACION.md, sección "Ajustes v7".

   v8: el usuario pidió 2 ajustes más al final del minijuego: (1)
   cambiar el halo/luz de la ranura central de dorado a azul (coincide
   con la narración fuera del minijuego, en escena42-snippet.js: "El
   altar se ilumina con una luz azul" — el minijuego decía "dorada" en
   su propio mensaje final, inconsistente con eso); (2) un bug real: la
   imagen y la etiqueta ("la octava luz — el origen") de la ranura
   central quedaban pegadas, visibles por encima del mensaje final de
   victoria. Causa: '.slot-centro' tiene z-index propio para
   destacarse durante el juego, y como ninguno de sus ancestros
   ('.root', '.altar-wrap', '.slots') crea su propio contexto de
   apilamiento, ese z-index competía directamente contra '.victory'
   (sin z-index) y le ganaba. Corregido ocultando '.altar-wrap' al
   mostrar la victoria (showVictory()), igual que ya se hace al
   cambiar de etapa.

   Web Component con Shadow DOM, cada bloque envuelto en su propio
   IIFE (evita colisiones globales, ver lección real con
   epigrama-puzzle.js / vaticano-maze.js, que compartían un `_build`
   sin aislar).

   Contrato externo (igual que el resto de los minijuegos del proyecto):
     - Elemento personalizado con id fijo, ej: <ensamblaje-puzzle id="ensamblajePuzzle">
     - self.open() / self.close()
     - Dispara 'ensamblaje:completado' (evento burbujeante) al terminar
       la etapa 3 (no antes)
     - La Action, más abajo en este mismo archivo, es quien escucha ese evento

   Integración: cargar ESTE ARCHIVO en index.html con un único
   <script>, después de main.js y antes de js/script.js. No hace falta
   ningún cambio en la Escena 42 ni en la Action por este rediseño de 3
   etapas — el verbo y el evento son los mismos. Ver INTEGRACION.md.
   ============================================================ */

/* ------------------------------------------------------------
   PARTE 1 — Web Component <ensamblaje-puzzle>
------------------------------------------------------------ */
(function () {
    'use strict';

    /* --------------------------------------------------------
       Las 7 ciudades del itinerario que reúne a las 7 maravillas
       clásicas (la octava luz, en Sidón, no participa de las etapas
       1 y 2 — solo del altar en la etapa 3). x/y son posiciones en
       porcentaje dentro del mapa (no coordenadas geográficas reales,
       solo una disposición legible que no se superpone).
    -------------------------------------------------------- */
    const CIUDADES = [
        { id: 'olimpia', nombre: 'Olimpia', x: 26, y: 44 },
        { id: 'rodas', nombre: 'Rodas', x: 50, y: 38 },
        { id: 'efeso', nombre: 'Éfeso', x: 56, y: 22 },
        { id: 'halicarnaso', nombre: 'Halicarnaso', x: 58, y: 32 },
        { id: 'babilonia', nombre: 'Babilonia', x: 80, y: 42 },
        { id: 'alejandria', nombre: 'Alejandría', x: 52, y: 60 },
        { id: 'giza', nombre: 'Giza', x: 58, y: 68 }
    ];

    /* --------------------------------------------------------
       Datos de los 8 objetos, uno por cada maravilla: las 7
       Maravillas del Mundo Antiguo + "la octava luz" (representada por
       'epigrama_antipatro', obtenida en Sidón, Capítulo III — ver nota
       arriba; NO depende de la Escena 43, que es posterior a este
       minijuego).

       'central: true' marca al único objeto que va en la ranura
       central del altar (la octava luz, etapa 3). Los otros 7 llevan
       'orden' (1..7, antigüedad real de construcción, etapa 3) y
       'ciudad' (id de CIUDADES, etapas 1 y 2).

       'icon' apunta a los mismos paths que usa itemIcons en
       script.js. Los 8 objetos ya tienen ícono real — no queda ningún
       placeholder.

       'apodo' (solo en los 5 objetos cuyo nombre formal en 'maravilla'
       incluye la ciudad, ej. "Coloso de RODAS") es el nombre corto sin
       la ciudad, usado en el tooltip de la Etapa 1 — ver nota sobre
       "pistas de ciudad" más abajo, junto a etapaConfig(1).
    -------------------------------------------------------- */
    const OBJETOS = [
        {
            id: 'epigrama_antipatro',
            nombre: 'Epigrama de Antípatro',
            maravilla: 'La Octava Luz',
            icon: 'assets/icons/epigrama_antipatro.png',
            region: 'Sidón',
            era: 'La maravilla original — precede a las otras siete (el epigrama que la revela: "La octava luz guía a las siete desde el sur del mundo")',
            central: true
        },
        {
            id: 'grabado_piramide_giza',
            nombre: 'Grabado de la Gran Pirámide',
            maravilla: 'Gran Pirámide de Giza',
            apodo: 'La Gran Pirámide',
            icon: 'assets/icons/grabado_piramide_giza.png',
            region: 'Giza, Egipto',
            era: '~2560 a.C. — la única de las siete que sigue en pie',
            orden: 1,
            ciudad: 'giza'
        },
        {
            id: 'jardines_reconstruidos',
            nombre: 'Jardines Colgantes Reconstruidos',
            maravilla: 'Jardines Colgantes de Babilonia',
            apodo: 'Los Jardines Colgantes',
            icon: 'assets/icons/jardines_reconstruidos_hero.png',
            region: 'Babilonia, Irak',
            era: '~600 a.C.',
            orden: 2,
            ciudad: 'babilonia'
        },
        {
            id: 'inscripcion_secreta',
            nombre: 'Inscripción Secreta',
            maravilla: 'Templo de Artemisa',
            icon: 'assets/icons/inscripcion_secreta.png',
            region: 'Éfeso, Turquía',
            era: '~550 a.C.',
            orden: 3,
            ciudad: 'efeso'
        },
        {
            id: 'fragmento_marfil',
            nombre: 'Fragmento de Marfil de Zeus',
            maravilla: 'Estatua de Zeus',
            icon: 'assets/icons/fragmento_marfil.png',
            region: 'Olimpia, Grecia',
            era: '~435 a.C.',
            orden: 4,
            ciudad: 'olimpia'
        },
        {
            id: 'miniatura_cuadriga',
            nombre: 'Miniatura de la Cuadriga',
            maravilla: 'Mausoleo de Halicarnaso',
            apodo: 'El Mausoleo',
            icon: 'assets/icons/miniatura_cuadriga.png',
            region: 'Halicarnaso, Turquía',
            era: '~350 a.C.',
            orden: 5,
            ciudad: 'halicarnaso'
        },
        {
            id: 'simulacion_coloso',
            nombre: 'Símbolo del Coloso',
            maravilla: 'Coloso de Rodas',
            apodo: 'El Coloso',
            icon: 'assets/icons/simulacion_coloso.png',
            region: 'Rodas, Grecia',
            era: '~280 a.C.',
            orden: 6,
            ciudad: 'rodas'
        },
        {
            id: 'pergamino_faro',
            nombre: 'Pergamino del Faro',
            maravilla: 'Faro de Alejandría',
            apodo: 'El Faro',
            icon: 'assets/icons/pergamino_faro.png',
            region: 'Alejandría, Egipto',
            era: '~280 a.C.',
            orden: 7,
            ciudad: 'alejandria'
        }
    ];

    /* --------------------------------------------------------
       Retrato genérico (medallón SVG inline, sin depender de un
       archivo de imagen) para los 7 testigos de la Etapa 2. Cuando el
       usuario genere retratos reales, basta con cambiar 'icon' en
       TESTIGOS por el path real (ver prompts en INTEGRACION.md); el
       componente no necesita ningún otro cambio.
    -------------------------------------------------------- */
    const BUSTO_SVG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
        '<circle cx="50" cy="50" r="47" fill="#2a1c0f" stroke="#a9884f" stroke-width="4"/>' +
        '<circle cx="50" cy="39" r="15" fill="#cbb789"/>' +
        '<path d="M18 90 Q18 60 50 60 Q82 60 82 90 Z" fill="#cbb789"/>' +
        '</svg>'
    );

    /* --------------------------------------------------------
       Decoración del mapa de las Etapas 1 y 2 (rosa de los vientos,
       oleaje y esquineros ornamentales), dibujada inline como SVG para
       que el mapa se vea como un mapa antiguo real y no solo como una
       textura de pergamino — sin depender de ningún archivo de imagen
       nuevo. Usa el mismo espacio porcentual (viewBox 0 0 100 100) que
       las coordenadas x/y de CIUDADES, así que los adornos se ubicaron
       a mano en las zonas donde no cae ningún pin de ciudad. Si más
       adelante se genera un mapa ilustrado real (ver INTEGRACION.md),
       esta capa se reemplaza por un <img> de fondo en '.mapa-wrap'.
    -------------------------------------------------------- */
    const MAPA_DECOR_SVG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">' +
        '<g fill="none" stroke="#6b4a22" stroke-width="0.5" opacity="0.55">' +
        '<path d="M4,11 L4,4 L11,4"/>' +
        '<path d="M89,4 L96,4 L96,11"/>' +
        '<path d="M4,89 L4,96 L11,96"/>' +
        '<path d="M96,89 L96,96 L89,96"/>' +
        '<path d="M9,10 q2,-2.6 4,0 q2,2.6 4,0"/>' +
        '<path d="M9,13.5 q2,-2.6 4,0 q2,2.6 4,0"/>' +
        '<path d="M82,9 q2,-2.6 4,0 q2,2.6 4,0"/>' +
        '<path d="M82,12.5 q2,-2.6 4,0 q2,2.6 4,0"/>' +
        '<path d="M10,85 q2,-2.6 4,0 q2,2.6 4,0"/>' +
        '<path d="M10,88.5 q2,-2.6 4,0 q2,2.6 4,0"/>' +
        '<circle cx="89" cy="89" r="6.5"/>' +
        '<line x1="89" y1="83" x2="89" y2="95"/>' +
        '<line x1="83" y1="89" x2="95" y2="89"/>' +
        '<line x1="84.6" y1="84.6" x2="93.4" y2="93.4"/>' +
        '<line x1="93.4" y1="84.6" x2="84.6" y2="93.4"/>' +
        '</g>' +
        '<text x="89" y="80.7" font-size="3" text-anchor="middle" fill="#6b4a22" opacity="0.6" font-family="Georgia, serif">N</text>' +
        '<text x="50" y="9" font-size="4" letter-spacing="1.5" text-anchor="middle" fill="#6b4a22" opacity="0.45" font-family="Georgia, serif" font-style="italic">MARE NOSTRUM</text>' +
        '</svg>'
    );

    /* --------------------------------------------------------
       Los 7 testigos históricos de la Etapa 2 — uno por maravilla,
       vinculado a la misma ciudad que su objeto en OBJETOS. La
       sacerdotisa de Éfeso es un rol genérico (no hay una sacerdotisa
       nombrada en las fuentes), igual que en el resto del guion.

       Ninguno de los 'rol' menciona la ciudad de forma literal (se
       revisaron los 7 uno por uno): el jugador debe saber a qué
       maravilla se refiere cada testigo y, por su cuenta, a qué
       ciudad corresponde esa maravilla — igual criterio que en
       OBJETOS/etapaConfig(1), para que la Etapa 2 no se resuelva solo
       leyendo el texto.
    -------------------------------------------------------- */
    const TESTIGOS = [
        { id: 'hemiunu', nombre: 'Hemiunu', rol: 'Arquitecto real de la Gran Pirámide', ciudad: 'giza', icon: BUSTO_SVG },
        { id: 'amitis', nombre: 'Amitis', rol: 'Reina para quien se habrían construido los Jardines', ciudad: 'babilonia', icon: BUSTO_SVG },
        { id: 'sacerdotisa_efeso', nombre: 'La Sacerdotisa de Artemisa', rol: 'Guardiana del Templo de Artemisa', ciudad: 'efeso', icon: BUSTO_SVG },
        { id: 'fidias', nombre: 'Fidias', rol: 'Escultor de la Estatua de Zeus', ciudad: 'olimpia', icon: BUSTO_SVG },
        { id: 'artemisia_ii', nombre: 'Artemisia II', rol: 'Viuda de Mausolo, mandó construir el Mausoleo', ciudad: 'halicarnaso', icon: BUSTO_SVG },
        { id: 'cares_de_lindos', nombre: 'Cares de Lindos', rol: 'Escultor del Coloso', ciudad: 'rodas', icon: BUSTO_SVG },
        { id: 'sostrato_de_cnido', nombre: 'Sóstrato de Cnido', rol: 'Arquitecto del Faro', ciudad: 'alejandria', icon: BUSTO_SVG }
    ];

    const TEMPLATE = `
        <style>
            :host {
                all: initial;
                position: absolute;
                inset: 0;
                z-index: 5;
                display: none;
                font-family: 'Cinzel', 'Georgia', serif;
            }
            :host([open]) {
                display: block;
            }
            * { box-sizing: border-box; }

            .root {
                position: absolute;
                inset: 0;
                background: radial-gradient(ellipse at center, rgba(20,14,8,.92) 0%, rgba(6,4,2,.97) 100%);
                color: #f1e6cf;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 2.2vh 2vw 1.6vh;
                overflow: hidden;
            }

            .close-btn {
                position: absolute;
                top: 14px;
                right: 18px;
                width: 34px;
                height: 34px;
                border-radius: 50%;
                border: 1px solid #a9884f;
                background: rgba(0,0,0,.4);
                color: #e8d8ab;
                font-size: 16px;
                cursor: pointer;
                line-height: 1;
            }
            :host([mandatory]) .close-btn {
                display: none;
            }

            h1 {
                margin: 0 0 2px;
                font-size: clamp(18px, 2.6vw, 28px);
                letter-spacing: .04em;
                text-align: center;
                color: #f3d78a;
                text-shadow: 0 0 10px rgba(243,215,138,.35);
            }
            .etapa-label {
                margin: 0 0 4px;
                font-size: clamp(10px, 1.1vw, 12px);
                letter-spacing: .08em;
                text-transform: uppercase;
                text-align: center;
                color: #7fe2c9;
            }
            .instrucciones {
                margin: 0 0 10px;
                font-size: clamp(11px, 1.3vw, 14px);
                color: #cbb789;
                text-align: center;
                font-style: italic;
                max-width: 640px;
            }

            .altar-wrap, .mapa-wrap {
                position: relative;
                width: min(52vh, 52vw, 520px);
                height: min(52vh, 52vw, 520px);
                margin: 0 auto;
                flex-shrink: 0;
            }
            .mapa-wrap.hidden, .altar-wrap.hidden {
                display: none;
            }
            .altar-bg {
                width: 100%;
                height: 100%;
                object-fit: contain;
                filter: drop-shadow(0 0 24px rgba(0,0,0,.6));
                pointer-events: none;
                user-select: none;
            }
            .mapa-bg {
                position: absolute;
                inset: 4%;
                border-radius: 10px;
                background:
                    radial-gradient(ellipse at 30% 30%, rgba(255,255,255,.05), transparent 60%),
                    linear-gradient(160deg, #e3c98f 0%, #cba86a 45%, #b3894f 100%);
                border: 3px solid #7a5a30;
                box-shadow: inset 0 0 40px rgba(70,45,15,.55), 0 0 20px rgba(0,0,0,.5);
            }
            .mapa-bg::after {
                content: '';
                position: absolute;
                inset: 0;
                border-radius: 8px;
                background:
                    repeating-linear-gradient(45deg, rgba(90,60,20,.05) 0 2px, transparent 2px 6px);
                opacity: .5;
            }
            .mapa-decor {
                position: absolute;
                inset: 4%;
                border-radius: 10px;
                background-repeat: no-repeat;
                background-size: 100% 100%;
                pointer-events: none;
            }
            .slots, .pines {
                position: absolute;
                inset: 0;
            }
            .slot {
                position: absolute;
                width: 13%;
                height: 13%;
                transform: translate(-50%, -50%);
                border-radius: 50%;
                border: 2px dashed rgba(233, 199, 120, .55);
                background: rgba(0,0,0,.28);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: box-shadow .2s ease, border-color .2s ease, background .2s ease;
            }
            .slot .num {
                position: absolute;
                top: -9px;
                left: -9px;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #2a1c0f;
                border: 1px solid #a9884f;
                font-size: 11px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #f3d78a;
            }
            .slot .hint {
                position: absolute;
                bottom: -20px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 9px;
                white-space: nowrap;
                color: #cbb789;
                opacity: .85;
                pointer-events: none;
            }
            .slot img {
                width: 78%;
                height: 78%;
                object-fit: contain;
                pointer-events: none;
                user-select: none;
            }
            .slot.filled {
                border-style: solid;
                border-color: #7fe28a;
                background: rgba(30,60,20,.35);
                box-shadow: 0 0 14px rgba(127,226,138,.5);
            }
            .slot.dragover {
                border-color: #f3d78a;
                box-shadow: 0 0 16px rgba(243,215,138,.6);
            }
            .slot.reject {
                animation: shake .38s ease;
                border-color: #e05c5c;
            }
            @keyframes shake {
                0%, 100% { transform: translate(-50%, -50%); }
                25% { transform: translate(calc(-50% - 6px), -50%); }
                75% { transform: translate(calc(-50% + 6px), -50%); }
            }

            /* Ciudades del mapa (etapas 1 y 2) — mismo estilo de ranura
               que el altar, pero con el nombre de la ciudad siempre
               visible debajo (el desafío es saber a qué ciudad
               corresponde cada objeto/testigo, no encontrar la
               ciudad). */
            .slot.ciudad {
                border-color: rgba(60, 40, 15, .65);
                background: rgba(255,255,255,.14);
            }
            .slot.ciudad .hint {
                opacity: 1;
                font-weight: 700;
                color: #3a2510;
                text-shadow: 0 1px 0 rgba(255,255,255,.35);
            }
            .slot.ciudad.dragover {
                border-color: #7a5326;
                box-shadow: 0 0 16px rgba(122,83,38,.5);
            }

            /* Ranura central — la octava luz. Más grande y con un halo
               azul pulsante (coincide con la narración de la Escena 42:
               "El altar se ilumina con una luz azul") para destacarla
               como el "lugar importante" del altar, del que las otras 7
               son réplicas. */
            .slot-centro {
                width: 21%;
                height: 21%;
                z-index: 2;
                border: 2px solid rgba(111,195,240,.85);
                background: radial-gradient(circle, rgba(111,195,240,.18) 0%, rgba(0,0,0,.35) 72%);
                box-shadow: 0 0 22px rgba(111,195,240,.55);
                animation: pulseCentro 2.4s ease-in-out infinite;
            }
            .slot-centro.filled {
                animation: none;
                border-color: #7fe28a;
                background: rgba(30,60,20,.35);
                box-shadow: 0 0 30px rgba(127,226,138,.65);
            }
            .slot-centro.dragover {
                animation: none;
                border-color: #6fc3f0;
                box-shadow: 0 0 34px rgba(111,195,240,.85);
            }
            @keyframes pulseCentro {
                0%, 100% { box-shadow: 0 0 18px rgba(111,195,240,.5); }
                50% { box-shadow: 0 0 30px rgba(111,195,240,.85); }
            }
            .hint-centro {
                bottom: -22px;
                font-size: 10px;
                font-weight: 700;
                letter-spacing: .03em;
                color: #6fc3f0;
                opacity: 1;
            }

            .progreso {
                margin: 10px 0 6px;
                font-size: clamp(11px, 1.4vw, 14px);
                color: #e8d8ab;
            }

            .tray {
                list-style: none;
                margin: 0;
                padding: 8px 10px;
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                justify-content: center;
                max-width: min(90vw, 900px);
                border-top: 1px solid rgba(169,136,79,.4);
                width: 100%;
            }
            .tray li {
                width: 56px;
                height: 56px;
                border-radius: 10px;
                border: 1px solid #a9884f;
                background: rgba(20,14,8,.65);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: grab;
                touch-action: none;
                position: relative;
            }
            .tray li img {
                width: 74%;
                height: 74%;
                object-fit: contain;
                pointer-events: none;
                user-select: none;
            }
            .tray li.hidden {
                visibility: hidden;
                pointer-events: none;
            }

            .dragging-clone {
                position: fixed;
                width: 56px;
                height: 56px;
                pointer-events: none;
                z-index: 9999;
                opacity: .9;
            }
            .dragging-clone img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }

            .feedback {
                min-height: 18px;
                font-size: clamp(10px, 1.2vw, 13px);
                color: #e6a1a1;
                text-align: center;
            }
            .feedback.ok {
                color: #7fe2c9;
            }

            .tooltip {
                position: fixed;
                background: rgba(10,7,4,.95);
                border: 1px solid #a9884f;
                color: #f1e6cf;
                font-size: 12px;
                padding: 5px 9px;
                border-radius: 6px;
                pointer-events: none;
                z-index: 10000;
                opacity: 0;
                transition: opacity .12s ease;
                max-width: 220px;
            }
            .tooltip.visible { opacity: 1; }

            .victory {
                position: absolute;
                inset: 0;
                background: rgba(6,4,2,.94);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                padding: 20px;
            }
            .victory.hidden { display: none; }
            .victory h2 {
                color: #f3d78a;
                font-size: clamp(20px, 3vw, 30px);
                margin: 0 0 10px;
            }
            .victory p {
                color: #e8d8ab;
                max-width: 480px;
                line-height: 1.5;
                margin: 0 0 20px;
            }
            .continuar-btn {
                background: linear-gradient(180deg, #f3d78a, #c9a24d);
                color: #2a1c0f;
                border: none;
                border-radius: 6px;
                padding: 10px 26px;
                font-size: 15px;
                font-weight: 700;
                letter-spacing: .03em;
                cursor: pointer;
            }
        </style>

        <div class="root">
            <button class="close-btn" title="Cerrar">&#10005;</button>
            <h1>El Altar de las Ocho Maravillas</h1>
            <p class="etapa-label"></p>
            <p class="instrucciones"></p>

            <div class="mapa-wrap hidden">
                <div class="mapa-bg"></div>
                <div class="mapa-decor" style="background-image:url('${MAPA_DECOR_SVG}')"></div>
                <div class="pines"></div>
            </div>

            <div class="altar-wrap hidden">
                <img class="altar-bg" src="assets/scenes/altar.png" alt="Altar circular con ranuras">
                <div class="slots"></div>
            </div>

            <div class="progreso"></div>
            <div class="feedback"></div>
            <ul class="tray"></ul>

            <div class="victory hidden">
                <h2>El altar se activa</h2>
                <p class="victory-text"></p>
                <button class="continuar-btn">Continuar</button>
            </div>
        </div>
        <div class="tooltip"></div>
    `;

    class EnsamblajePuzzle extends HTMLElement {
        constructor () {
            super ();
            this._root = this.attachShadow ({ mode: 'open' });
        }

        connectedCallback () {
            if (!this._built) {
                this._built = true;
                _build (this._root, this);
            }
        }

        open () {
            this.setAttribute ('open', '');
            if (this._reset) this._reset ();
        }

        close () {
            this.removeAttribute ('open');
            this.removeAttribute ('mandatory');
        }
    }

    function _build (root, self) {
        root.innerHTML = TEMPLATE;

        const $root = root.querySelector ('.root');
        const $closeBtn = root.querySelector ('.close-btn');
        const $etapaLabel = root.querySelector ('.etapa-label');
        const $instrucciones = root.querySelector ('.instrucciones');
        const $mapaWrap = root.querySelector ('.mapa-wrap');
        const $pinesWrap = root.querySelector ('.pines');
        const $altarWrap = root.querySelector ('.altar-wrap');
        const $slotsWrap = root.querySelector ('.slots');
        const $tray = root.querySelector ('.tray');
        const $progreso = root.querySelector ('.progreso');
        const $feedback = root.querySelector ('.feedback');
        const $victory = root.querySelector ('.victory');
        const $victoryText = root.querySelector ('.victory-text');
        const $continuarBtn = root.querySelector ('.continuar-btn');
        const $tooltip = root.querySelector ('.tooltip');

        /* Evita que el clic dentro del componente dispare el
           "clic para avanzar" del motor (mismo patrón que script.js:
           stopPropagation SOLO en 'click', nunca en pointerup/mousedown,
           para no romper el drag). */
        $root.addEventListener ('click', (event) => event.stopPropagation ());

        $closeBtn.addEventListener ('click', () => {
            self.close ();
        });

        let etapa = 1;          // 1, 2 o 3
        let placed = {};        // id -> zona
        let slotEls = {};       // zona -> element (ranuras o pines, según la etapa)
        let trayEls = {};       // id -> <li>
        let activeDrag = null;  // { obj, li, clone, offsetX, offsetY }
        let currentConfig = null; // config de la etapa activa (ver etapaConfig())

        function showTooltip (text, x, y) {
            if (!text) return;
            $tooltip.textContent = text;
            positionTooltip (x, y);
            $tooltip.classList.add ('visible');
        }
        function positionTooltip (x, y) {
            const offset = 14;
            let left = x + offset;
            let top = y + offset;
            $tooltip.style.left = `${left}px`;
            $tooltip.style.top = `${top}px`;
        }
        function hideTooltip () {
            $tooltip.classList.remove ('visible');
        }

        /* --------------------------------------------------------
           Configuración de cada etapa: qué items se arrastran, a qué
           zona corresponde cada uno, y los textos de UI. Las etapas 1
           y 2 comparten el mapa (7 ciudades); la etapa 3 usa el altar
           (1 centro + 7 exteriores).
        -------------------------------------------------------- */
        function etapaConfig (n) {
            if (n === 1) {
                return {
                    usaMapa: true,
                    items: OBJETOS.filter ((o) => !o.central),
                    zonaCorrecta: (item) => item.ciudad,
                    // 'apodo' (si existe) es el nombre de la maravilla sin la
                    // ciudad — evita que el tooltip regale la respuesta (ej.
                    // "Coloso de Rodas" delataría 'Rodas' de inmediato).
                    tooltip: (item) => `${item.nombre} — ${item.apodo || item.maravilla}`,
                    mensajeError: (item) => `${item.nombre} no corresponde a esa ciudad.`,
                    etiqueta: 'Etapa 1 de 3 — El mapa de las maravillas',
                    instrucciones: 'Arrastra cada maravilla a la ciudad del Mediterráneo donde estuvo o está.',
                    unidad: 'maravillas ubicadas',
                    mensajeExito: 'Las siete maravillas encuentran su lugar en el mapa.'
                };
            }
            if (n === 2) {
                return {
                    usaMapa: true,
                    items: TESTIGOS,
                    zonaCorrecta: (item) => item.ciudad,
                    tooltip: (item) => `${item.nombre} — ${item.rol}`,
                    mensajeError: (item) => `${item.nombre} no está vinculado con esa ciudad.`,
                    etiqueta: 'Etapa 2 de 3 — Los testigos',
                    instrucciones: 'Arrastra a cada testigo histórico a la ciudad de la maravilla con la que se le identifica.',
                    unidad: 'testigos identificados',
                    mensajeExito: 'Los siete testigos quedan junto a su maravilla.'
                };
            }
            return {
                usaMapa: false,
                items: OBJETOS,
                zonaCorrecta: (item) => (item.central ? 'centro' : String (item.orden)),
                tooltip: (item) => `${item.nombre} — ${item.maravilla}`,
                mensajeError: (item, zona) => {
                    if (item.central) {
                        return 'La octava luz solo encaja en el centro del altar — es el origen de las demás.';
                    }
                    if (zona === 'centro') {
                        return 'El centro del altar es solo para la octava luz.';
                    }
                    return `${item.nombre} no corresponde a esa posición cronológica.`;
                },
                etiqueta: 'Etapa 3 de 3 — El altar',
                instrucciones: 'Coloca las siete maravillas clásicas en la ranura de su época (1 = la más antigua … 7 = la más reciente) y la octava luz — su origen — en el centro del altar.',
                unidad: 'objetos colocados',
                mensajeExito: null // usa showVictory(), pantalla final distinta
            };
        }

        function layoutPines () {
            $pinesWrap.innerHTML = '';
            slotEls = {};
            CIUDADES.forEach ((ciudad) => {
                const slot = document.createElement ('div');
                slot.className = 'slot ciudad';
                slot.style.left = `${ciudad.x}%`;
                slot.style.top = `${ciudad.y}%`;
                slot.dataset.zone = ciudad.id;

                const hint = document.createElement ('div');
                hint.className = 'hint';
                hint.textContent = ciudad.nombre;
                slot.appendChild (hint);

                $pinesWrap.appendChild (slot);
                slotEls[ciudad.id] = slot;
            });
        }

        function layoutSlotsAltar () {
            $slotsWrap.innerHTML = '';
            slotEls = {};

            // Ranura central — la octava luz, el origen de las demás.
            const centro = document.createElement ('div');
            centro.className = 'slot slot-centro';
            centro.style.left = '50%';
            centro.style.top = '50%';
            centro.dataset.zone = 'centro';
            const hintCentro = document.createElement ('div');
            hintCentro.className = 'hint hint-centro';
            hintCentro.textContent = 'la octava luz — el origen';
            centro.appendChild (hintCentro);
            $slotsWrap.appendChild (centro);
            slotEls.centro = centro;

            // 7 ranuras exteriores — las maravillas clásicas, en
            // círculo, ordenadas por antigüedad real (1 = más antigua).
            const exteriores = OBJETOS.filter ((o) => !o.central).length;
            const cx = 50, cy = 50, r = 39;
            for (let i = 1; i <= exteriores; i++) {
                const angle = (Math.PI * 2 * (i - 1)) / exteriores - Math.PI / 2;
                const x = cx + r * Math.cos (angle);
                const y = cy + r * Math.sin (angle);

                const slot = document.createElement ('div');
                slot.className = 'slot';
                slot.style.left = `${x}%`;
                slot.style.top = `${y}%`;
                slot.dataset.zone = String (i);

                const num = document.createElement ('div');
                num.className = 'num';
                num.textContent = String (i);
                slot.appendChild (num);

                const hint = document.createElement ('div');
                hint.className = 'hint';
                hint.textContent = i === 1 ? 'más antigua' : (i === exteriores ? 'más reciente' : '');
                slot.appendChild (hint);

                $slotsWrap.appendChild (slot);
                slotEls[i] = slot;
            }
        }

        function shuffle (arr) {
            const a = arr.slice ();
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor (Math.random () * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        }

        function buildTray () {
            $tray.innerHTML = '';
            trayEls = {};
            const orden = shuffle (currentConfig.items);
            orden.forEach ((item) => {
                const li = document.createElement ('li');
                li.dataset.id = item.id;
                const img = document.createElement ('img');
                img.src = item.icon;
                img.alt = item.nombre;
                li.appendChild (img);

                li.addEventListener ('mouseenter', (event) => {
                    showTooltip (currentConfig.tooltip (item), event.clientX, event.clientY);
                });
                li.addEventListener ('mousemove', (event) => {
                    positionTooltip (event.clientX, event.clientY);
                });
                li.addEventListener ('mouseleave', hideTooltip);

                li.addEventListener ('pointerdown', (event) => onPointerDown (event, item, li));

                $tray.appendChild (li);
                trayEls[item.id] = li;
            });
        }

        function findDropZone (clientX, clientY) {
            /* Geometría, no elementFromPoint: el clon flotante que sigue
               al puntero taparía el elemento real bajo el cursor. */
            for (const key of Object.keys (slotEls)) {
                const el = slotEls[key];
                if (el.classList.contains ('filled')) continue;
                const rect = el.getBoundingClientRect ();
                if (
                    clientX >= rect.left && clientX <= rect.right &&
                    clientY >= rect.top && clientY <= rect.bottom
                ) {
                    return { zone: key, el };
                }
            }
            return null;
        }

        function onPointerDown (event, item, li) {
            if (li.classList.contains ('hidden')) return;
            event.preventDefault ();
            hideTooltip ();

            const rect = li.getBoundingClientRect ();
            const clone = document.createElement ('div');
            clone.className = 'dragging-clone';
            clone.style.left = `${rect.left}px`;
            clone.style.top = `${rect.top}px`;
            const img = document.createElement ('img');
            img.src = item.icon;
            clone.appendChild (img);
            root.appendChild (clone);

            activeDrag = { item, li, clone, offsetX: rect.width / 2, offsetY: rect.height / 2 };

            const move = (ev) => {
                if (!activeDrag) return;
                clone.style.left = `${ev.clientX - activeDrag.offsetX}px`;
                clone.style.top = `${ev.clientY - activeDrag.offsetY}px`;

                Object.values (slotEls).forEach ((el) => el.classList.remove ('dragover'));
                const zone = findDropZone (ev.clientX, ev.clientY);
                if (zone) zone.el.classList.add ('dragover');
            };

            const up = (ev) => {
                document.removeEventListener ('pointermove', move);
                document.removeEventListener ('pointerup', up);
                if (!activeDrag) return;

                Object.values (slotEls).forEach ((el) => el.classList.remove ('dragover'));
                const zone = findDropZone (ev.clientX, ev.clientY);
                clone.remove ();
                activeDrag = null;

                if (zone) {
                    attemptPlace (item, li, zone.zone, zone.el);
                } else {
                    // se soltó fuera de cualquier ranura: no pasa nada
                }
            };

            document.addEventListener ('pointermove', move);
            document.addEventListener ('pointerup', up);
        }

        function attemptPlace (item, li, zone, slotEl) {
            const requerido = currentConfig.zonaCorrecta (item);
            const correcto = (requerido === zone);

            if (!correcto) {
                slotEl.classList.add ('reject');
                setTimeout (() => slotEl.classList.remove ('reject'), 380);
                $feedback.classList.remove ('ok');
                $feedback.textContent = currentConfig.mensajeError (item, zone);
                return;
            }

            $feedback.textContent = '';
            li.classList.add ('hidden');
            placed[item.id] = zone;

            slotEl.classList.add ('filled');
            slotEl.querySelectorAll ('img').forEach ((n) => n.remove ());
            const img = document.createElement ('img');
            img.src = item.icon;
            img.alt = item.nombre;
            slotEl.appendChild (img);

            updateProgress ();

            if (Object.keys (placed).length === currentConfig.items.length) {
                if (etapa < 3) {
                    $feedback.classList.add ('ok');
                    $feedback.textContent = currentConfig.mensajeExito;
                    setTimeout (() => irAEtapa (etapa + 1), 900);
                } else {
                    setTimeout (showVictory, 350);
                }
            }
        }

        function updateProgress () {
            $progreso.textContent = `${Object.keys (placed).length} / ${currentConfig.items.length} ${currentConfig.unidad}`;
        }

        function showVictory () {
            $victoryText.textContent = 'El mapa, los testigos y el altar coinciden: las siete maravillas clásicas, ordenadas por antigüedad, rodean a la octava luz en el centro. El origen reconoce a sus réplicas: el altar se ilumina con una luz azul y la cueva se abre lentamente.';
            // Bug real reportado por el usuario: el altar (con la imagen y
            // la etiqueta "la octava luz — el origen" de la ranura central)
            // se quedaba pegado, visible por encima del mensaje final. La
            // ranura central tiene z-index propio (para destacarla sobre el
            // resto del altar mientras se juega) y ninguno de sus ancestros
            // (.root, .altar-wrap, .slots) crea un contexto de apilamiento
            // propio, así que ese z-index se comparaba directamente contra
            // '.victory' (sin z-index) y le ganaba, sin importar el orden en
            // el DOM. Se oculta el altar explícitamente al mostrar la
            // victoria, igual que ya se hace al cambiar de etapa.
            $altarWrap.classList.add ('hidden');
            $victory.classList.remove ('hidden');
        }

        function irAEtapa (n) {
            etapa = n;
            currentConfig = etapaConfig (n);
            placed = {};
            activeDrag = null;

            $etapaLabel.textContent = currentConfig.etiqueta;
            $instrucciones.textContent = currentConfig.instrucciones;
            $feedback.textContent = '';
            $feedback.classList.remove ('ok');
            $victory.classList.add ('hidden');

            $mapaWrap.classList.toggle ('hidden', !currentConfig.usaMapa);
            $altarWrap.classList.toggle ('hidden', currentConfig.usaMapa);

            if (currentConfig.usaMapa) {
                layoutPines ();
            } else {
                layoutSlotsAltar ();
            }

            updateProgress ();
            buildTray ();
        }

        $continuarBtn.addEventListener ('click', () => {
            // Bug real reportado por el usuario: el componente nunca se
            // cerraba al terminar — solo se disparaba el evento y la
            // Action resolvía la promesa, pero el overlay (:host([open]))
            // seguía cubriendo la pantalla para siempre porque nadie
            // quitaba el atributo 'open'. self.close() debe llamarse
            // aquí mismo, antes de avisarle a la Action que ya terminó.
            self.close ();
            self.dispatchEvent (new CustomEvent ('ensamblaje:completado', { bubbles: true, composed: true }));
        });

        self._reset = function () {
            irAEtapa (1);
        };
    }

    customElements.define ('ensamblaje-puzzle', EnsamblajePuzzle);
})();


/* ------------------------------------------------------------
   PARTE 2 — Action de Monogatari para el verbo 'ensamblaje'

   Contrato (idéntico al resto de las acciones del proyecto,
   ver INTEGRACION.md y la lección documentada para laberinto-action.js):
     - extiende Monogatari.Action (namespace en MAYÚSCULA, NO un
       'Action' global suelto — eso falla en el proyecto real).
     - static id es un campo, no un método.
     - static matchString([action]) reconoce el verbo.
     - constructor([verb, elementId]) recibe los tokens desestructurados.
     - apply() abre el componente y espera 'ensamblaje:completado'
       (que ahora solo se dispara al terminar la etapa 3, no antes).
     - didApply() devuelve {advance: true} para que el guion siga solo.
------------------------------------------------------------ */
(function () {
    'use strict';

    class EnsamblajeAction extends Monogatari.Action {

        static id = 'ensamblaje';

        static matchString ([action]) {
            return action === 'ensamblaje';
        }

        constructor ([verb, elementId]) {
            super ();
            this.elementId = elementId;
        }

        willApply () {
            return Promise.resolve ();
        }

        apply () {
            return new Promise ((resolve) => {
                const element = document.getElementById (this.elementId);

                if (!element) {
                    console.error (`[EnsamblajeAction] No se encontró el elemento #${this.elementId}. ¿Está <ensamblaje-puzzle id="${this.elementId}"> en el <game-screen>?`);
                    resolve ();
                    return;
                }

                // 'mandatory' oculta el botón X y bloquea el guion hasta completar.
                element.setAttribute ('mandatory', '');

                const onCompleted = () => {
                    element.removeEventListener ('ensamblaje:completado', onCompleted);
                    resolve ();
                };

                element.addEventListener ('ensamblaje:completado', onCompleted);
                element.open ();
            });
        }

        didApply () {
            return Promise.resolve ({ advance: true });
        }

        willRevert () {
            return Promise.resolve ();
        }

        revert () {
            const element = document.getElementById (this.elementId);
            if (element) {
                element.close ();
            }
            return Promise.resolve ();
        }

        didRevert () {
            return Promise.resolve ({ advance: true });
        }
    }

    monogatari.registerAction (EnsamblajeAction);
})();
