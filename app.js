// =========================================================================
// 🗃️ BASE DE DATOS LOCAL MANUALLY MANAGED (EL ARCHIVO DE CONTROL DEL ADMIN)
// =========================================================================
const DIRECTORIO_BOTS_MAESTRO = [
    {
        id: "b_crypto_golden",
        username: "CryptoGolden_bot",
        titulo: "CryptoGolden IA",
        logo: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=150&auto=format&fit=crop&q=60",
        descripcion_corta: "Señales de trading automatizadas analizadas por Inteligencia Artificial.",
        descripcion_larga: "Este bot analiza los mercados de criptomonedas las 24 horas del día mediante modelos avanzados de Machine Learning. Ofrece alertas en tiempo real, gestión de portafolios de inversión y alertas críticas.",
        categorias: ["IA", "Herramientas", "Finanzas"],
        idioma: "Multi-idioma (ES/EN)",
        rating: 4.9,
        isPremium: true,       // 👑 Regla de oro: Top, Neón, Botones Extra
        isVerified: true,      // 🔵 Pago Único: Muestra Check Azul
        ownerId: "12345678",   // ID de Telegram del dueño para su Panel de Control
        url_web: "https://cryptogolden.ia",
        url_soporte: "https://t.me/CryptoSupport"
    },
    {
        id: "b_music_ia",
        username: "SunoSinfoniaBot",
        titulo: "Suno Sinfonía Generador",
        logo: "https://images.unsplash.com/photo-1614680376593-902f74fa0d41?w=150&auto=format&fit=crop&q=60",
        descripcion_corta: "Genera piezas de audio y canciones personalizadas con IA.",
        descripcion_larga: "Escribe una letra o género musical y el bot creará una canción completa con masterización profesional en menos de un minuto. Ideal para creadores de contenido.",
        categorias: ["IA", "Entretenimiento"],
        idioma: "Español",
        rating: 4.5,
        isPremium: false,
        isVerified: true,
        ownerId: "87654321",
        url_web: "",
        url_soporte: ""
    },
    {
        id: "b_telegram_audit",
        username: "GPlusAuditBot",
        titulo: "Audit Express & Optimización",
        logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60",
        descripcion_corta: "Analiza la salud y métricas de retención de tus canales.",
        descripcion_larga: "Herramienta avanzada para administradores. Genera un reporte detallado con la optimización de tu canal: análisis de descripción, rendimiento de enlaces y consejos estéticos.",
        categorias: ["Herramientas"],
        idioma: "Español",
        rating: 4.2,
        isPremium: false,
        isVerified: false, // Básico ordinario
        ownerId: "12345678",
        url_web: "",
        url_soporte: ""
    }
];

// Variables de Control de Estado Global
let currentCategoryFilter = "Todos";
let activeTabGlobal = "catalog";

// =========================================================================
// 🚀 CONEXIÓN EN CALIENTE CON TELEGRAM MINI APP SDK
// =========================================================================
function inicializarDatosTelegram() {
    if (window.Telegram && window.Telegram.WebApp) {
        const webapp = window.Telegram.WebApp;
        webapp.ready();
        webapp.expand(); // Abre la Mini App ocupando toda la pantalla

        // Estilos e integración de colores nativos opcionales
        document.body.style.setProperty('--tg-theme-bg', webapp.backgroundColor);
        
        const user = webapp.initDataUnsafe?.user;
        if (user) {
            // Render de Perfil Real
            const firstLetter = user.first_name ? user.first_name.charAt(0).toUpperCase() : "U";
            document.getElementById("u-avatar").innerText = firstLetter;
            document.getElementById("u-name").innerText = `${user.first_name} ${user.last_name || ""}`;
            document.getElementById("u-id").innerText = `ID: ${user.id}`;
        } else {
            cargarPerfilModoDesarrolloPC();
        }
    } else {
        cargarPerfilModoDesarrolloPC();
    }
}

function cargarPerfilModoDesarrolloPC() {
    document.getElementById("u-name").innerText = "Airdayz Creador";
    document.getElementById("u-id").innerText = "ID: 12345678"; // ID mock para testear tu panel
    document.getElementById("u-avatar").innerText = "A";
}

