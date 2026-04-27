// ==========================================
// VANGUARD V4.12.0 - AGENT HUD & EMBEDDED QUEUE
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
        { "id": "T001", "name": "Porirua City Council", "tier": "City A", "licenses": 15, "status": "ACTIVE", "motto": "Mo Te Katoa Nga Iwi", "logo": "", "homeLat": -41.135, "homeLng": 174.84, "defaultZoom": 14 },
        { "id": "T002", "name": "Wellington City Council", "tier": "City B", "licenses": 50, "status": "ACTIVE", "motto": "Absolutely Positively Wellington", "logo": "", "homeLat": -41.2865, "homeLng": 174.7762, "defaultZoom": 14 }
    ],
    defaultUsers: [
        { id: "U001", username: "admin", password: "123", role: "admin", tenantId: "T001", name: "Porirua Admin", contact: "04 237 5089", status: "ACTIVE", allowedLayers: [] },
        { id: "U002", username: "worker", password: "123", role: "agent", tenantId: "T001", name: "John Doe", contact: "021 555 1234", status: "ACTIVE", allowedLayers: [] },
        { id: "U003", username: "dispatch", password: "123", role: "dispatch", tenantId: "T001", name: "Jane Smith", contact: "021 555 5678", status: "ACTIVE", allowedLayers: [] }
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
        const activeUsername = localStorage.getItem('vg_active_user'); if(!activeUsername) return null;
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
    }
};

const UI = {
    openLeftSidebar: () => document.getElementById('left-sidebar').classList.add('open'), closeLeftSidebar: () => document.getElementById('left-sidebar').classList.remove('open'),
    openRightSidebar: () => document.getElementById('right-sidebar').classList.add('open'), closeRightSidebar: () => document.getElementById('right-sidebar').classList.remove('open'),
    toggleLayerList: () => { const el = document.getElementById('layer-container'); el.style.display = (el.style.display === 'block') ? 'none' : 'block'; },
    openOverlay: (id) => { document.querySelectorAll('.full-overlay').forEach(o => o.style.display = 'none'); document.getElementById(id + '-overlay').style.display = 'flex'; },
    closeOverlay: (id) => { document.getElementById(id + '-overlay').style.display = 'none'; },
    openPopup: (id) => document.getElementById(id).style.display = 'block', closePopup: (id) => document.getElementById(id).style.display = 'none',
    toggleFS: () => { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); },
    lockoutScreen: function(role, tenantStatus, tenantName) {
        if (role === 'agent') { document.body.innerHTML = `<div style="display:flex; height:100vh; width:100vw; background:#f4f6f8; align-items:center; justify-content:center; padding:20px; box-sizing:border-box;"><div style="background:#fff; padding:40px; border-radius:15px; box-shadow:0 10px 30px rgba(0,0,0,0.1); text-align:center; max-width:400px;"><div style="font-size:50px; margin-bottom:20px;">🛑</div><h2 style="color:#e74c3c; margin-top:0; text-transform:uppercase;">SERVICE UNAVAILABLE</h2><p style="color:#555; font-weight:bold;">Report to dispatch error code: <br><span style="color:#000; font-size:18px; display:inline-block; margin-top:10px; padding:5px 10px; background:#eee; border-radius:5px;">ERR-${tenantStatus}</span></p><button class="std-btn gray" style="margin-top:20px;" onclick="location.href='index.html'">Return to Login</button></div></div>`; }
    },
    processAndWatermarkImage: function(file, callback) {
        const reader = new FileReader(); reader.onload = function(e) {
            const img = new Image(); img.onload = function() {
                const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); const MAX_DIM = 1920; let width = img.width; let height = img.height;
                if(width > height) { if(width > MAX_DIM) { height *= MAX_DIM / width; width = MAX_DIM; } } else { if(height > MAX_DIM) { width *= MAX_DIM / height; height = MAX_DIM; } }
                canvas.width = width; canvas.height = height; ctx.drawImage(img, 0, 0, width, height);
                const latlng = typeof window._mapEngine !== 'undefined' && window._mapEngine.userMarker ? window._mapEngine.userMarker.getLatLng() : {lat: 0, lng: 0};
                const srnInput = document.getElementById('work-srn') || document.getElementById('insp-srn'); const srnVal = srnInput && srnInput.value ? srnInput.value : 'N/A';
                const dateStr = new Date().toLocaleString('en-NZ'); const watermarkText = `SRN: ${srnVal} | LAT: ${latlng.lat.toFixed(5)} LON: ${latlng.lng.toFixed(5)} | DATE: ${dateStr} | VAN: 04`;
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
            
            this.loadKML(); 
            if(this.role === 'agent') this.initGPS(); 
            this.map.invalidateSize();
        }, 100);
    }
    loadKML() {
        const container = document.getElementById('layer-container'); if(!container) return;
        const activeUser = CoreDB.getActiveUser();
        const isAdmin = activeUser && activeUser.role === 'admin';
        const allowed = activeUser && activeUser.allowedLayers ? activeUser.allowedLayers : [];

        const customKMLs = CoreDB.getCustomKMLs().filter(k => k.tenantId === CoreDB.getActiveTenantId() && k.status === 'ACTIVE');
        customKMLs.forEach(item => { 
            if(isAdmin || allowed.includes(item.id)) { this.processKMLLayer(item, true); }
        });
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
    }
    initGPS() {
        this.userMarker = L.marker([0,0], { icon: L.divIcon({ className: '', html: '<div class="van-inner" style="font-size: 40px; transform: rotate(90deg); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));">🚐</div>', iconSize: [40,40], iconAnchor: [20,20] }) }).addTo(this.map);
        this.userMarker.on('click', () => AgentCtrl.openVanHUD());
        
        if(navigator.geolocation) { 
            navigator.geolocation.watchPosition(pos => { 
                this.userMarker.setLatLng([pos.coords.latitude, pos.coords.longitude]); 
            }, err => console.warn(err), { enableHighAccuracy: true }); 
        }
    }
}

