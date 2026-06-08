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
        isVerified: false, 
        ownerId: "12345678",
        url_web: "",
        url_soporte: ""
    }
];

// Variables de Control de Estado Global
let currentCategoryFilter = "Todos";
let activeTabGlobal = "catalog";

// Precios base comerciales de referencia
const PRECIO_BASE_PREMIUM_MES = 9.99;

// =========================================================================
// 🚀 CONEXIÓN EN CALIENTE CON TELEGRAM MINI APP SDK & BARRA SUPERIOR
// =========================================================================
function inicializarDatosTelegram() {
    inyectarEstilosHeaderDinamico();
    inyectarContenedorToast();
    
    if (window.Telegram && window.Telegram.WebApp) {
        const webapp = window.Telegram.WebApp;
        webapp.ready();
        webapp.expand(); 

        document.body.style.setProperty('--tg-theme-bg', webapp.backgroundColor);
        
        const user = webapp.initDataUnsafe?.user;
        if (user) {
            const esUsuarioPremium = comprobarSiUsuarioEsPremium(user.id.toString());
            renderizarHeaderSuperiorPegajoso(user.first_name, user.photo_url, esUsuarioPremium);
            
            // Render del Perfil Inferior Tab
            const firstLetter = user.first_name ? user.first_name.charAt(0).toUpperCase() : "U";
            const avatarHtml = user.photo_url ? `<img src="${user.photo_url}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">` : firstLetter;
            
            if(document.getElementById("u-avatar")) document.getElementById("u-avatar").innerHTML = avatarHtml;
            if(document.getElementById("u-name")) document.getElementById("u-name").innerText = `${user.first_name} ${user.last_name || ""}`;
            if(document.getElementById("u-id")) document.getElementById("u-id").innerText = `ID: ${user.id}`;
        } else {
            cargarPerfilModoDesarrolloPC();
        }
    } else {
        cargarPerfilModoDesarrolloPC();
    }
    
    // Verificar si corresponde explosión de confeti de bienvenida/logro
    comprobarYDispararConfetiLogro();
}

function cargarPerfilModoDesarrolloPC() {
    const esAdminPremium = comprobarSiUsuarioEsPremium("12345678");
    renderizarHeaderSuperiorPegajoso("Airdayz Creador", null, esAdminPremium);
    
    if(document.getElementById("u-name")) document.getElementById("u-name").innerText = "Airdayz Creador";
    if(document.getElementById("u-id")) document.getElementById("u-id").innerText = "ID: 12345678"; 
    if(document.getElementById("u-avatar")) document.getElementById("u-avatar").innerText = "A";
}

function obtenerUserIdTelegramActual() {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
        return window.Telegram.WebApp.initDataUnsafe.user.id.toString();
    }
    return "12345678"; 
}

function comprobarSiUsuarioEsPremium(userId) {
    return DIRECTORIO_BOTS_MAESTRO.some(bot => bot.ownerId === userId && bot.isPremium);
}

function obtenerCantidadBotsUsuario(userId) {
    return DIRECTORIO_BOTS_MAESTRO.filter(bot => bot.ownerId === userId).length;
}

