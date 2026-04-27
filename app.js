// ==========================================
// VANGUARD V1.0.2 - STATE SYNC & UX PATCH
// ==========================================
const BRAND_NAME = "VanGuard";

const CoreDB = {
    defaultSchema: [
        { "id": "srn", "label": "Service Request Number (SRN)", "type": "text", "tenantVisible": true, "tenantMandatory": false, "options": null },
        { "id": "workers", "label": "Number of Workers", "type": "select", "tenantVisible": true, "tenantMandatory": true, "options": [ { "name": "1 Worker (Default)", "visible": true }, { "name": "2 Workers", "visible": true } ] },
        { "id": "area", "label": "Repaired Area (m²)", "type": "select", "tenantVisible": true, "tenantMandatory": true, "options": [ { "name": "0.5", "visible": true }, { "name": "1", "visible": true }, { "name": "5+", "visible": true } ] }
    ],
    defaultFlags: { liveTracking: true, directAssignment: true },
    defaultTenants: [
        { "id": "T001", "name": "Porirua City Council", "tier": "City A", "licenses": 15, "status": "ACTIVE", "motto": "Mo Te Katoa Nga Iwi", "logo": "", "homeLat": -41.135, "homeLng": 174.84, "defaultZoom": 14, "reportEmail": "info@poriruacity.govt.nz" },
        { "id": "T002", "name": "Wellington City Council", "tier": "City B", "licenses": 50, "status": "ACTIVE", "motto": "Absolutely Positively Wellington", "logo": "", "homeLat": -41.2865, "homeLng": 174.7762, "defaultZoom": 14, "reportEmail": "info@wcc.govt.nz" }
    ],
    defaultUsers: [
        { id: "U001", username: "admin", password: "123", role: "admin", tenantId: "T001", name: "Porirua Admin", contact: "04 237 5089", status: "ACTIVE", allowedLayers: [] },
        { id: "U002", username: "worker", password: "123", role: "agent", tenantId: "T001", name: "John Doe", contact: "021 555 1234", status: "ACTIVE", allowedLayers: [] },
        { id: "U003", username: "dispatch", password: "123", role: "dispatch", tenantId: "T001", name: "Jane Smith", contact: "021 555 5678", status: "ACTIVE", allowedLayers: [] },
        { id: "U007", username: "reporter", password: "123", role: "reporter", tenantId: "T001", name: "Desk Reporter", contact: "021 000 000", status: "ACTIVE", allowedLayers: [] }
    ],
    kmlConfig: [ { file: 'Assets Map- Alleyway sites.csv.kml', label: 'Alleyway', color: '#ff00ff', icon: '🛣️' } ],

    getFlags: function() { let mem = localStorage.getItem('vg_flags'); if(!mem) { localStorage.setItem('vg_flags', JSON.stringify(this.defaultFlags)); mem = localStorage.getItem('vg_flags'); } return JSON.parse(mem); },
    saveFlags: function(data) { localStorage.setItem('vg_flags', JSON.stringify(data)); },
    getSchema: function() { let mem = localStorage.getItem('vg_schema'); if(!mem) { localStorage.setItem('vg_schema', JSON.stringify(this.defaultSchema)); mem = localStorage.getItem('vg_schema'); } return JSON.parse(mem); },
    saveSchema: function(data) { localStorage.setItem('vg_schema', JSON.stringify(data)); },
    getTenants: function() {
        let mem = localStorage.getItem('tt_tenants'); if(!mem) { localStorage.setItem('tt_tenants', JSON.stringify(this.defaultTenants)); return this.defaultTenants; }
        let parsed = JSON.parse(mem); let needsPatch = false;
        this.defaultTenants.forEach(dt => { let existing = parsed.find(pt => pt.id === dt.id); if (!existing) { parsed.push(dt); needsPatch = true; } });
        parsed.forEach(pt => {
            if(typeof pt.homeLat === 'undefined') { pt.homeLat = pt.id === 'T002' ? -41.2865 : -41.135; needsPatch = true; }
            if(typeof pt.homeLng === 'undefined') { pt.homeLng = pt.id === 'T002' ? 174.7762 : 174.84; needsPatch = true; }
            if(typeof pt.defaultZoom === 'undefined') { pt.defaultZoom = 14; needsPatch = true; }
            if(typeof pt.reportEmail === 'undefined') { pt.reportEmail = "info@council.govt.nz"; needsPatch = true; }
        });
        if(needsPatch) { this.saveTenants(parsed); } return parsed;
    },
    saveTenants: function(data) { localStorage.setItem('tt_tenants', JSON.stringify(data)); },
    getUsers: function() {
        let mem = localStorage.getItem('tt_users'); if(!mem) { localStorage.setItem('tt_users', JSON.stringify(this.defaultUsers)); return this.defaultUsers; }
        let parsed = JSON.parse(mem); let patched = false;
        parsed.forEach(u => { 
            if(typeof u.name === 'undefined') { u.name = ''; patched = true; } 
            if(typeof u.contact === 'undefined') { u.contact = ''; patched = true; } 
            if(typeof u.status === 'undefined') { u.status = 'ACTIVE'; patched = true; } 
            if(typeof u.allowedLayers === 'undefined') { u.allowedLayers = []; patched = true; }
        });
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
        if(user && user.role === 'agent' && this.getFlags().directAssignment) {
            jobs = jobs.filter(j => !j.assignedTo || j.assignedTo === 'UNASSIGNED' || j.assignedTo === user.id);
        }
        return jobs;
    },
    getJob: function(jobId) { return this.getJobBank().find(j => j.jobId === jobId); },
    pushJob: function(jobObj) { 
        let b = this.getJobBank(); jobObj.tenantId = this.getActiveTenantId(); 
        jobObj.jobId = jobObj.jobId || ('J-' + Date.now() + '-' + Math.floor(Math.random() * 1000)); 
        const activeShift = this.getActiveShift();
        if(activeShift && jobObj.type !== 'PENDING') { jobObj.shiftId = activeShift.shiftId; }
        b.unshift(jobObj); this.saveJobBank(b); 
    },
    removeJob: function(jobId) { let b = this.getJobBank(); b = b.filter(j => j.jobId !== jobId); this.saveJobBank(b); },
    
    getActiveUser: function() {
        const activeUsername = localStorage.getItem('vg_active_user');
        if(!activeUsername) return null;
        return this.getUsers().find(u => u.username === activeUsername);
    },
    getActiveShift: function() {
        const user = this.getActiveUser(); if(!user) return null;
        return this.getShifts().find(s => s.userId === user.id && s.status === 'OPEN');
    },
    createShift: function() {
        const user = this.getActiveUser(); if(!user) return null;
        let shifts = this.getShifts();
        const newShift = { shiftId: 'SHIFT-' + Date.now(), tenantId: this.getActiveTenantId(), userId: user.id, username: user.name || user.username, startTime: new Date().toISOString(), endTime: null, status: 'OPEN', breadcrumbs: [] };
        shifts.push(newShift); this.saveShifts(shifts); return newShift;
    },
    closeShift: function() {
        let shifts = this.getShifts(); const user = this.getActiveUser(); const idx = shifts.findIndex(s => s.userId === user.id && s.status === 'OPEN');
        if(idx !== -1) { shifts[idx].status = 'CLOSED'; shifts[idx].endTime = new Date().toISOString(); this.saveShifts(shifts); }
    },
    addBreadcrumb: function(lat, lng) {
        let shifts = this.getShifts(); const user = this.getActiveUser(); if(!user) return;
        const idx = shifts.findIndex(s => s.userId === user.id && s.status === 'OPEN');
        if(idx !== -1) { shifts[idx].breadcrumbs.push({ lat: lat, lng: lng, ts: new Date().toISOString() }); this.saveShifts(shifts); }
    },
    pushReport: function(reportObj) {
        let r = this.getReports(); reportObj.tenantId = this.getActiveTenantId(); reportObj.id = 'REP-' + Date.now(); reportObj.timestamp = new Date().toLocaleString('en-NZ'); reportObj.status = 'NEW';
        r.unshift(reportObj); this.saveReports(r);
    }
};

