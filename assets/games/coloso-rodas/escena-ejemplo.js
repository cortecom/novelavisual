// -------------------------------------------------------------
// ESCENA 23 - Minijuego Puzzle: Reconstrucción del Coloso
// Versión integrada con el componente real <coloso-puzzle>
// -------------------------------------------------------------

// ANTES (placeholder de texto, nunca fue una acción real de Monogatari):
//
// 'Escena23': [
//     '[MINIJUGO PUZZLE: RECONSTRUCCIÓN DEL COLOSO]',
//     'El jugador reconstruye digitalmente el Coloso. Al completarlo, aparece el símbolo helenístico.',
//     {
//         'Choice': {
//             'Dialog': '[PUZZLE DIGITAL: Renderizado de la estatua]',
//             'Opcion_AlinearRayos': { 'Text': '...', 'Do': '...' },
//             'Opcion_ValidarEstructura': { 'Text': '...', 'Do': '...' }
//         }
//     },
//     ()=> addItem('simulacion_coloso'),
//     { 'Choice': { ... } }
// ],

// DESPUÉS (reemplazar el bloque completo de 'Escena23' por este):

'Escena23': [
	'[MINIJUGO PUZZLE: RECONSTRUCCIÓN DEL COLOSO]',
	'Con los tres hallazgos del puerto de Rodas autenticados, comienza la reconstrucción digital pieza por pieza.',

	'coloso colosoPuzzle',

	()=> addItem('simulacion_coloso'),

	{
		'Choice': {
			'Dialog': 'gabriel (Decisión del jugador)',
			'Opcion_RutaAlejandria': {
				'Text': 'Zarpar de inmediato hacia Alejandría, Egipto',
				'Do': 'jump Escena24'
			},
			'Opcion_BaseDatos': {
				'Text': 'Sincronizar el hallazgo de Rodas con la base de datos de Atenas',
				'Do': 'jump Escena14_Decision'
			},
			'Opcion_AlineacionSol': {
				'Text': 'Calcular la alineación solar de la estatua con la octava luz',
				'Do': 'jump Escena14_Decision'
			}
		}
	}
],

// Nota: se quitó el 'Choice' de texto "[PUZZLE DIGITAL: Renderizado de la estatua]"
// (Opcion_AlinearRayos / Opcion_ValidarEstructura) porque su contenido narrativo
// (rotar los rayos de la corona, validar el equilibrio estático) ahora ES literalmente
// la Etapa 3 del minijuego real (ensamblaje de la corona/torso/piernas).
// Si prefieres conservarlo como una escena de diálogo previa al minijuego (en vez de
// eliminarlo), solo vuelve a pegarlo entre la línea de diálogo y 'coloso colosoPuzzle'.
