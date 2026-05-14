// ---------- УПРАВЛЕНИЕ ССЫЛКАМИ ----------
let userLinks = [
    { name: "DeepSeek", url: "https://www.deepseek.com/" },
    { name: "ВКонтакте", url: "https://vk.com/" },
    { name: "YouTube", url: "https://youtube.com/" },
    { name: "GitHub", url: "https://github.com/" },
    { name: "LMS Synergy", url: "https://lms.synergy.ru/" }
];

function getFaviconUrl(siteUrl) {
    try {
        let urlObj = new URL(siteUrl);
        return `${urlObj.origin}/favicon.ico`;
    } catch(e) { 
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/%3E%3C/svg%3E"; 
    }
}

function renderSiteTiles() {
    const container = document.getElementById('sites-list-container');
    if (!container) return;
    container.innerHTML = '';
    userLinks.forEach(link => {
        const li = document.createElement('li');
        li.className = 'top-site-outer';
        const a = document.createElement('a');
        a.className = 'top-site-button';
        a.href = link.url;
        a.target = '_blank';
        const tileDiv = document.createElement('div');
        tileDiv.className = 'tile';
        const img = document.createElement('img');
        img.src = getFaviconUrl(link.url);
        img.alt = link.name;
        img.onerror = () => { img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/%3E%3C/svg%3E"; };
        tileDiv.appendChild(img);
        const span = document.createElement('span');
        span.className = 'title-label';
        span.textContent = link.name;
        a.appendChild(tileDiv);
        a.appendChild(span);
        li.appendChild(a);
        container.appendChild(li);
    });
    localStorage.setItem('pravda_user_links', JSON.stringify(userLinks));
}

function renderLinkManageList() {
    const manageContainer = document.getElementById('links-list-container');
    if (!manageContainer) return;
    manageContainer.innerHTML = '';
    userLinks.forEach((link, idx) => {
        const div = document.createElement('div');
        div.className = 'link-item';
        div.innerHTML = `<span><strong>${escapeHtml(link.name)}</strong> — ${link.url.substring(0, 40)}</span>
                        <button data-index="${idx}" class="remove-link-btn">🗑️</button>`;
        manageContainer.appendChild(div);
    });
    document.querySelectorAll('.remove-link-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(btn.getAttribute('data-index'));
            if (!isNaN(index)) {
                userLinks.splice(index, 1);
                renderLinkManageList();
                renderSiteTiles();
                saveLinksToLocal();
            }
        });
    });
}

function escapeHtml(str) { 
    return str.replace(/[&<>]/g, function(m){
        if(m==='&') return '&amp;'; 
        if(m==='<') return '&lt;'; 
        if(m==='>') return '&gt;'; 
        return m;
    });
}

function saveLinksToLocal() { 
    localStorage.setItem('pravda_user_links', JSON.stringify(userLinks)); 
}

function loadLinksFromLocal() {
    const stored = localStorage.getItem('pravda_user_links');
    if (stored) {
        try { 
            const parsed = JSON.parse(stored); 
            if (Array.isArray(parsed) && parsed.length) userLinks = parsed; 
        } catch(e) {}
    }
    renderSiteTiles();
    renderLinkManageList();
}

function addNewLink() {
    const nameInput = document.getElementById('newLinkName');
    const urlInput = document.getElementById('newLinkUrl');
    let name = nameInput.value.trim();
    let url = urlInput.value.trim();
    if (!name || !url) { alert("Заполните название и URL"); return; }
    if (!url.startsWith('http')) url = 'https://' + url;
    userLinks.push({ name: name, url: url });
    renderSiteTiles();
    renderLinkManageList();
    nameInput.value = '';
    urlInput.value = '';
    saveLinksToLocal();
}