const UI = {
    openLeftSidebar: () => document.getElementById('left-sidebar').classList.add('open'), closeLeftSidebar: () => document.getElementById('left-sidebar').classList.remove('open'),
    openRightSidebar: () => document.getElementById('right-sidebar').classList.add('open'), closeRightSidebar: () => document.getElementById('right-sidebar').classList.remove('open'),
    
    // UX Patch: Toggle arrow state and layer container visibility
    toggleLayerList: () => { 
        const el = document.getElementById('layer-container'); 
        const chevron = document.getElementById('layer-chevron');
        if(el.style.display === 'block') {
            el.style.display = 'none';
            if(chevron) chevron.innerText = '▶';
        } else {
            el.style.display = 'block';
            if(chevron) chevron.innerText = '▼';
        }
    },
    
    openOverlay: (id) => { document.querySelectorAll('.full-overlay').forEach(o => o.style.display = 'none'); document.getElementById(id + '-overlay').style.display = 'flex'; },
    closeOverlay: (id) => { document.getElementById(id + '-overlay').style.display = 'none'; },
    openPopup: (id) => document.getElementById(id).style.display = 'block', closePopup: (id) => document.getElementById(id).style.display = 'none',
    toggleFS: () => { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); },
    toggleSubRow: (rowId, iconId) => { const r = document.getElementById(rowId); const i = document.getElementById(iconId); if(!r) return; if(r.style.display === 'none' || r.style.display === '') { r.style.display = 'table-row'; i.innerText = '▼'; } else { r.style.display = 'none'; i.innerText = '▶'; } },
    downloadTextFile: function(filename, text) { let el = document.createElement('a'); el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text)); el.setAttribute('download', filename); el.style.display = 'none'; document.body.appendChild(el); el.click(); document.body.removeChild(el); },
    lockoutScreen: function(role, tenantStatus, tenantName) {
        if (role === 'agent') { document.body.innerHTML = `<div style="display:flex; height:100vh; width:100vw; background:#f4f6f8; align-items:center; justify-content:center; padding:20px; box-sizing:border-box;"><div style="background:#fff; padding:40px; border-radius:15px; box-shadow:0 10px 30px rgba(0,0,0,0.1); text-align:center; max-width:400px;"><div style="font-size:50px; margin-bottom:20px;">🛑</div><h2 style="color:#e74c3c; margin-top:0; text-transform:uppercase;">SERVICE UNAVAILABLE</h2><p style="color:#555; font-weight:bold;">Report to dispatch error code: <br><span style="color:#000; font-size:18px; display:inline-block; margin-top:10px; padding:5px 10px; background:#eee; border-radius:5px;">ERR-${tenantStatus}</span></p><button class="std-btn gray" style="margin-top:20px;" onclick="location.href='index.html'">Return to Login</button></div></div>`; }
        else if (role === 'dispatch') { document.body.innerHTML = `<div style="display:flex; height:100vh; width:100vw; background:#f4f6f8; align-items:center; justify-content:center; padding:20px; box-sizing:border-box;"><div style="background:#fff; padding:40px; border-radius:15px; box-shadow:0 10px 30px rgba(0,0,0,0.1); text-align:center; max-width:400px;"><div style="font-size:50px; margin-bottom:20px;">💳</div><h2 style="color:#e74c3c; margin-top:0; text-transform:uppercase;">ACCOUNT ${tenantStatus}</h2><p style="color:#555; font-weight:bold; line-height:1.5;">Please contact Accounts Payable to restore VanGuard dispatch services for ${tenantName}.</p><button class="std-btn gray" style="margin-top:20px;" onclick="location.href='index.html'">Return to Login</button></div></div>`; }
    },
    processAndWatermarkImage: function(file, callback) {
        const reader = new FileReader(); reader.onload = function(e) {
            const img = new Image(); img.onload = function() {
                const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); const MAX_DIM = 1920; let width = img.width; let height = img.height;
                if(width > height) { if(width > MAX_DIM) { height *= MAX_DIM / width; width = MAX_DIM; } } else { if(height > MAX_DIM) { width *= MAX_DIM / height; height = MAX_DIM; } }
                canvas.width = width; canvas.height = height; ctx.drawImage(img, 0, 0, width, height);
                const latlng = typeof window._mapEngine !== 'undefined' && window._mapEngine.userMarker ? window._mapEngine.userMarker.getLatLng() : {lat: 0, lng: 0};
                const srnInput = document.getElementById('work-srn') || document.getElementById('insp-srn-input'); const srnVal = srnInput && srnInput.value ? srnInput.value : 'N/A';
                const dateStr = new Date().toLocaleString('en-NZ'); const watermarkText = `SRN: ${srnVal} | LAT: ${latlng.lat.toFixed(5)} LON: ${latlng.lng.toFixed(5)} | DATE: ${dateStr}`;
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
            const lat = activeTenant && activeTenant.homeLat ? parseFloat(activeTenant.homeLat) : -41.135;
            const lng = activeTenant && activeTenant.homeLng ? parseFloat(activeTenant.homeLng) : 174.84;
            const z = activeTenant && activeTenant.defaultZoom ? parseInt(activeTenant.defaultZoom) : 14;
            
            this.map = L.map(this.mapId, { zoomControl: false }).setView([lat, lng], z);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
            this.layers = {}; this.role = role; this.userMarker = null; this.searchMarker = null;
            this.agentLiveMarkers = {}; 
            
            this.loadKML(); 
            if(this.role === 'agent') this.initGPS(); 
            if(this.role === 'dispatch' && CoreDB.getFlags().liveTracking) {
                this.pollActiveAgents(); setInterval(() => this.pollActiveAgents(), 30000);
            }
            this.map.invalidateSize();
        }, 100);
    }
    loadKML() {
        const container = document.getElementById('layer-container'); if(!container) return;
        const activeUser = CoreDB.getActiveUser();
        const isAdmin = activeUser && activeUser.role === 'admin';
        const allowed = activeUser && activeUser.allowedLayers ? activeUser.allowedLayers : [];

        const customKMLs = CoreDB.getCustomKMLs().filter(k => k.tenantId === CoreDB.getActiveTenantId() && k.status === 'ACTIVE');
        let count = 0;
        customKMLs.forEach(item => { 
            if(isAdmin || allowed.includes(item.id)) { this.processKMLLayer(item, true); count++; }
        });
        
        // UX Patch: Clear missing layers text if empty
        if(count === 0) { 
            container.innerHTML = '<div style="padding:10px; color:#e74c3c; font-size:12px; font-weight:bold; background:#f9f9f9; border-left:4px solid #e74c3c; border-radius:3px;">No map layers assigned to your profile.</div>'; 
        }
        window._mapEngine = this; 
    }
    processKMLLayer(item, isCustomStr) {
        const container = document.getElementById('layer-container');
        const div = document.createElement('div'); div.className = 'layer-item';
        div.innerHTML = `<label style="display:flex; align-items:center; cursor:pointer;"><input type="checkbox" checked onchange="window._mapEngine.toggleLayer('${item.label}', this.checked)" style="margin-right:10px; width:18px; height:18px;"> <span style="font-size:18px; margin-right:8px;">${item.icon}</span> ${item.label}</label>`;
        container.appendChild(div); const group = L.featureGroup(); this.layers[item.label] = group; const self = this;
        
        const customLayer = L.geoJson(null, {
            style: function() { return { color: item.color, weight: 6, opacity: 0.7 }; },
            pointToLayer: function(feature, latlng) {
                const marker = L.marker(latlng, { icon: L.divIcon({ className: '', html: `<div class="marker-inner" style="background-color: ${item.color}; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.5); font-size: 18px;">${item.icon}</div>`, iconSize: [38, 38], iconAnchor: [19, 19] }) });
                marker.on('click', function(e) { self.handleAssetClick(e, feature.properties?.name, item.label, feature.properties?.address || feature.properties?.description, false); }); return marker;
            }
        });
        
        let runLayer;
        if(isCustomStr) { runLayer = omnivore.kml.parse(item.kmlString, null, customLayer); } 
        else { runLayer = omnivore.kml(item.file, null, customLayer); }
        
        runLayer.on('ready', function() {
            runLayer.eachLayer(function(layer) {
                if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
                    const centerMarker = L.marker(layer.getBounds().getCenter(), { icon: L.divIcon({ className: '', html: `<div class="marker-inner" style="background-color: ${item.color}; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.5); font-size: 18px;">${item.icon}</div>`, iconSize: [38, 38], iconAnchor: [19, 19] }) });
                    centerMarker.on('click', function(e) { self.handleAssetClick(e, layer.feature?.properties?.name, item.label, layer.feature?.properties?.address || layer.feature?.properties?.description, false); }); group.addLayer(centerMarker);
                }
            }); self.map.addLayer(group);
        }); group.addLayer(runLayer);
    }
    toggleLayer(name, show) { if(show) this.map.addLayer(this.layers[name]); else this.map.removeLayer(this.layers[name]); }
    handleAssetClick(event, name, type, address, isOneOff) {
        L.DomEvent.stopPropagation(event); const safeName = name || "Unknown Site"; const safeAddr = address || "No address data";
        if(this.role === 'agent') { AgentCtrl.activeSite = { name: safeName, type: type }; document.getElementById('s-name').innerText = safeName; document.getElementById('s-type').innerText = type; document.getElementById('s-address').value = safeAddr; UI.openPopup('site-info'); } 
        else if (this.role === 'dispatch') { DispatchCtrl.activeSite = { name: safeName, type: type, address: safeAddr, isOneOff: isOneOff }; document.getElementById('s-name').innerText = safeName; document.getElementById('s-type').innerText = type; document.getElementById('s-address').value = safeAddr; UI.openPopup('site-info'); }
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
                const lastPing = shift.breadcrumbs[shift.breadcrumbs.length - 1];
                const ts = new Date(lastPing.ts).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                const popupContent = `<div style="text-align:center; padding:5px;"><h4 style="margin:0 0 5px 0; color:var(--b); font-size:14px; text-transform:uppercase;">${shift.username}</h4><div style="font-size:11px; color:#666; margin-bottom:10px;">Last Ping: ${ts}</div><button class="std-btn blue" style="padding:8px 15px; font-size:11px;" onclick="DispatchCtrl.openAgentTracker('${shift.userId}', '${shift.username}')">View Shift History</button></div>`;
                if(this.agentLiveMarkers[shift.userId]) { this.agentLiveMarkers[shift.userId].setLatLng([lastPing.lat, lastPing.lng]).getPopup().setContent(popupContent); } 
                else { const m = L.marker([lastPing.lat, lastPing.lng], { icon: L.divIcon({ className: '', html: `<div style="font-size: 30px; transform: rotate(90deg); filter: drop-shadow(0 2px 4px rgba(231, 76, 60, 0.8));">🚐</div>`, iconSize: [30,30], iconAnchor: [15,15] }) }).bindPopup(popupContent); this.agentLiveMarkers[shift.userId] = m; this.map.addLayer(m); }
            }
        });
    }
}

