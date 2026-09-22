// Escena36_SaqueoSiria — con el minijuego insertado.
// El minijuego reemplaza la resolución automática del incendio: el jugador
// ahora sofoca el fuego, recoge los fragmentos y escapa por sí mismo, en vez
// de que el texto narre el resultado. Se dispara 'saqueo archivoEscape'
// justo después de la línea de [EFECTO] y antes de la TRANSICIÓN REFORZADA,
// que ahora funciona como cierre narrativo posterior al minijuego.

'Escena36_SaqueoSiria': [
    'show scene bg_saqueo_siria with fadeIn',
    '¡Saqueadores atacan el archivo! El jugador debe proteger los fragmentos y escapar.',

    '[ACCIÓN DE INVENTARIO] Accionas un Extintor de Polvo Químico de la pared para sofocar un incendio provocado y crear una cortina de humo.',
    '[EFECTO]: Ciega temporalmente a los atacantes y apaga el fuego cerca de los códices.',

    'saqueo archivoEscape',

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
