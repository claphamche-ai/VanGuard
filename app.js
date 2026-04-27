// ==========================================
// VANGUARD V1.1.16 - LAW ENFORCEMENT INTEL ENGINE
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
        { "id": "T001", "name": "Porirua City Council", "type": "Municipal Council", "tier": "City A", "licenses": 15, "status": "ACTIVE", "motto": "Mo Te Katoa Nga Iwi", "logo": "", "homeLat": -41.135, "homeLng": 174.84, "defaultZoom": 14, "reportEmail": "info@poriruacity.govt.nz" }
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
    getTenants: function() {
        let mem = localStorage.getItem('tt_tenants'); if(!mem) { localStorage.setItem('tt_tenants', JSON.stringify(this.defaultTenants)); return this.defaultTenants; }
        let parsed = JSON.parse(mem); let needsPatch = false;
        this.defaultTenants.forEach(dt => { let existing = parsed.find(pt => pt.id === dt.id); if (!existing) { parsed.push(dt); needsPatch = true; } });
        parsed.forEach(pt => {
            if(typeof pt.homeLat === 'undefined') { pt.homeLat = pt.id === 'T002' ? -41.2865 : -41.135; needsPatch = true; }
            if(typeof pt.homeLng === 'undefined') { pt.homeLng = pt.id === 'T002' ? 174.7762 : 174.84; needsPatch = true; }
            if(typeof pt.defaultZoom === 'undefined') { pt.defaultZoom = 14; needsPatch = true; }
            if(typeof pt.reportEmail === 'undefined') { pt.reportEmail = "info@council.govt.nz"; needsPatch = true; }
            if(typeof pt.type === 'undefined') { pt.type = "Municipal Council"; needsPatch = true; }
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
            if(typeof u.requirePunchIn === 'undefined') { u.requirePunchIn = true; patched = true; }
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
    
    updateJob: function(jobId, newData, reason) {
        let b = this.getJobBank();
        let idx = b.findIndex(j => j.jobId === jobId);
        if(idx !== -1) {
            let j = b[idx];
            if (!j.auditLog) j.auditLog = [];
            let snapshot = JSON.parse(JSON.stringify(j));
            delete snapshot.auditLog; 
            
            j.auditLog.push({ timestamp: Date.now(), dateStr: new Date().toLocaleString('en-NZ'), reason: reason, previousState: snapshot });

            j.data = newData.data;
            if(newData.photos) j.photos = newData.photos;
            if(newData.notes) j.notes = newData.notes;
            if(newData.srn !== undefined) j.srn = newData.srn;
            if(newData.assignedTo !== undefined) j.assignedTo = newData.assignedTo;
            
            j.reviewStatus = 'UNREVIEWED'; j.rejectReason = '';
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
    
    getActiveUser: function() { const activeUsername = localStorage.getItem('vg_active_user'); if(!activeUsername) return null; return this.getUsers().find(u => u.username === activeUsername); },
    getActiveShift: function() { const user = this.getActiveUser(); if(!user) return null; return this.getShifts().find(s => s.userId === user.id && s.status === 'OPEN'); },
    createShift: function() {
        const user = this.getActiveUser(); if(!user) return null; let shifts = this.getShifts();
        const newShift = { shiftId: 'SHIFT-' + Date.now(), tenantId: this.getActiveTenantId(), userId: user.id, username: user.name || user.username, startTime: new Date().toISOString(), endTime: null, status: 'OPEN', breadcrumbs: [], totalDistance: 0 };
        shifts.push(newShift); this.saveShifts(shifts); return newShift;
    },
    closeShift: function() {
        let shifts = this.getShifts(); const user = this.getActiveUser(); const idx = shifts.findIndex(s => s.userId === user.id && s.status === 'OPEN');
        if(idx !== -1) { 
            let shift = shifts[idx]; shift.status = 'CLOSED'; shift.endTime = new Date().toISOString(); 
            let dist = 0; const R = 6371;
            if(shift.breadcrumbs && shift.breadcrumbs.length > 1) {
                for(let i=1; i<shift.breadcrumbs.length; i++) {
                    let p1 = shift.breadcrumbs[i-1], p2 = shift.breadcrumbs[i]; let dLat = (p2.lat - p1.lat) * Math.PI / 180; let dLon = (p2.lng - p1.lng) * Math.PI / 180;
                    let a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) * Math.sin(dLon/2)*Math.sin(dLon/2);
                    dist += R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
                }
            }
            shift.totalDistance = dist; this.saveShifts(shifts); 
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
    toggleLayerList: () => { const el = document.getElementById('layer-container'); const chevron = document.getElementById('layer-chevron'); if(el.style.display === 'block') { el.style.display = 'none'; if(chevron) chevron.innerText = '▶'; } else { el.style.display = 'block'; if(chevron) chevron.innerText = '▼'; } },
    openOverlay: (id) => { document.querySelectorAll('.full-overlay').forEach(o => o.style.display = 'none'); document.getElementById(id + '-overlay').style.display = 'flex'; },
    closeOverlay: (id) => { document.getElementById(id + '-overlay').style.display = 'none'; },
    openPopup: (id) => document.getElementById(id).style.display = 'block', closePopup: (id) => document.getElementById(id).style.display = 'none',
    toggleFS: () => { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); },
    toggleSubRow: (rowId, iconId) => { const r = document.getElementById(rowId); const i = document.getElementById(iconId); if(!r) return; if(r.style.display === 'none' || r.style.display === '') { r.style.display = 'table-row'; i.innerText = '▼'; } else { r.style.display = 'none'; i.innerText = '▶'; } },
    downloadTextFile: function(filename, text) { let el = document.createElement('a'); el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text)); el.setAttribute('download', filename); el.style.display = 'none'; document.body.appendChild(el); el.click(); document.body.removeChild(el); },
    downloadWordDoc: function(filename, htmlContent) { const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>"; const footer = "</body></html>"; const sourceHTML = header + htmlContent + footer; const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML); let fileDownload = document.createElement("a"); document.body.appendChild(fileDownload); fileDownload.href = source; fileDownload.download = filename; fileDownload.click(); document.body.removeChild(fileDownload); },
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
    },
    lightboxState: { images: [], currentIndex: 0, zoom: 1, translateX: 0, translateY: 0 },
    initLightbox: function() {
        if(document.getElementById('vg-lightbox')) return;
        const lb = document.createElement('div'); lb.id = 'vg-lightbox';
        lb.style.cssText = 'display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.95); z-index:10000; align-items:center; justify-content:center; flex-direction:column; user-select:none;';
        lb.innerHTML = `
            <div style="position:absolute; top:20px; right:20px; color:white; font-size:30px; cursor:pointer; z-index:10001; text-shadow:0 2px 4px rgba(0,0,0,0.5);" onclick="UI.closeLightbox()">✕</div>
            <div id="lb-prev" style="position:absolute; left:20px; top:50%; transform:translateY(-50%); color:white; font-size:50px; cursor:pointer; z-index:10001; text-shadow:0 2px 4px rgba(0,0,0,0.5);" onclick="UI.changeLightbox(-1)">❮</div>
            <div id="lb-next" style="position:absolute; right:20px; top:50%; transform:translateY(-50%); color:white; font-size:50px; cursor:pointer; z-index:10001; text-shadow:0 2px 4px rgba(0,0,0,0.5);" onclick="UI.changeLightbox(1)">❯</div>
            <div style="position:relative; width:90%; height:80%; display:flex; align-items:center; justify-content:center; overflow:hidden;" id="lb-img-container">
                <img id="lb-img" src="" draggable="false" style="max-width:100%; max-height:100%; transition: transform 0.1s ease-out; cursor:grab;" onwheel="UI.zoomLightbox(event)">
            </div>
            <div style="position:absolute; bottom:20px; width:100%; text-align:center; color:white; font-family:monospace; display:flex; justify-content:center; gap:20px; align-items:center;">
                <span id="lb-counter" style="background:rgba(255,255,255,0.2); padding:5px 10px; border-radius:5px;">1/1</span>
                <span id="lb-caption" style="text-transform:uppercase; color:#ffea00; font-size:16px; font-weight:bold; letter-spacing:1px;"></span>
                <button class="std-btn gray" style="padding:5px 10px; font-size:12px; margin:0;" onclick="UI.resetZoom()">Reset Zoom</button>
            </div>
        `;
        document.body.appendChild(lb);
        let img = document.getElementById('lb-img'); let isDragging = false, startX, startY;
        const startDrag = (clientX, clientY) => { if(UI.lightboxState.zoom <= 1) return; isDragging = true; img.style.cursor = 'grabbing'; startX = clientX - UI.lightboxState.translateX; startY = clientY - UI.lightboxState.translateY; };
        const doDrag = (clientX, clientY) => { if(!isDragging) return; UI.lightboxState.translateX = clientX - startX; UI.lightboxState.translateY = clientY - startY; img.style.transform = `scale(${UI.lightboxState.zoom}) translate(${UI.lightboxState.translateX/UI.lightboxState.zoom}px, ${UI.lightboxState.translateY/UI.lightboxState.zoom}px)`; };
        const stopDrag = () => { isDragging = false; img.style.cursor = 'grab'; };
        img.onmousedown = (e) => { e.preventDefault(); startDrag(e.clientX, e.clientY); }; window.addEventListener('mousemove', (e) => { if(isDragging) doDrag(e.clientX, e.clientY); }); window.addEventListener('mouseup', stopDrag);
        img.ontouchstart = (e) => { startDrag(e.touches[0].clientX, e.touches[0].clientY); }; window.addEventListener('touchmove', (e) => { if(isDragging) { e.preventDefault(); doDrag(e.touches[0].clientX, e.touches[0].clientY); } }, {passive: false}); window.addEventListener('touchend', stopDrag);
    },
    openLightbox: function(images, startIndex) { this.initLightbox(); this.lightboxState.images = images; this.lightboxState.currentIndex = startIndex; this.updateLightbox(); document.getElementById('vg-lightbox').style.display = 'flex'; },
    closeLightbox: function() { document.getElementById('vg-lightbox').style.display = 'none'; this.resetZoom(); },
    changeLightbox: function(dir) { this.lightboxState.currentIndex += dir; if(this.lightboxState.currentIndex < 0) this.lightboxState.currentIndex = this.lightboxState.images.length - 1; if(this.lightboxState.currentIndex >= this.lightboxState.images.length) this.lightboxState.currentIndex = 0; this.updateLightbox(); },
    updateLightbox: function() { this.resetZoom(); const imgData = this.lightboxState.images[this.lightboxState.currentIndex]; document.getElementById('lb-img').src = imgData.url; document.getElementById('lb-caption').innerText = imgData.caption; document.getElementById('lb-counter').innerText = `${this.lightboxState.currentIndex + 1} / ${this.lightboxState.images.length}`; document.getElementById('lb-prev').style.display = this.lightboxState.images.length > 1 ? 'block' : 'none'; document.getElementById('lb-next').style.display = this.lightboxState.images.length > 1 ? 'block' : 'none'; },
    zoomLightbox: function(e) { e.preventDefault(); this.lightboxState.zoom += e.deltaY * -0.005; this.lightboxState.zoom = Math.min(Math.max(1, this.lightboxState.zoom), 6); const img = document.getElementById('lb-img'); if(this.lightboxState.zoom === 1) { this.lightboxState.translateX = 0; this.lightboxState.translateY = 0; } img.style.transform = `scale(${this.lightboxState.zoom}) translate(${this.lightboxState.translateX/this.lightboxState.zoom}px, ${this.lightboxState.translateY/this.lightboxState.zoom}px)`; },
    resetZoom: function() { this.lightboxState.zoom = 1; this.lightboxState.translateX = 0; this.lightboxState.translateY = 0; const img = document.getElementById('lb-img'); if(img) { img.style.transform = 'scale(1) translate(0px, 0px)'; img.style.cursor = 'grab'; } }
};

const LawEnforcementCtrl = {
    leFilteredJobs: [],
    mapInstance: null,
    layerGroup: null,
    
    init: function() {
        const cList = document.getElementById('le-region-list');
        if(cList) {
            const councils = CoreDB.getTenants().filter(t => t.type === 'Municipal Council');
            let wHtml = `<label style="display:flex; align-items:center; font-size:13px; font-weight:bold; margin-bottom:10px;"><input type="checkbox" id="le-cb-all-regions" checked onchange="LawEnforcementCtrl.toggleAllRegions(this.checked)" style="margin-right:10px; width:16px; height:16px;"> Select All Regions</label>`;
            councils.forEach(c => { 
                wHtml += `<label style="display:flex; align-items:center; font-size:13px; margin-bottom:5px; color:#555;"><input type="checkbox" value="${c.id}" class="le-region-cb" checked style="margin-right:10px;"> ${c.name}</label>`; 
            });
            cList.innerHTML = wHtml;
        }
    },
    toggleAllRegions: function(checked) {
        document.querySelectorAll('.le-region-cb').forEach(cb => cb.checked = checked);
    },
    generateIntelReport: function() {
        const fStr = document.getElementById('le-rep-from').value;
        const tStr = document.getElementById('le-rep-to').value;
        const tagStr = document.getElementById('le-rep-tags').value.toLowerCase().trim();
        
        if(!fStr || !tStr) { alert("Select date range"); return; }
        
        const fTime = new Date(fStr).setHours(0,0,0,0);
        const tTime = new Date(tStr).setHours(23,59,59,999);
        
        const selectedRegions = Array.from(document.querySelectorAll('.le-region-cb:checked')).map(cb => cb.value);
        if(selectedRegions.length === 0) { alert("Select at least one region."); return; }
        
        const tags = tagStr ? tagStr.split(',').map(s => s.trim()).filter(s => s) : [];

        let jobs = CoreDB.getJobBank().filter(j => j.type === 'COMPLETED' && j.timestamp >= fTime && j.timestamp <= tTime && selectedRegions.includes(j.tenantId));
        
        if(tags.length > 0) {
            jobs = jobs.filter(j => {
                let content = ((j.data && j.data.tag_content) || '') + ' ' + 
                              ((j.data && j.data.graffiti_tag_interpretation) || '') + ' ' + 
                              (j.notes || '');
                content = content.toLowerCase();
                return tags.some(t => content.includes(t));
            });
        }
        
        this.leFilteredJobs = jobs;
        this.renderPreview();
    },
    renderPreview: function() {
        const previewList = document.getElementById('le-rep-results');
        if(this.leFilteredJobs.length === 0) {
            previewList.innerHTML = `<p style="text-align:center; padding:30px; color:#888;">No intel found matching these parameters.</p>`;
            return;
        }
        
        const schema = CoreDB.getSchema();
        const users = CoreDB.getUsers();
        const tenants = CoreDB.getTenants();
        
        let html = '';
        this.leFilteredJobs.forEach(j => {
            const user = users.find(u => u.id === j.assignedTo);
            const workerName = user ? (user.name || user.username) : 'Unknown';
            const tenant = tenants.find(t => t.id === j.tenantId);
            const tenantName = tenant ? tenant.name : 'Unknown Region';
            
            html += `<div style="background:#fff; border:1px solid #ddd; border-radius:8px; margin-bottom:20px; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.05); page-break-inside: avoid;">`;
            
            html += `<div style="background:#34495e; color:white; padding:15px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <h3 style="margin:0;">${j.site}</h3>
                    <div style="font-size:11px; opacity:0.8;">Region: ${tenantName} | SRN: ${j.srn || 'N/A'} | Worker: ${workerName}</div>
                </div>
                <span class="badge" style="background:#2ecc71;">${j.type}</span>
            </div>`;

            if(j.photos && Object.keys(j.photos).length > 0) {
                let lbArray = []; let pIndex = 0;
                for(const [step, url] of Object.entries(j.photos)) { lbArray.push({url: url, caption: step}); }
                const lbArrayStr = JSON.stringify(lbArray).replace(/"/g, '&quot;');
                
                html += `<div style="display:flex; gap:10px; padding:15px; background:#f9f9f9; border-bottom:1px solid #eee; overflow-x:auto;">`;
                for(const [step, url] of Object.entries(j.photos)) {
                    html += `<div style="flex: 0 0 auto; text-align:center; cursor:pointer;" onclick="UI.openLightbox(${lbArrayStr.replace(/"/g, '&quot;')}, ${pIndex})">
                        <img src="${url}" style="height:150px; border-radius:5px; border:1px solid #ccc; transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        <div style="font-size:10px; color:#666; margin-top:5px; text-transform:uppercase; font-weight:bold;">${step}</div>
                    </div>`;
                    pIndex++;
                }
                html += `</div>`;
            }

            html += `<div style="padding:15px; display:grid; grid-template-columns:1fr 1fr; gap:10px;">`;
            html += `<div style="font-size:12px; border-bottom:1px solid #eee; padding-bottom:5px;"><strong style="color:var(--b);">Date Completed:</strong><br>${j.pausedAt}</div>`;
            if(j.notes) html += `<div style="font-size:12px; border-bottom:1px solid #eee; padding-bottom:5px;"><strong style="color:var(--b);">Agent Notes:</strong><br><i>${j.notes}</i></div>`;

            if(j.data) {
                schema.forEach(f => {
                    const val = j.data[f.id];
                    if(val) {
                        html += `<div style="font-size:12px; border-bottom:1px solid #eee; padding-bottom:5px;"><strong style="color:var(--b);">${f.label}:</strong><br>${val}</div>`;
                    }
                });
            }
            html += `</div></div>`;
        });
        previewList.innerHTML = html;
    },
    exportWord: function() {
        if(this.leFilteredJobs.length === 0) { alert("No intel to export. Please generate a report first."); return; }
        
        const schema = CoreDB.getSchema(); 
        const users = CoreDB.getUsers();
        const tenants = CoreDB.getTenants();
        
        let html = `<style>body { font-family: Arial, sans-serif; } .job-block { border: 1px solid #000; margin-bottom: 20px; padding: 10px; page-break-inside: avoid; } .header { background-color: #34495e; color: #fff; padding: 5px; font-weight: bold; } table { width: 100%; border-collapse: collapse; margin-top: 10px; } td { padding: 5px; border-bottom: 1px solid #ccc; font-size: 12px; } img { max-height: 200px; max-width: 300px; margin: 5px; border: 1px solid #000; }</style><h1>Law Enforcement Intelligence Report</h1><p>Generated: ${new Date().toLocaleString()}</p>`;
        
        this.leFilteredJobs.forEach(j => {
            const user = users.find(u => u.id === j.assignedTo); 
            const wName = user ? (user.name || user.username) : 'Unknown';
            const tenant = tenants.find(t => t.id === j.tenantId);
            const tenantName = tenant ? tenant.name : 'Unknown Region';

            html += `<div class="job-block"><div class="header">Site: ${j.site} | Region: ${tenantName} | SRN: ${j.srn || 'N/A'}</div><table><tr><td><strong>Agent:</strong></td><td>${wName}</td><td><strong>Date:</strong></td><td>${j.pausedAt}</td></tr>`;
            
            if(j.data) {
                const filledFields = schema.filter(f => j.data[f.id]);
                for(let i=0; i<filledFields.length; i+=2) {
                    const f1 = filledFields[i]; const v1 = j.data[f1.id];
                    let f2 = null, v2 = '';
                    if(i+1 < filledFields.length) { f2 = filledFields[i+1]; v2 = j.data[f2.id]; }
                    html += `<tr><td><strong>${f1.label}:</strong></td><td>${v1}</td>${f2 ? `<td><strong>${f2.label}:</strong></td><td>${v2}</td>` : `<td></td><td></td>`}</tr>`;
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
        UI.downloadWordDoc(`LE_Intel_Report_${Date.now()}.doc`, html);
    },
    openMapProjection: function() {
        if(this.leFilteredJobs.length === 0) { alert("No intel to map. Please generate a report first."); return; }
        
        UI.openOverlay('le-map-projection');
        
        if(!this.mapInstance) {
            this.mapInstance = L.map('le-intel-map', {zoomControl: true}).setView([-41.135, 174.84], 10);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.mapInstance);
            this.layerGroup = L.layerGroup().addTo(this.mapInstance);
        }
        setTimeout(() => { this.mapInstance.invalidateSize(); }, 300);
        
        this.layerGroup.clearLayers();
        let bounds = [];
        
        this.leFilteredJobs.forEach(async (j) => {
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(j.site)}&countrycodes=nz`); 
                const data = await res.json();
                if(data.length > 0) {
                    const lat = parseFloat(data[0].lat); const lon = parseFloat(data[0].lon);
                    const iconHtml = `<div class="marker-inner" style="background-color: #e74c3c; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.4); font-size: 14px; color:white; font-weight:bold;">🚔</div>`;
                    const m = L.marker([lat, lon], { icon: L.divIcon({ className: '', html: iconHtml, iconSize: [32, 32], iconAnchor: [16, 16] }) });
                    
                    let popupContent = `<div style="min-width:150px;"><h4 style="margin:0 0 5px 0; color:var(--b);">${j.site}</h4><div style="font-size:11px; color:#666;">Date: ${j.pausedAt}</div>`;
                    if(j.data && j.data.tag_content) popupContent += `<div style="font-size:11px; font-weight:bold; color:#e74c3c;">Tag: ${j.data.tag_content}</div>`;
                    if(j.data && j.data.graffiti_tag_interpretation) popupContent += `<div style="font-size:11px; font-style:italic; color:#e74c3c;">Interpretation: ${j.data.graffiti_tag_interpretation}</div>`;
                    
                    if(j.photos && Object.keys(j.photos).length > 0) {
                        const firstPhoto = Object.values(j.photos)[0];
                        popupContent += `<img src="${firstPhoto}" style="width:100%; height:auto; margin-top:5px; border-radius:3px;">`;
                    }
                    popupContent += `</div>`;
                    
                    m.bindPopup(popupContent);
                    m.addTo(this.layerGroup);
                    bounds.push([lat, lon]);
                    
                    if(bounds.length > 0) {
                        this.mapInstance.fitBounds(bounds, {padding: [50, 50], maxZoom: 16});
                    }
                }
            } catch(e){ console.log("LE Map Geocode Error:", e); }
        });
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
    if(role === 'law-enforcement') LawEnforcementCtrl.init();
});