const AgentCtrl = {
    activeSite: { name: "", type: "" }, workState: { startTime: null, accumulated: 0 }, timerInterval: null, wakeLock: null, breadcrumbInterval: null,
    
    init: function() {
        const activeId = CoreDB.getActiveTenantId(); const t = CoreDB.getTenants().find(x => x.id === activeId);
        if (t && t.status !== 'ACTIVE') { UI.lockoutScreen('agent', t.status, t.name); return; }
        if(document.getElementById('page-title')) document.getElementById('page-title').innerText = `${BRAND_NAME} | Agent`;
        new MapEngine('map', 'agent'); this.renderFields();
        setInterval(() => { const el = document.getElementById('menu-clock'); if(el) el.innerText = new Date().toLocaleString('en-NZ', { dateStyle: 'medium', timeStyle: 'short' }); }, 1000);

        const openShift = CoreDB.getActiveShift();
        if(openShift) { UI.closeOverlay('shift'); this.requestWakeLock(); this.startBreadcrumbs(); } else { UI.openOverlay('shift'); }
        this.renderSidebarBank();
    },
    renderSidebarBank: function() {
        const list = document.getElementById('sidebar-job-bank'); if(!list) return;
        const user = CoreDB.getActiveUser(); if(!user) return;
        let jobs = CoreDB.getJobBank().filter(j => j.tenantId === CoreDB.getActiveTenantId() && j.type === 'PENDING');
        if(CoreDB.getFlags().directAssignment) { jobs = jobs.filter(j => !j.assignedTo || j.assignedTo === 'UNASSIGNED' || j.assignedTo === user.id); }
        if (jobs.length === 0) { list.innerHTML = '<p style="text-align:center; color:#888; font-size:12px; font-style:italic;">No pending jobs in queue.</p>'; return; }
        list.innerHTML = jobs.map((j) => {
            const isMine = j.assignedTo === user.id; const borderCol = isMine ? '#2ecc71' : '#f1c40f'; const badge = isMine ? `<span style="font-size:10px; background:#2ecc71; color:white; padding:2px 4px; border-radius:3px;">ASSIGNED</span>` : `<span style="font-size:10px; background:#f1c40f; color:black; padding:2px 4px; border-radius:3px;">OPEN POOL</span>`;
            return `<div style="background:#f9f9f9; border-left:4px solid ${borderCol}; margin-bottom:10px; padding:10px; border-radius:0 5px 5px 0; cursor:pointer; transition: background 0.2s; box-shadow:0 1px 3px rgba(0,0,0,0.1);" onmouseover="this.style.background='#eee'" onmouseout="this.style.background='#f9f9f9'" onclick="AgentCtrl.handleJobClick('${j.jobId}')"><div style="display:flex; justify-content:space-between; margin-bottom:4px;"><strong style="font-size:12px; color:var(--b);">${j.site}</strong></div><div style="display:flex; justify-content:space-between; align-items:center;"><div style="font-size:11px; color:#666;">SRN: ${j.srn}</div>${badge}</div></div>`;
        }).join('');
    },
    async handleJobClick(jobId) {
        UI.closeLeftSidebar(); const job = CoreDB.getJob(jobId); if(!job) return;
        this.activeSite = { name: job.site, type: "Dispatched Job" };
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(job.site)}&countrycodes=nz`); const data = await res.json();
            let lat, lng; if(data.length > 0) { lat = parseFloat(data[0].lat); lng = parseFloat(data[0].lon); window._mapEngine.map.setView([lat, lng], 17); } else { const tenant = CoreDB.getTenants().find(t => t.id === CoreDB.getActiveTenantId()); lat = tenant.homeLat; lng = tenant.homeLng; }
            if(window._mapEngine.searchMarker) window._mapEngine.map.removeLayer(window._mapEngine.searchMarker);
            const isUnassigned = (!job.assignedTo || job.assignedTo === 'UNASSIGNED');
            const assignBtn = isUnassigned ? `<button class="std-btn green" style="padding:8px 10px; font-size:11px;" onclick="AgentCtrl.acceptJob('${jobId}')">Accept Job</button>` : `<button class="std-btn yellow" style="padding:8px 10px; font-size:11px;" onclick="AgentCtrl.openOverlay('work')">Begin Work</button>`;
            const content = `<div style="min-width:200px;"><h4 style="margin:0 0 5px 0;">${job.site}</h4><p style="font-size:11px; color:#666; margin:0 0 10px 0;">SRN: ${job.srn}<br>Notes: ${job.notes || 'None'}</p><div style="display:grid; grid-template-columns:1fr 1fr; gap:5px;">${assignBtn}<button class="std-btn blue" style="padding:8px 10px; font-size:11px;" onclick="AgentCtrl.routeTo('${job.site}')">Route 📍</button></div></div>`;
            window._mapEngine.searchMarker = L.marker([lat, lng]).addTo(window._mapEngine.map).bindPopup(content).openPopup();
        } catch (e) { console.error("Geocoding failed", e); }
    },
    acceptJob: function(jobId) { let bank = CoreDB.getJobBank(); const idx = bank.findIndex(j => j.jobId === jobId); if(idx !== -1) { bank[idx].assignedTo = CoreDB.getActiveUser().id; CoreDB.saveJobBank(bank); this.renderSidebarBank(); if(window._mapEngine && window._mapEngine.searchMarker) { window._mapEngine.searchMarker.closePopup(); } alert("Job accepted and assigned to your queue."); } },
    routeTo: function(address) { window.open(`https://www.google.com/maps/dir/?api=1&destination=0${encodeURIComponent(address)}`, '_blank'); },
    openVanHUD: function() {
        if(!window._mapEngine || !window._mapEngine.userMarker) return;
        const shift = CoreDB.getActiveShift(); if(!shift) return; const user = CoreDB.getActiveUser();
        const diffMs = new Date() - new Date(shift.startTime); const hrs = Math.floor(diffMs / 3600000); const mins = Math.floor((diffMs % 3600000) / 60000); const timeStr = `${hrs}h ${mins}m`;
        let dist = 0; const R = 6371;
        for(let i=1; i<shift.breadcrumbs.length; i++) { let p1 = shift.breadcrumbs[i-1], p2 = shift.breadcrumbs[i]; let dLat = (p2.lat - p1.lat) * Math.PI / 180; let dLon = (p2.lng - p1.lng) * Math.PI / 180; let a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) * Math.sin(dLon/2)*Math.sin(dLon/2); dist += R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))); }
        const jobs = CoreDB.getTenantJobs(); const completed = jobs.filter(j => j.shiftId === shift.shiftId && j.type === 'COMPLETED').length; const pending = jobs.filter(j => j.assignedTo === user.id && j.type === 'PENDING').length;
        const html = `<div style="text-align:left; min-width:180px;"><h4 style="margin:0 0 5px 0; color:var(--b); border-bottom:1px solid #ddd; padding-bottom:5px; text-transform:uppercase;">🚐 HUD: ${user.name || user.username}</h4><div style="font-size:12px; margin-bottom:3px;"><strong>Shift Time:</strong> ${timeStr}</div><div style="font-size:12px; margin-bottom:3px;"><strong>Dist Traveled:</strong> ${dist.toFixed(2)} km</div><div style="font-size:12px; margin-bottom:3px; color:#2ecc71;"><strong>Completed:</strong> ${completed}</div><div style="font-size:12px; margin-bottom:10px; color:#e74c3c;"><strong>My Pending Queue:</strong> ${pending}</div><button class="std-btn gray" style="padding:5px; font-size:11px;" onclick="AgentCtrl.showHistory()">View Shift History</button></div>`;
        window._mapEngine.userMarker.bindPopup(html).openPopup();
    },
    showHistory: function() {
        const shift = CoreDB.getActiveShift(); if(!shift) return; const jobs = CoreDB.getTenantJobs().filter(j => j.shiftId === shift.shiftId && j.type === 'COMPLETED'); const listEl = document.getElementById('agent-history-list');
        if(window._mapEngine && window._mapEngine.userMarker) window._mapEngine.userMarker.closePopup();
        if(jobs.length === 0) { listEl.innerHTML = `<p style="color:#666; font-size:13px;">No jobs completed on this shift yet.</p>`; } else { listEl.innerHTML = jobs.map(j => `<div style="background:#f4f6f8; border:1px solid #ddd; padding:10px; border-radius:5px; margin-bottom:10px; font-size:12px;"><strong style="color:var(--b);">${j.site}</strong><br><span style="color:#888;">Time: ${j.pausedAt} | SRN: ${j.srn}</span>${j.notes ? `<div style="margin-top:5px; font-style:italic; border-top:1px dashed #ccc; padding-top:5px;">${j.notes}</div>` : ''}</div>`).join(''); }
        UI.openOverlay('agent-history');
    },
    startShift: function() { 
        CoreDB.createShift(); UI.closeOverlay('shift'); this.requestWakeLock(); 
        
        // UX Patch: Instantly force the first GPS breadcrumb so Dispatch sees them immediately
        if(window._mapEngine && window._mapEngine.userMarker) { 
            const pos = window._mapEngine.userMarker.getLatLng(); 
            if(pos.lat !== 0 && pos.lng !== 0) CoreDB.addBreadcrumb(pos.lat, pos.lng); 
        }
        this.startBreadcrumbs(); 
    },
    endShift: function() { if(confirm("Are you sure you want to end your patrol shift and log out?")) { CoreDB.closeShift(); this.releaseWakeLock(); this.stopBreadcrumbs(); window.location.href = 'index.html'; } },
    async requestWakeLock() { if ('wakeLock' in navigator) { try { this.wakeLock = await navigator.wakeLock.request('screen'); console.log('Wake Lock active.'); } catch (err) { console.warn('Wake Lock failed:', err); } } },
    releaseWakeLock() { if (this.wakeLock !== null) { this.wakeLock.release(); this.wakeLock = null; console.log('Wake Lock released.'); } },
    startBreadcrumbs() { this.breadcrumbInterval = setInterval(() => { if(window._mapEngine && window._mapEngine.userMarker) { const pos = window._mapEngine.userMarker.getLatLng(); if(pos.lat !== 0 && pos.lng !== 0) { CoreDB.addBreadcrumb(pos.lat, pos.lng); } } }, 30000); },
    stopBreadcrumbs() { clearInterval(this.breadcrumbInterval); },
    renderFields: function() {
        const containers = document.querySelectorAll('.dynamic-fields-render'); let html = '';
        CoreDB.getSchema().forEach(f => {
            if(!f.tenantVisible) return;
            if(f.type === 'select') { html += `<select id="field-${f.id}" class="std-input data-field"><option value="">${f.label}...</option>`; f.options.forEach(opt => { if(opt.visible) html += `<option value="${opt.name}">${opt.name}</option>`; }); html += `</select>`; } 
            else { let pType = f.type === 'number' ? 'number' : 'text'; html += `<input type="${pType}" id="field-${f.id}" class="std-input data-field" placeholder="${f.label} ${f.tenantMandatory?'':'(Optional)'}">`; }
        }); containers.forEach(c => c.innerHTML = html);
    },
    toggleWetDayForm: function(checkbox) { document.getElementById('wet-day-fields').style.display = checkbox.checked ? 'block' : 'none'; },
    openOverlay: function(type) { UI.closePopup('site-info'); document.querySelectorAll('.target-site-name').forEach(el => el.innerText = this.activeSite.name); UI.openOverlay(type); },
    handlePhoto: function(step) {
        const input = document.getElementById('photo-' + step); const btn = document.getElementById('btn-' + step); if(!input || !input.files || !input.files[0]) return; btn.innerHTML = `<div style="padding:10px;">⏳ Processing...</div>`; const now = new Date();
        UI.processAndWatermarkImage(input.files[0], (dataUrl) => {
            btn.classList.add('done'); btn.style.backgroundImage = `url(${dataUrl})`; btn.innerHTML = `<div style="background:rgba(0,0,0,0.7); display:inline-block; padding:5px 10px; border-radius:5px; color:#fff;">✓ ${step.toUpperCase()}</div>`;
            if(step === 'before' || step === 'start') { this.workState.startTime = now; this.startTimer(); if(document.getElementById('pause-work-btn')) document.getElementById('pause-work-btn').disabled = false; if(document.getElementById('pause-insp-btn')) document.getElementById('pause-insp-btn').disabled = false; } 
            else if(step === 'after' || step === 'end') { if(document.getElementById('submit-work-btn')) document.getElementById('submit-work-btn').disabled = false; if(document.getElementById('submit-insp-btn')) document.getElementById('submit-insp-btn').disabled = false; }
            if(step.startsWith('rep-')) { btn.innerHTML = `<div style="background:rgba(0,0,0,0.7); display:inline-block; padding:5px 10px; border-radius:5px; color:#fff;">✓ DONE</div>`; }
        });
    },
    startTimer: function() { const widget = document.getElementById('live-timer-widget'); widget.style.display = 'block'; this.timerInterval = setInterval(() => { const secs = Math.floor((new Date() - this.workState.startTime + this.workState.accumulated) / 1000); widget.innerText = `${Math.floor(secs / 60).toString().padStart(2,'0')}:${(secs % 60).toString().padStart(2,'0')}`; }, 1000); },
    stopTimer: function() { clearInterval(this.timerInterval); document.getElementById('live-timer-widget').style.display = 'none'; },
    cancelJob: function() { if(!confirm("Cancel this job?")) return; this.stopTimer(); this.workState = { startTime: null, accumulated: 0 }; UI.closeOverlay('work'); },
    pauseJob: function() { const elapsed = new Date() - this.workState.startTime; CoreDB.pushJob({ site: this.activeSite.name, type: 'WORK', accumulated: this.workState.accumulated + elapsed, pausedAt: new Date().toLocaleString('en-NZ') }); this.stopTimer(); UI.closeOverlay('work'); this.renderSidebarBank(); },
    submitWork: function() { let failed = false; CoreDB.getSchema().forEach(f => { if(f.tenantVisible && f.tenantMandatory) { const el = document.querySelectorAll(`#work-overlay #field-${f.id}`)[0]; if(el && !el.value) failed = true; } }); if(failed) { alert("Please complete required fields."); return; } alert("Work Submitted."); this.stopTimer(); UI.closeOverlay('work'); this.renderSidebarBank(); },
    cancelInsp: function() { this.stopTimer(); UI.closeOverlay('inspection'); },
    pauseInsp: function() { this.stopTimer(); UI.closeOverlay('inspection'); },
    submitInsp: function() {
        const flagFuture = document.getElementById('insp-flag-future').checked;
        if(flagFuture) {
            let notes = []; CoreDB.getSchema().forEach(f => { if(f.tenantVisible) { const el = document.querySelectorAll(`#wet-day-fields #field-${f.id}`)[0]; if(el && el.value) notes.push(`${f.label}: ${el.value}`); } });
            const srn = document.getElementById('insp-srn-input').value || 'N/A';
            CoreDB.pushJob({ site: this.activeSite.name, srn: srn, type: 'PENDING', notes: "[WET DAY FLAG] " + notes.join(', '), assignedTo: 'UNASSIGNED', accumulated: 0, pausedAt: new Date().toLocaleString('en-NZ') });
            alert("Inspection Logged & Site added to Open Pool for future work.");
        } else { alert("Inspection Logged."); }
        this.stopTimer(); UI.closeOverlay('inspection'); this.renderSidebarBank();
    },
    submitReport: function() {
        const type = document.getElementById('report-type').value; const notes = document.getElementById('report-notes').value;
        if(!type) { alert("Select an issue type."); return; }
        let lat = 0, lng = 0; if(window._mapEngine && window._mapEngine.userMarker) { const pos = window._mapEngine.userMarker.getLatLng(); lat = pos.lat; lng = pos.lng; }
        CoreDB.pushReport({ site: this.activeSite.name || "Field Location", lat: lat, lng: lng, type: type, notes: notes, reportedBy: CoreDB.getActiveUser().name || CoreDB.getActiveUser().username });
        alert("Issue Logged successfully to the Reporter dashboard."); UI.closeOverlay('report-issue'); document.getElementById('report-notes').value = '';
    },
    centerGPS: function() { if(window._mapEngine) window._mapEngine.map.panTo(window._mapEngine.userMarker.getLatLng()); }
};

