/* global monogatari */


// Agregar un objeto
function addItem(item) {
    const inv = monogatari.storage('player').inventory;
    if (!inv.includes(item)) {
        inv.push(item);
        monogatari.storage('player').inventory = inv;
		updateInventoryIcons();
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
const itemIcons = {
    'llave_antigua': 'assets/icons/llave_antigua.png',
    'mapa': 'assets/icons/mapa.png',
    'libro': 'assets/icons/libro.png'
};

/* Objeto actualmente seleccionado */
let selectedItem = null;

/* Actualizar barra de inventario con íconos */
function updateInventoryIcons() {
    const inv = monogatari.storage('player').inventory;
    const list = document.getElementById('inventory-icons');
    list.innerHTML = '';

    inv.forEach(item => {
        const li = document.createElement('li');
        const img = document.createElement('img');

        img.src = itemIcons[item] || 'assets/icons/default.png';
        img.alt = item;

        li.appendChild(img);

        li.onclick = () => {
            selectedItem = item;
            document.querySelectorAll('#inventory-icons li')
                .forEach(el => el.classList.remove('selected'));
            li.classList.add('selected');
        };

        list.appendChild(li);
    });
}

/* Mostrar barra de inventario */
function showInventoryBar() {
    document.getElementById('inventory-bar').classList.remove('hidden');
    updateInventoryIcons();
}

/* Ocultar barra de inventario */
function hideInventoryBar() {
    document.getElementById('inventory-bar').classList.add('hidden');
}

function selectItem(item) {
    const current = monogatari.storage('player').selectedItem;

    if (current === item) {
        monogatari.storage('player').selectedItem = null;
        monogatari.storage('player').llave_seleccionada = false;
    } else {
        monogatari.storage('player').selectedItem = item;
        monogatari.storage('player').llave_seleccionada = (item === "llave_antigua");
    }
}


/* -----------------------------------------
   CONTROL DE HOTSPOT DE PUERTA
----------------------------------------- */
function showDoorHotspot() {
    const hotspot = document.getElementById('puerta-hotspot');
    hotspot.style.display = "block";
    hotspot.style.pointerEvents = "auto";
}

function hideDoorHotspot() {
    const hotspot = document.getElementById('puerta-hotspot');
    hotspot.style.display = "none";
    hotspot.style.pointerEvents = "none";
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

});

// Define the videos used in the game.
monogatari.assets ('videos', {

});

// Define the images used in the game.
monogatari.assets ('images', {
	'img_mapa': 'Copilot_20260708_172541.png',

});

// Define the backgrounds for each scene.
monogatari.assets ('scenes', {
	'bg_museo_dia': 'Copilot_20260707_164951.png',
	'bg_templo_dia': 'templo.png'
});

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
    }
});

