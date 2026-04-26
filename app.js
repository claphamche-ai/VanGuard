
// ==========================================
// VANGUARD V4.5 - MULTI-TENANT SEGREGATION
// ==========================================

const BRAND_NAME = "VanGuard";

const CoreDB = {
    defaultSchema: [
        { "id": "srn", "label": "Service Request Number (SRN)", "type": "text", "tenantVisible": true, "tenantMandatory": false, "options": null },
        { "id": "workers", "label": "Number of Workers", "type": "select", "tenantVisible": true, "tenantMandatory": true, "options": [ { "name": "1 Worker (Default)", "visible": true }, { "name": "2 Workers", "visible": true }, { "name": "3 Workers", "visible": true }, { "name": "4 Workers", "visible": true }, { "name": "5+ Workers", "visible": true } ] },
        { "id": "area", "label": "Repaired Area (m²)", "type": "select", "tenantVisible": true, "tenantMandatory": true, "options": [ { "name": "0.5", "visible": true }, { "name": "1", "visible": true }, { "name": "2", "visible": true }, { "name": "5", "visible": true }, { "name": "10", "visible": true }, { "name": "20", "visible": true } ] },
        { "id": "property", "label": "Property Type", "type": "select", "tenantVisible": true, "tenantMandatory": true, "options": [ { "name": "Commercial Building", "visible": true }, { "name": "Private Residence", "visible": true }, { "name": "Public Fence", "visible": true }, { "name": "Utility Box", "visible": true }, { "name": "Underpass", "visible": true }, { "name": "Private Fence.", "visible": true } ] },
        { "id": "surface", "label": "Surface Type", "type": "select", "tenantVisible": true, "tenantMandatory": true, "options": [ { "name": "Brick", "visible": true }, { "name": "Raw Wood", "visible": true }, { "name": "Painted (Smooth)", "visible": true }, { "name": "Metal", "visible": true }, { "name": "Concrete / Stone", "visible": true }, { "name": "Glass", "visible": true } ] },
        { "id": "medium", "label": "Graffiti Medium", "type": "select", "tenantVisible": true, "tenantMandatory": true, "options": [ { "name": "Spray Paint", "visible": true }, { "name": "Paint (Brush/Roller)", "visible": true }, { "name": "Felt Pen / Marker", "visible": true }, { "name": "Etched / Scratched", "visible": true }, { "name": "Sticker / Poster", "visible": true } ] },
        { "id": "method", "label": "Removal Method", "type": "select", "tenantVisible": true, "tenantMandatory": true, "options": [ { "name": "Painted over", "visible": true }, { "name": "Chemical removal", "visible": true }, { "name": "Pressure wash", "visible": true }, { "name": "Sand blasting", "visible": true }, { "name": "Mechanical sanding", "visible": true } ] },
        { "id": "color", "label": "Paint Color Used", "type": "select", "tenantVisible": true, "tenantMandatory": true, "options": [ { "name": "White", "visible": true }, { "name": "Black", "visible": true }, { "name": "Grey", "visible": true }, { "name": "Brown", "visible": true }, { "name": "Colour Match", "visible": true }, { "name": "yellow", "visible": true } ] },
        { "id": "chemicals", "label": "Chemicals Used (ml/L)", "type": "text", "tenantVisible": true, "tenantMandatory": false, "options": null }
    ],
    defaultTenants: [
        { 
            "id": "T001", "name": "Porirua City Council", "tier": "City A", "licenses": 15, 
            "status": "ACTIVE", "motto": "Mo Te Katoa Nga Iwi | All The People",
            "contactName": "Admin Contact", "contactEmail": "admin@poriruacity.govt.nz", "contactPhone": "04 237 5089",
            "billingCycle": "Annually", "logo": ""
        },
        { 
            "id": "T002", "name": "Wellington City Council", "tier": "City B", "licenses": 50, 
            "status": "ACTIVE", "motto": "Absolutely Positively Wellington",
            "contactName": "WCC Dispatch", "contactEmail": "graffiti@wcc.govt.nz", "contactPhone": "04 499 4444",
            "billingCycle": "Monthly", "logo": ""
        }
    ],
    kmlConfig: [
        { file: 'Assets Map- Alleyway sites.csv.kml', label: 'Alleyway', color: '#ff00ff', icon: '🛣️' },
        { file: 'Wellington Electricity substation sites.kml', label: 'Substation', color: '#f1c40f', icon: '⚡' },
        { file: 'PCC Underpasses.kml', label: 'Underpass', color: '#e74c3c', icon: '🌉' }
    ],
    getSchema: function() {
        let mem = localStorage.getItem('vg_schema');
        if(!mem) { localStorage.setItem('vg_schema', JSON.stringify(this.defaultSchema)); mem = localStorage.getItem('vg_schema'); }
        return JSON.parse(mem);
    },
    saveSchema: function(data) { localStorage.setItem('vg_schema', JSON.stringify(data)); },
    getTenants: function() {
        let mem = localStorage.getItem('tt_tenants');
        if(!mem) { localStorage.setItem('tt_tenants', JSON.stringify(this.defaultTenants)); mem = localStorage.getItem('tt_tenants'); }
        return JSON.parse(mem);
    },
    saveTenants: function(data) { localStorage.setItem('tt_tenants', JSON.stringify(data)); },
    
    getJobBank: function() { return JSON.parse(localStorage.getItem('tt_jobbank') || '[]'); },
    saveJobBank: function(data) { localStorage.setItem('tt_jobbank', JSON.stringify(data)); },
    getActiveTenantId: function() { return localStorage.getItem('vg_active_tenant') || "T001"; },
    setActiveTenantId: function(id) { localStorage.setItem('vg_active_tenant', id); },
    
    getTenantJobs: function() { 
        const activeId = this.getActiveTenantId();
        return this.getJobBank().filter(j => j.tenantId === activeId); 
    },
    getJob: function(jobId) {
        return this.getJobBank().find(j => j.jobId === jobId);
    },
    pushJob: function(jobObj) { 
        let b = this.getJobBank(); 
        jobObj.tenantId = this.getActiveTenantId(); 
        jobObj.jobId = 'J-' + Date.now() + '-' + Math.floor(Math.random() * 1000); 
        b.unshift(jobObj); 
        this.saveJobBank(b); 
    },
    removeJob: function(jobId) {
        let b = this.getJobBank();
        b = b.filter(j => j.jobId !== jobId);
        this.saveJobBank(b);
    }
};