// =========================================================================
// 👑 CONSTRUCTOR DE LA BARRA SUPERIOR PEGAJOSA (STICKY HEADER INVERTIDO)
// =========================================================================
function renderizarHeaderSuperiorPegajoso(nombre, avatarUrl, esPremium) {
    const previo = document.getElementById("sticky-app-header");
    if (previo) previo.remove();

    const header = document.createElement("div");
    header.id = "sticky-app-header";
    header.className = "sticky-header-container";

    const inicial = nombre ? nombre.charAt(0).toUpperCase() : "U";
    const badgeRango = esPremium 
        ? `<span class="user-badge-tag premium-badge">👑 PREMIUM</span>` 
        : `<span class="user-badge-tag gratis-badge">BÁSICO</span>`;

    const avatarElemento = avatarUrl 
        ? `<img src="${avatarUrl}" class="header-avatar-img" alt="User">` 
        : `<div class="header-avatar-fallback">${inicial}</div>`;

    const userId = obtenerUserIdTelegramActual();
    const countBots = obtenerCantidadBotsUsuario(userId);

    // Marca a la izquierda, Usuario y Contador de bots a la derecha del todo
    header.innerHTML = `
        <div class="header-left-side" onclick="switchView('catalog')">
            <span class="header-brand-logo">Mundo Bots</span>
        </div>
        <div class="header-right-side" onclick="switchView('profile')">
            <div class="header-user-meta" style="align-items: flex-end;">
                <span class="header-welcome-text">Hola, ${nombre}</span>
                <div style="display: flex; align-items: center; gap: 4px;">
                    <span class="header-bot-count-badge"><i data-lucide="bot" style="width:10px; height:10px; display:inline-block; vertical-align:middle; margin-right:2px;"></i>${countBots} ${countBots === 1 ? 'Bot' : 'Bots'}</span>
                    ${badgeRango}
                </div>
            </div>
            <div class="header-avatar-wrapper">
                ${avatarElemento}
            </div>
        </div>
    `;

    document.body.insertBefore(header, document.body.firstChild);
}

function inyectarEstilosHeaderDinamico() {
    if (document.getElementById("estilos-header-sticky")) return;
    const style = document.createElement("style");
    style.id = "estilos-header-sticky";
    style.innerHTML = `
        body { padding-top: 60px !important; }
        .sticky-header-container {
            position: fixed; top: 0; left: 0; width: 100%; height: 56px;
            background: #0f172a; border-bottom: 1px solid rgba(255,255,255,0.08);
            display: flex; justify-content: space-between; align-items: center;
            padding: 0 16px; z-index: 9999; box-sizing: border-box;
        }
        .header-left-side { cursor: pointer; }
        .header-right-side { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .header-avatar-wrapper { width: 34px; height: 34px; border-radius: 50%; overflow: hidden; background: linear-gradient(135deg, #22d3ee, #06b6d4); display: flex; align-items: center; justify-content: center; border: 1.5px solid rgba(255,255,255,0.2); }
        .header-avatar-img { width: 100%; height: 100%; object-fit: cover; }
        .header-avatar-fallback { font-size: 0.85rem; font-weight: 800; color: #fff; }
        .header-user-meta { display: flex; flex-direction: column; gap: 2px; }
        .header-welcome-text { font-size: 0.8rem; font-weight: 700; color: #f8fafc; max-width: 120px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .user-badge-tag { font-size: 0.6rem; font-weight: 900; padding: 1px 6px; border-radius: 4px; width: max-content; letter-spacing: 0.3px; }
        .gratis-badge { background: rgba(255,255,255,0.08); color: #94a3b8; border: 1px solid rgba(255,255,255,0.12); }
        .premium-badge { background: linear-gradient(90deg, #eab308, #ca8a04); color: #0f172a; box-shadow: 0 0 8px rgba(234,179,8,0.3); }
        .header-brand-logo { font-size: 0.95rem; font-weight: 900; background: linear-gradient(90deg, #22d3ee, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .header-bot-count-badge { font-size: 0.6rem; font-weight: 700; background: rgba(34,211,238,0.15); color: #22d3ee; padding: 1px 5px; border-radius: 4px; border: 1px solid rgba(34,211,238,0.3); }
        
        /* Sistema de Alertas Toast */
        #toast-master-container { position: fixed; top: 68px; left: 50%; transform: translateX(-50%); z-index: 10005; display: flex; flex-direction: column; gap: 8px; width: 90%; max-width: 360px; pointer-events: none; }
        .toast-card { padding: 10px 14px; background: #1e293b; border-left: 4px solid #3b82f6; color: #fff; font-size: 0.78rem; font-weight: 600; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.4); animation: slideDownToast 0.3s ease-out forwards; pointer-events: auto; }
        .toast-card.toast-success { border-left-color: #10b981; }
        .toast-card.toast-error { border-left-color: #ef4444; }
        .toast-card.toast-warning { border-left-color: #f59e0b; }
        @keyframes slideDownToast { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        
        /* Estilos Módulo Perfil */
        .profile-sub-card { background: #1e293b; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px; margin-bottom: 16px; }
        .sub-grid-metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px; }
        .metric-sub-box { background: rgba(15,23,42,0.6); padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.04); }
        .metric-sub-title { font-size: 0.65rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; }
        .metric-sub-value { font-size: 0.9rem; font-weight: 800; margin-top: 2px; }
        
        /* UI de Selección de Periodo */
        .period-selector-wrapper { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin: 10px 0; }
        .period-pill { background: #111827; border: 1px solid rgba(255,255,255,0.1); padding: 6px 2px; border-radius: 8px; text-align: center; cursor: pointer; color: #94a3b8; font-size: 0.65rem; font-weight: 700; transition: all 0.2s; }
        .period-pill.active { background: linear-gradient(135deg, #eab308, #ca8a04); color: #0f172a; border-color: transparent; font-weight: 800; box-shadow: 0 0 8px rgba(234,179,8,0.25); }
    `;
    document.head.appendChild(style);
}

