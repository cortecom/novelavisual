// -------------------------------------------------------------
// ESCENA 33: Documentos del siglo IV — Biblioteca Secreta Vaticana
// (reemplaza la narración plana original por el minijuego de 3 etapas)
// -------------------------------------------------------------
'Escena33_BibliotecaVaticana': [
	'show scene bg_archivo_vaticano with fadeIn',

	'show character marcus reluctant at center with fadeIn',
	'marcus Está bien. Les abriré los anaqueles que nadie fuera de Roma ha visto. Pero lo que lean aquí no sale de estos muros.',

	'show character gabriel talk at left with fadeIn',
	'gabriel Cada maravilla tiene su historia, Marcus. Déjenos encontrarlas.',

	'hide text-box',
	'hide quick-menu',
	'biblioteca bibliotecaVaticana',
	'show text-box',
	'show quick-menu',

	'show character marcus talk at center with fadeIn',
	'marcus Ahora ya lo saben. Seis maravillas, seis silencios distintos: obispos, incendios, saqueos, invasores, terremotos.',

	'show character isidora talk at right with fadeIn',
	'isidora ¿Y la séptima? La Gran Pirámide sigue en pie.',

	'marcus Por eso mismo. Lo que resiste incomoda más que lo que desaparece.',

	'show character gabriel talk at left with fadeIn',
	'gabriel Pero hay algo más en estos documentos. Un texto distinto a los demás...',

	'marcus Eso... no debería estar ahí.',

	'jump Escena34_ObjetoOcultoVaticano'
],
