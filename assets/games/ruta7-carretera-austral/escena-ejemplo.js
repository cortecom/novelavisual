/*
 * escena-ejemplo.js
 * Cómo usar el minijuego de conducción como una escena más dentro de tu
 * guion. Este es exactamente el bloque ya aplicado en tu propio script.js
 * para 'Escena5_Patagonia' — se deja aquí como referencia/ejemplo, este
 * archivo no se carga automáticamente.
 */

monogatari.script({

  'Escena5_Patagonia': [
    'show scene ruta7 with fadeIn',

    'La Carretera Austral serpentea entre montañas colosales cubiertas de nieve.',
    'El viento patagónico ruge contra el vehículo de expedición mientras la lluvia helada golpea el parabrisas.',

    'erik (Sujetando firmemente el volante del jeep modificado mientras las ruedas giran sobre el barro helado) La tormenta se está cerrando rápido, doctor. En Aysén el clima no perdona los errores de cálculo. Si nos quedamos atrapados en esta quebrada antes del anochecer, la temperatura bajará a diez bajo cero.',

    'gabriel (Revisando los mapas topográficos sobre sus rodillas) No podemos dar la vuelta ahora, Erik. Las coordenadas nos sitúan a menos de tres kilómetros de la boca del fiordo.',

    'erik (Mirando por el retrovisor) Hay algo más que me preocupa... Un camión pesado nos ha estado siguiendo desde el cruce de Puerto Cenicero. Sin luces de identificación. En esta época del año nadie hace esta ruta por turismo.',

    'gabriel (Ajustando la correa de su mochila) Mantén la marcha. Si es necesario, cortaremos paso por el lecho seco del río.',

    // Pausa la historia y abre el minijuego de conducción a pantalla completa.
    // El jeep debe completar las 5 etapas de la Carretera Austral esquivando
    // camiones, rocas, árboles y murallas; si choca demasiadas veces
    // reintenta la misma etapa (no pierde el progreso de las ya superadas).
    // El guion continúa solo en cuanto el jugador termina la etapa 5 y pulsa
    // "Continuar" — sin preguntar si quiere volver a jugar. Dentro del propio
    // minijuego, ya cerca del final, Erik y Gabriel usan la Brújula de
    // Marinos Antiguos y la Libreta con Diagrama de Espiral para corregir el
    // rumbo justo antes de llegar a la cascada congelada (línea de
    // narración ambiental integrada en la propia etapa final).
    'race ruta7Race',

    'jump Escena6_Caverna'
  ]

});