function obtenerUserIdTelegramActual() {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
        return window.Telegram.WebApp.initDataUnsafe.user.id.toString();
    }
    return "12345678"; // Retorno local para pruebas
}

// =========================================================================
// 🔄 ENRUTADOR DINÁMICO DE PESTAÑAS (switchView)
// =========================================================================
function switchView(viewId) {
    activeTabGlobal = viewId;

    // Cambiar clases de las vistas
    document.querySelectorAll('.app-view').forEach(view => view.classList.remove('active-view'));
    document.querySelectorAll('.nav-item').forEach(tab => tab.classList.remove('active-tab'));

    const activeView = document.getElementById(`view-${viewId}`);
    const activeTab = document.getElementById(`tab-${viewId}`);

    if (activeView) activeView.classList.add('active-view');
    if (activeTab) activeTab.classList.add('active-tab');

    // Control de llamadas de render específicos
    if (viewId === 'catalog') renderizarFiltrosCategorias();
    if (viewId === 'favorites') renderizarVistaFavoritos();
    if (viewId === 'profile') renderizarPanelCreador();

    // Refrescar iconos inyectados en caliente
    if (window.lucide) lucide.createIcons();
}

// =========================================================================
// 🏠 COMPONENTE CATÁLOGO: RENDER, QUERYS Y FILTRADO AGRESIVO
// =========================================================================
function extraerCategoriasUnicas() {
    let cats = ["Todos"];
    DIRECTORIO_BOTS_MAESTRO.forEach(bot => {
        bot.categorias.forEach(c => { if (!cats.includes(c)) cats.push(c); });
    });
    return cats;
}

function renderizarFiltrosCategorias() {
    const container = document.getElementById("categories-container");
    if (!container) return;
    const lista = extraerCategoriasUnicas();

    container.innerHTML = lista.map(cat => `
        <button class="cat-btn ${currentCategoryFilter === cat ? 'active' : ''}" onclick="setCategoryFilter('${cat}')">
            ${cat}
        </button>
    `).join('');
}

function setCategoryFilter(catName) {
    currentCategoryFilter = catName;
    renderizarFiltrosCategorias();
    filtrarCatalogoEnCaliente();
}

// Algoritmo de filtrado por prioridad (Premium Primero)
function obtenerBotsProcesados() {
    return [...DIRECTORIO_BOTS_MAESTRO].sort((a, b) => (b.isPremium ? 1 : 0) - (a.isPremium ? 1 : 0));
}

function reordenarCatalogoPor(criterio) {
    if (criterio === 'rating') {
        DIRECTORIO_BOTS_MAESTRO.sort((a, b) => b.rating - a.rating);
        filtrarCatalogoEnCaliente();
    }
}

function filtrarCatalogoEnCaliente() {
    const query = document.getElementById("main-search")?.value.toLowerCase().trim() || "";
    const grid = document.getElementById("catalog-grid");
    if (!grid) return;

    const listaOrdenada = obtenerBotsProcesados();
    let botsFiltrados = listaOrdenada.filter(bot => {
        const cumpleCategoria = (currentCategoryFilter === "Todos" || bot.categorias.includes(currentCategoryFilter));
        const cumpleQuery = bot.titulo.toLowerCase().includes(query) || 
                            bot.username.toLowerCase().includes(query) || 
                            bot.descripcion_corta.toLowerCase().includes(query);
        return cumpleCategoria && cumpleQuery;
    });

    document.getElementById("counter-results").innerText = `Mostrando ${botsFiltrados.length} bots`;
    grid.innerHTML = botsFiltrados.map(bot => construirHtmlTarjetaBot(bot, 'cat')).join('');
    if (window.lucide) lucide.createIcons();
}

