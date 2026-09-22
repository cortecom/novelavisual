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
        description: 'Un mapa que muestra el camino hacia el templo.'
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
    'paleta': {
        icon: 'assets/icons/paleta.png',
        name: 'Paleta',
        description: 'Una paleta usada para mezclar pigmentos naturales.'
    },
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

    'pincel_arqueologico': {
        icon: 'assets/icons/pincel_arqueologico.png',
        name: 'Pincel de Cerdas Suaves',
        description: 'Utilizado para limpiar polvo secular y proteger grietas en ruinas delicadas.'
    },
    'palanca': {
        icon: 'assets/icons/palanca.png',
        name: 'Barra de Palanca de Titanio',
        description: 'Herramienta de alta resistencia para despejar escombros y bloques pesados.'
    },


    // Pergamino de los Guardianes del Sur
    'pergamino_guardianes': {
        icon: 'assets/icons/mapa.png',
        name: 'Pergamino de los Guardianes',
        description: 'Un pergamino con relatos de los Guardianes del Sur.'
    },
    'pergamino_guardianes_02': {
        icon: 'assets/icons/mapa.png',
        name: 'Pergamino de los Guardianes (II)',
        description: 'La segunda parte del pergamino de los Guardianes del Sur.'
    },

    // Pistas / documentos
    'pergamino_hint': {
        icon: 'assets/icons/mapa.png',
        name: 'Pergamino con Pista',
        description: 'Un pergamino que contiene una pista útil.'
    },
    'pergamino_reminder': {
        icon: 'assets/icons/mapa.png',
        name: 'Pergamino Recordatorio',
        description: 'Notas que dejaste para recordar algo importante.'
    },

    // Grabados de maravillas
    'grabado_faro_alejandria': {
        icon: 'assets/icons/mapa.png',
        name: 'Grabado del Faro de Alejandría',
        description: 'Un grabado que representa el Faro de Alejandría.'
    },
