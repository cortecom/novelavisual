/**
 * PARCHE PARA js/script.js — Escena32_Vaticano
 *
 * Esto NO es un archivo para copiar completo: es el bloque real de tu
 * Escena32_Vaticano (líneas ~2556-2598 de tu script.js), reproducido tal
 * cual lo leí, con una sola línea nueva agregada ('laberinto vaticanoMaze').
 *
 * Busca este bloque exacto en tu script.js real y reemplázalo por el de
 * abajo (o simplemente pega la línea nueva a mano en el lugar indicado).
 *
 * ⚠️ Decisión narrativa que tomé y que deberías confirmar: inserté el
 * minijuego justo después de "Aquí, la historia fue escrita... y también
 * borrada." y ANTES de "show scene bg_documentos_vaticano" — es decir,
 * Gabriel atraviesa el laberinto (Plaza San Pedro → Museos → Capilla
 * Sixtina → Jardines → Palacio de la Gobernación → Ciudad Baja →
 * Biblioteca Apostólica) ANTES de llegar al archivo donde está Marcus.
 * Si lo quieres en otro punto de la escena (o en una escena aparte antes
 * de Escena32_Vaticano), dime y lo reubico.
 */

// ---------- ANTES (tal como está hoy en tu script.js real) ----------
//
// 	// -------------------------------------------------------------
// 	// ESCENA 32: Ciudad del Vaticano, Italia
// 	// -------------------------------------------------------------
// 	'Escena32_Vaticano': [
// 		'show scene bg_vaticano with fadeIn',
// 		'El Vaticano es un laberinto de mármol, silencio y secretos.',
// 		'Los pasillos parecen observar a quienes los recorren.',
// 		'Aquí, la historia fue escrita... y también borrada.',
// 		'show scene bg_documentos_vaticano with fadeIn',
// 		'show character marcus normal at center with fadeIn',
// 		'marcus Han venido buscando respuestas... pero algunas verdades deben permanecer ocultas.',
// 		...
// 	],

// ---------- DESPUÉS (con el minijuego insertado) ----------
//
// 	// -------------------------------------------------------------
// 	// ESCENA 32: Ciudad del Vaticano, Italia
// 	// -------------------------------------------------------------
// 	'Escena32_Vaticano': [
// 		'show scene bg_vaticano with fadeIn',
// 		'El Vaticano es un laberinto de mármol, silencio y secretos.',
// 		'Los pasillos parecen observar a quienes los recorren.',
// 		'Aquí, la historia fue escrita... y también borrada.',
//
// 		'laberinto vaticanoMaze',
//
// 		'show scene bg_documentos_vaticano with fadeIn',
// 		'show character marcus normal at center with fadeIn',
// 		'marcus Han venido buscando respuestas... pero algunas verdades deben permanecer ocultas.',
// 		...
// 	],