// =========================================================================
// 📯 SISTEMA INTERNO DE MENSAJES TOAST SENSITIVOS
// =========================================================================
function inyectarContenedorToast() {
    if (document.getElementById("toast-master-container")) return;
    const container = document.createElement("div");
    container.id = "toast-master-container";
    document.body.appendChild(container);
}

function lanzarToast(mensaje, tipo = "info") {
    const container = document.getElementById("toast-master-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast-card toast-${tipo}`;
    toast.innerText = mensaje;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transition = "opacity 0.3s ease";
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// =========================================================================
// 🛠️ CONTROLADOR UNIFICADO PARA ENLACES (Evita bloqueos en Telegram)
// =========================================================================
function abrirEnlaceSeguroTelegram(url) {
    if (window.Telegram?.WebApp?.openLink) {
        window.Telegram.WebApp.openLink(url); 
    } else {
        window.open(url, '_blank'); 
    }
}

function abrirEnlaceExternoWeb(url) {
    if (window.Telegram?.WebApp?.openLink) {
        window.Telegram.WebApp.openLink(url); 
    } else {
        window.open(url, '_blank');
    }
}

// =========================================================================
// 🔄 ENRUTADOR DINÁMICO DE PESTAÑAS (switchView)
// =========================================================================
function switchView(viewId) {
    activeTabGlobal = viewId;

    document.querySelectorAll('.app-view').forEach(view => view.classList.remove('active-view'));
    document.querySelectorAll('.nav-item').forEach(tab => tab.classList.remove('active-tab'));

    const activeView = document.getElementById(`view-${viewId}`);
    const activeTab = document.getElementById(`tab-${viewId}`);

    if (activeView) activeView.classList.add('active-view');
    if (activeTab) activeTab.classList.add('active-tab');

    if (viewId === 'catalog') renderizarFiltrosCategorias();
    if (viewId === 'favorites') renderizarVistaFavoritos();
    if (viewId === 'profile') renderizarPanelCreador();

    if (window.lucide) lucide.createIcons();
}

// =========================================================================
// 🏠 COMPONENTE CATÁLOGO: RENDER Y FILTRADO AGRESIVO
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

function obtenerBotsProcesados() {
    return [...DIRECTORIO_BOTS_MAESTRO].sort((a, b) => (b.isPremium ? 1 : 0) - (a.isPremium ? 1 : 0));
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

    if (document.getElementById("counter-results")) {
        document.getElementById("counter-results").innerText = `Mostrando ${botsFiltrados.length} bots`;
    }
    grid.innerHTML = botsFiltrados.map(bot => construirHtmlTarjetaBot(bot, 'cat')).join('');
    if (window.lucide) lucide.createIcons();
}

// =========================================================================
// 🧱 FACTORÍA CONSTRUCTORA DE TARJETAS (REGLA DE ORO + ACCORDION)
// =========================================================================
function construirHtmlTarjetaBot(bot, contextoLlamada) {
    const favorites = JSON.parse(localStorage.getItem("gplus_fav_bots")) || [];
    const esFavorito = favorites.includes(bot.id);

    const badgeVerified = bot.isVerified ? `<span class="badge-verified"><i data-lucide="badge-check"></i></span>` : '';
    const badgePremium = bot.isPremium ? `<span class="badge-premium-tag">DESTACADO</span>` : '';
    const premiumClass = bot.isPremium ? 'premium-card' : '';

    let botonesPremiumExtendidos = '';
    if (bot.isPremium) {
        botonesPremiumExtendidos = `
            <div class="extended-buttons">
                ${bot.url_web ? `<button class="btn-ext" onclick="event.stopPropagation(); abrirEnlaceExternoWeb('${bot.url_web}')"><i data-lucide="globe"></i> Visitar Web</button>` : ''}
                ${bot.url_soporte ? `<button class="btn-ext" onclick="event.stopPropagation(); abrirEnlaceSeguroTelegram('${bot.url_soporte}')"><i data-lucide="help-circle"></i> Soporte Ofic.</button>` : ''}
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

function conmutarDespliegueTarjeta(cardIdCompleto) {
    const elemento = document.getElementById(`card-${cardIdCompleto}`);
    if (!elemento) return;
    elemento.classList.toggle("is-expanded");
}

function lanzarBotTelegram(username) {
    lanzarToast(`Iniciando @${username}...`, "info");
    const url = `https://t.me/${username}?start=webapp_directory`;
    abrirEnlaceSeguroTelegram(url);
}

// =========================================================================
// ❤️ GESTIÓN DE FAVORITOS SINCRONIZADA
// =========================================================================
function alternarEstadoFavorito(botId) {
    let favorites = JSON.parse(localStorage.getItem("gplus_fav_bots")) || [];
    let agregado = false;
    if (favorites.includes(botId)) {
        favorites = favorites.filter(id => id !== botId);
        lanzarToast("Eliminado de favoritos", "warning");
    } else {
        favorites.push(botId);
        lanzarToast("Añadido a favoritos ❤️", "success");
    }
    localStorage.setItem("gplus_fav_bots", JSON.stringify(favorites));
    
    filtrarCatalogoEnCaliente();
    renderizarVistaFavoritos();
}

function renderizarVistaFavoritos() {
    const grid = document.getElementById("favorites-grid");
    if (!grid) return;
    const favorites = JSON.parse(localStorage.getItem("gplus_fav_bots")) || [];
    const botsFavoritos = DIRECTORIO_BOTS_MAESTRO.filter(b => favorites.includes(b.id));

    if (botsFavoritos.length === 0) {
        grid.innerHTML = `
            <div style="text-align:center; padding: 40px; font-size: 0.8rem; color: #64748b;">
                <i data-lucide="heart" style="width:40px; height:40px; margin:0 auto 10px auto; opacity:0.3; display:block;"></i>
                <p>No tienes ningún bot guardado en favoritos todavía.</p>
            </div>
        `;
    } else {
        grid.innerHTML = botsFavoritos.map(bot => construirHtmlTarjetaBot(bot, 'fav')).join('');
    }
    if (window.lucide) lucide.createIcons();
}

// =========================================================================
// 👤 PANEL DE CONTROL DEL CREADOR & TARJETA DE SUSCRIPCIÓN COMPLETA
// =========================================================================
function renderizarPanelCreador() {
    const userId = obtenerUserIdTelegramActual();
    const esPremium = comprobarSiUsuarioEsPremium(userId);
    const countBots = obtenerCantidadBotsUsuario(userId);
    
    // Forzar render del módulo de suscripciones integrado en el perfil
    renderizarModuloSuscripcionPerfil(esPremium, countBots);

    const grid = document.getElementById("creator-bots-grid");
    if (!grid) return;

    const misBots = DIRECTORIO_BOTS_MAESTRO.filter(b => b.ownerId === userId);

    if (misBots.length === 0) {
        grid.innerHTML = `
            <div style="background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.15); padding: 20px; border-radius: 12px; text-align: center; font-size: 0.75rem; color: #94a3b8;">
                Aún no tienes bots vinculados a tu ID de Telegram en nuestro catálogo.<br><br>
                <span style="color: #22d3ee; font-weight:800; cursor:pointer;" onclick="switchView('submit-bot')">👉 Enviar mi primer bot ahora</span>
            </div>
        `;
    } else {
        grid.innerHTML = misBots.map(bot => {
            let statusBadge = `<span style="color: #94a3b8; font-weight:800;">🟢 BÁSICO</span>`;
            if (bot.isPremium) statusBadge = `<span style="color: #a855f7; font-weight:900;">👑 PREMIUM</span>`;
            else if (bot.isVerified) statusBadge = `<span style="color: #22d3ee; font-weight:800;">🔵 VERIFICADO</span>`;

            return `
                <div style="background: #111827; border: 1px solid rgba(255,255,255,0.08); padding: 12px; border-radius: 12px; display: flex; flex-direction: column; gap: 8px; margin-bottom:8px;">
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

function renderizarModuloSuscripcionPerfil(esPremium, countBots) {
    const wrapper = document.getElementById("user-subscription-module-wrapper");
    if (!wrapper) return;

    // Configuración de límites y fechas estables de simulación basadas en el año corriente 2026
    const limitMax = esPremium ? 3 : 1;
    const slotsTxt = `${countBots} / ${limitMax}`;
    const fechaInicio = esPremium ? "01/01/2026" : "N/A";
    const fechaFin = esPremium ? "31/12/2026" : "N/A";
    
    let CTA_BotonHTML = '';
    if(!esPremium) {
        CTA_BotonHTML = `
            <button class="btn-launch" style="width:100%; margin-top:12px; background:linear-gradient(90deg, #eab308, #ca8a04); color:#0f172a; font-weight:800; border:none; padding:10px; border-radius:8px;" onclick="switchView('premium-store')">
                🚀 Subir a Premium / Ver Planes de Pago
            </button>
        `;
    }

    wrapper.innerHTML = `
        <div class="profile-sub-card">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:8px;">
                <h3 style="font-size:0.85rem; font-weight:800; color:#fff; margin:0;">Mi Suscripción</h3>
                <span style="font-size:0.7rem; font-weight:900; padding:2px 8px; border-radius:20px; ${esPremium ? 'background:rgba(234,179,8,0.15); color:#eab308;' : 'background:rgba(255,255,255,0.1); color:#94a3b8;'}">
                    ${esPremium ? 'PLAN PREMIUM' : 'PLAN GRATUITO'}
                </span>
            </div>
            <div class="sub-grid-metrics">
                <div class="metric-sub-box">
                    <div class="metric-sub-title">Slots de Bots</div>
                    <div class="metric-sub-value" style="${countBots > limitMax ? 'color:#f87171;' : 'color:#fff;'}">${slotsTxt}</div>
                </div>
                <div class="metric-sub-box">
                    <div class="metric-sub-title">Periodo Activo</div>
                    <div class="metric-sub-value" style="font-size:0.75rem; color:#cbd5e1;">${esPremium ? 'Anual' : 'Indefinido'}</div>
                </div>
                <div class="metric-sub-box">
                    <div class="metric-sub-title">Fecha Inicio</div>
                    <div class="metric-sub-value" style="font-size:0.75rem; color:#94a3b8;">${fechaInicio}</div>
                </div>
                <div class="metric-sub-box">
                    <div class="metric-sub-title">Fecha Vencimiento</div>
                    <div class="metric-sub-value" style="font-size:0.75rem; color:#94a3b8;">${fechaFin}</div>
                </div>
            </div>
            ${CTA_BotonHTML}
        </div>
    `;
}

// =========================================================================
// 🛒 CALCULADORA DE CONTRATACIÓN EN TIENDA PREMIUM (DINÁMICA 2026)
// =========================================================================
function actualizarCalculoContratacionPremium(meses) {
    // Deseleccionar todos los botones del selector
    document.querySelectorAll('.period-pill').forEach(p => p.classList.remove('active'));
    // Activar el seleccionado
    document.getElementById(`pill-${meses}m`)?.classList.add('active');

    let multiplicadorFactor = 1.0;
    if(meses === 3) multiplicadorFactor = 0.90; // 10% Descuento
    if(meses === 6) multiplicadorFactor = 0.80; // 20% Descuento
    if(meses === 12) multiplicadorFactor = 0.70; // 30% Descuento

    const precioBrutoMensual = PRECIO_BASE_PREMIUM_MES * meses;
    const precioFinalCalculado = precioBrutoMensual * multiplicadorFactor;

    const divContenedorTotal = document.getElementById("premium-total-price-display");
    if(divContenedorTotal) {
        divContenedorTotal.innerHTML = `
            <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); padding:10px; border-radius:8px; margin-top:10px; text-align:center;">
                <span style="font-size:0.7rem; color:#94a3b8; display:block;">TOTAL A PAGAR (${meses} ${meses === 1 ? 'Mes' : 'Meses'})</span>
                <span style="font-size:1.3rem; font-weight:900; color:#eab308;">${precioFinalCalculado.toFixed(2)} €</span>
                ${meses > 1 ? `<span style="font-size:0.6rem; color:#10b981; display:block; margin-top:2px;">¡Ahorro del ${(100 - (multiplicadorFactor*100)).toFixed(0)}% aplicado!</span>` : ''}
            </div>
        `;
    }
    
    // Guardar temporalmente en el dataset del contenedor para la orden final
    const btnCompra = document.getElementById("btn-comprar-premium-action");
    if(btnCompra) {
        btnCompra.setAttribute("data-selected-period", `${meses} meses`);
        btnCompra.setAttribute("data-selected-price", `${precioFinalCalculado.toFixed(2)} EUR`);
    }
}

function procesarCompraPremiumDesdeUI() {
    const btnCompra = document.getElementById("btn-comprar-premium-action");
    const periodo = btnCompra?.getAttribute("data-selected-period") || "1 mes";
    const total = btnCompra?.getAttribute("data-selected-price") || "9.99 EUR";
    
    const userId = obtenerUserIdTelegramActual();
    lanzarToast("Generando orden de pago segura...", "info");

    const textoLimpio = `SOLICITUD DE ALTA PREMIUM - Comprador ID: ${userId} - Periodo: ${periodo} - Importe Acordado: ${total}. Hola Airdayz, quiero validar mi pago de suscripción para el catálogo.`;
    
    const url = `https://t.me/Airdayz?text=${encodeURIComponent(textoLimpio)}`;
    abrirEnlaceSeguroTelegram(url);
}

// =========================================================================
// 🎉 MOTOR DE CONFETI Y CELEBRACIONES POR LOGROS
// =========================================================================
function comprobarYDispararConfetiLogro() {
    const userId = obtenerUserIdTelegramActual();
    const count = obtenerCantidadBotsUsuario(userId);

    // Si el usuario tiene bots indexados y nunca se le ha premiado con la explosión visual
    if (count > 0 && !localStorage.getItem(`gplus_confeti_disparado_${userId}`)) {
        localStorage.setItem(`gplus_confeti_disparado_${userId}`, "true");
        
        // Crear Canvas temporal para la física de partículas
        dispararEfectoVisualConfetiFisico();
        
        setTimeout(() => {
            alert(`🎉 ¡ENHORABUENA! 🎉\n\nHemos verificado con éxito tus credenciales de desarrollador. Tu bot ya se encuentra totalmente indexado en Mundo Bots.\n\n¡Sigue creciendo dentro del ecosistema!`);
            lanzarToast("¡Logro de creador desbloqueado! 👑", "success");
        }, 600);
    }
}

function dispararEfectoVisualConfetiFisico() {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0"; canvas.style.left = "0";
    canvas.style.width = "100vw"; canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none"; canvas.style.zindex = "100000";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particulas = [];
    const colores = ["#22d3ee", "#3b82f6", "#eab308", "#a855f7", "#10b981", "#f43f5e"];

    for (let i = 0; i < 120; i++) {
        particulas.push({
            x: canvas.width / 2,
            y: canvas.height / 2 - 50,
            vx: (Math.random() - 0.5) * 14,
            vy: (Math.random() - 0.7) * 16 - 4,
            radius: Math.random() * 5 + 4,
            color: colores[Math.floor(Math.random() * colores.length)],
            alpha: 1,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10
        });
    }

    function renderFrame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let vivas = false;

        particulas.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.38; // Gravedad acelerada
            p.alpha -= 0.012;
            p.rotation += p.rotationSpeed;

            if (p.alpha > 0) {
                vivas = true;
                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius * 2);
                ctx.restore();
            }
        });

        if (vivas) {
            requestAnimationFrame(renderFrame);
        } else {
            canvas.remove();
        }
    }
    renderFrame();
}

// =========================================================================
// ➕ ENVIAR FORMULARIOS & ACCIONES AUXILIARES SOLICITUDES
// =========================================================================
function enviarFormularioBotAlAdmin() {
    const userId = obtenerUserIdTelegramActual();
    const titulo = document.getElementById("f-title").value.trim();
    const username = document.getElementById("f-user").value.trim();
    const idioma = document.getElementById("f-lang").value.trim();
    const corta = document.getElementById("f-short").value.trim();
    const larga = document.getElementById("f-long").value.trim();

    if (!titulo || !username || !idioma || !corta || !larga) {
        lanzarToast("Por favor, rellena todos los campos", "error");
        return;
    }

    lanzarToast("Redirigiendo a soporte de envío...", "info");
    const textoMensaje = `SOLICITUD DE NUEVO BOT - Creador ID: ${userId} - Nombre: ${titulo} - Username: @${username} - Idioma: ${idioma} - Desc. Corta: ${corta} - Desc. Larga: ${larga}. Hola Airdayz, revisa mi bot para indexarlo en el directorio.`;

    const url = `https://t.me/Airdayz?text=${encodeURIComponent(textoMensaje)}`;
    abrirEnlaceSeguroTelegram(url);
}

function solicitarModificacionCambioBot(idInterno, username) {
    const userId = obtenerUserIdTelegramActual();
    lanzarToast("Abriendo solicitud de edición...", "info");
    const texto = `SOLICITUD DE MODIFICACION - Bot ID: ${idInterno} - Username: @${username} - Creador ID: ${userId}. Hola Airdayz, quiero modificar los datos o el plan de este bot.`;
    
    const url = `https://t.me/Airdayz?text=${encodeURIComponent(texto)}`;
    abrirEnlaceSeguroTelegram(url);
}

function lanzarReporteBot(username) {
    const userId = obtenerUserIdTelegramActual();
    lanzarToast("Abriendo reporte de abuso...", "warning");
    const texto = `REPORTE DE ABUSO - Bot Reportado: @${username} - Reportado por ID: ${userId}. Hola Airdayz, este bot presenta fallos o irregularidades.`;
    
    const url = `https://t.me/Airdayz?text=${encodeURIComponent(texto)}`;
    abrirEnlaceSeguroTelegram(url);
}

function dispararAvisoValoracion() {
    lanzarToast("Redirigiendo a comunidad...", "info");
    abrirEnlaceSeguroTelegram("https://t.me/Mundo_Bot");
}

// =========================================================================
// 🏁 INICIALIZADORES AL CARGAR EL DOM
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
    inicializarDatosTelegram();
    renderizarFiltrosCategorias();
    filtrarCatalogoEnCaliente();
    
    // Si la inicialización del DOM arranca en la vista de tienda premium, activar cálculo base
    if(document.getElementById("premium-total-price-display")) {
        actualizarCalculoContratacionPremium(1);
    }
});