const DispatchCtrl = {
    // ... Keeping standard Dispatch functions identical for length ...
    activeSite: { name: "", type: "", address: "", isOneOff: false },
    init: function() { const activeId = CoreDB.getActiveTenantId(); const t = CoreDB.getTenants().find(x => x.id === activeId); if (t && t.status !== 'ACTIVE') { UI.lockoutScreen('dispatch', t.status, t.name); return; } if(window.location.search.includes('iframe=true')) { const lo = document.getElementById('standalone-logout'); if(lo) lo.style.display = 'none'; } new MapEngine('dispatch-map', 'dispatch'); this.renderBank('PENDING'); },
    async searchAddress() {
        const query = document.getElementById('dispatch-search').value; if(!query) return;
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=nz`); const data = await res.json();
            if(data.length > 0) { const lat = parseFloat(data[0].lat); const lon = parseFloat(data[0].lon); window._mapEngine.map.setView([lat, lon], 17); if(window._mapEngine.searchMarker) window._mapEngine.map.removeLayer(window._mapEngine.searchMarker); const m = L.marker([lat, lon], { icon: L.divIcon({ className: '', html: `<div class="marker-inner" style="background-color: #34495e; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; font-size: 18px;">📍</div>`, iconSize: [38, 38], iconAnchor: [19, 19] }) }).addTo(window._mapEngine.map); window._mapEngine.searchMarker = m; const cleanAddr = data[0].display_name.split(',')[0]; UI.closeLeftSidebar(); m.on('click', (e) => window._mapEngine.handleAssetClick(e, cleanAddr, "One-Off Location", data[0].display_name, true)); m.fire('click'); } else { alert("Location not found."); }
        } catch(e) { console.error(e); }
    },
    openDispatchForm: function() { 
        UI.closePopup('site-info'); document.getElementById('dispatch-target-name').innerText = this.activeSite.name; document.getElementById('permanent-asset-request').style.display = this.activeSite.isOneOff ? 'block' : 'none'; document.getElementById('dispatch-make-permanent').checked = false; document.getElementById('dispatch-srn').value = ''; document.getElementById('dispatch-notes').value = ''; 
        const assignContainer = document.getElementById('assign-container'); const assignSelect = document.getElementById('dispatch-assign');
        if(CoreDB.getFlags().directAssignment && assignContainer && assignSelect) { assignContainer.style.display = 'block'; const agents = CoreDB.getUsers().filter(u => u.role === 'agent' && u.tenantId === CoreDB.getActiveTenantId() && u.status === 'ACTIVE'); let html = '<option value="UNASSIGNED">Open Pool (Any Active Worker)</option>'; agents.forEach(a => html += `<option value="${a.id}">${a.name || a.username}</option>`); assignSelect.innerHTML = html; }
        UI.openOverlay('dispatch'); 
    },
    openHistory: function() { UI.closePopup('site-info'); document.getElementById('history-target-name').innerText = this.activeSite.name; UI.openOverlay('history'); },
    submitJob: function() {
        const srn = document.getElementById('dispatch-srn').value.trim(); const notes = document.getElementById('dispatch-notes').value.trim(); const reqPerm = document.getElementById('dispatch-make-permanent').checked; let finalNotes = notes;
        if(reqPerm && this.activeSite.isOneOff) finalNotes = "[ADMIN REQ: Make site permanent] - " + notes;
        let assignedTo = 'UNASSIGNED'; if(CoreDB.getFlags().directAssignment) { const assignSelect = document.getElementById('dispatch-assign'); if(assignSelect) assignedTo = assignSelect.value; }
        CoreDB.pushJob({ site: this.activeSite.name, srn: srn || 'N/A', type: 'PENDING', notes: finalNotes, assignedTo: assignedTo, accumulated: 0, pausedAt: new Date().toLocaleString('en-NZ') }); 
        UI.closeOverlay('dispatch'); UI.openRightSidebar(); this.renderBank('PENDING');
    },
    renderBank: function(filterType) {
        const listEl = document.getElementById('dispatch-bank-list'); const data = CoreDB.getTenantJobs(); const filtered = data.filter(j => (filterType === 'PENDING' && j.type !== 'COMPLETED') || (filterType === 'COMPLETED' && j.type === 'COMPLETED') );
        if(filtered.length === 0) { listEl.innerHTML = `<p style="text-align:center; color:#888; font-size:13px; margin-top:20px;">No ${filterType} jobs.</p>`; return; }
        const users = CoreDB.getUsers(); const userMap = {}; users.forEach(u => userMap[u.id] = u.name || u.username);
        listEl.innerHTML = filtered.map(j => {
            const assignBadge = (j.assignedTo && j.assignedTo !== 'UNASSIGNED') ? `<span class="badge" style="background:#9b59b6; margin-top:5px; display:inline-block;">Assigned: ${userMap[j.assignedTo] || 'Unknown'}</span>` : '';
            return `<div style="background:var(--bg-white); border: 1px solid #ddd; margin-bottom:10px; padding:15px; border-radius:8px; font-size:13px; border-left: 4px solid ${j.type==='WORK'?'#f1c40f':(j.type==='PENDING'?'#3498db':'#e74c3c')};"><div style="display:flex; justify-content:space-between; margin-bottom:5px;"><strong>${j.site}</strong><span class="badge blue" style="background:#333;">${j.srn}</span></div><div style="color:#666; margin-bottom: 5px;">Status: <strong style="color:var(--b);">${j.type}</strong></div><div style="color:#888; font-size: 11px;">${j.pausedAt}</div>${j.notes ? `<div style="margin-top:8px; padding:8px; background:#f9f9f9; border-radius:4px; font-style:italic; border:1px dashed #ccc;">"${j.notes}"</div>` : ''}${assignBadge}</div>`
        }).join('');
    },
    openAgentTracker: function(userId, username) { document.getElementById('tracker-user-id').value = userId; document.getElementById('tracker-name-title').innerText = username + "'s History"; document.getElementById('tracker-date').valueAsDate = new Date(); this.renderAgentTracker(); UI.openOverlay('agent-tracker'); },
    renderAgentTracker: function() {
        const userId = document.getElementById('tracker-user-id').value; const dateInput = document.getElementById('tracker-date').value; const resultsEl = document.getElementById('tracker-results');
        if(!dateInput) { resultsEl.innerHTML = "<p>Select a date.</p>"; return; }
        const targetDateStr = new Date(dateInput).toLocaleDateString('en-NZ'); const jobs = CoreDB.getJobBank().filter(j => j.tenantId === CoreDB.getActiveTenantId() && j.type === 'COMPLETED');
        const shifts = CoreDB.getShifts().filter(s => s.userId === userId); const shiftOnDate = shifts.find(s => new Date(s.startTime).toLocaleDateString('en-NZ') === targetDateStr);
        let html = '';
        if(shiftOnDate) { const st = new Date(shiftOnDate.startTime).toLocaleTimeString(); const et = shiftOnDate.endTime ? new Date(shiftOnDate.endTime).toLocaleTimeString() : 'Active/Open'; html += `<div style="background:#e3f2fd; border-left:4px solid var(--b); padding:15px; border-radius:8px; margin-bottom:15px;"><h4 style="margin:0 0 5px 0;">Shift Data: ${targetDateStr}</h4><div style="font-size:13px; color:#555;">Start: <strong>${st}</strong> | End: <strong>${et}</strong></div><div style="font-size:13px; color:#555;">Status: <strong>${shiftOnDate.status}</strong></div></div>`; } else { html += `<p style="color:#888; font-size:13px; text-align:center; padding:10px;">No shift punched for this date.</p>`; }
        const userJobs = jobs.filter(j => j.assignedTo === userId && j.pausedAt.includes(targetDateStr));
        if(userJobs.length > 0) { html += `<h4 style="border-bottom:1px solid #ccc; padding-bottom:5px;">Completed Jobs</h4>`; html += userJobs.map(j => `<div style="padding:10px; background:#fff; border:1px solid #eee; margin-bottom:5px; border-radius:5px; font-size:12px;"><strong>${j.site}</strong><br><span style="color:#888;">${j.pausedAt}</span></div>`).join(''); } else { html += `<p style="color:#888; font-size:13px; text-align:center; padding:10px;">No assigned jobs completed on this date.</p>`; }
        resultsEl.innerHTML = html;
    }
};

const AdminCtrl = {
    init: function() { 
        this.renderSchema(); this.renderFlags();
        const activeId = CoreDB.getActiveTenantId(); const t = CoreDB.getTenants().find(x => x.id === activeId);
        if(t) { if(document.getElementById('admin-tenant-name')) document.getElementById('admin-tenant-name').innerText = t.name; if(document.getElementById('admin-tenant-motto')) document.getElementById('admin-tenant-motto').innerText = t.motto || ''; const logoEl = document.getElementById('admin-tenant-logo'); if(logoEl) { if(t.logo) logoEl.innerHTML = `<img src="${t.logo}" style="max-height:80px; max-width:200px;">`; else logoEl.innerHTML = `⚓`; } }
    },
    switchTab: function(id) { document.querySelectorAll('.admin-tab-content').forEach(el => el.style.display = 'none'); document.getElementById('tab-' + id).style.display = 'block'; const contentArea = document.querySelector('.admin-content'); if(contentArea) { contentArea.style.overflowY = (id === 'iframe') ? 'hidden' : 'auto'; } if(id === 'settings') { this.closeSubPanel('fields'); this.closeSubPanel('flags'); } },
    loadModule: function(url, navElement) { document.querySelectorAll('.admin-nav-item').forEach(el => el.classList.remove('active-nav')); if(navElement) navElement.classList.add('active-nav'); this.switchTab('iframe'); document.getElementById('admin-module-frame').src = url; },
    openSubPanel: function(id) { document.getElementById('settings-overview').style.display = 'none'; document.getElementById('panel-' + id).style.display = 'block'; },
    closeSubPanel: function(id) { document.getElementById('panel-' + id).style.display = 'none'; document.getElementById('settings-overview').style.display = 'block'; },
    renderSchema: function() {
        const c = document.getElementById('admin-schema-render'); if(!c) return; let html = '<table style="width:100%; border-collapse:collapse; font-size:14px; text-align:left;"><tr style="border-bottom:2px solid #ddd; color:#666;"><th style="padding:10px 5px;">Data Field</th><th style="padding:10px 5px; text-align:center; width:120px;">Visible</th><th style="padding:10px 5px; text-align:center; width:120px;">Mandatory</th></tr>';
        CoreDB.getSchema().forEach(f => {
            html += `<tr style="border-bottom: 1px solid #eee; background: #fff;">`;
            if(f.type === 'select') { html += `<td style="padding: 12px 5px; font-weight:bold; cursor: pointer; color: var(--b);" onclick="UI.toggleSubRow('adm-sub-${f.id}', 'adm-icon-${f.id}')"><span id="adm-icon-${f.id}" style="display:inline-block; width: 15px;">▶</span> ${f.label}</td>`; } else { html += `<td style="padding: 12px 5px; font-weight:bold; color: #333;"><span style="display:inline-block; width: 15px;"></span> ${f.label}</td>`; }
            html += `<td style="padding: 12px 5px; text-align: center;"><label class="toggle-switch"><input type="checkbox" ${f.tenantVisible?'checked':''} onchange="AdminCtrl.toggleVis('${f.id}')"><span class="slider"></span></label></td><td style="padding: 12px 5px; text-align: center;"><label class="toggle-switch"><input type="checkbox" ${f.tenantMandatory?'checked':''} onchange="AdminCtrl.toggleMan('${f.id}')"><span class="slider"></span></label></td></tr>`;
            if(f.type === 'select') { html += `<tr id="adm-sub-${f.id}" style="display: none; background: #fafafa; border-bottom: 2px solid #ddd;"><td colspan="3" style="padding: 15px 15px 20px 35px;"><div class="sub-options-list">`; f.options.forEach(opt => { html += `<div class="sub-option-row"><span>${opt.name}</span><label class="toggle-switch small"><input type="checkbox" ${opt.visible?'checked':''} onchange="AdminCtrl.toggleOptVis('${f.id}', '${opt.name}')"><span class="slider"></span></label></div>`; }); html += `</div></td></tr>`; }
        }); c.innerHTML = html + '</table>';
    },
    renderFlags: function() { const c = document.getElementById('admin-flags-render'); if(!c) return; const flags = CoreDB.getFlags(); c.innerHTML = `<div style="display:flex; justify-content:space-between; align-items:center; padding:15px; border-bottom:1px solid #eee;"><div><strong style="color:var(--text-dark);">Live Agent Tracking</strong><br><span style="font-size:12px; color:#666;">Shows active vans on Dispatch map.</span></div><label class="toggle-switch"><input type="checkbox" ${flags.liveTracking?'checked':''} onchange="AdminCtrl.toggleFlag('liveTracking')"><span class="slider"></span></label></div><div style="display:flex; justify-content:space-between; align-items:center; padding:15px; border-bottom:1px solid #eee;"><div><strong style="color:var(--text-dark);">Direct Dispatch Assignment</strong><br><span style="font-size:12px; color:#666;">Allows dispatching jobs to specific agents.</span></div><label class="toggle-switch"><input type="checkbox" ${flags.directAssignment?'checked':''} onchange="AdminCtrl.toggleFlag('directAssignment')"><span class="slider"></span></label></div>`; },
    toggleVis: function(id) { let db=CoreDB.getSchema(); let f=db.find(x=>x.id===id); if(f){f.tenantVisible=!f.tenantVisible; CoreDB.saveSchema(db); this.renderSchema();} },
    toggleMan: function(id) { let db=CoreDB.getSchema(); let f=db.find(x=>x.id===id); if(f){f.tenantMandatory=!f.tenantMandatory; CoreDB.saveSchema(db); this.renderSchema();} },
    toggleOptVis: function(fid, opt) { let db=CoreDB.getSchema(); let f=db.find(x=>x.id===fid); if(f){let o=f.options.find(y=>y.name===opt); if(o){o.visible=!o.visible; CoreDB.saveSchema(db); this.renderSchema();}} },
    toggleFlag: function(key) { let flags = CoreDB.getFlags(); flags[key] = !flags[key]; CoreDB.saveFlags(flags); this.renderFlags(); }
};

const ToolsCtrl = {
    tempFileObj: null,
    init: function() { this.renderCustomKMLs(); },
    switchView: function(viewId) { document.getElementById('tools-main-menu').style.display = 'none'; document.getElementById('tools-kml-manager').style.display = 'none'; document.getElementById('tools-' + viewId).style.display = 'block'; },
    openUploadForm: function() { document.getElementById('kml-upload-form').style.display = 'block'; document.getElementById('new-kml-label').value = ''; document.getElementById('kml-file-name').innerText = 'No file selected'; this.tempFileObj = null; },
    closeUploadForm: function() { document.getElementById('kml-upload-form').style.display = 'none'; this.tempFileObj = null; },
    handleFileSelect: function(input) { if(input.files && input.files[0]) { this.tempFileObj = input.files[0]; document.getElementById('kml-file-name').innerText = this.tempFileObj.name; if(!document.getElementById('new-kml-label').value) { document.getElementById('new-kml-label').value = this.tempFileObj.name.replace('.kml', ''); } } },
    processUpload: function() {
        if(!this.tempFileObj) { alert("Please select a KML file first."); return; }
        const label = document.getElementById('new-kml-label').value || this.tempFileObj.name.replace('.kml', ''); const color = document.getElementById('new-kml-color').value || '#ff00ff'; const icon = document.getElementById('new-kml-icon').value || '📍';
        const reader = new FileReader();
        reader.onload = (e) => { const kmlString = e.target.result; let custom = CoreDB.getCustomKMLs(); custom.push({ id: 'KML'+Date.now(), label: label, color: color, icon: icon, status: 'ACTIVE', kmlString: kmlString, tenantId: CoreDB.getActiveTenantId() }); CoreDB.saveCustomKMLs(custom); this.closeUploadForm(); this.renderCustomKMLs(); };
        reader.readAsText(this.tempFileObj);
    },
    renderCustomKMLs: function() {
        const list = document.getElementById('kml-list-render'); if(!list) return;
        const custom = CoreDB.getCustomKMLs().filter(k => k.tenantId === CoreDB.getActiveTenantId());
        if(custom.length === 0) { list.innerHTML = '<p style="text-align:center; color:#888; padding: 20px;">No custom layers loaded.</p>'; return; }
        list.innerHTML = custom.map(k => {
            const statColor = k.status === 'ACTIVE' ? '#2ecc71' : '#95a5a6';
            return `<div style="background:#fff; border-bottom:1px solid #eee; padding:15px; cursor:pointer; transition:background 0.2s;" onmouseover="this.style.background='#f4f6f8'" onmouseout="this.style.background='#fff'" onclick="ToolsCtrl.toggleEditRow('kml-edit-${k.id}')"><div style="display:flex; justify-content:space-between; align-items:center;"><div style="display:flex; align-items:center;"><span style="font-size:24px; margin-right:15px; display:inline-block; width:40px; height:40px; border-radius:50%; background:${k.color}; color:#fff; text-align:center; line-height:40px; box-shadow:0 2px 5px rgba(0,0,0,0.2);">${k.icon}</span><strong style="font-size:15px; color:var(--b);">${k.label}</strong></div><span class="badge" style="background:${statColor};">${k.status || 'ACTIVE'}</span></div></div><div id="kml-edit-${k.id}" style="display:none; background:#fafafa; border-bottom:2px solid #ddd; padding:20px; box-shadow:inset 0 3px 5px rgba(0,0,0,0.05);"><div class="form-grid" style="grid-template-columns: 1fr 1fr 1fr 1fr;"><div><label class="section-label" style="margin-top:0;">Layer Name</label><input type="text" id="kml-lbl-${k.id}" class="std-input" value="${k.label}"></div><div><label class="section-label" style="margin-top:0;">Color</label><input type="color" id="kml-col-${k.id}" class="std-input" value="${k.color}" style="padding:5px; height:48px;"></div><div><label class="section-label" style="margin-top:0;">Icon</label><select id="kml-icn-${k.id}" class="std-input"><option value="📍" ${k.icon==='📍'?'selected':''}>📍 Pin</option><option value="⚡" ${k.icon==='⚡'?'selected':''}>⚡ Electric</option><option value="🛣️" ${k.icon==='🛣️'?'selected':''}>🛣️ Road</option><option value="🌉" ${k.icon==='🌉'?'selected':''}>🌉 Bridge</option><option value="🏢" ${k.icon==='🏢'?'selected':''}>🏢 Building</option><option value="🌳" ${k.icon==='🌳'?'selected':''}>🌳 Park</option></select></div><div><label class="section-label" style="margin-top:0;">Status</label><select id="kml-stat-${k.id}" class="std-input"><option value="ACTIVE" ${k.status==='ACTIVE'?'selected':''}>Active</option><option value="INACTIVE" ${k.status==='INACTIVE'?'selected':''}>Inactive</option></select></div></div><div style="display:flex; justify-content:space-between; margin-top:10px;"><button class="std-btn red" style="width:auto;" onclick="ToolsCtrl.deleteKML('${k.id}')">Delete Layer</button><button class="std-btn blue" style="width:auto;" onclick="ToolsCtrl.updateKML('${k.id}')">Save Changes</button></div></div>`;
        }).join('');
    },
    toggleEditRow: function(id) { const el = document.getElementById(id); if(el) el.style.display = (el.style.display === 'none') ? 'block' : 'none'; },
    updateKML: function(id) { let custom = CoreDB.getCustomKMLs(); const idx = custom.findIndex(k => k.id === id); if(idx !== -1) { custom[idx].label = document.getElementById(`kml-lbl-${id}`).value; custom[idx].color = document.getElementById(`kml-col-${id}`).value; custom[idx].icon = document.getElementById(`kml-icn-${id}`).value; custom[idx].status = document.getElementById(`kml-stat-${id}`).value; CoreDB.saveCustomKMLs(custom); this.renderCustomKMLs(); } },
    deleteKML: function(id) { if(confirm("Remove this custom map layer entirely?")) { let custom = CoreDB.getCustomKMLs().filter(k => k.id !== id); CoreDB.saveCustomKMLs(custom); this.renderCustomKMLs(); } }
};

const AccountsCtrl = {
    init: function() { this.renderUsers(); this.updateLicenseCounter(); },
    updateLicenseCounter: function() { const activeId = CoreDB.getActiveTenantId(); const tenant = CoreDB.getTenants().find(t => t.id === activeId); const users = CoreDB.getUsers().filter(u => u.tenantId === activeId && u.status === 'ACTIVE'); const el = document.getElementById('license-counter'); if(el && tenant) { el.innerText = `Licenses: ${users.length} of ${tenant.licenses} Used`; if(users.length >= tenant.licenses) el.style.color = '#e74c3c'; else el.style.color = 'var(--b)'; } },
    generateLayerCheckboxes: function(containerId, activeAllowedLayers = []) {
        const container = document.getElementById(containerId); if(!container) return; const tenantLayers = CoreDB.getCustomKMLs().filter(k => k.tenantId === CoreDB.getActiveTenantId() && k.status === 'ACTIVE');
        if(tenantLayers.length === 0) { container.innerHTML = '<span style="font-size:12px; color:#888;">No active custom layers available.</span>'; return; }
        container.innerHTML = tenantLayers.map(layer => { const isChecked = activeAllowedLayers.includes(layer.id) ? 'checked' : ''; return `<label style="display:flex; align-items:center; cursor:pointer; font-size:13px; color:#333;"><input type="checkbox" value="${layer.id}" class="layer-rbac-cb" style="width:16px; height:16px; margin-right:5px;" ${isChecked}> ${layer.icon} ${layer.label}</label>`; }).join('');
    },
    getCheckedLayers: function(containerId) { const container = document.getElementById(containerId); if(!container) return []; const checkboxes = container.querySelectorAll('.layer-rbac-cb:checked'); return Array.from(checkboxes).map(cb => cb.value); },
    openCreateForm: function() { 
        this.closeEditForm(); const activeId = CoreDB.getActiveTenantId(); const tenant = CoreDB.getTenants().find(t => t.id === activeId); const activeUsers = CoreDB.getUsers().filter(u => u.tenantId === activeId && u.status === 'ACTIVE').length;
        if(activeUsers >= tenant.licenses) { alert(`License limit reached (${tenant.licenses}). Please deactivate an existing user or request more licenses from Core Administration.`); return; }
        document.getElementById('new-acc-username').value = ''; document.getElementById('new-acc-password').value = ''; document.getElementById('new-acc-name').value = ''; document.getElementById('new-acc-contact').value = ''; document.getElementById('new-acc-role').value = 'agent'; document.getElementById('new-acc-status').value = 'ACTIVE'; 
        this.generateLayerCheckboxes('new-acc-layers', []); document.getElementById('accounts-create-form').style.display = 'block'; 
    },
    closeCreateForm: function() { document.getElementById('accounts-create-form').style.display = 'none'; },
    openEditForm: function(id) {
        this.closeCreateForm(); const user = CoreDB.getUsers().find(u => u.id === id); if(!user) return;
        document.getElementById('edit-acc-id').value = user.id; document.getElementById('edit-acc-username').value = user.username; document.getElementById('edit-acc-password').value = user.password; document.getElementById('edit-acc-role').value = user.role; document.getElementById('edit-acc-name').value = user.name || ''; document.getElementById('edit-acc-contact').value = user.contact || ''; document.getElementById('edit-acc-status').value = user.status || 'ACTIVE'; 
        this.generateLayerCheckboxes('edit-acc-layers', user.allowedLayers || []); document.getElementById('accounts-edit-form').style.display = 'block';
    },
    closeEditForm: function() { document.getElementById('accounts-edit-form').style.display = 'none'; },
    renderUsers: function() {
        const list = document.getElementById('accounts-list-render'); if(!list) return; const activeId = CoreDB.getActiveTenantId(); const users = CoreDB.getUsers().filter(u => u.tenantId === activeId);
        if (users.length === 0) { list.innerHTML = '<tr><td colspan="3" style="text-align:center; padding: 20px; color: #888;">No accounts provisioned.</td></tr>'; return; }
        list.innerHTML = users.map(u => {
            const statColor = u.status === 'ACTIVE' ? '#2ecc71' : '#95a5a6'; const roleColor = u.role === 'admin' ? '#e74c3c' : (u.role === 'dispatch' ? '#9b59b6' : '#2980b9');
            return `<tr style="border-bottom: 1px solid #eee; background: #fff; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#f4f6f8'" onmouseout="this.style.background='#fff'" onclick="AccountsCtrl.openEditForm('${u.id}')"><td style="padding: 15px;"><strong style="color: var(--b); font-size: 15px;">${u.name || u.username}</strong><br><span style="color: #666; font-size: 12px;">Login: ${u.username} ${u.contact ? '| '+u.contact : ''}</span></td><td style="padding: 15px;"><span class="badge" style="background: ${roleColor};">${u.role.toUpperCase()}</span></td><td style="padding: 15px;"><span class="badge" style="background: ${statColor};">${u.status || 'ACTIVE'}</span></td></tr>`
        }).join(''); this.updateLicenseCounter();
    },
    createUser: function() {
        const u = document.getElementById('new-acc-username').value.trim().toLowerCase(); const p = document.getElementById('new-acc-password').value.trim(); const r = document.getElementById('new-acc-role').value; const n = document.getElementById('new-acc-name').value.trim(); const c = document.getElementById('new-acc-contact').value.trim(); const s = document.getElementById('new-acc-status').value; const activeId = CoreDB.getActiveTenantId();
        const allowedLayers = this.getCheckedLayers('new-acc-layers'); if(!u || !p) { alert("Username and Password are required."); return; }
        let db = CoreDB.getUsers(); if(db.find(user => user.username === u)) { alert("Username already exists in the system."); return; }
        const newId = 'U' + Date.now().toString().slice(-6); db.push({ id: newId, username: u, password: p, role: r, tenantId: activeId, name: n, contact: c, status: s, allowedLayers: allowedLayers }); CoreDB.saveUsers(db); this.closeCreateForm(); this.renderUsers();
    },
    saveUser: function() {
        const id = document.getElementById('edit-acc-id').value; const u = document.getElementById('edit-acc-username').value.trim().toLowerCase(); const p = document.getElementById('edit-acc-password').value.trim(); const r = document.getElementById('edit-acc-role').value; const n = document.getElementById('edit-acc-name').value.trim(); const c = document.getElementById('edit-acc-contact').value.trim(); const s = document.getElementById('edit-acc-status').value;
        const allowedLayers = this.getCheckedLayers('edit-acc-layers'); if(!u || !p) { alert("Username and Password are required."); return; }
        let db = CoreDB.getUsers(); const duplicate = db.find(user => user.username === u && user.id !== id); if(duplicate) { alert("Username already exists in the system."); return; }
        const activeId = CoreDB.getActiveTenantId(); const tenant = CoreDB.getTenants().find(t => t.id === activeId); const userIndex = db.findIndex(user => user.id === id);
        if(userIndex !== -1) {
            if(db[userIndex].status !== 'ACTIVE' && s === 'ACTIVE') { const activeUsers = db.filter(user => user.tenantId === activeId && user.status === 'ACTIVE').length; if(activeUsers >= tenant.licenses) { alert(`Cannot activate user. License limit reached (${tenant.licenses}).`); return; } }
            db[userIndex].username = u; db[userIndex].password = p; db[userIndex].role = r; db[userIndex].name = n; db[userIndex].contact = c; db[userIndex].status = s; db[userIndex].allowedLayers = allowedLayers; CoreDB.saveUsers(db); this.closeEditForm(); this.renderUsers();
        }
    },
    deleteUserFromEdit: function() { const id = document.getElementById('edit-acc-id').value; if(confirm("Are you sure you want to permanently delete this user account?")) { let db = CoreDB.getUsers().filter(u => u.id !== id); CoreDB.saveUsers(db); this.closeEditForm(); this.renderUsers(); } }
};

const ReporterCtrl = {
    init: function() { const activeId = CoreDB.getActiveTenantId(); const t = CoreDB.getTenants().find(x => x.id === activeId); if (t && t.status !== 'ACTIVE') { UI.lockoutScreen('reporter', t.status, t.name); return; } this.renderReports(); },
    renderReports: function() {
        const list = document.getElementById('reports-list-render'); if(!list) return; const reports = CoreDB.getReports().filter(r => r.tenantId === CoreDB.getActiveTenantId());
        if (reports.length === 0) { list.innerHTML = '<p style="text-align:center; padding: 20px; color: #888;">No pending field reports.</p>'; return; }
        list.innerHTML = reports.map(r => {
            const statColor = r.status === 'NEW' ? '#e74c3c' : '#2ecc71';
            return `<div style="background:#fff; border-bottom:1px solid #eee; padding:20px; margin-bottom:10px; border-radius:8px; border-left: 4px solid ${statColor}; box-shadow:0 2px 5px rgba(0,0,0,0.05);"><div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;"><div><strong style="color: var(--b); font-size: 16px;">${r.type}</strong><br><span style="color: #666; font-size: 12px;">Logged: ${r.timestamp} by ${r.reportedBy}</span><br><span style="color: #666; font-size: 12px;">GPS: ${r.lat.toFixed(5)}, ${r.lng.toFixed(5)}</span></div><span class="badge" style="background: ${statColor};">${r.status}</span></div><div style="background:#f9f9f9; padding:10px; border-radius:5px; font-style:italic; color:#555; font-size:13px; margin-bottom:15px;">"${r.notes || 'No additional notes provided.'}"</div><div style="display:flex; gap:10px;"><button class="std-btn blue" style="width:auto; padding:8px 15px; font-size:12px;" onclick="ReporterCtrl.forwardReport('${r.id}')">Forward to Council ✉️</button><button class="std-btn green" style="width:auto; padding:8px 15px; font-size:12px;" onclick="ReporterCtrl.markResolved('${r.id}')">Mark Resolved ✓</button></div></div>`;
        }).join('');
    },
    forwardReport: function(id) { const r = CoreDB.getReports().find(x => x.id === id); const t = CoreDB.getTenants().find(x => x.id === r.tenantId); const email = t.reportEmail || 'info@council.govt.nz'; const subject = encodeURIComponent(`Field Report: ${r.type}`); const body = encodeURIComponent(`VanGuard Field Report

Issue Type: ${r.type}
Reported By: ${r.reportedBy}
Date: ${r.timestamp}
GPS Coordinates: ${r.lat}, ${r.lng}
Map Link: https://www.google.com/maps/dir/?api=1&destination=1$${r.lat},${r.lng}

Notes from Agent:
${r.notes}

(Note: Photos to be attached manually if required)`); window.location.href = `mailto:${email}?subject=${subject}&body=${body}`; },
    markResolved: function(id) { if(confirm("Mark this report as resolved/processed?")) { let reports = CoreDB.getReports(); const idx = reports.findIndex(x => x.id === id); if(idx !== -1) { reports[idx].status = 'RESOLVED'; CoreDB.saveReports(reports); this.renderReports(); } } }
};