const UI = {
    openLeftSidebar: () => document.getElementById('left-sidebar').classList.add('open'),
    closeLeftSidebar: () => document.getElementById('left-sidebar').classList.remove('open'),
    openRightSidebar: () => document.getElementById('right-sidebar').classList.add('open'),
    closeRightSidebar: () => document.getElementById('right-sidebar').classList.remove('open'),
    toggleLayerList: () => { const el = document.getElementById('layer-container'); el.style.display = (el.style.display === 'block') ? 'none' : 'block'; },
    openOverlay: (id) => { document.querySelectorAll('.full-overlay').forEach(o => o.style.display = 'none'); document.getElementById(id + '-overlay').style.display = 'flex'; },
    closeOverlay: (id) => document.getElementById(id + '-overlay').style.display = 'none',
    openPopup: (id) => document.getElementById(id).style.display = 'block',
    closePopup: (id) => document.getElementById(id).style.display = 'none',
    toggleFS: () => { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); },
    toggleSubRow: (rowId, iconId) => {
        const r = document.getElementById(rowId); const i = document.getElementById(iconId);
        if(!r) return;
        if(r.style.display === 'none' || r.style.display === '') { r.style.display = 'table-row'; i.innerText = '▼'; } 
        else { r.style.display = 'none'; i.innerText = '▶'; }
    },
    downloadTextFile: function(filename, text) {
        let el = document.createElement('a');
        el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        el.setAttribute('download', filename);
        el.style.display = 'none';
        document.body.appendChild(el);
        el.click();
        document.body.removeChild(el);
    },
    lockoutScreen: function(role, tenantStatus, tenantName) {
        if (role === 'agent') {
            document.body.innerHTML = `<div style="display:flex; height:100vh; width:100vw; background:#f4f6f8; align-items:center; justify-content:center; padding:20px; box-sizing:border-box;"><div style="background:#fff; padding:40px; border-radius:15px; box-shadow:0 10px 30px rgba(0,0,0,0.1); text-align:center; max-width:400px;"><div style="font-size:50px; margin-bottom:20px;">🛑</div><h2 style="color:#e74c3c; margin-top:0; text-transform:uppercase;">SERVICE UNAVAILABLE</h2><p style="color:#555; font-weight:bold;">Report to dispatch error code: <br><span style="color:#000; font-size:18px; display:inline-block; margin-top:10px; padding:5px 10px; background:#eee; border-radius:5px;">ERR-${tenantStatus}</span></p><button class="std-btn gray" style="margin-top:20px;" onclick="location.href='index.html'">Return to Login</button></div></div>`;
        } else if (role === 'dispatch') {
            document.body.innerHTML = `<div style="display:flex; height:100vh; width:100vw; background:#f4f6f8; align-items:center; justify-content:center; padding:20px; box-sizing:border-box;"><div style="background:#fff; padding:40px; border-radius:15px; box-shadow:0 10px 30px rgba(0,0,0,0.1); text-align:center; max-width:400px;"><div style="font-size:50px; margin-bottom:20px;">💳</div><h2 style="color:#e74c3c; margin-top:0; text-transform:uppercase;">ACCOUNT ${tenantStatus}</h2><p style="color:#555; font-weight:bold; line-height:1.5;">Please contact Accounts Payable to restore VanGuard dispatch services for ${tenantName}.</p><button class="std-btn gray" style="margin-top:20px;" onclick="location.href='index.html'">Return to Login</button></div></div>`;
        }
    },
    processAndWatermarkImage: function(file, callback) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const MAX_DIM = 1920;
                let width = img.width;
                let height = img.height;
                if(width > height) { if(width > MAX_DIM) { height *= MAX_DIM / width; width = MAX_DIM; } }
                else { if(height > MAX_DIM) { width *= MAX_DIM / height; height = MAX_DIM; } }
                canvas.width = width; canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                const latlng = typeof window._mapEngine !== 'undefined' && window._mapEngine.userMarker ? window._mapEngine.userMarker.getLatLng() : {lat: 0, lng: 0};
                const srnInput = document.getElementById('work-srn') || document.getElementById('insp-srn');
                const srnVal = srnInput && srnInput.value ? srnInput.value : 'N/A';
                const dateStr = new Date().toLocaleString('en-NZ');
                const watermarkText = `SRN: ${srnVal} | LAT: ${latlng.lat.toFixed(5)} LON: ${latlng.lng.toFixed(5)} | DATE: ${dateStr} | VAN: 04`;

                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(0, height - 50, width, 50);
                ctx.font = 'bold 18px monospace';
                ctx.fillStyle = '#ffea00';
                ctx.fillText(watermarkText, 20, height - 20);

                callback(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

class MapEngine {
    constructor(mapId, role) {
        this.mapId = mapId;
        setTimeout(() => {
            this.map = L.map(this.mapId, { zoomControl: false }).setView([-41.135, 174.84], 14);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
            this.layers = {};
            this.role = role; 
            this.userMarker = null;
            this.searchMarker = null;
            this.loadKML();
            if(this.role === 'agent') this.initGPS();
            this.map.invalidateSize();
        }, 100);
    }

    loadKML() {
        const container = document.getElementById('layer-container');
        if(!container) return;
        
        CoreDB.kmlConfig.forEach(item => {
            const div = document.createElement('div');
            div.className = 'layer-item';
            div.innerHTML = `<label style="display:flex; align-items:center; cursor:pointer;"><input type="checkbox" checked onchange="window._mapEngine.toggleLayer('${item.label}', this.checked)" style="margin-right:10px; width:18px; height:18px;"> <span style="font-size:18px; margin-right:8px;">${item.icon}</span> ${item.label}</label>`;
            container.appendChild(div);
            
            const group = L.featureGroup();
            this.layers[item.label] = group;

            const self = this;
            const customLayer = L.geoJson(null, {
                style: function() { return { color: item.color, weight: 6, opacity: 0.7 }; },
                pointToLayer: function(feature, latlng) {
                    const marker = L.marker(latlng, {
                        icon: L.divIcon({
                            className: '',
                            html: `<div class="marker-inner" style="background-color: ${item.color}; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.5); font-size: 18px;">${item.icon}</div>`,
                            iconSize: [38, 38], iconAnchor: [19, 19]
                        })
                    });
                    marker.on('click', function(e) { self.handleAssetClick(e, feature.properties?.name, item.label, feature.properties?.address || feature.properties?.description, false); });
                    return marker;
                }
            });

            const runLayer = omnivore.kml(item.file, null, customLayer);
            runLayer.on('ready', function() {
                runLayer.eachLayer(function(layer) {
                    if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
                        const centerMarker = L.marker(layer.getBounds().getCenter(), {
                            icon: L.divIcon({ className: '', html: `<div class="marker-inner" style="background-color: ${item.color}; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.5); font-size: 18px;">${item.icon}</div>`, iconSize: [38, 38], iconAnchor: [19, 19] })
                        });
                        centerMarker.on('click', function(e) { self.handleAssetClick(e, layer.feature?.properties?.name, item.label, layer.feature?.properties?.address || layer.feature?.properties?.description, false); });
                        group.addLayer(centerMarker);
                    }
                });
                self.map.addLayer(group);
            });
            group.addLayer(runLayer);
        });
        window._mapEngine = this; 
    }

    toggleLayer(name, show) { if(show) this.map.addLayer(this.layers[name]); else this.map.removeLayer(this.layers[name]); }

    handleAssetClick(event, name, type, address, isOneOff) {
        L.DomEvent.stopPropagation(event);
        const safeName = name || "Unknown Site";
        const safeAddr = address || "No address data";
        
        if(this.role === 'agent') {
            AgentCtrl.activeSite = { name: safeName, type: type };
            document.getElementById('s-name').innerText = safeName;
            document.getElementById('s-type').innerText = type;
            document.getElementById('s-address').value = safeAddr;
            UI.openPopup('site-info');
        } else if (this.role === 'dispatch') {
            DispatchCtrl.activeSite = { name: safeName, type: type, address: safeAddr, isOneOff: isOneOff };
            document.getElementById('s-name').innerText = safeName;
            document.getElementById('s-type').innerText = type;
            document.getElementById('s-address').value = safeAddr;
            UI.openPopup('site-info');
        }
    }

    initGPS() {
        this.userMarker = L.marker([0,0], { icon: L.divIcon({ className: '', html: '<div class="van-inner" style="font-size: 40px; transform: rotate(90deg);">🚐</div>', iconSize: [40,40], iconAnchor: [20,20] }) }).addTo(this.map);
        if(navigator.geolocation) {
            navigator.geolocation.watchPosition(pos => {
                this.userMarker.setLatLng([pos.coords.latitude, pos.coords.longitude]);
                this.map.panTo([pos.coords.latitude, pos.coords.longitude]);
            }, err => console.warn(err), { enableHighAccuracy: true });
        }
    }
}