// ---------- НАСТРОЙКИ ----------
function applyThemeVariables() {
    const root = document.documentElement;
    root.style.setProperty('--accent-primary', localStorage.getItem('accentPrimary') || '#ff0000');
    root.style.setProperty('--accent-secondary', localStorage.getItem('accentSecondary') || '#00f3ff');
    root.style.setProperty('--bg-gradient-start', localStorage.getItem('gradStart') || '#1a0a1f');
    root.style.setProperty('--bg-gradient-end', localStorage.getItem('gradEnd') || '#05050f');
    const avatarRad = localStorage.getItem('avatarRadius') || '16';
    const tileRad = localStorage.getItem('tileRadius') || '14';
    root.style.setProperty('--avatar-radius', avatarRad + 'px');
    root.style.setProperty('--tile-radius', tileRad + 'px');
    const radiusSpan = document.getElementById('radiusValueDisplay');
    if (radiusSpan) radiusSpan.innerText = avatarRad + 'px';
    const tileSpan = document.getElementById('tileRadiusSpan');
    if (tileSpan) tileSpan.innerText = tileRad + 'px';
    document.body.style.background = `radial-gradient(circle at 10% 20%, var(--bg-gradient-start), var(--bg-gradient-end) 90%)`;
}

function saveColor(key, value) { 
    localStorage.setItem(key, value); 
    applyThemeVariables(); 
}

function setupColorPickers() {
    const accent = document.getElementById('accentColorPicker');
    const sec = document.getElementById('secColorPicker');
    const gradStart = document.getElementById('gradStartPicker');
    const gradEnd = document.getElementById('gradEndPicker');
    accent.value = localStorage.getItem('accentPrimary') || '#ff0000';
    sec.value = localStorage.getItem('accentSecondary') || '#00f3ff';
    gradStart.value = localStorage.getItem('gradStart') || '#1a0a1f';
    gradEnd.value = localStorage.getItem('gradEnd') || '#05050f';
    accent.addEventListener('input', (e) => saveColor('accentPrimary', e.target.value));
    sec.addEventListener('input', (e) => saveColor('accentSecondary', e.target.value));
    gradStart.addEventListener('input', (e) => saveColor('gradStart', e.target.value));
    gradEnd.addEventListener('input', (e) => saveColor('gradEnd', e.target.value));
}

function setupRadiusSliders() {
    const avatarSlider = document.getElementById('avatarRadiusSlider');
    const tileSlider = document.getElementById('tileRadiusSlider');
    avatarSlider.value = localStorage.getItem('avatarRadius') || '16';
    tileSlider.value = localStorage.getItem('tileRadius') || '14';
    avatarSlider.addEventListener('input', (e) => {
        let val = e.target.value;
        localStorage.setItem('avatarRadius', val);
        document.getElementById('radiusValueDisplay').innerText = val + 'px';
        applyThemeVariables();
    });
    tileSlider.addEventListener('input', (e) => {
        let val = e.target.value;
        localStorage.setItem('tileRadius', val);
        document.getElementById('tileRadiusSpan').innerText = val + 'px';
        applyThemeVariables();
    });
}

function resetAllSettings() {
    localStorage.removeItem('accentPrimary');
    localStorage.removeItem('accentSecondary');
    localStorage.removeItem('gradStart');
    localStorage.removeItem('gradEnd');
    localStorage.removeItem('avatarRadius');
    localStorage.removeItem('tileRadius');
    userLinks = [
        { name: "DeepSeek", url: "https://www.deepseek.com/" },
        { name: "ВКонтакте", url: "https://vk.com/" },
        { name: "YouTube", url: "https://youtube.com/" },
        { name: "GitHub", url: "https://github.com/" },
        { name: "LMS Synergy", url: "https://lms.synergy.ru/" }
    ];
    renderSiteTiles();
    renderLinkManageList();
    saveLinksToLocal();
    applyThemeVariables();
    setupColorPickers();
    document.getElementById('avatarRadiusSlider').value = '16';
    document.getElementById('tileRadiusSlider').value = '14';
    document.getElementById('radiusValueDisplay').innerText = '16px';
    document.getElementById('tileRadiusSpan').innerText = '14px';
}

