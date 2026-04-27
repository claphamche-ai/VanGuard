// ==========================================
// VANGUARD V1.1.10 - SCHEMA UPDATE & AUDIT TRAIL
// ==========================================
const BRAND_NAME = "VanGuard";

const CoreDB = {
    defaultSchema: [
        { "id": "srn", "label": "Service Request Number (SRN)", "type": "text", "category": "General Info", "tenantVisible": true, "tenantMandatory": false, "options": null },
        { "id": "asset_id", "label": "Council Asset ID", "type": "text", "category": "General Info", "tenantVisible": true, "tenantMandatory": false, "options": null },
        { "id": "tag_content", "label": "Tag Content / Graffiti Name", "type": "text", "category": "General Info", "tenantVisible": true, "tenantMandatory": false, "options": null },
        { "id": "graffiti_tag_interpretation", "label": "Graffiti/Tag Interpretation", "type": "text", "category": "General Info", "tenantVisible": true, "tenantMandatory": false, "options": null },
        { "id": "property_owner", "label": "Property Owner", "type": "select", "category": "General Info", "tenantVisible": true, "tenantMandatory": false, "options": [ { "name": "Porirua City Council", "visible": true }, { "name": "Private Residential", "visible": true }, { "name": "Wellington Electricity", "visible": true }, { "name": "Thompson Property Group", "visible": true }, { "name": "Kiwi Rail", "visible": true }, { "name": "Housing NZ", "visible": true }, { "name": "NZTA-Waka Kotahi", "visible": true } ] },
        { "id": "surface_type", "label": "Surface Type", "type": "select", "category": "Site Conditions", "tenantVisible": true, "tenantMandatory": true, "options": [ { "name": "Brick", "visible": true }, { "name": "Concrete", "visible": true }, { "name": "Glass", "visible": true }, { "name": "Metal", "visible": true }, { "name": "Painted Surface", "visible": true }, { "name": "Wood", "visible": true } ] },
        { "id": "graffiti_type", "label": "Graffiti Type", "type": "select", "category": "Site Conditions", "tenantVisible": true, "tenantMandatory": true, "options": [ { "name": "Etching/Scratch", "visible": true }, { "name": "Chalk", "visible": true }, { "name": "Crayon", "visible": true }, { "name": "Marker/Felt Tip Pen", "visible": true }, { "name": "Ink", "visible": true }, { "name": "Lipstick", "visible": true }, { "name": "Sticker", "visible": true }, { "name": "Poster", "visible": true }, { "name": "Mud", "visible": true }, { "name": "Nail Polish", "visible": true }, { "name": "Paint", "visible": true }, { "name": "Paint Bomb", "visible": true }, { "name": "Pencil", "visible": true }, { "name": "Poison/Weed Killer", "visible": true }, { "name": "Roller", "visible": true }, { "name": "Spray Painting", "visible": true }, { "name": "Stencil", "visible": true }, { "name": "Twink", "visible": true } ] },
        { "id": "property_type", "label": "Property Type", "type": "select", "category": "Work Details", "tenantVisible": true, "tenantMandatory": false, "options": [ { "name": "Commercial Building", "visible": true }, { "name": "Suburban Shopping Center", "visible": true }, { "name": "Telecommunications", "visible": true }, { "name": "Community Center", "visible": true }, { "name": "CSL/Traffic Management Box", "visible": true }, { "name": "Mail Box", "visible": true }, { "name": "Car Park", "visible": true }, { "name": "Playground", "visible": true }, { "name": "Private Fence", "visible": true }, { "name": "Private Garage", "visible": true }, { "name": "Private House", "visible": true }, { "name": "Private Signage", "visible": true }, { "name": "Public Fence", "visible": true }, { "name": "Public Signage", "visible": true }, { "name": "Alley Way", "visible": true }, { "name": "Public Mural", "visible": true }, { "name": "Bridge", "visible": true }, { "name": "Underpass", "visible": true }, { "name": "Overpass", "visible": true }, { "name": "Bus Shelter", "visible": true }, { "name": "Power Pole", "visible": true }, { "name": "Light Pole", "visible": true }, { "name": "Coms Pole", "visible": true }, { "name": "Other Pole", "visible": true }, { "name": "Tunnel", "visible": true }, { "name": "Street Signage", "visible": true }, { "name": "Traffic Signage", "visible": true }, { "name": "Skate Ramp", "visible": true }, { "name": "Park Bench", "visible": true }, { "name": "Rubbish Bin", "visible": true }, { "name": "Road", "visible": true }, { "name": "Footpath", "visible": true }, { "name": "Picnic Table", "visible": true }, { "name": "Skip Bin", "visible": true }, { "name": "Shipping Container", "visible": true }, { "name": "Substation", "visible": true }, { "name": "Tree", "visible": true }, { "name": "Vehicle", "visible": true }, { "name": "Other", "visible": true } ] },
        { "id": "removal_method", "label": "Removal Method", "type": "select", "category": "Work Details", "tenantVisible": true, "tenantMandatory": true, "options": [ { "name": "Paint Over", "visible": true }, { "name": "Pressure Wash", "visible": true }, { "name": "Sandblasting", "visible": true }, { "name": "Chemical Removal", "visible": true }, { "name": "Mechanical Sanding", "visible": true }, { "name": "Steam Cleaning", "visible": true } ] },
        { "id": "paint_color", "label": "Paint Color (If Applicable)", "type": "select", "category": "Work Details", "tenantVisible": true, "tenantMandatory": false, "options": [ { "name": "N/A", "visible": true }, { "name": "White", "visible": true }, { "name": "Black", "visible": true }, { "name": "Custom Match", "visible": true }, { "name": "Light Grey", "visible": true }, { "name": "Dark Grey", "visible": true }, { "name": "Tan", "visible": true }, { "name": "Brown", "visible": true }, { "name": "Green", "visible": true }, { "name": "Blue", "visible": true }, { "name": "Red", "visible": true }, { "name": "Yellow", "visible": true }, { "name": "Orange", "visible": true } ] },
        { "id": "chemical_brand", "label": "Chemical Brand", "type": "select", "category": "Work Details", "tenantVisible": true, "tenantMandatory": false, "options": [ { "name": "EzyClean Blue", "visible": true }, { "name": "EzyClean Black", "visible": true }, { "name": "EzyClean Red", "visible": true }, { "name": "EzyClean Pink", "visible": true }, { "name": "EzyClean Sealer", "visible": true } ] },
        { "id": "area", "label": "Repaired Area (m²)", "type": "select", "category": "Metrics", "tenantVisible": true, "tenantMandatory": true, "options": [ { "name": "0.5", "visible": true }, { "name": "1.0", "visible": true }, { "name": "2.0", "visible": true }, { "name": "5.0", "visible": true }, { "name": "10.0+", "visible": true } ] },
        { "id": "size_of_damaged_area_", "label": "Size of Damaged area.", "type": "text", "category": "Metrics", "tenantVisible": true, "tenantMandatory": false, "options": null },
        { "id": "workers", "label": "Number of Workers", "type": "select", "category": "Metrics", "tenantVisible": true, "tenantMandatory": true, "options": [ { "name": "1 Worker", "visible": true }, { "name": "2 Workers", "visible": true }, { "name": "3+ Workers", "visible": true } ] },
        { "id": "chemicals_used__liters_", "label": "Chemicals Used (liters)", "type": "text", "category": "Metrics", "tenantVisible": true, "tenantMandatory": false, "options": null },
        { "id": "paint_used__liters_", "label": "Paint Used (liters)", "type": "text", "category": "Metrics", "tenantVisible": true, "tenantMandatory": false, "options": null }
    ],
    defaultFlags: { liveTracking: true, directAssignment: true },
    defaultTenants: [
        { "id": "T001", "name": "Porirua City Council", "tier": "City A", "licenses": 15, "status": "ACTIVE", "motto": "Mo Te Katoa Nga Iwi", "logo": "", "homeLat": -41.135, "homeLng": 174.84, "defaultZoom": 14, "reportEmail": "info@poriruacity.govt.nz" }
    ],
    defaultUsers: [
        { id: "U001", username: "admin", password: "123", role: "admin", tenantId: "T001", name: "Porirua Admin", contact: "04 237 5089", status: "ACTIVE", allowedLayers: [], requirePunchIn: true },
        { id: "U002", username: "worker", password: "123", role: "agent", tenantId: "T001", name: "John Doe", contact: "021 555 1234", status: "ACTIVE", allowedLayers: [], requirePunchIn: true },
        { id: "U003", username: "dispatch", password: "123", role: "dispatch", tenantId: "T001", name: "Jane Smith", contact: "021 555 5678", status: "ACTIVE", allowedLayers: [], requirePunchIn: true },
        { id: "U007", username: "reporter", password: "123", role: "reporter", tenantId: "T001", name: "Desk Reporter", contact: "021 000 000", status: "ACTIVE", allowedLayers: [], requirePunchIn: true }
    ],
    kmlConfig: [],

    getFlags: function() { let mem = localStorage.getItem('vg_flags'); if(!mem) { localStorage.setItem('vg_flags', JSON.stringify(this.defaultFlags)); mem = localStorage.getItem('vg_flags'); } return JSON.parse(mem); },
    saveFlags: function(data) { localStorage.setItem('vg_flags', JSON.stringify(data)); },
    getSchema: function() { let mem = localStorage.getItem('vg_schema'); if(!mem) { localStorage.setItem('vg_schema', JSON.stringify(this.defaultSchema)); mem = localStorage.getItem('vg_schema'); } return JSON.parse(mem); },
    saveSchema: function(data) { localStorage.setItem('vg_schema', JSON.stringify(data)); },
    getTenants: function() { let mem = localStorage.getItem('tt_tenants'); if(!mem) { localStorage.setItem('tt_tenants', JSON.stringify(this.defaultTenants)); return this.defaultTenants; } return JSON.parse(mem); },
    saveTenants: function(data) { localStorage.setItem('tt_tenants', JSON.stringify(data)); },
    getUsers: function() { let mem = localStorage.getItem('tt_users'); if(!mem) { localStorage.setItem('tt_users', JSON.stringify(this.defaultUsers)); return this.defaultUsers; } return JSON.parse(mem); },
    saveUsers: function(data) { localStorage.setItem('tt_users', JSON.stringify(data)); },
    getCustomKMLs: function() { return JSON.parse(localStorage.getItem('tt_custom_kmls') || '[]'); },
    saveCustomKMLs: function(data) { localStorage.setItem('tt_custom_kmls', JSON.stringify(data)); },
    getJobBank: function() { return JSON.parse(localStorage.getItem('tt_jobbank') || '[]'); },
    saveJobBank: function(data) { localStorage.setItem('tt_jobbank', JSON.stringify(data)); },
    getShifts: function() { return JSON.parse(localStorage.getItem('tt_shifts') || '[]'); },
    saveShifts: function(data) { localStorage.setItem('tt_shifts', JSON.stringify(data)); },
    getReports: function() { return JSON.parse(localStorage.getItem('tt_reports') || '[]'); },
    saveReports: function(data) { localStorage.setItem('tt_reports', JSON.stringify(data)); },
    getReportTemplates: function() { return JSON.parse(localStorage.getItem('tt_report_templates') || '[]'); },
    saveReportTemplates: function(data) { localStorage.setItem('tt_report_templates', JSON.stringify(data)); },

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
    
    // Auditable Update Job
    updateJob: function(jobId, newData, reason) {
        let b = this.getJobBank();
        let idx = b.findIndex(j => j.jobId === jobId);
        if(idx !== -1) {
            let j = b[idx];
            if (!j.auditLog) j.auditLog = [];
            // Deep clone original state
            let snapshot = JSON.parse(JSON.stringify(j));
            delete snapshot.auditLog; // Don't nest endless logs
            
            j.auditLog.push({ 
                timestamp: Date.now(), 
                dateStr: new Date().toLocaleString('en-NZ'), 
                reason: reason, 
                previousState: snapshot 
            });

            // Apply new data
            j.data = newData.data;
            if(newData.photos) j.photos = newData.photos;
            if(newData.notes) j.notes = newData.notes;
            
            // Reset billing review
            j.reviewStatus = 'UNREVIEWED'; 
            j.rejectReason = '';
            
            this.saveJobBank(b);
        }
    },

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
        const newShift = { shiftId: 'SHIFT-' + Date.now(), tenantId: this.getActiveTenantId(), userId: user.id, username: user.name || user.username, startTime: new Date().toISOString(), endTime: null, status: 'OPEN', breadcrumbs: [], totalDistance: 0 };
        shifts.push(newShift); this.saveShifts(shifts); return newShift;
    },
    closeShift: function() {
        let shifts = this.getShifts(); const user = this.getActiveUser(); const idx = shifts.findIndex(s => s.userId === user.id && s.status === 'OPEN');
        if(idx !== -1) { 
            let shift = shifts[idx];
            shift.status = 'CLOSED'; shift.endTime = new Date().toISOString(); 
            let dist = 0; const R = 6371;
            if(shift.breadcrumbs && shift.breadcrumbs.length > 1) {
                for(let i=1; i<shift.breadcrumbs.length; i++) {
                    let p1 = shift.breadcrumbs[i-1], p2 = shift.breadcrumbs[i];
                    let dLat = (p2.lat - p1.lat) * Math.PI / 180; let dLon = (p2.lng - p1.lng) * Math.PI / 180;
                    let a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) * Math.sin(dLon/2)*Math.sin(dLon/2);
                    dist += R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
                }
            }
            shift.totalDistance = dist;
            this.saveShifts(shifts); 
        }
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
    toggleLayerList: () => { 
        const el = document.getElementById('layer-container'); 
        const chevron = document.getElementById('layer-chevron');
        if(el.style.display === 'block') { el.style.display = 'none'; if(chevron) chevron.innerText = '▶'; } 
        else { el.style.display = 'block'; if(chevron) chevron.innerText = '▼'; }
    },
    openOverlay: (id) => { document.querySelectorAll('.full-overlay').forEach(o => o.style.display = 'none'); document.getElementById(id + '-overlay').style.display = 'flex'; },
    closeOverlay: (id) => { document.getElementById(id + '-overlay').style.display = 'none'; },
    openPopup: (id) => document.getElementById(id).style.display = 'block', closePopup: (id) => document.getElementById(id).style.display = 'none',
    toggleFS: () => { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); },
    toggleSubRow: (rowId, iconId) => { const r = document.getElementById(rowId); const i = document.getElementById(iconId); if(!r) return; if(r.style.display === 'none' || r.style.display === '') { r.style.display = 'table-row'; i.innerText = '▼'; } else { r.style.display = 'none'; i.innerText = '▶'; } },
    downloadTextFile: function(filename, text) { let el = document.createElement('a'); el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text)); el.setAttribute('download', filename); el.style.display = 'none'; document.body.appendChild(el); el.click(); document.body.removeChild(el); },
    downloadWordDoc: function(filename, htmlContent) {
        const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
        const footer = "</body></html>";
        const sourceHTML = header + htmlContent + footer;
        const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
        let fileDownload = document.createElement("a");
        document.body.appendChild(fileDownload);
        fileDownload.href = source; fileDownload.download = filename; fileDownload.click();
        document.body.removeChild(fileDownload);
    },
    lockoutScreen: function(role, tenantStatus, tenantName) {
        if (role === 'agent') { document.body.innerHTML = `<div style="display:flex; height:100vh; width:100vw; background:#f4f6f8; align-items:center; justify-content:center; padding:20px; box-sizing:border-box;"><div style="background:#fff; padding:40px; border-radius:15px; box-shadow:0 10px 30px rgba(0,0,0,0.1); text-align:center; max-width:400px;"><div style="font-size:50px; margin-bottom:20px;">🛑</div><h2 style="color:#e74c3c; margin-top:0; text-transform:uppercase;">SERVICE UNAVAILABLE</h2><p style="color:#555; font-weight:bold;">Report to dispatch error code: <br><span style="color:#000; font-size:18px; display:inline-block; margin-top:10px; padding:5px 10px; background:#eee; border-radius:5px;">ERR-${tenantStatus}</span></p><button class="std-btn gray" style="margin-top:20px;" onclick="location.href='index.html'">Return to Login</button></div></div>`; }
        else if (role === 'dispatch') { document.body.innerHTML = `<div style="display:flex; height:100vh; width:100vw; background:#f4f6f8; align-items:center; justify-content:center; padding:20px; box-sizing:border-box;"><div style="background:#fff; padding:40px; border-radius:15px; box-shadow:0 10px 30px rgba(0,0,0,0.1); text-align:center; max-width:400px;"><div style="font-size:50px; margin-bottom:20px;">💳</div><h2 style="color:#e74c3c; margin-top:0; text-transform:uppercase;">ACCOUNT ${tenantStatus}</h2><p style="color:#555; font-weight:bold; line-height:1.5;">Please contact Accounts Payable to restore VanGuard dispatch services for ${tenantName}.</p><button class="std-btn gray" style="margin-top:20px;" onclick="location.href='index.html'">Return to Login</button></div></div>`; }
        else if (role === 'reporter') { document.body.innerHTML = `<div style="display:flex; height:100vh; width:100vw; background:#f4f6f8; align-items:center; justify-content:center; padding:20px; box-sizing:border-box;"><div style="background:#fff; padding:40px; border-radius:15px; box-shadow:0 10px 30px rgba(0,0,0,0.1); text-align:center; max-width:400px;"><div style="font-size:50px; margin-bottom:20px;">🛑</div><h2 style="color:#e74c3c; margin-top:0; text-transform:uppercase;">SERVICE UNAVAILABLE</h2><p style="color:#555; font-weight:bold;">Account locked. Code: <br><span style="color:#000; font-size:18px; display:inline-block; margin-top:10px; padding:5px 10px; background:#eee; border-radius:5px;">ERR-${tenantStatus}</span></p><button class="std-btn gray" style="margin-top:20px;" onclick="location.href='index.html'">Return to Login</button></div></div>`; }
    },
    processAndWatermarkImage: function(file, callback) {
        const reader = new FileReader(); reader.onload = function(e) {
            const img = new Image(); img.onload = function() {
                const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); 
                const MAX_DIM = 800; let width = img.width; let height = img.height;
                if(width > height) { if(width > MAX_DIM) { height *= MAX_DIM / width; width = MAX_DIM; } } else { if(height > MAX_DIM) { width *= MAX_DIM / height; height = MAX_DIM; } }
                canvas.width = width; canvas.height = height; ctx.drawImage(img, 0, 0, width, height);
                const latlng = typeof window._mapEngine !== 'undefined' && window._mapEngine.userMarker ? window._mapEngine.userMarker.getLatLng() : {lat: 0, lng: 0};
                const srnInput = document.getElementById('field-srn'); const srnVal = srnInput && srnInput.value ? srnInput.value : 'N/A';
                const dateStr = new Date().toLocaleString('en-NZ'); const watermarkText = `SRN: ${srnVal} | LAT: ${latlng.lat.toFixed(5)} LON: ${latlng.lng.toFixed(5)} | DATE: ${dateStr}`;
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; ctx.fillRect(0, height - 30, width, 30); ctx.font = 'bold 12px monospace'; ctx.fillStyle = '#ffea00'; ctx.fillText(watermarkText, 10, height - 10);
                callback(canvas.toDataURL('image/jpeg', 0.6));
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
            this.agentLiveTrails = {}; 
            
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
                marker.on('click', function(e) { self.handleAssetClick(e, feature.properties?.name || "Mapped Asset", item.label, feature.properties?.address || feature.properties?.description || "", false); }); return marker;
            }
        });

        const extractCenters = function(lGroup) {
            lGroup.eachLayer(function(layer) {
                if (layer instanceof L.LayerGroup || layer instanceof L.FeatureGroup) {
                    extractCenters(layer);
                } else if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
                    const name = layer.feature?.properties?.name || "Mapped Asset";
                    const desc = layer.feature?.properties?.address || layer.feature?.properties?.description || "";
                    layer.on('click', function(e) { self.handleAssetClick(e, name, item.label, desc, false); });
                    const centerMarker = L.marker(layer.getBounds().getCenter(), { 
                        icon: L.divIcon({ className: '', html: `<div class="marker-inner" style="background-color: ${item.color}; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.5); font-size: 18px;">${item.icon}</div>`, iconSize: [38, 38], iconAnchor: [19, 19] }) 
                    });
                    centerMarker.on('click', function(e) { self.handleAssetClick(e, name, item.label, desc, false); }); 
                    group.addLayer(centerMarker);
                }
            });
            self.map.addLayer(group);
        };
        
        let runLayer;
        if(isCustomStr) { 
            runLayer = omnivore.kml.parse(item.kmlString, null, customLayer); 
            extractCenters(runLayer); 
        } else { 
            runLayer = omnivore.kml(item.file, null, customLayer); 
            runLayer.on('ready', function() { extractCenters(runLayer); }); 
        }
        group.addLayer(runLayer);
    }
    toggleLayer(name, show) { if(show) this.map.addLayer(this.layers[name]); else this.map.removeLayer(this.layers[name]); }
    handleAssetClick(event, name, type, address, isOneOff) {
        L.DomEvent.stopPropagation(event); const safeName = name || "Unknown Site"; const safeAddr = address || "No address data";
        if(this.role === 'agent') { AgentCtrl.activeSite = { name: safeName, type: type }; document.getElementById('s-name').innerText = safeName; document.getElementById('s-type').innerText = type; document.getElementById('s-address').value = safeAddr; UI.openPopup('site-info'); } 
        else if (this.role === 'dispatch') { DispatchCtrl.activeSite = { name: safeName, type: type, address: safeAddr, isOneOff: isOneOff }; document.getElementById('s-name').innerText = safeName; document.getElementById('s-type').innerText = type; document.getElementById('s-address').value = safeAddr; UI.openPopup('site-info'); }
    }
    initGPS() {
        this.userMarker = L.marker([0,0], { icon: L.divIcon({ className: '', html: '<div id="agent-van-icon" class="van-inner" style="font-size: 40px; transform: rotate(90deg); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4)); transition: transform 0.3s ease;">🚐</div>', iconSize: [40,40], iconAnchor: [20,20] }) }).addTo(this.map);
        this.userMarker.on('click', () => AgentCtrl.openVanHUD());
        if(navigator.geolocation) { 
            navigator.geolocation.watchPosition(pos => { 
                const lat = pos.coords.latitude; const lng = pos.coords.longitude;
                this.userMarker.setLatLng([lat, lng]); 
                this.map.panTo([lat, lng]);
                if(pos.coords.heading !== null) {
                    const iconEl = document.getElementById('agent-van-icon');
                    if(iconEl) iconEl.style.transform = `rotate(${pos.coords.heading + 90}deg)`;
                }
            }, err => console.warn(err), { enableHighAccuracy: true }); 
        }
    }
    pollActiveAgents() {
        const shifts = CoreDB.getShifts().filter(s => s.tenantId === CoreDB.getActiveTenantId() && s.status === 'OPEN');
        shifts.forEach(shift => {
            if(shift.breadcrumbs && shift.breadcrumbs.length > 0) {
                const lastPing = shift.breadcrumbs[shift.breadcrumbs.length - 1];
                const ts = new Date(lastPing.ts).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                const popupContent = `<div style="text-align:center; padding:5px;"><h4 style="margin:0 0 5px 0; color:var(--b); font-size:14px; text-transform:uppercase;">${shift.username}</h4><div style="font-size:11px; color:#666; margin-bottom:10px;">Last Ping: ${ts}</div><button class="std-btn blue" style="padding:8px 15px; font-size:11px;" onclick="DispatchCtrl.openAgentTracker('${shift.userId}', '${shift.username}')">View Shift History</button></div>`;
                
                if(this.agentLiveMarkers[shift.userId]) { 
                    this.agentLiveMarkers[shift.userId].setLatLng([lastPing.lat, lastPing.lng]).getPopup().setContent(popupContent); 
                } else { 
                    const m = L.marker([lastPing.lat, lastPing.lng], { icon: L.divIcon({ className: '', html: `<div style="font-size: 30px; transform: rotate(90deg); filter: drop-shadow(0 2px 4px rgba(231, 76, 60, 0.8));">🚐</div>`, iconSize: [30,30], iconAnchor: [15,15] }) }).bindPopup(popupContent); 
                    this.agentLiveMarkers[shift.userId] = m; this.map.addLayer(m); 
                }

                const latlngs = shift.breadcrumbs.map(b => [b.lat, b.lng]);
                if(this.agentLiveTrails[shift.userId]) {
                    this.agentLiveTrails[shift.userId].setLatLngs(latlngs);
                } else {
                    this.agentLiveTrails[shift.userId] = L.polyline(latlngs, {color: '#e74c3c', weight: 4, opacity: 0.7, dashArray: '5, 10'}).addTo(this.map);
                }
            }
        });
    }
}