//Capitulo 2
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
    'georradar_portatil': {
        icon: 'assets/icons/georradar.png',
        name: 'Georradar Escáner',
        description: 'Equipo portátil para detectar anomalías de densidad bajo capas de tierra y piedra.'
    },
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
    'espectrometro': {
        icon: 'assets/icons/espectrometro.png',
        name: 'Espectrómetro Portátil',
        description: 'Dispositivo para medir trazos químicos, sulfatos y residuos de aceites antiguos.'
    },
    'lampara_uv': {
        icon: 'assets/icons/lampara_uv.png',
        name: 'Lámpara Ultravioleta',
        description: 'Emite luz fluorescente para revelar pigmentos invisibles y trazados direccionales.'
    },

    'cuerda_kevlar': {
        icon: 'assets/icons/cuerda_kevlar.png',
        name: 'Cuerda Táctica de Kevlar',
        description: 'Línea de seguridad ligera y ultraresistente para descensos y rescates.'
    },
    'papel_vaciado': {
        icon: 'assets/icons/papel_vaciado.png',
        name: 'Papel de Vaciado y Grafito',
        description: 'Material especializado para realizar calcos perfectos de inscripciones en piedra.'
    },
    'camara_macro': {
        icon: 'assets/icons/camara_macro.png',
        name: 'Cámara Fotográfica Macro',
        description: 'Equipada con flash rasante para resaltar micro-fisuras ocultas en relieves.'
    },
    'nivel_laser': {
        icon: 'assets/icons/nivel_laser.png',
        name: 'Nivel Láser de Alta Precisión',
        description: 'Proyecta líneas de fuga y alineaciones geométricas sobre cimientos antiguos.'
    },
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
    'dron_subacuatico': {
        icon: 'assets/icons/dron_subacuatico.png',
        name: 'Dron Sumergible con Sonar',
        description: 'Vehículo operado por control remoto para inspeccionar ruinas portuarias sumergidas.'
    },
    'carta_nautica': {
        icon: 'assets/icons/carta_nautica.png',
        name: 'Carta Náutica Histórica',
        description: 'Mapa antiguo para rastrear anclajes y corrientes marinas del Mediterráneo.'
    },
    'llave_cobre': {
        icon: 'assets/icons/llave_cobre.png',
        name: 'Llave de Cobre del Archivo',
        description: 'Llave con muescas en forma de delta para abrir depósitos protegidos en Alejandría.'
    },
    'pergamino_faro': {
        icon: 'assets/icons/pergamino_faro.png',
        name: 'Papiro del Faro de Alejandría',
        description: 'Documento del siglo I a.C. con anotaciones sobre rutas hacia el fin del mundo.'
    },
    'cilindro_nitrogeno': {
        icon: 'assets/icons/cilindro_nitrogeno.png',
        name: 'Cilindro Hermético de Nitrógeno',
        description: 'Estuche sellado al vacío para preservar documentos frágiles contra la humedad.'
    },
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
	'bajorelieve_babilonico': {
        icon: 'assets/icons/bajorelieve_babilonico.png',
        name: 'Bajorelieve Babilónico',
        description: 'Fragmento de escultura en bajo relieve que representa escenas de la vida cotidiana en Babilonia. '
    },
	'bajorelieve_babilonico_destruido': {
        icon: 'assets/icons/bajorelieve_babilonico_destruido.png',
        name: 'Bajorelieve Babilónico Destruido',
        description: 'Fragmento de escultura en bajo relieve destruidos, revela golpes sistemáticos orientados a borrar rostros paganos.'
    },
	'simbolo_babilonico': {
        icon: 'assets/icons/simbolo_babilonico.png',
        name: 'Símbolo Babilónico',
        description: 'Un símbolo cuyo significado aún no comprendes.'
    },
    'brújula_antigua': {
        icon: 'assets/icons/brujula_antigua.png',
        name: 'Brújula de Navegación',
        description: 'Una brújula antigua con marcas de desgaste que señala hacia un punto magnético inusual.'
    },
    'fragmento_estela': {
        icon: 'assets/icons/fragmento_estela.png',
        name: 'Fragmento de Estela',
        description: 'Un trozo de piedra con inscripciones grabadas que parecen formar parte de un mapa mayor.'
    },
    'diario_expedicion': {
        icon: 'assets/icons/diario_expedicion.png',
        name: 'Diario de Expedición',
        description: 'Libreta de notas con anotaciones de campo y coordenadas borrosas sobre el sur de Chile.'
    },
    'lente_aumento': {
        icon: 'assets/icons/lente_aumento.png',
        name: 'Lente de Precisión',
        description: 'Lente de aumento manual útil para examinar marcas sutiles en superficies rocosas.'
    },
    'llave_hierro': {
        icon: 'assets/icons/llave_hierro.png',
        name: 'Llave de Hierro Oxidado',
        description: 'Una llave pesada cubierta de herrumbre, encontrada cerca de la entrada principal.'
    },
    'sello_arcilla': {
        icon: 'assets/icons/sello_arcilla.png',
        name: 'Sello de Arcilla',
        description: 'Pequeño bloque de arcilla seca que conserva la impronta de un emblema olvidado.'
    },
    'mapa_rutas': {
        icon: 'assets/icons/mapa_rutas.png',
        name: 'Mapa de Rutas Costeras',
        description: 'Cartografía detallada de los canales australes y rutas de aproximación marítima.'
    },
    'insignia_metalica': {
        icon: 'assets/icons/insignia_metalica.png',
        name: 'Insignia Metálica',
        description: 'Distintivo oxidado con relieves geométricos difíciles de decodificar a simple vista.'
    },
    'frasco_muestras': {
        icon: 'assets/icons/frasco_muestras.png',
        name: 'Frasco de Muestras',
        description: 'Recipiente hermético que contiene sedimentos y partículas recolectadas en el sitio.'
    },
    'cinta_metrica': {
        icon: 'assets/icons/cinta_metrica.png',
        name: 'Cinta Métrica de Topógrafo',
        description: 'Herramienta enrollable de lona y metal para medir distancias y dimensiones en ruinas.'
    },
    'linterna_tactica': {
        icon: 'assets/icons/linterna_tactica.png',
        name: 'Linterna de Alta Potencia',
        description: 'Dispositivo de iluminación portátil fundamental para explorar recovecos oscuros.'
    },
    'estuche_herramientas': {
        icon: 'assets/icons/estuche_herramientas.png',
        name: 'Estuche de Herramientas Menores',
        description: 'Kit compacto con espátulas, pinzas y cinceles pequeños para excavación delicada.'
    },
    'documento_codificado': {
        icon: 'assets/icons/documento_codificado.png',
        name: 'Documento Cifrado',
        description: 'Hoja de papel ajada con secuencias numéricas y símbolos crípticos.'
    },
    'amuleto_piedra': {
        icon: 'assets/icons/amuleto_piedra.png',
        name: 'Amuleto de Piedra Tallada',
        description: 'Pequeño talismán pulido con perforaciones para colgar al cuello.'
    },
    'placa_inscripcion': {
        icon: 'assets/icons/placa_inscripcion.png',
        name: 'Placa Conmemorativa',
        description: 'Placa metálica desgastada por el tiempo con inscripciones parcialmente legibles.'
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

function showHotspot(item) {
    const hotspot = document.getElementById(item);
    hotspot.style.display = "block";
    hotspot.style.pointerEvents = "auto";
}

function hideHotspot(item) {
    const hotspot = document.getElementById(item);
    hotspot.style.display = "none";
    hotspot.style.pointerEvents = "none";
    hideTooltip(); // <- nuevo
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
    'viento': 'viento.ogg',
    'vibracion': 'vibracion.ogg'

});

// Define the videos used in the game.
monogatari.assets ('videos', {

});

// Define the images used in the game.
monogatari.assets ('images', {
	'img_mapa': 'Copilot_20260708_172541.png',
	'panuelo': 'panuelo.png'

});