const AgentCtrl = {
    activeSite: { name: "", type: "" },
    workState: { startTime: null, accumulated: 0, photo1: null, photo2: null },
    timerInterval: null,
    
    init: function() {
        const activeId = CoreDB.getActiveTenantId();
        const t = CoreDB.getTenants().find(x => x.id === activeId);
        if (t && t.status !== 'ACTIVE') { UI.lockoutScreen('agent', t.status, t.name); return; }

        if(document.getElementById('page-title')) document.getElementById('page-title').innerText = `${BRAND_NAME} | Agent v4.5`;
        new MapEngine('map', 'agent');
        this.renderFields();
        setInterval(() => { const el = document.getElementById('menu-clock'); if(el) el.innerText = new Date().toLocaleString('en-NZ', { dateStyle: 'medium', timeStyle: 'short' }); }, 1000);
    },

    renderFields: function() {
        const container = document.getElementById('dynamic-work-fields');
        if(!container) return;
        let html = '';
        CoreDB.getSchema().forEach(f => {
            if(!f.tenantVisible) return;
            if(f.type === 'select') {
                html += `<select id="work-${f.id}" class="std-input"><option value="">${f.label}...</option>`;
                f.options.forEach(opt => { if(opt.visible) html += `<option value="${opt.name}">${opt.name}</option>`; });
                html += `</select>`;
            } else {
                let pType = f.type === 'number' ? 'number' : 'text';
                html += `<input type="${pType}" id="work-${f.id}" class="std-input" placeholder="${f.label} ${f.tenantMandatory?'':'(Optional)'}">`;
            }
        });
        container.innerHTML = html;
        let srnField = CoreDB.getSchema().find(f => f.id === 'srn');
        let inspSrn = document.getElementById('insp-srn');
        if(inspSrn && srnField) inspSrn.style.display = srnField.tenantVisible ? 'block' : 'none';
    },

    openOverlay: function(type) {
        UI.closePopup('site-info');
        document.querySelectorAll('.target-site-name').forEach(el => el.innerText = this.activeSite.name);
        UI.openOverlay(type);
    },

    handlePhoto: function(step) {
        const input = document.getElementById('photo-' + step) || document.getElementById('photo-insp-' + step); 
        const btn = document.getElementById('btn-' + step);
        if(!input || !input.files || !input.files[0]) return;
        
        btn.innerHTML = `<div style="padding:10px;">⏳ Processing...</div>`;
        const now = new Date();
        
        UI.processAndWatermarkImage(input.files[0], (dataUrl) => {
            btn.classList.add('done');
            btn.style.backgroundImage = `url(${dataUrl})`;
            btn.innerHTML = `<div style="background:rgba(0,0,0,0.7); display:inline-block; padding:5px 10px; border-radius:5px; color:#fff;">✓ ${step.toUpperCase()}<br><small>${now.toLocaleTimeString('en-NZ')}</small></div>`;
            
            if(step === 'before' || step === 'start') {
                this.workState.startTime = now;
                this.startTimer();
                if(document.getElementById('pause-work-btn')) document.getElementById('pause-work-btn').disabled = false;
                if(document.getElementById('pause-insp-btn')) document.getElementById('pause-insp-btn').disabled = false;
            } else {
                if(document.getElementById('submit-work-btn')) document.getElementById('submit-work-btn').disabled = false;
                if(document.getElementById('submit-insp-btn')) document.getElementById('submit-insp-btn').disabled = false;
            }
        });
    },

    startTimer: function() {
        const widget = document.getElementById('live-timer-widget');
        widget.style.display = 'block';
        this.timerInterval = setInterval(() => {
            const secs = Math.floor((new Date() - this.workState.startTime + this.workState.accumulated) / 1000);
            widget.innerText = `${Math.floor(secs / 60).toString().padStart(2,'0')}:${(secs % 60).toString().padStart(2,'0')}`;
        }, 1000);
    },
    stopTimer: function() { clearInterval(this.timerInterval); document.getElementById('live-timer-widget').style.display = 'none'; },

    cancelJob: function() {
        if(!confirm("Cancel this job?")) return;
        this.stopTimer();
        this.workState = { startTime: null, accumulated: 0, photo1: null, photo2: null };
        UI.closeOverlay('work');
    },

    pauseJob: function() {
        const elapsed = new Date() - this.workState.startTime;
        CoreDB.pushJob({ site: this.activeSite.name, type: 'WORK', accumulated: this.workState.accumulated + elapsed, pausedAt: new Date().toLocaleString('en-NZ') });
        this.stopTimer(); UI.closeOverlay('work');
    },

    submitWork: function() {
        let failed = false;
        CoreDB.getSchema().forEach(f => {
            if(f.tenantVisible && f.tenantMandatory) {
                const el = document.getElementById(`work-${f.id}`);
                if(el && !el.value) failed = true;
            }
        });
        if(failed) { alert("Please complete required fields."); return; }
        alert("Job Submitted via Email Link Stub");
        this.stopTimer(); UI.closeOverlay('work');
    },
    
    openJobBank: function() {
        const list = document.getElementById('agent-bank-list');
        const data = CoreDB.getTenantJobs();
        if (data.length === 0) { list.innerHTML = '<p style="text-align:center; color:#666;">No paused jobs.</p>'; }
        else {
            list.innerHTML = data.map((j) => `<div style="background:#f1f2f6; margin-bottom:10px; padding:15px; border-radius:10px; cursor:pointer;" onclick="AgentCtrl.resumeJob('${j.jobId}')"><strong>${j.type}</strong>: ${j.site}<br><small>${j.pausedAt}</small></div>`).join('');
        }
        UI.openOverlay('jobbank');
    },
    resumeJob: function(jobId) {
        let job = CoreDB.getJob(jobId);
        if(!job) return;
        this.activeSite.name = job.site;
        this.workState.accumulated = job.accumulated;
        this.workState.startTime = new Date();
        CoreDB.removeJob(jobId);
        UI.closeOverlay('jobbank');
        this.openOverlay(job.type === 'INSPECTION' ? 'inspection' : 'work');
        this.startTimer();
    },
    centerGPS: function() { if(window._mapEngine) window._mapEngine.map.panTo(window._mapEngine.userMarker.getLatLng()); }
};

