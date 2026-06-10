// ==========================================
// CONFIGURACIÓN Y BANCO DE DATOS DEL SIMULADOR
// ==========================================
const SIMULADOR_CONFIG = {
    intervaloMinimoMs: 5000,   // Tiempo mínimo entre eventos (5 segundos)
    intervaloMaximoMs: 15000,  // Tiempo máximo entre eventos (15 segundos)
    duracionNotificacionMs: 4500, // Cuánto tiempo se queda visible el aviso en pantalla
    contenedorId: "live-activity-toast-container" // ID del div flotante en tu HTML
};

const SIMULADOR_DATOS = {
    nombres: [
        "Paula", "Alejandro", "Mateo", "Valentina", "Thiago", "Camila", "Santiago", "Sofia", "Lucas", 
        "Isabella", "Diego", "Martina", "Nicolás", "Elena", "Gabriel", "Lucía", "Bruno", "Mariana", 
        "Samuel", "Daniela", "Marcos", "Victoria", "Julian", "Ximena", "Adrián", "Andrés", "Sara"
    ],
    paises: [
        { nombre: "Argentina", flag: "🇦🇷" },
        { nombre: "España", flag: "🇪🇸" },
        { nombre: "México", flag: "🇲🇽" },
        { nombre: "Colombia", flag: "🇨🇴" },
        { nombre: "Chile", flag: "🇨🇱" },
        { nombre: "Perú", flag: "🇵🇪" },
        { nombre: "Venezuela", flag: "🇻🇪" },
        { nombre: "Brasil", flag: "🇧🇷" },
        { nombre: "Uruguay", flag: "🇺🇾" },
        { nombre: "Ecuador", flag: "🇪🇨" }
    ],
    // Estructuras de frases realistas. Las etiquetas [NAME], [COUNTRY], [FLAG], [BOT] y [NUM] se reemplazan solas.
    plantillasAccion: [
        { tipo: "individual", texto: "[NAME] de [FLAG] [COUNTRY] inició el bot **[BOT]**." },
        { tipo: "individual", texto: "[NAME] [FLAG] calificó con ⭐ [RATING] al bot **[BOT]**." },
        { tipo: "individual", texto: "[NAME] de [FLAG] [COUNTRY] añadió **[BOT]** a sus favoritos." },
        { tipo: "individual", texto: "[NAME] 🌐 compartió el bot **[BOT]** en sus redes." },
        { tipo: "colectivo", texto: "🔥 [NUM] personas agregaron el bot **[BOT]** a sus favoritos esta semana." },
        { tipo: "colectivo", texto: "🚀 ¡**[BOT]** ha recibido más de [NUM] clics en las últimas 24 horas!" },
        { tipo: "colectivo", texto: "📈 [NUM] usuarios nuevos de [FLAG] [COUNTRY] están usando **[BOT]** hoy." }
    ]
};

// ==========================================
// MOTOR LÓGICO DEL SIMULADOR
// ==========================================
let temporizadorSimulador = null;

function iniciarSimuladorActividad() {
    // Evitamos duplicar bucles si ya está corriendo
    if (temporizadorSimulador) clearTimeout(temporizadorSimulador);
    
    function programarSiguienteEvento() {
        const tiempoAleatorio = Math.floor(Math.random() * (SIMULADOR_CONFIG.intervaloMaximoMs - SIMULADOR_CONFIG.intervaloMinimoMs + 1)) + SIMULADOR_CONFIG.intervaloMinimoMs;
        
        temporizadorSimulador = setTimeout(() => {
            ejecutarSimulacionYMostrar();
            programarSiguienteEvento(); // Bucle infinito aleatorio
        }, tiempoAleatorio);
    }
    
    programarSiguienteEvento();
}

function detenerSimuladorActividad() {
    if (temporizadorSimulador) clearTimeout(temporizadorSimulador);
}

function ejecutarSimulacionYMostrar() {
    const container = document.getElementById(SIMULADOR_CONFIG.contenedorId);
    if (!container) return;

    // 1. Validar que tengamos bots cargados en tu array maestro
    if (!window.DIRECTORIO_BOTS_MAESTRO || window.DIRECTORIO_BOTS_MAESTRO.length === 0) return;

    // 2. Selección aleatoria de variables
    const bot = DIRECTORIO_BOTS_MAESTRO[Math.floor(Math.random() * DIRECTORIO_BOTS_MAESTRO.length)];
    const plantilla = SIMULADOR_DATOS.plantillasAccion[Math.floor(Math.random() * SIMULADOR_DATOS.plantillasAccion.length)];
    const nombre = SIMULADOR_DATOS.nombres[Math.floor(Math.random() * SIMULADOR_DATOS.nombres.length)];
    const pais = SIMULADOR_DATOS.paises[Math.floor(Math.random() * SIMULADOR_DATOS.paises.length)];
    const numeroAleatorio = Math.floor(Math.random() * 24) + 4; // Genera números lógicos entre 4 y 28
    const ratingAleatorio = (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1); // Genera ratings reales entre 4.0 y 5.0

    // 3. Reemplazo dinámico de etiquetas en la plantilla de texto
    let mensajeFinal = plantilla.texto
        .replace("[BOT]", bot.titulo)
        .replace("[NAME]", nombre)
        .replace("[COUNTRY]", pais.nombre)
        .replace("[FLAG]", pais.flag)
        .replace("[NUM]", numeroAleatorio)
        .replace("[RATING]", ratingAleatorio);

    // 4. Creación del elemento Toast HTML flotante
    const toast = document.createElement("div");
    toast.className = "live-activity-toast";
    // Si el bot del evento es Premium, le metemos un sutil borde dorado extra de nivel
    if (bot.isPremium) {
        toast.className += " toast-premium-style";
    }

    toast.innerHTML = `
        <img src="${bot.logo || 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=50'}" alt="Bot Logo" class="toast-avatar">
        <div class="toast-content">
            <p class="toast-text">${mensajeFinal}</p>
            <span class="toast-time">Hace un momento</span>
        </div>
    `;

    // 5. Inyectar al contenedor
    container.appendChild(toast);

    // 6. Ciclo de vida visual por CSS (Entrada suave, espera y salida)
    setTimeout(() => toast.classList.add("visible"), 100);

    // Desvanecer antes de remover
    setTimeout(() => {
        toast.classList.remove("visible");
        setTimeout(() => toast.remove(), 500);
    }, SIMULADOR_CONFIG.duracionNotificacionMs);
}