// ---------- ПОГОДА ----------
async function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error();
        const data = await res.json();
        const temp = Math.round(data.current_weather.temperature);
        document.getElementById('weather-temp').textContent = `${temp}°C`;
        const code = data.current_weather.weathercode;
        const descMap = {
            0:'Ясно',1:'Преимущественно ясно',2:'Переменная облачность',3:'Пасмурно',
            45:'Туман',48:'Изморозь',51:'Морось',53:'Морось',55:'Морось',
            61:'Дождь',63:'Дождь',65:'Сильный дождь',71:'Снег',73:'Снег',
            75:'Сильный снег',80:'Ливень',81:'Ливень',82:'Сильный ливень',
            95:'Гроза',96:'Гроза',99:'Гроза'
        };
        document.getElementById('weather-desc').textContent = descMap[code] || 'Облачно';
    } catch(e) { 
        document.getElementById('weather-desc').textContent = 'Ошибка'; 
        document.getElementById('weather-temp').textContent = '--°C'; 
    }
}

function initWeather() {
    const select = document.getElementById('city-select');
    const [lat, lon] = select.value.split(',');
    fetchWeather(lat, lon);
    select.addEventListener('change', (e) => {
        const [newLat, newLon] = e.target.value.split(',');
        fetchWeather(newLat, newLon);
    });
}

// ---------- ПОИСК ----------
function initSearch() {
    const input = document.getElementById('search-input');
    input.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') {
            let q = input.value.trim();
            if(q) window.location.href = `https://duckduckgo.com/?q=${encodeURIComponent(q)}`;
        }
    });
}

// ---------- АВАТАР ----------
function setupAvatarCustom() {
    const avatarImg = document.getElementById('userAvatar');
    const saved = localStorage.getItem('pravda_avatar_custom');
    if(saved && saved !== avatarImg.src) {
        avatarImg.src = saved;
        avatarImg.onerror = () => {
            avatarImg.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23ff0000' rx='16'/%3E%3Ctext x='50' y='68' font-size='46' text-anchor='middle' fill='white' font-family='monospace'%3EPS%3C/text%3E%3C/svg%3E";
            localStorage.removeItem('pravda_avatar_custom');
        };
    }
    if(!document.getElementById('quickAvatarBtn')) {
        const avatarRow = document.createElement('div');
        avatarRow.className = 'setting-row';
        avatarRow.innerHTML = `<label>Аватар (URL)</label><input type="text" id="tempAvatarInput" placeholder="ссылка на картинку"><button id="quickAvatarBtn">Обновить</button>`;
        const firstGroup = document.querySelector('.settings-group');
        if(firstGroup) firstGroup.before(avatarRow);
        document.getElementById('quickAvatarBtn')?.addEventListener('click', () => {
            let url = document.getElementById('tempAvatarInput').value.trim();
            if(url) {
                avatarImg.src = url;
                avatarImg.onload = () => localStorage.setItem('pravda_avatar_custom', url);
                avatarImg.onerror = () => alert("Неверная ссылка");
                document.getElementById('tempAvatarInput').value = '';
            }
        });
    }
}

// ---------- НАСТРОЙКИ UI ----------
function initSettingsUI() {
    const btn = document.getElementById('personalize-btn');
    const menu = document.getElementById('customize-menu');
    const overlayDiv = document.getElementById('overlay');
    const closeBtn = document.getElementById('close-settings-btn');
    const resetBtn = document.getElementById('resetAllSettingsBtn');
    const addLinkBtn = document.getElementById('addLinkBtn');
    btn.onclick = () => { menu.style.display = 'block'; overlayDiv.style.display = 'block'; };
    const close = () => { menu.style.display = 'none'; overlayDiv.style.display = 'none'; };
    overlayDiv.onclick = close;
    closeBtn.onclick = close;
    resetBtn.onclick = () => { resetAllSettings(); close(); setTimeout(() => location.reload(), 80); };
    addLinkBtn.onclick = addNewLink;
}

// ---------- ИНИЦИАЛИЗАЦИЯ ----------
window.addEventListener('DOMContentLoaded', () => {
    loadLinksFromLocal();
    applyThemeVariables();
    setupColorPickers();
    setupRadiusSliders();
    initWeather();
    initSearch();
    setupAvatarCustom();
    initSettingsUI();
    renderLinkManageList();
});