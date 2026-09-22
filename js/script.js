/* global monogatari */

// Agregar un objeto
function addItem(item) {
    try {
        const inv = monogatari.storage('player').inventory;
        if (!inv.includes(item)) {
            inv.push(item);
            monogatari.storage('player').inventory = inv;
            updateInventoryIcons();
        }
    } catch (e) {
        // Si esto lanza una excepción sin atrapar, Monogatari deja el flag
        // interno 'block' pegado en true para siempre (ver Run Cycle [JS Function]
        // en monogatari.js), congelando el clic-para-avanzar en cualquier escena
        // posterior. Mejor loguear el error y seguir que romper el guion entero.
        console.error('[addItem] Error al agregar el item al inventario:', item, e);
    }
}

// Quitar un objeto
function removeItem(item) {
    const inv = monogatari.storage('player').inventory.slice();
    const newInv = inv.filter(i => i !== item);
    monogatari.storage('player').inventory = newInv;
    // Si el item estaba seleccionado, deseleccionarlo
    if (monogatari.storage('player').selectedItem === item) {
        monogatari.storage('player').selectedItem = null;
    }
    updateInventoryIcons();
}

// Verificar si el jugador tiene un objeto
function hasItem(item) {
    return monogatari.storage('player').inventory.includes(item);
}

function updateInventoryUI() {
    const inv = monogatari.storage('player').inventory;
    const list = document.getElementById('inventory-list');
    list.innerHTML = '';

    inv.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
    });
}

/* Íconos de objetos */
/* Íconos, nombres y descripciones de objetos */
const itemIcons = {
    'llave_antigua': {
        icon: 'assets/icons/llave_antigua.png',
        name: 'Llave Antigua',
        description: 'Una llave de acceso académico.'
    },
    'panuelo': {
        icon: 'assets/icons/panuelo.png',
        name: 'Pañuelo',
        description: 'Un pañuelo con un bordado difícil de distinguir.'
    },
    'mapa': {
        icon: 'assets/icons/mapa.png',
        name: 'Mapa',
        description: 'Un mapa que muestra los lugares encontrados y los lugares completados'
    },
    'libro': {
        icon: 'assets/icons/libro.png',
        name: 'Libro',
        description: 'Un libro con anotaciones de los descubrimientos.'
    },  
 
    'diagrama_espiral': {
        icon: 'assets/icons/diagrama_espiral.png',
        name: 'Diagrama de Espiral',
        description: 'Un dibujo que representa un digrama de espiral que se encuentra en la piedra de Ngenechén.'
    },
    'escritura': {
        icon: 'assets/icons/escritura.png',
        name: 'Escritura Antigua',
        description: 'Fragmentos de una escritura difícil de traducir.'
    },
    'escritura_antigua': {
        icon: 'assets/icons/escritura_antigua.png',
        name: 'Escritura Antigua',
        description: 'Fragmentos de una escritura difícil de traducir.'
    },
    'fichas_cartograficas': {
        icon: 'assets/icons/fichas_cartograficas.png',
        name: 'Fichas Cartográficas',
        description: 'Antecedentes de excavaciones históricas y coordenadas de Aysén.'
    },
	'contacto_isidora': {
        icon: 'assets/icons/contacto_isidora.png',
        name: 'Mensaje de Isidora',
        description: 'Mensaje de Apoyo de isidora para investigar.'
    },  
	'contacto_erik': {
        icon: 'assets/icons/contacto_erik.png',
        name: 'Mensaje de Tomas',
        description: 'Mensaje de Apoyo de Erik para investigar la Patagonia.'
    },  
	'contacto_tomas': {
        icon: 'assets/icons/contacto_tomas.png',
        name: 'Mensaje de Tomas',
        description: 'Mensaje de Apoyo de Tomas para investigar.'
    },  
    'contacto_helena': {
        icon: 'assets/icons/contacto_helena.png',
        name: 'Mensaje de Helena',
        description: 'Mensaje de Apoyo Internacional de Helena Papadakis en Grecia.'
    },    
	'contacto_marcus': {
        icon: 'assets/icons/contacto_marcus.png',
        name: 'Mensaje de Marcus',
        description: 'Mensaje de Apoyo de Marcus para investigar.'
    },
    'relieve_halicarnaso': {
        icon: 'assets/icons/relieve_halicarnaso.png',
        name: 'Relieve de Halicarnaso',
        description: 'Relieve del Mauselo de Halicarnaso en Turquía.'
    },  
    'analisis_sedimento': {
        icon: 'assets/icons/analisis_sedimento.png',
        name: 'Análsis de Sedimento',
        description: 'Análisis de Sedimento del Rio Nilo en Egipto.'
    },   
    'tubo': {
        icon: 'assets/icons/tubo.png',
        name: 'Tubo de terracota',
        description: 'Tubo de terracota helénica con resina y cera de abejas.'
    },    
    'bisturi_termico': {
        icon: 'assets/icons/bisturi_termico.png',
        name: 'Bisturi termico',
        description: 'Bisturi térmico de campo.'
    },  
    'coordenadas_antiguas': {
        icon: 'assets/icons/coordenadas_antiguas.png',
        name: 'Pergamino con coordenadas antiguas',
        description: 'Pergamino con tres conjuntos de coordenadas primarias en el mediterraneo y el norte de africa.'
    }, 
    'collar': {
        icon: 'assets/icons/collar.png',
        name: 'Collar',
        description: 'Un collar ceremonial de origen incierto.'
    },
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'simbolo' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'simbolo': {
        icon: 'assets/icons/simbolo.png',
        name: 'Símbolo',
        description: 'Un símbolo cuyo significado aún no comprendes.'
    },
    'cantaro': {
        icon: 'assets/icons/cantaro.png',
        name: 'Cántaro',
        description: 'Un cántaro de cerámica, sorprendentemente intacto.'
    },
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'pincel' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'pincel': {
        icon: 'assets/icons/pincel.png',
        name: 'Pincel',
        description: 'Un pincel artesanal, aún con restos de pintura.'
    },
    'amuleto': {
        icon: 'assets/icons/amuleto.png',
        name: 'Amuleto',
        description: 'Un amuleto pequeño con un grabado protector.'
    },

    // Piedra de Ngenechén
    'piedra_ngenechen': {
        icon: 'assets/icons/piedra.png',
        name: 'Piedra de Ngenechén',
        description: 'Una piedra sagrada asociada a Ngenechén.'
    },
    'palanca': {
        icon: 'assets/icons/palanca.png',
        name: 'Barra de Palanca de Titanio',
        description: 'Herramienta de alta resistencia para despejar escombros y bloques pesados.'
    },
    // Pergamino de los Guardianes del Sur
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'pergamino_guardianes' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'pergamino_guardianes': {
        icon: 'assets/icons/mapa.png',
        name: 'Pergamino de los Guardianes',
        description: 'Un pergamino con relatos de los Guardianes del Sur.'
    },
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'pergamino_guardianes_02' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'pergamino_guardianes_02': {
        icon: 'assets/icons/mapa.png',
        name: 'Pergamino de los Guardianes (II)',
        description: 'La segunda parte del pergamino de los Guardianes del Sur.'
    },

    // Pistas / documentos
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'pergamino_hint' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'pergamino_hint': {
        icon: 'assets/icons/mapa.png',
        name: 'Pergamino con Pista',
        description: 'Un pergamino que contiene una pista útil.'
    },
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'pergamino_reminder' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'pergamino_reminder': {
        icon: 'assets/icons/mapa.png',
        name: 'Pergamino Recordatorio',
        description: 'Notas que dejaste para recordar algo importante.'
    },
    // Grabados de maravillas
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'grabado_faro_alejandria' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'grabado_faro_alejandria': {
        icon: 'assets/icons/mapa.png',
        name: 'Grabado del Faro de Alejandría',
        description: 'Un grabado que representa el Faro de Alejandría.'
    },
    'grabado_piramide_giza': {
        icon: 'assets/icons/grabado_piramide_giza.png',
        name: 'Grabado de la Gran Pirámide de Giza',
        description: 'Un grabado que muestra un bloque de piedra caliza de la Gran Pirámide de Giza.'
    },
	'gps_antiguo': {
        icon: 'assets/icons/gps_antiguo.png',
        name: 'GPS Antiguo',
        description: 'Un equipo que describe y guardas datos georeferenciales.'
	},
//Capitulo 2
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'tablet_investigacion' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'tablet_investigacion': {
        icon: 'assets/icons/tablet_investigacion.png',
        name: 'Tablet Táctica HD',
        description: 'Dispositivo con archivo fotográfico de alta resolución y zoom digital.'
    },
    'lupa_filologo': {
        icon: 'assets/icons/lupa_filologo.png',
        name: 'Lupa de Filólogo',
        description: 'Herramienta óptica de aumento para inspeccionar trazos microscópicos y pigmentos.'
    },
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'georradar_portatil' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'georradar_portatil': {
        icon: 'assets/icons/georradar.png',
        name: 'Georradar Escáner',
        description: 'Equipo portátil para detectar anomalías de densidad bajo capas de tierra y piedra.'
    },
    // [REVISION 2026-09-22] CLAVE DUPLICADA: sobrescribe una definicion anterior de 'pincel_arqueologico' en itemIcons (la primera queda inerte). Conviene unificar en una sola entrada.
    'pincel_arqueologico': {
        icon: 'assets/icons/pincel_arqueologico.png',
        name: 'Pincel de Cerdas Suaves',
        description: 'Utilizado para limpiar polvo secular y proteger grietas en ruinas delicadas.'
    },
    'fragmento_marfil': {
        icon: 'assets/icons/fragmento_marfil.png',
        name: 'Fragmento de Marfil Carbonizado',
        description: 'Pieza original de la estatua de Zeus en Olimpia con incisiones en espiral.'
    },
	'inscripcion_secreta': {
		icon: 'assets/icons/inscripcion_secreta.png',
		name: 'Inscripción Secreta',
		description: 'Un mensaje en griego koiné que significa: “La luz del sur preservará lo que el norte destruye.”'
	},
	'fragmento_diodoro': {
		icon: 'assets/icons/fragmento_diodoro.png', // placeholder — ver INTEGRACION.md
		name: 'Fragmento de Diodoro',
		description: 'Un fragmento sin catalogar de la Bibliotheca historica de Diodoro Sículo, hallado en el archivo de Siria.'
	},
	'manuscrito_vaticano': {
		icon: 'assets/icons/manuscrito_vaticano.png', // placeholder — ver INTEGRACION.md
		name: 'Manuscrito del Siglo IV',
		description: 'El manuscrito vaticano que confirma explícitamente la Patagonia como "las montañas del fin del mundo".'
	},
	'simulacion_coloso': {
		icon: 'assets/icons/simulacion_coloso.png',
		name: 'Simulación del Coloso de Rodas',
		description: 'Modelo digital detallado de la estructura del Coloso de Rodas, basado en registros históricos.'
	},
	'contacto_diodoro': {
		icon: 'assets/icons/contacto_diodoro.png',
		name: 'Contacto con Diodoro Sículo',
		description: 'Historiador griego del siglo I a.C. que documentó las Siete Maravillas en su obra "Bibliotheca historica".'
	},
	'contacto_antipatro': {
		icon: 'assets/icons/contacto_antipatro.png',
		name: 'Contacto con Antipatro de Sidón',
		description: 'Poeta griego del siglo II a.C. que escribió epigramas por primera vez sobre las Siete Maravillas.'
	},
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'espectrometro' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'espectrometro': {
        icon: 'assets/icons/espectrometro.png', // [REVISION 2026-09-22] FALTA IMAGEN: no existe 'assets/icons/espectrometro.png' en la carpeta de iconos adjunta.
        name: 'Espectrómetro Portátil',
        description: 'Dispositivo para medir trazos químicos, sulfatos y residuos de aceites antiguos.'
    },
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'lampara_uv' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'lampara_uv': {
        icon: 'assets/icons/lampara_uv.png',
        name: 'Lámpara Ultravioleta',
        description: 'Emite luz fluorescente para revelar pigmentos invisibles y trazados direccionales.'
    },
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'cuerda_kevlar' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'cuerda_kevlar': {
        icon: 'assets/icons/cuerda_kevlar.png',
        name: 'Cuerda Táctica de Kevlar',
        description: 'Línea de seguridad ligera y ultraresistente para descensos y rescates.'
    },
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'papel_vaciado' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'papel_vaciado': {
        icon: 'assets/icons/papel_vaciado.png', // [REVISION 2026-09-22] FALTA IMAGEN: no existe 'assets/icons/papel_vaciado.png' en la carpeta de iconos adjunta.
        name: 'Papel de Vaciado y Grafito',
        description: 'Material especializado para realizar calcos perfectos de inscripciones en piedra.'
    },
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'camara_macro' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'camara_macro': {
        icon: 'assets/icons/camara_macro.png',
        name: 'Cámara Fotográfica Macro',
        description: 'Equipada con flash rasante para resaltar micro-fisuras ocultas en relieves.'
    },
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'nivel_laser' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'nivel_laser': {
        icon: 'assets/icons/nivel_laser.png',
        name: 'Nivel Láser de Alta Precisión',
        description: 'Proyecta líneas de fuga y alineaciones geométricas sobre cimientos antiguos.'
    },
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'brujula_geodesica' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'brujula_geodesica': {
        icon: 'assets/icons/brujula_geodesica.png',
        name: 'Brújula de Levantamiento',
        description: 'Permite calcular orientaciones magnéticas y desviaciones hacia el Pacífico Sur.'
    },
    'miniatura_cuadriga': {
        icon: 'assets/icons/miniatura_cuadriga.png',
        name: 'Miniatura de Cuadriga en Bronce',
        description: 'Llave geométrica de acuñación recuperada en el Mausoleo de Halicarnaso.'
    },
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'dron_subacuatico' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'dron_subacuatico': {
        icon: 'assets/icons/dron_subacuatico.png', // [REVISION 2026-09-22] FALTA IMAGEN: no existe 'assets/icons/dron_subacuatico.png' en la carpeta de iconos adjunta.
        name: 'Dron Sumergible con Sonar',
        description: 'Vehículo operado por control remoto para inspeccionar ruinas portuarias sumergidas.'
    },
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'carta_nautica' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'carta_nautica': {
        icon: 'assets/icons/carta_nautica.png', // [REVISION 2026-09-22] FALTA IMAGEN: no existe 'assets/icons/carta_nautica.png' en la carpeta de iconos adjunta.
        name: 'Carta Náutica Histórica',
        description: 'Mapa antiguo para rastrear anclajes y corrientes marinas del Mediterráneo.'
    },
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'llave_cobre' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'llave_cobre': {
        icon: 'assets/icons/llave_cobre.png', // [REVISION 2026-09-22] FALTA IMAGEN: no existe 'assets/icons/llave_cobre.png' en la carpeta de iconos adjunta.
        name: 'Llave de Cobre del Archivo',
        description: 'Llave con muescas en forma de delta para abrir depósitos protegidos en Alejandría.'
    },
    'pergamino_faro': {
        icon: 'assets/icons/pergamino_faro.png',
        name: 'Papiro del Faro de Alejandría',
        description: 'Documento del siglo I a.C. con anotaciones sobre rutas hacia el fin del mundo.'
    },
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'cilindro_nitrogeno' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'cilindro_nitrogeno': {
        icon: 'assets/icons/cilindro_nitrogeno.png',
        name: 'Cilindro Hermético de Nitrógeno',
        description: 'Estuche sellado al vacío para preservar documentos frágiles contra la humedad.'
    },
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'maletin_ip67' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'maletin_ip67': {
        icon: 'assets/icons/maletin_ip67.png',
        name: 'Maletín Estanque IP67',
        description: 'Contenedor impermeable de alta seguridad para salvaguardar discos y muestras.'
    },
//Capitulo 3
	'jardines_reconstruidos': {
        icon: 'assets/icons/jardines_reconstruidos_hero.png',
        name: 'Jardines Colgantes Reconstruidos',
        description: 'Modelo a escala del antiguo jardín colgado, restaurado con base en registros históricos.'
    },
	// [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'bajorelieve_babilonico' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
	'bajorelieve_babilonico': {
        icon: 'assets/icons/bajorelieve_babilonico.png', // [REVISION 2026-09-22] FALTA IMAGEN: no existe 'assets/icons/bajorelieve_babilonico.png' en la carpeta de iconos adjunta.
        name: 'Bajorelieve Babilónico',
        description: 'Fragmento de escultura en bajo relieve que representa escenas de la vida cotidiana en Babilonia. '
    },
	'simbolo_babilonico': {
        icon: 'assets/icons/simbolo_babilonico.png',
        name: 'Símbolo Babilónico',
        description: 'Un símbolo cuyo significado aún no comprendes.'
    },
	'poesia_votiva': {
        icon: 'assets/icons/poesia_votiva.png',
        name: 'Poesía Votiva y de Costumbres',
        description: 'Colección de poemas dedicados a rituales religiosos y prácticas culturales.'
    },
	'epigramas_funerarios': {
        icon: 'assets/icons/epigramas_funerarios.png',
        name: 'Epigramas Funerarios y Epitafios',
        description: 'Ofrendas a los dioses, reflexiones sobre el paso del tiempo, el dolor por la destrucción de ciudades (como su célebre elegía ante la destrucción de Corinto en el 146 a. C.).'
    },
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'brujula_antigua' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'brujula_antigua': {
        icon: 'assets/icons/brujula_antigua.png',
        name: 'Brújula de Navegación',
        description: 'Una brújula antigua con marcas de desgaste que señala hacia un punto magnético inusual.'
    },
	'epigrama_antipatro': {
        icon: 'assets/icons/epigrama_antipatro.png',
        name: 'Epigrama de Antipatro',
        description: 'Un epigrama antiguo y misterioso que contiene un mensaje oculto sobre el destino de una expedición marítima. Esta cubierto de caliza y es difícil de leer.'
    },
	'poesia_ecfrastica': {
        icon: 'assets/icons/poesia_ecfrastica.png',
        name: 'Poesía Ecfrástica y Descriptiva',
        description: 'Poemas dedicados a describir obras de arte, monumentos y lugares célebres (de aquí surge su famoso poema sobre las Siete Maravillas del Mundo Antiguo).'
    },
	'reactivo_acido': {
        icon: 'assets/icons/reactivo_acido.png',
        name: 'Reactivo Ácido',
        description: 'Un líquido corrosivo que puede ser utilizado para revelar inscripciones ocultas en superficies rocosas.'
    },
	'paleta': {
	    icon: 'assets/icons/paleta.png',
        name: 'Paleta Arqueologica',
        description: 'Una paleta para excavar sitios arqueologicos.'
    },
	// [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'fragmento_estela' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
	'fragmento_estela': {
        icon: 'assets/icons/fragmento_estela.png', // [REVISION 2026-09-22] FALTA IMAGEN: no existe 'assets/icons/fragmento_estela.png' en la carpeta de iconos adjunta.
        name: 'Fragmento de Estela',
        description: 'Un trozo de piedra con inscripciones grabadas que parecen formar parte de un mapa mayor.'
    },
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'diario_expedicion' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'diario_expedicion': {
        icon: 'assets/icons/diario_expedicion.png', // [REVISION 2026-09-22] FALTA IMAGEN: no existe 'assets/icons/diario_expedicion.png' en la carpeta de iconos adjunta.
        name: 'Diario de Expedición',
        description: 'Libreta de notas con anotaciones de campo y coordenadas borrosas sobre el sur de Chile.'
    },
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'lente_aumento' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'lente_aumento': {
        icon: 'assets/icons/lente_aumento.png', // [REVISION 2026-09-22] FALTA IMAGEN: no existe 'assets/icons/lente_aumento.png' en la carpeta de iconos adjunta.
        name: 'Lente de Precisión',
        description: 'Lente de aumento manual útil para examinar marcas sutiles en superficies rocosas.'
    },
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'llave_hierro' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'llave_hierro': {
        icon: 'assets/icons/llave_hierro.png', // [REVISION 2026-09-22] FALTA IMAGEN: no existe 'assets/icons/llave_hierro.png' en la carpeta de iconos adjunta.
        name: 'Llave de Hierro Oxidado',
        description: 'Una llave pesada cubierta de herrumbre, encontrada cerca de la entrada principal.'
    },
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'sello_arcilla' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'sello_arcilla': {
        icon: 'assets/icons/sello_arcilla.png', // [REVISION 2026-09-22] FALTA IMAGEN: no existe 'assets/icons/sello_arcilla.png' en la carpeta de iconos adjunta.
        name: 'Sello de Arcilla',
        description: 'Pequeño bloque de arcilla seca que conserva la impronta de un emblema olvidado.'
    },
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'mapa_rutas' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'mapa_rutas': {
        icon: 'assets/icons/mapa_rutas.png', // [REVISION 2026-09-22] FALTA IMAGEN: no existe 'assets/icons/mapa_rutas.png' en la carpeta de iconos adjunta.
        name: 'Mapa de Rutas Costeras',
        description: 'Cartografía detallada de los canales australes y rutas de aproximación marítima.'
    },
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'insignia_metalica' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'insignia_metalica': {
        icon: 'assets/icons/insignia_metalica.png', // [REVISION 2026-09-22] FALTA IMAGEN: no existe 'assets/icons/insignia_metalica.png' en la carpeta de iconos adjunta.
        name: 'Insignia Metálica',
        description: 'Distintivo oxidado con relieves geométricos difíciles de decodificar a simple vista.'
    },
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'frasco_muestras' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'frasco_muestras': {
        icon: 'assets/icons/frasco_muestras.png', // [REVISION 2026-09-22] FALTA IMAGEN: no existe 'assets/icons/frasco_muestras.png' en la carpeta de iconos adjunta.
        name: 'Frasco de Muestras',
        description: 'Recipiente hermético que contiene sedimentos y partículas recolectadas en el sitio.'
    },
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'cinta_metrica' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'cinta_metrica': {
        icon: 'assets/icons/cinta_metrica.png', // [REVISION 2026-09-22] FALTA IMAGEN: no existe 'assets/icons/cinta_metrica.png' en la carpeta de iconos adjunta.
        name: 'Cinta Métrica de Topógrafo',
        description: 'Herramienta enrollable de lona y metal para medir distancias y dimensiones en ruinas.'
    },
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'linterna_tactica' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'linterna_tactica': {
        icon: 'assets/icons/linterna_tactica.png',
        name: 'Linterna de Alta Potencia',
        description: 'Dispositivo de iluminación portátil fundamental para explorar recovecos oscuros.'
    },
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'estuche_herramientas' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'estuche_herramientas': {
        icon: 'assets/icons/estuche_herramientas.png',
        name: 'Estuche de Herramientas Menores',
        description: 'Kit compacto con espátulas, pinzas y cinceles pequeños para excavación delicada.'
    },
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'documento_codificado' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'documento_codificado': {
        icon: 'assets/icons/documento_codificado.png', // [REVISION 2026-09-22] FALTA IMAGEN: no existe 'assets/icons/documento_codificado.png' en la carpeta de iconos adjunta.
        name: 'Documento Cifrado',
        description: 'Hoja de papel ajada con secuencias numéricas y símbolos crípticos.'
    },
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'amuleto_piedra' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'amuleto_piedra': {
        icon: 'assets/icons/amuleto_piedra.png', // [REVISION 2026-09-22] FALTA IMAGEN: no existe 'assets/icons/amuleto_piedra.png' en la carpeta de iconos adjunta.
        name: 'Amuleto de Piedra Tallada',
        description: 'Pequeño talismán pulido con perforaciones para colgar al cuello.'
    },
    // [REVISION 2026-09-22] SIN USO EN ESCENAS: no se detectaron llamadas a addItem/hasItem/removeItem ni otras referencias a 'placa_inscripcion' fuera de itemIcons. Revisar si falta implementarlo o si puede eliminarse.
    'placa_inscripcion': {
        icon: 'assets/icons/placa_inscripcion.png', // [REVISION 2026-09-22] FALTA IMAGEN: no existe 'assets/icons/placa_inscripcion.png' en la carpeta de iconos adjunta.
        name: 'Placa Conmemorativa',
        description: 'Placa metálica desgastada por el tiempo con inscripciones parcialmente legibles.'
    },
//Capitulo 4
	'hielo_fosil': {
		icon: 'assets/icons/hielo_fosil.png',
		name: 'Hielo fosil',
		description: 'hielo muy antiguo de épocas geológicas pasadas que se ha conservado almacenado en la naturaleza, a pesar de que las temperaturas actuales de la zona ya no son lo suficientemente frías como para formarlo.'
	},
	'artefacto_luz': {
		icon: 'assets/icons/artefacto_luz.png',
		name: 'Artefacto de la Luz',
		description: 'Un disco de aleación desconocida con símbolos mapuches y helenísticos entrelazados. Parece vibrar con energía propia.'
	},
	'palo_antorcha': {
		icon: 'assets/icons/palo_antorcha.png',
		name: 'Palo de Antorcha',
		description: 'Un palo de antorcha apagado.'
	},
	'antorcha_encendida': {
		icon: 'assets/icons/antorcha_encendida.png',
		name: 'Antorcha Encendido',
		description: 'Un palo de antorcha encendido.'
	}
};

/* Objeto actualmente seleccionado */
let selectedItem = null;

/* Actualizar barra de inventario con íconos */
function updateInventoryIcons() {
    hideTooltip(); // por si había uno visible antes de redibujar la lista

    const inv = monogatari.storage('player').inventory;
    const list = document.getElementById('inventory-icons');
    if (!list) {
        // Defensivo: si el elemento todavía no está en el DOM en este instante
        // (timing entre escenas), salimos sin tronar en vez de lanzar una
        // excepción que dejaría 'block' pegado en true en el motor.
        console.warn('[updateInventoryIcons] #inventory-icons no encontrado en el DOM, se omite el redibujado.');
        return;
    }
    list.innerHTML = '';

    inv.forEach(item => {
        const data = itemIcons[item] || {};
        const li = document.createElement('li');
        const img = document.createElement('img');

        img.src = data.icon || 'assets/icons/default.png';
        img.alt = data.name || item;
        img.dataset.item = item;
        // ya no usamos img.title, el tooltip custom lo reemplaza

        li.appendChild(img);

        li.onclick = () => {
            // Si hay un objeto distinto ya seleccionado, primero probamos si "item"
            // es un destino válido para esa combinación (objeto usado sobre objeto).
            if (selectedItem && selectedItem !== item && usarObjetoSobreObjeto(item)) {
                document.querySelectorAll('#inventory-icons li')
                    .forEach(el => el.classList.remove('selected'));
                return; // clic consumido por la combinación, no togglear selección
            }

            const isSame = selectedItem === item;
            selectedItem = isSame ? null : item;

            document.querySelectorAll('#inventory-icons li')
                .forEach(el => el.classList.remove('selected'));

            if (selectedItem) {
                li.classList.add('selected');
                startIconFollow(item);
            } else {
                stopIconFollow();
            }
        };

        li.addEventListener('mouseenter', (event) => {
            const text = data.description || data.name || item;
            showTooltip(text, event.clientX, event.clientY);
        });

        li.addEventListener('mousemove', (event) => {
            positionTooltip(event.clientX, event.clientY);
        });

        li.addEventListener('mouseleave', hideTooltip);

        list.appendChild(li);
    });
}

/* Mostrar barra de inventario */
function showInventoryBar () {
    const bar = document.getElementById('inventory-bar');
    if (bar) {
        bar.style.display = 'block';
    }
}