const GodCtrl = {
    init: function() { this.renderSchema(); this.renderTenants(); },
    switchTab: function(id) { document.querySelectorAll('.admin-tab-content').forEach(el => el.style.display = 'none'); document.getElementById('tab-' + id).style.display = 'block'; const contentArea = document.querySelector('.admin-content'); if(contentArea) { contentArea.style.overflowY = (id === 'iframe') ? 'hidden' : 'auto'; } document.querySelectorAll('.admin-nav-item').forEach(el => el.classList.remove('active-nav')); event.currentTarget.classList.add('active-nav'); },
    exportDBText: function() { const data = `const defaultSchema = ${JSON.stringify(CoreDB.getSchema(), null, 4)};`; UI.downloadTextFile('Spoof_Database.txt', data); },
    exportBlankTemplate: function() { const blank = [{ "id": "example_field", "label": "Example Label", "type": "text", "tenantVisible": true, "tenantMandatory": false, "options": [] }]; const data = `const defaultSchema = ${JSON.stringify(blank, null, 4)};`; UI.downloadTextFile('Blank_Database_Template.txt', data); },
    nukeDatabase: function() { if(confirm("WARNING: This will completely wipe all local memory, job banks, and tenant configurations, resetting the system to factory defaults. Proceed?")) { localStorage.clear(); alert("System Reset Complete. Reloading interface."); window.location.href = 'index.html'; } },
    
    // UX Patch: State Sync Tools
    exportState: function() {
        const state = {
            schema: CoreDB.getSchema(), flags: CoreDB.getFlags(), tenants: CoreDB.getTenants(), users: CoreDB.getUsers(),
            customKMLs: CoreDB.getCustomKMLs(), jobBank: CoreDB.getJobBank(), shifts: CoreDB.getShifts(), reports: CoreDB.getReports()
        };
        const dump = btoa(JSON.stringify(state)); // Base64 encode it so it's a clean string
        document.getElementById('state-sync-io').value = dump;
        alert("State exported to the text box. Copy this string and paste it into the tablet's God console.");
    },
    importState: function() {
        const dump = document.getElementById('state-sync-io').value.trim();
        if(!dump) return;
        if(confirm("WARNING: Importing state will overwrite this device's memory. Continue?")) {
            try {
                const state = JSON.parse(atob(dump));
                localStorage.setItem('vg_schema', JSON.stringify(state.schema || CoreDB.defaultSchema));
                localStorage.setItem('vg_flags', JSON.stringify(state.flags || CoreDB.defaultFlags));
                localStorage.setItem('tt_tenants', JSON.stringify(state.tenants || CoreDB.defaultTenants));
                localStorage.setItem('tt_users', JSON.stringify(state.users || CoreDB.defaultUsers));
                localStorage.setItem('tt_custom_kmls', JSON.stringify(state.customKMLs || []));
                localStorage.setItem('tt_jobbank', JSON.stringify(state.jobBank || []));
                localStorage.setItem('tt_shifts', JSON.stringify(state.shifts || []));
                localStorage.setItem('tt_reports', JSON.stringify(state.reports || []));
                alert("State successfully imported! Reloading interface...");
                window.location.href = 'index.html';
            } catch(e) { alert("Invalid state string. Import failed."); console.error(e); }
        }
    },

    renderTenants: function() {
        const c = document.getElementById('god-tenant-list'); if(!c) return; const tenants = CoreDB.getTenants(); const bank = CoreDB.getJobBank(); const allUsers = CoreDB.getUsers();
        c.innerHTML = tenants.map(t => {
            const tenantJobs = bank.filter(j => j.tenantId === t.id); const pendingCount = tenantJobs.filter(j => j.type !== 'COMPLETED').length; const completedCount = tenantJobs.filter(j => j.type === 'COMPLETED').length; const statColor = t.status === 'ACTIVE' ? '#2ecc71' : (t.status === 'SUSPENDED' ? '#f1c40f' : '#e74c3c'); const adminUser = allUsers.find(u => u.tenantId === t.id && u.role === 'admin') || { username: '', password: '' };
            return `<div style="background:var(--bg-light); border:1px solid #ddd; border-radius:8px; margin-bottom:10px; overflow:hidden;"><div style="padding:15px; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="UI.toggleSubRow('t-exp-${t.id}', 't-icon-${t.id}')"><div><span id="t-icon-${t.id}" style="display:inline-block; width:15px; font-size:12px;">▶</span><h4 style="margin:0; display:inline-block; color:var(--text-dark);">${t.name}</h4><span style="font-size:12px; color:#666; margin-left:10px;">ID: ${t.id} | Tier: ${t.tier}</span></div><div><span class="badge blue" style="background:${statColor};">${t.status}</span></div></div><div id="t-exp-${t.id}" style="display:none; padding:20px; border-top:1px solid #ddd; background:#fff;"><div style="display:flex; justify-content:space-between; margin-bottom:15px; background:#f4f6f8; padding:10px; border-radius:8px; align-items:center;"><div style="font-size:12px; color:#555;"><strong>Live Metrics:</strong> <span style="margin-left:10px; color:#e74c3c;">${pendingCount} Pending</span> | <span style="margin-left:10px; color:#2ecc71;">${completedCount} Completed</span></div><button class="std-btn gray" style="width:auto; padding:8px 15px; font-size:11px;" onclick="GodCtrl.impersonateTenant('${t.id}')">Enter Admin Dashboard</button></div><div style="margin-bottom: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px; border: 1px solid var(--b);"><h4 style="margin-top:0; color: var(--b); font-size: 13px; text-transform: uppercase;">Master Admin Credentials</h4><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;"><div><label class="input-label">Admin Username</label><input type="text" id="t-admin-user-${t.id}" class="std-input" value="${adminUser.username}" style="margin-bottom:0;"></div><div><label class="input-label">Admin Password</label><input type="text" id="t-admin-pass-${t.id}" class="std-input" value="${adminUser.password}" style="margin-bottom:0;"></div></div></div><div class="form-grid" style="grid-template-columns: 1fr 1fr 1fr;"><div><label class="input-label">Council Name</label><input type="text" id="t-name-${t.id}" class="std-input" value="${t.name}"></div><div><label class="input-label">Subscription Tier</label><select id="t-tier-${t.id}" class="std-input"><option value="City A" ${t.tier==='City A'?'selected':''}>City A (Test)</option><option value="City B" ${t.tier==='City B'?'selected':''}>City B (Test)</option><option value="Municipal - Small" ${t.tier==='Municipal - Small'?'selected':''}>Municipal - Small</option><option value="Municipal - Large" ${t.tier==='Municipal - Large'?'selected':''}>Municipal - Large</option><option value="State Police" ${t.tier==='State Police'?'selected':''}>State Police</option></select></div><div><label class="input-label">Licenses</label><input type="number" id="t-lic-${t.id}" class="std-input" value="${t.licenses}"></div><div><label class="input-label">Primary Contact</label><input type="text" id="t-cname-${t.id}" class="std-input" value="${t.contactName || ''}" placeholder="Name"></div><div><label class="input-label">Contact Email</label><input type="email" id="t-cemail-${t.id}" class="std-input" value="${t.contactEmail || ''}" placeholder="Email"></div><div><label class="input-label">Contact Phone</label><input type="text" id="t-cphone-${t.id}" class="std-input" value="${t.contactPhone || ''}" placeholder="Phone"></div><div style="grid-column: span 3;"><label class="input-label">Council Reporting Email (For ⚠️ Reports)</label><input type="email" id="t-report-email-${t.id}" class="std-input" value="${t.reportEmail || ''}" placeholder="info@council.govt.nz"></div><div style="grid-column: span 3;"><label class="input-label">Tenant Logo (URL)</label><input type="text" id="t-logo-${t.id}" class="std-input" placeholder="https://..." value="${t.logo || ''}"></div><div style="grid-column: span 3;"><label class="input-label">Motto / Slogan</label><input type="text" id="t-motto-${t.id}" class="std-input" value="${t.motto || ''}"></div><div><label class="input-label">Home Latitude</label><input type="text" id="t-lat-${t.id}" class="std-input" value="${t.homeLat || ''}" placeholder="-41.135"></div><div><label class="input-label">Home Longitude</label><input type="text" id="t-lng-${t.id}" class="std-input" value="${t.homeLng || ''}" placeholder="174.84"></div><div><label class="input-label">Default Zoom</label><input type="number" id="t-zoom-${t.id}" class="std-input" value="${t.defaultZoom || 14}" placeholder="14"></div><div><label class="input-label">Billing Cycle</label><select id="t-bill-${t.id}" class="std-input"><option value="Monthly" ${t.billingCycle==='Monthly'?'selected':''}>Monthly</option><option value="Annually" ${t.billingCycle==='Annually'?'selected':''}>Annually</option></select></div><div><label class="input-label">Account Status</label><select id="t-stat-${t.id}" class="std-input" style="border:2px solid ${statColor};"><option value="ACTIVE" ${t.status==='ACTIVE'?'selected':''}>Active</option><option value="SUSPENDED" ${t.status==='SUSPENDED'?'selected':''}>Suspended (Arrears)</option><option value="DEACTIVATED" ${t.status==='DEACTIVATED'?'selected':''}>Deactivated</option></select></div></div><div style="display:flex; justify-content:space-between; margin-top:20px; border-top:1px dashed #eee; padding-top:15px;"><button class="std-btn red" style="width:auto; padding:10px 20px;" onclick="GodCtrl.deleteTenant('${t.id}')">Delete Tenant</button><button class="std-btn blue" style="width:auto; padding:10px 40px; font-size:16px;" onclick="GodCtrl.saveTenant('${t.id}')">Confirm Changes</button></div></div></div>`;
        }).join('');
    },
    addTenant: function() { const name = prompt("Enter Council Name:"); if(!name) return; const tenants = CoreDB.getTenants(); const newId = 'T'+Math.floor(Math.random()*9000+1000); tenants.push({ id: newId, name: name, tier: "Municipal - Small", licenses: 4, status: "ACTIVE", motto: "", contactName: "", contactEmail: "", contactPhone: "", reportEmail: "info@council.govt.nz", billingCycle: "Monthly", logo: "", homeLat: -41.135, homeLng: 174.84, defaultZoom: 14 }); CoreDB.saveTenants(tenants); this.renderTenants(); },
    saveTenant: function(id) {
        const tenants = CoreDB.getTenants(); const t = tenants.find(x => x.id === id);
        if(t) {
            t.name = document.getElementById(`t-name-${id}`).value; t.tier = document.getElementById(`t-tier-${id}`).value; t.licenses = parseInt(document.getElementById(`t-lic-${id}`).value) || 0; t.status = document.getElementById(`t-stat-${id}`).value; t.motto = document.getElementById(`t-motto-${id}`).value; t.contactName = document.getElementById(`t-cname-${id}`).value; t.contactEmail = document.getElementById(`t-cemail-${id}`).value; t.contactPhone = document.getElementById(`t-cphone-${id}`).value; t.reportEmail = document.getElementById(`t-report-email-${id}`).value; t.billingCycle = document.getElementById(`t-bill-${id}`).value; t.logo = document.getElementById(`t-logo-${id}`).value; t.homeLat = document.getElementById(`t-lat-${id}`).value; t.homeLng = document.getElementById(`t-lng-${id}`).value; t.defaultZoom = document.getElementById(`t-zoom-${id}`).value; CoreDB.saveTenants(tenants);
            const adminU = document.getElementById(`t-admin-user-${id}`).value.trim().toLowerCase(); const adminP = document.getElementById(`t-admin-pass-${id}`).value.trim();
            if (adminU && adminP) { let users = CoreDB.getUsers(); let existingAdmin = users.find(u => u.tenantId === id && u.role === 'admin'); if (existingAdmin) { existingAdmin.username = adminU; existingAdmin.password = adminP; } else { users.push({ id: 'U' + Date.now().toString().slice(-6), username: adminU, password: adminP, role: 'admin', tenantId: id }); } CoreDB.saveUsers(users); }
            this.renderTenants(); alert("Tenant details confirmed and updated.");
        }
    },
    deleteTenant: function(id) { if(confirm("Are you sure you want to completely delete this tenant?")) { let tenants = CoreDB.getTenants().filter(x => x.id !== id); CoreDB.saveTenants(tenants); this.renderTenants(); } },
    impersonateTenant: function(id) { CoreDB.setActiveTenantId(id); window.location.href = 'admin.html'; },
    renderSchema: function() {
        const c = document.getElementById('god-schema-render'); if(!c) return; let html = '<table style="width:100%; border-collapse:collapse; font-size:14px; text-align:left;"><tr style="background:var(--nav-dark); color:white;"><th style="padding:12px 15px;">Global Field</th><th style="padding:12px 15px; width:100px;">Type</th><th style="padding:12px 15px; text-align:right; width:100px;">Action</th></tr>';
        CoreDB.getSchema().forEach(f => {
            html += `<tr style="border-bottom: 1px solid #eee; background: #fff;">`;
            if(f.type === 'select') { html += `<td style="padding: 15px; font-weight:bold; cursor: pointer; color: var(--b);" onclick="UI.toggleSubRow('god-sub-${f.id}', 'god-icon-${f.id}')"><span id="god-icon-${f.id}" style="display:inline-block; width: 15px;">▶</span> ${f.label}</td>`; } else { html += `<td style="padding: 15px; font-weight:bold; color: #333;"><span style="display:inline-block; width: 15px;"></span> ${f.label}</td>`; }
            html += `<td style="padding: 15px; color: #666;">${f.type}</td><td style="padding: 15px; text-align: right;"><button class="std-btn red" style="padding: 6px 12px; font-size: 11px; width: auto;" onclick="GodCtrl.delField('${f.id}')">Delete</button></td></tr>`;
            if(f.type === 'select') { html += `<tr id="god-sub-${f.id}" style="display: none; background: #fafafa; border-bottom: 2px solid #ddd;"><td colspan="3" style="padding: 20px 20px 25px 45px;"><div class="sub-options-list">`; f.options.forEach(opt => { html += `<div class="sub-option-row"><span>${opt.name}</span><button class="std-btn red" style="padding: 4px 10px; font-size: 10px; width: auto;" onclick="GodCtrl.delOpt('${f.id}', '${opt.name}')">✕</button></div>`; }); html += `<div style="display: flex; gap: 10px; margin-top: 10px;"><input type="text" id="god-opt-${f.id}" class="std-input" style="margin-bottom: 0; padding: 10px;"><button class="std-btn green" style="width: auto; padding: 0 20px;" onclick="GodCtrl.addOpt('${f.id}')">➕</button></div></div></td></tr>`; }
        }); c.innerHTML = html + '</table>';
    },
    delField: function(id) { if(confirm("Delete root field globally?")) { let db=CoreDB.getSchema().filter(x=>x.id!==id); CoreDB.saveSchema(db); this.renderSchema(); } },
    delOpt: function(fid, opt) { if(confirm("Delete option globally?")) { let db=CoreDB.getSchema(); let f=db.find(x=>x.id===fid); if(f){f.options=f.options.filter(y=>y.name!==opt); CoreDB.saveSchema(db); this.renderSchema(); } } },
    addOpt: function(fid) { let v = document.getElementById(`god-opt-${fid}`).value.trim(); if(!v) return; let db=CoreDB.getSchema(); let f=db.find(x=>x.id===fid); if(f && !f.options.find(o=>o.name===v)){f.options.push({name:v, visible:true}); CoreDB.saveSchema(db); this.renderSchema();} },
    addField: function() { let l = document.getElementById('new-global-field-name').value.trim(); let t = document.getElementById('new-global-field-type').value; if(!l) return; let id=l.toLowerCase().replace(/[^a-z0-9]/g, '_'); let db=CoreDB.getSchema(); if(db.find(f=>f.id===id)) return; db.push({id:id, label:l, type:t, tenantVisible:true, tenantMandatory:false, options: t==='select'?[]:null}); CoreDB.saveSchema(db); this.renderSchema(); document.getElementById('new-global-field-name').value=''; }
};

document.addEventListener('DOMContentLoaded', () => {
    const role = document.body.dataset.role;
    if(role === 'agent') AgentCtrl.init(); 
    if(role === 'dispatch') DispatchCtrl.init();
    if(role === 'admin') AdminCtrl.init(); 
    if(role === 'god') GodCtrl.init(); 
    if(role === 'reporter') ReporterCtrl.init();
    if(role === 'accounts') AccountsCtrl.init();
    if(role === 'tools') ToolsCtrl.init();
});