monogatari.script ({
	// The game starts here.

	'Start': [


        /* -------------------------------
           START — INICIO REAL DEL JUEGO
        -------------------------------- */
           () => hideDoorHotspot(),
        () => hideInventoryBar(),
            'show scene bg_museo_dia',
            'narrator Bienvenido al Museo.',
            'narrator Vamos a comenzar tu aventura.',
            'jump Bosque'
],      


  

/*

		'show scene #f7f6f6 with fadeIn',
		'narrator Hola! Bienvenido a Monogatari!',


 		'jump Escena',   



		'y Agregar dialogos es simple',
		'y Vamos a agregar un amigo',
		'e:alegre Encantado de Conocerte!',
		'show scene bg_museo_dia with fadeIn duration 20s',
		'hide textbox',
        'wait 2000',
		'show textbox',
		'Bienvenido al Museo!',

		'show image img_mapa at right with bounceIn duration 2s',


		'show character e normal at left with slideInLeft',
	
		'e:normal ¡Hola! Estoy en la izquierda.',

		'nvl {shake}The rain continued to fall.{/shake}',
		'nvl {shake}I stood there, watching the droplets hit the window.{/shake}',
		'nvl {shake}Each one seemed to carry a memory with it.{/shake}',

		'centered {mysterious}Este es un momento dramático{/mysterious}',

		'e:alegre:highlight Hello!',           // Single class
		'e:triste:warning|urgent Important!',    // Multiple classes (pipe-separated)
		'narrator::thought A quiet thought',  // No expression, just class
		'centered::dramatic A revelation!', 		

		'y I need a moment to think...',
		'clear',
		'wait 2000',
		'y Okay, I have decided!',
		'y Hello...{pause:2000} Are you there?',

		'y {speed:100}This is normal speed. {speed:50}This is slower. {speed:200}This is faster!',	
		//El {speed:N} marcador cambia de velocidad en porcentaje (100 = normal, 50 = media velocidad, 200 = doble velocidad).
		'show character e normal with move transition 6s',
		'e Mueve suavemente un personaje de una posición a otra. El personaje se moverá de izquierda a derecha durante 6 segundos!',



		'show character e normal',
		'e:triste Hola!',
		'show character e normal with fadeIn',
		'e Mostrar un personaje con una animación',
		'show character e normal at left with fadeIn',
        'e Estoy a la izquierda!',
        'show character e normal at center with move transition 6s',
        'e Estoy en el centro!',
		'show character e normal with pulse infinite',
		'e Crear un bucle de animación continuo!',
		
		
		'show character e normal with fadeIn duration 6s',
		'e Controla cuánto tiempo tarda en completarse una animación!',

		'show character e normal at left',
		'show character e normal at right with move transition 6s',
		'e Mueve suavemente un personaje de una posición a otra. El personaje se moverá de izquierda a derecha durante 6 segundos!',

        'show character e normal',
		'e Estoy en el centro!',
        'show character e hablar',
        'e Ahora quiero conversar',
		'show character e normal',
        'hide character e normal at left with slideOutLeft',
		'e Adios!',
		'show notification Welcome',
		{
			'Input': {
				'Text': 'What is your name?',
				'Validation': function (input) {
					return input.trim ().length > 0;
				},
				'Save': function (input) {
					this.storage ({
						player: {
							name: input
						}
					});
					return true;
				},
				'Revert': function () {
					this.storage ({
						player: {
							name: ''
						}
					});
				},
				'Warning': 'You must enter a name!'
			}
		},
		'y Hi {{player.name}} Welcome to Monogatari!',
		{
			'Choice': {
    			'Dialog': 'You have 10 seconds to decide.',
    			'Timer': {
        			time: 10000,
        			callback: () => {
						const choices = monogatari.element().find('[data-choice]:not([disabled])');
						const random = choices.get(Math.floor(Math.random() * choices.length));
						random.click();
						return Promise.resolve();
        			}
    			},
				'Yes': {
					'Text': 'Accept the deal',
					'Do': 'jump Yes'
				},
				'No': {
					'Text': 'Decline',
					'Do': 'jump No'
				}
			}
		}
	],

	'Yes': [
		'y Thats awesome!',
		'y Then you are ready to go ahead and create an amazing Game!',
		'y I can’t wait to see what story you’ll tell!',
		'end'
	],

	'No': [

		'y You can do it now.',
		'show message Help',
		'y Go ahead and create an amazing Game!',
		'y I can’t wait to see what story you’ll tell!',
		'end'
	],
	*/

     /* -------------------------------
       BOSQUE — OBTIENES LA LLAVE
    -------------------------------- */
    "Bosque": [
        "show scene bg_museo_dia",
        "narrator Caminas por el bosque cercano al museo.",
        "narrator Encuentras una llave antigua en el suelo.",

        () => addItem('llave_antigua'),

        "narrator La llave ha sido añadida a tu inventario.",
        () => showInventoryBar(),
        "jump Templo"
    ],

    /* -------------------------------
       TEMPLO — LLEGAS A LA PUERTA
    -------------------------------- */
    "Templo": [
        "show scene bg_templo_dia",
        "narrator Llegas al templo. La puerta está cerrada.",
        "jump Escena"
    ],

    /* -------------------------------
       ESCENA — PUERTA CON HOTSPOT
    -------------------------------- */
"Escena": [

    () => showDoorHotspot(),
    () => showInventoryBar(),

    "show scene bg_templo_dia",

    // ACTIVAR HOTSPOT
    () => {
        const hotspot = document.getElementById('puerta-hotspot');
        hotspot.style.display = "block";
        hotspot.style.pointerEvents = "auto";
        hotspot.style.zIndex = "999999";
    },

    // ACTIVAR CLICKABLE ANTES DE CUALQUIER TEXTO
    {
        "Clickable": {
            "Selector": "#puerta-hotspot",
            "OnClick": ["jump IntentarAbrirPuerta"]
        }
    },

    // TEXTO DESPUÉS
    "narrator El portón está cerrado. Necesitas una llave."
],


    /* -------------------------------
       INTENTAR ABRIR PUERTA
    -------------------------------- */
    "IntentarAbrirPuerta": [




        {
            "Conditional": {
                "Condition": "player.llave_seleccionada",   // 🔥 AHORA FUNCIONA
                "True": "jump PuertaAbierta",

                "False": [
                    "narrator Necesitas seleccionar la llave antes de hacer clic en la puerta.",

                ]
            }
        }
    ],

    /* -------------------------------
       PUERTA ABIERTA — FINAL
    -------------------------------- */
    "PuertaAbierta": [

        () => hideDoorHotspot(),

    // 🔥 REACTIVA EL TEXTBOX
    () => {
        const textbox = document.querySelector("text-box");
        textbox.style.pointerEvents = "auto";
    },



        "narrator Usas la llave antigua y el portón se abre.",

        () => {
            removeItem('llave_antigua');
            monogatari.storage('player').selectedItem = null;
            monogatari.storage('player').llave_seleccionada = false;
            updateInventoryIcons();
        },

        "show scene bg_templo_interior",
        "narrator Entras al templo interior.",
        "narrator Fin de la demostración."
    ]

});