/* Ocultar barra de inventario */
function hideInventoryBar () {
    const bar = document.getElementById('inventory-bar');
    if (bar) {
        bar.style.display = 'none';
    }
}

function selectItem(item) {
    const current = monogatari.storage('player').selectedItem;

    if (current === item) {
        monogatari.storage('player').selectedItem = null;
    } else {
        monogatari.storage('player').selectedItem = item;
    }
}

const hotspotsAbiertos = new Set();

function showHotspot(item) {
    const hotspot = document.getElementById(item);
    hotspot.style.display = "block";
    hotspot.style.pointerEvents = "auto";
    hotspotsAbiertos.add(item);
}

function hideHotspot(item) {
	quitarImagenDeHotspot(item); 
    const hotspot = document.getElementById(item);
    if (!hotspot) { hotspotsAbiertos.delete(item); return; }
    hotspot.style.display = "none";
    hotspot.style.pointerEvents = "none";
    hideTooltip();
    hotspotsAbiertos.delete(item);
}

function hideAllHotspots() {
    Array.from(hotspotsAbiertos).forEach(hideHotspot);
	quitarTodasLasImagenes();
}

/* ===== Imágenes sobre la grilla de hotspots (5x5) ===== */
const imagenesColocadas = new Set();

/* Mismo contenedor donde ya viven tus hotspots, así comparten marco de referencia */
function contenedorImagenes() {
	for (const id of Object.keys(hotspotInfo)) {
		const ref = document.getElementById(id);
		if (ref && ref.parentElement) return ref.parentElement;
	}
	return document.querySelector('[data-screen="game"]');
}

/**
 * Coloca una imagen alineada a la grilla de hotspots.
 * celda: 'c2r3' = columna 2, fila 3 (usa las clases .hotspot-cN / .hotspot-rN)
 * opciones: ancho/alto en celdas (1 a 5), animacion, ajuste, z, clic, clases
 *
 * Ej: ColocarImagen('img_mapa', 'c2r2', { ancho: 2, alto: 2 });
 */
function ColocarImagen(id, celda, opciones = {}) {
	const { ancho = 1, alto = 1, animacion = 'fadeIn', ajuste = 'contain', z = 4, clic = false, clases = '' } = opciones;

	const m = /^c([1-5])r([1-5])$/i.exec(celda);
	if (!m) { console.warn('[ColocarImagen] celda inválida:', celda, '(usa c1r1 ... c5r5)'); return; }
	const col = +m[1], fila = +m[2];
	if (col + ancho - 1 > 5 || fila + alto - 1 > 5) {
		console.warn('[ColocarImagen] la imagen se sale de la grilla:', celda, ancho + 'x' + alto);
	}

	const contenedor = contenedorImagenes();
	if (!contenedor) { console.warn('[ColocarImagen] contenedor no encontrado'); return; }

	// Si ya hay una con ese id, se reemplaza
	contenedor.querySelectorAll(`[data-imagen-celda="${id}"]`).forEach(e => e.remove());

	// Acepta un id registrado en monogatari.assets('images') o un nombre de archivo directo
	const rutas = monogatari.setting('AssetsPath') || {};
	const base = `${rutas.root || './assets'}/${rutas.images || 'images'}/`;
	const archivo = monogatari.asset('images', id) || id;

	const img = document.createElement('img');
	img.src = base + archivo;
	img.dataset.imagenCelda = id;
	img.className = `hotspot-c${col} hotspot-r${fila} ${clases}`.trim();
	if (animacion) img.classList.add('animated', animacion);
	Object.assign(img.style, {
		position: 'absolute',
		width: (ancho * 20) + '%',
		height: (alto * 20) + '%',
		objectFit: ajuste,
		zIndex: z,
		pointerEvents: clic ? 'auto' : 'none'
	});
	img.style.setProperty('display', 'block', 'important');
	contenedor.appendChild(img);
	imagenesColocadas.add(id);
}

function QuitarImagen(id, animacion = 'fadeOut') {
	const contenedor = contenedorImagenes();
	imagenesColocadas.delete(id);
	if (!contenedor) return;
	contenedor.querySelectorAll(`[data-imagen-celda="${id}"]`).forEach(img => {
		const quitar = () => img.remove();
		if (animacion) {
			img.classList.remove('fadeIn');
			img.classList.add('animated', animacion);
			img.addEventListener('animationend', quitar, { once: true });
			setTimeout(quitar, 1200); // red de seguridad si animationend no dispara
		} else {
			quitar();
		}
	});
}

function quitarTodasLasImagenes() {
	Array.from(imagenesColocadas).forEach(id => QuitarImagen(id, ''));
}

const imagenesDeHotspot = new Map(); // id del hotspot -> id de su imagen

/**
 * Coloca una imagen exactamente sobre un hotspot (misma posición y tamaño).
 * La imagen se quita sola cuando el hotspot se oculta con hideHotspot().
 * Ej: ImagenEnHotspot('palo_antorcha');
 *     ImagenEnHotspot('palo_antorcha', { imagen: 'otra_imagen', ajuste: 'fill' });
 */
function ImagenEnHotspot(item, opciones = {}) {
	const { imagen = item, animacion = 'fadeIn', ajuste = 'contain', z = 4, escala = 1 } = opciones;

	const h = document.getElementById(item);
	if (!h || !h.parentElement) { console.warn('[ImagenEnHotspot] hotspot no encontrado:', item); return; }
	const contenedor = h.parentElement;

	// Mide el hotspot aunque esté oculto (lo muestra un instante, invisible)
	const previo = { display: h.style.display, visibility: h.style.visibility };
	h.style.visibility = 'hidden';
	h.style.display = 'block';
	const r = h.getBoundingClientRect();
	const c = contenedor.getBoundingClientRect();
	h.style.display = previo.display;
	h.style.visibility = previo.visibility;

	if (!r.width || !r.height || !c.width || !c.height) {
		console.warn('[ImagenEnHotspot] el hotspot no tiene tamaño (¿un ancestro está oculto?):', item);
		return;
	}

	contenedor.querySelectorAll(`[data-imagen-celda="${imagen}"]`).forEach(e => e.remove());

	const rutas = monogatari.setting('AssetsPath') || {};
	const base = `${rutas.root || './assets'}/${rutas.images || 'images'}/`;
	const archivo = monogatari.asset('images', imagen) || imagen;

	const img = document.createElement('img');
	img.src = archivo.includes('/') ? archivo : base + archivo;
	img.dataset.imagenCelda = imagen;
	if (animacion) img.classList.add('animated', animacion);
	// Caja de la imagen: `escala` del tamaño del hotspot, centrada en él
	const w = r.width * escala;
	const hgt = r.height * escala;
	const x = (r.left - c.left) + (r.width - w) / 2;
	const y = (r.top - c.top) + (r.height - hgt) / 2;

	Object.assign(img.style, {
		position: 'absolute',
		left: (x / c.width * 100) + '%',
		top: (y / c.height * 100) + '%',
		width: (w / c.width * 100) + '%',
		height: (hgt / c.height * 100) + '%',
		objectFit: ajuste,
		zIndex: z,
		pointerEvents: 'none'   // el clic lo sigue recibiendo el hotspot
	});

	img.style.setProperty('display', 'block', 'important');
	contenedor.appendChild(img);

	imagenesColocadas.add(imagen);
	imagenesDeHotspot.set(item, imagen);
}

function quitarImagenDeHotspot(item) {
	const imagen = imagenesDeHotspot.get(item);
	if (!imagen) return;
	imagenesDeHotspot.delete(item);
	QuitarImagen(imagen);
}

monogatari.component('inventory-button', {
    template: `<button class="inventory-btn">Inventario</button>`,
    methods: {
        click () {
            const panel = document.getElementById('inventory-panel');
            panel.classList.toggle('hidden');
            updateInventoryUI();
        }
    }
});


// Define the messages used in the game.
monogatari.action ('message').messages ({
	'Help': {
		title: 'Help',
		subtitle: 'Some useful Links',
		body: `
			<p><a href='https://developers.monogatari.io/documentation/'>Documentation</a> - Everything you need to know.</p>
			<p><a href='https://monogatari.io/demo/'>Demo</a> - A simple Demo.</p>
		`
	}
});

// Define the notifications used in the game
monogatari.action ('notification').notifications ({
	'Welcome': {
		title: 'Welcome',
		body: 'This is the Monogatari VN Engine',
		icon: ''
	}
});

// Define the Particles JS Configurations used in the game
monogatari.action ('particles').particles ({

});

// Define the canvas objects used in the game
monogatari.action ('canvas').objects ({

});

// Credits of the people involved in the creation of this awesome game
monogatari.configuration ('credits', {


});

// Define the images that will be available on your game's image gallery
monogatari.assets ('gallery', {

});

// Define the music used in the game.
monogatari.assets ('music', {

});

// Define the voice files used in the game.
monogatari.assets ('voices', {

});

// Define the sounds used in the game.
monogatari.assets ('sounds', {

    'ambience_museum': 'ambience_museum.ogg',
    'ambience_university': 'ambience_university.ogg',
    'ambience_lab': 'ambience_lab.ogg',
    'ambience_airport': 'ambience_airport.ogg',
    'wind_soft': 'wind_soft.ogg',
    'wind_strong': 'wind_strong.ogg',
    'glacier_echo': 'glacier_echo.ogg',
    'cave_echo': 'cave_echo.ogg',
    'fire_crackle': 'fire_crackle.ogg',
    'rocks_falling': 'rocks_falling.ogg',
    'low_vibration': 'low_vibration.ogg',
    // Minijuego Guardianes
    'eco': 'eco.ogg',
	'capitulo1': 'eco.ogg',
    'viento': 'viento.ogg',
    'vibracion': 'vibracion.ogg',
	// Las 7 maravillas
	'sfx_pergamino': 'sfx_pergamino.ogg',
	'sfx_viento_desierto': 'sfx_viento_desierto.ogg',
	'sfx_agua_norias': 'sfx_agua_norias.ogg',
	'sfx_templo_eco': 'sfx_templo_eco.ogg',
	'sfx_templo_viento': 'sfx_templo_viento.ogg',
	'sfx_martillo_piedra': 'sfx_martillo_piedra.ogg',
	'sfx_puerto_olas': 'sfx_puerto_olas.ogg',
	'sfx_faro_olas': 'sfx_faro_olas.ogg'
});

// Define the videos used in the game.
monogatari.assets ('videos', {

});

// Define the images used in the game.
monogatari.assets ('images', {
	'palo_antorcha': 'palo_antorcha.png',
	'overlay_vignette_sepia': 'overlay_vignette_sepia.png',
	'overlay_grano': 'overlay_grano.png',
	'overlay_letterbox': 'overlay_letterbox.png'

});

// Define the backgrounds for each scene.
monogatari.assets ('scenes', {
	'negro': 'black', 
	'museo': 'museo_dia.png',
	'quinta_normal': 'quinta_normal.png',
	'museo_historico_nacional': 'museo_historico_nacional.png',
    'museo_sala_precolombina': 'bg_museo_sala_precolombina.png',
	'museo_sala_precolombina_vitrina_abierta': 'bg_museo_sala_precolombina_vitrina_abierta.png',
	'museo_sala_precolombina_sin_piedra': 'bg_museo_sala_precolombina_sin_piedra.png',
	'usach': 'usach.png',
	'laboratorio': 'laboratorio.png',
    'bg_usach_aula_magna': 'bg_usach_aula_magna.png',
    'lab_escaneo': 'lab_escaneo.png',
	'laboratorio_escaneo': 'laboratorio_escaneo.png',
    'bg_puzzle_piedra': 'bg_puzzle_piedra.png',
    'ruta7': 'ruta7.png',
    'caverna': 'caverna.png',
	'cascada_congelada': 'cascada_congelada.png',
	'cascada_congelada_jeep': 'cascada_congelada_jeep.png',
    'bg_cueva_grabados': 'bg_cueva_grabados.png',
    'derrumbe': 'derrumbe.png',
    'camara_profunda': 'camara_profunda.png',
	'altar': 'altar.png',
	'parchment_master': 'parchment_master.png',
    'fogon': 'fogon.png',
	'mapa_estrategico': 'mapa_estrategico.png',
    'bg_decision_viaje': 'bg_decision_viaje.png',
    'embarque': 'embarque.png',
    'atenas_atardecer': 'atenas_atardecer.png',
	'biblioteca_atenas': 'biblioteca_atenas.png',
	'olimpia_ruinas': 'olimpia_ruinas.png',
	'efeso_ruinas': 'efeso_ruinas.png',
	'efeso_subterraneo': 'efeso_subterraneo.png',
	'halicarnaso_ruinas': 'halicarnaso_ruinas.png',
	'rodas_puerto': 'rodas_puerto.png',
	'alejandria_ciudad': 'alejandria_ciudad.png',
	'alejandria_archivo': 'alejandria_archivo.png',   
	'alejandria_archivo_oculto': 'alejandria_archivo_oculto.png', 
    'bg_babilonia': 'babilonia_ruins.png',
	'bg_hallazgo_babilonico': 'babilonian_hallazgo.png',
	'bg_minijuego_jardin': 'bg_minijuego_jardin.png',
	'bg_vaticano': 'vaticano_hall.png',
	'bg_plaza_vaticano': 'bg_plaza_vaticano.png',
	'bg_documentos_vaticano': 'vatican_documents.png',
	'bg_manuscrito': 'vatican_manuscript.png',
	'bg_siria_archivo': 'siria_archive.png',
	'bg_saqueo_siria': 'archive_attack.png',
	'bg_biblioteca_sidon': 'biblioteca_sidon.png',
	'bg_sidon': 'sidon_port.png',
	'bg_epigrama': 'epigrama_sidon.png',
	'bg_sinai': 'sinai_mountain.png',
	'bg_sinai_caverna': 'sinai_caverna.png',
	'bg_sinai_revelacion': 'sinai_cave_revelation.png',
	'bg_patagonia_glaciar': 'patagonia_glaciar.png',
	'camara_secreta': 'camara_secreta.png',
	'bg_camara_subterranea': 'camara_subterranea.png',
	'bg_camara_subterranea_derrumbe': 'camara_subterranea_derrumbe.png',
	'bg_historia_luz': 'bg_historia_luz.png',
	'bg_pedestal_luz': 'pedestal_luz.png',
	'bg_pedestal_rutas': 'pedestal_rutas.png',
	'bg_artefacto_luz_glow': 'artefacto_luz_glow.png',
	'bg_cueva_salida': 'cueva_salida.png',
	'bg_patagonia_amanecer': 'patagonia_amanecer.png',
	'bg_patagonia_amanecer_luz': 'patagonia_amanecer_luz.png',
	'bg_narrador_piramide_giza': 'bg_narrador_piramide_giza.png',
	'bg_narrador_jardines_babilonia': 'bg_narrador_jardines_babilonia.png',
	'bg_narrador_zeus_olimpia': 'bg_narrador_zeus_olimpia.png',
	'bg_narrador_templo_efeso': 'bg_narrador_templo_efeso.png',
	'bg_narrador_mausoleo_halicarnaso': 'bg_narrador_mausoleo_halicarnaso.png',
	'bg_narrador_coloso_rodas': 'bg_narrador_coloso_rodas.png',
	'bg_narrador_faro_alejandria': 'bg_narrador_faro_alejandria.png',
});

/* Descripciones de los hotspots */
const hotspotInfo = {

    'vitrina': 'Una vitrina de exhibición de seguridad.',
	'panuelo': 'Un pañuelo técnico para tomar objetos delicados.',
	'idolo': 'Un idolo muy antiguo de la edad precolombina.',
	'llave_antigua': 'Una llave propiedad del museo',
	'escaner': 'Terminal de procesamiento gráfico de traducción lingüística',
	'planetario': 'El planetario USACH. Un lugar de investigación astronómica y cultural.',
	'tubo': 'Tubo de terracota sellado con resina, con un papiro en su interior',
	'amuleto': 'Un amuleto pequeño con un grabado protector.',
	'collar': 'Un collar ceremonial de origen incierto',
	'cantaro': 'Restos espacidos de un cantaro común',
	'palanca': 'Una Barra de Palanca de Titanio',
	'patina': 'Una capa de óxido que cubre los relieves perimetrales.',
	'relieves_perimetrales': 'Inscripciones cubiertas con oxido y musgo que describen antiguas costumbres .',
	'inscripciones': 'Inscripciones en las bases de las columnas',
	'pincel_arqueologico': 'Un pincel profesional de cerdas suaves o brocha de arqueología',
	'canal': 'Antiguos canales de drenaje subterráneos cubierto con piedras y vegetación.',	
	'pantano': 'Un pantano que se extiende entre las ruinas, con agua estancada y vegetación densa.',	
	'bajorelieve_babilonico1': 'Un bajorelieve babilónico que representa escenas de la vida cotidiana en Babilonia.',
	'bajorelieve_babilonico2': 'Un bajorelieve babilónico que representa escenas de la vida cotidiana en Babilonia.',
	'bajorelieve_babilonico_destruido': 'Fragmento de escultura en bajo relieve destruidos, revela golpes sistemáticos orientados a borrar rostros paganos.',
	'muro1': 'Un muro de piedra que delimita la zona arqueológica.',
	'muro2': 'Un muro de piedra que delimita la zona arqueológica.',
	'simbolo_babilonico': 'Un símbolo babilónico que parece tener un significado oculto.',
	'lupa_filologo': 'Una lupa de filología que permite observar detalles finos en los textos antiguos.',
	'poesia_votiva': 'Una colección de poemas dedicados a rituales religiosos y prácticas culturales.',
	'epigramas_funerarios': 'Ofrendas a los dioses, reflexiones sobre el paso del tiempo, el dolor por la destrucción de ciudades (como su célebre elegía ante la destrucción de Corinto en el 146 a. C.).',
	'epigrama_antipatro': 'Un epigrama antiguo y misterioso que contiene un mensaje oculto sobre el destino de una expedición marítima. Esta cubierto de caliza y es difícil de leer.',
	'poesia_ecfrastica': 'Poemas dedicados a describir obras de arte, monumentos y lugares célebres (de aquí surge su famoso poema sobre las Siete Maravillas del Mundo Antiguo).',
	'reactivo_acido': 'Un líquido corrosivo que puede ser utilizado para revelar inscripciones ocultas en superficies rocosas.',
	'estante1': 'Un estante que sostiene varios objetos arqueológicos.',
	'estante2': 'Un estante que sostiene varios objetos arqueológicos.',
	'pared1': 'Una pared de la caverna de varios siglos atrás, pero no parece natural.',
	'pared2': 'Una pared de la caverna de varios siglos atrás, pero no parece natural.',
	'pared3': 'Una pared de la caverna de varios siglos atrás',
	'pared4': 'Una pared de la caverna de varios siglos atrás',
	'pared5': 'Una pared de la caverna de varios siglos atrás',
	'pared6': 'Una pared de la caverna de varios siglos atrás',
	'paleta': 'Una paleta para realizar excavaciones en sitios arqueológicos',
	'mapa1': 'Una pared que describe un mapa sudamerica y europa',
	'mapa2': 'Una pared que describe un mapa sudamerica y europa',
	'mapa3': 'Una pared que describe un mapa sudamerica y europa',
	'altar': 'Un altar de piedra circular',
	'disco': 'Un disco de aleación desconocida con símbolos mapuches y helenísticos entrelazados. Parece vibrar con energía propia.',
	'antorcha_pared1': 'una antorcha de pared encendida',
	'antorcha_pared2': 'una antorcha de pared encendida',	
	'palo_antorcha': 'Un palo de antorcha'
};
 
// Define the Characters
monogatari.characters ({
	'nvl': {
        name: 'nvl',
        nvl: true
    },
	'y': {
		name: 'Yui',
		color: '#5bcaff'
	},
	'm': {
        name: 'Mio',
        color: '#ff8fab'
    	
	},
	'e': {
        name: 'Evelyn',
        color: '#00bfff',
        directory: 'evelyn', // Subdirectory in assets/characters/
        sprites: {
            normal: 'Copilot_20260707_170124.png',
            hablar: 'Copilot_20260707_170058.png'
		},
		expressions: {
            'normal': 'Copilot_20260708_150637.png',
            'alegre': 'Copilot_20260708_150517.png',
            'triste': 'Copilot_20260708_150528.png'
        }
    },
    'gabriel': {
        name: 'Dr. Gabriel Arancibia',
        color: '#4A90E2',
        directory: 'gabriel',
        sprites: {
            normal: 'gabriel_normal.png',
            pensativo: 'gabriel_thinking.png',
            thought: 'gabriel_thinking.png',
            serious: 'gabriel_serious.png',
	        serio: 'gabriel_serious.png',
            talk: 'talk.png',
			worried: 'worried.png'
        }
    },

    'isidora': {
        name: 'Isidora Valdés',
        color: '#E67E22',
        directory: 'isidora',
        sprites: {
            normal: 'isidora_normal.png',
            surprised: 'isidora_surprised.png',
            focused: 'isidora_focused.png',
	        sorprendida: 'isidora_surprised.png',
	        analitica: 'isidora_analitica.png',
			thinking: 'isidora_analitica.png',
            thought: 'thought.png',
            talk: 'talk.png',
			scared: 'scared.png',
			shocked: 'isidora_surprised.png',
			determined: 'isidora_normal.png',
			smile: 'smile.png',
        }
    },

    'tomas': {
        name: 'Tomás Riquelme',
        color: '#2ECC71',
        directory: 'tomas',
        sprites: {
            normal: 'tomas_normal.png',
            curious: 'tomas_curious.png',
            worried: 'tomas_worried.png',
	        entusiasmado: 'tomas_entusiasmado.png',
            talk: 'talk.png',
            thought: 'thought.png',
			scared: 'scared.png',
			surprised: 'surprised.png',
			nervous: 'nervous.png'
        }
    },

    'lucia': {
        name: 'Lucía Torres',
        color: '#9B59B6',
        directory: 'lucia',
        sprites: {
            normal: 'lucia_normal.png',
            analitica: 'lucia_analyzing.png',
	        concentrada: 'lucia_concentrada.png', 
			scared: 'scared.png',
			thinking: 'thinking.png',
			calm: 'lucia_normal.png',
			smile: 'smile.png'
        }
    },

    'erik': {
        name: 'Erik Holm',
        color: '#95A5A6',
        directory: 'erik',
        sprites: {
            normal: 'erik_normal.png',
            alerta: 'erik_serious.png'
        }
    },

    'helena': {
		name: 'Helena Papadakis',
		color: '#00838f',
		directory: 'helena',
		sprites: {
			normal: 'normal.png',
			asombrada: 'asombrada.png',
            talk: 'talk.png'
		}
	},

    'omar': {
		name: 'Omar al-Hassan',
		color: '#d84315',
		directory: 'omar',
		sprites: {
			normal: 'normal.png',
			erudito: 'erudito.png'
		}
	},
    'layla': {
		name: 'Layla Nasser',
		color: '#e67e22',
		directory: 'layla',
		sprites: {
			normal: 'normal.png'
		}
	},
	'marcus': {
		name: 'Marcus Vitelli',
		color: '#c0392b',
		directory: 'marcus',
		sprites: {
			normal: 'normal.png',
			nervous: 'nervous.png',
			informal: 'informal.png'
		}
	},  
       'hemiunu': {
        name: 'Hemiunu',
        color: '#c9a24b',
        directory: 'hemiunu',
        sprites: {
            normal: 'normal.png'
        }
    },

    'amitis': {
        name: 'Amitis',
        color: '#c9a24b',
        directory: 'amitis',
        sprites: {
            normal: 'normal.png'
        }
    },

    'fidias': {
        name: 'Fidias',
        color: '#c9a24b',
        directory: 'fidias',
        sprites: {
            normal: 'normal.png'
        }
    },

    'sacerdotisa': {
        name: 'Sacerdotisa de Ártemis',
        color: '#c9a24b',
        directory: 'sacerdotisa',
        sprites: {
            normal: 'normal.png'
        }
    },

    'artemisia': {
        name: 'Artemisia II',
        color: '#c9a24b',
        directory: 'artemisia',
        sprites: {
            normal: 'normal.png'
        }
    },

    'cares': {
        name: 'Cares de Lindos',
        color: '#c9a24b',
        directory: 'cares',
        sprites: {
            normal: 'normal.png'
        }
    },

    'sostrato': {
        name: 'Sóstrato de Cnido',
        color: '#c9a24b',
        directory: 'sostrato',
        sprites: {
            normal: 'normal.png'
        }
    }
});

/* -----------------------------------------
   LIMPIEZA AL SALIR DEL JUEGO (Quit)
----------------------------------------- */
document.addEventListener('click', (event) => {
    const quitButton = event.target.closest('[data-action="quit"]');
    if (quitButton) {
        stopIconFollow(); // <- nuevo
        hideTooltip(); // <- nuevo
        selectedItem = null;
        monogatari.storage('player').inventory = [];
        monogatari.storage('player').selectedItem = null;

        updateInventoryIcons(); // vacía realmente el <ul id="inventory-icons">
        hideInventoryBar();
        hideDoorHotspot();
    }
}, true); // <- fase de captura

/* Animación: el ícono "vuela" hacia un destino (ej. un hotspot u otro objeto) */
function flyItemTo(item, targetEl, onComplete) {
    const sourceImg = document.querySelector(`#inventory-icons img[data-item="${item}"]`);

    if (!sourceImg || !targetEl) {
        if (onComplete) onComplete();
        return;
    }

    const startRect = sourceImg.getBoundingClientRect();
    const endRect = targetEl.getBoundingClientRect();

    const flying = sourceImg.cloneNode();
    flying.className = 'flying-item';
    flying.style.position = 'fixed';
    flying.style.left = `${startRect.left}px`;
    flying.style.top = `${startRect.top}px`;
    flying.style.width = `${startRect.width}px`;
    flying.style.height = `${startRect.height}px`;
    flying.style.pointerEvents = 'none';
    flying.style.zIndex = '9999';
    // Forzamos la transición acá en vez de depender de que el CSS la defina:
    // si .flying-item no trae transition (o la trae distinta), transitionend
    // nunca dispararía y onComplete (el salto de guion) jamás se ejecutaría.
    flying.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    document.body.appendChild(flying);

    // Forzamos reflow para que el navegador registre la posición inicial
    // antes de aplicar la transición al nuevo transform.
    void flying.offsetWidth;

    const deltaX = (endRect.left + endRect.width / 2) - (startRect.left + startRect.width / 2);
    const deltaY = (endRect.top + endRect.height / 2) - (startRect.top + startRect.height / 2);

    flying.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.4)`;
    flying.style.opacity = '0.2';

    let finished = false;
    const finish = () => {
        if (finished) return;
        finished = true;
        flying.remove();
        if (onComplete) onComplete();
    };

    flying.addEventListener('transitionend', finish, { once: true });
    // Red de seguridad: si por algún motivo transitionend no dispara
    // (CSS sobreescrito, transición interrumpida, etc.), igual continuamos.
    setTimeout(finish, 600);
}


/* Ícono que acompaña al cursor mientras está seleccionado */
let followingIconEl = null;

/* Limpieza robusta: borra cualquier clon suelto, pase lo que pase */
function removeFlyingIcon() {
    document.removeEventListener('mousemove', moveFollowingIcon);
    document.querySelectorAll('.flying-item').forEach(el => el.remove());
    followingIconEl = null;
}

function startIconFollow(item) {
    removeFlyingIcon();

    const sourceImg = document.querySelector(`#inventory-icons img[data-item="${item}"]`);
    if (!sourceImg) return;

    followingIconEl = sourceImg.cloneNode();
    followingIconEl.className = 'flying-item';
    document.body.appendChild(followingIconEl);

    document.addEventListener('mousemove', moveFollowingIcon);
}

