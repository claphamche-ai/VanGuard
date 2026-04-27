// ==========================================
// VANGUARD V5.0.0 - UNIFIED MASTER LOGIC
// ==========================================
const BRAND_NAME = "VanGuard";

const CoreDB = {
    defaultSchema: [
        { "id": "srn", "label": "Service Request Number (SRN)", "type": "text", "tenantVisible": true, "tenantMandatory": false, "options": null },
        { "id": "workers", "label": "Number of Workers", "type": "select", "tenantVisible": true, "tenantMandatory": true, "options": [ { "name": "1 Worker (Default)", "visible": true }, { "name": "2 Workers", "visible": true } ] },
        { "id": "area", "label": "Repaired Area (m²)", "type": "select", "tenantVisible": true, "tenantMandatory": true, "options": [ { "name": "0.5", "visible": true }, { "name": "1", "visible": true } ] }
    ],
    defaultFlags: { liveTracking: true, directAssignment: true },
    defaultTenants: [
        { "id": "T001", "name": "Porirua City Council", "tier": "City A", "licenses": 15, "status": "ACTIVE", "motto": "Mo Te Katoa Nga Iwi", "logo": "", "homeLat": -41.135, "homeLng": 174.84, "defaultZoom": 14, "reportEmail": "info@poriruacity.govt.nz" },
        { "id": "T002", "name": "Wellington City Council", "tier": "City B", "licenses": 50, "status": "ACTIVE", "motto": "Absolutely Positively Wellington", "logo": "", "homeLat": -41.2865, "homeLng": 174.7762, "defaultZoom": 14, "reportEmail": "info@wcc.govt.nz" }
    ],
    defaultUsers: [
        { id: "U001", username: "admin", password: "123", role: "admin", tenantId: "T001", name: "Porirua Admin", status: "ACTIVE", allowedLayers: [] },
        { id: "U002", username: "worker", password: "123", role: "agent", tenantId: "T001", name: "John Doe", status: "ACTIVE", allowedLayers: [] },
        { id: "U003", username: "dispatch", password: "123", role: "dispatch", tenantId: "T001", name: "Jane Smith", status: "ACTIVE", allowedLayers: [] }
    ],
    
    getFlags: function() { let mem = localStorage.getItem('vg_flags'); if(!mem) { localStorage.setItem('vg_flags', JSON.stringify(this.defaultFlags)); mem = localStorage.getItem('vg_flags'); } return JSON.parse(mem); },
    saveFlags: function(data) { localStorage.setItem('vg_flags', JSON.stringify(data)); },
    getSchema: function() { let mem = localStorage.getItem('vg_schema'); if(!mem) { localStorage.setItem('vg_schema', JSON.stringify(this.defaultSchema)); mem = localStorage.getItem('vg_schema'); } return JSON.parse(mem); },
    saveSchema: function(data) { localStorage.setItem('vg_schema', JSON.stringify(data)); },
    getTenants: function() {
        let mem = localStorage.getItem('tt_tenants'); if(!mem) { localStorage.setItem('tt_tenants', JSON.stringify(this.defaultTenants)); return this.defaultTenants; }
        let parsed = JSON.parse(mem); let needsPatch = false;
        parsed.forEach(pt => { if(typeof pt.reportEmail === 'undefined') { pt.reportEmail = "info@council.govt.nz"; needsPatch = true; } });
        if(needsPatch) this.saveTenants(parsed); return parsed;
    },
    saveTenants: function(data) { localStorage.setItem('tt_tenants', JSON.stringify(data)); },
    getUsers: function() {
        let mem = localStorage.getItem('tt_users'); if(!mem) { localStorage.setItem('tt_users', JSON.stringify(this.defaultUsers)); return this.defaultUsers; }
        let parsed = JSON.parse(mem); let patched = false;
        parsed.forEach(u => { if(typeof u.allowedLayers === 'undefined') { u.allowedLayers = []; patched = true; } });
        if(patched) this.saveUsers(parsed); return parsed;
    },
    saveUsers: function(data) { localStorage.setItem('tt_users', JSON.stringify(data)); },
    getCustomKMLs: function() { return JSON.parse(localStorage.getItem('tt_custom_kmls') || '[]'); },
    saveCustomKMLs: function(data) { localStorage.setItem('tt_custom_kmls', JSON.stringify(data)); },
    getJobBank: function() { return JSON.parse(localStorage.getItem('tt_jobbank') || '[]'); },
    saveJobBank: function(data) { localStorage.setItem('tt_jobbank', JSON.stringify(data)); },
    getShifts: function() { return JSON.parse(localStorage.getItem('tt_shifts') || '[]'); },
    saveShifts: function(data) { localStorage.setItem('tt_shifts', JSON.stringify(data)); },
    getReports: function() { return JSON.parse(localStorage.getItem('tt_reports') || '[]'); },
    saveReports: function(data) { localStorage.setItem('tt_reports', JSON.stringify(data)); },
    getActiveTenantId: function() { return localStorage.getItem('vg_active_tenant') || "T001"; },
    setActiveTenantId: function(id) { localStorage.setItem('vg_active_tenant', id); },
    getTenantJobs: function() { 
        let jobs = this.getJobBank().filter(j => j.tenantId === this.getActiveTenantId());
        const user = this.getActiveUser();
        if(user && user.role === 'agent' && this.getFlags().directAssignment) { jobs = jobs.filter(j => !j.assignedTo || j.assignedTo === 'UNASSIGNED' || j.assignedTo === user.id); }
        return jobs;
    },
    getJob: function(jobId) { return this.getJobBank().find(j => j.jobId === jobId); },
    pushJob: function(jobObj) { 
        let b = this.getJobBank(); jobObj.tenantId = this.getActiveTenantId(); 
        jobObj.jobId = jobObj.jobId || ('J-' + Date.now() + '-' + Math.floor(Math.random() * 1000)); 
        const activeShift = this.getActiveShift(); if(activeShift && jobObj.type !== 'PENDING') { jobObj.shiftId = activeShift.shiftId; }
        b.unshift(jobObj); this.saveJobBank(b); 
    },
    getActiveUser: function() { const activeUsername = localStorage.getItem('vg_active_user'); if(!activeUsername) return null; return this.getUsers().find(u => u.username === activeUsername); },
    getActiveShift: function() { const user = this.getActiveUser(); if(!user) return null; return this.getShifts().find(s => s.userId === user.id && s.status === 'OPEN'); },
    createShift: function() {
        const user = this.getActiveUser(); if(!user) return null; let shifts = this.getShifts();
        const newShift = { shiftId: 'SHIFT-' + Date.now(), tenantId: this.getActiveTenantId(), userId: user.id, username: user.name || user.username, startTime: new Date().toISOString(), endTime: null, status: 'OPEN', breadcrumbs: [] };
        shifts.push(newShift); this.saveShifts(shifts); return newShift;
    },
    closeShift: function() { let shifts = this.getShifts(); const user = this.getActiveUser(); const idx = shifts.findIndex(s => s.userId === user.id && s.status === 'OPEN'); if(idx !== -1) { shifts[idx].status = 'CLOSED'; shifts[idx].endTime = new Date().toISOString(); this.saveShifts(shifts); } },
    addBreadcrumb: function(lat, lng) { let shifts = this.getShifts(); const user = this.getActiveUser(); if(!user) return; const idx = shifts.findIndex(s => s.userId === user.id && s.status === 'OPEN'); if(idx !== -1) { shifts[idx].breadcrumbs.push({ lat: lat, lng: lng, ts: new Date().toISOString() }); this.saveShifts(shifts); } },
    pushReport: function(reportObj) { let r = this.getReports(); reportObj.tenantId = this.getActiveTenantId(); reportObj.id = 'REP-' + Date.now(); reportObj.timestamp = new Date().toLocaleString('en-NZ'); reportObj.status = 'NEW'; r.unshift(reportObj); this.saveReports(r); }
};