// Define the backgrounds for each scene.
monogatari.assets ('scenes', {
	'museo': 'museo_dia.png',
    'bg_bosque_dia': 'bosque_dia.png',
    'bg_templo_abierto': 'templo_abierto.png',
    'bg_templo_cerrado': 'templo_cerrado.png',
    'bg_templo_interior': 'templo_interior.png',
	quinta_normal: 'quinta_normal.png',
	museo_historico_nacional: 'museo_historico_nacional.png',
    museo_sala_precolombina: 'bg_museo_sala_precolombina.png',
	museo_sala_precolombina_vitrina_abierta: 'bg_museo_sala_precolombina_vitrina_abierta.png',
	museo_sala_precolombina_sin_piedra: 'bg_museo_sala_precolombina_sin_piedra.png',
	usach: 'usach.png',
	laboratorio: 'laboratorio.png',
    bg_usach_aula_magna: 'bg_usach_aula_magna.png',
    lab_escaneo: 'lab_escaneo.png',
	laboratorio_escaneo: 'laboratorio_escaneo.png',
    bg_puzzle_piedra: 'bg_puzzle_piedra.png',
    ruta7: 'ruta7.png',
    caverna: 'caverna.png',
	cascada_congelada: 'cascada_congelada.png',
	cascada_congelada_jeep: 'cascada_congelada_jeep.png',
    bg_cueva_grabados: 'bg_cueva_grabados.png',
    derrumbe: 'derrumbe.png',
    camara_profunda: 'camara_profunda.png',
	altar: 'altar.png',
	parchment_master: 'parchment_master.png',
    fogon: 'fogon.png',
	mapa_estrategico: 'mapa_estrategico.png',
    bg_decision_viaje: 'bg_decision_viaje.png',
    embarque: 'embarque.png',

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
	'bg_documentos_vaticano': 'vatican_documents.png',
	'bg_manuscrito': 'vatican_manuscript.png',
	'bg_siria_archivo': 'siria_archive.png',
	'bg_saqueo_siria': 'archive_attack.png',
	'bg_sidon': 'sidon_port.png',
	'bg_epigrama': 'epigrama_sidon.png',
	'bg_sinai': 'sinai_mountain.png',
	'bg_sinai_caverna': 'sinai_caverna.png',
	'bg_sinai_revelacion': 'sinai_cave_revelation.png',

	'bg_patagonia_glaciar': 'patagonia_glaciar.png',
	'camara_secreta': 'camara_secreta.png',
	'bg_camara_subterranea': 'camara_subterranea.png',
	'bg_historia_luz': 'bg_historia_luz.png',
	'bg_pedestal_luz': 'pedestal_luz.png',
	'bg_pedestal_rutas': 'pedestal_rutas.png',
	'bg_artefacto_luz_glow': 'artefacto_luz_glow.png',
	'bg_cueva_salida': 'cueva_salida.png',
	'bg_patagonia_amanecer': 'patagonia_amanecer.png'
});

