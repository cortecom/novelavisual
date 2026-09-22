/*
 * escena-ejemplo.js
 * Ejemplo de cómo usar el rompecabezas de coordenadas como una escena más
 * dentro de tu guion. Copia y adapta este bloque a tu propio script.js —
 * este archivo no se carga automáticamente, es solo referencia.
 */

monogatari.script({

  'Templo-Perdido': [
    'show background templo-interior',
    'play sound wind-echo',

    'Cristian Este pergamino... son coordenadas. Tres ciudades marcadas con runas.',
    'Cristian Si logro descifrarlas, sabré hacia dónde viajar después de esto.',

    // Pausa la historia, muestra el rompecabezas a pantalla completa.
    // El guion continúa automáticamente en cuanto se resuelven las tres coordenadas.
    'puzzle cityPuzzle',

    'Cristian Alejandría... Halicarnaso... Babilonia. Ya sé qué camino seguir.',

    // Ejemplo: guardar que el acertijo fue resuelto, útil para condicionar
    // diálogos o el mapa de viaje más adelante.
    'if (!storage.cifradoTresCiudades) { storage.cifradoTresCiudades = true; }',

    'jump Camara-Siguiente'
  ],

  'Camara-Siguiente': [
    'show background camara-secreta',
    'Cristian La puerta se abre hacia el sur. El viaje apenas comienza.',
    // ...continúa tu historia...
  ]

});