const AgentCtrl = {
    activeSite: { name: "", type: "" }, 
    workState: { startTime: null, accumulated: 0, photos: {}, currentEditJobId: null }, 
    timerInterval: null, wakeLock: null, breadcrumbInterval: null,
    
    init: function() {
        const activeId = CoreDB.getActiveTenantId(); const t = CoreDB.getTenants().find(x => x.id === activeId);
        if (t && t.status !== 'ACTIVE') { UI.lockoutScreen('agent', t.status, t.name); return; }
        if(document.getElementById('page-title')) document.getElementById('page-title').innerText = `${BRAND_NAME} | Agent`;
        new MapEngine('map', 'agent'); this.renderFields();
        setInterval(() => { const el = document.getElementById('menu-clock'); if(el) el.innerText = new Date().toLocaleString('en-NZ', { dateStyle: 'medium', timeStyle: 'short' }); }, 1000);

        const user = CoreDB.getActiveUser();
        const reqPunch = typeof user.requirePunchIn !== 'undefined' ? user.requirePunchIn : true;
        const openShift = CoreDB.getActiveShift();

        if(!reqPunch) {
            if(!openShift) { CoreDB.createShift(); }
            UI.closeOverlay('shift');
            this.startBreadcrumbs();
            const wlh = () => { this.requestWakeLock(); document.removeEventListener('click', wlh); };
            document.addEventListener('click', wlh);
            const loBtn = document.getElementById('agent-logout-btn');
            if(loBtn) loBtn.innerHTML = '🚪 Log Out';
        } else {
            if(openShift) { UI.closeOverlay('shift'); this.requestWakeLock(); this.startBreadcrumbs(); } 
            else { UI.openOverlay('shift'); }
        }
        
        this.renderSidebarBank();
    },
    renderSidebarBank: function() {
        const user = CoreDB.getActiveUser(); if(!user) return;
        const tenantId = CoreDB.getActiveTenantId();
        
        const pendingList = document.getElementById('sidebar-job-bank'); 
        if(pendingList) {
            let pJobs = CoreDB.getJobBank().filter(j => j.tenantId === tenantId && j.type === 'PENDING');
            if(CoreDB.getFlags().directAssignment) { pJobs = pJobs.filter(j => !j.assignedTo || j.assignedTo === 'UNASSIGNED' || j.assignedTo === user.id); }
            if (pJobs.length === 0) { pendingList.innerHTML = '<p style="text-align:center; color:#888; font-size:12px; font-style:italic;">No pending jobs in queue.</p>'; }
            else {
                pendingList.innerHTML = pJobs.map((j) => {
                    const isMine = j.assignedTo === user.id; const borderCol = isMine ? '#2ecc71' : '#f1c40f'; const badge = isMine ? `<span style="font-size:10px; background:#2ecc71; color:white; padding:2px 4px; border-radius:3px;">ASSIGNED</span>` : `<span style="font-size:10px; background:#f1c40f; color:black; padding:2px 4px; border-radius:3px;">OPEN POOL</span>`;
                    return `<div style="background:#f9f9f9; border-left:4px solid ${borderCol}; margin-bottom:10px; padding:10px; border-radius:0 5px 5px 0; cursor:pointer; transition: background 0.2s; box-shadow:0 1px 3px rgba(0,0,0,0.1);" onmouseover="this.style.background='#eee'" onmouseout="this.style.background='#f9f9f9'" onclick="AgentCtrl.handleJobClick('${j.jobId}')"><div style="display:flex; justify-content:space-between; margin-bottom:4px;"><strong style="font-size:12px; color:var(--b);">${j.site}</strong></div><div style="display:flex; justify-content:space-between; align-items:center;"><div style="font-size:11px; color:#666;">SRN: ${j.srn}</div>${badge}</div></div>`;
                }).join('');
            }
        }

        const rejectedList = document.getElementById('sidebar-rejected-bank');
        if(rejectedList) {
            let rJobs = CoreDB.getJobBank().filter(j => j.tenantId === tenantId && j.assignedTo === user.id && j.reviewStatus === 'REJECTED');
            if(rJobs.length === 0) {
                document.getElementById('sidebar-rejected-container').style.display = 'none';
            } else {
                document.getElementById('sidebar-rejected-container').style.display = 'block';
                rejectedList.innerHTML = rJobs.map(j => {
                    return `<div style="background:#fdedec; border-left:4px solid #e74c3c; margin-bottom:10px; padding:10px; border-radius:0 5px 5px 0; cursor:pointer; box-shadow:0 1px 3px rgba(0,0,0,0.1);" onclick="AgentCtrl.openEditJob('${j.jobId}')">
                        <strong style="font-size:12px; color:#e74c3c;">${j.site}</strong><br>
                        <span style="font-size:11px; font-weight:bold;">⚠️ Needs Correction</span>
                        <div style="font-size:11px; color:#c0392b; margin-top:5px; border-top:1px dashed #e74c3c; padding-top:5px;"><i>"${j.rejectReason}"</i></div>
                    </div>`;
                }).join('');
            }
        }
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
    routeTo: function(address) { window.open(`https://www.google.com/maps/dir/?api=1&destination=1${encodeURIComponent(address)}`, '_blank'); },
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
        const shift = CoreDB.getActiveShift(); if(!shift) return; 
        const jobs = CoreDB.getTenantJobs().filter(j => j.shiftId === shift.shiftId && j.type === 'COMPLETED'); 
        const listEl = document.getElementById('agent-history-list');
        if(window._mapEngine && window._mapEngine.userMarker) window._mapEngine.userMarker.closePopup();
        if(jobs.length === 0) { listEl.innerHTML = `<p style="color:#666; font-size:13px;">No jobs completed on this shift yet.</p>`; } else { 
            listEl.innerHTML = jobs.map(j => {
                const canEdit = j.reviewStatus !== 'APPROVED';
                return `<div style="background:#f4f6f8; border:1px solid #ddd; padding:10px; border-radius:5px; margin-bottom:10px; font-size:12px; position:relative;">
                    <strong style="color:var(--b);">${j.site}</strong><br>
                    <span style="color:#888;">Time: ${j.pausedAt} | SRN: ${j.srn}</span>
                    ${j.notes ? `<div style="margin-top:5px; font-style:italic; border-top:1px dashed #ccc; padding-top:5px;">${j.notes}</div>` : ''}
                    ${canEdit ? `<button class="std-btn blue" style="position:absolute; top:10px; right:10px; width:auto; padding:5px 10px; font-size:11px;" onclick="AgentCtrl.openEditJob('${j.jobId}')">Edit</button>` : `<span style="position:absolute; top:10px; right:10px; font-size:10px; color:#2ecc71; font-weight:bold;">🔒 APPROVED</span>`}
                </div>`
            }).join(''); 
        }
        UI.openOverlay('agent-history');
    },
    openEditJob: function(jobId) {
        UI.closeLeftSidebar();
        UI.closeOverlay('agent-history');
        const job = CoreDB.getJob(jobId);
        if(!job) return;

        this.activeSite = { name: job.site, type: "Edit Job" };
        this.workState.currentEditJobId = jobId;
        this.workState.photos = JSON.parse(JSON.stringify(job.photos || {}));
        
        document.querySelectorAll('.target-site-name').forEach(el => el.innerText = this.activeSite.name); 

        document.querySelectorAll('.photo-box').forEach(btn => {
            const step = btn.id.replace('btn-', '');
            if(this.workState.photos[step]) {
                btn.classList.add('done');
                btn.style.backgroundImage = `url(${this.workState.photos[step]})`;
                btn.innerHTML = `<div style="background:rgba(0,0,0,0.7); display:inline-block; padding:5px 10px; border-radius:5px; color:#fff;">✓ ${step.toUpperCase()}</div>`;
            } else {
                btn.classList.remove('done');
                btn.style.backgroundImage = 'none';
                btn.innerHTML = `📸 ${step.toUpperCase()}`;
            }
        });

        CoreDB.getSchema().forEach(f => {
            if(f.tenantVisible) {
                const el = document.getElementById('field-' + f.id);
                if(el && job.data) el.value = job.data[f.id] || '';
            }
        });

        document.getElementById('submit-work-btn').disabled = false;
        document.getElementById('submit-work-btn').innerText = "Save Edit";
        
        const reasonBox = document.getElementById('edit-reason-container');
        if(reasonBox) {
            reasonBox.style.display = 'block';
            document.getElementById('edit-reason-input').value = '';
        }

        UI.openOverlay('work');
    },

    startShift: function() { 
        CoreDB.createShift(); UI.closeOverlay('shift'); this.requestWakeLock(); 
        if(window._mapEngine && window._mapEngine.userMarker) { const pos = window._mapEngine.userMarker.getLatLng(); if(pos.lat !== 0 && pos.lng !== 0) CoreDB.addBreadcrumb(pos.lat, pos.lng); }
        this.startBreadcrumbs(); 
    },
    endShift: function() { 
        const user = CoreDB.getActiveUser();
        const req = typeof user.requirePunchIn !== 'undefined' ? user.requirePunchIn : true;
        const msg = req ? "Are you sure you want to end your patrol shift and log out?" : "Are you sure you want to log out?";
        if(confirm(msg)) { 
            CoreDB.closeShift(); this.releaseWakeLock(); this.stopBreadcrumbs(); window.location.href = 'index.html'; 
        } 
    },
    async requestWakeLock() { if ('wakeLock' in navigator) { try { this.wakeLock = await navigator.wakeLock.request('screen'); console.log('Wake Lock active.'); } catch (err) { console.warn('Wake Lock failed:', err); } } },
    releaseWakeLock() { if (this.wakeLock !== null) { this.wakeLock.release(); this.wakeLock = null; console.log('Wake Lock released.'); } },
    startBreadcrumbs() { this.breadcrumbInterval = setInterval(() => { if(window._mapEngine && window._mapEngine.userMarker) { const pos = window._mapEngine.userMarker.getLatLng(); if(pos.lat !== 0 && pos.lng !== 0) { CoreDB.addBreadcrumb(pos.lat, pos.lng); } } }, 30000); },
    stopBreadcrumbs() { clearInterval(this.breadcrumbInterval); },
    renderFields: function() {
        const containers = document.querySelectorAll('.dynamic-fields-render'); 
        let html = '';
        const schema = CoreDB.getSchema();
        const groups = {};
        schema.forEach(f => {
            if(f.tenantVisible) {
                const cat = f.category || 'General Info';
                if(!groups[cat]) groups[cat] = [];
                groups[cat].push(f);
            }
        });
        for(const [cat, fields] of Object.entries(groups)) {
            html += `<div style="margin-top:20px; margin-bottom:10px; font-size:12px; font-weight:900; color:var(--b); text-transform:uppercase; border-bottom:1px solid #ccc; padding-bottom:4px;">${cat}</div>`;
            fields.forEach(f => {
                if(f.type === 'select') { 
                    html += `<select id="field-${f.id}" class="std-input data-field"><option value="">${f.label}...</option>`; 
                    f.options.forEach(opt => { if(opt.visible) html += `<option value="${opt.name}">${opt.name}</option>`; }); 
                    html += `</select>`; 
                } else { 
                    let pType = f.type === 'number' ? 'number' : 'text'; 
                    html += `<input type="${pType}" id="field-${f.id}" class="std-input data-field" placeholder="${f.label} ${f.tenantMandatory?'':'(Optional)'}">`; 
                }
            });
        }
        containers.forEach(c => c.innerHTML = html);
    },
    toggleWetDayForm: function(checkbox) { document.getElementById('wet-day-fields').style.display = checkbox.checked ? 'block' : 'none'; },
    openOverlay: function(type) { 
        UI.closePopup('site-info'); 
        this.workState.currentEditJobId = null; // ensure not editing
        document.querySelectorAll('.target-site-name').forEach(el => el.innerText = this.activeSite.name); 
        this.workState.photos = {}; 
        document.querySelectorAll('.photo-box').forEach(btn => {
            btn.classList.remove('done');
            btn.style.backgroundImage = 'none';
            btn.innerHTML = `📸 ${btn.id.replace('btn-','').toUpperCase()}`;
        });
        document.querySelectorAll('.data-field').forEach(el => el.value = '');
        
        const reasonBox = document.getElementById('edit-reason-container');
        if(reasonBox) reasonBox.style.display = 'none';
        
        const submitBtn = document.getElementById('submit-work-btn');
        if(submitBtn) submitBtn.innerText = 'Submit';
        
        UI.openOverlay(type); 
    },
    handlePhoto: function(step) {
        const input = document.getElementById('photo-' + step); const btn = document.getElementById('btn-' + step); if(!input || !input.files || !input.files[0]) return; btn.innerHTML = `<div style="padding:10px;">⏳ Processing...</div>`; const now = new Date();
        UI.processAndWatermarkImage(input.files[0], (dataUrl) => {
            btn.classList.add('done'); btn.style.backgroundImage = `url(${dataUrl})`; btn.innerHTML = `<div style="background:rgba(0,0,0,0.7); display:inline-block; padding:5px 10px; border-radius:5px; color:#fff;">✓ ${step.toUpperCase()}</div>`;
            this.workState.photos[step] = dataUrl;

            if(step === 'before' || step === 'start') { this.workState.startTime = now; this.startTimer(); if(document.getElementById('pause-work-btn')) document.getElementById('pause-work-btn').disabled = false; if(document.getElementById('pause-insp-btn')) document.getElementById('pause-insp-btn').disabled = false; } 
            else if(step === 'after' || step === 'end') { if(document.getElementById('submit-work-btn')) document.getElementById('submit-work-btn').disabled = false; if(document.getElementById('submit-insp-btn')) document.getElementById('submit-insp-btn').disabled = false; }
            if(step.startsWith('rep-')) { btn.innerHTML = `<div style="background:rgba(0,0,0,0.7); display:inline-block; padding:5px 10px; border-radius:5px; color:#fff;">✓ DONE</div>`; }
        });
    },
    startTimer: function() { const widget = document.getElementById('live-timer-widget'); widget.style.display = 'block'; this.timerInterval = setInterval(() => { const secs = Math.floor((new Date() - this.workState.startTime + this.workState.accumulated) / 1000); widget.innerText = `${Math.floor(secs / 60).toString().padStart(2,'0')}:${(secs % 60).toString().padStart(2,'0')}`; }, 1000); },
    stopTimer: function() { clearInterval(this.timerInterval); document.getElementById('live-timer-widget').style.display = 'none'; },
    cancelJob: function() { if(!confirm("Cancel this job?")) return; this.stopTimer(); this.workState = { startTime: null, accumulated: 0, photos: {}, currentEditJobId: null }; UI.closeOverlay('work'); },
    pauseJob: function() { 
        const elapsed = new Date() - this.workState.startTime; 
        CoreDB.pushJob({ site: this.activeSite.name, type: 'WORK', accumulated: this.workState.accumulated + elapsed, pausedAt: new Date().toLocaleString('en-NZ'), timestamp: Date.now() }); 
        this.stopTimer(); UI.closeOverlay('work'); this.renderSidebarBank(); 
    },
    submitWork: function() { 
        let failed = false; 
        let payloadData = {};
        const srn = document.getElementById('field-srn') ? document.getElementById('field-srn').value : 'N/A';

        CoreDB.getSchema().forEach(f => { 
            if(f.tenantVisible) { 
                const el = document.querySelectorAll(`#work-overlay #field-${f.id}`)[0]; 
                if(el) {
                    if(f.tenantMandatory && !el.value) failed = true; 
                    payloadData[f.id] = el.value;
                }
            } 
        }); 

        if(failed) { alert("Please complete required fields."); return; } 
        
        if(this.workState.currentEditJobId) {
            const reasonEl = document.getElementById('edit-reason-input');
            const reason = reasonEl ? reasonEl.value.trim() : '';
            if(!reason) { alert("You must provide a Reason for Edit for the audit log."); return; }
            
            CoreDB.updateJob(this.workState.currentEditJobId, { data: payloadData, photos: JSON.parse(JSON.stringify(this.workState.photos)) }, reason);
            alert("Edit Saved and Logged.");
        } else {
            CoreDB.pushJob({ 
                site: this.activeSite.name, 
                srn: srn,
                type: 'COMPLETED', 
                accumulated: this.workState.accumulated + (new Date() - this.workState.startTime), 
                pausedAt: new Date().toLocaleString('en-NZ'), 
                timestamp: Date.now(),
                assignedTo: CoreDB.getActiveUser().id,
                photos: JSON.parse(JSON.stringify(this.workState.photos)),
                data: payloadData
            });
            alert("Work Submitted."); 
        }

        this.stopTimer(); UI.closeOverlay('work'); this.renderSidebarBank(); 
    },
    cancelInsp: function() { this.stopTimer(); UI.closeOverlay('inspection'); },
    pauseInsp: function() { this.stopTimer(); UI.closeOverlay('inspection'); },
    submitInsp: function() {
        const flagFuture = document.getElementById('insp-flag-future').checked;
        let payloadData = {};
        
        CoreDB.getSchema().forEach(f => { 
            if(f.tenantVisible) { 
                const el = document.querySelectorAll(`#inspection-overlay #field-${f.id}`)[0]; 
                if(el) payloadData[f.id] = el.value;
            } 
        });
        
        const srn = document.getElementById('insp-srn-input').value || 'N/A';

        if(flagFuture) {
            CoreDB.pushJob({ 
                site: this.activeSite.name, 
                srn: srn, 
                type: 'PENDING', 
                notes: "[WET DAY FLAG]", 
                assignedTo: 'UNASSIGNED', 
                accumulated: 0, 
                pausedAt: new Date().toLocaleString('en-NZ'),
                timestamp: Date.now(),
                photos: JSON.parse(JSON.stringify(this.workState.photos)),
                data: payloadData
            });
            alert("Inspection Logged & Site added to Open Pool for future work.");
        } else { 
            CoreDB.pushJob({ 
                site: this.activeSite.name, 
                srn: srn, 
                type: 'COMPLETED', 
                accumulated: new Date() - this.workState.startTime, 
                pausedAt: new Date().toLocaleString('en-NZ'),
                timestamp: Date.now(),
                assignedTo: CoreDB.getActiveUser().id,
                photos: JSON.parse(JSON.stringify(this.workState.photos)),
                data: payloadData
            });
            alert("Inspection Logged."); 
        }
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
        CoreDB.pushJob({ site: this.activeSite.name, srn: srn || 'N/A', type: 'PENDING', notes: finalNotes, assignedTo: assignedTo, accumulated: 0, pausedAt: new Date().toLocaleString('en-NZ'), timestamp: Date.now() }); 
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
        if(shiftOnDate) { const st = new Date(shiftOnDate.startTime).toLocaleTimeString(); const et = shiftOnDate.endTime ? new Date(shiftOnDate.endTime).toLocaleTimeString() : 'Active/Open'; const dist = shiftOnDate.totalDistance ? `${shiftOnDate.totalDistance.toFixed(2)} km` : (shiftOnDate.status === 'OPEN' ? 'Tracking live...' : '0 km'); html += `<div style="background:#e3f2fd; border-left:4px solid var(--b); padding:15px; border-radius:8px; margin-bottom:15px;"><h4 style="margin:0 0 5px 0;">Shift Data: ${targetDateStr}</h4><div style="font-size:13px; color:#555;">Start: <strong>${st}</strong> | End: <strong>${et}</strong></div><div style="font-size:13px; color:#555;">Distance: <strong>${dist}</strong></div><div style="font-size:13px; color:#555;">Status: <strong>${shiftOnDate.status}</strong></div></div>`; } else { html += `<p style="color:#888; font-size:13px; text-align:center; padding:10px;">No shift punched for this date.</p>`; }
        const userJobs = jobs.filter(j => j.assignedTo === userId && j.pausedAt.includes(targetDateStr));
        if(userJobs.length > 0) { html += `<h4 style="border-bottom:1px solid #ccc; padding-bottom:5px;">Completed Jobs</h4>`; html += userJobs.map(j => `<div style="padding:10px; background:#fff; border:1px solid #eee; margin-bottom:5px; border-radius:5px; font-size:12px;"><strong>${j.site}</strong><br><span style="color:#888;">${j.pausedAt}</span></div>`).join(''); } else { html += `<p style="color:#888; font-size:13px; text-align:center; padding:10px;">No assigned jobs completed on this date.</p>`; }
        resultsEl.innerHTML = html;
    }
};