function moveFollowingIcon(event) {
    if (!followingIconEl) return;
    followingIconEl.style.left = `${event.clientX - 20}px`;
    followingIconEl.style.top = `${event.clientY - 20}px`;
}

function stopIconFollow() {
    removeFlyingIcon();
}

/* Suelta el ícono con una pequeña animación de encaje en el destino */
function dropIconAt(targetEl, onComplete) {
    if (!followingIconEl) {
        if (onComplete) onComplete();
        return;
    }

    document.removeEventListener('mousemove', moveFollowingIcon);

    const el = followingIconEl;
    const endRect = targetEl.getBoundingClientRect();

    let finished = false;
    const finish = () => {
        if (finished) return;
        finished = true;
        el.remove();
        if (followingIconEl === el) followingIconEl = null;
        if (onComplete) onComplete();
    };

    el.style.transition = 'left 0.3s ease-out, top 0.3s ease-out, opacity 0.3s ease-out';
    el.style.left = `${endRect.left + endRect.width / 2 - 20}px`;
    el.style.top = `${endRect.top + endRect.height / 2 - 20}px`;
    el.style.opacity = '0.3';

    el.addEventListener('transitionend', finish, { once: true });
    setTimeout(finish, 400); // red de seguridad si transitionend no dispara
}

/* -----------------------------------------
   TOOLTIP DE HOTSPOTS
----------------------------------------- */
let tooltipEl = null;

function ensureTooltipEl() {
    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.className = 'game-tooltip';
        document.body.appendChild(tooltipEl);
    }
    return tooltipEl;
}

function showTooltip(text, x, y) {
    if (!text) return;
    const el = ensureTooltipEl();
    el.textContent = text;        // 1. primero el texto
    positionTooltip(x, y);        // 2. luego se mide y posiciona
    el.classList.add('visible');  // 3. y recién se hace visible
}

function positionTooltip(x, y) {
    if (!tooltipEl) return;

    const offset = 16;
    const rect = tooltipEl.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Horizontal: si no entra a la derecha, lo mostramos a la izquierda del cursor
    let left = x + offset;
    if (left + rect.width > vw) {
        left = x - offset - rect.width;
    }

    // Vertical: si no entra abajo, lo mostramos arriba del cursor
    let top = y + offset;
    if (top + rect.height > vh) {
        top = y - offset - rect.height;
    }

    tooltipEl.style.left = `${Math.max(4, left)}px`;
    tooltipEl.style.top = `${Math.max(4, top)}px`;
}

function hideTooltip() {
    if (tooltipEl) tooltipEl.classList.remove('visible');
}

function initHotspotTooltips() {
    Object.keys(hotspotInfo).forEach(id => {
        const hotspot = document.getElementById(id);
        if (!hotspot) return;

        hotspot.addEventListener('mouseenter', (event) => {
            showTooltip(hotspotInfo[id], event.clientX, event.clientY);
        });

        hotspot.addEventListener('mousemove', (event) => {
            positionTooltip(event.clientX, event.clientY);
        });

        hotspot.addEventListener('mouseleave', hideTooltip);
    });
}

function TomarObjeto(item) {
	if (!hasItem(item)) {
		showHotspot(item);
		const hotspot = document.getElementById(item);
		hotspot.onclick = () => {
			hotspot.style.pointerEvents = 'none';
			if (!hasItem(item)) {
				monogatari.run('narrator Tomas el objeto.');
				addItem(item);
				hideHotspot(item);
			}
		};
	}
}

function VerObjeto(item) {
	showHotspot(item);
	const hotspot = document.getElementById(item);
	hotspot.onclick = () => {
		hotspot.style.pointerEvents = 'none';
		monogatari.run('narrator No hay nada interesante aqui para tomar.');
	};
}

function UsarObjeto(item, objeto, exito, fracaso) {
	showHotspot(item);
	const hotspot = document.getElementById(item);
	hotspot.onclick = () => {
		hotspot.style.pointerEvents = 'none';
		if (selectedItem === objeto) {
			hideHotspot(item);
			stopIconFollow();
			monogatari.run(exito);
		} else {
			if (fracaso) {
				monogatari.run(fracaso);
			} else {
				monogatari.run('narrator No pasó nada. Debes utilizar un objeto.');
			}
		}
	};
}

/* Combinaciones "objeto sobre objeto" habilitadas para la escena actual */
let combosActivos = [];

/**
 * Habilita que "objeto" (ya seleccionado en el inventario) usado sobre
 * "item" (otro objeto del inventario) dispare "salto".
 * Mismo patrón que UsarObjeto(item, objeto, salto), pero para
 * objeto-sobre-objeto en vez de objeto-sobre-hotspot de escena.
 *
 * Ej: UsarObjetoSobreObjeto('simbolo_babilonico', 'lupa_filologo', 'jump Escena_TraduccionBabilonica');
 */
function UsarObjetoSobreObjeto(item, objeto, salto, nuevaDescripcion) {
    combosActivos.push({ item, objeto, salto, nuevaDescripcion });
}

/* Vacía las combinaciones activas, por ejemplo al iniciar una escena nueva */
function limpiarCombosObjeto() {
    combosActivos = [];
}

/**
 * Se llama al hacer clic sobre el ícono "destino" mientras hay un objeto
 * seleccionado (ver li.onclick en updateInventoryIcons). Busca entre las
 * combinaciones habilitadas con UsarObjetoSobreObjeto() y, si coincide,
 * hace volar el ícono origen hasta destino y ejecuta el salto.
 * Devuelve true si consumió el clic, false si no había combinación.
 */
function usarObjetoSobreObjeto(destino) {
    const combo = combosActivos.find(c => c.item === destino && c.objeto === selectedItem);
    if (!combo) return false;
 
    const origen = selectedItem;
    const targetImg = document.querySelector(`#inventory-icons img[data-item="${destino}"]`);
 
    stopIconFollow();
    flyItemTo(origen, targetImg, () => {
        selectedItem = null;
        monogatari.storage('player').selectedItem = null;
 
        if (combo.nuevaDescripcion && itemIcons[destino]) {
            itemIcons[destino].description = combo.nuevaDescripcion;
        }
 
        monogatari.run(combo.salto);
    });
 
    return true;
}

document.addEventListener('DOMContentLoaded', initHotspotTooltips);

