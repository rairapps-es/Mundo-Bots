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

// =========================================================================
// 🚀 CONEXIÓN EN CALIENTE CON TELEGRAM MINI APP SDK & BARRA SUPERIOR
// =========================================================================
function inicializarDatosTelegram() {
    inyectarEstilosHeaderDinamico();
    
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
            
            document.getElementById("u-avatar").innerHTML = avatarHtml;
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
    const esAdminPremium = comprobarSiUsuarioEsPremium("12345678");
    renderizarHeaderSuperiorPegajoso("Airdayz Creador", null, esAdminPremium);
    
    document.getElementById("u-name").innerText = "Airdayz Creador";
    document.getElementById("u-id").innerText = "ID: 12345678"; 
    document.getElementById("u-avatar").innerText = "A";
}

function obtenerUserIdTelegramActual() {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
        return window.Telegram.WebApp.initDataUnsafe.user.id.toString();
    }
    return "12345678"; 
}

function comprobarSiUsuarioEsPremium(userId) {
    // Si el usuario tiene asignado al menos un bot que sea Premium en la DB, se le concede el rango global en la App
    return DIRECTORIO_BOTS_MAESTRO.some(bot => bot.ownerId === userId && bot.isPremium);
}

// =========================================================================
// 👑 CONSTRUCTOR DE LA BARRA SUPERIOR PEGAJOSA (STICKY HEADER)
// =========================================================================
function renderizarHeaderSuperiorPegajoso(nombre, avatarUrl, esPremium) {
    // Eliminar header previo si existiera por seguridad
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

    header.innerHTML = `
        <div class="header-left-side" onclick="switchView('profile')">
            <div class="header-avatar-wrapper">
                ${avatarElemento}
            </div>
            <div class="header-user-meta">
                <span class="header-welcome-text">Hola, ${nombre}</span>
                ${badgeRango}
            </div>
        </div>
        <div class="header-right-side">
            <span class="header-brand-logo">Mundo Bots</span>
        </div>
    `;

    // Inyectar al principio de la aplicación de forma dinámica
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
        .header-left-side { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .header-avatar-wrapper { width: 34px; height: 34px; border-radius: 50%; overflow: hidden; background: linear-gradient(135deg, #22d3ee, #06b6d4); display: flex; align-items: center; justify-content: center; border: 1.5px solid rgba(255,255,255,0.2); }
        .header-avatar-img { width: 100%; height: 100%; object-fit: cover; }
        .header-avatar-fallback { font-size: 0.85rem; font-weight: 800; color: #fff; }
        .header-user-meta { display: flex; flex-direction: column; gap: 2px; }
        .header-welcome-text { font-size: 0.8rem; font-weight: 700; color: #f8fafc; max-width: 120px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .user-badge-tag { font-size: 0.6rem; font-weight: 900; padding: 1px 6px; border-radius: 4px; width: max-content; letter-spacing: 0.3px; }
        .gratis-badge { background: rgba(255,255,255,0.08); color: #94a3b8; border: 1px solid rgba(255,255,255,0.12); }
        .premium-badge { background: linear-gradient(90deg, #eab308, #ca8a04); color: #0f172a; box-shadow: 0 0 8px rgba(234,179,8,0.3); }
        .header-brand-logo { font-size: 0.85rem; font-weight: 900; background: linear-gradient(90deg, #22d3ee, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    `;
    document.head.appendChild(style);
}

// =========================================================================
// 🛠️ CONTROLADOR UNIFICADO PARA ENLACES (Evita bloqueos en Telegram)
// =========================================================================
function abrirEnlaceSeguroTelegram(url) {
    if (window.Telegram?.WebApp?.openTelegramLink) {
        window.Telegram.WebApp.openTelegramLink(url); 
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
    const url = `https://t.me/${username}?start=webapp_directory`;
    abrirEnlaceSeguroTelegram(url);
}

// =========================================================================
// ❤️ GESTIÓN DE FAVORITOS SINCRONIZADA EN TIEMPO REAL (Solución al Bug)
// =========================================================================
function alternarEstadoFavorito(botId) {
    let favorites = JSON.parse(localStorage.getItem("gplus_fav_bots")) || [];
    if (favorites.includes(botId)) {
        favorites = favorites.filter(id => id !== botId);
    } else {
        favorites.push(botId);
    }
    localStorage.setItem("gplus_fav_bots", JSON.stringify(favorites));
    
    // SOLUCCIÓN AL BUG: Se fuerzan ambos repintados en paralelo sin importar dónde esté parado el usuario
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

    const textoMensaje = `SOLICITUD DE NUEVO BOT - Creador ID: ${userId} - Nombre: ${titulo} - Username: @${username} - Idioma: ${idioma} - Desc. Corta: ${corta} - Desc. Larga: ${larga}. Hola Airdayz, revisa mi bot para indexarlo en el directorio.`;

    const url = `https://t.me/Airdayz?text=${encodeURIComponent(textoMensaje)}`;
    abrirEnlaceSeguroTelegram(url);
}

// =========================================================================
// 👑 MÓDULO TIENDA PUBLICITARIA
// =========================================================================
function solicitarCompraComercial(nombreServicio) {
    const userId = obtenerUserIdTelegramActual();
    const textoLimpio = `Hola Airdayz, quiero adquirir el servicio PREMIUM para mi bot. Mi ID de usuario es ${userId} y el servicio elegido es ${nombreServicio}. Indícame los pasos para el pago.`;
    
    const url = `https://t.me/Airdayz?text=${encodeURIComponent(textoLimpio)}`;
    abrirEnlaceSeguroTelegram(url);
}

// =========================================================================
// 👤 PANEL DE CONTROL DEL CREADOR (CONEXIÓN MANUAL POR ID)
// =========================================================================
function renderizarPanelCreador() {
    const grid = document.getElementById("creator-bots-grid");
    if (!grid) return;
    const userId = obtenerUserIdTelegramActual();

    const misBots = DIRECTORIO_BOTS_MAESTRO.filter(b => b.ownerId === userId);

    if (misBots.length === 0) {
        grid.innerHTML = `
            <div style="background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.15); padding: 20px; border-radius: 12px; text-align: center; font-size: 0.75rem; color: #94a3b8;">
                Aún no tienes bots vinculados a tu ID de Telegram en nuestro catálogo de forma manual.<br><br>
                <span style="color: #22d3ee; font-weight:800; cursor:pointer;" onclick="switchView('submit-bot')">👉 Enviar mi primer bot ahora</span>
            </div>
        `;
    } else {
        grid.innerHTML = misBots.map(bot => {
            let statusBadge = `<span style="color: #94a3b8; font-weight:800;">🟢 BÁSICO</span>`;
            if (bot.isPremium) statusBadge = `<span style="color: #a855f7; font-weight:900;">👑 PREMIUM ACTIVADO</span>`;
            else if (bot.isVerified) statusBadge = `<span style="color: #22d3ee; font-weight:800;">🔵 VERIFICADO</span>`;

            return `
                <div style="background: #111827; border: 1px solid rgba(255,255,255,0.08); padding: 12px; border-radius: 12px; display: flex; flex-direction: column; gap: 8px;">
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
    const texto = `SOLICITUD DE MODIFICACION - Bot ID: ${idInterno} - Username: @${username} - Creador ID: ${userId}. Hola Airdayz, quiero modificar los datos o el plan de este bot.`;
    
    const url = `https://t.me/Airdayz?text=${encodeURIComponent(texto)}`;
    abrirEnlaceSeguroTelegram(url);
}

// =========================================================================
// 📯 INTERACCIONES AUXILIARES GLOBALES
// =========================================================================
function lanzarReporteBot(username) {
    const userId = obtenerUserIdTelegramActual();
    const texto = `REPORTE DE ABUSO - Bot Reportado: @${username} - Reportado por ID: ${userId}. Hola Airdayz, este bot presenta fallos o irregularidades.`;
    
    const url = `https://t.me/Airdayz?text=${encodeURIComponent(texto)}`;
    abrirEnlaceSeguroTelegram(url);
}

function dispararAvisoValoracion() {
    const confirmar = confirm("¿Quieres dejar tu reseña oficial?\n\nTu valoración real ayuda a mantener la transparencia del ecosistema. Serás redirigido a nuestro canal oficial @Mundo_Bot para publicar tu opinión en los comentarios.");
    if (confirmar) {
        abrirEnlaceSeguroTelegram("https://t.me/Mundo_Bot");
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