const ReporterCtrl = {
    replayMap: null, replayLayerGroup: null, replayMarkers: {}, currentReplayWorker: null, filteredJobsForPreview: [], currentTemplateId: null,
    
    init: function() { 
        const activeId = CoreDB.getActiveTenantId(); const t = CoreDB.getTenants().find(x => x.id === activeId); 
        if (t && t.status !== 'ACTIVE') { UI.lockoutScreen('reporter', t.status, t.name); return; } 
        if(t) {
            const logoEl = document.getElementById('rep-tenant-logo'); if(logoEl) logoEl.innerHTML = t.logo ? `<img src="${t.logo}" style="max-height:80px; max-width:200px;">` : '⚓';
            const nameEl = document.getElementById('rep-tenant-name'); if(nameEl) nameEl.innerText = t.name;

            const menuLogoEl = document.getElementById('menu-tenant-logo'); if(menuLogoEl) menuLogoEl.innerHTML = t.logo ? `<img src="${t.logo}" style="max-height:40px; max-width:40px; border-radius:50%;">` : '⚓';
            const menuNameEl = document.getElementById('menu-tenant-name'); if(menuNameEl) menuNameEl.innerText = t.name;
        }
        setTimeout(() => { const splash = document.getElementById('rep-splash'); const menu = document.getElementById('rep-menu'); if(splash && menu) { splash.style.display = 'none'; menu.style.display = 'block'; } }, 3000);
        
        this.renderReports(); 
        this.renderCreateForm();
        this.renderTemplates();
    },
    switchView: function(viewId) { document.querySelectorAll('.rep-view').forEach(el => el.style.display = 'none'); const view = document.getElementById('rep-' + viewId); if(view) view.style.display = 'block'; },
    
    renderCreateForm: function() {
        const agents = CoreDB.getUsers().filter(u => u.role === 'agent' && u.tenantId === CoreDB.getActiveTenantId());
        const wList = document.getElementById('report-worker-list');
        if(wList) {
            let wHtml = `<label style="display:flex; align-items:center; font-size:13px; font-weight:bold; margin-bottom:10px;"><input type="checkbox" id="rep-cb-all-workers" checked onchange="ReporterCtrl.toggleAllWorkers(this.checked)" style="margin-right:10px; width:16px; height:16px;"> Select All Workers</label>`;
            agents.forEach(a => { wHtml += `<label style="display:flex; align-items:center; font-size:13px; margin-bottom:5px; color:#555;"><input type="checkbox" value="${a.id}" class="rep-worker-cb" checked style="margin-right:10px;"> ${a.name || a.username}</label>`; });
            wList.innerHTML = wHtml;
        }
        const mList = document.getElementById('report-metric-toggles');
        if(mList) {
            let mHtml = ''; const schema = CoreDB.getSchema();
            schema.forEach(f => { if(f.tenantVisible) { mHtml += `<label style="display:flex; align-items:center; font-size:12px; margin-bottom:5px;"><input type="checkbox" value="${f.id}" class="rep-metric-cb" checked style="margin-right:8px;"> ${f.label}</label>`; } });
            mList.innerHTML = mHtml;
        }
    },
    toggleAllWorkers: function(checked) { document.querySelectorAll('.rep-worker-cb').forEach(cb => cb.checked = checked); },
    
    generatePreview: function() {
        const fromDateStr = document.getElementById('rep-date-from').value;
        const toDateStr = document.getElementById('rep-date-to').value;
        const incPending = document.getElementById('rep-inc-pending').checked;
        const filterLoc = document.getElementById('rep-filter-loc').value.toLowerCase().trim();
        const filterTag = document.getElementById('rep-filter-tag').value.toLowerCase().trim();

        if(!fromDateStr || !toDateStr) { alert("Please select a date range."); return; }
        
        const fromTime = new Date(fromDateStr).setHours(0,0,0,0);
        const toTime = new Date(toDateStr).setHours(23,59,59,999);

        const selectedWorkers = Array.from(document.querySelectorAll('.rep-worker-cb:checked')).map(cb => cb.value);
        if(selectedWorkers.length === 0) { alert("Select at least one worker."); return; }

        const selectedMetrics = Array.from(document.querySelectorAll('.rep-metric-cb:checked')).map(cb => cb.value);

        let jobs = CoreDB.getTenantJobs().filter(j => {
            if(!j.timestamp) return false; 
            if(j.timestamp < fromTime || j.timestamp > toTime) return false;
            if(!selectedWorkers.includes(j.assignedTo)) return false;
            if(!incPending && j.type === 'PENDING') return false;
            if(filterLoc && !j.site.toLowerCase().includes(filterLoc)) return false;
            if(filterTag && j.data && j.data.tag_content && !j.data.tag_content.toLowerCase().includes(filterTag) && j.data.graffiti_tag_interpretation && !j.data.graffiti_tag_interpretation.toLowerCase().includes(filterTag)) {
                if(!j.notes || !j.notes.toLowerCase().includes(filterTag)) return false;
            }
            return true;
        });

        this.filteredJobsForPreview = jobs;
        
        const previewList = document.getElementById('report-preview-list');
        if(jobs.length === 0) {
            previewList.innerHTML = `<p style="text-align:center; padding:30px; color:#888;">No jobs found matching these criteria.</p>`;
        } else {
            const schema = CoreDB.getSchema();
            const users = CoreDB.getUsers();
            
            let html = '';
            jobs.forEach(j => {
                const user = users.find(u => u.id === j.assignedTo);
                const workerName = user ? (user.name || user.username) : 'Unknown';
                
                const isEdited = j.auditLog && j.auditLog.length > 0;
                
                html += `<div style="background:#fff; border:1px solid #ddd; border-radius:8px; margin-bottom:20px; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.05); page-break-inside: avoid;">`;
                
                html += `<div style="background:var(--nav-dark); color:white; padding:15px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <h3 style="margin:0;">${j.site}</h3>
                        <div style="font-size:11px; opacity:0.8;">SRN: ${j.srn || 'N/A'} | Worker: ${workerName} ${isEdited ? '<span style="background:#e67e22; color:white; padding:2px 5px; border-radius:3px; margin-left:5px; font-weight:bold;">⚠️ EDITED</span>' : ''}</div>
                    </div>
                    <span class="badge" style="background:${j.type==='COMPLETED'?'#2ecc71':'#3498db'};">${j.type}</span>
                </div>`;

                if(j.photos && Object.keys(j.photos).length > 0) {
                    html += `<div style="display:flex; gap:10px; padding:15px; background:#f9f9f9; border-bottom:1px solid #eee; overflow-x:auto;">`;
                    for(const [step, url] of Object.entries(j.photos)) {
                        html += `<div style="flex: 0 0 auto; text-align:center;">
                            <img src="${url}" style="height:150px; border-radius:5px; border:1px solid #ccc;">
                            <div style="font-size:10px; color:#666; margin-top:5px; text-transform:uppercase; font-weight:bold;">${step}</div>
                        </div>`;
                    }
                    html += `</div>`;
                }

                html += `<div style="padding:15px; display:grid; grid-template-columns:1fr 1fr; gap:10px;">`;
                html += `<div style="font-size:12px; border-bottom:1px solid #eee; padding-bottom:5px;"><strong style="color:var(--b);">Date Completed:</strong><br>${j.pausedAt}</div>`;
                if(j.notes) html += `<div style="font-size:12px; border-bottom:1px solid #eee; padding-bottom:5px;"><strong style="color:var(--b);">Agent Notes:</strong><br><i>${j.notes}</i></div>`;

                if(j.data) {
                    selectedMetrics.forEach(mId => {
                        const val = j.data[mId];
                        if(val) {
                            const fieldDef = schema.find(f => f.id === mId);
                            const label = fieldDef ? fieldDef.label : mId;
                            html += `<div style="font-size:12px; border-bottom:1px solid #eee; padding-bottom:5px;"><strong style="color:var(--b);">${label}:</strong><br>${val}</div>`;
                        }
                    });
                }
                html += `</div>`;

                const isApp = j.reviewStatus === 'APPROVED';
                const isRej = j.reviewStatus === 'REJECTED';
                html += `<div style="padding:15px; background:#e3f2fd; border-top:1px dashed #ccc; display:flex; align-items:center; gap:20px;">
                    <strong style="font-size:13px; color:var(--b);">Billing Review:</strong>
                    <label style="font-size:13px; cursor:pointer;"><input type="radio" name="rev_${j.jobId}" value="APPROVED" ${isApp?'checked':''} onchange="ReporterCtrl.setJobReview('${j.jobId}', 'APPROVED')"> Approve</label>
                    <label style="font-size:13px; cursor:pointer; color:#e74c3c;"><input type="radio" name="rev_${j.jobId}" value="REJECTED" ${isRej?'checked':''} onchange="ReporterCtrl.setJobReview('${j.jobId}', 'REJECTED')"> Reject</label>
                    
                    ${isEdited ? `<button class="std-btn yellow" style="width:auto; padding:5px 10px; font-size:11px; margin:0;" onclick="ReporterCtrl.viewAudit('${j.jobId}')">🔍 View Audit Trail</button>` : ''}
                    
                    <textarea id="rej_reason_${j.jobId}" class="std-input" placeholder="Reason for rejection..." style="display:${isRej?'block':'none'}; margin:0; height:30px; padding:5px; flex-grow:1;" onchange="ReporterCtrl.setRejectReason('${j.jobId}', this.value)">${j.rejectReason||''}</textarea>
                </div>`;

                html += `</div>`;
            });
            previewList.innerHTML = html;
        }

        UI.openOverlay('report-preview');
    },

    viewAudit: function(jobId) {
        const job = CoreDB.getJob(jobId);
        if(!job || !job.auditLog) return;
        
        let html = `<h3 style="margin-top:0; color:var(--b);">Audit Trail: ${job.site}</h3>`;
        html += `<p style="font-size:12px; color:#666;">Showing history of edits appended by field agents.</p>`;
        
        job.auditLog.forEach((log, index) => {
            html += `<div style="background:#fff; border:1px solid #e67e22; border-left:4px solid #e67e22; margin-bottom:15px; padding:15px; border-radius:5px;">
                <div style="font-size:11px; color:#888; margin-bottom:5px;">Edit ${index+1} | Timestamp: ${log.dateStr}</div>
                <div style="font-size:13px; font-weight:bold; color:#e67e22; margin-bottom:10px;">Reason: "${log.reason}"</div>
                
                <strong style="font-size:12px; color:var(--b); border-bottom:1px solid #ddd; display:block; padding-bottom:5px; margin-bottom:5px;">Previous Data State:</strong>
                <div style="font-size:11px; color:#555; background:#f9f9f9; padding:10px; border-radius:5px;">`;
                
            if(log.previousState.data) {
                const schema = CoreDB.getSchema();
                for(const [key, val] of Object.entries(log.previousState.data)) {
                    if(val) {
                        const f = schema.find(x => x.id === key);
                        html += `<div><strong>${f ? f.label : key}:</strong> ${val}</div>`;
                    }
                }
            } else { html += `No metrics logged in this state.`; }
            
            html += `</div></div>`;
        });
        
        document.getElementById('audit-trail-content').innerHTML = html;
        UI.openOverlay('report-audit');
    },

    setJobReview: function(jobId, status) {
        let bank = CoreDB.getJobBank();
        const idx = bank.findIndex(j => j.jobId === jobId);
        if(idx !== -1) {
            bank[idx].reviewStatus = status;
            if(status === 'APPROVED') bank[idx].rejectReason = '';
            CoreDB.saveJobBank(bank);
            const localIdx = this.filteredJobsForPreview.findIndex(j => j.jobId === jobId);
            if(localIdx !== -1) this.filteredJobsForPreview[localIdx].reviewStatus = status;
            const rejBox = document.getElementById(`rej_reason_${jobId}`);
            if(rejBox) rejBox.style.display = status === 'REJECTED' ? 'block' : 'none';
        }
    },
    setRejectReason: function(jobId, reason) {
        let bank = CoreDB.getJobBank();
        const idx = bank.findIndex(j => j.jobId === jobId);
        if(idx !== -1) { bank[idx].rejectReason = reason; CoreDB.saveJobBank(bank); }
    },

    saveTemplate: function() {
        const name = prompt("Enter a name to save these report settings (e.g., 'Monthly Elsdon Billing'):");
        if(!name) return;

        const template = {
            id: 'TPL-' + Date.now(),
            name: name,
            tenantId: CoreDB.getActiveTenantId(),
            fromDate: document.getElementById('rep-date-from').value,
            toDate: document.getElementById('rep-date-to').value,
            workers: Array.from(document.querySelectorAll('.rep-worker-cb:checked')).map(cb => cb.value),
            metrics: Array.from(document.querySelectorAll('.rep-metric-cb:checked')).map(cb => cb.value),
            incPending: document.getElementById('rep-inc-pending').checked,
            filterLoc: document.getElementById('rep-filter-loc').value,
            filterTag: document.getElementById('rep-filter-tag').value
        };

        let tpls = CoreDB.getReportTemplates();
        tpls.push(template); CoreDB.saveReportTemplates(tpls); alert("Template Saved!"); this.renderTemplates();
    },
    renderTemplates: function() {
        const list = document.getElementById('report-template-list'); if(!list) return;
        const tpls = CoreDB.getReportTemplates().filter(t => t.tenantId === CoreDB.getActiveTenantId());
        if(tpls.length === 0) { list.innerHTML = '<p style="color:#888; text-align:center; padding:20px;">No saved templates.</p>'; return; }
        list.innerHTML = tpls.map(t => {
            return `<div style="background:#fff; border-bottom:1px solid #eee; padding:15px; display:flex; justify-content:space-between; align-items:center;">
                <div><strong style="color:var(--b); font-size:15px;">${t.name}</strong></div>
                <button class="std-btn blue" style="width:auto; padding:8px 15px; font-size:12px;" onclick="ReporterCtrl.loadTemplate('${t.id}')">Load Settings</button>
            </div>`;
        }).join('');
    },
    loadTemplate: function(id) {
        const tpls = CoreDB.getReportTemplates(); const t = tpls.find(x => x.id === id);
        if(t) {
            this.switchView('create');
            document.getElementById('rep-date-from').value = t.fromDate;
            document.getElementById('rep-date-to').value = t.toDate;
            document.getElementById('rep-inc-pending').checked = t.incPending;
            document.getElementById('rep-filter-loc').value = t.filterLoc || '';
            document.getElementById('rep-filter-tag').value = t.filterTag || '';

            document.querySelectorAll('.rep-worker-cb').forEach(cb => { cb.checked = t.workers.includes(cb.value); });
            document.querySelectorAll('.rep-metric-cb').forEach(cb => { cb.checked = t.metrics.includes(cb.value); });
            
            const allW = document.querySelectorAll('.rep-worker-cb'); const checkedW = document.querySelectorAll('.rep-worker-cb:checked');
            document.getElementById('rep-cb-all-workers').checked = (allW.length === checkedW.length && allW.length > 0);
        }
    },

    exportCSV: function(statusFilter) {
        const jobs = this.filteredJobsForPreview.filter(j => statusFilter === 'ALL' || j.reviewStatus === statusFilter);
        if(jobs.length === 0) { alert("No jobs to export."); return; }

        const selectedMetrics = Array.from(document.querySelectorAll('.rep-metric-cb:checked')).map(cb => cb.value);
        const schema = CoreDB.getSchema(); const users = CoreDB.getUsers();

        let headers = ['SRN', 'Date', 'Agent', 'Site', 'Status', 'Review Status'];
        selectedMetrics.forEach(mId => { const f = schema.find(x => x.id === mId); headers.push(f ? f.label : mId); });
        if(statusFilter === 'REJECTED') headers.push('Reject Reason');

        let csv = headers.join(',') + '\n';
        
        jobs.forEach(j => {
            const user = users.find(u => u.id === j.assignedTo); const wName = user ? (user.name || user.username) : 'Unknown';
            let row = [ `"${j.srn || 'N/A'}"`, `"${j.pausedAt}"`, `"${wName}"`, `"${j.site}"`, `"${j.type}"`, `"${j.reviewStatus || 'UNREVIEWED'}"` ];
            selectedMetrics.forEach(mId => { let val = j.data ? j.data[mId] || '' : ''; row.push(`"${val}"`); });
            if(statusFilter === 'REJECTED') row.push(`"${j.rejectReason || ''}"`);
            csv += row.join(',') + '\n';
        });

        UI.downloadTextFile(`VanGuard_${statusFilter}_Metrics_${Date.now()}.csv`, csv);
    },
    exportWord: function() {
        const jobs = this.filteredJobsForPreview.filter(j => j.reviewStatus === 'APPROVED');
        if(jobs.length === 0) { alert("No Approved jobs to export to Word."); return; }

        const selectedMetrics = Array.from(document.querySelectorAll('.rep-metric-cb:checked')).map(cb => cb.value);
        const schema = CoreDB.getSchema(); const users = CoreDB.getUsers();

        let html = `
            <style>
                body { font-family: Arial, sans-serif; }
                .job-block { border: 1px solid #000; margin-bottom: 20px; padding: 10px; page-break-inside: avoid; }
                .header { background-color: #34495e; color: #fff; padding: 5px; font-weight: bold; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                td { padding: 5px; border-bottom: 1px solid #ccc; font-size: 12px; }
                img { max-height: 200px; max-width: 300px; margin: 5px; border: 1px solid #000; }
            </style>
            <h1>VanGuard Approved Work Report</h1>
            <p>Generated: ${new Date().toLocaleString()}</p>
        `;

        jobs.forEach(j => {
            const user = users.find(u => u.id === j.assignedTo); const wName = user ? (user.name || user.username) : 'Unknown';
            html += `<div class="job-block"><div class="header">Site: ${j.site} | SRN: ${j.srn || 'N/A'}</div><table><tr><td><strong>Agent:</strong></td><td>${wName}</td><td><strong>Date:</strong></td><td>${j.pausedAt}</td></tr>`;
            if(j.data) {
                for(let i=0; i<selectedMetrics.length; i+=2) {
                    const m1 = selectedMetrics[i]; const f1 = schema.find(x => x.id === m1); const v1 = j.data[m1] || '';
                    let m2 = null, f2 = null, v2 = '';
                    if(i+1 < selectedMetrics.length) { m2 = selectedMetrics[i+1]; f2 = schema.find(x => x.id === m2); v2 = j.data[m2] || ''; }
                    html += `<tr><td><strong>${f1?f1.label:m1}:</strong></td><td>${v1}</td>${m2 ? `<td><strong>${f2?f2.label:m2}:</strong></td><td>${v2}</td>` : `<td></td><td></td>`}</tr>`;
                }
            }
            if(j.notes) html += `<tr><td colspan="4"><strong>Notes:</strong> ${j.notes}</td></tr>`;
            html += `</table>`;
            if(j.photos && Object.keys(j.photos).length > 0) {
                html += `<div style="margin-top:10px;">`;
                for(const [step, url] of Object.entries(j.photos)) { html += `<span><strong>${step.toUpperCase()}</strong><br><img src="${url}"></span>`; }
                html += `</div>`;
            }
            html += `</div>`;
        });
        UI.downloadWordDoc(`VanGuard_Approved_Docs_${Date.now()}.doc`, html);
    },

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
Map Link: https://www.google.com/maps/dir/?api=1&destination=1${r.lat},${r.lng}

Notes from Agent:
${r.notes}

(Note: Photos to be attached manually if required)`); window.location.href = `mailto:${email}?subject=${subject}&body=${body}`; },
    markResolved: function(id) { if(confirm("Mark this report as resolved/processed?")) { let reports = CoreDB.getReports(); const idx = reports.findIndex(x => x.id === id); if(idx !== -1) { reports[idx].status = 'RESOLVED'; CoreDB.saveReports(reports); this.renderReports(); } } },

    openReplay: function() {
        this.switchView('replay');
        if(!this.replayMap) {
            const t = CoreDB.getTenants().find(x => x.id === CoreDB.getActiveTenantId());
            this.replayMap = L.map('replay-map', {zoomControl: false}).setView([t.homeLat, t.homeLng], t.defaultZoom);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.replayMap);
            this.replayLayerGroup = L.layerGroup().addTo(this.replayMap);
        }
        setTimeout(() => this.replayMap.invalidateSize(), 200);
        
        const agents = CoreDB.getUsers().filter(u => u.role === 'agent' && u.tenantId === CoreDB.getActiveTenantId());
        const list = document.getElementById('replay-worker-list');
        list.innerHTML = agents.map(a => `<div style="background:#f4f6f8; border:1px solid #ddd; padding:15px; margin-bottom:10px; border-radius:8px; cursor:pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'" onclick="ReporterCtrl.selectReplayWorker('${a.id}', '${a.name || a.username}')"><strong style="color:var(--b); font-size:14px;">${a.name || a.username}</strong><br><span style="font-size:11px; color:#666;">ID: ${a.username}</span></div>`).join('');
        
        document.getElementById('replay-job-list').innerHTML = '<p style="color:#888; font-size:12px; text-align:center; padding:20px;">Select a worker and date to load history.</p>';
        if(this.replayLayerGroup) this.replayLayerGroup.clearLayers();
    },
    selectReplayWorker: function(id, name) {
        this.currentReplayWorker = {id: id, name: name};
        document.getElementById('replay-cal-title').innerText = `History: ${name}`;
        UI.openOverlay('replay-calendar');
    },
    loadReplayData: function() {
        const dateVal = document.getElementById('replay-date').value;
        if(!dateVal) { alert("Please select a date."); return; }
        UI.closeOverlay('replay-calendar');
        
        const targetDateStr = new Date(dateVal).toLocaleDateString('en-NZ');
        const shifts = CoreDB.getShifts().filter(s => s.userId === this.currentReplayWorker.id);
        const targetShift = shifts.find(s => new Date(s.startTime).toLocaleDateString('en-NZ') === targetDateStr);
        
        this.replayLayerGroup.clearLayers();
        this.replayMarkers = {};
        
        let breadcrumbs = [];
        if(targetShift && targetShift.breadcrumbs) breadcrumbs = targetShift.breadcrumbs;
        
        if(breadcrumbs.length > 0) {
            const latlngs = breadcrumbs.map(b => [b.lat, b.lng]);
            L.polyline(latlngs, {color: '#2980b9', weight: 5, opacity: 0.8}).addTo(this.replayLayerGroup);
            this.replayMap.fitBounds(L.polyline(latlngs).getBounds(), {padding: [50, 50]});
        } else {
            alert(`No GPS breadcrumbs found for ${this.currentReplayWorker.name} on ${targetDateStr}.`);
            const t = CoreDB.getTenants().find(x => x.id === CoreDB.getActiveTenantId());
            this.replayMap.setView([t.homeLat, t.homeLng], t.defaultZoom);
        }
        
        const jobs = CoreDB.getJobBank().filter(j => j.tenantId === CoreDB.getActiveTenantId() && j.assignedTo === this.currentReplayWorker.id && j.pausedAt && j.pausedAt.includes(targetDateStr));
        const sortedJobs = jobs.reverse(); 
        
        const listEl = document.getElementById('replay-job-list');
        if(sortedJobs.length === 0) {
            listEl.innerHTML = '<div style="padding:15px; color:#888; text-align:center; font-size:12px;">No jobs recorded on this date.</div>';
            return;
        }
        
        listEl.innerHTML = sortedJobs.map(j => {
            const icon = j.type === 'COMPLETED' ? '✓' : (j.type === 'PENDING' ? '⏳' : '🔧');
            const col = j.type === 'COMPLETED' ? '#2ecc71' : (j.type === 'PENDING' ? '#3498db' : '#f1c40f');
            return `<div id="replay-card-${j.jobId}" class="replay-card" style="background:#fff; border-left:4px solid ${col}; border-radius:5px; padding:10px; margin-bottom:10px; cursor:pointer; box-shadow:0 1px 3px rgba(0,0,0,0.1); transition: background 0.2s;" onclick="ReporterCtrl.highlightReplayJob('${j.jobId}')">
                <strong style="font-size:13px; color:var(--text-dark);">${j.site}</strong><br>
                <span style="font-size:11px; font-weight:bold; color:${col};">${icon} ${j.type}</span>
                <span style="font-size:11px; color:#888; float:right;">${j.pausedAt.split(', ')[1] || j.pausedAt}</span>
                ${j.notes ? `<div style="font-size:11px; color:#666; margin-top:5px; padding-top:5px; border-top:1px dashed #eee;"><i>${j.notes}</i></div>` : ''}
            </div>`;
        }).join('');
        
        sortedJobs.forEach(async (j) => {
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(j.site)}&countrycodes=nz`); 
                const data = await res.json();
                if(data.length > 0) {
                    const lat = parseFloat(data[0].lat); const lon = parseFloat(data[0].lon);
                    const col = j.type === 'COMPLETED' ? '#2ecc71' : (j.type === 'PENDING' ? '#3498db' : '#f1c40f');
                    const iconHtml = `<div class="marker-inner" style="background-color: ${col}; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.4); font-size: 14px; color:white; font-weight:bold;">${j.type === 'COMPLETED' ? '✓' : (j.type === 'PENDING' ? '⏳' : '🔧')}</div>`;
                    const m = L.marker([lat, lon], { icon: L.divIcon({ className: '', html: iconHtml, iconSize: [32, 32], iconAnchor: [16, 16] }) });
                    
                    const popupHtml = `<div style="min-width:150px;">
                        <h4 style="margin:0 0 5px 0; color:var(--b);">${j.site}</h4>
                        <div style="font-size:11px; font-weight:bold; color:${col}; margin-bottom:5px;">${j.type}</div>
                        <div style="font-size:11px; color:#666;">Time: ${j.pausedAt}</div>
                        <div style="font-size:11px; color:#666;">SRN: ${j.srn || 'N/A'}</div>
                    </div>`;
                    
                    m.bindPopup(popupHtml);
                    m.on('click', () => { ReporterCtrl.highlightReplayJob(j.jobId, true); });
                    m.addTo(this.replayLayerGroup);
                    this.replayMarkers[j.jobId] = m;
                }
            } catch(e){ console.log("Replay Geocode Error:", e); }
        });
    },
    highlightReplayJob: function(jobId, fromMap = false) {
        document.querySelectorAll('.replay-card').forEach(el => el.style.background = '#fff');
        const card = document.getElementById(`replay-card-${jobId}`);
        if(card) {
            card.style.background = '#e3f2fd';
            if(fromMap) card.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
        if(!fromMap && this.replayMarkers[jobId]) {
            this.replayMap.panTo(this.replayMarkers[jobId].getLatLng());
            this.replayMarkers[jobId].openPopup();
        }
    }
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