const UI = {
    openLeftSidebar: () => document.getElementById('left-sidebar').classList.add('open'), closeLeftSidebar: () => document.getElementById('left-sidebar').classList.remove('open'),
    openRightSidebar: () => document.getElementById('right-sidebar').classList.add('open'), closeRightSidebar: () => document.getElementById('right-sidebar').classList.remove('open'),
    toggleLayerList: () => { const el = document.getElementById('layer-container'); el.style.display = (el.style.display === 'block') ? 'none' : 'block'; },
    openOverlay: (id) => { document.querySelectorAll('.full-overlay').forEach(o => o.style.display = 'none'); document.getElementById(id + '-overlay').style.display = 'flex'; },
    closeOverlay: (id) => { document.getElementById(id + '-overlay').style.display = 'none'; },
    openPopup: (id) => document.getElementById(id).style.display = 'block', closePopup: (id) => document.getElementById(id).style.display = 'none',
    toggleFS: () => { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); },
    toggleSubRow: (rowId, iconId) => { const r = document.getElementById(rowId); const i = document.getElementById(iconId); if(!r) return; if(r.style.display === 'none' || r.style.display === '') { r.style.display = 'table-row'; i.innerText = '▼'; } else { r.style.display = 'none'; i.innerText = '▶'; } },
    lockoutScreen: function(role, tenantStatus, tenantName) { if (role === 'agent') { document.body.innerHTML = `<div style="display:flex; height:100vh; width:100vw; background:#f4f6f8; align-items:center; justify-content:center; padding:20px; box-sizing:border-box;"><div style="background:#fff; padding:40px; border-radius:15px; box-shadow:0 10px 30px rgba(0,0,0,0.1); text-align:center; max-width:400px;"><div style="font-size:50px; margin-bottom:20px;">🛑</div><h2 style="color:#e74c3c; margin-top:0; text-transform:uppercase;">SERVICE UNAVAILABLE</h2><p style="color:#555; font-weight:bold;">Report to dispatch error code: <br><span style="color:#000; font-size:18px; display:inline-block; margin-top:10px; padding:5px 10px; background:#eee; border-radius:5px;">ERR-${tenantStatus}</span></p><button class="std-btn gray" style="margin-top:20px;" onclick="location.href='index.html'">Return to Login</button></div></div>`; } },
    processAndWatermarkImage: function(file, callback) {
        const reader = new FileReader(); reader.onload = function(e) {
            const img = new Image(); img.onload = function() {
                const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); const MAX_DIM = 1920; let width = img.width; let height = img.height;
                if(width > height) { if(width > MAX_DIM) { height *= MAX_DIM / width; width = MAX_DIM; } } else { if(height > MAX_DIM) { width *= MAX_DIM / height; height = MAX_DIM; } }
                canvas.width = width; canvas.height = height; ctx.drawImage(img, 0, 0, width, height);
                const latlng = (window._mapEngine && window._mapEngine.userMarker) ? window._mapEngine.userMarker.getLatLng() : {lat: 0, lng: 0};
                const dateStr = new Date().toLocaleString('en-NZ'); const watermarkText = `LAT: ${latlng.lat.toFixed(5)} LON: ${latlng.lng.toFixed(5)} | DATE: ${dateStr}`;
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; ctx.fillRect(0, height - 50, width, 50); ctx.font = 'bold 18px monospace'; ctx.fillStyle = '#ffea00'; ctx.fillText(watermarkText, 20, height - 20);
                callback(canvas.toDataURL('image/jpeg', 0.8));
            }; img.src = e.target.result;
        }; reader.readAsDataURL(file);
    }
};

