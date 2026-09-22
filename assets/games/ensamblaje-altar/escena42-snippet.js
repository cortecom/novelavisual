/* ============================================================
   ESCENA 42 — Minijuego: Ensamblaje de las 8 maravillas
   (Ya integrado en tu proyecto real; este archivo queda como
   referencia del mecanismo actual.)

   v4: ya no hay elección de modo (histórico/geográfico/intuición).
   El altar tiene un único mecanismo: las 7 maravillas clásicas se
   colocan en círculo por antigüedad real, y la octava luz
   (epigrama_antipatro) va en el centro.

   Mismo patrón de invocación que el resto de tus minijuegos
   (coloso, jardin, laberinto, biblioteca, saqueo): función async
   con guarda de `monogatari.storage('player')` para no repetir el
   minijuego si el jugador vuelve a pasar por la escena, y
   `monogatari.distractionFree()` antes y después de
   `monogatari.run(...)`.
   ============================================================ */

'Escena42': [

    'show scene camara_profunda with fadeIn duration 3s',
    'narrator En la entrada de la cueva, el equipo llega nuevamente a la camara con el altar circular con ranuras.',
    'narrator Ocho ranuras. Una por cada maravilla que Antípatro y Diodoro documentaron... y una octava, la que las precede a todas.',
    /* Mostrar objetos */
    'narrator La Gran Pirámide de Giza, los Jardines Colgantes de Babilonia, el Templo de Artemisa en Éfeso...',
    'narrator La Estatua de Zeus en Olimpia, el Mausoleo de Halicarnaso, el Coloso de Rodas, el Faro de Alejandría...',
    'narrator Y la octava luz: el epigrama de Antípatro, el que la reveló.',

    /* Interacción con altar */
    'show scene altar with fadeIn',
    'narrator El altar espera ser activado.',

    async () => {
        if (!monogatari.storage('player').ensamblajeAltar) {
            monogatari.distractionFree();
            await monogatari.run('ensamblaje ensamblajePuzzle');
            monogatari.distractionFree();
            monogatari.storage('player').ensamblajeAltar = true;
        }
    },

    'narrator El altar se ilumina con una luz azul.',
    'narrator La cueva se abre lentamente.',
    'jump Escena43'
],