const DispatchCtrl = {
    activeSite: { name: "", type: "", address: "", isOneOff: false },
    
    init: function() {
        const activeId = CoreDB.getActiveTenantId();
        const t = CoreDB.getTenants().find(x => x.id === activeId);
        if (t && t.status !== 'ACTIVE') { UI.lockoutScreen('dispatch', t.status, t.name); return; }

        if(window.location.search.includes('iframe=true')) {
            const lo = document.getElementById('standalone-logout');
            if(lo) lo.style.display = 'none';
        }
        new MapEngine('dispatch-map', 'dispatch');
        this.renderBank('PENDING');
    },

    async searchAddress() {
        const query = document.getElementById('dispatch-search').value;
        if(!query) return;
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=nz`);
            const data = await res.json();
            if(data.length > 0) {
                const lat = parseFloat(data[0].lat); const lon = parseFloat(data[0].lon);
                window._mapEngine.map.setView([lat, lon], 17);
                if(window._mapEngine.searchMarker) window._mapEngine.map.removeLayer(window._mapEngine.searchMarker);
                
                const m = L.marker([lat, lon], { icon: L.divIcon({ className: '', html: `<div class="marker-inner" style="background-color: #34495e; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; font-size: 18px;">📍</div>`, iconSize: [38, 38], iconAnchor: [19, 19] }) }).addTo(window._mapEngine.map);
                window._mapEngine.searchMarker = m;
                
                const cleanAddr = data[0].display_name.split(',')[0];
                UI.closeLeftSidebar();
                m.on('click', (e) => window._mapEngine.handleAssetClick(e, cleanAddr, "One-Off Location", data[0].display_name, true));
                m.fire('click');
            } else { alert("Location not found."); }
        } catch(e) { console.error(e); }
    },

    openDispatchForm: function() {
        UI.closePopup('site-info');
        document.getElementById('dispatch-target-name').innerText = this.activeSite.name;
        document.getElementById('permanent-asset-request').style.display = this.activeSite.isOneOff ? 'block' : 'none';
        document.getElementById('dispatch-make-permanent').checked = false;
        document.getElementById('dispatch-srn').value = '';
        document.getElementById('dispatch-notes').value = '';
        UI.openOverlay('dispatch');
    },

    openHistory: function() {
        UI.closePopup('site-info');
        document.getElementById('history-target-name').innerText = this.activeSite.name;
        UI.openOverlay('history');
    },

    submitJob: function() {
        const srn = document.getElementById('dispatch-srn').value.trim();
        const notes = document.getElementById('dispatch-notes').value.trim();
        const reqPerm = document.getElementById('dispatch-make-permanent').checked;
        
        let finalNotes = notes;
        if(reqPerm && this.activeSite.isOneOff) finalNotes = "[ADMIN REQ: Make site permanent] - " + notes;

        CoreDB.pushJob({ site: this.activeSite.name, srn: srn || 'N/A', type: 'PENDING', notes: finalNotes, accumulated: 0, pausedAt: new Date().toLocaleString('en-NZ') });
        
        UI.closeOverlay('dispatch');
        UI.openRightSidebar();
        this.renderBank('PENDING');
    },

    renderBank: function(filterType) {
        const listEl = document.getElementById('dispatch-bank-list');
        const data = CoreDB.getTenantJobs();
        const filtered = data.filter(j => (filterType === 'PENDING' && j.type !== 'COMPLETED') || (filterType === 'COMPLETED' && j.type === 'COMPLETED') );
        
        if(filtered.length === 0) { listEl.innerHTML = `<p style="text-align:center; color:#888; font-size:13px; margin-top:20px;">No ${filterType} jobs.</p>`; return; }
        
        listEl.innerHTML = filtered.map(j => `
            <div style="background:var(--bg-white); border: 1px solid #ddd; margin-bottom:10px; padding:15px; border-radius:8px; font-size:13px; border-left: 4px solid ${j.type==='WORK'?'#f1c40f':(j.type==='PENDING'?'#9b59b6':'#e74c3c')};">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;"><strong>${j.site}</strong><span class="badge blue" style="background:#333;">${j.srn}</span></div>
                <div style="color:#666; margin-bottom: 5px;">Status: <strong style="color:var(--b);">${j.type}</strong></div>
                <div style="color:#888; font-size: 11px;">${j.pausedAt}</div>
                ${j.notes ? `<div style="margin-top:8px; padding:8px; background:#f9f9f9; border-radius:4px; font-style:italic; border:1px dashed #ccc;">"${j.notes}"</div>` : ''}
            </div>`).join('');
    }
};

const AdminCtrl = {
    init: function() { 
        this.renderSchema(); 
        const activeId = CoreDB.getActiveTenantId();
        const t = CoreDB.getTenants().find(x => x.id === activeId);
        if(t) {
            if(document.getElementById('admin-tenant-name')) document.getElementById('admin-tenant-name').innerText = t.name;
            if(document.getElementById('admin-tenant-motto')) document.getElementById('admin-tenant-motto').innerText = t.motto || '';
            const logoEl = document.getElementById('admin-tenant-logo');
            if(logoEl) {
                if(t.logo) logoEl.innerHTML = `<img src="${t.logo}" style="max-height:80px; max-width:200px;">`;
                else logoEl.innerHTML = `⚓`; 
            }
        }
    },
    switchTab: function(id) {
        document.querySelectorAll('.admin-tab-content').forEach(el => el.style.display = 'none');
        document.getElementById('tab-' + id).style.display = 'block';
        if(id === 'settings') this.closeSubPanel();
    },
    loadModule: function(url, navElement) {
        document.querySelectorAll('.admin-nav-item').forEach(el => el.classList.remove('active-nav'));
        if(navElement) navElement.classList.add('active-nav');
        
        this.switchTab('iframe');
        document.getElementById('admin-module-frame').src = url;
    },
    openSubPanel: function(id) { document.getElementById('settings-overview').style.display = 'none'; document.getElementById('panel-' + id).style.display = 'block'; },
    closeSubPanel: function() { document.getElementById('panel-fields').style.display = 'none'; document.getElementById('settings-overview').style.display = 'block'; },
    renderSchema: function() {
        const c = document.getElementById('admin-schema-render');
        if(!c) return;
        let html = '<table style="width:100%; border-collapse:collapse; font-size:14px; text-align:left;"><tr style="border-bottom:2px solid #ddd; color:#666;"><th style="padding:10px 5px;">Data Field</th><th style="padding:10px 5px; text-align:center; width:120px;">Visible</th><th style="padding:10px 5px; text-align:center; width:120px;">Mandatory</th></tr>';
        CoreDB.getSchema().forEach(f => {
            html += `<tr style="border-bottom: 1px solid #eee; background: #fff;">`;
            if(f.type === 'select') { html += `<td style="padding: 12px 5px; font-weight:bold; cursor: pointer; color: var(--b);" onclick="UI.toggleSubRow('adm-sub-${f.id}', 'adm-icon-${f.id}')"><span id="adm-icon-${f.id}" style="display:inline-block; width: 15px;">▶</span> ${f.label}</td>`; } 
            else { html += `<td style="padding: 12px 5px; font-weight:bold; color: #333;"><span style="display:inline-block; width: 15px;"></span> ${f.label}</td>`; }
            html += `<td style="padding: 12px 5px; text-align: center;"><label class="toggle-switch"><input type="checkbox" ${f.tenantVisible?'checked':''} onchange="AdminCtrl.toggleVis('${f.id}')"><span class="slider"></span></label></td>`;
            html += `<td style="padding: 12px 5px; text-align: center;"><label class="toggle-switch"><input type="checkbox" ${f.tenantMandatory?'checked':''} onchange="AdminCtrl.toggleMan('${f.id}')"><span class="slider"></span></label></td></tr>`;
            if(f.type === 'select') {
                html += `<tr id="adm-sub-${f.id}" style="display: none; background: #fafafa; border-bottom: 2px solid #ddd;"><td colspan="3" style="padding: 15px 15px 20px 35px;"><div class="sub-options-list">`;
                f.options.forEach(opt => { html += `<div class="sub-option-row"><span>${opt.name}</span><label class="toggle-switch small"><input type="checkbox" ${opt.visible?'checked':''} onchange="AdminCtrl.toggleOptVis('${f.id}', '${opt.name}')"><span class="slider"></span></label></div>`; });
                html += `</div></td></tr>`;
            }
        });
        c.innerHTML = html + '</table>';
    },
    toggleVis: function(id) { let db=CoreDB.getSchema(); let f=db.find(x=>x.id===id); if(f){f.tenantVisible=!f.tenantVisible; CoreDB.saveSchema(db); this.renderSchema();} },
    toggleMan: function(id) { let db=CoreDB.getSchema(); let f=db.find(x=>x.id===id); if(f){f.tenantMandatory=!f.tenantMandatory; CoreDB.saveSchema(db); this.renderSchema();} },
    toggleOptVis: function(fid, opt) { let db=CoreDB.getSchema(); let f=db.find(x=>x.id===fid); if(f){let o=f.options.find(y=>y.name===opt); if(o){o.visible=!o.visible; CoreDB.saveSchema(db); this.renderSchema();}} }
};

const GodCtrl = {
    init: function() { this.renderSchema(); this.renderTenants(); },
    switchTab: function(id) {
        document.querySelectorAll('.admin-tab-content').forEach(el => el.style.display = 'none');
        document.getElementById('tab-' + id).style.display = 'block';
        document.querySelectorAll('.admin-nav-item').forEach(el => el.classList.remove('active-nav'));
        event.currentTarget.classList.add('active-nav');
    },
    
    exportDBText: function() {
        const data = `const defaultSchema = ${JSON.stringify(CoreDB.getSchema(), null, 4)};`;
        UI.downloadTextFile('Spoof_Database.txt', data);
    },
    exportBlankTemplate: function() {
        const blank = [{ "id": "example_field", "label": "Example Label", "type": "text", "tenantVisible": true, "tenantMandatory": false, "options": [] }];
        const data = `const defaultSchema = ${JSON.stringify(blank, null, 4)};`;
        UI.downloadTextFile('Blank_Database_Template.txt', data);
    },

    renderTenants: function() {
        const c = document.getElementById('god-tenant-list');
        if(!c) return;
        const tenants = CoreDB.getTenants();
        const bank = CoreDB.getJobBank();
        
        c.innerHTML = tenants.map(t => {
            const tenantJobs = bank.filter(j => j.tenantId === t.id); 
            const pendingCount = tenantJobs.filter(j => j.type !== 'COMPLETED').length;
            const completedCount = tenantJobs.filter(j => j.type === 'COMPLETED').length;
            const statColor = t.status === 'ACTIVE' ? '#2ecc71' : (t.status === 'SUSPENDED' ? '#f1c40f' : '#e74c3c');
            return `
            <div style="background:var(--bg-light); border:1px solid #ddd; border-radius:8px; margin-bottom:10px; overflow:hidden;">
                <div style="padding:15px; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="UI.toggleSubRow('t-exp-${t.id}', 't-icon-${t.id}')">
                    <div>
                        <span id="t-icon-${t.id}" style="display:inline-block; width:15px; font-size:12px;">▶</span>
                        <h4 style="margin:0; display:inline-block; color:var(--text-dark);">${t.name}</h4>
                        <span style="font-size:12px; color:#666; margin-left:10px;">ID: ${t.id} | Tier: ${t.tier}</span>
                    </div>
                    <div><span class="badge blue" style="background:${statColor};">${t.status}</span></div>
                </div>
                <div id="t-exp-${t.id}" style="display:none; padding:20px; border-top:1px solid #ddd; background:#fff;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:15px; background:#f4f6f8; padding:10px; border-radius:8px; align-items:center;">
                        <div style="font-size:12px; color:#555;"><strong>Live Metrics:</strong> <span style="margin-left:10px; color:#e74c3c;">${pendingCount} Pending</span> | <span style="margin-left:10px; color:#2ecc71;">${completedCount} Completed</span></div>
                        <button class="std-btn gray" style="width:auto; padding:8px 15px; font-size:11px;" onclick="GodCtrl.impersonateTenant('${t.id}')">Enter Admin Dashboard</button>
                    </div>
                    <div class="form-grid" style="grid-template-columns: 1fr 1fr 1fr;">
                        <div><label class="input-label">Council Name</label><input type="text" id="t-name-${t.id}" class="std-input" value="${t.name}"></div>
                        <div>
                            <label class="input-label">Subscription Tier</label>
                            <select id="t-tier-${t.id}" class="std-input">
                                <option value="City A" ${t.tier==='City A'?'selected':''}>City A (Test)</option>
                                <option value="City B" ${t.tier==='City B'?'selected':''}>City B (Test)</option>
                                <option value="Municipal - Small" ${t.tier==='Municipal - Small'?'selected':''}>Municipal - Small</option>
                                <option value="Municipal - Large" ${t.tier==='Municipal - Large'?'selected':''}>Municipal - Large</option>
                                <option value="State Police" ${t.tier==='State Police'?'selected':''}>State Police</option>
                            </select>
                        </div>
                        <div><label class="input-label">Licenses</label><input type="number" id="t-lic-${t.id}" class="std-input" value="${t.licenses}"></div>
                        
                        <div><label class="input-label">Primary Contact</label><input type="text" id="t-cname-${t.id}" class="std-input" value="${t.contactName || ''}" placeholder="Name"></div>
                        <div><label class="input-label">Contact Email</label><input type="email" id="t-cemail-${t.id}" class="std-input" value="${t.contactEmail || ''}" placeholder="Email"></div>
                        <div><label class="input-label">Contact Phone</label><input type="text" id="t-cphone-${t.id}" class="std-input" value="${t.contactPhone || ''}" placeholder="Phone"></div>
                        
                        <div style="grid-column: span 3;"><label class="input-label">Tenant Logo (URL or Image Link)</label><input type="text" id="t-logo-${t.id}" class="std-input" placeholder="https://..." value="${t.logo || ''}"></div>
                        
                        <div style="grid-column: span 2;"><label class="input-label">Motto / Slogan</label><input type="text" id="t-motto-${t.id}" class="std-input" value="${t.motto || ''}"></div>
                        <div>
                            <label class="input-label">Billing Cycle</label>
                            <select id="t-bill-${t.id}" class="std-input">
                                <option value="Monthly" ${t.billingCycle==='Monthly'?'selected':''}>Monthly</option>
                                <option value="Annually" ${t.billingCycle==='Annually'?'selected':''}>Annually</option>
                            </select>
                        </div>
                        <div>
                            <label class="input-label">Account Status</label>
                            <select id="t-stat-${t.id}" class="std-input" style="border:2px solid ${statColor};">
                                <option value="ACTIVE" ${t.status==='ACTIVE'?'selected':''}>Active</option>
                                <option value="SUSPENDED" ${t.status==='SUSPENDED'?'selected':''}>Suspended (Arrears)</option>
                                <option value="DEACTIVATED" ${t.status==='DEACTIVATED'?'selected':''}>Deactivated</option>
                            </select>
                        </div>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-top:20px; border-top:1px dashed #eee; padding-top:15px;">
                        <button class="std-btn red" style="width:auto; padding:10px 20px;" onclick="GodCtrl.deleteTenant('${t.id}')">Delete Tenant</button>
                        <button class="std-btn blue" style="width:auto; padding:10px 40px; font-size:16px;" onclick="GodCtrl.saveTenant('${t.id}')">Confirm Changes</button>
                    </div>
                </div>
            </div>`;
        }).join('');
    },
    addTenant: function() {
        const name = prompt("Enter Council Name:");
        if(!name) return;
        const tenants = CoreDB.getTenants();
        tenants.push({ 
            id: 'T'+Math.floor(Math.random()*900+100), name: name, tier: "Municipal - Small", licenses: 4, status: "ACTIVE", motto: "",
            contactName: "", contactEmail: "", contactPhone: "", billingCycle: "Monthly", logo: ""
        });
        CoreDB.saveTenants(tenants);
        this.renderTenants();
    },
    saveTenant: function(id) {
        const tenants = CoreDB.getTenants();
        const t = tenants.find(x => x.id === id);
        if(t) {
            t.name = document.getElementById(`t-name-${id}`).value;
            t.tier = document.getElementById(`t-tier-${id}`).value;
            t.licenses = parseInt(document.getElementById(`t-lic-${id}`).value) || 0;
            t.status = document.getElementById(`t-stat-${id}`).value;
            t.motto = document.getElementById(`t-motto-${id}`).value;
            t.contactName = document.getElementById(`t-cname-${id}`).value;
            t.contactEmail = document.getElementById(`t-cemail-${id}`).value;
            t.contactPhone = document.getElementById(`t-cphone-${id}`).value;
            t.billingCycle = document.getElementById(`t-bill-${id}`).value;
            t.logo = document.getElementById(`t-logo-${id}`).value;
            CoreDB.saveTenants(tenants);
            this.renderTenants();
            alert("Tenant details confirmed and updated.");
        }
    },
    deleteTenant: function(id) {
        if(confirm("Are you sure you want to completely delete this tenant? This action cannot be undone.")) {
            let tenants = CoreDB.getTenants().filter(x => x.id !== id);
            CoreDB.saveTenants(tenants);
            this.renderTenants();
        }
    },
    impersonateTenant: function(id) {
        CoreDB.setActiveTenantId(id);
        window.location.href = 'admin.html';
    },

    renderSchema: function() {
        const c = document.getElementById('god-schema-render');
        if(!c) return;
        let html = '<table style="width:100%; border-collapse:collapse; font-size:14px; text-align:left;"><tr style="background:var(--nav-dark); color:white;"><th style="padding:12px 15px;">Global Field</th><th style="padding:12px 15px; width:100px;">Type</th><th style="padding:12px 15px; text-align:right; width:100px;">Action</th></tr>';
        CoreDB.getSchema().forEach(f => {
            html += `<tr style="border-bottom: 1px solid #eee; background: #fff;">`;
            if(f.type === 'select') { html += `<td style="padding: 15px; font-weight:bold; cursor: pointer; color: var(--b);" onclick="UI.toggleSubRow('god-sub-${f.id}', 'god-icon-${f.id}')"><span id="god-icon-${f.id}" style="display:inline-block; width: 15px;">▶</span> ${f.label}</td>`; } 
            else { html += `<td style="padding: 15px; font-weight:bold; color: #333;"><span style="display:inline-block; width: 15px;"></span> ${f.label}</td>`; }
            html += `<td style="padding: 15px; color: #666;">${f.type}</td><td style="padding: 15px; text-align: right;"><button class="std-btn red" style="padding: 6px 12px; font-size: 11px; width: auto;" onclick="GodCtrl.delField('${f.id}')">Delete</button></td></tr>`;
            if(f.type === 'select') {
                html += `<tr id="god-sub-${f.id}" style="display: none; background: #fafafa; border-bottom: 2px solid #ddd;"><td colspan="3" style="padding: 20px 20px 25px 45px;"><div class="sub-options-list">`;
                f.options.forEach(opt => { html += `<div class="sub-option-row"><span>${opt.name}</span><button class="std-btn red" style="padding: 4px 10px; font-size: 10px; width: auto;" onclick="GodCtrl.delOpt('${f.id}', '${opt.name}')">✕</button></div>`; });
                html += `<div style="display: flex; gap: 10px; margin-top: 10px;"><input type="text" id="god-opt-${f.id}" class="std-input" style="margin-bottom: 0; padding: 10px;"><button class="std-btn green" style="width: auto; padding: 0 20px;" onclick="GodCtrl.addOpt('${f.id}')">➕</button></div></div></td></tr>`;
            }
        });
        c.innerHTML = html + '</table>';
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
});