class MapEngine {
    constructor(mapId, role) {
        this.mapId = mapId;
        setTimeout(() => {
            const activeTenant = CoreDB.getTenants().find(t => t.id === CoreDB.getActiveTenantId());
            const lat = activeTenant ? activeTenant.homeLat : -41.135; const lng = activeTenant ? activeTenant.homeLng : 174.84; const z = activeTenant ? activeTenant.defaultZoom : 14;
            this.map = L.map(this.mapId, { zoomControl: false }).setView([lat, lng], z);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
            this.layers = {}; this.role = role; this.userMarker = null; this.searchMarker = null; this.agentLiveMarkers = {}; 
            this.loadKML(); if(this.role === 'agent') this.initGPS(); 
            if(this.role === 'dispatch' && CoreDB.getFlags().liveTracking) { this.pollActiveAgents(); setInterval(() => this.pollActiveAgents(), 30000); }
            this.map.invalidateSize();
        }, 100);
    }
    loadKML() {
        const container = document.getElementById('layer-container'); if(!container) return;
        const activeUser = CoreDB.getActiveUser(); const isAdmin = activeUser && activeUser.role === 'admin'; const allowed = activeUser ? activeUser.allowedLayers : [];
        const customKMLs = CoreDB.getCustomKMLs().filter(k => k.tenantId === CoreDB.getActiveTenantId() && k.status === 'ACTIVE');
        customKMLs.forEach(item => { if(isAdmin || allowed.includes(item.id)) this.processKMLLayer(item, true); });
        window._mapEngine = this; 
    }
    processKMLLayer(item, isCustomStr) {
        const container = document.getElementById('layer-container'); const div = document.createElement('div'); div.className = 'layer-item';
        div.innerHTML = `<label><input type="checkbox" checked onchange="window._mapEngine.toggleLayer('${item.label}', this.checked)"> ${item.icon} ${item.label}</label>`;
        container.appendChild(div); const group = L.featureGroup(); this.layers[item.label] = group; const self = this;
        const customLayer = L.geoJson(null, {
            style: () => ({ color: item.color, weight: 6, opacity: 0.7 }),
            pointToLayer: (feature, latlng) => {
                const marker = L.marker(latlng, { icon: L.divIcon({ className: '', html: `<div class="marker-inner" style="background-color: ${item.color}; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; font-size: 18px;">${item.icon}</div>`, iconSize: [38, 38], iconAnchor: [19, 19] }) });
                marker.on('click', (e) => self.handleAssetClick(e, feature.properties?.name, item.label, feature.properties?.address, false)); return marker;
            }
        });
        let runLayer = isCustomStr ? omnivore.kml.parse(item.kmlString, null, customLayer) : omnivore.kml(item.file, null, customLayer);
        runLayer.on('ready', () => {
            runLayer.eachLayer(layer => {
                if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
                    const centerMarker = L.marker(layer.getBounds().getCenter(), { icon: L.divIcon({ className: '', html: `<div class="marker-inner" style="background-color: ${item.color}; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; font-size: 18px;">${item.icon}</div>`, iconSize: [38, 38], iconAnchor: [19, 19] }) });
                    centerMarker.on('click', (e) => self.handleAssetClick(e, layer.feature?.properties?.name, item.label, layer.feature?.properties?.address, false)); group.addLayer(centerMarker);
                }
            }); self.map.addLayer(group);
        }); group.addLayer(runLayer);
    }
    toggleLayer(name, show) { if(show) this.map.addLayer(this.layers[name]); else this.map.removeLayer(this.layers[name]); }
    handleAssetClick(event, name, type, address, isOneOff) {
        L.DomEvent.stopPropagation(event); const safeName = name || "Unknown Site";
        if(this.role === 'agent') { AgentCtrl.activeSite = { name: safeName, type: type }; document.getElementById('s-name').innerText = safeName; document.getElementById('s-type').innerText = type; document.getElementById('s-address').value = address || ""; UI.openPopup('site-info'); } 
        else if (this.role === 'dispatch') { DispatchCtrl.activeSite = { name: safeName, type: type, address: address, isOneOff: isOneOff }; document.getElementById('s-name').innerText = safeName; document.getElementById('s-type').innerText = type; document.getElementById('s-address').value = address || ""; UI.openPopup('site-info'); }
    }
    initGPS() {
        this.userMarker = L.marker([0,0], { icon: L.divIcon({ className: '', html: '<div class="van-inner" style="font-size: 40px; transform: rotate(90deg); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));">🚐</div>', iconSize: [40,40], iconAnchor: [20,20] }) }).addTo(this.map);
        this.userMarker.on('click', () => AgentCtrl.openVanHUD());
        if(navigator.geolocation) { navigator.geolocation.watchPosition(pos => { this.userMarker.setLatLng([pos.coords.latitude, pos.coords.longitude]); }, err => console.warn(err), { enableHighAccuracy: true }); }
    }
    pollActiveAgents() {
        const shifts = CoreDB.getShifts().filter(s => s.tenantId === CoreDB.getActiveTenantId() && s.status === 'OPEN');
        shifts.forEach(shift => {
            if(shift.breadcrumbs && shift.breadcrumbs.length > 0) {
                const lastPing = shift.breadcrumbs[shift.breadcrumbs.length - 1]; const ts = new Date(lastPing.ts).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                const popupContent = `<div style="text-align:center;"><h4 style="margin:0;">${shift.username}</h4><small>Ping: ${ts}</small><br><button class="std-btn blue" style="padding:5px; margin-top:5px; font-size:10px;" onclick="DispatchCtrl.openAgentTracker('${shift.userId}', '${shift.username}')">Shift History</button></div>`;
                if(this.agentLiveMarkers[shift.userId]) { this.agentLiveMarkers[shift.userId].setLatLng([lastPing.lat, lastPing.lng]).getPopup().setContent(popupContent); } 
                else { this.agentLiveMarkers[shift.userId] = L.marker([lastPing.lat, lastPing.lng], { icon: L.divIcon({ className: '', html: `<div style="font-size: 30px; transform: rotate(90deg); filter: drop-shadow(0 2px 4px rgba(231, 76, 60, 0.8));">🚐</div>`, iconSize: [30,30], iconAnchor: [15,15] }) }).bindPopup(popupContent).addTo(this.map); }
            }
        });
    }
}