monogatari.script({

    'Start': [
        //() => hideDoorHotspot(),
        //() => hideInventoryBar(),
        

    () => {
        // 🔥 limpiar estado antes de empezar
        monogatari.storage('player').inventory = [];
        monogatari.storage('player').selectedItem = null;
        updateInventoryIcons();
        showInventoryBar();
    },

     'jump Capitulo1'
    ],

/* =====================================================
   CAPÍTULO 1 — EL ORIGEN OCULTO (ESCENAS 1–12)
   Versión ampliada — Listo para pegar en script.js
===================================================== */

	'Capitulo1': [
		'show scene negro with fadeIn duration 1s',
		'centered <h1>Capítulo I</h1><p>El Origen Oculto</p>',
		'play music capitulo1 with loop fade 2',
		'jump Escena1_QuintaNormal'   // primera escena real del capítulo
	],

// -------------------------------------------------------------------------
	// ESCENA 1 — Museo Nacional de Historia Natural (Santiago)
	// -------------------------------------------------------------------------
	'Escena1_QuintaNormal': [
		'show scene quinta_normal with fadeIn',
		'La Quinta Normal, ubicada en Santiago, nació en el siglo XIX como un espacio dedicado a la experimentación agrícola y la educación pública. Con el tiempo se transformó en uno de los parques más emblemáticos de la ciudad, albergando instituciones culturales clave.',
		'show scene museo_historico_nacional with fadeIn',
		'Su edificio más destacado es el Museo Nacional de Historia Natural, fundado en 1830, uno de los más antiguos de América Latina. Este museo ha sido fundamental para la investigación científica y la divulgación del patrimonio natural chileno, convirtiéndose en un símbolo histórico dentro del parque y en un referente cultural para generaciones de visitantes.',
		'jump Escena1_Museo'
	],

	'Escena1_Museo': [
		'show scene museo with fadeIn',
		'show character gabriel normal at left with fadeIn',
		() => addItem('libro'),
		'gabriel El Museo Nacional de Historia Natural, en el corazón del Parque Quinta Normal, es un santuario de silencio.',
		'gabriel El eco de los pasos se mezcla con el olor a madera antigua y vitrinas pulidas.',
		'jump Escena1_Sala'
	],

	'Escena1_Sala': [
    	'show scene museo_sala_precolombina with fadeIn',
		//'show image panuelo with fadeIn item-panuelo',
		'En la sala de culturas precolombinas, la luz tenue revela piezas que han sobrevivido siglos.',
		'Pero hoy, entre cerámicas diaguitas y textiles mapuches, descansa un objeto que no debería existir.',
		'show character gabriel serious at left with fadeIn',
		'gabriel (Observando la vitrina con el ceño fruncido y cruzando los brazos) Isidora... ¿puedes venir un momento? Esto... esto no tiene sentido absoluto.',
		'show character isidora normal at right with fadeIn',
		'isidora (Se acerca caminando despacio, acomodando la correa de su bolso y ajustando su visión) ¿Una piedra mapuche? ¿Qué tiene de extraño? Se ve pulida, probablemente una piedra ceremonial de paso o algún utensilsil para ritos de siembra.',
		'gabriel Mira el grabado en el borde inferior. Esa espiral... no es mapuche. Es helenística. Es exactamente igual a la que aparece en relieves del Mausoleo de Halicarnaso. Observa el ángulo del trazo y la profundidad de la talla.',
		'show character isidora surprised at right',
		'isidora (Se queda en silencio unos segundos, apoyando las manos sobre el cristal) Gabriel... esto podría reescribir la historia de la iconografía precolombina. O... revelar un contacto cultural imposible. ¿Estás sugiriendo que marineros o eruditos griegos llegaron a estas costas dos milenios antes que los españoles?',
		'gabriel Nada es imposible. Solo no comprendido... aún.',
		'isidora Si la mesa directiva se entera de que cuestionamos el origen de esta pieza sin evidencia sólida, nos van a quitar los permisos de investigación.',
		'gabriel Por eso debemos examinarla nosotros mismos antes de que la envíen a los depósitos subterráneos.',
		'isidora De acuerdo, cuenta conmigo, conozco un guía que nos puede ayudar.',
		() => addItem('contacto_isidora'),
		() => addItem('contacto_erik'),
		// Interacción con Objeto e Inventario
		'[INTERACCIÓN DE INVENTARIO]',
		'Objeto en escena: Vitrina de exhibición de seguridad.',
		'Acción requerida: Utilizar la Llave de Acceso Académico de la USACH + Pañuelo de Microfibra.',
		'[INVENTARIO USADO]: Llave de Acceso Académico + Pañuelo de Microfibra.',

		'jump Escena1_Abrir'
	],	

	'Escena1_Abrir': [
		'show scene museo_sala_precolombina',
		//'show image panuelo with fadeIn item-panuelo',
        //() => hideHotspot('vitrina'),
        //() => stopIconFollow(),
		() => VerObjeto('idolo'),
        () => TomarObjeto('panuelo'),
		() => TomarObjeto('llave_antigua'),
		() => UsarObjeto('vitrina','llave_antigua','jump Escena1_Tomar'),
		'narrator Necesitas la piedra de Ngenechén. La vitrina está cerrada.'
	],	

	'Escena1_Tomar': [
		'show scene museo_sala_precolombina_vitrina_abierta with fadeIn',
		() => UsarObjeto('vitrina','panuelo','jump Escena1_Decidir'),
		'narrator Necesitas la piedra de Ngenechén. La vitrina está abierta.'
	],	

	'Escena1_Decidir': [
		'show scene museo_sala_precolombina_sin_piedra with fadeIn',
		() => hideAllHotspots(),
		() => addItem('piedra_ngenechen'),
        //() => updateInventoryIcons(),
        //() => stopIconFollow(),
		'narrator Toma la piedra de Ngenechén.',
		'[EFECTO]: Desarma los sellos de seguridad y permite deslizar el cristal sin activar la alarma del museo.',

		// Decisiones del jugador
		{
			'Choice': {
				'Dialog': 'gabriel ¿En qué detalle de la piedra de Ngenechén deberíamos enfocar nuestro primer análisis?',
				'Opcion_Examinar': {
					'Text': '🔎 Examinar la piedra en detalle con la lupa táctica',
					'Do': 'jump Escena1_Examinar'
				},
				'Opcion_Origen': {
					'Text': '😮 Preguntar a Isidora por el origen del hallazgo en los registros',
					'Do': 'jump Escena1_Origen'
				},
				'Opcion_Notas': {
					'Text': '📓 Tomar notas y dibujar los patrones en la libreta de cuero',
					'Do': 'jump Escena1_Notas'
				}
			}
		}
	],	

	'Escena1_Examinar': [
		'gabriel (Saca su lupa táctica de bolsillo y examina minuciosamente los microsurcos de la talla)',
		'Revela micrograbados de trazos alfabéticos ocultos bajo la pátina volcánica.',
		'show storage Dato_Microescritura true',
        () => addItem('escritura'),
		'[DATO AÑADIDO]: Microescritura Arcaica registrada en el diario.',
		'jump Escena2_Usach'
	],

	'Escena1_Origen': [
		'isidora (Consulta sus fichas catalográficas archivadas) La pieza proviene de los diarios de excavación de 1978 en la Región de Aysén.',
		'show storage Coordenadas_Aysen true',
        () => addItem('fichas_cartograficas'),
		'[INFORMACIÓN DESBLOQUEADA]: Antecedentes de excavaciones históricas y coordenadas de Aysén.',
		'jump Escena2_Usach'
	],

	'Escena1_Notas': [
		'gabriel (Dibuja meticulosamente la geometría de la espiral en su libreta de cuero)',
		'show storage Objeto_Libreta true',
        () => addItem('diagrama_espiral'),
		'[OBJETO OBTENIDO]: Libreta con Diagrama de Espiral (+Precisión en puzles posteriores).',
		'jump Escena2_Usach'
	],

	// -------------------------------------------------------------------------
	// ESCENA 2 — Aula Magna, Universidad de Santiago de Chile (USACH)
	// -------------------------------------------------------------------------
	'Escena2_Usach': [
		'show scene usach with fadeIn',
		'La USACH vibra con vida académica. En el Aula Magna, los murales históricos observan desde las paredes.',
		'Estudiantes conversan, laptops abiertas, cuadernos llenos de anotaciones.',
		'Gabriel prepara una clase que, sin saberlo, será el inicio de una aventura global.',
		'jump Escena2_AulaMagna'
	],

	'Escena2_AulaMagna': [
		// Reseteo defensivo de bajo costo: si por cualquier motivo 'block' quedó
		// pegado en true (p.ej. una excepción no atrapada en un paso de función
		// anterior), esto lo libera antes de que la escena necesite el primer
		// clic-para-avanzar. No tiene efecto si ya estaba en false.
		//() => monogatari.global('block', false),	
		//() => monogatari.proceed({ userInitiated: true, skip: false, autoPlay: false }),
		'show scene bg_usach_aula_magna with fadeIn',
		'show character gabriel normal at left with fadeIn',

		// Interacción con Objeto
		'[INTERACCIÓN DE INVENTARIO]',
		'Objeto en escena: Proyector de Diapositivas de Alta Definición.',
		'Acción requerida: Gabriel accede a su maletín y coloca la Lente de Corrección Óptica de Alta Precisión para enfocar la proyección.',
		'[INVENTARIO USADO]: Lente de Corrección Óptica.',
		'[EFECTO]: Proyecta las líneas de navegación ptolomeicas sobre el hemisferio sur, dejando atónita a la clase.',		
		
		'gabriel (Frente a la pantalla, proyectando un mapa del Mediterráneo antiguo) Antípatro de Sidón fue el primero en enumerar las Siete Maravillas del Mundo Antiguo. Pero su lista no era solo estética. Era un mapa. Un compendio de los logros más deslumbrantes de la arquitectura y la fe. Era un manifiesto cultural. Una forma de decir: "Esto es lo que define nuestra civilización".',
		'show character tomas entusiasmado at right with fadeIn',
		'tomas (Levantando la mano con ímpetu) Profesor... ¿y los libros perdidos de Diodoro Sículo? Los tomos VI al X... ¿podrían contener referencias a contactos con tierras más allá del océano, referencias a expediciones enviadas hacia el Atlántico Sur?',
		'gabriel (Sonríe con cautela, caminando lentamente por el pasillo central) Si existieran... e intactos, Tomás... podrían cambiar todo lo que sabemos del mundo antiguo. Nos obligarían a rehacer cada mapa cronológico y revisar nuestras certezas sobre la navegación precolombina. Pero oficialmente, están perdidos desde la destrucción de la Gran Biblioteca y el Faro de Alejandría. Se quemaron junto con el conocimiento acumulado de dinastías enteras.',
		'tomas ¿Y si no se quemaron del todo? ¿Y si fueron evacuados en secreto por sacerdotes y eruditos antes de que el fuego destruyera las naves del puerto?',
		'gabriel (Lo mira fijamente) Entonces tendríamos que encontrarlos. Y asumir la responsabilidad de lo que revelen.',
		'show character gabriel pensativo at left with fadeIn',
		'show character tomas normal at right with fadeIn',

		{
			'Choice': {
				'Dialog': 'gabriel ¿Cómo respondes a la perspicaz pregunta de Tomás?',
				'Opcion_Cautela': {
					'Text': '🤔 Responder con cautela académica conservadora',
					'Do': 'jump Escena2_Cautela'
				},
				'Opcion_Confesar': {
					'Text': '😌 Confesar sospechas reales sobre los libros perdidos',
					'Do': 'jump Escena2_Confesar'
				},
				'Opcion_Ignorar': {
					'Text': '😐 Ignorar la pregunta y continuar con el temario formal',
					'Do': 'jump Escena2_Ignorar'
				}
			}
		}
	],

	'Escena2_Cautela': [
		'gabriel Debemos mantener el rigor científico y no especular sin pruebas contundentes.',
		'Mantiene la tensión institucional, pero Tomás se muestra más reservado.',
		'jump Escena3_Laboratorio'
	],

	'Escena2_Confesar': [
		'gabriel Comparto tus sospechas, Tomás. Hay vacíos cronológicos que insinúan esa posibilidad.',
		'show character tomas entusiasmado at right',
		'tomas ¡Cuente con mi apoyo absoluto para investigar lo que sea necesario, profesor!',
		() => addItem('contacto_tomas'),
		'[RESULTADO]: Tomás gana confianza total en Gabriel y se ofrece como asistente personal de la travesía.',
		'jump Escena3_Laboratorio'
	],

	'Escena2_Ignorar': [
		'gabriel Esa pregunta está fuera del programa de la asignatura. Sigamos.',
		'Tomás se frustra, pero no pierde su entusiasmo.',
		'jump Escena3_Laboratorio'
	],

	// -------------------------------------------------------------------------
	// ESCENA 3 — Laboratorio Arqueológico, USACH
	// -------------------------------------------------------------------------
	'Escena3_Laboratorio': [
		'show scene laboratorio with fadeIn',
		'show character gabriel normal at left with fadeIn',
		'show character lucia normal at right with fadeIn',

		'El laboratorio es un caos organizado: lámparas articuladas, herramientas de excavación, cajas con fragmentos y pizarras llenas de notas.',
		'jump Escena3_Laboratorio_piedra', 
	],

	'Escena3_Laboratorio_piedra': [
		'show scene laboratorio with fadeIn',
		'show character gabriel pensativo at right with fadeIn',
		'show character lucia analitica at center with fadeIn',

		'La piedra descansa sobre un paño azul, iluminada por una luz blanca que revela detalles invisibles a simple vista.',

		'lucia La espiral es idéntica a la del Mausoleo. No es coincidencia. El ángulo de corte de la herramienta de sílex coincide con el tallado en mármol dórico.',

		'lucia (Observando con una lupa binocular y ajustando la intensidad de la luz) El símbolo mapuche del Ngenechén está grabado con una técnica que no corresponde al período prehispánico tardío. Es más antigua. Mucho más.',
	
		'show character tomas normal at left',
		'tomas ¿Más antigua que la cultura mapuche registrada?',
		'gabriel Más antigua que cualquier registro en Chile. Esto... es un mensaje cifrado que duró milenios.',

		'lucia Hay caracteres minúsculos pulidos en las incisiones. Usaron algún tipo de ácido orgánico o resina vegetal para sellar las grietas y evitar la erosión del agua.',

		// Interacción con Objeto
		'[INTERACCIÓN DE INVENTARIO]',
		'Objeto en escena: Piedra de Ngenechén sobre la mesa de análisis.',
		'Acción requerida: Aplicar el Reactivo de Contraste Luminol y encender la Lámpara UV Táctica.',
		'[INVENTARIO USADO]: Lámpara UV Táctica + Reactivo de Luminol.',
		'[EFECTO]: Revela en fluorescencia verdosa las letras griegas ocultas: "φῶς νότου" (Luz del Sur).',

		{
			'Choice': {
				'Dialog': 'lucia ¿Qué procedimiento técnico debemos aplicar a continuación?',
				'Opcion_Espectral': {
					'Text': 'Solicitar un análisis espectral mineral de la roca',
					'Do': 'jump Escena3_Espectral'
				},
				'Opcion_Cotejar': {
					'Text': 'Cotejar con los relieves del Mausoleo de Halicarnaso',
					'Do': 'jump Escena3_Cotejar'
				},
				'Opcion_Atenas': {
					'Text': 'Enviar muestras digitales a Helena Papadakis en Atenas',
					'Do': 'jump Escena3_Atenas'
				}
			}
		}
	],

	'Escena3_Espectral': [
		'El análisis confirma que la roca es basalto patagónico con rastros de sedimentos del Mediterráneo oriental.',
		() => addItem('analisis_sedimento'),
		'jump Escena4_LabEscaneo'
	],

	'Escena3_Cotejar': [
		'Desbloqueas en la libreta el paralelismo directo con los frisos del Mausoleo de Halicarnaso.',
		() => addItem('relieve_halicarnaso'),
		'jump Escena4_LabEscaneo'
	],

	'Escena3_Atenas': [
		'Helena Papadakis confirma la anomalía arqueológica desde Grecia y ofrece colaboración internacional.',
		'show storage Contacto_Helena true',
		() => addItem('contacto_helena'),
		'jump Escena4_LabEscaneo'	
	],

	// -------------------------------------------------------------------------
	// ESCENA 4 — Laboratorio de Análisis Digital y Escaneo 3D, USACH
	// -------------------------------------------------------------------------
	'Escena4_LabEscaneo': [
		'show scene lab_escaneo with fadeIn',
		//'show character gabriel normal at left with fadeIn',
		//'show character lucia concentrada at center with fadeIn',
		// Interacción de Inventario
		'[INTERACCIÓN DE INVENTARIO]',
		'Objeto en escena: Terminal de procesamiento gráfico.',
		'Acción requerida: Conectar el Escáner 3D Portátil e interconectar el software de traducción lingüística.',
		'[INVENTARIO USADO]: Escáner 3D Portátil + Puntero Háptico.',
		'[EFECTO]: Procesa la reconstrucción epigráfica completa y genera la traducción final del texto.',
		() => UsarObjeto('escaner','piedra_ngenechen','jump Escena4_Traduccion'),
		() => VerObjeto('planetario'),
		'narrator Necesitas traducir la piedra de Ngenechén. El escaner esta listo.'
	],

	// Diálogo de traducción, disparado solo por 'jump Escena4_Traduccion' al hacer
	// clic en el hotspot 'escaner' con la piedra seleccionada. Al ser un label normal,
	// Monogatari respeta el clic del jugador entre cada línea (a diferencia de encadenar
	// varios monogatari.run() sueltos, que se disparaban todos de corrido sin esperar).
	'Escena4_Traduccion': [
		'show scene laboratorio_escaneo with fadeIn',
		() => hideAllHotspots(),
		() => addItem('escritura_antigua'),
		'narrator Los monitores del supercomputador muestran la nube de puntos tridimensional de la piedra.',
		'narrator El láser azul recorre los surcos, digitalizando cada micra de la superficie volcánica.',
		'lucia (Ajustando sus auriculares tras el procesamiento digital de la voz) Esto... es mapudungún antiguo. Muy antiguo. La gramática es aglutinante como el mapudungún clásico, pero la estructura sintáctica... es griega arcaica.',
		'gabriel ¿Sintaxis griega en una lengua nativa americana?',
		'lucia Es una fusión lingüística perfecta. Como si alguien que pensaba en griego estructurara las palabras del dialecto patagónico para asegurar que el mensaje fuera comprendido por ambas culturas.',
		'lucia La traducción completa dice: "La luz del sur guarda el origen. Los que cruzaron el mar infinito depositaron la memoria en la piedra donde el hielo toca el fuego."',
		'gabriel El hielo toca el fuego... Patagonia. La región de los glaciares y volcanes de Aysén.',
		'jump Escena4_Decision'
	],

 
	'Escena4_Decision': [
		'show scene laboratorio_escaneo with fadeIn',
		() => {
			const choice = {
				'Choice': {
					'Dialog': 'gabriel ¿Qué debemos aplicar a continuación?'
				}
			};

			if (hasItem('contacto_tomas') && hasItem('fichas_cartograficas')) {
				choice.Choice.Opcion_Patagonia = {
					'Text': 'Tenemos el equipo de trabajo, los datos de nuestro guia Erik y del lugar de excavación. Hay que viajar a la Patagonia',
					'Do': 'jump Escena5_Patagonia'
				};
			}

			if (!hasItem('fichas_cartograficas')) {
				choice.Choice.Opcion_Museo = {
					'Text': 'Volver donde Isidora, necesitamos datos del lugar donde se encontré la piedra',
					'Do': 'jump Escena1_Decidir'
				};
			}

			if (!hasItem('contacto_tomas')) {
				choice.Choice.Opcion_Clases = {
					'Text': 'Volver con Tomas, necesitamos su apoyo para el viaje',
					'Do': 'jump Escena2_AulaMagna'
				};
			}
			monogatari.run(choice);
		}
	],

	// -------------------------------------------------------------------------
	// ESCENA 5 — Carretera Austral / Ruta 7, Magallanes (Patagonia Chile)
	// -------------------------------------------------------------------------
	'Escena5_Patagonia': [
		'show scene ruta7 with fadeIn',
	
		//'show character gabriel serio at left with fadeIn',
		//'show character erik alerta at right with fadeIn',

		'La Carretera Austral serpentina entre montañas colosales cubiertas de nieve.',
		'El glaciar Pio XI es el glaciar más grande de Sudamérica y uno de los pocos en el mundo que, de forma excepcional, sigue avanzando en lugar de retroceder debido al cambio climático',
		'El viento patagónico ruge contra el vehículo de expedición mientras la lluvia helada golpea el parabrisas.',
		'erik (Sujetando firmemente el volante del jeep modificado mientras las ruedas giran sobre el barro helado) La tormenta se está cerrando rápido, doctor. En Magallanes el clima no perdona los errores de cálculo. Si nos quedamos atrapados en esta quebrada antes del anochecer, la temperatura bajará a diez bajo cero.',
		'gabriel (Revisando los mapas topográficos sobre sus rodillas) No podemos dar la vuelta ahora, Erik. Las coordenadas nos sitúan a menos de tres kilómetros de la boca del fiordo.',
		'erik (Mirando por el retrovisor) Hay algo más que me preocupa... Un camión pesado nos ha estado siguiendo desde el cruce de Puerto Cenicero. Sin luces de identificación. En esta época del año nadie hace esta ruta por turismo.',
		'gabriel (Ajustando la correa de su mochila) Mantén la marcha. Si es necesario, cortaremos paso por el lecho seco del río.',

		// Pausa la historia y abre el minijuego de conducción a pantalla completa
		// (ver assets/games/ruta7-carretera-austral/). El jeep debe completar las
		// 5 etapas de la Carretera Austral esquivando camiones, rocas, árboles y
		// murallas; si choca demasiadas veces reintenta la misma etapa (no pierde
		// el progreso de las etapas ya superadas). El guion continúa solo en
		// cuanto el jugador termina la etapa 5 y pulsa "Continuar" en la pantalla
		// final — no se le pregunta si quiere volver a jugar. Ya cerca del final
		// de la etapa 5, Erik y Gabriel usan la Brújula de Marinos Antiguos y la
		// Libreta con Diagrama de Espiral para corregir el rumbo justo antes de
		// llegar a la cascada congelada (línea de narración ambiental integrada
		// en la propia etapa, sin interacción de inventario aparte).

		async() => { 
			if (!monogatari.storage('player').ruta7Race) { 
				monogatari.distractionFree();
				await monogatari.run('race ruta7Race');
				monogatari.distractionFree();
				monogatari.storage('player').ruta7Race = true;
			}
		}, 

		'jump Escena5_Cascada'
	],

	'Escena5_Cascada': [
		'show scene cascada_congelada_jeep with fadeIn',
		// Interacción con Objeto
		'[INTERACCIÓN DE INVENTARIO]',
		'Objeto en escena: Salpicadero del jeep y tormenta electromagnética.',
		'Acción requerida: El jugador debe sacar la Brújula de Marinos Antiguos y combinarla con la Libreta con Diagrama de Espiral para calcular la declinación magnética.',
		'[INVENTARIO USADO]: Brújula de Marinos Antiguos + Libreta con Diagrama de Espiral.',
		'[EFECTO]: Corrige el rumbo de la expedición y revela la ruta de acceso oculta tras la cascada congelada.',
		'jump Escena6_Caverna'
	],

	// -------------------------------------------------------------------------
	// ESCENA 6 — Caverna del Fiordo (Patagonia)
	// -------------------------------------------------------------------------
	'Escena6_Caverna': [
		'show scene caverna with fadeIn',
		'show character isidora sorprendida at right with fadeIn',
		'El interior de la caverna es un templo natural esculpido por el agua y el tiempo.',
		'Las linternas de alta potencia iluminan estalactitas gigantescas y paredes de basalto pulido.',
		'isidora (Alzando la antorcha halógena y rozando la piedra helada con la punta de sus dedos enguantados) Gabriel... ven a ver esto. Esto desafía todo lo que enseñamos en la universidad. ¿Cómo es posible que constructores en la Patagonia conocieran la estructura exacta del Faro de Alejandría?',
		'isidora Mira esa torre escalonada, la sección octogonal intermedia, la linterna superior y el espejo cóncavo esculpido en alto relieve...',
		'gabriel (Acercándose e inspeccionando el trazo) No lo sé con certeza aún, Isidora... pero la escala es matemáticamente idéntica a las descripciones de Estrabón y Plinio el Viejo.',
		'isidora No fueron viajeros casuales. Fueron ingenieros. Arquitectos que poseían los planos maestros de los monumentos más grandes del Mediterráneo.',
		// Interacción con Objeto
		'[INTERACCIÓN DE INVENTARIO]',
		'Objeto en escena: Grabado en relieve del Faro de Alejandría.',
		'Acción requerida: Sacar el Cincel de Polímero Liviano y el Cepillo de Cerdas Suaves para remover el musgo mineralizado.',
		'[INVENTARIO USADO]: Cepillo de Cerdas + Cincel de Polímero.',
		'[EFECTO]: Expone un mecanismo de encaje geométrico con la forma de la espiral doble.',

		'jump Escena7_Derrumbe'
	],

	// -------------------------------------------------------------------------
	// ESCENA 7 — Derrumbe en la Caverna (Secuencia de Acción)
	// -------------------------------------------------------------------------
	'Escena7_Derrumbe': [
		'show scene caverna with shake infinite',
		'¡UN ESTRUENDO RETUMBA EN LA CAVERNA! El suelo tiembla con violencia mientras bloques de basalto caen desde la bóveda.',

		'show character isidora sorprendida at right',
		'isidora ¡GABRIEL! ¡EL TECHO CEDE! ¡LA SALIDA ESTÁ QUEDANDO BLOQUEADA!',

		'gabriel (Mantiene la calma bajo la lluvia de polvo y fragmentos) ¡Tomas, Isidora, cubran los equipos! ¡Erik, busca un punto de apoyo estructural!',

		// Interacción con Objeto
		'[INTERACCIÓN DE INVENTARIO - ACCIÓN RÁPIDA]',
		'Objeto en escena: Bloque rocoso de gran tonelaje aprisionando la vía.',
		'Acción requerida: Seleccionar la Barra de Palanca de Titanio para hacer palanca sobre la grieta del bloque de contención.',
		'[INVENTARIO USADO]: Barra de Palanca de Titanio.',
		'show scene derrumbe with fadeIn',
		'[EFECTO]: Desplaza la roca colapsada a tiempo, abriendo un hueco que permite al equipo acceder a la Cámara Profunda.',

		'jump Escena8_CamaraProfunda'
	],

	// -------------------------------------------------------------------------
	// ESCENA 8 — Cámara Profunda de los Guardianes
	// -------------------------------------------------------------------------
	'Escena8_CamaraProfunda': [
		'show scene camara_profunda with fadeIn',
		'show character gabriel serio at left with fadeIn',
		'show character isidora analitica at right with fadeIn',
		'Tras atravesar el pasaje derrumbado, el grupo ingresa a una sala totalmente sellada al vacío.',
		'El aire es seco y conserva un olor a resinas aromáticas e incienso antiguo.',
		'isidora La temperatura y la humedad aquí se han mantenido constantes durante dos mil años. Este recinto fue construido deliberadamente como una cámara acorazada.',
		'gabriel Observa los frisos laterales. No solo está el Faro de Alejandría y el Mausoleo de Halicarnaso... Están representadas las Siete Maravillas del Mundo Antiguo alineadas en orden astronómico.',
		'isidora Los Jardines Colgantes, la Estatua de Zeus, el Templo de Artemisa, el Coloso de Rodas y las Pirámides de Giza... Y en el centro de todas ellas, la figura de la espiral doble uniendo los dos hemisferios.',
		'jump Escena9_Altar'
	],

	// -------------------------------------------------------------------------
	// ESCENA 9 — Altar Subterráneo y Extracción del Pergamino
	// -------------------------------------------------------------------------
	'Escena9_Altar': [
		'show scene altar with fadeIn',
		() => addItem('bisturi_termico'),
		'En el centro exacto de la estancia reposa un altar de piedra volcánica pulida.',
		'Tiene un conjunto de ranuras, no hay información para poder descifrarlo ahora',
		'Sobre él descansa un tubo de terracota helénica sellado con resina y cera de abejas.',
		'isidora (Analizando el sello con cuidado) La resina está cristalizada. Si intentamos forzar el cilindro manualmente, las vibraciones romperán el contenido interior.',
		// Interacción de Inventario
		'[INTERACCIÓN DE INVENTARIO]',
		'Objeto en escena: Tubo de Terracota Sellado con Resina.',
		'Acción requerida: Activar el Bisturí Térmico de Campo para fundir el anillo de resina cristalizada.',
		() => VerObjeto('cantaro'),
        () => TomarObjeto('collar'),
		() => TomarObjeto('amuleto'),
		() => UsarObjeto('tubo','bisturi_termico','jump Escena9_Coordenadas'),
		'narrator Necesitas el contenido del tubo. El tubo esta cerrado.'
	],

	'Escena9_Coordenadas': [		
		'show scene altar',
		() => hideAllHotspots(),
		'[INVENTARIO USADO]: Bisturí Térmico de Campo.',
		'[EFECTO]: Abre el estuche intacto, permitiendo extraer el manuscrito sin que la fibra vegetal se desintegre.',
		() => addItem('coordenadas_antiguas'),

 		'play sound wind-echo',

    	'isidora Este pergamino... son coordenadas. Tres ubicaciones marcadas con runas.',
		'isidora Si logro descifrarlas, sabré hacia dónde viajar después de esto.',

		// Pausa la historia, muestra el rompecabezas a pantalla completa.
		// El guion continúa automáticamente en cuanto se resuelven las tres coordenadas.

		async() => { 
			if (!monogatari.storage('player').cifradoTresCiudades) { 
				monogatari.distractionFree();
				await monogatari.run('puzzle cityPuzzle');
				monogatari.distractionFree();
				monogatari.storage('player').cifradoTresCiudades = true;
			}
		}, 
		
		'show character isidora analitica at right with fadeIn',
		'isidora Alejandría... Halicarnaso... Babilonia. Ya sé qué camino seguir.',
		'show character tomas entusiasmado at left with fadeIn',
		'tomas (Sosteniendo un mapa con las coordenadas descifradas) ¡Profesor! El pergamino despliega tres conjuntos de coordenadas primarias en el Mediterráneo y el Norte de África.',
		() => addItem('mapa'),
        'gabriel Alejandría, Halicarnaso y Babilonia... Los tres vértices de la red de custodia.',
		'jump Escena10_Fogon'
	],

	// -------------------------------------------------------------------------
	// ESCENA 10 — Fogón Nocturno en el Refugio Patagónico
	// -------------------------------------------------------------------------
	'Escena10_Fogon': [
		'show scene fogon with fadeIn',
		'show character gabriel pensativo at left with fadeIn',
		'show character isidora normal at right with fadeIn',
		'La fogata crepita en el refugio de montaña. Afuera, la tormenta patagónica golpea las paredes de madera.',
		'Las tazas de café caliente despiden vapor mientras las copias digitales del pergamino brillan en la pantalla de la laptop.',
		'isidora Gabriel... si publicamos esto ahora, la comunidad científica nos destruirá o nos llamará locos. Necesitamos las pruebas de los tres puntos mediterráneos indicados en las coordenadas.',
		'gabriel Entonces iremos a buscar esas pruebas, una por una.',
		// Interacción con Objeto
		'[INTERACCIÓN DE INVENTARIO]',
		'Objeto en escena: Mapa Topográfico de Expedición y Lámpara del Refugio.',
		'Acción requerida: Tomar la Pluma de Caligrafía Táctica e impregnarla en Tinta Indeleble para trazar las rutas marítimas.',
		'[INVENTARIO USADO]: Pluma de Caligrafía Táctica + Tinta Indeleble.',
		'[EFECTO]: Registra de forma definitiva los itinerarios de viaje en el mapa maestro de la expedición.',

		'jump Escena11_DecisionEstrategica'
	],

	// -------------------------------------------------------------------------
	// ESCENA 11 — Decisión Estratégica Final del Capítulo 1
	// -------------------------------------------------------------------------
	'Escena11_DecisionEstrategica': [
		'show scene mapa_estrategico with fadeIn',
		'show character gabriel serio at left with fadeIn',

		'gabriel Hemos cruzado el punto de no retorno. Lo que descubrimos en la cueva confirma que la historia oficial está incompleta. Ahora debemos decidir dónde dar el primer paso en el extranjero.',


		() => {
			const choice = {
				'Choice': {
					'Dialog': 'gabriel ¿Cuál será nuestro primer destino internacional para el Capítulo 2?'
				}
			};

			if (hasItem('contacto_helena')) {
				choice.Choice.Ruta_Grecia = {
					'Text': '🏛️ Viajar a Grecia y Turquía (Atenas y Halicarnaso - Antípatro y el Mausoleo)',
					'Do': 'jump Escena12_Grecia'
				};
			} else {
				choice.Choice.Ruta_Grecia = {
					'Text': '🏛️ Volver donde Lucia, necesitamos un contacto para Viajar a Grecia y Turquía (Atenas y Halicarnaso - Antípatro y el Mausoleo)',
					'Do': 'jump Escena3_Laboratorio_piedra'
				};				
			}

			if (hasItem('contacto_omar')) {
				choice.Choice.Ruta_Egipto = {
					'Text': '🔺 Viajar a Egipto (Alejandría - El Faro y los Manuscritos Perdidos)',
					'Do': 'jump Escena12_Egipto'
				};
			}

			if (hasItem('contacto_layla')) {
				choice.Choice.Ruta_Babilonia = {
					'Text': '🕌 Viajar a Mesopotamia (Irak / Babilonia - Jardines Colgantes y Archivos Cuneiformes)',
					'Do': 'jump Escena12_Babilonia'
				};
			}
		monogatari.run(choice);
		}
	],

	// -------------------------------------------------------------------------
	// ESCENA 12 — Preparación del Viaje Internacional y Cierre del Capítulo 1
	// -------------------------------------------------------------------------
	'Escena12_Grecia': [
		'show scene embarque with fadeIn',
		'show character tomas entusiasmado at right with fadeIn',
		'tomas Todo el equipo de escaneo térmico y las copias 3D van en el equipaje de mano, profesor. Volamos directo a Atenas.',
		'[INTERACCIÓN Y SELLADO DE SEGURIDAD FINAL]',
		'Objeto en escena: Maletín Táctico de Seguridad de Viaje.',
		'Acción requerida: Seleccionar el Candado Biométrico de Seguridad, instalarlo en el maletín y registrar la huella de Gabriel para sellar las evidencias.',
		'[INVENTARIO USADO]: Candado Biométrico de Seguridad.',
		'[EFECTO]: Sella de forma segura los hallazgos del Capítulo 1 e inicia la secuencia de embarque hacia Atenas, Grecia.',
		'FIN DEL CAPÍTULO 1 — "EL ORIGEN OCULTO"',
		'jump Capitulo2'
	],

	'Escena12_Egipto': [
		'show scene embarque with fadeIn',
		'show character tomas entusiasmado at right with fadeIn',
		'tomas Equipos listos y visados confirmados. Volamos directo a Alejandría, Egipto.',
		'jump Cierre_Capitulo1_Egipto'
	],

	'Escena12_Babilonia': [
		'show scene embarque with fadeIn',
		'show character tomas entusiasmado at right with fadeIn',
		'tomas Protocolos de seguridad activados. Volamos rumbo a los sitios arqueológicos de Mesopotamia.',
		'jump Cierre_Capitulo1_Babilonia'
	],

	'Cierre_Capitulo1_Grecia': [
		'[INTERACCIÓN Y SELLADO DE SEGURIDAD FINAL]',
		'Objeto en escena: Maletín Táctico de Seguridad de Viaje.',
		'Acción requerida: Seleccionar el Candado Biométrico de Seguridad, instalarlo en el maletín y registrar la huella de Gabriel para sellar las evidencias.',
		'[INVENTARIO USADO]: Candado Biométrico de Seguridad.',
		'[EFECTO]: Sella de forma segura los hallazgos del Capítulo 1 e inicia la secuencia de embarque hacia Atenas, Grecia.',
		'FIN DEL CAPÍTULO 1 — "EL ORIGEN OCULTO"',
		'jump Capitulo2'
	],

	'Cierre_Capitulo1_Egipto': [
		'[INTERACCIÓN Y SELLADO DE SEGURIDAD FINAL]',
		'Objeto en escena: Maletín Táctico de Seguridad de Viaje.',
		'Acción requerida: Seleccionar el Candado Biométrico de Seguridad, instalarlo en el maletín y registrar la huella de Gabriel para sellar las evidencias.',
		'[INVENTARIO USADO]: Candado Biométrico de Seguridad.',
		'[EFECTO]: Sella de forma segura los hallazgos del Capítulo 1 e inicia la secuencia de embarque hacia Alejandría, Egipto.',
		'FIN DEL CAPÍTULO 1 — "EL ORIGEN OCULTO"',
		'jump Capitulo2'
	],

	'Cierre_Capitulo1_Babilonia': [
		'[INTERACCIÓN Y SELLADO DE SEGURIDAD FINAL]',
		'Objeto en escena: Maletín Táctico de Seguridad de Viaje.',
		'Acción requerida: Seleccionar el Candado Biométrico de Seguridad, instalarlo en el maletín y registrar la huella de Gabriel para sellar las evidencias.',
		'[INVENTARIO USADO]: Candado Biométrico de Seguridad.',
		'[EFECTO]: Sella de forma segura los hallazgos del Capítulo 1 e inicia la secuencia de embarque hacia Medio Oriente.',
		'FIN DEL CAPÍTULO 1 — "EL ORIGEN OCULTO"',
		'jump Capitulo2'
	],

	'Capitulo2': [
		'stop music with fade 3',
		'show scene negro with fadeIn duration 2s',
		'centered <h1>Fin del Capítulo I</h1><p>El Origen Oculto</p>',
		'wait 1500',
		'show scene negro with fadeIn duration 1s',
		'centered <h1>Capítulo II</h1><p>El Eco del Mediterraneo</p>',
		//'play music capitulo1 with loop fade 2',
		'jump Escena13'   
	],

'Escena13': [
		'show scene atenas_atardecer with fadeIn',
		'Atenas recibe al equipo con un atardecer dorado. El Partenón se recorta contra el cielo como un recordatorio de la grandeza antigua. Las calles vibran con vida: cafés, turistas, estudiantes, arqueólogos. Pero para Gabriel, Atenas no es un destino turístico. Es el primer paso para entender por qué una piedra mapuche contiene símbolos helenísticos.',
		'show character helena normal at right with fadeIn',
		'show character gabriel serio at left with fadeIn',
		'helena (Estrecha la mano de Gabriel) Dr. Arancibia, su mensaje me dejó sin dormir. Una piedra mapuche con un símbolo exclusivo de Halicarnaso... Eso es imposible.',
		'gabriel Imposible no. Inexplicable, sí. Y por eso estamos aquí.',
		'helena Muéstreme la foto nuevamente.',
		'(Gabriel le entrega la imagen en su tablet)',

		// Interacción con Objeto: Tablet táctica de investigación
		{
			'Choice': {
				'Dialog': '[OBJETO ENCONTRADO: Tablet con Archivo Fotográfico HD]',
				'Opcion_ExaminarTablet': {
					'Text': '🔍 Ampliar el símbolo grabado en la pantalla táctil',
					'Do': 'Realizas un zoom digital de alta resolución. El trazo revela un patrón de corte microscópico hecho con cincel de bronce helenístico.'
				},
				'Opcion_EntregarTablet': {
					'Text': '📱 Mostrar directamente la imagen del relieve a Helena',
					'Do': 'Le pones la pantalla frente a sus ojos para que reconozca los trazos de Halicarnaso.'
				}
			}
		},

		'show character helena asombrada at right',
		'helena (Se queda en silencio) Este símbolo... aparece en un único relieve del Mausoleo. Y en un poema de Antípatro de Sidón que casi nadie conoce.',

		'show character tomas entusiasmado at center with fadeIn',
		'tomas ¿Un poema oculto?',
		'helena Más bien... olvidado.',
		'jump Escena14'
	],

	// -------------------------------------------------------------
	// ESCENA 14 - Biblioteca de la Universidad de Atenas (Puzzle del Epigrama)
	// -------------------------------------------------------------
	'Escena14': [
		'show scene biblioteca_atenas with fadeIn',
		'La biblioteca es un templo moderno del conocimiento. Entre estantes infinitos, Helena guía al equipo hacia una sección restringida donde se guardan copias de epigramas helenísticos.',
		'show character helena normal at right with fadeIn',
		'show character gabriel normal at left with fadeIn',
		'helena Antípatro escribió varios epigramas sobre las maravillas. Pero uno de ellos... nunca fue incluido en la lista oficial.',
		'gabriel ¿Y por qué?',
		'helena Porque menciona una “octava luz”. Algo que no encajaba en la visión clásica del mundo.',

		async() => { 
			if (!monogatari.storage('player').epigramaAntipatro) { 
				monogatari.distractionFree();
				await monogatari.run('epigrama epigramaPuzzle');
				monogatari.distractionFree();
				monogatari.storage('player').epigramaAntipatro = true;
			}
		}, 

		'show character tomas entusiasmado at center with fadeIn',
		'tomas ¿La octava luz... es Chile?',
		'helena Si la piedra que encontraron es auténtica... sí.',
		'jump Escena14_Decision'
	],

'Escena14_Decision': [
		'show scene biblioteca_atenas with fadeIn',
		{
			'Choice': {
				'Dialog': 'gabriel (Decisión del jugador)',
				'Opcion_Poema': {
					'Text': 'Preguntar directamente por el contenido y origen de los libros perdidos de Diodoro Sículo',
					'Do': 'jump Escena14_Poema'
				},

				'Opcion_Mausoleo': {
					'Text': 'Pedir detalles sobre el relieve único del Mausoleo de Halicarnaso',
					'Do': 'jump Escena14_Mausoleo'
				},
				'Opcion_Antipatro': {
					'Text': 'Inquirir sobre la relación de Antípatro de Sidón con las Siete Maravillas',
					'Do': 'jump Escena14_Antipatro'

				},
				'Opcion_Omar': {
					'Text': 'Preguntar por un contacto experto para averiguar sobre la relación de Diodoro Sículo con las Siete Maravillas',
					'Do': 'jump Escena14_Omar',
					'Condition': () => hasItem('fragmento_marfil') && hasItem('inscripcion_secreta') && hasItem('miniatura_cuadriga') && hasItem('simulacion_coloso') && hasItem('contacto_diodoro') 
				}
			}
		}
	],

	'Escena14_Poema': [
		'"La Bibliotheca historica", es un conjunto de 40 libros (sobreviven completos los libros 1-5 y 11-20), fué escrita entre el 60 y el 30 a.C.',
		() => addItem('contacto_diodoro'),
		'helena Diodoro Sículo recopiló información de fuentes más antiguas, muchas de las cuales se han perdido. Sus libros contienen referencias a las Siete Maravillas y a otras construcciones notables del mundo antiguo.',
		'helena Si quieres investigar más sobre las Siete Maravillas y su relación con la piedra mapuche, te recomiendo que busques a un experto en Diodoro Sículo. Él podría ayudarte a entender mejor el contexto histórico y cultural de los libros perdidos.',
		'jump Escena14_Decision'
	],

	'Escena14_Mausoleo': [
		'Desbloqueas en la libreta el paralelismo directo con los frisos del Mausoleo de Halicarnaso.',
		() => addItem('relieve_halicarnaso'),
		'jump Escena20'
	],

	'Escena14_Antipatro': [
		'El "Epigrama de Antípatro" es un libro que enumera las Siete Maravillas del Mundo Antiguo (Antología Palatina IX.58, c. 140 a.C.). Es una de las listas más tempranas conocidas de las Siete Maravillas.',
		'Trazar el mapa de asentamientos helenísticos vinculados con las 3 divinidades griegas, mencionadas en los libros: Zeus, Artemisa y Helios',
		() => addItem('contacto_antipatro'),

		{
			'Choice': {
				'Dialog': 'gabriel ¿A que lugrar mencionado en el Epigrama de Antípatro deberíamos dirigirnos?',
				'Opcion_Olimpia': {
					'Text': 'Proponer viaje inmediato a Olimpia para investigar el culto a Zeus',
					'Do': 'jump Escena15'
				},
				'Opcion_Traduccion': {
					'Text': 'Partir hacia Éfeso, Turquía, para seguir la pista de Artemisa',
					'Do': 'jump Escena17'
				},
				'Opcion_RutaGrecia': {
					'Text': 'Viajar hasta Rodas, buscando al Dios Sol de Helios',
					'Do': 'jump Escena22'
				}
			}
		}		
	],

	'Escena14_Omar': [
		'helena La persona que buscas es Omar Al-Khazraji, un arqueólogo iraquí que ha trabajado en excavaciones de Babilonia y Halicarnaso.',
		'helena Omar tiene acceso a archivos de Diodoro Sículo y podría ayudarte a entender la relación entre los libros perdidos y las Siete Maravillas.',
		'helena Te daré su contacto, pero ten cuidado. Omar es un hombre muy reservado y no le gusta que lo molesten con preguntas triviales.',
		() => addItem('contacto_omar'),
		'jump Escena24'
	],

	// -------------------------------------------------------------
	// ESCENA 15 - Olimpia, Grecia (Estatua de Zeus)
	// -------------------------------------------------------------
	'Escena15': [
		'show scene olimpia_ruinas with fadeIn',
		'Olimpia es un santuario de ruinas y silencio. El templo donde se alzaba la Estatua de Zeus está reducido a columnas rotas y fragmentos de mármol. Pero el aire parece aún cargado de la presencia del dios.',
		'jump Escena_Narrador_ZeusOlimpia'
	],

	'Escena_Narrador_ZeusOlimpia': [
		'show scene bg_narrador_zeus_olimpia with fadeIn',
		'show image overlay_vignette_sepia with fadeIn',
		'show image overlay_grano with fadeIn',
		'show image overlay_letterbox with fadeIn',
		//'play sound sfx_pergamino',
		//'play sound sfx_templo_eco',

		'show character fidias normal at right with fadeIn',
		'fidias Soy Fidias, escultor ateniense, el mismo que talló a Atenea Partenos para el Partenón.',
		'fidias Hacia el año 435 antes de tu era fui llamado a Olimpia para crear una imagen digna del padre de los dioses.',
		'fidias Una estatua de doce metros de altura, con el cuerpo revestido en marfil y las vestiduras en oro puro, sentada en un trono de cedro incrustado con piedras preciosas.',
		'fidias La erigimos en honor a Zeus, señor del Olimpo, para presidir su santuario y los juegos que cada cuatro años reunían a toda Grecia en su nombre.',
		'fidias Durante casi ochocientos años los peregrinos cruzaron el Egeo solo para contemplarla.',
		'fidias Se cuenta que la trasladaron a Constantinopla, y que un incendio en el año 462 de tu era finalmente la redujo a cenizas, junto con tantas otras maravillas de un mundo que ya se apagaba.',

		'hide character fidias with fadeOut',
		//'play sound sfx_pergamino',
		'hide image overlay_letterbox with fadeOut',
		'hide image overlay_grano with fadeOut',
		'hide image overlay_vignette_sepia with fadeOut',
		//'hide scene bg_narrador_zeus_olimpia with fadeOut',
		'jump Escena15_Olimpia'
	],

	'Escena15_Olimpia': [
		'show scene olimpia_ruinas with fadeIn',
		'show character gabriel pensativo at left with fadeIn',
		'gabriel La Estatua de Zeus era una obra maestra. Oro, marfil, proporciones perfectas.',

		'show character isidora normal at center with fadeIn',
		'isidora Y fue destruida... ¿por qué?',

		'show character helena normal at right with fadeIn',
		'helena Por la expansión cristiana. Las maravillas eran vistas como símbolos paganos.',

		// Interacción con Objeto: Georradar Portátil
		{
			'Choice': {
				'Dialog': '[OBJETO DISPONIBLE EN EL INVENTARIO: Georradar Escáner]',
				'Opcion_UsarRadar': {
					'Text': '📡 Desplegar el Georradar en la base del podio central',
					'Do': 'El radar emite un pitido rítmico notificando una anomalía de densidad orgánica bajo 40 cm de capa piroclástica.'
				},
				'Opcion_Pincel': {
					'Text': '🖌️ Usar el Pincel Arqueológico para limpiar la grieta oriental',
					'Do': 'Quitas el polvo secular revelando marcas de abrasión causadas por altas temperaturas.'
				}
			}
		},

		{
			'Choice': {
				'Dialog': 'gabriel (Decisión del jugador)',
				'Opcion_Examinar': {
					'Text': 'Examinar detenidamente los restos del templo de Zeus',
					'Do': 'jump Escena16'
				},
				'Opcion_Estratos': {
					'Text': 'Escanear los estratos arqueológicos inferiores con equipo portátil',
					'Do': 'jump Escena16'
				},
				'Opcion_Cimientos': {
					'Text': 'Buscar marcas de cantería ocultas en la base del pedestal',
					'Do': 'jump Escena16'
				}
			}
		}
	],

	// -------------------------------------------------------------
	// ESCENA 16 - Objeto oculto: Fragmento de marfil carbonizado
	// -------------------------------------------------------------
	'Escena16': [
		'Entre los restos del templo, el jugador encuentra un pequeño fragmento de marfil quemado.',

		// Interacción con Objeto Oculto: Fragmento de Marfil Carbonizado
		{
			'Choice': {
				'Dialog': '[OBJETO ENCONTRADO: Fragmento de marfil carbonizado]',
				'Opcion_RecogerMarfil': {
					'Text': '🖐️ Recoger la pieza usando guantes de nitrilo del kit táctico',
					'Do': 'Tomas con extremo cuidado el marfil frágil y lo colocas en una caja hermética de policarbonato.'
				},
				'Opcion_Microscopio': {
					'Text': '🔬 Aplicar la Lente Microscópica Portátil sobre la superficie',
					'Do': 'A 50x de aumento, la incisión revela finas líneas en espiral concéntrica idénticas a las del artefacto mapuche.'
				}
			}
		},
		() => addItem('fragmento_marfil'),
		'Material: marfil original de la estatua. | Estado: carbonizado por incendio. | Edad: ~2400 años. | Inscripción microscópica: símbolo idéntico al de la piedra mapuche.',
		'show character tomas entusiasmado at center with fadeIn',
		'tomas Profesor... ¡el mismo símbolo!',
		'show character gabriel serio at left with fadeIn',
		'gabriel Esto confirma que el símbolo no es mapuche. Es helenístico.',
		'show character isidora sorprendida at right with fadeIn',
		'isidora Y alguien lo llevó a Chile.',

		{
			'Choice': {
				'Dialog': 'gabriel (Decisión del jugador)',
				'Opcion_Efeso': {
					'Text': 'Partir hacia Éfeso, Turquía, para seguir la pista de Artemisa',
					'Do': 'jump Escena17'
				},
				'Opcion_LaboratorioMarfil': {
					'Text': 'Guardar la muestra de marfil para fechado por carbono 14',
					'Do': 'jump Escena14_Decision'
				},
				'Opcion_Papadakis': {
					'Text': 'Pedirle a Helena que registre el hallazgo en el archivo nacional',
					'Do': 'jump Escena14_Decision'
				}
			}
		}
	],

	// -------------------------------------------------------------
	// ESCENA 17 - Éfeso, Turquía (Templo de Artemisa)
	// -------------------------------------------------------------
	'Escena17': [
		'show scene efeso_ruinas with fadeIn',
		'El Templo de Artemisa fue una de las maravillas más grandes jamás construidas. Hoy solo quedan columnas rotas y un silencio que parece eterno.',
		'jump Escena_Narrador_TemploArtemisa'
	],

	'Escena_Narrador_TemploArtemisa': [
		'show scene bg_narrador_templo_efeso with fadeIn',
		'show image overlay_vignette_sepia with fadeIn',
		'show image overlay_grano with fadeIn',
		'show image overlay_letterbox with fadeIn',
		//'play sound sfx_pergamino',
		//'play sound sfx_templo_viento',

		'show character sacerdotisa normal at center with fadeIn',
		'sacerdotisa Soy sacerdotisa de Ártemis en Éfeso, guardiana de su templo desde que era niña.',
		'sacerdotisa El santuario que hoy admiras se terminó de reconstruir hacia el año 550 antes de tu era, financiado en parte por el rey Creso de Lidia.',
		'sacerdotisa Más de un siglo de trabajo, columnas de mármol de casi dieciocho metros de altura: la mayor construcción religiosa jamás vista en el mundo griego.',
		'sacerdotisa Se levantó en honor a Ártemis, diosa de la caza, la naturaleza y el parto, patrona de nuestra ciudad.',
		'sacerdotisa Un hombre llamado Eróstrato lo redujo a cenizas en el año 356 antes de tu era solo por buscar la fama... y aun así lo reconstruimos más grande todavía.',
		'sacerdotisa Los godos lo saquearon definitivamente en el año 268 de tu era, y con ellos se apagó el culto que sostuvimos durante siglos.',

		'hide character sacerdotisa with fadeOut',
		//'play sound sfx_pergamino',
		'hide image overlay_letterbox with fadeOut',
		'hide image overlay_grano with fadeOut',
		'hide image overlay_vignette_sepia with fadeOut',
		//'hide scene bg_narrador_templo_efeso with fadeOut',
		'jump Escena17_Efeso'
	],

	'Escena17_Efeso': [
		'show scene efeso_ruinas with fadeIn',
		'show character helena normal at right with fadeIn',
		'helena Aquí ocurrió uno de los incendios más famosos de la historia. Heróstrato lo quemó para ser recordado.',
		'show character gabriel normal at left with fadeIn',
		'gabriel Pero la destrucción final fue cristiana.',
		'show character isidora normal at center with fadeIn',
		'isidora ¿Y si el símbolo también estaba aquí?',
		// Interacción con Objeto: Lámpara UV & Espectrómetro
		{
			'Choice': {
				'Dialog': '[HERRAMIENTAS DISPONIBLES: Espectrómetro y Luz UV]',
				'Opcion_LuzUV': {
					'Text': '💡 Iluminar la base de la fuste rota con la Lámpara Ultravioleta',
					'Do': 'La luz fluorescente revela pigmentos invisibles al ojo humano formando un trazado direccional hacia el subsuelo.'
				},
				'Opcion_Espectrometro': {
					'Text': '🧪 Medir los residuos de sulfato en la piedra con el Espectrómetro',
					'Do': 'La lectura confirma rastros de aceite de mirra usado en la preservación de documentos antiguos.'
				}
			}
		},
		'jump Escena17_Decision'
	],

	'Escena17_Decision': [
		'show scene efeso_ruinas',
		() => VerObjeto('inscripciones'),
		() => VerObjeto('patina'),
		() => VerObjeto('pantano'),
        () => TomarObjeto('palanca'),
		() => TomarObjeto('pincel_arqueologico'),
		() => UsarObjeto('patina','pincel_arqueologico','Se despega el oxido y se revela un grabado en bajo relieve con la espiral doble'),
		() => UsarObjeto('canal','palanca','jump Escena18'),
		'narrator Necesitas revisar el lugar en busca de una pista.'
	],
  
/*
		{
			'Choice': {
				'Dialog': 'gabriel (Decisión del jugador)',
				'Opcion_Inscripciones': {
					'Text': 'Buscar inscripciones ocultas bajo las bases de las columnas',
					'Do': 'jump Escena17_Inscripciones'
				},
				'Opcion_CanalSubterraneo': {
					'Text': 'Inspeccionar los antiguos canales de drenaje subterráneos',
					'Do': 'jump Escena18'
				},
				'Opcion_Frizo': {
					'Text': 'Analizar la pátina de óxido en los relieves perimetrales',
					'Do': 'jump Escena17_Frizos'
				}
			}
		}
	],

	'Escena17_Inscripciones': [
		'⛏️ Usar la Barra de Palanca para hacer palanca en el bloque de mármol.',
		'No se ve nada interesante',
		'jump Escena17_Decision'
	],

	'Escena17_Frizos': [
		'Usar un pincel para revisar claramente los relieves oxidados.',
		'No se ve nada interesante',
		'jump Escena17_Decision'
	],
*/
	// -------------------------------------------------------------
	// ESCENA 18 - Minijuego Acción: Temblor en Éfeso
	// -------------------------------------------------------------
	'Escena18': [
		() => hideAllHotspots(),
		//'[MINIJEUEGO DE ACCIÓN: TEMBLOR EN ÉFESO]',
		//'Un temblor sacude las ruinas. El jugador debe esquivar columnas que caen y avanzar hacia una cámara subterránea.',
		'El jugador encuentra una rejilla y que parece conducir hacia una cámara subterránea.',
		// Interacción de Objeto de Emergencia: Barra de Palanca de Titanio
		{
			'Choice': {
				'Dialog': '[EMERGENCIA: Una columna bloquea el paso subterráneo]',
				'Opcion_UsarPalanca': {
					'Text': '⛏️ Usar la Barra de Palanca para hacer palanca en el bloque de mármol',
					'Do': 'Aplicando fuerza hidráulica con la barra, despejas una rendija de 60 cm suficiente para deslizarte al interior.'
				},
				'Opcion_LanzarCuerda': {
					'Text': '🧗 Lanzar la Cuerda Táctica de Kevlar al pilar firme para asegurar al equipo',
					'Do': 'Anclas el arnés para garantizar que Helena e Isidora puedan descender sin caer al vacío.'
				}
			}
		},

		{
			'Choice': {
				'Dialog': 'gabriel (Decisión del jugador)',
				'Opcion_Refugio': {
					'Text': 'Dirigirse hacia la entrada del pasaje subterráneo protegido',
					'Do': 'jump Escena19'
				},
				'Opcion_AsegurarMuestra': {
					'Text': 'Asegurar el equipo técnico antes de descender',
					'Do': 'jump Escena19'
				},
				'Opcion_AyudarHelena': {
					'Text': 'Ayudar a Helena a ponerse a salvo entre las estructuras',
					'Do': 'jump Escena19'
				}
			}
		}
	],
 
	// -------------------------------------------------------------
	// ESCENA 19 - Inscripción secreta en Éfeso
	// -------------------------------------------------------------
	'Escena19': [
		'show scene efeso_subterraneo with fadeIn',
		'En una cámara oculta, el jugador encuentra una inscripción: “La luz del sur preservará lo que el norte destruye.”',

		// Interacción con Objeto: Kit de Calco & Papel Carbón
		{
			'Choice': {
				'Dialog': '[OBJETO INTERACTIVO: Muro grabado en griego koiné]',
				'Opcion_PapelCalco': {
					'Text': '📝 Aplicar Papel Arqueológico de Vaciado y Grafito blando sobre el grabado',
					'Do': 'Obtienes un relieve sobre papel perfecto que reproduce la caligrafía exacta del lapidario antiguo.'
				},
				'Opcion_CamaraMacro': {
					'Text': '📸 Tomar captura con la Cámara Fotográfica Macro y Flash Rasante',
					'Do': 'La iluminación lateral resalta micro-fisuras ocultas a simple vista.'
				}
			}
		},
		()=> addItem('inscripcion_secreta'),
	
		'show character gabriel serio at left with fadeIn',
		'gabriel La misma frase... La misma idea.',

		'show character helena asombrada at right with fadeIn',
		'helena Esto no es coincidencia. Es un mensaje.',

		{
			'Choice': {
				'Dialog': 'gabriel (Decisión del jugador)',
				'Opcion_Halicarnaso': {
					'Text': 'Poner rumbo directo al Coloso de Rodas',
					'Do': 'jump Escena22'
				},
				'Opcion_CalcoInscripcion': {
					'Text': 'Tomar un calco en papel de la inscripción secreta',
					'Do': 'jump Escena14_Decision'
				},
				'Opcion_RutaSismica': {
					'Text': 'Revisar otros pasajes en las ruinas',
					'Do': 'jump Escena14_Decision'
				}
			}
		}
	],

	// -------------------------------------------------------------
	// ESCENA 20 - Halicarnaso, Turquía (Mausoleo)
	// -------------------------------------------------------------
	'Escena20': [
		'show scene halicarnaso_ruinas with fadeIn',
		'El Mausoleo de Halicarnaso fue una mezcla de culturas: griega, egipcia, persa. Hoy solo quedan fragmentos dispersos.',
		'jump Escena_Narrador_MausoleoHalicarnaso'
	],

	'Escena_Narrador_MausoleoHalicarnaso': [
		'show scene bg_narrador_mausoleo_halicarnaso with fadeIn',
		'show image overlay_vignette_sepia with fadeIn',
		'show image overlay_grano with fadeIn',
		'show image overlay_letterbox with fadeIn',
		//'play sound sfx_pergamino',
		//'play sound sfx_martillo_piedra',

		'show character artemisia normal at center with fadeIn',
		'artemisia Soy Artemisia, reina de Caria, hermana y esposa de Mausolo, sátrapa de estas tierras bajo el dominio persa.',
		'artemisia Cuando mi esposo murió en el año 353 antes de tu era, juré construirle una tumba que ningún rey hubiera conocido jamás.',
		'artemisia Un monumento de mármol blanco de más de cuarenta metros de altura, con una base rodeada de columnas jónicas, coronado por una pirámide escalonada y una cuadriga conducida por su imagen y la mía.',
		'artemisia Lo levantamos en honor a Mausolo, mi amado esposo y hermano, en la ciudad de Halicarnaso.',
		'artemisia De su nombre nació la palabra que desde entonces ustedes usan para nombrar cualquier gran tumba: mausoleo.',
		'artemisia Sobrevivió intacto más de mil quinientos años, hasta que una serie de terremotos entre los siglos doce y quince de tu era lo derrumbó piedra a piedra.',

		'hide character artemisia with fadeOut',
		//'play sound sfx_pergamino',
		'hide image overlay_letterbox with fadeOut',
		'hide image overlay_grano with fadeOut',
		'hide image overlay_vignette_sepia with fadeOut',
		//'hide scene bg_narrador_mausoleo_halicarnaso with fadeOut',
		'jump Escena20_Halicarnaso'
	],

	'Escena20_Halicarnaso': [
		'show scene halicarnaso_ruinas with fadeIn',
		'show character gabriel pensativo at left with fadeIn',
		'gabriel La espiral de la piedra proviene de aquí. Es un símbolo de transición entre mundos.',
		'show character isidora normal at right with fadeIn',
		'isidora Como la piedra misma.',

		// Interacción con Objeto: Brújula Geodésica & Nivel Láser
		{
			'Choice': {
				'Dialog': '[INSTRUMENTO EN USO: Nivel Láser de Alta Precisión]',
				'Opcion_AlinearLaser': {
					'Text': '📐 Alinear el pulso láser con las esquinas del basamento superviviente',
					'Do': 'El rayo verde proyecta una línea de fuga que converge exactamente en un hueco disimulado entre las piedras de cimentación.'
				},
				'Opcion_Brujula': {
					'Text': '🧭 Calibrar la Brújula de Levantamiento con el Norte Magnético antiguo',
					'Do': 'Determinas que el monumento tenía una orientación desviada 12° hacia el Pacífico Sur.'
				}
			}
		},

		{
			'Choice': {
				'Dialog': 'gabriel (Decisión del jugador)',
				'Opcion_RegistrarPiedra': {
					'Text': 'Explorar los cimientos en busca de vestigios escultóricos',
					'Do': 'jump Escena21'
				},
				'Opcion_CamaraMausolo': {
					'Text': 'Examinar la cámara sepulcral atribuida a Mausolo',
					'Do': 'jump Escena21'
				},
				'Opcion_CotejoFriso': {
					'Text': 'Cotejar las réplicas del friso con los datos de la piedra mapuche',
					'Do': 'jump Escena21'
				}
			}
		}
	],

	// -------------------------------------------------------------
	// ESCENA 21 - Objeto oculto: Miniatura de la cuadriga
	// -------------------------------------------------------------
	'Escena21': [
		'El jugador encuentra una miniatura de la cuadriga que coronaba el Mausoleo.',

		// Interacción con Objeto Oculto: Miniatura de la Cuadriga de Bronce
		() => addItem('miniatura_cuadriga'),
		{
			'Choice': {
				'Dialog': '[OBJETO ENCONTRADO: Miniatura de la Cuadriga en Bronce]',
				'Opcion_LimpiarBronce': {
					'Text': '🧽 Limpiar la pátina verde usando solvente suave de laboratorio',
					'Do': 'Al remover la corrosión superficial, aparece una pequeña hendidura en la base del carro.'
				},
				'Opcion_EncajarPiedra': {
					'Text': '🧩 Comparar la base de la miniatura con el calco de la piedra mapuche',
					'Do': '¡Encajan perfectamente! La miniatura funcionaba como una llave geométrica de acuñación.'
				}
			}
		},

		'Material: bronce. | Inscripción: símbolo helenístico + marca mapuche. | Estado: sorprendentemente intacto.',

		'show character tomas entusiasmado at center with fadeIn',
		'tomas ¿Cómo llegó esto aquí?',

		'show character gabriel serio at left with fadeIn',
		'gabriel No llegó aquí. Fue traído desde aquí... hacia Chile.',

		{
			'Choice': {
				'Dialog': 'gabriel (Decisión del jugador)',
				'Opcion_NavegarRodas': {
					'Text': 'Embarcar hacia la Isla de Rodas para investigar el Coloso',
					'Do': 'jump Escena22'
				},
				'Opcion_AnalizarMetal': {
					'Text': 'Revisar la composición de bronce con el espectrómetro',
					 'Do': 'jump Escena14_Decision'
				},
				'Opcion_RelacionEgipto': {
					'Text': 'Buscar inscripciones jeroglíficas secundarias en la figura',
					'Do': 'jump Escena14_Decision'
				}
			}
		}
	],

	// -------------------------------------------------------------
	// ESCENA 22 - Rodas, Grecia (Coloso)
	// -------------------------------------------------------------
	'Escena22': [
		'show scene rodas_puerto with fadeIn',
		'El puerto de Rodas es tranquilo. El Coloso ya no existe, pero su sombra parece seguir presente.',
		'jump Escena_Narrador_ColosoRodas'
	],

	'Escena_Narrador_ColosoRodas': [
		'show scene bg_narrador_coloso_rodas with fadeIn',
		'show image overlay_vignette_sepia with fadeIn',
		'show image overlay_grano with fadeIn',
		'show image overlay_letterbox with fadeIn',
		//'play sound sfx_pergamino',
		//'play sound sfx_puerto_olas',

		'show character cares normal at right with fadeIn',
		'cares Soy Cares de Lindos, discípulo del gran Lisipo, y fui yo quien fundió en bronce al dios Helios para coronar el puerto de Rodas.',
		'cares La obra comenzó en el año 292 antes de tu era, financiada con el botín y el armamento que abandonó el ejército de Demetrio Poliorcetes tras su fallido asedio a nuestra isla.',
		'cares Tardamos doce años en completarla: más de treinta metros de altura, placas de bronce sobre un armazón de hierro y piedra.',
		'cares La erigimos en honor a Helios, dios del sol, protector de Rodas, para agradecerle habernos librado del asedio.',
		'cares Apenas cincuenta y seis años después de terminada, un terremoto en el año 226 antes de tu era le quebró las rodillas y la derribó.',
		'cares Allí quedaron sus restos de bronce durante ochocientos años más, hasta que fueron vendidos como chatarra.',

		'hide character cares with fadeOut',
		//'play sound sfx_pergamino',
		'hide image overlay_letterbox with fadeOut',
		'hide image overlay_grano with fadeOut',
		'hide image overlay_vignette_sepia with fadeOut',
		//'hide scene bg_narrador_coloso_rodas with fadeOut',
		'jump Escena22_Rodas'
	],

	'Escena22_Rodas': [
		'show scene rodas_puerto with fadeIn',
		'show character gabriel pensativo at left with fadeIn',
		'gabriel Dicen que cayó por un terremoto. Pero... ¿y si no fue natural?',
		'show character helena normal at right with fadeIn',
		'helena La destrucción de símbolos paganos fue sistemática.',
		// Interacción con Objeto: Dron Subacuático de Exploración
		{
			'Choice': {
				'Dialog': '[EQUIPO EN USO: Dron Sumergible con Sonar]',
				'Opcion_DesplegarDron': {
					'Text': '🛥️ Lanzar el Dron al canal de entrada del puerto',
					'Do': 'La cámara subacuática transmite imágenes de bloques de bronce masivos cubiertos de algas y moluscos.'
				},
				'Opcion_ConsultarMapa': {
					'Text': '🗺️ Desplegar la Carta Náutica Histórica de Piri Reis',
					'Do': 'Identificas las coordenadas donde reposaban los anclajes de plomo del Coloso.'
				}
			}
		},
		'jump Escena22_Decision'
	],

	'Escena22_Decision': [
		{
			'Choice': {
				'Dialog': 'gabriel (Decisión del jugador)',
				'Opcion_DigitalRodas': {
					'Text': 'Iniciar la reconstrucción digital de la estructura del Coloso',
					'Do': 'jump Escena23'
				},
				'Opcion_BuceoPuerto': {
					'Text': 'Consultar mapas antiguos del fondo marino del puerto',
					'Do': 'jump Escena22_BuceoPuerto'
				},
				'Opcion_RegistrosForos': {
					'Text': 'Revisar crónicas locales sobre la venta del bronce colosal',
					'Do': 'jump Escena22_RegistrosForos'
				}
			}
		}
	],

	'Escena22_BuceoPuerto': [
		'⛏️ Consultar mapas antiguos del fondo marino del puerto.',
		'No se ve nada interesante, habría que bucear para descubrirlo.',
		'jump Escena22_Decision'
	],

	'Escena22_RegistrosForos': [
		'Revisar crónicas locales sobre la venta del bronce colosal, habría que buscar en el puerto antiguo.',
		'No se ve nada interesante',
		'jump Escena22_Decision'
	],	

	// -------------------------------------------------------------
	// ESCENA 23 - Minijuego Puzzle: Reconstrucción del Coloso
	// -------------------------------------------------------------
	'Escena23': [
		'show scene rodas_puerto',
		'[MINIJUGO PUZZLE: RECONSTRUCCIÓN DEL COLOSO]',
		'Debemos encontrar las piezas correctas y ensamblarlas en el orden adecuado para reconstruir digitalmente la estatua.',
 
		async() => { 
			if (!monogatari.storage('player').colosoRodas) { 
				monogatari.distractionFree();
				await monogatari.run('coloso colosoPuzzle');
				monogatari.distractionFree();
				monogatari.storage('player').colosoRodas = true;
			}
		}, 
		// Interacción con Objeto: Consola Gráfica CAD & Estilete Óptico
		'Con los hallazgos del puerto de Rodas autenticados, comienza la reconstrucción digital pieza por pieza.',
		{
			'Choice': {
				'Dialog': '[PUZZLE DIGITAL: Renderizado de la estatua]',
				'Opcion_AlinearRayos': {
					'Text': '✨ Rotar los 7 rayos de la corona solar usando el estilete digital',
					'Do': 'Al alinear el séptimo rayo en 33° Sur, la reconstrucción proyecta un haz luminoso virtual directamente hacia Alejandría.'
				},
				'Opcion_ValidarEstructura': {
					'Text': '💻 Ejecutar la simulación de equilibrio estático',
					'Do': 'El programa confirma que el diseño original estaba equilibrado para resistir maremotos moderados.'
				}
			}
		}, 
		
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

	// -------------------------------------------------------------
	// ESCENA 24 - Alejandría, Egipto (Faro de Alejandría)
	// -------------------------------------------------------------
	'Escena24': [
		'show scene alejandria_ciudad with fadeIn',
		'Alejandría es una mezcla de modernidad y ruinas antiguas. El Faro ya no existe, pero sus cimientos permanecen bajo el agua.',
		'jump Escena_Narrador_FaroAlejandria'
	],
		
	'Escena_Narrador_FaroAlejandria': [
		'show scene bg_narrador_faro_alejandria with fadeIn',
		'show image overlay_vignette_sepia with fadeIn',
		'show image overlay_grano with fadeIn',
		'show image overlay_letterbox with fadeIn',
		//'play sound sfx_pergamino',
		//'play sound sfx_faro_olas',

		'show character sostrato normal at right with fadeIn',
		'sostrato Soy Sóstrato de Cnido, arquitecto al servicio de los reyes Ptolomeos de Egipto.',
		'sostrato En la isla de Faros, frente al puerto de Alejandría, comencé la obra bajo el mandato de Ptolomeo I y la concluí bajo su hijo Ptolomeo II, hacia el año 280 antes de tu era.',
		'sostrato Una torre de piedra caliza y granito de más de cien metros de altura, la construcción más alta hecha por manos humanas durante casi cuatro mil años.',
		'sostrato Un fuego ardía en su cúspide, y espejos de bronce reflejaban su luz a muchas millas de distancia para guiar a los navegantes.',
		'sostrato La dedicamos, según reza su inscripción, "a los dioses salvadores, en beneficio de los navegantes", en honor a Ptolomeo I Sóter y su dinastía.',
		'sostrato Una serie de terremotos entre los años 956 y 1323 de tu era la fueron debilitando hasta derrumbarla por completo, y sus piedras terminaron reutilizadas en la fortaleza que hoy ocupa su lugar.',

		'hide character sostrato with fadeOut',
		//'play sound sfx_pergamino',
		'hide image overlay_letterbox with fadeOut',
		'hide image overlay_grano with fadeOut',
		'hide image overlay_vignette_sepia with fadeOut',
		//'hide scene bg_narrador_faro_alejandria with fadeOut',
		'jump Escena24_Alejandria'
	],

	'Escena24_Alejandria': [
		'show scene alejandria_ciudad with fadeIn',
		'Omar al-Hassan, egiptólogo, guardián de archivos del Faro.',
		'show character omar normal at right with fadeIn',
		'omar Bienvenidos a Alejandría. Lo primero que deben saber es que el Faro fue más que un faro. Era un centro de conocimiento y comercio.',
		'show character gabriel normal at left with fadeIn',
		'gabriel ¿Cómo es posible que un faro tuviera archivos?',
		'omar Los antiguos griegos y egipcios almacenaban documentos en lugares estratégicos. El Faro era uno de ellos.',
		'omar Algunos de estos documentos mencionan contactos culturales desconocidos entre el Mediterráneo y el Pacífico Sur.',
		'omar Lo primero es que conozcan los archivos. Pero antes, deben demostrar que son dignos de acceder a ellos.',
		'gabriel ¿Dignos? ¿Cómo?',
		'omar Deben resolver un enigma que ha permanecido sin respuesta durante siglos. Solo aquellos que comprendan la conexión entre las maravillas y los símbolos podrán acceder a los secretos del Faro.',
		'jump Escena24_Archivo'
	],

	'Escena24_Archivo': [
		'show scene alejandria_archivo with fadeIn',
		'show character omar erudito at right',
		'omar Bienvenido a la nueva Biblioteca de Alejandría. Aquí se guardan los secretos que el mundo ha olvidado.',
		'omar Los archivos del Faro contienen secretos que pocos conocen.',
		'show gabriel sorprendido at left with fadeIn',
		'grabriel ¿Secretos? ¿Qué tipo de secretos?',
		'omar Documentos que mencionan contactos culturales desconocidos entre el Mediterráneo y el Pacífico Sur. Algunos de estos documentos fueron escritos por Diodoro Sículo.',
		'gabriel Diodoro Sículo... ¿el historiador griego del siglo I a.C.?',
		'omar Exactamente. Sus libros perdidos VI-X describen viajes y contactos que desafían la historia convencional.',
		'omar Tengo algo que deben ver.',

		// Interacción con Objeto: Amuleto de Cobre & Llave Cuneiforme
		
		{
			'Choice': {
				'Dialog': '[INTERACCIÓN: Omar sostiene una llave antigua en su mano]',
				'Opcion_ExaminarLlave': {
					'Text': '🔑 Inspeccionar la Llave de Cobre del Archivo Bóveda',
					'Do': 'La llave tiene tres muescas en forma de delta, idénticas a las marcas del Faro de Alejandría.'
				},
				'Opcion_AceptarInvitacion': {
					'Text': '🤝 Estrechar la mano de Omar y avanzar hacia el pasadizo subterráneo',
					'Do': 'Omar activa un contrapeso de piedra que abre la puerta blindada del depósito histórico.'
				}
			}
		},
		'jump Escena24_Decision'
	],

	'Escena24_Decision': [
		{
			'Choice': {
				'Dialog': 'gabriel (Decisión del jugador)',
				'Opcion_SeguirOmar': {
					'Text': 'Aceptar la invitación de Omar e ir a los archivos protegidos',
					'Do': 'jump Escena25'
				},
				'Opcion_CimientosFaro': {
					'Text': 'Preguntar por el estado de los bloques sumergidos del Faro',
					'Do': 'jump Escena24_Faro'
				},
				'Opcion_BibliotecaPerdida': {
					'Text': 'Inquirir sobre los catálogos sobrevivientes de la Gran Biblioteca',
					'Do': 'jump Escena24_Biblioteca'
				}
			}
		}
	],

	'Escena24_Faro': [
		'omar La desaparición del Faro de Alejandría es un misterio. Los bloques de basalto y granito fueron arrastrados por el mar, pero algunos permanecen bajo el agua.',
		'jump Escena24_Decision'
	],

	'Escena24_Biblioteca': [
		'omar Los catálogos de la Gran Biblioteca contienen registros de obras perdidas, incluyendo textos sobre filosofía y astronomía.',
		'jump Escena24_Decision'
	],

	// -------------------------------------------------------------
	// ESCENA 25 - Narración histórica: Diodoro Sículo
	// -------------------------------------------------------------
	'Escena25': [
		'show scene alejandria_archivo_oculto with fadeIn',
		'Omar revela pergaminos que mencionan los libros perdidos VI-X de Diodoro Sículo. Estos libros describían contactos culturales desconocidos.',

		// Interacción con Objeto: Pincel de Conservación & Luz Fría
		{
			'Choice': {
				'Dialog': '[OBJETO EN MANO: Pergamino de Papiro del siglo I a.C.]',
				'Opcion_DesplegarPapiro': {
					'Text': '📜 Desplegar suavemente el papiro utilizando rodillos de teflón',
					'Do': 'El documento se desenrolla revelando un mapa que delinea las corrientes del Océano Pacífico.'
				},
				'Opcion_AnalizarTinta': {
					'Text': '🔦 Aplicar luz LED de espectro estrecho para resaltar notas al margen',
					'Do': 'Descubres anotaciones manuscritas escritas en dialecto jónico marginal.'
				}
			}
		},

		{
			'Choice': {
				'Dialog': 'gabriel (Decisión del jugador)',
				'Opcion_ExaminarPergamino': {
					'Text': 'Examinar el pergamino del Faro para buscar rutas geográficas',
					'Do': 'jump Escena26'
				},
				'Opcion_TraducirDiodoro': {
					'Text': 'Traducir las anotaciones marginales en griego tardío',
					'Do': 'jump Escena26'
				},
				'Opcion_VerificarSello': {
					'Text': 'Inspeccionar el sello de cera de la Biblioteca Alejandrina',
					'Do': 'jump Escena26'
				}
			}
		}
	],

	// -------------------------------------------------------------
	// ESCENA 26 - Objeto oculto: Pergamino del Faro
	// -------------------------------------------------------------
	'Escena26': [
		'show scene alejandria_archivo_oculto with fadeIn',
		'El pergamino menciona: “Un viaje hacia las montañas del fin del mundo.”',
		()=> addItem('pergamino_faro'),
		// Interacción con Objeto Oculto: Pergamino del Faro & Cilindro Hermético
		{
			'Choice': {
				'Dialog': '[OBJETO OPORTUNO: Cilindro Hermético de Transporte táctico]',
				'Opcion_GuardarPergamino': {
					'Text': '🧪 Introducir el papiro en el Cilindro de Nitrógeno Inerte',
					'Do': 'El cilindro sella al vacío al instante, protegiendo el frágil documento contra la humedad ambiente.'
				},
				'Opcion_GPSCoordenadas': {
					'Text': '🗺️ Ingresar las marcas geográficas del pergamino al GPS',
					'Do': 'Las coordenadas calculadas apuntan fijamente a la latitud 45° S: la Patagonia Chilena.'
				}
			}
		},

		'show character gabriel serio at left with fadeIn',
		'gabriel Es Chile. Es la Patagonia.',
		'show character omar erudito at right with fadeIn',
		'omar Exactamente. Y debemos proteger estos pergaminos.',
		'omar He notado que nos siguen. Debemos actuar con cautela.',
		'show character isidora sorprendida at center with fadeIn',
		'isidora ¿Nos siguen? ¿Quién podría estar detrás de esto?',
		'show character gabriel pensativo at left with fadeIn',
		'gabriel ¿Qué hacemos primero?',
		'omar Debemos decidir cómo proceder. Cada acción tiene sus riesgos y beneficios.',
		'isidora Debemos ser estratégicos. No podemos permitirnos perder esta información invaluable.',

		{
			'Choice': {
				'Dialog': 'gabriel (Decisión del jugador)',
				'Opcion_ProtegerDoc': {
					'Text': 'Digitalizar y asegurar los pergaminos antes de moverlos',
					'Do': 'jump Escena27'
				},
				'Opcion_MonitorearClima': {
					'Text': 'Comprobar el barómetro debido al cambio repentino de presión',
					'Do': 'jump Escena27'
				},
				'Opcion_CotejarCoordenadas': {
					'Text': 'Verificar las coordenadas con las marcas del capítulo 1',
					'Do': 'jump Escena27'
				}
			}
		}
	],

	// -------------------------------------------------------------
	// ESCENA 27 - Minijuego Acción: Atentado en el Archivo
	// -------------------------------------------------------------
	'Escena27': [
		'show scene alejandria_archivo_oculto with fadeIn',
		'[MINIJEUEGO ACCIÓN: ATENTADO EN EL ARCHIVO]',
		'Enemigos atentan contra el archivo intentando inundarlo. El jugador debe proteger los pergaminos y escapar.',
/*
    () => monogatari.distractionFree(),   // oculta text-box y quick-menu — SIEMPRE antes del verbo
    'atentado archivoOculto',             // abre <archivo-oculto id="archivoOculto"> y espera a que termine
    () => monogatari.distractionFree(),   // vuelve a mostrar la interfaz
*/

		async() => { 
			if (!monogatari.storage('player').archivoOculto) { 
				monogatari.distractionFree();
				await monogatari.run('atentado archivoOculto');
				monogatari.distractionFree();
				monogatari.storage('player').archivoOculto = true;
			}
		}, 
	
	'jump Escena28'

		/*
		// Interacción de Objeto en Acción: Bomba de Achique & Estanque Impermeable
		{
			'Choice': {
				'Dialog': '[CRISIS: El agua irrumpe en el subterráneo]',
				'Opcion_CerrarEstanque': {
					'Text': '💼 Cerrar el Maletín Estanque IP67 con los discos duros y el cilindro',
					'Do': 'El maletín de resina queda sellado a prueba de agua y flotabilidad.'
				},
				'Opcion_ForzarEscotilla': {
					'Text': '🔧 Usar la Llave de Grifo para forzar la compuerta de drenaje superior',
					'Do': 'La compuerta cede dejando escapar el torrente de agua hacia la red del puerto.'
				}
			}
		},

		{
			'Choice': {
				'Dialog': 'gabriel (Decisión del jugador)',
				'Opcion_EstanqueCilindro': {
					'Text': 'Meter los manuscritos en el cilindro hermético de transporte',
					'Do': 'jump Escena28'
				},
				'Opcion_SalidaEmergencia': {
					'Text': 'Forzar la escotilla de ventilación superior para evitar la inundación',
					'Do': 'jump Escena28'
				},
				'Opcion_ApoyarOmar': {
					'Text': 'Ayudar a Omar a asegurar los tomos históricos del archivo',
					'Do': 'jump Escena28'
				}
			}
		}
			*/
	],

	// -------------------------------------------------------------
	// ESCENA 28 - Revelación final del capítulo
	// -------------------------------------------------------------
	'Escena28': [
		'show scene alejandria_ciudad with fadeIn',
		'show character gabriel serio at left with fadeIn',
		'gabriel La octava luz... La que guía a las siete...',

		'show character isidora sorprendida at center with fadeIn',
		'isidora Está en Chile.',

		'show character tomas entusiasmado at right with fadeIn',
		'tomas Y nosotros debemos encontrarla.',

		// Interacción Final con Objetos de Inventario
		{
			'Choice': {
				'Dialog': '[COMPLETADO: Sincronización final de hallazgos del Capítulo 2]',
				'Opcion_SincronizarArtefactos': {
					'Text': '📂 Unir los datos del Marfil de Zeus, la Cuadriga de Halicarnaso y el Papiro del Faro',
					'Do': 'La tablet genera el vector navegable definitivo apuntando directo a los canales patagónicos.'
				}
			}
		},

		'El eco del Mediterráneo ha hablado. Y su voz apunta hacia el sur del mundo.',
		'CAPÍTULO 2 COMPLETO - FINALIZADO',

		'jump Capitulo3'
	],

	'Capitulo3': [
		'stop music with fade 3',
		'show scene negro with fadeIn duration 2s',
		'centered <h1>Fin del Capítulo II</h1><p>El Eco del Mediterraneo</p>',
		'wait 1500',
		'show scene negro with fadeIn duration 1s',
		'centered <h1>Capítulo III</h1><p>Sombras del Imperio</p>',
		//'play music capitulo1 with loop fade 2',
		'jump Escena29_Babilonia'   
	],

// -------------------------------------------------------------
	// ESCENA 29: Babilonia, Irak (Jardines Colgantes)
	// -------------------------------------------------------------
	'Escena29_Babilonia': [
		'show scene bg_babilonia with fadeIn',
		'El calor del desierto envuelve a Babilonia como un velo antiguo.',
		'El Éufrates serpentea silencioso, cargando siglos de historia.',
		'Las ruinas se extienden como cicatrices de un imperio que ya no existe.',
		'Aquí, donde los Jardines Colgantes pudieron haber florecido, el equipo busca respuestas.',
		'jump Escena_Narrador_JardinesColgantes'
	],

	'Escena_Narrador_JardinesColgantes': [
		'show scene bg_narrador_jardines_babilonia with fadeIn',
		'show image overlay_vignette_sepia with fadeIn',
		'show image overlay_grano with fadeIn',
		'show image overlay_letterbox with fadeIn',
		//'play sound sfx_pergamino',
		//'play sound sfx_agua_norias',

		'show character amitis normal at center with fadeIn',
		'amitis Me llaman Amitis, princesa de Media y esposa del rey Nabucodonosor II de Babilonia.',
		'amitis Cuentan los viajeros que yo añoraba las montañas verdes de mi tierra natal, perdida entre estas llanuras interminables.',
		'amitis Hacia el año 600 antes de tu era, mi esposo ordenó construir terrazas escalonadas cubiertas de árboles, flores y enredaderas junto al palacio real, regadas por norias que elevaban el agua del Éufrates.',
		'amitis Estos jardines se erigieron en mi honor, para que nunca sintiera nostalgia de mis montañas natales.',
		'amitis Ningún historiador de tu tiempo coincide del todo en dónde estuvieron exactamente, ni en si existieron tal como los describen los griegos que nunca los vieron.',
		'amitis Se cree que un terremoto los derribó hacia el siglo I antes de tu era, tras siglos de esplendor junto al gran río.',

		'hide character amitis with fadeOut',
		//'play sound sfx_pergamino',
		'hide image overlay_letterbox with fadeOut',
		'hide image overlay_grano with fadeOut',
		'hide image overlay_vignette_sepia with fadeOut',
		//'hide scene bg_narrador_jardines_babilonia with fadeOut',
		'jump Escena29_Babilonia_Bienvenida'
	],		

	'Escena29_Babilonia_Bienvenida': [
		'show scene bg_babilonia with fadeIn',
		'show character layla normal at center with fadeIn',
		'layla Bienvenidos a Babilonia. Aquí, cada piedra tiene una historia... y cada silencio, un secreto.',

		'show character gabriel normal at left with fadeIn',
		'gabriel Buscamos símbolos helenísticos. Algo que conecte este lugar con la «octava luz».',
		'jump Escena30_PuzzleJardin'
	],

	// -------------------------------------------------------------
	// ESCENA 30: Minijuego Puzzle - Reconstrucción del Jardín
	// -------------------------------------------------------------
	'Escena30_PuzzleJardin': [
		'gabriel Si las crónicas no mienten, aquí es donde deberían estar los restos de los Jardines Colgantes.',
		'isidora Todo esto está enterrado bajo siglos de arena... esto va a tomar tiempo.',
		'gabriel Empecemos por esta zona. Yo te ayudo a buscar.',
		async() => { 
			if (!monogatari.storage('player').jardinesColgantes) { 
				monogatari.distractionFree();
				await monogatari.run('jardin jardinPuzzle');
				monogatari.distractionFree();
				monogatari.storage('player').jardinesColgantes = true;
			}
		}, 		

		'tomas No puedo creer que lo hayamos logrado. Están completos otra vez, aunque sea en una pantalla.',
		()=> addItem('jardines_reconstruidos'),

		'El jugador reconstruye digitalmente los Jardines Colgantes.',

		'[ACCIÓN DE INVENTARIO] Operas la Tablet de Escaneo y Modelado Arquitectónico 3D para alinear los bloques virtuales.',
		'[EFECTO]: Encaja la terraza hidráulica con los frisos fragmentados.',
		'Al completarlo, aparece el símbolo helenístico.',

		'show character gabriel talk at left with fadeIn',
		'gabriel El símbolo está en todas partes. Es un mapa. Un mapa hacia la octava luz.',

		{
			'Choice': {
				'Dialog': '¿Qué hacer tras completar la reconstrucción digital del patrón?',
				'Opcion_Overlay': {
					'Text': 'Superponer el mapa helenístico reconstruido sobre un plano cartográfico satelital moderno.',
					'Do': 'jump Escena30_Overlay'
				},
				'Opcion_Frecuencia': {
					'Text': 'Aislar la frecuencia geométrica del símbolo helenístico para buscar patrones idénticos.',
					'Do': 'jump Escena30_Frecuencia'
				},
				'Opcion_Imprimir': {
					'Text': 'Imprimir una réplica táctil del friso reconstruido con la impresora portátil 3D.',
					'Do': 'jump Escena30_Imprimir'
				}
			}
		}
	],

	'Escena30_Overlay': [
		'Las líneas transversales cruzan directamente sobre puntos estratégicos del Mediterráneo y el Vaticano.',
		'show storage decision_31 1',
		'jump Escena30_Vaticano'
	],

	'Escena30_Frecuencia': [
		'El algoritmo detecta coincidencias directas en la arquitectura sacra del siglo IV en Roma.',
		'show storage decision_31 2',
		'jump Escena30_Vaticano'
	],

	'Escena30_Imprimir': [
		'Obtienes un bajorrelieve físico que servirá como llave comparativa en el Vaticano.',
		'show storage decision_31 3',
		'jump Escena30_Vaticano'
	],

'Escena30_Vaticano': [
		'gabriel Esto es increíble. La octava luz está vinculada a la arquitectura cristiana primitiva.',
		'gabriel Debemos ir al Vaticano y verificar los registros de intervención en sitios helenísticos.',
		'gabriel Si los Jardines Colgantes fueron destruidos por motivos religiosos, los archivos del Vaticano deberían tener evidencia.',
		'layla Estoy de acuerdo. Los registros de la Iglesia podrían revelar la verdad detrás de la desaparición de los Jardines.',
		'layla Pero debemos ser cautelosos. No todos los documentos están disponibles para el público.',
		'layla Necesitamos un contacto dentro del Vaticano que nos permita acceder a los archivos históricos.',
		'gabriel ¿Conoces a alguien que pueda ayudarnos?',
		'layla Sí, un amigo mío trabaja en la Biblioteca Vaticana. Podría facilitarnos el acceso a los registros.',
		'gabriel Perfecto. Entonces debemos planear nuestro viaje al Vaticano y coordinar con tu contacto.',
		() => addItem('contacto_marcus'),
		'layla Pero antes de ir al Vaticano, entonces deben ver esto.',
		'show scene bg_hallazgo_babilonico with fadeIn',
		'Layla guía al equipo hacia una estructura derruida.',
		'layla Los Jardines no desaparecieron por el tiempo. Hay registros de una intervención humana... cristiana.',

		'show character isidora sorprendida at right with fadeIn',
		'isidora ¿Cristiana? ¿Aquí?',
		'layla Sí. Los primeros cristianos destruyeron símbolos que consideraban idolátricos.',
		'jump Escena31_Ruinas'
	],
 

	// -------------------------------------------------------------
	// ESCENA 31: Objeto oculto - Sello babilónico con cruz cristiana
	// -------------------------------------------------------------

	'Escena31_Ruinas': [
		'show scene bg_hallazgo_babilonico with fadeIn',
		'El jugador decide examinar los restos del palacio. Esto activa un hallazgo crucial.',
		() => VerObjeto('bajorelieve_babilonico1'),
		() => VerObjeto('bajorelieve_babilonico2'),
		() => VerObjeto('bajorelieve_babilonico_destruido'),
		() => TomarObjeto('pincel_arqueologico'),
		() => TomarObjeto('lupa_filologo'),
		() => UsarObjeto('muro1','pincel_arqueologico','Analizas los surcos en la piedra: la técnica revela golpes sistemáticos orientados a borrar rostros paganos.'),
		() => UsarObjeto('muro2','pincel_arqueologico','Analizas los surcos en la piedra: la técnica revela golpes sistemáticos orientados a borrar rostros paganos.'),
		() => UsarObjetoSobreObjeto('simbolo_babilonico','lupa_filologo','jump Escena31_ObjetoOcultoBabilonia','Símbolo babilónico de fertilidad, una cruz cristiana primitiva, Inscripción en griego arcaico: φῶς νότου («luz del sur»)'),
		() => TomarObjeto('simbolo_babilonico'),
		'narrator Necesitas revisar el lugar en busca de alguna pista. Después debes analizar la pista'
	],



	'Escena31_ObjetoOcultoBabilonia': [
		() => hideAllHotspots(),
		'show scene bg_hallazgo_babilonico with fadeIn',

		'Entre los restos del palacio, el jugador encuentra un sello de arcilla:',
		'[ACCIÓN DE INVENTARIO] Aplicas la Lupa de luz UV de 365nm sobre la superficie de arcilla.',
		'[EFECTO]: Revela trazos de pigmento vegetal oculto que confirman la datación del grabado de la cruz en el siglo IV d.C.',


		'• Símbolo babilónico de fertilidad',
		'• Superpuesto: una cruz cristiana primitiva',
		'• Inscripción en griego arcaico: φῶς νότου («luz del sur»)',

		'show character tomas talk at right with fadeIn',
		'tomas Profesor... ¡la misma frase que en la piedra mapuche!',

		'show character gabriel thought at left with fadeIn',
		'gabriel Esto confirma que los cristianos primitivos estuvieron aquí. Y que dejaron mensajes vinculados a la octava luz.',

		'show character layla normal at center with fadeIn',
		'layla Mensajes que apuntan al sur del mundo.',

		'TRANSICIÓN HACIA EL VATICANO: El equipo concluye: «Si los cristianos destruyeron las maravillas y dejaron símbolos, debemos ir al lugar donde se originó esa decisión.»',
		'Ese lugar es el Vaticano, centro histórico del cristianismo.',

		{
			'Choice': {
				'Dialog': '¿Cómo procedes tras descubrir el sello babilónico?',
				'Opcion_Guardar': {
					'Text': 'Guardar y catalogar el sello en el contenedor hermético reforzado para preservarlo de la intemperie.',
					'Do': 'jump Escena31_Guardar'
				},
				'Opcion_Digitalizar': {
					'Text': 'Fotografiar y digitalizar la inscripción griega en 3D para enviarla al archivo de la USACH.',
					'Do': 'jump Escena31_Digitalizar'
				},
				'Opcion_Debatir': {
					'Text': 'Debatir de inmediato la conexión entre los viajes paleocristianos y la Patagonia con Tomás y Gabriel.',
					'Do': 'jump Escena31_Debatir'
				}
			}
		}
	],

	'Escena31_Guardar': [
		'Sellas la muestra con nitrógeno gaseoso para evitar el deterioro de la arcilla.',
		'gabriel La preservación es clave. Este hallazgo podría cambiar nuestra comprensión de la historia.',
		'gabriel Debemos asegurarnos de que llegue a los laboratorios de la USACH para su análisis.',
		'show storage decision_31 1',
		'jump Escena31_Vaticano'
	],

	'Escena31_Digitalizar': [
		'El escáner 3D genera una nube de puntos precisa de la incripción φῶς νότου.',
		'gabriel La digitalización permite preservar la información para futuros estudios.',
		'gabriel Esta información será invaluable para los investigadores de la USACH.',
		'show storage decision_31 2',
		'jump Escena31_Vaticano'
	],

	'Escena31_Debatir': [
		'gabriel El vínculo se vuelve irrefutable; la doctrina se expandió llevando la reference del extremo sur.',
		'gabriel Debemos analizar estos hallazgos en el contexto de la expansión del cristianismo primitivo.',
		'show storage decision_31 3',
		'jump Escena31_Vaticano'
	],

	'Escena31_Vaticano': [		
		'[ACCIÓN DE INVENTARIO] Usas la Criba Arqueológica de Pincel Fino para remover el polvo de arcilla y los escombros de la mampostería.',

		{
			'Choice': {
				'Dialog': '¿Cómo procede el jugador ante la sugerencia de la destrucción cristiana primitiva?',
				'Opcion_Relieves': {
					'Text': 'Examinar detenidamente los bajorrelieves del muro destruido en busca de marcas de cincel ideológicas.',
					'Do': 'jump Escena31_Relieves'
				},
				'Opcion_Interrogar': {
					'Text': 'Interrogar a Layla Nasser sobre los catálogos y registros locales de intervención paleocristiana.',
					'Do': 'jump Escena31_Interrogar'
				},
				'Opcion_Georradar': {
					'Text': 'Escanear la densidad de los cimientos con el sensor georradar de mano.',
					'Do': 'jump Escena31_Georradar'
				}
			}
		}
	],

	'Escena31_Relieves': [
		'Analizas los surcos en la piedra: la técnica revela golpes sistemáticos orientados a borrar rostros paganos.',
		'gabriel Estos bajorrelieves podrían contener pistas sobre la destrucción de símbolos religiosos.',
		'gabriel debemos partir al Vaticano para verificar los registros de intervención en sitios helenísticos.',
		'show storage decision_31 1',
		'jump Escena32_Vaticano'
	],

	'Escena31_Interrogar': [
		'layla Los registros sugieren obispos del siglo IV actuando por decreto en zonas helenizadas.',
		'gabriel debemos partir al Vaticano para verificar los registros de intervención en sitios helenísticos.',
		'show storage decision_31 2',
		'jump Escena32_Vaticano'
	],

	'Escena31_Georradar': [
		'El georradar detecta una oquedad oculta tras un bloque fracturado por impacto manual.',
		'gabriel Debemos analizar esta hallazgo en el contexto de la expansión del cristianismo primitivo.',
		'gabriel debemos partir al Vaticano para verificar los registros de intervención en sitios helenísticos.',
		'show storage decision_31 3',
		'jump Escena32_Vaticano'
	],


	// -------------------------------------------------------------
	// ESCENA 32: Ciudad del Vaticano, Italia
	// -------------------------------------------------------------
	'Escena32_Vaticano': [
		'show scene bg_plaza_vaticano with fadeIn',
		'show character gabriel talk at left with fadeIn',
		'gabriel La Ciudad del Vaticano es un enclave de poder y misterio. Cada piedra parece susurrar secretos de siglos pasados.',
		'show character isidora talk at right with fadeIn',
		'isidora Debemos ser cautelosos. No todos los documentos están disponibles para el público.',
		'show character tomas talk at center with fadeIn',
		'tomas debemos ubicar al contacto de layla dentro del Vaticano que nos permita acceder a los archivos históricos.',

		'show scene bg_vaticano with fadeIn',
		'El Vaticano es un laberinto de mármol, silencio y secretos.',
		'Los pasillos parecen observar a quienes los recorren.',
		'Aquí, la historia fue escrita... y también borrada.',

		async() => { 
			if (!monogatari.storage('player').laberintoVaticano) { 
				monogatari.distractionFree();
				await monogatari.run('laberinto vaticanoMaze');
				monogatari.distractionFree();
				monogatari.storage('player').laberintoVaticano = true;
			}
		}, 

		'show scene bg_documentos_vaticano with fadeIn',
		'show character marcus normal at center with fadeIn',
		'marcus Han venido buscando respuestas... pero algunas verdades deben permanecer ocultas.',

		'show character gabriel talk at left with fadeIn',
		'gabriel La historia no es propiedad de nadie.',

		'marcus La historia es peligrosa cuando se revela sin control.',

		'show character isidora talk at right with fadeIn',
		'isidora ¿La Iglesia destruyó las maravillas?',

		'marcus La Iglesia protegió al mundo de la idolatría.',

		'El jugador decide presionar a Marcus por documentos antiguos.',
		'[ACCIÓN DE INVENTARIO] Usas la Linterna Forense de Luz Incidente sobre los anaqueles del archivo.',
		'[EFECTO]: Revela un compartimento secreto tras el lomo de un códice de decretos papales.',

		{
			'Choice': {
				'Dialog': '¿De qué forma presionas a Marcus Vitelli para obtener los archivos restringidos?',
				'Opcion_Etica': {
					'Text': 'Apelar a su ética de historiador mostrando el sello babilónico original de la escena anterior.',
					'Do': 'jump Escena32_Etica'
				},
				'Opcion_Decretos': {
					'Text': 'Citar los decretos de Teodosio sobre la erradicación del paganismo para acorralarlo conceptualmente.',
					'Do': 'jump Escena32_Decretos'
				},
				'Opcion_Diplomacia': {
					'Text': 'Usar el permiso oficial diplomático de la USACH y la acreditación académica internacional.',
					'Do': 'jump Escena32_Diplomacia'
				}
			}
		}
	],

	'Escena32_Etica': [
		'marcus (Sorprendido) El sello de la luz del sur... Pensé que todos habían sido destruidos.',
		'show storage decision_32 1',
		'jump Escena33_BibliotecaVaticana'
	],

	'Escena32_Decretos': [
		'marcus Conocen bien la patrística... Muy bien, verán los registros de la ejecución de esos decretos.',
		'show storage decision_32 2',
		'jump Escena33_BibliotecaVaticana'
	],

	'Escena32_Diplomacia': [
		'marcus Sus credenciales son válidas, aunque la verdad que solicitan pesa más que cualquier título.',
		'show storage decision_32 3',
		'jump Escena33_BibliotecaVaticana'
	],

// -------------------------------------------------------------
// ESCENA 33: Documentos del siglo IV — Archivo Secreto Vaticano
// (reemplaza la narración plana original por el minijuego)
// -------------------------------------------------------------
'Escena33_BibliotecaVaticana': [
	'show scene bg_manuscrito with fadeIn',

	'show character marcus normal at center with fadeIn',
	'marcus Está bien. Les abriré los anaqueles que nadie fuera de Roma ha visto. Pero lo que lean aquí no sale de estos muros.',

	'show character gabriel talk at left with fadeIn',
	'gabriel Cada maravilla tiene su historia, Marcus. Déjenos encontrarlas.',

		async() => { 
			if (!monogatari.storage('player').bibliotecaVaticana) { 
				monogatari.distractionFree();
				await monogatari.run('biblioteca bibliotecaVaticana');
				monogatari.distractionFree();
				monogatari.storage('player').bibliotecaVaticana = true;
			}
		}, 

	'show character marcus normal at center with fadeIn',
	'marcus Ahora ya lo saben. Seis maravillas, seis silencios distintos: obispos, incendios, saqueos, invasores, terremotos.',

	'show character isidora talk at right with fadeIn',
	'isidora ¿Y la séptima? La Gran Pirámide sigue en pie.',

	'marcus Por eso mismo. Lo que resiste incomoda más que lo que desaparece.',



	'jump Escena33_DocumentosVaticano'
],

	// -------------------------------------------------------------
	// ESCENA 33: Documentos del siglo IV
	// -------------------------------------------------------------
	'Escena33_DocumentosVaticano': [
		'show scene bg_manuscrito with fadeIn',
		'Marcus revela documentos que explican:',
		'• La Estatua de Zeus fue destruida por obispos locales.',
		'• El Templo de Artemisa fue quemado por cristianos.',
		'• El Coloso fue desmantelado y vendido como metal.',
		'• El Mausoleo fue saqueado por cruzados.',
		'• Los Jardines fueron arrasados por invasores cristianos.',
		'• El Faro fue abandonado tras la islamización y destruido por terremotos.',
		'Pero un documento menciona algo más:',
		'«Una luz en el sur preservará lo que el norte destruye.»',

		'[ACCIÓN DE INVENTARIO] Utilizas la Cámara Fotográfica Multiespectral para capturar el pergamino raspado.',
		'[EFECTO]: Desvela el texto palimpsesto subyacente escrito en latín eclesiástico.',

		'TRANSICIÓN HACIA SIRIA',
		'marcus Algunos textos fueron enviados a Siria para ser copiados y preservados. Si buscan fragmentos de los libros perdidos... deben ir allí.',
		'El equipo concluye: «Siria contiene fragmentos que explican el viaje hacia la octava luz.»',

		{
			'Choice': {
				'Dialog': '¿Qué acción tomar ante la revelación de la destrucción sistemática?',
				'Opcion_CopiaDigital': {
					'Text': 'Copia de seguridad digital cifrada de las páginas del catálogo eclesiástico de destrucción.',
					'Do': 'jump Escena33_CopiaDigital'
				},
				'Opcion_Cuestionar': {
					'Text': 'Cuestionar a Marcus sobre las razones para resguardar la octava luz mientras se destruía el resto.',
					'Do': 'jump Escena33_Cuestionar'
				},
				'Opcion_ExigirLista': {
					'Text': 'Exigir la lista exacta de los manuscritos despachados a los archivos de Siria.',
					'Do': 'jump Escena33_ExigirLista'
				}
			}
		}
	],

	'Escena33_CopiaDigital': [
		'Almacenas los datos en el servidor seguro cifrado de la expedición.',
		'show storage decision_33 1',
		'jump Escena34_ObjetoOcultoVaticano'
	],

	'Escena33_Cuestionar': [
		'marcus Porque la octava luz no era un ídolo, sino un repositorio primigenio de fe y ciencia.',
		'show storage decision_33 2',
		'jump Escena34_ObjetoOcultoVaticano'
	],

	'Escena33_ExigirLista': [
		'marcus Los envíos fueron dirigidos al Archivo de Diodoro Sículo en territorio sirio.',
		'show storage decision_33 3',
		'jump Escena34_ObjetoOcultoVaticano'
	],

	// -------------------------------------------------------------
	// ESCENA 34: Objeto oculto - Manuscrito del siglo IV
	// -------------------------------------------------------------
	'Escena34_ObjetoOcultoVaticano': [

		'show character gabriel talk at left with fadeIn',
		'gabriel Pero hay algo más en estos documentos. Un texto distinto a los demás...',
		'marcus Eso... no debería estar ahí.',
		'show scene bg_manuscrito with fadeIn',
		'El manuscrito menciona:',
		'• «Las montañas del fin del mundo»',
		'• «Guardianes del sur»',
		'• «La octava luz»',

		'[ACCIÓN DE INVENTARIO] Te colocas los Guantes Químicamente Neutros de Nitrilo para desplegar el documento sin degradarlo.',
		'[EFECTO]: Permite la apertura del folio pergaminado de casi dos milenios sin causar daño destructivo.',
		() => addItem('manuscrito_vaticano'),
		'show character gabriel talk at left with fadeIn',
		'gabriel Es Chile. Es la Patagonia.',

		'show character marcus nervous at center with fadeIn',
		'marcus No deberían haber encontrado eso.',

		{
			'Choice': {
				'Dialog': '¿Cómo reaccionar ante la confirmación explícita de la Patagonia en el manuscrito del Vaticano?',
				'Opcion_Confrontar': {
					'Text': 'Confrontar a Marcus acusando a la institución de haber ocultado el vínculo chileno por siglos.',
					'Do': 'jump Escena34_Confrontar'
				},
				'Opcion_Tinta': {
					'Text': 'Analizar el tipo de tinta y pigmento del manuscrito para comprobar si proviene del sur.',
					'Do': 'jump Escena34_Tinta'
				},
				'Opcion_Partida': {
					'Text': 'Preparar inmediatamente la partida hacia Siria antes de que revoquen el acceso.',
					'Do': 'jump Escena34_Partida'
				}
			}
		}
	],

	'Escena34_Confrontar': [
		'marcus No fue ocultamiento por malicia, sino un pacto para evitar que la luz fuera profanada.',
		'show storage decision_34 1',
		'jump Escena35_SiriaArchivo'
	],

	'Escena34_Tinta': [
		'El análisis arrojó trazas minerales de hematita idénticas a las cuevas patagónicas.',
		'show storage decision_34 2',
		'jump Escena35_SiriaArchivo'
	],

	'Escena34_Partida': [
		'Recoges tus instrumentos y te organizas con el equipo para dejar Roma inmediatamente.',
		'show storage decision_34 3',
		'jump Escena35_SiriaArchivo'
	],

	// -------------------------------------------------------------
	// ESCENA 35: Siria (Archivo de Diodoro)
	// -------------------------------------------------------------
	'Escena35_SiriaArchivo': [
		'show scene bg_siria_archivo with fadeIn',
		'En Siria, entre ruinas y edificios modernos, se encuentra un archivo que guarda fragmentos de textos antiguos.',
		'Layla Nasser se une nuevamente al equipo.',

		'show character layla normal at center with fadeIn',
		'layla Aquí guardamos fragmentos de Diodoro Sículo. Algunos... nunca fueron catalogados.',
		'layla Uno de estos, representa un grabado de la gran piramide Giza',
		() => addItem('grabado_piramide_giza'),	
		'jump Escena_Narrador_Piramide'
	],

'Escena_Narrador_Piramide': [
    'show scene bg_narrador_piramide_giza with fadeIn',
    'show image overlay_vignette_sepia with fadeIn',
    'show image overlay_grano with fadeIn',
    'show image overlay_letterbox with fadeIn',
    //'play sound sfx_pergamino',
    //'play sound sfx_viento_desierto',

    'show character hemiunu normal at center with fadeIn',
    'hemiunu Yo soy Hemiunu, visir y arquitecto real de Su Majestad Keops, cuarto faraón de la cuarta dinastía.',
    'hemiunu Bajo mis órdenes se alzaron los bloques de piedra caliza que hoy contemplas en Guiza.',
    'hemiunu La obra comenzó hacia el año 2560 antes de tu era, y en apenas veinte años movimos más de dos millones de bloques, traídos de canteras cercanas y de Asuán, río abajo.',
    'hemiunu Construimos esta tumba en honor al propio faraón Keops, para asegurar su ascenso eterno junto a Ra, dios del sol.',
    'hemiunu A diferencia de sus hermanas de Babilonia, Rodas o Éfeso, esta maravilla nunca conoció la destrucción.',
    'hemiunu Ha resistido más de cuatro mil quinientos años de arena, de guerra y de olvido, y sigue en pie hasta el día en que tú caminas sobre ella.',

    'hide character hemiunu with fadeOut',
    //'play sound sfx_pergamino',
    'hide image overlay_letterbox with fadeOut',
    'hide image overlay_grano with fadeOut',
    'hide image overlay_vignette_sepia with fadeOut',
    //'hide scene bg_narrador_piramide_giza with fadeOut',
    'jump Escena35_Archivos'
],

	'Escena35_Archivos': [
		'show scene bg_siria_archivo with fadeIn',
		'show character gabriel talk at left with fadeIn',
		'gabriel ¿Tienes los libros perdidos de Diodoro Sículo?',
		'show character layla normal at center with fadeIn',
		'layla Fragmentos. Pero suficientes para entender su contenido.',

		() => addItem('fragmento_diodoro'),

		'[ACCIÓN DE INVENTARIO] Utilizas el Escáner Óptico de Micro-Papiro para leer los papiros carbonizados.',
		'[EFECTO]: Recoge las capas de tinta de carbón recuperando la caligrafía sepultada.',

		'TRANSICIÓN HACIA SIDÓN: Uno de los fragmentos menciona: «Antípatro escribió sobre la luz que guía a las siete.»',
		'El equipo concluye: «Si Antípatro escribió sobre la octava luz, debemos ir a su ciudad natal.»',

		{
			'Choice': {
				'Dialog': '¿Qué estrategia adoptar al revisar los fragmentos del Archivo de Diodoro?',
				'Opcion_Antipatro': {
					'Text': 'Priorizar la lectura de los papiros referentes a los viajes de Antípatro de Sidón.',
					'Do': 'jump Escena35_Antipatro'
				},
				'Opcion_Catalogo': {
					'Text': 'Organizar un catálogo de emergencia de los fragmentos no registrados junto a Layla.',
					'Do': 'jump Escena35_Catalogo'
				},
				'Opcion_Rutas': {
					'Text': 'Investigar las rutas marítimas fenicias que conectaban Sidón con las corrientes del Atlántico.',
					'Do': 'jump Escena35_Rutas'
				}
			}
		}
	],

	'Escena35_Antipatro': [
		'Descubres referencias a los viajes secretos del poeta más allá del mar conocido.',
		'show storage decision_35 1',
		'jump Escena36_SaqueoSiria'
	],

	'Escena35_Catalogo': [
		'layla Gracias por la ayuda, archivaremos esto en servidores seguros fuera del país.',
		'show storage decision_35 2',
		'jump Escena36_SaqueoSiria'
	],

	'Escena35_Rutas': [
		'Los textos confirman naves preparadas para travesías oceánicas de larga duración.',
		'show storage decision_35 3',
		'jump Escena36_SaqueoSiria'
	],

	// -------------------------------------------------------------
	// ESCENA 36: Minijuego Acción - Saqueadores en Siria
	// -------------------------------------------------------------
	'Escena36_SaqueoSiria': [
		'show scene bg_saqueo_siria with fadeIn',
		'¡Saqueadores atacan el archivo! El jugador debe proteger los fragmentos y escapar.',

		'[ACCIÓN DE INVENTARIO] Accionas un Extintor de Polvo Químico de la pared para sofocar un incendio provocado y crear una cortina de humo.',
		'[EFECTO]: Ciega temporalmente a los atacantes y apaga el fuego cerca de los códices.',

		async() => { 
			if (!monogatari.storage('player').archivoEscape) { 
				monogatari.distractionFree();
				await monogatari.run('saqueo archivoEscape');
				monogatari.distractionFree();
				monogatari.storage('player').archivoEscape = true;
			}
		}, 

		'TRANSICIÓN REFORZADA: El ataque confirma que alguien más busca los fragmentos, la información es peligrosa y el equipo debe avanzar rápido hacia Sidón.',

		{
			'Choice': {
				'Dialog': '¿Cómo reaccionar durante la huida del archivo atacado?',
				'Opcion_ProtegerMaletin': {
					'Text': 'Asegurar el maletín ignífugo con los manuscritos escaneados y proteger la salida de Layla.',
					'Do': 'jump Escena36_ProtegerMaletin'
				},
				'Opcion_Bloquear': {
					'Text': 'Bloquear el pasillo de acceso principal volcando los estantes metálicos del archivo.',
					'Do': 'jump Escena36_Bloquear'
				},
				'Opcion_Subterrano': {
					'Text': 'Huir directamente por el túnel de escape posterior usado históricamente para el contrabando.',
					'Do': 'jump Escena36_Subterrano'
				}
			}
		}
	],

	'Escena36_ProtegerMaletin': [
		'Logras resguardar todo el material digitalizado e impreso sin bajas ni pérdidas.',
		'show storage decision_36 1',
		'jump Escena36_Salida'
	],

	'Escena36_Bloquear': [
		'Ganas valiosos minutos mientras los agresores intentan despejar la entrada.',
		'show storage decision_36 2',
		'jump Escena36_Salida'
	],

	'Escena36_Subterrano': [
		'El paso subterráneo los conduce de forma segura hacia el vehículo de evacuación.',
		'show storage decision_36 3',
		'jump Escena36_Salida'
	],

	'Escena36_Salida': [
		'show scene bg_saqueo_siria with fadeIn',
		'gabriel Esto confirma que Antípatro tenía conocimiento de tierras lejanas y de la octava luz.',
		'gabriel Debemos avanzar hacia Sidón para seguir sus pasos y descubrir la verdad detrás de sus escritos.',
		'isidora La información es valiosa, pero peligrosa. Debemos actuar con cautela.',
		'layla Estoy de acuerdo. La seguridad del equipo y la preservación de los fragmentos es nuestra prioridad. Los espera Helena Papadakis en Sidón, quien nos ayudará a interpretar los textos. Adios. debo regresar y proteger los fragmentos que hemos rescatado.',
		'tomas Debemos planear nuestra ruta hacia Sidón y asegurarnos de que no nos sigan.',
		'jump Escena37_Sidon'
	],

	// -------------------------------------------------------------
	// ESCENA 37: Sidón, Líbano (Ciudad de Antípatro)
	// -------------------------------------------------------------
	'Escena37_Sidon': [
		'show scene bg_sidon with fadeIn',
		'Sidón es una ciudad antigua junto al mar. Aquí nació Antípatro de Sidón, el poeta que enumeró las maravillas.',

		'show character helena talk at center with fadeIn',
		'helena Antípatro escribió sobre las maravillas... pero también sobre una luz que las guiaba.',

		'show character gabriel talk at left with fadeIn',
		'gabriel La octava luz.',

		'show character tomas talk at right with fadeIn',
		'tomas La que apunta a Chile.',

		'[ACCIÓN DE INVENTARIO] Utilizas el Detector de Metales Inductivo en la zona del viejo puerto fenicio.',
		'[EFECTO]: Desentierra una estela conmemorativa con una inscripción poética.',

		'TRANSICIÓN HACIA MONTE SINAÍ',
		'helena Antípatro menciona que la decisión de destruir las maravillas se tomó «en la montaña donde la fe nació».',
		'gabriel Debemos ir a la biblioteca de Sidón y estudiar los textos antiguos que puedan contener pistas sobre la octava luz.',
		'jump Escena37_Biblioteca_Sidon'
	],


	'Escena37_Biblioteca_Sidon': [
		'show scene bg_biblioteca_sidon with fadeIn',
		'El quipo decide examinar la biblioteca. Esto activa un hallazgo crucial.',
		() => VerObjeto('poesia_votiva'),
		() => VerObjeto('epigramas_funerarios'),
		() => TomarObjeto('lupa_filologo'),
		() => TomarObjeto('reactivo_acido'),
		() => UsarObjeto('estante1','lupa_filologo','Poesía écfrástica y descriptiva: Poemas dedicados a describir obras de arte, monumentos y lugares célebres (de aquí surge su famoso poema sobre las Siete Maravillas del Mundo Antiguo).'),
		() => UsarObjeto('estante2','lupa_filologo','La Antología Griega (Anthologia Graeca): Una colección de poemas y epigramas griegos que abarca varios siglos, incluyendo obras de poetas como Antípatro de Sidón.'),
		() => UsarObjetoSobreObjeto('epigrama_antipatro','reactivo_acido','jump Escena38_EpigramaOriginal','El epigrama menciona: La octava luz guía a las siete desde el sur del mundo. El origen de la destrucción de las maravillas se encuentra en el Monte Sinaí.'),
		() => TomarObjeto('epigrama_antipatro'),
		'narrator Necesitas revisar el lugar en busca de alguna pista. Después debes analizar la pista'
	],
/*
	'Escena37_Biblioteca_Sidon': [
		'show scene bg_biblioteca_sidon with fadeIn',
		{
			'Choice': {
				'Dialog': '¿Qué enfoque tomar en la investigación de campo en Sidón?',
				'Opcion_Lirica': {
					'Text': 'Analizar la lírica de los epigramas de Antípatro buscando claves criptográficas.',
					'Do': 'jump Escena37_Lirica'
				},
				'Opcion_Estructura': {
					'Text': 'Examinar la biblioteca de Sidón para estudiar los textos antiguos que tiene relacion con Antípatro.',
					'Do': 'jump Escena37_Estructura'
				},
				'Opcion_Helena': {
					'Text': 'Discutir con Helena Papadakis las conexiones entre la poética helenística y el Monte Sinaí.',
					'Do': 'jump Escena37_Helena'
				}
			}
		}
	],

	'Escena37_Lirica': [
		'Descifras una métrica oculta que revela coordenadas geográficas específicas.',
		'show storage decision_37 1',
		'jump Escena38_EpigramaOriginal'
	],

	'Escena37_Estructura': [
		'Las marcas señalan un rumbo de navegación directo hacia el Océano Atlántico Sur.',
		'show storage decision_37 2',
		'jump Escena38_EpigramaOriginal'
	],

	'Escena37_Helena': [
		'helena Antípatro temía la destrucción de las maravillas y dejó la pista definitiva en el Sinaí.',
		'show storage decision_37 3',
		'jump Escena38_EpigramaOriginal'
	],
*/
	// -------------------------------------------------------------
	// ESCENA 38: Objeto oculto - Epigrama original
	// -------------------------------------------------------------
	'Escena38_EpigramaOriginal': [
		//'show scene bg_epigrama with fadeIn',

		'show scene bg_biblioteca_sidon with fadeIn',
		() => hideAllHotspots(),

		'El epigrama menciona:',
		'«La octava luz guía a las siete desde el sur del mundo.»',

		'[ACCIÓN DE INVENTARIO] Aplicas una gota de Reactivo Ácido Neutro para limpiar la caliza del epigrama.',
		'[EFECTO]: Limpia las incrustaciones salinas sin erosionar las tallas en piedra.',

		'show character isidora thought at center with fadeIn',
		'isidora Antípatro sabía de Chile o sabía de quienes llegaron a Chile.',
		'isidora Existe o existio una organización que realizó todo esto y el lugar donde todo esto se coordina es en el Monte Sinaí.',
		'gabriel Debemos ir allí para entender la conexión entre la octava luz y la destrucción de las maravillas.',
		{
			'Choice': {
				'Dialog': '¿Cómo procesar la lectura del epigrama original de Antípatro?',
				'Opcion_Impronta': {
					'Text': 'Hacer una impronta en papel de arroz utilizando tinta china para conservar el relief exacto.',
					'Do': 'jump Escena38_Impronta'
				},
				'Opcion_Gramatica': {
					'Text': 'Comparar el estilo gramatical del epigrama con la inscripción hallada en el pergamino patagónico.',
					'Do': 'jump Escena38_Gramatica'
				},
				'Opcion_Logistica': {
					'Text': 'Organizar la logística del viaje inmediato hacia el Monte Sinaí a través del paso fronterizo.',
					'Do': 'jump Escena38_Logistica'
				}
			}
		}
	],

	'Escena38_Impronta': [
		'Obtienes un duplicado perfecto de la estela para el cuaderno de campo de la expedición.',
		'show storage decision_38 1',
		'jump Escena39_Sinai'
	],

	'Escena38_Gramatica': [
		'La estructura léxica es idéntica, demostrando que provienen del mismo autor o círculo.',
		'show storage decision_38 2',
		'jump Escena39_Sinai'
	],

	'Escena38_Logistica': [
		'Preparas los pertrechos de montaña y las autorizaciones para la expedición al desierto.',
		'show storage decision_38 3',
		'jump Escena39_Sinai'
	],

	// -------------------------------------------------------------
	// ESCENA 39: Monte Sinaí, Egipto / Medio Oriente
	// -------------------------------------------------------------
	'Escena39_Sinai': [
		'show scene bg_sinai with fadeIn',
		'JUSTIFICACIÓN COMPLETA DE LLEGADA: El equipo llega al Monte Sinaí porque:',
		'• Es el lugar donde nació la lucha contra la idolatría.',
		'• Es el origen ideológico de la destrucción de símbolos paganos.',
		'• Los documentos de Babilonia, Vaticano, Siria y Sidón apuntan a él.',
		'• Antípatro menciona que la decisión se tomó «en la montaña donde la fe nació».',

		'show character marcus informal at center with fadeIn',
		'marcus Aquí comenzó todo. Aquí nació la idea de destruir lo que se consideraba idolatría.',

		'show character gabriel talk at left with fadeIn',
		'gabriel Y aquí se decidió que las maravillas debían desaparecer.',

		'show character isidora talk at right with fadeIn',
		'isidora Pero... ¿por qué preservar una octava luz?',
		'[ACCIÓN DE INVENTARIO] Usas el Altimétro Barométrico y GPS Táctico para ubicar la cueva de la meseta superior descrita en las crónicas.',
		'[EFECTO]: Localiza la entrada oculta de la gruta de los concilios primigenios.'
	],

'Escena39_Caverna': [
		'show scene bg_sinai_caverna with fadeIn',
		'El quipo decide examinar la biblioteca. Esto activa un hallazgo crucial.',
		() => VerObjeto('pared1'),
		() => VerObjeto('pared2'),
		() => VerObjeto('pared3'),
		() => VerObjeto('pared4'),
		() => VerObjeto('pared5'),
		() => VerObjeto('pared6'),
		() => TomarObjeto('paleta'),
		() => UsarObjeto('pared1','paleta','jump Escena39_Revelacion'),
		() => UsarObjeto('pared2','paleta','jump Escena39_Revelacion'),
		'narrator Necesitas revisar el lugar en busca de alguna pista.'
	],

'Escena39_Revelacion': [
		'show scene bg_sinai_revelacion with fadeIn',
		() => hideAllHotspots(),
		'La excavación revela un sitio con un altar muy antiguo, antes de los primeros cristianos, de origen judio.',
		{
			'Choice': {
				'Dialog': '¿Qué hacer al descubrir esta revelación?',
				'Opcion_Termico': {
					'Text': 'Hablar con Isidora sobre la revelación del altar que se muestra tras la pared oculta',
					'Do': 'jump Escena39_Isidora'
				},
				'Opcion_InterrogarMarcus': {
					'Text': 'Interrogar a Marcus sobre la reunión ecuménica secreta que ordenó la salvaguarda de la octava luz.',
					'Do': 'jump Escena39_InterrogarMarcus'
				},
				'Opcion_Muestras': {
					'Text': 'Extraer muestras de roca del altar central para cotejar la presencia de resinas rituales antiguas.',
					'Do': 'jump Escena39_Muestras'
				}
			}
		}
	],

	'Escena39_Isidora': [
		'Isidora El escáner detecta una pared falsa erigida con mortero antiguo. Es un altar judio-cristiano.',
		'show storage decision_39 1',
		'jump Escena40_RevelacionFinal'
	],

	'Escena39_InterrogarMarcus': [
		'marcus Comprendieron que si el mundo caía en la oscuridad, el origen en el sur debía perdurar.',
		'show storage decision_39 2',
		'jump Escena40_RevelacionFinal'
	],

	'Escena39_Muestras': [
		'Las muestras contienen mirra y aceites de consagración fechados en el siglo IV.',
		'show storage decision_39 3',
		'jump Escena40_RevelacionFinal'
	],

	// -------------------------------------------------------------
	// ESCENA 40: Revelación final del capítulo
	// -------------------------------------------------------------
	'Escena40_RevelacionFinal': [
		'show scene bg_sinai_revelacion with fadeIn',

		'show character gabriel talk at left with fadeIn',
		'gabriel Las maravillas no fueron destruidas por el tiempo. Fueron destruidas por una decisión. Una decisión global.',

		'show character isidora talk at right with fadeIn',
		'isidora Pero la octava luz fue preservada.',

		'show character tomas talk at center with fadeIn',
		'tomas ¿Y si la octava luz explica por qué solo una maravilla quedó en pie?',

		'gabriel Entonces debemos volver a Chile. La respuesta está en la Patagonia.',

		'[ACCIÓN DE INVENTARIO] Calibras la Brújula Geológica sobre la roca madre de la cima.',
		'[EFECTO]: La aguja magnética se alinea con el eje ortodrómico proyectado directamente hacia la cueva inicial en la Patagonia.',

		'El capítulo termina con una certeza: La octava luz nos espera en el sur del mundo.',

		{
			'Choice': {
				'Dialog': '¿Cómo cerrar la expedición en el Sinaí antes del retorno definitivo a la Patagonia?',
				'Opcion_Bitacora': {
					'Text': 'Firmar y sellar la bitácora de expedición conjunta firmada por Gabriel, Isidora, Tomás y Marcus.',
					'Do': 'jump Cierre_Capitulo3_Bitacora'
				},
				'Opcion_Informe': {
					'Text': 'Enviar un informe cifrado urgente al equipo de la USACH en Santiago para preparar la expedición patagónica final.',
					'Do': 'jump Cierre_Capitulo3_Informe'
				},
				'Opcion_Geodesico': {
					'Text': 'Tomar una última medición angular del eje geodésico que conecta el Sinaí con el sur de Chile.',
					'Do': 'jump Cierre_Capitulo3_Geodesico'
				}
			}
		}
	],

	'Cierre_Capitulo3_Bitacora': [
		'Consignas formalmente el descubrimiento del pacto global de preservación.',
		'show storage decision_40 1',
		'[FIN DEL CAPÍTULO 3]: Rumbo al desenlace en la Patagonia.',
		'jump Capitulo4'
	],

	'Cierre_Capitulo3_Informe': [
		'El laboratorio en Chile inicia la preparación del equipo de excavación profunda.',
		'show storage decision_40 2',
		'[FIN DEL CAPÍTULO 3]: Rumbo al desenlace en la Patagonia.',
		'jump Capitulo4'
	],

	'Cierre_Capitulo3_Geodesico': [
		'Los cálculos confirman una alineación exacta entre ambos puntos sagrados.',
		'show storage decision_40 3',
		'[FIN DEL CAPÍTULO 3]: Rumbo al desenlace en la Patagonia.',
		'jump Capitulo4'
	],

/* ============================================================
   CAPÍTULO 4 — LA ÚLTIMA LUZ
   PARTE 1 — ESCENAS 41 a 44
   Formato Monogatari — Narración ampliada + diálogos + objetos
   ============================================================ */

   	'Capitulo4': [
		'stop music with fade 3',
		'show scene negro with fadeIn duration 2s',
		'centered <h1>Fin del Capítulo III</h1><p>Sombras del Imperio</p>',
		'wait 1500',
		'show scene negro with fadeIn duration 1s',
		'centered <h1>Capítulo IV</h1><p>La Octava Luz</p>',
		//'play music capitulo1 with loop fade 2',
		'jump Escena41'   
	],

/* ============================================================
   ESCENA 41 — Regreso a la Patagonia (Glaciar Pío XI)
   ============================================================ */

'Escena41': [

    'show scene bg_patagonia_glaciar with fadeIn duration 3s',
    'narrator El avión desciende sobre la Patagonia como si atravesara un velo de silencio.',
    'narrator Las montañas se alzan como gigantes dormidos, cubiertas por un manto blanco que parece respirar.',
    'narrator El glaciar Pío XI brilla con un azul imposible, como si guardara secretos bajo su hielo.',
    'narrator El equipo regresa al mismo punto donde comenzó todo. Pero ahora no vienen con preguntas.',
    'narrator Vienen con respuestas... y con la certeza de que la octava luz está aquí.',
	'show scene cascada_congelada with fadeIn',
    'show character gabriel normal at center',
    'gabriel Todo nos trajo de vuelta. Antípatro, Diodoro, los cristianos primitivos... todos apuntaban a este lugar.',

    'show character isidora normal at right',
    'isidora La octava luz está aquí. Y debemos encontrarla.',

    'show character erik normal at left',
    'erik Hay una cueva más profunda. Nunca la exploré... pero las coordenadas que encontraron coinciden con su entrada.',

    /* Interacción con objeto: GPS antiguo */
    'narrator Gabriel revisa el GPS antiguo encontrado en el Capítulo 1.',
    () => addItem('gps_antiguo'),
    'narrator El GPS antiguo se ha añadido al inventario.',
    {
        'Choice': {
            'coordenadas': {
                'Text': 'Seguir las coordenadas exactas.',
                'Do': 'jump Escena41_Coordenadas'
            },
            'glaciar': {
                'Text': 'Explorar el glaciar antes de entrar.',
                'Do': 'jump Escena41_Glaciar'
            },
            'erik': {
                'Text': 'Interrogar a Erik sobre expediciones previas.',
                'Do': 'jump Escena41_Erik'
            }
        }
    }
],

'Escena41_Coordenadas': [
    'narrator Sigues las coordenadas exactas reveladas en el Capítulo 1.',
    'narrator La entrada a la cueva final se activa.',
    'jump Escena42'
],

'Escena41_Glaciar': [
    'narrator Exploras el glaciar y encuentras un fragmento de hielo fósil con marcas geométricas.',
    () => addItem('hielo_fosil'),
    'narrator El objeto ha sido añadido al inventario.',
    'jump Escena42'
],

'Escena41_Erik': [
    'erik Hubo una expedición hace años... pero desaparecieron. Nunca supe por qué.',
    'narrator La ruta se vuelve más peligrosa.',
    'jump Escena42'
],


/* ============================================================
   ESCENA 42 — Minijuego Puzzle: Ensamblaje de los 10 objetos
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

		async() => { 
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

/* ============================================================
   ESCENA 43 — Cámara subterránea (La Octava Luz)
   ============================================================ */

'Escena43': [
	'show scene camara_secreta with fadeIn',
    'narrator Se abren las puertas del fondo.',
    'narrator Se puede apreciar un camara de grandes proporciones y algo increible...',
    'show scene bg_camara_subterranea with fadeIn duration 3s',
    'narrator La cámara es gigantesca.',
    'narrator Las paredes están cubiertas de símbolos mapuches y helenísticos entrelazados.',
    'narrator En el centro, una estructura geométrica idéntica a la Gran Pirámide de Giza... pero más pequeña, más antigua, más perfecta.',
    'narrator La octava luz no es un objeto. Es una estructura. Una maravilla perdida.',

    'show character tomas normal at left',
    'tomas Es... una pirámide. Una pirámide mapuche.',

    'show character isidora normal at right',
    'isidora No. Es anterior a los mapuches. Anterior a los griegos. Anterior a todo lo que conocemos.',

    'show character gabriel normal at center',
    'gabriel La octava luz... la maravilla original.',

    /* Interacción con estructura */
    'narrator Gabriel toca la superficie de la pirámide.',
    () => addItem('medicion_geometrica'),
    'narrator Se registra una medición geométrica en el inventario.',

    {
        'Choice': {
            'examinar': {
                'Text': 'Examinar la estructura.',
                'Do': 'jump Escena43_Examinar'
            },
            'medir': {
                'Text': 'Medir la geometría.',
                'Do': 'jump Escena43_Medir'
            },
            'buscar': {
                'Text': 'Buscar cámaras secundarias.',
                'Do': 'jump Escena43_Buscar'
            }
        }
    }
],

'Escena43_Examinar': [
    'narrator Encuentras un panel oculto con símbolos mixtos.',
    () => addItem('panel_simbolos'),
    'jump Escena44'
],

'Escena43_Medir': [
    'narrator Las medidas coinciden con proporciones de Giza.',
    'jump Escena44'
],

'Escena43_Buscar': [
    'narrator Un pasadizo opcional se activa.',
    () => addItem('pasadizo_oculto'),
    'jump Escena44'
],


/* ============================================================
   ESCENA 44 — Narración histórica: La verdad detrás de las maravillas
   ============================================================ */

'Escena44': [

    'show scene bg_historia_luz with fadeIn duration 3s',
    'narrator La octava luz es la primera maravilla del mundo antiguo.',
    'narrator La única construida antes de la expansión de las civilizaciones mediterráneas.',
    'narrator Un monumento que representa la unión entre ciencia, fe y humanidad.',
    'narrator Las otras siete maravillas fueron construidas como réplicas simbólicas de esta estructura original.',
    'narrator Pero cuando la lucha contra la idolatría comenzó, las réplicas fueron destruidas... y la original fue ocultada en el fin del mundo.',
    'narrator La única réplica que sobrevivió fue la Gran Pirámide de Giza.',

    {
        'Choice': {
            'aceptar': {
                'Text': 'Aceptar la revelación.',
                'Do': 'jump Escena44_Aceptar'
            },
            'cuestionar': {
                'Text': 'Cuestionar la narrativa.',
                'Do': 'jump Escena44_Cuestionar'
            },
            'pruebas': {
                'Text': 'Buscar pruebas físicas.',
                'Do': 'jump Escena44_Pruebas'
            }
        }
    }
],

'Escena44_Aceptar': [
    'gabriel Esto cambia la historia humana.',
    'jump Escena45'
],

'Escena44_Cuestionar': [
    'isidora ¿Y si esta narrativa fue manipulada por siglos?',
    'jump Escena45'
],

'Escena44_Pruebas': [
    'narrator Analizas el material de la estructura.',
    () => addItem('material_octava_luz'),
    'jump Escena45'
],

/* ============================================================
   CAPÍTULO 4 — LA ÚLTIMA LUZ
   PARTE 2 — ESCENAS 45 a 47
   Formato Monogatari — Narración ampliada + diálogos + objetos
   ============================================================ */

/* ============================================================
   Escena 45 — reemplazo del bloque Choice por el minijuego
   `derrumbe derrumbeFinal` (verbo `derrumbe`)

   Reemplaza en tu Escena45 real todo desde
   "narrator Debes decidir cómo actuar mientras el derrumbe avanza."
   hasta el cierre del bloque `{ 'Choice': {...} }` (inclusive) por
   el fragmento de abajo. Las 3 ramas viejas (Escena45_Proteger /
   Escena45_Escapar / Escena45_Salvar) ya no se usan y pueden borrarse
   una vez migres — las 3 quedan cubiertas por las 3 etapas del
   minijuego (proteger la estructura ≈ etapa 1 sin golpes, escapar ≈
   etapas 1 y 3, salvar a Isidora ≈ etapa 2, que ahora es obligatoria).
   ============================================================ */

'Escena45': [

    'show scene bg_camara_subterranea with shake infinite',
    'narrator Un estruendo sacude la cámara subterránea.',
    'narrator El suelo vibra como si la tierra quisiera expulsar la estructura.',
    'narrator Fragmentos de roca comienzan a desprenderse del techo, cayendo con violencia.',
    'narrator La octava luz tiembla, pero permanece firme, como si se defendiera a sí misma.',

    'show character gabriel worried at center',
    'gabriel ¡La cámara se está derrumbando! ¡Debemos movernos ahora!',

    'show character isidora scared at right',
    'isidora ¡La estructura! ¡Si se destruye, perdemos todo!',

    'show character tomas scared at left',
    'tomas ¡Las rocas vienen hacia nosotros! ¡Rápido!',

    'narrator Corres hacia la salida mientras el techo cede a tu espalda.',

    // TODO: reemplaza esta línea por la llamada que ya usas en tus otros
    // minijuegos para ocultar text-box/quick-menu ANTES del verbo
    // (crítico: debe ir antes, no después — ver notas de integración).
    // 'distractionFree' o el helper equivalente que ya tengas en script.js,

		async() => { 
			if (!monogatari.storage('player').derrumbeFinal) { 
				monogatari.distractionFree();
				await monogatari.run('derrumbe derrumbeFinal');
				monogatari.distractionFree();
				monogatari.storage('player').derrumbeFinal = true;
			}
		}, 

    // El componente ya dejó dos banderas en monogatari.storage():
    //   - derrumbeMuroIntacto   → true si la Etapa 1 se completó sin
    //     recibir ningún golpe (equivalente a la vieja rama "Proteger").
    //   - derrumbeIsidoraSalvada → true siempre que se llega a este
    //     punto (la Etapa 2 es obligatoria: no hay forma de avanzar sin
    //     rescatar a Isidora).
	/*
    () => {
        if (monogatari.storage().derrumbeMuroIntacto) {
            addItem('mural_intacto');
        }
    },
	*/
    //() => addItem('relacion_isidora_mejorada'),
	'show character isidora normal at right',
    'narrator El polvo se asienta. Isidora, a salvo, mira hacia atrás.',
    
    'isidora Gracias por no dejarme atrás.',

    'narrator Ante ustedes, la cámara oculta que el propio derrumbe acaba de revelar.',

    'jump Escena46'
],

/* ============================================================
   ESCENA 45 — Minijuego Acción: Derrumbe final
   ============================================================ */
/*
	'Escena45': [

	'show scene bg_camara_subterranea with shake infinite',
    //'show scene bg_camara_temblor with fadeIn duration 2s',
    'narrator Un estruendo sacude la cámara subterránea.',
    'narrator El suelo vibra como si la tierra quisiera expulsar la estructura.',
    'narrator Fragmentos de roca comienzan a desprenderse del techo, cayendo con violencia.',
    'narrator La octava luz tiembla, pero permanece firme, como si se defendiera a sí misma.',

    'show character gabriel worried at center',
    'gabriel ¡La cámara se está derrumbando! ¡Debemos movernos ahora!',

    'show character isidora scared at right',
    'isidora ¡La estructura! ¡Si se destruye, perdemos todo!',

    'show character tomas scared at left',
    'tomas ¡Las rocas vienen hacia nosotros! ¡Rápido!',
*/
    /* Minijuego: acción */
   /* 'narrator Debes decidir cómo actuar mientras el derrumbe avanza.',

    {
        'Choice': {
            'proteger': {
                'Text': 'Proteger la estructura.',
                'Do': 'jump Escena45_Proteger'
            },
            'escapar': {
                'Text': 'Escapar primero.',
                'Do': 'jump Escena45_Escapar'
            },
            'salvar': {
                'Text': 'Salvar a un compañero.',
                'Do': 'jump Escena45_Salvar'
            }
        }
    }
],

'Escena45_Proteger': [
    'narrator Te lanzas hacia la estructura, levantando los brazos para desviar las rocas.',
    'narrator Una roca golpea tu hombro, pero logras evitar que el impacto dañe la pirámide.',
    () => addItem('mural_intacto'),
    'narrator Un mural oculto queda protegido y se revela tras el polvo.',
    'jump Escena46'
],

'Escena45_Escapar': [
    'narrator Corres hacia la salida mientras las rocas caen detrás de ti.',
    'narrator El equipo te sigue y logran evitar heridas graves.',
    'jump Escena46'
],

'Escena45_Salvar': [
    'narrator Ves a Isidora atrapada bajo una roca que bloquea su camino.',
    'narrator Sin dudarlo, corres hacia ella.',
    'show character isidora scared at center',
    'isidora ¡No puedo moverme!',
    'narrator Levantas la roca con esfuerzo y la liberas.',
    () => addItem('relacion_isidora_mejorada'),
    'narrator Tu relación con Lucía ha mejorado.',
    'jump Escena46'
],
*/

/* ============================================================
   ESCENA 46 — Tesoro final: El Artefacto de la Luz
   ============================================================ */

'Escena46': [

    'show scene bg_pedestal_luz with fadeIn',
	() => ImagenEnHotspot('palo_antorcha', { escala: 0.5 }),
    'narrator Tras escapar del derrumbe, el equipo llega a una cámara secundaria.',
    'narrator En el centro, un pedestal iluminado por una luz suave revela un artefacto.',
    'narrator El objeto parece tener energía propia.',
    'narrator Material: una aleación desconocida, imposible de clasificar.',
    'narrator Forma: un disco con símbolos mapuches y helenísticos entrelazados.',
	() => VerObjeto('mapa1'),
	() => VerObjeto('mapa2'),
	() => VerObjeto('mapa3'),
	() => VerObjeto('altar'),
	() => VerObjeto('disco'),
	() => VerObjeto('antorcha_pared1'),
	() => VerObjeto('antorcha_pared2'),
	() => TomarObjeto('palo_antorcha'),
	() => UsarObjeto('antorcha_pared1','palo_antorcha','jump Escena46_antorcha'),
	() => UsarObjeto('antorcha_pared2','palo_antorcha','jump Escena46_antorcha'),
	'narrator Necesitas revisar el lugar en busca de alguna pista.'
	],

'Escena46_antorcha': [

    'show scene bg_pedestal_luz',
	() => hideAllHotspots(),
	() => removeItem('palo_antorcha'),
	() => addItem('antorcha_encendida'), 
	'narrator La antorcha se prende lentamente.',
    'narrator El objeto del centro parece reaccionar ante la antorcha encencida.',
	() => VerObjeto('mapa1'),
	() => VerObjeto('mapa2'),
	() => VerObjeto('mapa3'),
	() => VerObjeto('altar'),
	() => VerObjeto('disco'),
	() => VerObjeto('antorcha_pared1'),
	() => VerObjeto('antorcha_pared2'),		
	() => UsarObjeto('disco','antorcha_encendida','jump Escena46_rutas','narrator El disco no hace nada diferente. Debes utilizar un objeto'),
	'narrator Necesitas revisar el lugar en busca de alguna pista. Debes ocupar un objeto'
	],

'Escena46_rutas': [
	'show scene bg_pedestal_rutas with fadeIn duration 3s',
	() => hideAllHotspots(),
    'narrator Función: proyecta un mapa tridimensional del mundo antiguo.',
    'narrator Revelación: muestra rutas de viaje desde Alejandría hacia la Patagonia.',
    'show character gabriel normal at left',
    'gabriel Este artefacto... es la clave.',
    'gabriel La prueba de que las maravillas fueron construidas siguiendo un patrón.',
    'gabriel Un patrón basado en esta estructura.',

    /* Interacción con el artefacto */
    'narrator El disco emite un leve pulso cuando lo tocas.',

    {
        'Choice': {
            'activar': {
                'Text': 'Activar el artefacto.',
                'Do': 'jump Escena46_Activar'
            },
            'analizar': {
                'Text': 'Analizar la aleación.',
                'Do': 'jump Escena46_Analizar'
            },
            'registrar': {
                'Text': 'Registrar los símbolos.',
                'Do': 'jump Escena46_Registrar'
            }
        }
    }
],

'Escena46_Activar': [
    'narrator El artefacto se ilumina y proyecta un mapa tridimensional.',
    'narrator La luz se desplaza desde la Patagonia hacia la Antártida.',
    'jump Escena47'
],

'Escena46_Analizar': [
    'narrator Tomas una muestra microscópica de la aleación.',
    'narrator El material no coincide con ningún metal conocido.',
    () => addItem('analisis_aleacion'),
    'jump Escena47'
],

'Escena46_Registrar': [
    'narrator Registras los símbolos en tu cuaderno digital.',
    () => addItem('diccionario_simbolos'),
    'jump Escena47'
],


/* ============================================================
   ESCENA 47 — Diálogo final del equipo
   ============================================================ */

'Escena47': [

    'show scene bg_camara_subterranea_derrumbe with fadeIn duration 3s',
    () => addItem('artefacto_luz'),
    'narrator El Artefacto de la Luz ha sido añadido al inventario.',
    'narrator El equipo se reúne fuera de la cámara, aún con el eco del derrumbe resonando en sus oídos.',
    'narrator La luz azul de la octava maravilla ilumina sus rostros, revelando una mezcla de asombro y temor.',
    'show character isidora normal at right',
    'isidora Gabriel... esto cambia la historia humana.',
    'show character tomas normal at left',
    'tomas La octava luz... la primera maravilla.',
    'isidora Y estuvo aquí todo el tiempo.',
    'show character gabriel normal at center',
    'gabriel Oculta. Protegida. Esperando ser encontrada.',

    {
        'Choice': {
            'celebrar': {
                'Text': 'Celebrar el hallazgo.',
                'Do': 'jump Escena47_Celebrar'
            },
            'divulgacion': {
                'Text': 'Planear la divulgación científica.',
                'Do': 'jump Escena47_Divulgacion'
            },
            'riesgos': {
                'Text': 'Advertir sobre los riesgos.',
                'Do': 'jump Escena47_Riesgos'
            }
        }
    }
],

'Escena47_Celebrar': [
    'narrator El equipo sonríe, abrazándose brevemente.',
    'narrator Por primera vez desde que comenzó el viaje, sienten que han logrado algo imposible.',
    'jump Escena48'
],

'Escena47_Divulgacion': [
    'gabriel Debemos preparar un informe. Esto no puede quedar oculto.',
    'narrator El equipo asiente, consciente del impacto global.',
    'jump Escena48'
],

'Escena47_Riesgos': [
    'gabriel Si revelamos esto sin cuidado... podría desencadenar conflictos.',
    'narrator El equipo guarda silencio, comprendiendo la gravedad.',
    'jump Escena48'
],

/* ============================================================
   CAPÍTULO 4 — LA ÚLTIMA LUZ
   PARTE 3 — ESCENAS 48 a 50
   Formato Monogatari — Narración ampliada + diálogos + objetos
   ============================================================ */


/* ============================================================
   ESCENA 48 — Revelación inesperada (El giro final)
   ============================================================ */

'Escena48': [

    //'show scene bg_cueva_silencio with fadeIn duration 3s',
	'show scene bg_camara_subterranea_derrumbe',
    'narrator El silencio dentro de la cámara es absoluto.',
    'narrator El aire parece contener la respiración del mundo, como si la tierra misma esperara la próxima revelación.',
    'narrator El Artefacto de la Luz descansa en las manos de Gabriel, vibrando con una energía que no pertenece a ninguna civilización conocida.',
    'narrator De pronto, el disco se activa por sí solo.',

    'show scene bg_artefacto_luz_glow with fadeIn',
    'narrator Una luz intensa surge del artefacto, proyectando un mapa tridimensional del hemisferio sur.',
    'narrator La proyección se mueve lentamente, como si buscara algo... o respondiera a una presencia.',

    'show character tomas surprised at left',
    'tomas ¿La octava luz... no es la única?',

    'show character isidora shocked at right',
    'isidora Gabriel... mira la proyección. La luz se está desplazando.',

    'show character gabriel serious at center',
    'gabriel No puede ser... está apuntando hacia el sur. Mucho más al sur.',

    'narrator La luz abandona la Patagonia en la proyección y se dirige hacia un punto blanco y vasto.',
    'narrator La Antártida.',

    //'show character isidora thinking at center',
    'isidora Si hay otra estructura... entonces la octava luz no era el final.',
    'isidora Era solo el comienzo.',

    /* Interacción con el artefacto */
    'narrator El artefacto emite un pulso que golpea suavemente tu pecho.',
    () => addItem('coordenadas_antartida'),
    'narrator Las coordenadas de la Antártida han sido añadidas al inventario.',

    {
        'Choice': {
            'aceptar': {
                'Text': 'Aceptar la existencia de la novena luz.',
                'Do': 'jump Escena48_Aceptar'
            },
            'dudar': {
                'Text': 'Dudar del artefacto.',
                'Do': 'jump Escena48_Dudar'
            },
            'viajar': {
                'Text': 'Proponer viajar inmediatamente.',
                'Do': 'jump Escena48_Viajar'
            }
        }
    }
],

'Escena48_Aceptar': [
    'gabriel Si existe una novena luz... debemos encontrarla.',
    'narrator El equipo asiente con solemnidad.',
    'jump Escena49_Fogon'
],

'Escena48_Dudar': [
    'tomas ¿Y si el artefacto está dañado? ¿O si interpreta mal la información?',
    'isidora No. La precisión geométrica es perfecta. Esto no es un error.',
    'jump Escena49_Fogon'
],

'Escena48_Viajar': [
    'gabriel No podemos esperar. Si hay otra estructura, debemos llegar antes de que alguien más lo haga.',
    'isidora ¿Estás diciendo que no somos los únicos que podrían estar buscando esto?',
    'gabriel Exactamente.',
    'jump Escena49_Fogon'
],


/* ============================================================
   ESCENA 49 — Cliffhanger
   ============================================================ */

	'Escena49_Fogon': [
		'show scene fogon with fadeIn',
		'show character gabriel pensativo at left with fadeIn',
		'show character isidora normal at right with fadeIn',
		'gabriel Este artefacto parece que reacciona ante alguna luz cercana.',
		'isidora Es una clase de astrolabio que indica la ruta que conecta a las maravillas.',
		'jump Escena49'
	],

'Escena49': [
	
    'show scene bg_cueva_salida with fadeIn duration 3s',
    'narrator De pronto, al igual que la vez anterior, el artefacto empieza a vibrar y proyecta una coordenada exacta en la Antártida.',
    'narrator Una estructura enterrada bajo kilómetros de hielo.',
    'narrator Una maravilla que nadie ha visto.',
    'narrator Una maravilla que podría cambiarlo todo.',

    'show character gabriel serious at center',
    'gabriel Nuestro viaje... no ha terminado.',

    'show character isidora determined at right',
    'isidora Entonces la pregunta es simple.',
    'isidora ¿Cuándo partimos?',

    'show character tomas thought at left',
    'tomas La Antártida no es un destino cualquiera. Necesitaremos preparación, permisos, equipo especializado...',

    //'show character isidora calm at center',
    'isidora Y discreción. Si revelamos esto demasiado pronto, podríamos perder el control de la información.',

    /* Interacción con el artefacto */
    'narrator El artefacto vuelve a emitir un pulso.',
    () => addItem('mapa_tridimensional'),
    'narrator El mapa tridimensional ha sido añadido al inventario.',

    {
        'Choice': {
            'expedicion': {
                'Text': 'Preparar la expedición.',
                'Do': 'jump Escena49_Expedicion'
            },
            'apoyo': {
                'Text': 'Buscar apoyo internacional.',
                'Do': 'jump Escena49_Apoyo'
            },
            'investigar': {
                'Text': 'Investigar antes de viajar.',
                'Do': 'jump Escena49_Investigar'
            }
        }
    }
],

'Escena49_Expedicion': [
    'gabriel Prepararemos todo. No podemos perder tiempo.',
    'narrator El equipo comienza a organizar mentalmente los pasos.',
    'jump Escena50'
],

'Escena49_Apoyo': [
    'isidora Si buscamos apoyo internacional, podríamos obtener recursos... pero también atención no deseada.',
    'gabriel Es un riesgo que debemos evaluar.',
    'jump Escena50'
],

'Escena49_Investigar': [
    'isidora Antes de viajar, debemos entender qué estamos buscando.',
    'narrator El equipo asiente, consciente de la importancia de la información.',
    'jump Escena50'
],


/* ============================================================
   ESCENA 50 — FIN DEL CAPÍTULO Y APERTURA DE LA SECUELA
   ============================================================ */

'Escena50': [

    'show scene bg_patagonia_amanecer with fadeIn duration 4s',
    'narrator El sol comienza a asomarse detrás de las montañas patagónicas.',
    'narrator La luz dorada ilumina el glaciar, reflejándose en miles de tonos que parecen despedirse del equipo.',
    'narrator El viento frío acaricia sus rostros, como si la tierra misma reconociera la magnitud de lo descubierto.',
    'narrator El capítulo termina con una certeza que resuena en cada uno de ellos:',

    'narrator "La octava luz fue solo el comienzo. La novena luz nos espera en el continente blanco."',

    'show character gabriel normal at center',
    'gabriel Lo que encontramos aquí... cambiará el mundo.',
    'gabriel Pero lo que encontraremos allá... podría cambiar la historia de la humanidad.',

    'show character isidora normal at right',
    'isidora Entonces no es un final.',
    'isidora Es un inicio.',

    'show character tomas entusiasmado at left',
    'tomas ¿Cómo llamaremos esta nueva etapa?',
    'show character isidora smile at right',
    'isidora Ya lo sabemos.',
    'isidora "El Legado de la Luz".',

    {
        'Choice': {
            'aceptar': {
                'Text': 'Aceptar la misión.',
                'Do': 'jump FinCapitulo4_Aceptar'
            },
            'cuestionar': {
                'Text': 'Cuestionar el destino.',
                'Do': 'jump FinCapitulo4_Cuestionar'
            },
            'reflexion': {
                'Text': 'Cerrar el capítulo con reflexión.',
                'Do': 'jump FinCapitulo4_Reflexion'
            }
        }
    }
],

'FinCapitulo4_Aceptar': [
    'narrator Aceptas la misión con determinación.',
    'narrator El viaje hacia la novena luz comenzará pronto.',
    'jump Creditos'
],

'FinCapitulo4_Cuestionar': [
    'gabriel ¿Estamos preparados para lo que viene?',
    'narrator La duda se mezcla con esperanza.',
    'jump Creditos'
],

'FinCapitulo4_Reflexion': [
    'narrator Cierras los ojos y respiras el aire frío de la Patagonia.',
    'narrator Sabes que tu vida cambió para siempre.',
    'jump Creditos'
],

'Creditos': [
    'stop music with fade 3',
    'show scene negro with fadeIn duration 2s',
    //'play music creditos with loop fade 2',
    'centered <h2>Maravillas de la Antigüedad</h2>',
    'wait 3000',
    'centered <h3>Guion y diseño</h3><p>Cortecom</p>',
    'wait 3000',
    'centered <h3>Música</h3><p>Cortecom</p>',
    'wait 3000',
    'centered <h3>Gracias por jugar</h3>',
    'wait 3000',
    'end'     // termina la partida y vuelve al menú principal
]

});