// =========================================================================
// 🧱 FACTORÍA CONSTRUCTORA DE TARJETAS (REGLA DE ORO + ACCORDION)
// =========================================================================
function construirHtmlTarjetaBot(bot, contextoLlamada) {
    const favorites = JSON.parse(localStorage.getItem("gplus_fav_bots")) || [];
    const esFavorito = favorites.includes(bot.id);

    // Renderizado condicional según Check de Verificado e Insignia Premium
    const badgeVerified = bot.isVerified ? `<span class="badge-verified"><i data-lucide="badge-check"></i></span>` : '';
    const badgePremium = bot.isPremium ? `<span class="badge-premium-tag">DESTACADO</span>` : '';
    const premiumClass = bot.isPremium ? 'premium-card' : '';

    // Bloque extra de botones exclusivo para miembros Avanzados Premium
    let botonesPremiumExtendidos = '';
    if (bot.isPremium) {
        botonesPremiumExtendidos = `
            <div class="extended-buttons">
                ${bot.url_web ? `<button class="btn-ext" onclick="event.stopPropagation(); window.open('${bot.url_web}', '_blank')"><i data-lucide="globe"></i> Visitar Web</button>` : ''}
                ${bot.url_soporte ? `<button class="btn-ext" onclick="event.stopPropagation(); window.open('${bot.url_soporte}', '_blank')"><i data-lucide="help-circle"></i> Soporte Ofic.</button>` : ''}
            </div>
        `;
    }

    return `
        <div class="bot-card ${premiumClass}" id="card-${contextoLlamada}-${bot.id}" onclick="conmutarDespliegueTarjeta('${contextoLlamada}-${bot.id}')">
            <div class="bot-card-header">
                <img src="${bot.logo}" class="bot-logo" alt="Logo">
                <div class="bot-info-main">
                    <div class="bot-title-row">
                        <h4 class="bot-title">${bot.titulo}</h4>
                        ${badgeVerified}
                        ${badgePremium}
                    </div>
                    <div class="bot-meta-row">
                        <span class="bot-stars">★ ${bot.rating.toFixed(1)}</span>
                        <span>•</span>
                        <span>${bot.idioma}</span>
                    </div>
                    <p class="bot-desc-short">${bot.descripcion_corta}</p>
                </div>
                <div class="bot-actions-right">
                    <button class="btn-fav-heart ${esFavorito ? 'is-favorite' : ''}" onclick="event.stopPropagation(); alternarEstadoFavorito('${bot.id}')">
                        <i data-lucide="heart"></i>
                    </button>
                    <button class="btn-launch" onclick="event.stopPropagation(); lanzarBotTelegram('${bot.username}')">Iniciar 🚀</button>
                </div>
            </div>
            
            <div class="bot-card-body">
                <div class="bot-body-content">
                    <p style="color: #cbd5e1; font-size: 0.78rem;">${bot.descripcion_larga}</p>
                    <div class="bot-tags-row">
                        ${bot.categorias.map(c => `<span class="tag-pill">#${c}</span>`).join('')}
                        <span class="tag-pill" style="color: var(--cyan);">@${bot.username}</span>
                    </div>
                    ${botonesPremiumExtendidos}
                    <button class="btn-ext" style="border-color: rgba(239,68,68,0.2); color: #f87171;" onclick="event.stopPropagation(); lanzarReporteBot('${bot.username}')">
                        <i data-lucide="alert-triangle"></i> Reportar Mal Funcionamiento o Abuso
                    </button>
                    <div style="text-align: center; margin-top: 4px;">
                        <span style="font-size: 0.7rem; color: var(--cyan); font-weight: 700;" onclick="event.stopPropagation(); dispararAvisoValoracion()">👋 Dejar reseña en @Mundo_Bot</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Control de Acordeón
function conmutarDespliegueTarjeta(cardIdCompleto) {
    const elemento = document.getElementById(`card-${cardIdCompleto}`);
    if (!elemento) return;
    elemento.classList.toggle("is-expanded");
}

function lanzarBotTelegram(username) {
    window.open(`https://t.me/${username}?start=webapp_directory`, '_blank');
}

// =========================================================================
// ❤️ GESTIÓN DE FAVORITOS (PERSISTENCIA TOTAL EN LOCAL STORAGE)
// =========================================================================
function alternarEstadoFavorito(botId) {
    let favorites = JSON.parse(localStorage.getItem("gplus_fav_bots")) || [];
    if (favorites.includes(botId)) {
        favorites = favorites.filter(id => id !== botId);
    } else {
        favorites.push(botId);
    }
    localStorage.setItem("gplus_fav_bots", JSON.stringify(favorites));
    
    // Repintado simultáneo de vistas para mantener concordancia
    if (activeTabGlobal === 'catalog') filtrarCatalogoEnCaliente();
    if (activeTabGlobal === 'favorites') renderizarVistaFavoritos();
}

function renderizarVistaFavoritos() {
    const grid = document.getElementById("favorites-grid");
    if (!grid) return;
    const favorites = JSON.parse(localStorage.getItem("gplus_fav_bots")) || [];

    const botsFavoritos = DIRECTORIO_BOTS_MAESTRO.filter(b => favorites.includes(b.id));

    if (botsFavoritos.length === 0) {
        grid.innerHTML = `
            <div style="text-align:center; padding: 40px var(--text-muted); font-size: 0.8rem; color: var(--text-muted);">
                <i data-lucide="heart" style="width:40px; height:40px; margin-bottom:10px; opacity:0.3;"></i>
                <p>No tienes ningún bot guardado en favoritos todavía.</p>
            </div>
        `;
    } else {
        grid.innerHTML = botsFavoritos.map(bot => construirHtmlTarjetaBot(bot, 'fav')).join('');
    }
    if (window.lucide) lucide.createIcons();
}

// =========================================================================
// ➕ ENVIAR BOT AL CHAT DE SOPORTE DEL ADMINISTRADOR (@Airdayz)
// =========================================================================
function enviarFormularioBotAlAdmin() {
    const userId = obtenerUserIdTelegramActual();
    const titulo = document.getElementById("f-title").value.trim();
    const username = document.getElementById("f-user").value.trim();
    const idioma = document.getElementById("f-lang").value.trim();
    const corta = document.getElementById("f-short").value.trim();
    const larga = document.getElementById("f-long").value.trim();

    if (!titulo || !username || !idioma || !corta || !larga) {
        alert("❌ Por favor, rellena todos los campos del formulario para procesar tu solicitud.");
        return;
    }

    const textoMensaje = 
        `🤖 SOLICITUD DE NUEVO BOT\n` +
        `=========================\n` +
        `▪️ Creador ID (Auto): ${userId}\n` +
        `▪️ Nombre Comercial: ${titulo}\n` +
        `▪️ Username: ${username}\n` +
        `▪️ Idioma: ${idioma}\n` +
        `▪️ Desc. Corta: ${corta}\n` +
        `▪️ Desc. Larga: ${larga}\n` +
        `=========================\n` +
        `Hola Airdayz, envío los datos de mi bot para que verifiques mi propiedad y lo indexes manualmente en el directorio de la app.`;

    window.open(`https://t.me/Airdayz?text=${encodeURIComponent(textoMensaje)}`, '_blank');
}

// =========================================================================
// 👑 MÓDULO TIENDA PUBLICITARIA
// =========================================================================
function solicitarCompraComercial(nombreServicio) {
    const userId = obtenerUserIdTelegramActual();
    const texto = 
        `👑 INTENCIÓN DE COMPRA PUBLICITARIA\n` +
        `=========================\n` +
        `▪️ Cliente ID (Auto): ${userId}\n` +
        `▪️ Servicio: ${nombreServicio}\n` +
        `▪️ Estado: 🟡 ESPERANDO METODO DE PAGO\n` +
        `=========================\n` +
        `Hola @Airdayz, estoy interesado en adquirir esta mejora para potenciar el rendimiento de mis bots. Indícame cómo realizar el pago.`;
    
    window.open(`https://t.me/Airdayz?text=${encodeURIComponent(texto)}`, '_blank');
}

// =========================================================================
// 👤 PANEL DE CONTROL DEL CREADOR (CONEXIÓN MANUAL POR ID)
// =========================================================================
function renderizarPanelCreador() {
    const grid = document.getElementById("creator-bots-grid");
    if (!grid) return;
    const userId = obtenerUserIdTelegramActual();

    // Filtra en caliente los bots del array maestro que te pertenezcan
    const misBots = DIRECTORIO_BOTS_MAESTRO.filter(b => b.ownerId === userId);

    if (misBots.length === 0) {
        grid.innerHTML = `
            <div style="background: rgba(255,255,255,0.02); border: 1px dashed var(--border); padding: 20px; border-radius: 12px; text-align: center; font-size: 0.75rem; color: var(--text-muted);">
                Aún no tienes bots vinculados a tu ID de Telegram en nuestro catálogo de forma manual.<br><br>
                <span style="color: var(--cyan); font-weight:800; cursor:pointer;" onclick="switchView('submit-bot')">👉 Enviar mi primer bot ahora</span>
            </div>
        `;
    } else {
        grid.innerHTML = misBots.map(bot => {
            let statusBadge = `<span style="color: var(--text-muted); font-weight:800;">🟢 BÁSICO</span>`;
            if (bot.isPremium) statusBadge = `<span style="color: var(--purple); font-weight:900;">👑 PREMIUM ACTIVADO</span>`;
            else if (bot.isVerified) statusBadge = `<span style="color: var(--cyan); font-weight:800;">🔵 VERIFICADO</span>`;

            return `
                <div style="background: #111827; border: 1px solid var(--border); padding: 12px; border-radius: 12px; display: flex; flex-direction: column; gap: 8px;">
                    <div style="display:flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 800; font-size: 0.85rem; color: #fff;">${bot.titulo} (@${bot.username})</span>
                        ${statusBadge}
                    </div>
                    <button style="width:100%; padding: 8px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; color:#fff; font-size:0.7rem; font-weight:700; cursor:pointer;" onclick="solicitarModificacionCambioBot('${bot.id}', '${bot.username}')">
                        Editar Datos o Solicitar Mejoras 🛠️
                    </button>
                </div>
            `;
        }).join('');
    }
}

function solicitarModificacionCambioBot(idInterno, username) {
    const userId = obtenerUserIdTelegramActual();
    const texto = 
        `🛠️ SOLICITUD DE CAMBIO / MEJORA DE BOT\n` +
        `=========================\n` +
        `▪️ Bot ID Sistema: ${idInterno}\n` +
        `▪️ Username: @${username}\n` +
        `▪️ Creador ID: ${userId}\n` +
        `=========================\n` +
        `Hola @Airdayz, quiero solicitar una modificación de datos o cambiar el plan contratado para este bot registrado.`;
    window.open(`https://t.me/Airdayz?text=${encodeURIComponent(texto)}`, '_blank');
}

// =========================================================================
// 📯 INTERACCIONES AUXILIARES GLOBALES
// =========================================================================
function lanzarReporteBot(username) {
    const userId = obtenerUserIdTelegramActual();
    const texto = `🚨 REPORTE DE ABUSO O MAL FUNCIONAMIENTO\n=========================\n▪️ Bot Reportado: @${username}\n▪️ Reportado por ID: ${userId}\n=========================\nHola Airdayz, informo que este bot presenta irregularidades en el servicio. Solicito revisión de las políticas de la comunidad.`;
    window.open(`https://t.me/Airdayz?text=${encodeURIComponent(texto)}`, '_blank');
}

function dispararAvisoValoracion() {
    const confirmar = confirm("¿Quieres dejar tu reseña oficial?\n\nTu valoración real ayuda a mantener la transparencia del ecosistema. Serás redirigido a nuestro canal oficial @Mundo_Bot para publicar tu opinión en los comentarios.");
    if (confirmar) {
        window.open("https://t.me/Mundo_Bot", "_blank");
    }
}

// =========================================================================
// 🏁 INICIALIZADORES AL CARGAR EL DOM
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
    inicializarDatosTelegram();
    renderizarFiltrosCategorias();
    filtrarCatalogoEnCaliente();
});