/* Descripciones de los hotspots */
const hotspotInfo = {
    'puerta-hotspot': 'Un portón antiguo. Parece cerrado.',
    'camino1-hotspot': 'Un camino hacia el bosque.',
    'camino2-hotspot': 'Un sendero rocoso que se pierde entre las piedras.',
    'camino3-hotspot': 'Un camino hacia la cueva.',
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
	'lupa_filologo': 'Una lupa de filología que permite observar detalles finos en los textos antiguos.'
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

/* Animación: el ícono "vuela" hacia un destino (ej. un hotspot) */
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
    flying.style.left = `${startRect.left}px`;
    flying.style.top = `${startRect.top}px`;
    flying.style.width = `${startRect.width}px`;
    flying.style.height = `${startRect.height}px`;
    document.body.appendChild(flying);

    // Forzamos reflow para que el navegador registre la posición inicial
    // antes de aplicar la transición al nuevo transform.
    void flying.offsetWidth;

    const deltaX = (endRect.left + endRect.width / 2) - (startRect.left + startRect.width / 2);
    const deltaY = (endRect.top + endRect.height / 2) - (startRect.top + startRect.height / 2);

    flying.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.4)`;
    flying.style.opacity = '0.2';

    flying.addEventListener('transitionend', () => {
        flying.remove();
        if (onComplete) onComplete();
    }, { once: true });
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
		const hotspot = document.getElementById(item);
		hotspot.style.display = 'block';
		hotspot.style.pointerEvents = 'auto';
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
	const hotspot = document.getElementById(item);
	hotspot.style.display = 'block';
	hotspot.style.pointerEvents = 'auto';
	hotspot.onclick = () => {
		hotspot.style.pointerEvents = 'none';
		monogatari.run('narrator No hay nada interesante aqui para tomar.');
	};
}

function UsarObjeto(item,objeto,salto) {
	const hotspot = document.getElementById(item);
	hotspot.style.display = 'block';
	hotspot.style.pointerEvents = 'auto';
	hotspot.onclick = () => {
		hotspot.style.pointerEvents = 'none';
		if (selectedItem === objeto) {
			hideHotspot(item);
			stopIconFollow();
			monogatari.run(salto);
		} else {
			monogatari.run('narrator No pasó nada. Debes utilizar un objeto.');
		}
	};
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
/////////////////////////////////////////////
        'jump Escena29_Ruinas',
///////////////////////////////////////////
        'show scene bg_museo_dia',
        'narrator Bienvenido al Museo.',
        'narrator Vamos a comenzar tu aventura.',
        'descubres un libro interesante',
        () => addItem('libro'),
        'dentro hay un mapa de un templo',
        () => addItem('mapa'),
        'jump Bosque'
    ],

    'Bosque': [
        'show scene bg_bosque_dia',
        'narrator Caminas por el bosque.',
        'narrator Encuentras una llave antigua.',
        //() => { tieneLlave = true; },
        () => addItem('llave_antigua'),
        'narrator La llave se agregó al inventario.',
        'jump Templo'
    ],

    'Templo': [
        'show scene bg_templo_cerrado',

        () => {
            const hotspot = document.getElementById('puerta-hotspot');
            hotspot.style.display = 'block';
            hotspot.style.pointerEvents = 'auto';
            //hotspot.style.zIndex = '999999';
            hotspot.onclick = () => {
                hotspot.style.pointerEvents = 'none';
                //flyItemTo(selectedItem, hotspot);
                //if (tieneLlave) {
                if (selectedItem === 'llave_antigua') {
                    monogatari.run('jump Templo_Abierto');
                } else {
                    monogatari.run('narrator El portón está cerrado. Necesitas una llave.');
                }
            };
        },

        () => {
            const hotspot = document.getElementById('grieta');
            hotspot.style.display = 'block';
            hotspot.onclick = () => {
                if (!hasItem('cantaro')) {
                    monogatari.run('narrator Encuentras una cantaro antiguo.');
                    addItem('cantaro');
                } else {
                    monogatari.run('narrator No hay nada interesante aqui.');
                }
            };
        },
        'narrator Llegas al templo. La puerta está cerrada.'
    ],

    'Templo_Abierto': [
        () => hideHotspot('puerta-hotspot'),
        () => hideHotspot('grieta'),
        () => stopIconFollow(),
        () => removeItem('llave_antigua'),
        'show scene bg_templo_abierto',
        'narrator Usas la llave y el portón se abre.',
        // ❗ aquí NO hacemos jump inmediato
        'narrator Ahora puedes entrar al templo.',
        'jump Templo_Interior'
    ],

    'Templo_Interior': [
        'show scene bg_templo_interior',
        'narrator Entras al templo interior.',
        'narrator Fin de la demostración.'
    ],

/* =====================================================
   CAPÍTULO 1 — EL ORIGEN OCULTO (ESCENAS 1–12)
   Versión ampliada — Listo para pegar en script.js
===================================================== */

'Capitulo1': [
  'jump Escena1_QuintaNormal'
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
		() => hideHotspot('idolo'),
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
		() => {
			if (!hasItem('escritura_antigua')) {	
				monogatari.run('jump Escena4_LabEscaneo')
			} else {
				monogatari.run('jump Escena11_DecisionEstrategica')	
			}
		}		
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
	// ESCENA 5 — Carretera Austral / Ruta 7, Aysén (Patagonia Chile)
	// -------------------------------------------------------------------------
	'Escena5_Patagonia': [
		'show scene ruta7 with fadeIn',
	
		//'show character gabriel serio at left with fadeIn',
		//'show character erik alerta at right with fadeIn',

		'La Carretera Austral serpentina entre montañas colosales cubiertas de nieve.',
		'El viento patagónico ruge contra el vehículo de expedición mentre la lluvia helada golpea el parabrisas.',
		'erik (Sujetando firmemente el volante del jeep modificado mientras las ruedas giran sobre el barro helado) La tormenta se está cerrando rápido, doctor. En Aysén el clima no perdona los errores de cálculo. Si nos quedamos atrapados en esta quebrada antes del anochecer, la temperatura bajará a diez bajo cero.',
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
		() => monogatari.distractionFree(),
		'race ruta7Race',
		() => monogatari.distractionFree(),
		() => { 
			if (!monogatari.storage('player').ruta7Race) { monogatari.storage('player').ruta7Race = true; }
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

		'show character isidora sorprendida at right shake infinite',
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
		'[INVENTARIO USADO]: Bisturí Térmico de Campo.',
		'[EFECTO]: Abre el estuche intacto, permitiendo extraer el manuscrito sin que la fibra vegetal se desintegre.',
		() => addItem('coordenadas_antiguas'),

 		'play sound wind-echo',

    	'isidora Este pergamino... son coordenadas. Tres ubicaciones marcadas con runas.',
		'isidora Si logro descifrarlas, sabré hacia dónde viajar después de esto.',

		// Pausa la historia, muestra el rompecabezas a pantalla completa.
		// El guion continúa automáticamente en cuanto se resuelven las tres coordenadas.



		() => monogatari.distractionFree(),
		'puzzle cityPuzzle',
		() => monogatari.distractionFree(),
		// Ejemplo: guardar que el acertijo fue resuelto, útil para condicionar
		// diálogos o el mapa de viaje más adelante.
		() => { 
			if (!monogatari.storage('player').cifradoTresCiudades) { monogatari.storage('player').cifradoTresCiudades = true; }
		},
		'show character isidora analitica at right with fadeIn',
		'isidora Alejandría... Halicarnaso... Babilonia. Ya sé qué camino seguir.',
		'show character tomas entusiasmado at left with fadeIn',
		'tomas (Sosteniendo un mapa con las coordenadas descifradas) ¡Profesor! El pergamino despliega tres conjuntos de coordenadas primarias en el Mediterráneo y el Norte de África.',
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
		'CAPITULO 2 - "EL ECO DEL MEDITERRANEO"',
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

		() => monogatari.distractionFree(),
		'epigrama epigramaPuzzle',
		() => monogatari.distractionFree(),
		() => { 
			if (!monogatari.storage('player').epigramaAntipatro) { monogatari.storage('player').epigramaAntipatro = true; }
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
		() => hideHotspot('inscripciones'),
		() => hideHotspot('pantano'),
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
		'Alejandría es una mezcla de modernidad y ruinas antiguas. El Faro ya no existe, pero sus cimientos permanecen bajo el agua. Omar al-Hassan, egiptólogo, guardián de archivos del Faro.',
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
		'omar Exactamente. Y debemos proteger estos pergaminos antes de que la tormenta los arruine.',
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
	// ESCENA 27 - Minijuego Acción: Tormenta en Alejandría
	// -------------------------------------------------------------
	'Escena27': [
		'[MINIJEUEGO ACCIÓN: TORMENTA EN ALEJANDRÍA]',
		'Una tormenta inunda el archivo. El jugador debe proteger los pergaminos y escapar.',

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

		'show character layla normal at center with fadeIn',
		'layla Bienvenidos a Babilonia. Aquí, cada piedra tiene una historia... y cada silencio, un secreto.',

		'show character gabriel talk at left with fadeIn',
		'gabriel Buscamos símbolos helenísticos. Algo que conecte este lugar con la «octava luz».',

		'layla Entonces deben ver esto.',
		'show scene bg_hallazgo_babilonico with fadeIn',
		'Layla guía al equipo hacia una estructura derruida.',
		'layla Los Jardines no desaparecieron por el tiempo. Hay registros de una intervención humana... cristiana.',

		'show character isidora sorprendida at right with fadeIn',
		'isidora ¿Cristiana? ¿Aquí?',
		'layla Sí. Los primeros cristianos destruyeron símbolos que consideraban idolátricos.',
		'jump Escena29_Ruinas'
	],
 
		'Escena29_Ruinas': [
		'show scene bg_hallazgo_babilonico with fadeIn',
		'El jugador decide examinar los restos del palacio. Esto activa un hallazgo crucial.',
		() => VerObjeto('bajorelieve_babilonico1'),
		() => VerObjeto('bajorelieve_babilonico2'),
		() => VerObjeto('bajorelieve_babilonico_destruido'),
		() => TomarObjeto('pincel_arqueologico'),
		() => TomarObjeto('lupa_filologo'),
		() => UsarObjeto('muro1','pincel_arqueologico','Analizas los surcos en la piedra: la técnica revela golpes sistemáticos orientados a borrar rostros paganos.'),
		() => UsarObjeto('muro2','pincel_arqueologico','Analizas los surcos en la piedra: la técnica revela golpes sistemáticos orientados a borrar rostros paganos.'),
		() => UsarObjeto('simbolo_babilonico','lupa_filologo','jump Escena30_ObjetoOcultoBabilonia'),
		() => TomarObjeto('simbolo_babilonico'),
		'narrator Necesitas revisar el lugar en busca de una pista.'
	],

/*		
		'[ACCIÓN DE INVENTARIO] Usas la Criba Arqueológica de Pincel Fino para remover el polvo de arcilla y los escombros de la mampostería.',

		{
			'Choice': {
				'Dialog': '¿Cómo procede el jugador ante la sugerencia de la destrucción cristiana primitiva?',
				'Opcion_Relieves': {
					'Text': 'Examinar detenidamente los bajorrelieves del muro destruido en busca de marcas de cincel ideológicas.',
					'Do': 'jump Escena29_Relieves'
				},
				'Opcion_Interrogar': {
					'Text': 'Interrogar a Layla Nasser sobre los catálogos y registros locales de intervención paleocristiana.',
					'Do': 'jump Escena29_Interrogar'
				},
				'Opcion_Georradar': {
					'Text': 'Escanear la densidad de los cimientos con el sensor georradar de mano.',
					'Do': 'jump Escena29_Georradar'
				}
			}
		}
	],
*/
	'Escena29_Relieves': [
		'Analizas los surcos en la piedra: la técnica revela golpes sistemáticos orientados a borrar rostros paganos.',
		'show storage decision_29 1',
		'jump Escena30_ObjetoOcultoBabilonia'
	],

	'Escena29_Interrogar': [
		'layla Los registros sugieren obispos del siglo IV actuando por decreto en zonas helenizadas.',
		'show storage decision_29 2',
		'jump Escena30_ObjetoOcultoBabilonia'
	],

	'Escena29_Georradar': [
		'El georradar detecta una oquedad oculta tras un bloque fracturado por impacto manual.',
		'show storage decision_29 3',
		'jump Escena30_ObjetoOcultoBabilonia'
	],

	// -------------------------------------------------------------
	// ESCENA 30: Objeto oculto - Sello babilónico con cruz cristiana
	// -------------------------------------------------------------
	'Escena30_ObjetoOcultoBabilonia': [
		'show scene bg_hallazgo_babilonico with fadeIn',
		'Entre los restos del palacio, el jugador encuentra un sello de arcilla:',
		'• Símbolo babilónico de fertilidad',
		'• Superpuesto: una cruz cristiana primitiva',
		'• Inscripción en griego arcaico: φῶς νότου («luz del sur»)',

		'[ACCIÓN DE INVENTARIO] Aplicas la Lupa de luz UV de 365nm sobre la superficie de arcilla.',
		'[EFECTO]: Revela trazos de pigmento vegetal oculto que confirman la datación del grabado de la cruz en el siglo IV d.C.',

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
					'Do': 'jump Escena30_Guardar'
				},
				'Opcion_Digitalizar': {
					'Text': 'Fotografiar y digitalizar la inscripción griega en 3D para enviarla al archivo de la USACH.',
					'Do': 'jump Escena30_Digitalizar'
				},
				'Opcion_Debatir': {
					'Text': 'Debatir de inmediato la conexión entre los viajes paleocristianos y la Patagonia con Tomás y Gabriel.',
					'Do': 'jump Escena30_Debatir'
				}
			}
		}
	],

	'Escena30_Guardar': [
		'Sellas la muestra con nitrógeno gaseoso para evitar el deterioro de la arcilla.',
		'show storage decision_30 1',
		'jump Escena31_PuzzleJardin'
	],

	'Escena30_Digitalizar': [
		'El escáner 3D genera una nube de puntos precisa de la incripción φῶς νότου.',
		'show storage decision_30 2',
		'jump Escena31_PuzzleJardin'
	],

	'Escena30_Debatir': [
		'gabriel El vínculo se vuelve irrefutable; la doctrina se expandió llevando la referencia del extremo sur.',
		'show storage decision_30 3',
		'jump Escena31_PuzzleJardin'
	],

	// -------------------------------------------------------------
	// ESCENA 31: Minijuego Puzzle - Reconstrucción del Jardín
	// -------------------------------------------------------------
	'Escena31_PuzzleJardin': [
		'show scene bg_hallazgo_babilonico with fadeIn',
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

		'show character gabriel talk at center with fadeIn',
		'gabriel El símbolo está en todas partes. Es un mapa. Un mapa hacia la octava luz.',

		{
			'Choice': {
				'Dialog': '¿Qué hacer tras completar la reconstrucción digital del patrón?',
				'Opcion_Overlay': {
					'Text': 'Superponer el mapa helenístico reconstruido sobre un plano cartográfico satelital moderno.',
					'Do': 'jump Escena31_Overlay'
				},
				'Opcion_Frecuencia': {
					'Text': 'Aislar la frecuencia geométrica del símbolo helenístico para buscar patrones idénticos.',
					'Do': 'jump Escena31_Frecuencia'
				},
				'Opcion_Imprimir': {
					'Text': 'Imprimir una réplica táctil del friso reconstruido con la impresora portátil 3D.',
					'Do': 'jump Escena31_Imprimir'
				}
			}
		}
	],

	'Escena31_Overlay': [
		'Las líneas transversales cruzan directamente sobre puntos estratégicos del Mediterráneo y el Vaticano.',
		'show storage decision_31 1',
		'jump Escena32_Vaticano'
	],

	'Escena31_Frecuencia': [
		'El algoritmo detecta coincidencias directas en la arquitectura sacra del siglo IV en Roma.',
		'show storage decision_31 2',
		'jump Escena32_Vaticano'
	],

	'Escena31_Imprimir': [
		'Obtienes un bajorrelieve físico que servirá como llave comparativa en el Vaticano.',
		'show storage decision_31 3',
		'jump Escena32_Vaticano'
	],

	// -------------------------------------------------------------
	// ESCENA 32: Ciudad del Vaticano, Italia
	// -------------------------------------------------------------
	'Escena32_Vaticano': [
		'show scene bg_vaticano with fadeIn',
		'El Vaticano es un laberinto de mármol, silencio y secretos.',
		'Los pasillos parecen observar a quienes los recorren.',
		'Aquí, la historia fue escrita... y también borrada.',
		() => monogatari.distractionFree(),
		'laberinto vaticanoMaze',
		() => monogatari.distractionFree(),
		() => { 
			if (!monogatari.storage('player').laberintoVaticano) { monogatari.storage('player').laberintoVaticano = true; }
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
		'jump Escena33_DocumentosVaticano'
	],

	'Escena32_Decretos': [
		'marcus Conocen bien la patrística... Muy bien, verán los registros de la ejecución de esos decretos.',
		'show storage decision_32 2',
		'jump Escena33_DocumentosVaticano'
	],

	'Escena32_Diplomacia': [
		'marcus Sus credenciales son válidas, aunque la verdad que solicitan pesa más que cualquier título.',
		'show storage decision_32 3',
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
		'show scene bg_manuscrito with fadeIn',
		'El manuscrito menciona:',
		'• «Las montañas del fin del mundo»',
		'• «Guardianes del sur»',
		'• «La octava luz»',

		'[ACCIÓN DE INVENTARIO] Te colocas los Guantes Químicamente Neutros de Nitrilo para desplegar el documento sin degradarlo.',
		'[EFECTO]: Permite la apertura del folio pergaminado de casi dos milenios sin causar daño destructivo.',

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

		'show character gabriel talk at left with fadeIn',
		'gabriel ¿Los libros perdidos?',

		'layla Fragmentos. Pero suficientes para entender su contenido.',

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
		'jump Escena37_Sidon'
	],

	'Escena36_Bloquear': [
		'Ganas valiosos minutos mientras los agresores intentan despejar la entrada.',
		'show storage decision_36 2',
		'jump Escena37_Sidon'
	],

	'Escena36_Subterrano': [
		'El paso subterráneo los conduce de forma segura hacia el vehículo de evacuación.',
		'show storage decision_36 3',
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
		'Ese lugar es el Monte Sinaí.',

		{
			'Choice': {
				'Dialog': '¿Qué enfoque tomar en la investigación de campo en Sidón?',
				'Opcion_Lirica': {
					'Text': 'Analizar la lírica de los epigramas de Antípatro buscando claves criptográficas.',
					'Do': 'jump Escena37_Lirica'
				},
				'Opcion_Estructura': {
					'Text': 'Examinar la estructura arquitectónica de las ruinas costeras en búsqueda de marcas náuticas.',
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

	// -------------------------------------------------------------
	// ESCENA 38: Objeto oculto - Epigrama original
	// -------------------------------------------------------------
	'Escena38_EpigramaOriginal': [
		//'show scene bg_epigrama with fadeIn',
		'show scene bg_sidon with fadeIn',
		'El epigrama menciona:',
		'«La octava luz guía a las siete desde el sur del mundo.»',

		'[ACCIÓN DE INVENTARIO] Aplicas una gota de Reactivo Ácido Neutro para limpiar la caliza del epigrama.',
		'[EFECTO]: Limpia las incrustaciones salinas sin erosionar las tallas en piedra.',

		'show character isidora thought at center with fadeIn',
		'isidora Antípatro sabía de Chile. O sabía de quienes llegaron a Chile.',

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

		'show character tomas talk at right with fadeIn',
		'tomas ¿Y por qué en Chile?',

		'[ACCIÓN DE INVENTARIO] Usas el Altimétro Barométrico y GPS Táctico para ubicar la cueva de la meseta superior descrita en las crónicas.',
		'show scene bg_sinai_caverna with fadeIn',
		'[EFECTO]: Localiza la entrada oculta de la gruta de los concilios primigenios.',

		{
			'Choice': {
				'Dialog': '¿Qué hacer al alcanzar la meseta histórica del Monte Sinaí?',
				'Opcion_Termico': {
					'Text': 'Iniciar el escaneo térmico de las paredes de la gruta en busca de cámaras selladas.',
					'Do': 'jump Escena39_Termico'
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

	'Escena39_Termico': [
		
		'El escáner detecta una pared falsa erigida con mortero antiguo.',
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

		'show character tomas talk at right with fadeIn',
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


/* ============================================================
   ESCENA 41 — Regreso a la Patagonia (Glaciar O’Higgins)
   ============================================================ */

    'Capitulo4': [
		'jump Escena41'
	],

'Escena41': [

    'show scene bg_patagonia_glaciar with fadeIn duration 3s',
    'narrator El avión desciende sobre la Patagonia como si atravesara un velo de silencio.',
    'narrator Las montañas se alzan como gigantes dormidos, cubiertas por un manto blanco que parece respirar.',
    'narrator El glaciar O’Higgins brilla con un azul imposible, como si guardara secretos bajo su hielo.',
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
    'narrator En la entrada de la cueva, el equipo encuentra un altar circular con ranuras.',
    'narrator Cada ranura coincide con uno de los 10 objetos clave obtenidos en los 10 países.',

    /* Mostrar objetos */
    'narrator Piedra de Ngenechén, fragmento de marfil, miniatura de la cuadriga...',
    'narrator Sello babilónico, pergamino del Faro, manuscrito del siglo IV...',
    'narrator Fragmento de Diodoro, epigrama de Antípatro, inscripción de Éfeso...',
    'narrator Y el símbolo del Coloso reconstruido.',

    /* Interacción con altar */
	'show scene altar with fadeIn',
    'narrator El altar espera ser activado.',

    {
        'Choice': {
            'orden_historico': {
                'Text': 'Colocar los objetos según orden histórico.',
                'Do': 'jump Escena42_Historico'
            },
            'orden_geografico': {
                'Text': 'Colocar los objetos según orden geográfico.',
                'Do': 'jump Escena42_Geografico'
            },
            'intuicion': {
                'Text': 'Colocar los objetos según intuición.',
                'Do': 'jump Escena42_Intuicion'
            }
        }
    }
],

'Escena42_Historico': [
    'narrator El altar se ilumina con una luz azul.',
    'narrator La cueva se abre lentamente.',
    'jump Escena43'
],

'Escena42_Geografico': [
    'narrator Una luz roja ilumina un mural oculto.',
    'narrator El mecanismo se activa.',
    'jump Escena43'
],

'Escena42_Intuicion': [
    'isidora A veces la intuición es más poderosa que la lógica.',
    'narrator Una luz blanca envuelve el altar.',
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
   ESCENA 45 — Minijuego Acción: Derrumbe final
   ============================================================ */

	'Escena45': [

	'show scene bg_camara_subterranea with fadeIn duration 3s',
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

    /* Minijuego: acción */
    'narrator Debes decidir cómo actuar mientras el derrumbe avanza.',

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


/* ============================================================
   ESCENA 46 — Tesoro final: El Artefacto de la Luz
   ============================================================ */

'Escena46': [

    'show scene bg_pedestal_luz with fadeIn',
    'narrator Tras escapar del derrumbe, el equipo llega a una cámara secundaria.',
    'narrator En el centro, un pedestal iluminado por una luz suave revela un artefacto.',
    'narrator El objeto parece vibrar con energía propia.',

    'narrator Material: una aleación desconocida, imposible de clasificar.',
    'narrator Forma: un disco con símbolos mapuches y helenísticos entrelazados.',
	'show scene bg_pedestal_rutas with fadeIn duration 3s',
    'narrator Función: proyecta un mapa tridimensional del mundo antiguo.',
    'narrator Revelación: muestra rutas de viaje desde Alejandría hacia la Patagonia.',

    'show character gabriel normal at left',
    'gabriel Este artefacto... es la clave.',
    'gabriel La prueba de que las maravillas fueron construidas siguiendo un patrón.',
    'gabriel Un patrón basado en esta estructura.',

    /* Interacción con el artefacto */
    'narrator El disco emite un leve pulso cuando lo tocas.',
    () => addItem('artefacto_luz'),
    'narrator El Artefacto de la Luz ha sido añadido al inventario.',

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

    'show scene bg_camara_subterranea with fadeIn duration 3s',

    'narrator El equipo se reúne fuera de la cámara, aún con el eco del derrumbe resonando en sus oídos.',
    'narrator La luz del artefacto ilumina sus rostros, revelando una mezcla de asombro y temor.',

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
	'show scene bg_camara_subterranea with fadeIn duration 3s',
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
    'jump Escena49'
],

'Escena48_Dudar': [
    'tomas ¿Y si el artefacto está dañado? ¿O si interpreta mal la información?',
    'isidora No. La precisión geométrica es perfecta. Esto no es un error.',
    'jump Escena49'
],

'Escena48_Viajar': [
    'gabriel No podemos esperar. Si hay otra estructura, debemos llegar antes de que alguien más lo haga.',
    'isidora ¿Estás diciendo que no somos los únicos que podrían estar buscando esto?',
    'gabriel Exactamente.',
    'jump Escena49'
],


/* ============================================================
   ESCENA 49 — Cliffhanger
   ============================================================ */

'Escena49': [
	
    'show scene bg_cueva_salida with fadeIn duration 3s',
    'narrator El artefacto proyecta una coordenada exacta en la Antártida.',
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
    'end'
],

'FinCapitulo4_Cuestionar': [
    'gabriel ¿Estamos preparados para lo que viene?',
    'narrator La duda se mezcla con esperanza.',
    'end'
],

'FinCapitulo4_Reflexion': [
    'narrator Cierras los ojos y respiras el aire frío de la Patagonia.',
    'narrator Sabes que tu vida cambió para siempre.',
    'end'
]

});