const AgentCtrl = {
    activeSite: { name: "", type: "" }, workState: { startTime: null, accumulated: 0 }, timerInterval: null, wakeLock: null, breadcrumbInterval: null,
    init: function() {
        const activeId = CoreDB.getActiveTenantId(); const t = CoreDB.getTenants().find(x => x.id === activeId); if (t && t.status !== 'ACTIVE') { UI.lockoutScreen('agent', t.status, t.name); return; }
        new MapEngine('map', 'agent'); this.renderFields(); setInterval(() => { const el = document.getElementById('menu-clock'); if(el) el.innerText = new Date().toLocaleString('en-NZ', { dateStyle: 'medium', timeStyle: 'short' }); }, 1000);
        const openShift = CoreDB.getActiveShift(); if(openShift) { UI.closeOverlay('shift'); this.requestWakeLock(); this.startBreadcrumbs(); } else { UI.openOverlay('shift'); }
        this.renderSidebarBank();
    },
    renderSidebarBank: function() {
        const list = document.getElementById('sidebar-job-bank'); if(!list) return; const user = CoreDB.getActiveUser(); if(!user) return;
        let jobs = CoreDB.getJobBank().filter(j => j.tenantId === CoreDB.getActiveTenantId() && j.type === 'PENDING');
        if(CoreDB.getFlags().directAssignment) jobs = jobs.filter(j => !j.assignedTo || j.assignedTo === 'UNASSIGNED' || j.assignedTo === user.id);
        if (jobs.length === 0) { list.innerHTML = '<p style="text-align:center; color:#888; font-size:12px;">No pending jobs.</p>'; return; }
        list.innerHTML = jobs.map(j => {
            const border = j.assignedTo === user.id ? '#2ecc71' : '#f1c40f';
            return `<div style="background:#f9f9f9; border-left:4px solid ${border}; padding:10px; margin-bottom:5px; border-radius:3px; cursor:pointer;" onclick="AgentCtrl.handleJobClick('${j.jobId}')"><strong style="font-size:11px;">${j.site}</strong></div>`;
        }).join('');
    },
    async handleJobClick(jobId) {
        UI.closeLeftSidebar(); const job = CoreDB.getJob(jobId); if(!job) return; this.activeSite = { name: job.site, type: "Dispatched Job" };
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(job.site)}&countrycodes=nz`); const data = await res.json();
        let lat, lng; if(data.length > 0) { lat = parseFloat(data[0].lat); lng = parseFloat(data[0].lon); window._mapEngine.map.setView([lat, lng], 17); } else { lat = -41.135; lng = 174.84; }
        const assignBtn = (!job.assignedTo || job.assignedTo === 'UNASSIGNED') ? `<button class="std-btn green" onclick="AgentCtrl.acceptJob('${jobId}')">Accept</button>` : `<button class="std-btn yellow" onclick="AgentCtrl.openOverlay('work')">Begin</button>`;
        const content = `<div style="min-width:150px;"><h4>${job.site}</h4><div style="display:grid; grid-template-columns:1fr 1fr; gap:5px;">${assignBtn}<button class="std-btn blue" onclick="AgentCtrl.routeTo('${job.site}')">Route</button></div></div>`;
        if(window._mapEngine.searchMarker) window._mapEngine.map.removeLayer(window._mapEngine.searchMarker);
        window._mapEngine.searchMarker = L.marker([lat, lng]).addTo(window._mapEngine.map).bindPopup(content).openPopup();
    },
    acceptJob: function(jobId) { let bank = CoreDB.getJobBank(); const idx = bank.findIndex(j => j.jobId === jobId); if(idx !== -1) { bank[idx].assignedTo = CoreDB.getActiveUser().id; CoreDB.saveJobBank(bank); this.renderSidebarBank(); window._mapEngine.searchMarker.closePopup(); } },
    routeTo: function(address) { window.open(`http://googleusercontent.com/maps.google.com/8${encodeURIComponent(address)}`, '_blank'); },
    openVanHUD: function() {
        const shift = CoreDB.getActiveShift(); if(!shift) return; const user = CoreDB.getActiveUser();
        const diffMs = new Date() - new Date(shift.startTime); const timeStr = `${Math.floor(diffMs / 3600000)}h ${Math.floor((diffMs % 3600000) / 60000)}m`;
        const html = `<div style="min-width:180px;"><h4>🚐 HUD: ${user.name}</h4><div>Time: ${timeStr}</div><button class="std-btn gray" style="padding:5px; font-size:10px;" onclick="AgentCtrl.showHistory()">Shift History</button></div>`;
        window._mapEngine.userMarker.bindPopup(html).openPopup();
    },
    showHistory: function() {
        const shift = CoreDB.getActiveShift(); const jobs = CoreDB.getTenantJobs().filter(j => j.shiftId === shift.shiftId && j.type === 'COMPLETED');
        document.getElementById('agent-history-list').innerHTML = jobs.map(j => `<div style="background:#f4f6f8; padding:10px; margin-bottom:5px; border-radius:5px;"><strong>${j.site}</strong><br><small>${j.pausedAt}</small></div>`).join('') || "No jobs completed.";
        UI.openOverlay('agent-history');
    },
    startShift: function() { CoreDB.createShift(); UI.closeOverlay('shift'); this.requestWakeLock(); this.startBreadcrumbs(); },
    endShift: function() { if(confirm("End Shift?")) { CoreDB.closeShift(); this.releaseWakeLock(); clearInterval(this.breadcrumbInterval); window.location.href = 'index.html'; } },
    async requestWakeLock() { if ('wakeLock' in navigator) try { this.wakeLock = await navigator.wakeLock.request('screen'); } catch (e) {} },
    releaseWakeLock() { if (this.wakeLock) this.wakeLock.release(); },
    startBreadcrumbs() { this.breadcrumbInterval = setInterval(() => { if(window._mapEngine && window._mapEngine.userMarker) { const pos = window._mapEngine.userMarker.getLatLng(); if(pos.lat !== 0) CoreDB.addBreadcrumb(pos.lat, pos.lng); } }, 30000); },
    renderFields: function() {
        const containers = document.querySelectorAll('.dynamic-fields-render'); let html = '';
        CoreDB.getSchema().forEach(f => { if(f.tenantVisible) { if(f.type==='select') { html += `<select id="field-${f.id}" class="std-input"><option value="">${f.label}...</option>`; f.options.forEach(o => { if(o.visible) html += `<option value="${o.name}">${o.name}</option>`; }); html += `</select>`; } else { html += `<input type="text" id="field-${f.id}" class="std-input" placeholder="${f.label}">`; } } });
        containers.forEach(c => c.innerHTML = html);
    },
    toggleWetDayForm: (cb) => document.getElementById('wet-day-fields').style.display = cb.checked ? 'block' : 'none',
    openOverlay: function(type) { UI.closePopup('site-info'); document.querySelectorAll('.target-site-name').forEach(el => el.innerText = this.activeSite.name); UI.openOverlay(type); },
    handlePhoto: function(step) {
        const input = document.getElementById('photo-' + step); const btn = document.getElementById('btn-' + step); if(!input || !input.files[0]) return;
        UI.processAndWatermarkImage(input.files[0], (dataUrl) => { btn.classList.add('done'); btn.style.backgroundImage = `url(${dataUrl})`; btn.innerHTML = `✓ ${step.toUpperCase()}`; if(step==='before' || step==='start') { this.workState.startTime = new Date(); this.startTimer(); document.getElementById('pause-work-btn').disabled = false; } else { document.getElementById('submit-work-btn').disabled = false; } });
    },
    startTimer: function() { document.getElementById('live-timer-widget').style.display = 'block'; this.timerInterval = setInterval(() => { const secs = Math.floor((new Date() - this.workState.startTime) / 1000); document.getElementById('live-timer-widget').innerText = `${Math.floor(secs/60)}:${(secs%60).toString().padStart(2,'0')}`; }, 1000); },
    stopTimer: function() { clearInterval(this.timerInterval); document.getElementById('live-timer-widget').style.display = 'none'; },
    cancelJob: function() { this.stopTimer(); UI.closeOverlay('work'); },
    pauseJob: function() { CoreDB.pushJob({ site: this.activeSite.name, type: 'WORK', pausedAt: new Date().toLocaleString('en-NZ') }); this.stopTimer(); UI.closeOverlay('work'); this.renderSidebarBank(); },
    submitWork: function() { alert("Submitted."); this.stopTimer(); UI.closeOverlay('work'); this.renderSidebarBank(); },
    cancelInsp: function() { this.stopTimer(); UI.closeOverlay('inspection'); },
    submitInsp: function() {
        if(document.getElementById('insp-flag-future').checked) CoreDB.pushJob({ site: this.activeSite.name, type: 'PENDING', srn: document.getElementById('insp-srn-input').value, assignedTo: 'UNASSIGNED', pausedAt: new Date().toLocaleString('en-NZ') });
        this.stopTimer(); UI.closeOverlay('inspection'); this.renderSidebarBank();
    },
    submitReport: function() { CoreDB.pushReport({ site: this.activeSite.name, type: document.getElementById('report-type').value, notes: document.getElementById('report-notes').value, reportedBy: CoreDB.getActiveUser().name }); UI.closeOverlay('report-issue'); }
};

