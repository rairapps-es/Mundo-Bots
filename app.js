// =========================================================================
// 🗃️ BASE DE DATOS LOCAL MANUALLY MANAGED
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
        isPremium: true,       
        isVerified: true,      
        ownerId: "12345678",   
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
    }
];

let currentCategoryFilter = "Todos";
let activeTabGlobal = "catalog";
const PRECIO_BASE_PREMIUM_MES = 9.99;

// =========================================================================
// 🚀 CONEXIÓN TELEGRAM MINI APP SDK
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
    
    comprobarYDispararConfetiLogro();
    // Forzar renderizado inicial de la calculadora de la tienda
    actualizarCalculoContratacionPremium(1);
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

function obtenerCantidadFavoritos() {
    return (JSON.parse(localStorage.getItem("gplus_fav_bots")) || []).length;
}

// =========================================================================
// 👑 CONSTRUCTOR DE LA BARRA SUPERIOR PEGAJOSA (STICKY HEADER)
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
        
        #toast-master-container { position: fixed; top: 68px; left: 50%; transform: translateX(-50%); z-index: 10005; display: flex; flex-direction: column; gap: 8px; width: 90%; max-width: 360px; pointer-events: none; }
        .toast-card { padding: 10px 14px; background: #1e293b; border-left: 4px solid #3b82f6; color: #fff; font-size: 0.78rem; font-weight: 600; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.4); animation: slideDownToast 0.3s ease-out forwards; pointer-events: auto; }
        .toast-card.toast-success { border-left-color: #10b981; }
        .toast-card.toast-error { border-left-color: #ef4444; }
        .toast-card.toast-warning { border-left-color: #f59e0b; }
        @keyframes slideDownToast { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        
        .profile-sub-card { background: #111827; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px; margin-bottom: 16px; }
        .sub-grid-metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px; }
        .metric-sub-box { background: rgba(255,255,255,0.02); padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); }
        .metric-sub-title { font-size: 0.65rem; color: #64748b; font-weight: 700; text-transform: uppercase; }
        .metric-sub-value { font-size: 0.85rem; font-weight: 800; margin-top: 2px; color: #fff; }
        
        .period-selector-wrapper { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin: 10px 0; }
        .period-pill { background: #0f172a; border: 1px solid rgba(255,255,255,0.1); padding: 6px 2px; border-radius: 8px; text-align: center; cursor: pointer; color: #94a3b8; font-size: 0.65rem; font-weight: 700; transition: all 0.2s; }
        .period-pill.active { background: linear-gradient(135deg, #eab308, #ca8a04); color: #0f172a; border-color: transparent; font-weight: 800; box-shadow: 0 0 8px rgba(234,179,8,0.25); }
    `;
    document.head.appendChild(style);
}

// =========================================================================
// 🔀 REDIRECCIÓN DE ENLACES SEGUROS A TELEGRAM
// =========================================================================
function abrirEnlaceSeguroTelegram(url) {
    if (window.Telegram?.WebApp?.openTelegramLink && url.includes("t.me")) {
        window.Telegram.WebApp.openTelegramLink(url);
    } else if (window.Telegram?.WebApp?.openLink) {
        window.Telegram.WebApp.openLink(url);
    } else {
        const win = window.open(url, '_blank');
        if (win) win.focus();
    }
}

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
// 💳 CONSTRUCTOR DE TARJETAS DEL CATÁLOGO
// =========================================================================
function construirHtmlTarjetaBot(bot, contextualId) {
    const favorites = JSON.parse(localStorage.getItem("gplus_fav_bots")) || [];
    const esFav = favorites.includes(bot.id) ? "is-favorite" : "";
    const badgePremium = bot.isPremium ? `<span class="badge-premium-tag">👑 Premium</span>` : "";
    const badgeVerificado = bot.isVerified ? `<span class="badge-verified"><i data-lucide="badge-check" style="width:14px; height:14px; margin-left:2px; display:inline-block; vertical-align:middle;"></i></span>` : "";
    
    const domCardId = `card-${contextualId}-${bot.id}`;

    return `
        <div class="bot-card ${bot.isPremium ? 'premium-card' : ''}" id="${domCardId}">
            <div class="bot-card-header" onclick="toggleAcordeonTarjetaUnica('${domCardId}')">
                <img src="${bot.logo}" class="bot-logo" alt="Logo">
                <div class="bot-info-main">
                    <div class="bot-title-row" style="display:flex; align-items:center; gap:4px; flex-wrap:wrap;">
                        <span class="bot-title" style="font-weight:800; color:#fff;">${bot.titulo}</span>
                        ${badgeVerificado}
                        ${badgePremium}
                    </div>
                    <div class="bot-meta-row" style="font-size:0.7rem; color:#64748b; margin-top:2px;">
                        <span class="bot-stars" onclick="event.stopPropagation(); dispararAvisoValoracion();" style="cursor:pointer; color:#eab308;">⭐ ${bot.rating}</span>
   <span>•</span>
                        <span>${bot.idioma}</span>
                    </div>
                    <p class="bot-desc-short" style="font-size:0.75rem; color:#94a3b8; margin-top:4px;">${bot.descripcion_corta}</p>
                </div>
                <div class="bot-actions-right" onclick="event.stopPropagation();" style="display:flex; flex-direction:column; gap:6px; align-items:flex-end;">
                    <button class="btn-fav-heart ${esFav}" onclick="alternarEstadoFavorito('${bot.id}')" style="background:none; border:none; cursor:pointer;">
                        <i data-lucide="heart" style="width:18px; height:18px; fill:${favorites.includes(bot.id) ? '#ef4444' : 'none'}; color:${favorites.includes(bot.id) ? '#ef4444' : '#64748b'}"></i>
                    </button>
                    <button class="btn-launch" onclick="abrirEnlaceSeguroTelegram('https://t.me/${bot.username}')" style="padding:4px 10px; font-size:0.7rem; font-weight:700; border-radius:6px; cursor:pointer;">Abrir</button>
                </div>
            </div>
            <div class="bot-card-body">
                <div class="bot-body-content" style="padding:10px 0 4px 0; border-top:1px solid rgba(255,255,255,0.05); margin-top:8px;">
                    <p style="color:#cbd5e1; font-size:0.75rem; line-height:1.4;">${bot.descripcion_larga}</p>
                    <div class="bot-tags-row" style="display:flex; gap:4px; margin-top:8px; flex-wrap:wrap;">
                        ${bot.categorias.map(c => `<span class="tag-pill" style="font-size:0.6rem; padding:2px 6px; background:rgba(255,255,255,0.05); color:#94a3b8; border-radius:4px;">${c}</span>`).join('')}
                    </div>
                    <div class="extended-buttons" style="display:flex; gap:6px; margin-top:10px;">
                        ${bot.url_web ? `<button class="btn-ext" onclick="abrirEnlaceSeguroTelegram('${bot.url_web}')">🌐 Web</button>` : ''}
                        ${bot.url_soporte ? `<button class="btn-ext" onclick="abrirEnlaceSeguroTelegram('${bot.url_soporte}')">🛡️ Soporte</button>` : ''}
                        <button class="btn-ext" style="background:rgba(239,68,68,0.05); color:#f43f5e; border:1px solid rgba(239,68,68,0.15);" onclick="lanzarReporteBot('${bot.username}')">⚠️ Reportar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function toggleAcordeonTarjetaUnica(domId) {
    const elementoTarjeta = document.getElementById(domId);
    if (elementoTarjeta) elementoTarjeta.classList.toggle('is-expanded');
}

// =========================================================================
// ➕ FORMULARIO DE REGISTRO DE BOTS (CORREGIDO)
// =========================================================================
function enviarFormularioBotAlAdmin() {
    const title = document.getElementById("f-title")?.value.trim();
    let username = document.getElementById("f-user")?.value.trim();
    const lang = document.getElementById("f-lang")?.value.trim() || "No especificado";
    const shortDesc = document.getElementById("f-short")?.value.trim();
    const longDesc = document.getElementById("f-long")?.value.trim() || "";
    const userId = obtenerUserIdTelegramActual();

    if (!title || !username || !shortDesc) {
        lanzarToast("Por favor, rellena los campos obligatorios (*)", "error");
        return;
    }

    // Limpiar el @ si el usuario lo incluye manualmente para estandarizar
    username = username.replace('@', '');

    const plantillaTexto = `➕ SOLICITUD DE NUEVO BOT:\n- Nombre: ${title}\n- Username: @${username}\n- Idiomas: ${lang}\n- Dev ID: ${userId}\n- Breve: ${shortDesc}\n- Detalle: ${longDesc}`;
    
    lanzarToast("Abriendo chat de entrega...", "success");
    abrirEnlaceSeguroTelegram(`https://t.me/Airdayz?text=${encodeURIComponent(plantillaTexto)}`);
}

// =========================================================================
// 🛒 CALCULADORA Y COMPRA TIENDA PREMIUM (BLINDADO)
// =========================================================================
// =========================================================================
// 🛒 CALCULADORA Y COMPRA TIENDA PREMIUM (VERSIÓN ULTRA-BLINDADA)
// =========================================================================
function actualizarCalculoContratacionPremium(meses) {
    document.querySelectorAll('.period-pill').forEach(p => p.classList.remove('active'));
    const pillActiva = document.getElementById(`pill-${meses}m`);
    if(pillActiva) pillActiva.classList.add('active');

    let multiplicadorFactor = 1.0;
    if(meses === 3) multiplicadorFactor = 0.90; 
    if(meses === 6) multiplicadorFactor = 0.80; 
    if(meses === 12) multiplicadorFactor = 0.70; 

    const precioFinalCalculado = (9.99 * meses) * multiplicadorFactor;

    const divContenedorTotal = document.getElementById("premium-total-price-display");
    if(divContenedorTotal) {
        divContenedorTotal.innerHTML = `
            <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); padding:10px; border-radius:8px; text-align:center;">
                <span style="font-size:0.65rem; color:#64748b; display:block; text-transform:uppercase; font-weight:700;">Total a pagar (${meses} ${meses === 1 ? 'Mes' : 'Meses'})</span>
                <span style="font-size:1.15rem; font-weight:900; color:#eab308;">${precioFinalCalculado.toFixed(2)} €</span>
                ${meses > 1 ? `<span style="font-size:0.6rem; color:#10b981; display:block; margin-top:2px;">¡Ahorro del ${(100 - (multiplicadorFactor*100)).toFixed(0)}% Aplicado!</span>` : ''}
            </div>
        `;
    }
    
    const btnCompra = document.getElementById("btn-comprar-premium-action");
    if(btnCompra) {
        btnCompra.setAttribute("data-selected-period", `${meses} meses`);
        btnCompra.setAttribute("data-selected-price", `${precioFinalCalculado.toFixed(2)} EUR`);
    }
}

function procesarCompraPremiumDesdeUI() {
    const btnCompra = document.getElementById("btn-comprar-premium-action");
    
    // Respaldo de seguridad absoluta por si el DOM no ha leído el atributo
    let periodo = "1 meses";
    let total = "9.99 EUR";

    if (btnCompra && btnCompra.getAttribute("data-selected-period")) {
        periodo = btnCompra.getAttribute("data-selected-period");
        total = btnCompra.getAttribute("data-selected-price");
    }
    
    const userId = obtenerUserIdTelegramActual();
    
    lanzarToast("Redirigiendo al chat de Airdayz...", "success");
    const textoLimpio = `Hola Airdayz, quiero adquirir la Suscripción Premium Avanzada para mi bot. Mi ID de usuario de Telegram es: ${userId}. He seleccionado el periodo de ${periodo} por un total de ${total}.`;
    
    abrirEnlaceSeguroTelegram(`https://t.me/Airdayz?text=${encodeURIComponent(textoLimpio)}`);
}

function ejecutarCompraVerificadoDirecta() {
    const userId = obtenerUserIdTelegramActual();
    lanzarToast("Redirigiendo al chat de Airdayz...", "success");
    const textoLimpio = `Hola Airdayz, quiero adquirir la Insignia Check de Verificado (Pago Único) para mi bot. Mi ID de usuario es: ${userId}.`;
    
    abrirEnlaceSeguroTelegram(`https://t.me/Airdayz?text=${encodeURIComponent(textoLimpio)}`);
}

// =========================================================================
// 👤 PERFIL Y COBERTURA DE DATOS
// =========================================================================
function renderizarPanelCreador() {
    const userId = obtenerUserIdTelegramActual();
    const esPremium = comprobarSiUsuarioEsPremium(userId);
    const countBots = obtenerCantidadBotsUsuario(userId);
    
    renderizarModuloSuscripcionPerfil(esPremium, countBots);

    const grid = document.getElementById("creator-bots-grid");
    if (!grid) return;

    const misBots = DIRECTORIO_BOTS_MAESTRO.filter(b => b.ownerId === userId);

    if (misBots.length === 0) {
        grid.innerHTML = `
            <div style="background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.15); padding: 20px; border-radius: 12px; text-align: center; font-size: 0.75rem; color: #94a3b8;">
                Aún no tienes bots vinculados a tu ID en el catálogo.<br><br>
                <span style="color: #22d3ee; font-weight:800; cursor:pointer;" onclick="switchView('submit-bot')">👉 Enviar mi primer bot ahora</span>
            </div>
        `;
    } else {
        grid.innerHTML = misBots.map(bot => {
            let statusBadge = `<span style="color: #94a3b8; font-weight:800;">🟢 BÁSICO</span>`;
            if (bot.isPremium) statusBadge = `<span style="color: #a855f7; font-weight:900;">👑 PREMIUM ACTIVADO</span>`;
            else if (bot.isVerified) statusBadge = `<span style="color: #22d3ee; font-weight:800;">🔵 VERIFICADO</span>`;

            return `
                <div style="background: #111827; border: 1px solid rgba(255,255,255,0.08); padding: 12px; border-radius: 12px; display: flex; flex-direction: column; gap: 8px; margin-bottom: 8px;">
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
    if (window.lucide) window.lucide.createIcons();
}

function renderizarModuloSuscripcionPerfil(esPremium, countBots) {
    const wrapper = document.getElementById("user-subscription-module-wrapper");
    if (!wrapper) return; 

    const limitMax = esPremium ? 3 : 1;
    const slotsTxt = `${countBots} / ${limitMax}`;
    const countFavs = obtenerCantidadFavoritos();
    
    const fechaInicio = esPremium ? "12/01/2026" : "N/A";
    const fechaFin = esPremium ? "12/01/2027" : "N/A";
    
    let CTA_BotonHTML = '';
    if(!esPremium) {
        CTA_BotonHTML = `
            <button style="width:100%; margin-top:12px; background:linear-gradient(90deg, #eab308, #ca8a04); color:#0f172a; font-weight:800; border:none; padding:10px; border-radius:8px; cursor:pointer; font-size:0.75rem;" onclick="switchView('premium-store')">
                🚀 Ver Suscripciones de Pago en Tienda
            </button>
        `;
    }

    wrapper.innerHTML = `
        <div class="profile-sub-card">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:8px; margin-bottom:4px;">
                <h3 style="font-size:0.8rem; font-weight:800; color:#fff; margin:0;">Estado de la Cuenta</h3>
                <span style="font-size:0.6rem; font-weight:900; padding:2px 8px; border-radius:20px; ${esPremium ? 'background:rgba(234,179,8,0.15); color:#eab308;' : 'background:rgba(255,255,255,0.06); color:#94a3b8;'}">
                    ${esPremium ? 'PREMIUM VIP' : 'PLAN GRATUITO'}
                </span>
            </div>
            <div class="sub-grid-metrics">
                <div class="metric-sub-box">
                    <div class="metric-sub-title">Slots Utilizados</div>
                    <div class="metric-sub-value" style="${countBots > limitMax ? 'color:#f87171;' : 'color:#22d3ee;'}">${slotsTxt}</div>
                </div>
                <div class="metric-sub-box">
                    <div class="metric-sub-title">Mis Bots Indexados</div>
                    <div class="metric-sub-value">${countBots} total</div>
                </div>
                <div class="metric-sub-box">
                    <div class="metric-sub-title">Favoritos Guardados</div>
                    <div class="metric-sub-value" style="color:#f43f5e;">❤️ ${countFavs}</div>
                </div>
                <div class="metric-sub-box">
                    <div class="metric-sub-title">Periodo Duración</div>
                    <div class="metric-sub-value" style="font-size:0.75rem;">${esPremium ? '12 Meses' : 'Permanente'}</div>
                </div>
            </div>
            ${CTA_BotonHTML}
        </div>
    `;
}

// =========================================================================
// 🎉 EFECTO VISUAL CONFETI
// =========================================================================
function comprobarYDispararConfetiLogro() {
    const userId = obtenerUserIdTelegramActual();
    const count = obtenerCantidadBotsUsuario(userId);

    if (count > 0 && !localStorage.getItem(`gplus_confeti_disparado_${userId}`)) {
        localStorage.setItem(`gplus_confeti_disparado_${userId}`, "true");
        dispararEfectoVisualConfetiFisico();
    }
}

function dispararEfectoVisualConfetiFisico() {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed"; canvas.style.top = "0"; canvas.style.left = "0";
    canvas.style.width = "100vw"; canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none"; canvas.style.zIndex = "100000";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    let particulas = [];
    const colores = ["#22d3ee", "#3b82f6", "#eab308", "#a855f7"];

    for (let i = 0; i < 60; i++) {
        particulas.push({
            x: canvas.width / 2, y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 10, vy: (Math.random() - 0.7) * 12 - 3,
            radius: Math.random() * 4 + 3, color: colores[Math.floor(Math.random() * colores.length)],
            alpha: 1
        });
    }

    function renderFrame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let vivas = false;
        particulas.forEach(p => {
            p.x += p.vx; p.y += p.vy; p.vy += 0.3; p.alpha -= 0.02;
            if (p.alpha > 0) {
                vivas = true;
                ctx.save(); ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, p.radius * 2, p.radius * 2);
                ctx.restore();
            }
        });
        if (vivas) requestAnimationFrame(renderFrame); else canvas.remove();
    }
    renderFrame();
}

// =========================================================================
// 🔀 NAVEGACIÓN ENTRE VISTAS (SOPORTE DE NOMBRES INTEGRAL)
// =========================================================================
function switchView(viewId) {
    activeTabGlobal = viewId;
    
    // Homologación estricta para evitar desincronizaciones entre 'premium-shop' y 'premium-store'
    const cleanViewName = (viewId === 'premium-shop' || viewId === 'premium-store') ? 'premium-store' : viewId;
    const cleanTabName = (viewId === 'premium-shop' || viewId === 'premium-store') ? 'premium-shop' : viewId;

    document.querySelectorAll('.app-view').forEach(view => view.classList.remove('active-view'));
    document.querySelectorAll('.nav-item').forEach(tab => tab.classList.remove('active-tab'));
    
    const targetView = document.getElementById(`view-${cleanViewName}`);
    const targetTab = document.getElementById(`tab-${cleanTabName}`);
    
    if (targetView) targetView.classList.add('active-view');
    if (targetTab) targetTab.classList.add('active-tab');
    
    if (cleanViewName === 'catalog') renderizarFiltrosCategorias();
    if (cleanViewName === 'favorites') renderizarVistaFavoritos();
    if (cleanViewName === 'profile') renderizarPanelCreador();
    
    if (window.lucide) window.lucide.createIcons();
}

function extraerCategoriasUnicas() { 
    let cats = ["Todos"]; 
    DIRECTORIO_BOTS_MAESTRO.forEach(bot => { bot.categorias.forEach(c => { if (!cats.includes(c)) cats.push(c); }); }); 
    return cats; 
}

function renderizarFiltrosCategorias() { 
    const container = document.getElementById("categories-container"); 
    if (!container) return; 
    const lista = extraerCategoriasUnicas(); 
    container.innerHTML = lista.map(cat => `<button class="cat-btn ${currentCategoryFilter === cat ? 'active' : ''}" onclick="setCategoryFilter('${cat}')">${cat}</button>`).join(''); 
}

function setCategoryFilter(catName) { 
    currentCategoryFilter = catName; 
    renderizarFiltrosCategorias(); 
    filtrarCatalogoEnCaliente(); 
}

function filtrarCatalogoEnCaliente() { 
    const query = document.getElementById("main-search")?.value.toLowerCase().trim() || ""; 
    const grid = document.getElementById("catalog-grid"); 
    if (!grid) return; 
    
    let botsFiltrados = DIRECTORIO_BOTS_MAESTRO.filter(bot => { 
        return (currentCategoryFilter === "Todos" || bot.categorias.includes(currentCategoryFilter)) && 
               (bot.titulo.toLowerCase().includes(query) || bot.username.toLowerCase().includes(query) || bot.descripcion_corta.toLowerCase().includes(query)); 
    }); 
    
    const counter = document.getElementById("counter-results");
    if (counter) counter.innerText = `Mostrando ${botsFiltrados.length} bots`; 
    
    grid.innerHTML = botsFiltrados.map(bot => construirHtmlTarjetaBot(bot, 'cat')).join(''); 
    if (window.lucide) window.lucide.createIcons(); 
}

function alternarEstadoFavorito(botId) { 
    let favorites = JSON.parse(localStorage.getItem("gplus_fav_bots")) || []; 
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
        grid.innerHTML = `<div style="text-align:center; padding: 40px; font-size: 0.8rem; color: #64748b;"><p>No tienes ningún bot en favoritos.</p></div>`; 
    } else { 
        grid.innerHTML = botsFavoritos.map(bot => construirHtmlTarjetaBot(bot, 'fav')).join(''); 
    } 
    if (window.lucide) window.lucide.createIcons(); 
}

function solicitarModificacionCambioBot(idInterno, username) { 
    const userId = obtenerUserIdTelegramActual(); 
    const texto = `SOLICITUD DE MODIFICACION - Bot ID: ${idInterno} - Username: @${username} - Creador ID: ${userId}. Hola Airdayz, quiero modificar los datos de este bot.`; 
    abrirEnlaceSeguroTelegram(`https://t.me/Airdayz?text=${encodeURIComponent(texto)}`); 
}

function lanzarReporteBot(username) { 
    const userId = obtenerUserIdTelegramActual(); 
    const texto = `REPORTE DE ABUSO - Bot Reportado: @${username} - Reportado por ID: ${userId}.`; 
    abrirEnlaceSeguroTelegram(`https://t.me/Airdayz?text=${encodeURIComponent(texto)}`); 
}

function dispararAvisoValoracion() { 
    // Cuadro de confirmación nativo que no rompe la interfaz táctil de Telegram
    const aceptarReseña = confirm("¿Quieres escribir una reseña para este bot?\n\nSerás redirigido a nuestra comunidad para dejar tu valoración y estrellas.");
    
    if (aceptarReseña) {
        lanzarToast("Abriendo canal de opiniones...", "success");
        // Cambia este enlace por el link directo a tu grupo/canal de reviews si lo deseas
        abrirEnlaceSeguroTelegram("https://t.me/Mundo_Bot"); 
    }
}

// =========================================================================
// DISPARADOR DOM READY DE SEGURIDAD
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
    if (window.lucide) window.lucide.createIcons();
    inicializarDatosTelegram();
    renderizarFiltrosCategorias();
    filtrarCatalogoEnCaliente();
});