const AgentCtrl = {
    activeSite: { name: "", type: "" }, workState: { startTime: null, accumulated: 0, photo1: null, photo2: null }, timerInterval: null, wakeLock: null, breadcrumbInterval: null,
    
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
        
        if(CoreDB.getFlags().directAssignment) {
            jobs = jobs.filter(j => !j.assignedTo || j.assignedTo === 'UNASSIGNED' || j.assignedTo === user.id);
        }
        
        if (jobs.length === 0) { list.innerHTML = '<p style="text-align:center; color:#888; font-size:12px; font-style:italic;">No pending jobs in queue.</p>'; return; }
        
        list.innerHTML = jobs.map((j) => {
            const isMine = j.assignedTo === user.id;
            const borderCol = isMine ? '#2ecc71' : '#f1c40f';
            const badge = isMine ? `<span style="font-size:10px; background:#2ecc71; color:white; padding:2px 4px; border-radius:3px;">ASSIGNED</span>` : `<span style="font-size:10px; background:#f1c40f; color:black; padding:2px 4px; border-radius:3px;">OPEN POOL</span>`;
            return `<div style="background:#f9f9f9; border-left:4px solid ${borderCol}; margin-bottom:10px; padding:10px; border-radius:0 5px 5px 0; cursor:pointer; transition: background 0.2s; box-shadow:0 1px 3px rgba(0,0,0,0.1);" onmouseover="this.style.background='#eee'" onmouseout="this.style.background='#f9f9f9'" onclick="AgentCtrl.handleJobClick('${j.jobId}')">
                <div style="display:flex; justify-content:space-between; margin-bottom:4px;"><strong style="font-size:12px; color:var(--b);">${j.site}</strong></div>
                <div style="display:flex; justify-content:space-between; align-items:center;"><div style="font-size:11px; color:#666;">SRN: ${j.srn}</div>${badge}</div>
            </div>`;
        }).join('');
    },
    
    async handleJobClick(jobId) {
        UI.closeLeftSidebar();
        const job = CoreDB.getJob(jobId); if(!job) return;
        this.activeSite = { name: job.site, type: "Dispatched Job" };
        
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(job.site)}&countrycodes=nz`);
            const data = await res.json();
            let lat, lng;
            if(data.length > 0) {
                lat = parseFloat(data[0].lat); lng = parseFloat(data[0].lon);
                window._mapEngine.map.setView([lat, lng], 17);
            } else {
                const tenant = CoreDB.getTenants().find(t => t.id === CoreDB.getActiveTenantId());
                lat = tenant.homeLat; lng = tenant.homeLng;
            }
            
            if(window._mapEngine.searchMarker) window._mapEngine.map.removeLayer(window._mapEngine.searchMarker);
            
            const isUnassigned = (!job.assignedTo || job.assignedTo === 'UNASSIGNED');
            const assignBtn = isUnassigned ? `<button class="std-btn green" style="padding:8px 10px; font-size:11px;" onclick="AgentCtrl.acceptJob('${jobId}')">Accept Job</button>` : `<button class="std-btn yellow" style="padding:8px 10px; font-size:11px;" onclick="AgentCtrl.openOverlay('work')">Begin Work</button>`;
            
            const content = `
                <div style="min-width:200px;">
                    <h4 style="margin:0 0 5px 0;">${job.site}</h4>
                    <p style="font-size:11px; color:#666; margin:0 0 10px 0;">SRN: ${job.srn}<br>Notes: ${job.notes || 'None'}</p>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:5px;">
                        ${assignBtn}
                        <button class="std-btn blue" style="padding:8px 10px; font-size:11px;" onclick="AgentCtrl.routeTo('${job.site}')">Route 📍</button>
                    </div>
                </div>
            `;
            window._mapEngine.searchMarker = L.marker([lat, lng]).addTo(window._mapEngine.map).bindPopup(content).openPopup();
        } catch (e) { console.error("Geocoding failed", e); }
    },
    
    acceptJob: function(jobId) {
        let bank = CoreDB.getJobBank();
        const idx = bank.findIndex(j => j.jobId === jobId);
        if(idx !== -1) {
            bank[idx].assignedTo = CoreDB.getActiveUser().id;
            CoreDB.saveJobBank(bank);
            this.renderSidebarBank();
            if(window._mapEngine && window._mapEngine.searchMarker) { window._mapEngine.searchMarker.closePopup(); }
            alert("Job accepted and assigned to your queue.");
        }
    },
    
    routeTo: function(address) {
        const url = `http://maps.google.com/?q=${encodeURIComponent(address)}`;
        window.open(url, '_blank');
    },

    openVanHUD: function() {
        if(!window._mapEngine || !window._mapEngine.userMarker) return;
        const shift = CoreDB.getActiveShift(); if(!shift) return;
        const user = CoreDB.getActiveUser();
        
        const diffMs = new Date() - new Date(shift.startTime);
        const hrs = Math.floor(diffMs / 3600000);
        const mins = Math.floor((diffMs % 3600000) / 60000);
        const timeStr = `${hrs}h ${mins}m`;

        let dist = 0; const R = 6371;
        for(let i=1; i<shift.breadcrumbs.length; i++) {
            let p1 = shift.breadcrumbs[i-1], p2 = shift.breadcrumbs[i];
            let dLat = (p2.lat - p1.lat) * Math.PI / 180;
            let dLon = (p2.lng - p1.lng) * Math.PI / 180;
            let a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) * Math.sin(dLon/2)*Math.sin(dLon/2);
            dist += R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
        }
        
        const jobs = CoreDB.getTenantJobs();
        const completed = jobs.filter(j => j.shiftId === shift.shiftId && j.type === 'COMPLETED').length;
        const pending = jobs.filter(j => j.assignedTo === user.id && j.type === 'PENDING').length;

        const html = `
            <div style="text-align:left; min-width:180px;">
                <h4 style="margin:0 0 5px 0; color:var(--b); border-bottom:1px solid #ddd; padding-bottom:5px; text-transform:uppercase;">🚐 HUD: ${user.name || user.username}</h4>
                <div style="font-size:12px; margin-bottom:3px;"><strong>Shift Time:</strong> ${timeStr}</div>
                <div style="font-size:12px; margin-bottom:3px;"><strong>Dist Traveled:</strong> ${dist.toFixed(2)} km</div>
                <div style="font-size:12px; margin-bottom:3px; color:#2ecc71;"><strong>Completed:</strong> ${completed}</div>
                <div style="font-size:12px; margin-bottom:10px; color:#e74c3c;"><strong>My Pending Queue:</strong> ${pending}</div>
                <button class="std-btn gray" style="padding:5px; font-size:11px;" onclick="AgentCtrl.showHistory()">View Shift History</button>
            </div>
        `;
        window._mapEngine.userMarker.bindPopup(html).openPopup();
    },

    showHistory: function() {
        const shift = CoreDB.getActiveShift(); if(!shift) return;
        const jobs = CoreDB.getTenantJobs().filter(j => j.shiftId === shift.shiftId && j.type === 'COMPLETED');
        const listEl = document.getElementById('agent-history-list');
        
        if(window._mapEngine && window._mapEngine.userMarker) window._mapEngine.userMarker.closePopup();
        
        if(jobs.length === 0) {
            listEl.innerHTML = `<p style="color:#666; font-size:13px;">No jobs completed on this shift yet.</p>`;
        } else {
            listEl.innerHTML = jobs.map(j => `
                <div style="background:#f4f6f8; border:1px solid #ddd; padding:10px; border-radius:5px; margin-bottom:10px; font-size:12px;">
                    <strong style="color:var(--b);">${j.site}</strong><br>
                    <span style="color:#888;">Time: ${j.pausedAt} | SRN: ${j.srn}</span>
                    ${j.notes ? `<div style="margin-top:5px; font-style:italic; border-top:1px dashed #ccc; padding-top:5px;">${j.notes}</div>` : ''}
                </div>
            `).join('');
        }
        UI.openOverlay('agent-history');
    },

    startShift: function() { CoreDB.createShift(); UI.closeOverlay('shift'); this.requestWakeLock(); this.startBreadcrumbs(); },
    endShift: function() { if(confirm("Are you sure you want to end your patrol shift and log out?")) { CoreDB.closeShift(); this.releaseWakeLock(); this.stopBreadcrumbs(); window.location.href = 'index.html'; } },
    async requestWakeLock() { if ('wakeLock' in navigator) { try { this.wakeLock = await navigator.wakeLock.request('screen'); console.log('Wake Lock active.'); } catch (err) { console.warn('Wake Lock failed:', err); } } },
    releaseWakeLock() { if (this.wakeLock !== null) { this.wakeLock.release(); this.wakeLock = null; console.log('Wake Lock released.'); } },
    startBreadcrumbs() {
        this.breadcrumbInterval = setInterval(() => {
            if(window._mapEngine && window._mapEngine.userMarker) {
                const pos = window._mapEngine.userMarker.getLatLng();
                if(pos.lat !== 0 && pos.lng !== 0) { CoreDB.addBreadcrumb(pos.lat, pos.lng); }
            }
        }, 30000);
    },
    stopBreadcrumbs() { clearInterval(this.breadcrumbInterval); },
    renderFields: function() {
        const container = document.getElementById('dynamic-work-fields'); if(!container) return; let html = '';
        CoreDB.getSchema().forEach(f => {
            if(!f.tenantVisible) return;
            if(f.type === 'select') { html += `<select id="work-${f.id}" class="std-input"><option value="">${f.label}...</option>`; f.options.forEach(opt => { if(opt.visible) html += `<option value="${opt.name}">${opt.name}</option>`; }); html += `</select>`; } 
            else { let pType = f.type === 'number' ? 'number' : 'text'; html += `<input type="${pType}" id="work-${f.id}" class="std-input" placeholder="${f.label} ${f.tenantMandatory?'':'(Optional)'}">`; }
        }); container.innerHTML = html; let srnField = CoreDB.getSchema().find(f => f.id === 'srn'); let inspSrn = document.getElementById('insp-srn'); if(inspSrn && srnField) inspSrn.style.display = srnField.tenantVisible ? 'block' : 'none';
    },
    openOverlay: function(type) { UI.closePopup('site-info'); document.querySelectorAll('.target-site-name').forEach(el => el.innerText = this.activeSite.name); UI.openOverlay(type); },
    handlePhoto: function(step) {
        const input = document.getElementById('photo-' + step) || document.getElementById('photo-insp-' + step); const btn = document.getElementById('btn-' + step); if(!input || !input.files || !input.files[0]) return; btn.innerHTML = `<div style="padding:10px;">⏳ Processing...</div>`; const now = new Date();
        UI.processAndWatermarkImage(input.files[0], (dataUrl) => {
            btn.classList.add('done'); btn.style.backgroundImage = `url(${dataUrl})`; btn.innerHTML = `<div style="background:rgba(0,0,0,0.7); display:inline-block; padding:5px 10px; border-radius:5px; color:#fff;">✓ ${step.toUpperCase()}<br><small>${now.toLocaleTimeString('en-NZ')}</small></div>`;
            if(step === 'before' || step === 'start') { this.workState.startTime = now; this.startTimer(); if(document.getElementById('pause-work-btn')) document.getElementById('pause-work-btn').disabled = false; if(document.getElementById('pause-insp-btn')) document.getElementById('pause-insp-btn').disabled = false; } 
            else { if(document.getElementById('submit-work-btn')) document.getElementById('submit-work-btn').disabled = false; if(document.getElementById('submit-insp-btn')) document.getElementById('submit-insp-btn').disabled = false; }
        });
    },
    startTimer: function() { const widget = document.getElementById('live-timer-widget'); widget.style.display = 'block'; this.timerInterval = setInterval(() => { const secs = Math.floor((new Date() - this.workState.startTime + this.workState.accumulated) / 1000); widget.innerText = `${Math.floor(secs / 60).toString().padStart(2,'0')}:${(secs % 60).toString().padStart(2,'0')}`; }, 1000); },
    stopTimer: function() { clearInterval(this.timerInterval); document.getElementById('live-timer-widget').style.display = 'none'; },
    cancelJob: function() { if(!confirm("Cancel this job?")) return; this.stopTimer(); this.workState = { startTime: null, accumulated: 0, photo1: null, photo2: null }; UI.closeOverlay('work'); },
    pauseJob: function() { const elapsed = new Date() - this.workState.startTime; CoreDB.pushJob({ site: this.activeSite.name, type: 'WORK', accumulated: this.workState.accumulated + elapsed, pausedAt: new Date().toLocaleString('en-NZ') }); this.stopTimer(); UI.closeOverlay('work'); this.renderSidebarBank(); },
    submitWork: function() { let failed = false; CoreDB.getSchema().forEach(f => { if(f.tenantVisible && f.tenantMandatory) { const el = document.getElementById(`work-${f.id}`); if(el && !el.value) failed = true; } }); if(failed) { alert("Please complete required fields."); return; } alert("Job Submitted via Email Link Stub"); this.stopTimer(); UI.closeOverlay('work'); this.renderSidebarBank(); },
    openJobBank: function() { const list = document.getElementById('agent-bank-list'); const data = CoreDB.getTenantJobs().filter(j=>j.type!=='PENDING'); if (data.length === 0) { list.innerHTML = '<p style="text-align:center; color:#666;">No paused jobs.</p>'; } else { list.innerHTML = data.map((j) => `<div style="background:#f1f2f6; margin-bottom:10px; padding:15px; border-radius:10px; cursor:pointer;" onclick="AgentCtrl.resumeJob('${j.jobId}')"><strong>${j.type}</strong>: ${j.site}<br><small>${j.pausedAt}</small></div>`).join(''); } UI.openOverlay('jobbank'); },
    resumeJob: function(jobId) { let job = CoreDB.getJob(jobId); if(!job) return; this.activeSite.name = job.site; this.workState.accumulated = job.accumulated; this.workState.startTime = new Date(); CoreDB.removeJob(jobId); UI.closeOverlay('jobbank'); this.openOverlay(job.type === 'INSPECTION' ? 'inspection' : 'work'); this.startTimer(); this.renderSidebarBank(); },
    centerGPS: function() { if(window._mapEngine) window._mapEngine.map.panTo(window._mapEngine.userMarker.getLatLng()); }
};

document.addEventListener('DOMContentLoaded', () => {
    const role = document.body.dataset.role;
    if(role === 'agent') AgentCtrl.init();
});
