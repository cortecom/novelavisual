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

    'show scene bg_camara_subterranea with fadeIn duration 3s',
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

    'derrumbe derrumbeFinal',

    // El componente ya dejó dos banderas en monogatari.storage():
    //   - derrumbeMuroIntacto   → true si la Etapa 1 se completó sin
    //     recibir ningún golpe (equivalente a la vieja rama "Proteger").
    //   - derrumbeIsidoraSalvada → true siempre que se llega a este
    //     punto (la Etapa 2 es obligatoria: no hay forma de avanzar sin
    //     rescatar a Isidora).
    () => {
        if (monogatari.storage().derrumbeMuroIntacto) {
            addItem('mural_intacto');
        }
    },
    () => addItem('relacion_isidora_mejorada'),

    'narrator El polvo se asienta. Isidora, a salvo, mira hacia atrás.',
    'show character isidora normal at center',
    'isidora Gracias por no dejarme atrás.',

    'narrator Ante ustedes, la cámara oculta que el propio derrumbe acaba de revelar.',

    'jump Escena46'
],