const DispatchCtrl = {
    activeSite: { name: "", type: "", address: "" },
    init: function() { const activeId = CoreDB.getActiveTenantId(); const t = CoreDB.getTenants().find(x => x.id === activeId); if (t && t.status !== 'ACTIVE') { UI.lockoutScreen('dispatch', t.status, t.name); return; } new MapEngine('dispatch-map', 'dispatch'); this.renderBank('PENDING'); },
    async searchAddress() {
        const query = document.getElementById('dispatch-search').value; if(!query) return;
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=nz`); const data = await res.json();
        if(data.length > 0) { const lat = parseFloat(data[0].lat); const lon = parseFloat(data[0].lon); window._mapEngine.map.setView([lat, lon], 17); const m = L.marker([lat, lon]).addTo(window._mapEngine.map); m.on('click', (e) => window._mapEngine.handleAssetClick(e, data[0].display_name.split(',')[0], "Site", data[0].display_name, true)); m.fire('click'); }
    },
    openDispatchForm: function() { 
        document.getElementById('dispatch-target-name').innerText = this.activeSite.name;
        if(CoreDB.getFlags().directAssignment) { const agents = CoreDB.getUsers().filter(u => u.role === 'agent' && u.tenantId === CoreDB.getActiveTenantId()); document.getElementById('dispatch-assign').innerHTML = '<option value="UNASSIGNED">Open Pool</option>' + agents.map(a => `<option value="${a.id}">${a.name}</option>`).join(''); document.getElementById('assign-container').style.display = 'block'; }
        UI.openOverlay('dispatch'); 
    },
    openHistory: function() { UI.openOverlay('history'); },
    submitJob: function() { CoreDB.pushJob({ site: this.activeSite.name, srn: document.getElementById('dispatch-srn').value, type: 'PENDING', assignedTo: document.getElementById('dispatch-assign').value, pausedAt: new Date().toLocaleString('en-NZ') }); UI.closeOverlay('dispatch'); this.renderBank('PENDING'); },
    renderBank: function(filter) {
        const data = CoreDB.getTenantJobs().filter(j => (filter === 'PENDING' && j.type !== 'COMPLETED') || (filter === 'COMPLETED' && j.type === 'COMPLETED'));
        document.getElementById('dispatch-bank-list').innerHTML = data.map(j => `<div style="background:#fff; border:1px solid #ddd; padding:10px; margin-bottom:5px; border-radius:5px; font-size:12px;"><strong>${j.site}</strong><br><small>${j.type}</small></div>`).join('') || "No jobs.";
    },
    openAgentTracker: function(id, name) { document.getElementById('tracker-user-id').value = id; document.getElementById('tracker-name-title').innerText = name; document.getElementById('tracker-date').valueAsDate = new Date(); this.renderAgentTracker(); UI.openOverlay('agent-tracker'); },
    renderAgentTracker: function() {
        const id = document.getElementById('tracker-user-id').value; const date = new Date(document.getElementById('tracker-date').value).toLocaleDateString('en-NZ');
        const shift = CoreDB.getShifts().find(s => s.userId === id && new Date(s.startTime).toLocaleDateString('en-NZ') === date);
        document.getElementById('tracker-results').innerHTML = shift ? `<div style="background:#e3f2fd; padding:15px; border-radius:8px;">Start: ${new Date(shift.startTime).toLocaleTimeString()}<br>End: ${shift.endTime ? new Date(shift.endTime).toLocaleTimeString() : 'Active'}</div>` : "No shift found.";
    }
};

const AdminCtrl = {
    init: function() { this.renderSchema(); this.renderFlags(); const t = CoreDB.getTenants().find(x => x.id === CoreDB.getActiveTenantId()); if(t) { document.getElementById('admin-tenant-name').innerText = t.name; document.getElementById('admin-tenant-motto').innerText = t.motto; } },
    switchTab: (id) => { document.querySelectorAll('.admin-tab-content').forEach(el => el.style.display = 'none'); document.getElementById('tab-' + id).style.display = 'block'; },
    loadModule: (url, nav) => { AdminCtrl.switchTab('iframe'); document.getElementById('admin-module-frame').src = url; },
    openSubPanel: (id) => { document.getElementById('settings-overview').style.display = 'none'; document.getElementById('panel-' + id).style.display = 'block'; },
    closeSubPanel: (id) => { document.getElementById('panel-' + id).style.display = 'none'; document.getElementById('settings-overview').style.display = 'block'; },
    renderSchema: function() { document.getElementById('admin-schema-render').innerHTML = CoreDB.getSchema().map(f => `<div style="padding:10px; border-bottom:1px solid #eee;">${f.label}</div>`).join(''); },
    renderFlags: function() { const f = CoreDB.getFlags(); document.getElementById('admin-flags-render').innerHTML = `Live Tracking: ${f.liveTracking} | Assignment: ${f.directAssignment}`; },
    toggleFlag: function(k) { let f = CoreDB.getFlags(); f[k] = !f[k]; CoreDB.saveFlags(f); this.renderFlags(); }
};

const GodCtrl = {
    init: function() { this.renderTenants(); },
    switchTab: (id) => { document.querySelectorAll('.admin-tab-content').forEach(el => el.style.display = 'none'); document.getElementById('tab-' + id).style.display = 'block'; },
    renderTenants: function() { document.getElementById('god-tenant-list').innerHTML = CoreDB.getTenants().map(t => `<div style="padding:10px; border-bottom:1px solid #ddd;">${t.name} (Email: ${t.reportEmail}) <button onclick="GodCtrl.impersonateTenant('${t.id}')">Admin</button></div>`).join(''); },
    impersonateTenant: (id) => { CoreDB.setActiveTenantId(id); window.location.href = 'admin.html'; }
};

const ReporterCtrl = {
    init: function() { this.renderReports(); },
    renderReports: function() { document.getElementById('reports-list-render').innerHTML = CoreDB.getReports().filter(r => r.tenantId === CoreDB.getActiveTenantId()).map(r => `<div style="padding:15px; border-left:4px solid #e74c3c; background:#fff; margin-bottom:10px;"><strong>${r.type}</strong><br><small>${r.notes}</small></div>`).join('') || "No reports."; }
};

document.addEventListener('DOMContentLoaded', () => {
    const role = document.body.dataset.role;
    if(role==='agent') AgentCtrl.init(); if(role==='dispatch') DispatchCtrl.init(); if(role==='admin') AdminCtrl.init(); if(role==='god') GodCtrl.init(); if(role==='reporter') ReporterCtrl.init();
});
