
const BRAND_NAME = "VanGuard";

if(document.getElementById('page-title')) { document.getElementById('page-title').innerText = `${BRAND_NAME} | Agent v3.19`; }
if(document.getElementById('brand-name')) { document.getElementById('brand-name').innerText = BRAND_NAME; }

// --- DATABASE MOCK ENGINE (Updated with User's Spoof Data) ---
const defaultSchema = [
    {
        "id": "srn",
        "label": "Service Request Number (SRN)",
        "type": "text",
        "tenantVisible": true,
        "tenantMandatory": false,
        "options": null
    },
    {
        "id": "workers",
        "label": "Number of Workers",
        "type": "select",
        "tenantVisible": true,
        "tenantMandatory": true,
        "options": [
            { "name": "1 Worker (Default)", "visible": true },
            { "name": "2 Workers", "visible": true },
            { "name": "3 Workers", "visible": true },
            { "name": "4 Workers", "visible": true },
            { "name": "5+ Workers", "visible": true }
        ]
    },
    {
        "id": "area",
        "label": "Repaired Area (m²)",
        "type": "select",
        "tenantVisible": true,
        "tenantMandatory": true,
        "options": [
            { "name": "0.5", "visible": true },
            { "name": "1", "visible": true },
            { "name": "2", "visible": true },
            { "name": "5", "visible": true },
            { "name": "10", "visible": true },
            { "name": "20", "visible": true }
        ]
    },
    {
        "id": "property",
        "label": "Property Type",
        "type": "select",
        "tenantVisible": true,
        "tenantMandatory": true,
        "options": [
            { "name": "Commercial Building", "visible": true },
            { "name": "Private Residence", "visible": true },
            { "name": "Public Fence", "visible": true },
            { "name": "Utility Box", "visible": true },
            { "name": "Underpass", "visible": true },
            { "name": "Private Fence.", "visible": true }
        ]
    },
    {
        "id": "surface",
        "label": "Surface Type",
        "type": "select",
        "tenantVisible": true,
        "tenantMandatory": true,
        "options": [
            { "name": "Brick", "visible": true },
            { "name": "Raw Wood", "visible": true },
            { "name": "Painted (Smooth)", "visible": true },
            { "name": "Metal", "visible": true },
            { "name": "Concrete / Stone", "visible": true },
            { "name": "Glass", "visible": true }
        ]
    },
    {
        "id": "medium",
        "label": "Graffiti Medium",
        "type": "select",
        "tenantVisible": true,
        "tenantMandatory": true,
        "options": [
            { "name": "Spray Paint", "visible": true },
            { "name": "Paint (Brush/Roller)", "visible": true },
            { "name": "Felt Pen / Marker", "visible": true },
            { "name": "Etched / Scratched", "visible": true },
            { "name": "Sticker / Poster", "visible": true }
        ]
    },
    {
        "id": "method",
        "label": "Removal Method",
        "type": "select",
        "tenantVisible": true,
        "tenantMandatory": true,
        "options": [
            { "name": "Painted over", "visible": true },
            { "name": "Chemical removal", "visible": true },
            { "name": "Pressure wash", "visible": true },
            { "name": "Sand blasting", "visible": true },
            { "name": "Mechanical sanding", "visible": true }
        ]
    },
    {
        "id": "color",
        "label": "Paint Color Used",
        "type": "select",
        "tenantVisible": true,
        "tenantMandatory": true,
        "options": [
            { "name": "White", "visible": true },
            { "name": "Black", "visible": true },
            { "name": "Grey", "visible": true },
            { "name": "Brown", "visible": true },
            { "name": "Colour Match", "visible": true },
            { "name": "yellow", "visible": true }
        ]
    },
    {
        "id": "chemicals",
        "label": "Chemicals Used (ml/L)",
        "type": "text",
        "tenantVisible": true,
        "tenantMandatory": false,
        "options": null
    }
];

function getDB() {
    if(!localStorage.getItem('vg_schema')) { localStorage.setItem('vg_schema', JSON.stringify(defaultSchema)); }
    return JSON.parse(localStorage.getItem('vg_schema'));
}
function saveDB(data) { localStorage.setItem('vg_schema', JSON.stringify(data)); }

function toggleSubRow(rowId, iconId) {
    const row = document.getElementById(rowId);
    const icon = document.getElementById(iconId);
    if(!row) return;
    if(row.style.display === 'none' || row.style.display === '') {
        row.style.display = 'table-row';
        icon.innerText = '▼';
    } else {
        row.style.display = 'none';
        icon.innerText = '▶';
    }
}

// GOD DASHBOARD RENDERER
function renderGodSchema() {
    const container = document.getElementById('god-schema-render');
    if(!container) return;
    let db = getDB();
    let html = '<table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;"><tr style="background: var(--nav-dark); color: white;"><th style="padding: 12px 15px;">Global Data Field</th><th style="padding: 12px 15px; width: 100px;">Type</th><th style="padding: 12px 15px; text-align: right; width: 100px;">Action</th></tr>';
    db.forEach(f => {
        html += `<tr style="border-bottom: 1px solid #eee; background: #fff;">`;
        if(f.type === 'select') {
            html += `<td style="padding: 15px; font-weight:bold; cursor: pointer; color: var(--b);" onclick="toggleSubRow('god-sub-${f.id}', 'god-icon-${f.id}')"><span id="god-icon-${f.id}" style="display:inline-block; width: 15px;">▶</span> ${f.label}</td>`;
        } else {
            html += `<td style="padding: 15px; font-weight:bold; color: #333;"><span style="display:inline-block; width: 15px;"></span> ${f.label}</td>`;
        }
        html += `<td style="padding: 15px; color: #666;">${f.type==='select'?'Drop-down':'Input'}</td>`;
        html += `<td style="padding: 15px; text-align: right;"><button class="std-btn red" style="padding: 6px 12px; font-size: 11px; width: auto;" onclick="deleteGodField('${f.id}')">Delete</button></td></tr>`;
        
        if(f.type === 'select') {
            html += `<tr id="god-sub-${f.id}" style="display: none; background: #fafafa; border-bottom: 2px solid #ddd;"><td colspan="3" style="padding: 20px 20px 25px 45px;"><div style="font-size: 11px; font-weight: 900; margin-bottom: 10px; color: #888; text-transform: uppercase;">Manage Drop-down Options</div><div class="sub-options-list">`;
            f.options.forEach(opt => {
                html += `<div class="sub-option-row"><span>${opt.name}</span><button class="std-btn red" style="padding: 4px 10px; font-size: 10px; width: auto;" onclick="deleteGodOption('${f.id}', '${opt.name}')">✕</button></div>`;
            });
            html += `<div style="display: flex; gap: 10px; margin-top: 10px;"><input type="text" id="god-new-opt-${f.id}" class="std-input" placeholder="New Option..." style="margin-bottom: 0; padding: 10px;"><button class="std-btn green" style="width: auto; padding: 0 20px;" onclick="addGodOption('${f.id}')">➕ Add</button></div></div></td></tr>`;
        }
    });
    html += '</table>';
    container.innerHTML = html;
}

// TENANT ADMIN RENDERER
function renderAdminSchema() {
    const container = document.getElementById('admin-schema-render');
    if(!container) return;
    let db = getDB();
    let html = '<table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;"><tr style="border-bottom: 2px solid #ddd; color: #666;"><th style="padding: 10px 5px;">Data Field / Drop-Down Options</th><th style="padding: 10px 5px; text-align: center; width: 120px;">Visible in App</th><th style="padding: 10px 5px; text-align: center; width: 120px;">Mandatory</th></tr>';
    db.forEach(f => {
        html += `<tr style="border-bottom: 1px solid #eee; background: #fff;">`;
        if(f.type === 'select') {
            html += `<td style="padding: 12px 5px; font-weight:bold; cursor: pointer; color: var(--b);" onclick="toggleSubRow('adm-sub-${f.id}', 'adm-icon-${f.id}')"><span id="adm-icon-${f.id}" style="display:inline-block; width: 15px;">▶</span> ${f.label}</td>`;
        } else {
            html += `<td style="padding: 12px 5px; font-weight:bold; color: #333;"><span style="display:inline-block; width: 15px;"></span> ${f.label}</td>`;
        }
        html += `<td style="padding: 12px 5px; text-align: center;"><label class="toggle-switch"><input type="checkbox" ${f.tenantVisible?'checked':''} onchange="toggleFieldVis('${f.id}')"><span class="slider"></span></label></td>`;
        html += `<td style="padding: 12px 5px; text-align: center;"><label class="toggle-switch"><input type="checkbox" ${f.tenantMandatory?'checked':''} onchange="toggleFieldMan('${f.id}')"><span class="slider"></span></label></td></tr>`;
        
        if(f.type === 'select') {
            html += `<tr id="adm-sub-${f.id}" style="display: none; background: #fafafa; border-bottom: 2px solid #ddd;"><td colspan="3" style="padding: 15px 15px 20px 35px;"><div style="font-size: 11px; font-weight: 900; margin-bottom: 10px; color: #888; text-transform: uppercase;">Option Visibility Toggles</div><div class="sub-options-list">`;
            f.options.forEach(opt => {
                html += `<div class="sub-option-row"><span>${opt.name}</span><label class="toggle-switch small"><input type="checkbox" ${opt.visible?'checked':''} onchange="toggleOptVis('${f.id}', '${opt.name}')"><span class="slider"></span></label></div>`;
            });
            html += `</div></td></tr>`;
        }
    });
    html += '</table>';
    container.innerHTML = html;
}

// AGENT FORM RENDERER
function renderAgentFields() {
    const container = document.getElementById('dynamic-work-fields');
    if(!container) return;
    let db = getDB();
    let html = '';
    db.forEach(f => {
        if(!f.tenantVisible) return;
        
        if(f.type === 'select') {
            html += `<select id="work-${f.id}" class="std-input" onchange="handleDropdown(this)"><option value="">${f.label}...</option>`;
            f.options.forEach(opt => { if(opt.visible) html += `<option value="${opt.name}">${opt.name}</option>`; });
            html += `<option value="ADD_NEW">➕ Manual Entry...</option></select>`;
        } else {
            let pType = f.type === 'number' ? 'number' : 'text';
            html += `<input type="${pType}" id="work-${f.id}" class="std-input" placeholder="${f.label} ${f.tenantMandatory?'':'(Optional)'}" style="margin-bottom: 10px;">`;
        }
    });
    container.innerHTML = html;

    // Map Inspection SRN visibility dynamically
    let srnField = db.find(f => f.id === 'srn');
    let inspSrn = document.getElementById('insp-srn');
    if(inspSrn && srnField) { inspSrn.style.display = srnField.tenantVisible ? 'block' : 'none'; }
}

// DATABASE MUTATION FUNCTIONS
function toggleFieldVis(id) { let db = getDB(); let f = db.find(x => x.id === id); if(f) { f.tenantVisible = !f.tenantVisible; saveDB(db); renderAdminSchema(); } }
function toggleFieldMan(id) { let db = getDB(); let f = db.find(x => x.id === id); if(f) { f.tenantMandatory = !f.tenantMandatory; saveDB(db); renderAdminSchema(); } }
function toggleOptVis(fieldId, optName) { let db = getDB(); let f = db.find(x => x.id === fieldId); if(f) { let o = f.options.find(y => y.name === optName); if(o) { o.visible = !o.visible; saveDB(db); renderAdminSchema(); } } }

function deleteGodField(id) { if(!confirm("WARNING: Deleting a root field affects all global tenants. Proceed?")) return; let db = getDB(); db = db.filter(f => f.id !== id); saveDB(db); renderGodSchema(); }
function deleteGodOption(fieldId, optName) { if(!confirm("WARNING: Deleting an option affects all global tenants. Proceed?")) return; let db = getDB(); let f = db.find(x => x.id === fieldId); if(f) { f.options = f.options.filter(y => y.name !== optName); saveDB(db); renderGodSchema(); } }
function addGodOption(fieldId) { let val = document.getElementById(`god-new-opt-${fieldId}`).value.trim(); if(!val) return; let db = getDB(); let f = db.find(x => x.id === fieldId); if(f && !f.options.find(o=>o.name === val)) { f.options.push({name: val, visible: true}); saveDB(db); renderGodSchema(); } document.getElementById(`god-new-opt-${fieldId}`).value = ''; }
function addNewGodField() {
    let label = document.getElementById('new-global-field-name').value.trim();
    let type = document.getElementById('new-global-field-type').value;
    if(!label) return;
    let id = label.toLowerCase().replace(/[^a-z0-9]/g, '_');
    let db = getDB();
    if(db.find(f => f.id === id)) { alert("Field already exists!"); return; }
    db.push({ id: id, label: label, type: type, tenantVisible: true, tenantMandatory: false, options: type === 'select' ? [] : null });
    saveDB(db); renderGodSchema();
    document.getElementById('new-global-field-name').value = '';
}

// DOM INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    // Overwrite local memory if the baked schema differs
    const currentMemory = localStorage.getItem('vg_schema');
    if(!currentMemory || currentMemory !== JSON.stringify(defaultSchema)) {
        console.log("Loading new baked schema...");
        localStorage.setItem('vg_schema', JSON.stringify(defaultSchema));
    }
    
    if(document.getElementById('god-schema-render')) renderGodSchema();
    if(document.getElementById('admin-schema-render')) renderAdminSchema();
    if(document.getElementById('dynamic-work-fields')) renderAgentFields();
});

// --- LEAFLET MAP LOGIC (Intact) ---
let timerInterval;
let activeSite = { name: "", type: "" };
let layers = {};
let workState = { startTime: null, accumulated: 0, hasBefore: false, hasAfter: false };
let inspState = { startTime: null, accumulated: 0, hasStart: false, hasEnd: false };

function updateClock() {
    const now = new Date();
    const clockEl = document.getElementById('menu-clock');
    if(clockEl) { clockEl.innerText = now.toLocaleString('en-NZ', { dateStyle: 'medium', timeStyle: 'short' }); }
}
updateClock();
setInterval(updateClock, 1000);

if(document.getElementById('map')) {
    const map = L.map('map', { zoomControl: false }).setView([-41.135, 174.84], 14);
    const baseMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    baseMap.addTo(map);

    let trail = L.polyline([], {color: '#ff4757', weight: 4, dashArray: '10, 10', opacity: 0.7}).addTo(map);
    let userMarker = L.marker([0,0], { 
        icon: L.divIcon({ 
            className: '', 
            html: '<div class="van-inner" style="font-size: 40px; filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.7)); display: flex; align-items: center; justify-content: center; transition: transform 0.3s linear; transform: rotate(90deg);">🚐</div>', 
            iconSize: [40,40], 
            iconAnchor: [20,20] 
        }) 
    }).addTo(map);

    let currentHeading = 0;
    let followMode = true; 

    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            function(pos) {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                const speed = pos.coords.speed || 0; 
                const heading = pos.coords.heading;
                
                const latlng = [lat, lng];
                userMarker.setLatLng(latlng);
                trail.addLatLng(latlng);
                
                if (speed > 4.16) { followMode = true; }
                if (heading !== null && !isNaN(heading) && speed > 1.5) { currentHeading = heading; }

                document.querySelectorAll('.van-inner').forEach(el => { el.style.transform = `rotate(${currentHeading + 90}deg)`; });

                if (followMode) {
                    map.panTo(latlng);
                    document.getElementById('map').style.transform = `rotate(${-currentHeading}deg)`;
                    document.querySelectorAll('.marker-inner').forEach(el => { el.style.transform = `rotate(${currentHeading}deg)`; });
                }
            },
            function(err) { console.warn("GPS Error:", err); },
            { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
        );
    }

    map.on('dragstart', function() {
        followMode = false;
        document.getElementById('map').style.transform = `rotate(0deg)`;
        document.querySelectorAll('.marker-inner').forEach(el => { el.style.transform = `rotate(0deg)`; });
    });

    window.centerGPS = function() {
        followMode = true;
        const coords = userMarker.getLatLng();
        if(coords.lat !== 0) {
            map.panTo(coords);
            document.getElementById('map').style.transform = `rotate(${-currentHeading}deg)`;
            document.querySelectorAll('.marker-inner').forEach(el => { el.style.transform = `rotate(${currentHeading}deg)`; });
        } else {
            alert("Acquiring GPS signal...");
        }
    }

    const config = [
        { file: 'Assets Map- Alleyway sites.csv.kml', label: 'Alleyway', color: '#ff00ff', icon: '🛣️' },
        { file: 'Wellington Electricity substation sites.kml', label: 'Substation', color: '#f1c40f', icon: '⚡' },
        { file: 'PCC Underpasses.kml', label: 'Underpass', color: '#e74c3c', icon: '🌉' },
        { file: 'Thompson Property Group & Unique Paint SItes.kml', label: 'Unique', color: '#9b59b6', icon: '💎' },
        { file: 'Traffic Light Box Sites.kml', label: 'Traffic', color: '#2ecc71', icon: '🚦' },
        { file: 'Community Buildings.kml', label: 'Community', color: '#3498db', icon: '🏠' },
        { file: 'PCC Mural Sites.kml', label: 'Mural', color: '#d35400', icon: '🖼️' },
        { file: 'Power Pole Area Sweeps.kml', label: 'Power Pole', color: '#000000', icon: '💈' },
        { file: 'PCC Off-street Carparks.kml', label: 'Carpark', color: '#34495e', icon: '🚗' }
    ];

    const container = document.getElementById('layer-container');

    config.forEach(item => {
        const div = document.createElement('div');
        div.className = 'layer-item';
        div.innerHTML = `<label style="display:flex; align-items:center; cursor:pointer;"><input type="checkbox" checked onchange="toggleLayer('${item.label}', this.checked)" style="margin-right:10px; width:18px; height:18px;"> <span style="font-size:18px; margin-right:8px;">${item.icon}</span> ${item.label}</label>`;
        container.appendChild(div);
        const group = L.featureGroup();
        layers[item.label] = group;

        const customLayer = L.geoJson(null, {
            style: function() { return { color: item.color, weight: 6, opacity: 0.7 }; },
            pointToLayer: function(feature, latlng) {
                const marker = L.marker(latlng, {
                    icon: L.divIcon({
                        className: '',
                        html: `<div class="marker-inner" style="background-color: ${item.color}; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.5); font-size: 18px; transition: transform 0.5s ease-out;">${item.icon}</div>`,
                        iconSize: [38, 38],
                        iconAnchor: [19, 19]
                    })
                });
                
                marker.on('click', function(e) {
                    L.DomEvent.stopPropagation(e);
                    activeSite.name = feature.properties?.name || "Unknown Site";
                    activeSite.type = item.label;
                    const props = feature.properties || {};
                    document.getElementById('s-name').innerText = activeSite.name;
                    document.getElementById('s-type').innerText = activeSite.type;
                    document.getElementById('s-address').value = props.ADDRESS || props.Address || props.address || props.description || "";
                    document.getElementById('s-owner').value = props.OWNER || props.Owner || props.owner || "";
                    document.getElementById('s-contact').value = props.CONTACT || props.Contact || props.contact || "";

                    const coverFrame = document.getElementById('cover-photo-frame');
                    coverFrame.style.backgroundImage = '';
                    coverFrame.classList.remove('has-photo');
                    document.getElementById('cover-photo-upload').value = '';
                    document.getElementById('site-info').style.display = 'block';
                });
                return marker;
            }
        });

        const runLayer = omnivore.kml(item.file, null, customLayer);
        runLayer.on('ready', function() {
            runLayer.eachLayer(function(layer) {
                if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
                    const center = layer.getBounds().getCenter();
                    const centerMarker = L.marker(center, {
                        icon: L.divIcon({
                            className: '',
                            html: `<div class="marker-inner" style="background-color: ${item.color}; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.5); font-size: 18px; transition: transform 0.5s ease-out;">${item.icon}</div>`,
                            iconSize: [38, 38],
                            iconAnchor: [19, 19]
                        })
                    });
                    
                    centerMarker.on('click', function(e) {
                        L.DomEvent.stopPropagation(e);
                        activeSite.name = layer.feature?.properties?.name || "Unknown Area";
                        activeSite.type = item.label;
                        const props = layer.feature?.properties || {};
                        document.getElementById('s-name').innerText = activeSite.name;
                        document.getElementById('s-type').innerText = activeSite.type;
                        document.getElementById('s-address').value = props.ADDRESS || props.Address || props.address || props.description || "";
                        document.getElementById('s-owner').value = props.OWNER || props.Owner || props.owner || "";
                        document.getElementById('s-contact').value = props.CONTACT || props.Contact || props.contact || "";

                        const coverFrame = document.getElementById('cover-photo-frame');
                        coverFrame.style.backgroundImage = '';
                        coverFrame.classList.remove('has-photo');
                        document.getElementById('cover-photo-upload').value = '';
                        document.getElementById('site-info').style.display = 'block';
                    });
                    group.addLayer(centerMarker);
                }
            });
            map.addLayer(group);
        }).on('error', function(e) { console.error("Failed to load: " + item.file, e); });
        group.addLayer(runLayer);
    });

    window.toggleLayer = function(name, show) {
        if(show) { map.addLayer(layers[name]); } else { map.removeLayer(layers[name]); }
    };
}

function toggleFS() {
    const doc = window.document;
    const docEl = doc.documentElement;
    const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    const cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
    
    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        requestFullScreen.call(docEl);
        document.getElementById('fs-btn').innerText = "✖";
    } else {
        cancelFullScreen.call(doc);
        document.getElementById('fs-btn').innerText = "⛶";
    }
}

function openSidebar() { document.getElementById('sidebar').classList.add('open'); }
function closeSidebar() { document.getElementById('sidebar').classList.remove('open'); }
function toggleLayerList() {
    const el = document.getElementById('layer-container');
    el.style.display = (el.style.display === 'block') ? 'none' : 'block';
}

function openOverlay(type) { 
    document.querySelectorAll('.full-overlay').forEach(o => o.style.display = 'none');
    document.getElementById(type + '-overlay').style.display = 'flex'; 
    document.querySelectorAll('.site-display').forEach(el => el.innerText = activeSite.name);
    document.getElementById('site-info').style.display = 'none';
    if(type === 'jobbank') renderJobBank();
}

function closeOverlay(type) { document.getElementById(type + '-overlay').style.display = 'none'; }

function handleCoverPhoto(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const frame = document.getElementById('cover-photo-frame');
            frame.style.backgroundImage = `url(${e.target.result})`;
            frame.classList.add('has-photo');
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function startLiveTimer(startTime, offset = 0) {
    clearInterval(timerInterval);
    const widget = document.getElementById('live-timer-widget');
    widget.style.display = 'block';
    timerInterval = setInterval(() => {
        const totalSecs = Math.floor((new Date() - startTime + offset) / 1000);
        const m = Math.floor(totalSecs / 60); 
        const s = totalSecs % 60;
        widget.innerText = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    }, 1000);
}
function stopLiveTimer() {
    clearInterval(timerInterval);
    document.getElementById('live-timer-widget').style.display = 'none';
}

function handleWorkPhoto(step) {
    const now = new Date();
    document.getElementById('btn-' + step).classList.add('done');
    document.getElementById('time-' + step).innerText = now.toLocaleTimeString('en-NZ', {hour: '2-digit', minute:'2-digit'});
    
    if(step === 'before') {
        workState.startTime = now;
        workState.hasBefore = true;
        document.getElementById('pause-work-btn').disabled = false;
        startLiveTimer(now, workState.accumulated);
        document.getElementById('ai-analysis-section').style.display = 'block';
    } else {
        workState.hasAfter = true;
        document.getElementById('submit-work-btn').disabled = false;
    }
}

function runAIAnalysis() {
    const btn = document.getElementById('ai-analyze-btn');
    const res = document.getElementById('ai-results');
    btn.innerText = "⏳ Processing image data...";
    btn.disabled = true;

    setTimeout(() => {
        document.getElementById('ai-tag').innerText = "VANDAL, 2K26";
        document.getElementById('ai-size').innerText = "Approx 1.2m x 0.8m";
        res.style.display = 'block';
        btn.innerText = "✓ Analysis Complete";
        btn.style.background = "#2ecc71"; 
        
        const desc = document.getElementById('work-desc');
        if(desc.value === "") { desc.value = "AI Note: Detected tags 'VANDAL, 2K26'. Estimated size 1.2m x 0.8m."; }
    }, 2500);
}

function handleInspPhoto(step) {
    const now = new Date();
    document.getElementById('btn-insp-' + step).classList.add('done');
    document.getElementById('time-insp-' + step).innerText = now.toLocaleTimeString('en-NZ', {hour: '2-digit', minute:'2-digit'});
    
    if(step === 'start') {
        inspState.startTime = now;
        inspState.hasStart = true;
        document.getElementById('pause-insp-btn').disabled = false;
        startLiveTimer(now, inspState.accumulated);
    } else {
        inspState.hasEnd = true;
        document.getElementById('submit-insp-btn').disabled = false;
    }
}

function handleDropdown(el) {
    if(el.value === "ADD_NEW") {
        const val = prompt("Enter new manual value:");
        if(val) {
            const opt = document.createElement("option"); opt.text = val; opt.value = val;
            el.add(opt, el.options[el.options.length-1]); el.value = val;
        } else { el.value = ""; }
    }
}

function updateExtraCount(type) {
    const input = document.getElementById('photo-'+type+'-extra');
    document.getElementById(type+'-extra-count').innerText = input.files.length + " extra photos added";
    document.getElementById(type+'-extra-count').style.color = '#2ecc71';
}

function cancelJob() {
    if(confirm("Cancel this job? All unsaved progress will be discarded.")) {
        stopLiveTimer();
        workState = { startTime: null, accumulated: 0, hasBefore: false, hasAfter: false };
        
        document.getElementById('btn-before').classList.remove('done');
        document.getElementById('time-before').innerText = "Take photo to start";
        document.getElementById('btn-after').classList.remove('done');
        document.getElementById('time-after').innerText = "(Complete work)";
        
        document.getElementById('photo-before').value = "";
        document.getElementById('photo-after').value = "";
        document.getElementById('photo-work-extra').value = "";
        document.getElementById('work-extra-count').innerText = "0 extra photos";
        document.getElementById('work-extra-count').style.color = "#888";
        
        renderAgentFields(); // Resets dynamic fields automatically
        document.getElementById('work-desc').value = "";
        document.getElementById('work-materials').value = "";
        
        document.getElementById('pause-work-btn').disabled = true;
        document.getElementById('submit-work-btn').disabled = true;
        
        document.getElementById('ai-analysis-section').style.display = 'none';
        document.getElementById('ai-results').style.display = 'none';
        document.getElementById('ai-analyze-btn').innerText = "🤖 Extract Tags & Size (AI)";
        document.getElementById('ai-analyze-btn').disabled = false;
        document.getElementById('ai-analyze-btn').style.background = "#9b59b6";
        
        closeOverlay('work');
    }
}

function cancelInsp() {
    if(confirm("Cancel this inspection? All unsaved progress will be discarded.")) {
        stopLiveTimer();
        inspState = { startTime: null, accumulated: 0, hasStart: false, hasEnd: false };
        
        document.getElementById('btn-insp-start').classList.remove('done');
        document.getElementById('time-insp-start').innerText = "Take photo to start";
        document.getElementById('btn-insp-end').classList.remove('done');
        document.getElementById('time-insp-end').innerText = "(Walk length)";
        
        document.getElementById('photo-insp-start').value = "";
        document.getElementById('photo-insp-end').value = "";
        document.getElementById('photo-insp-extra').value = "";
        document.getElementById('insp-extra-count').innerText = "0 extra photos";
        document.getElementById('insp-extra-count').style.color = "#888";
        
        renderAgentFields(); // Resets dynamic SRN field
        document.getElementById('insp-notes').value = "";
        
        document.getElementById('pause-insp-btn').disabled = true;
        document.getElementById('submit-insp-btn').disabled = true;
        
        closeOverlay('inspection');
    }
}

function pauseJob() {
    const elapsed = new Date() - workState.startTime;
    const pausedJob = { site: activeSite.name, type: 'WORK', accumulated: workState.accumulated + elapsed, pausedAt: new Date().toLocaleString('en-NZ') };
    let bank = JSON.parse(localStorage.getItem('tt_jobbank') || '[]');
    bank.unshift(pausedJob);
    localStorage.setItem('tt_jobbank', JSON.stringify(bank));
    
    stopLiveTimer();
    closeOverlay('work');
}

function submitWork() {
    const totalMs = (new Date() - workState.startTime) + workState.accumulated;
    const mins = Math.round(totalMs / 60000);
    
    let db = getDB();
    let body = `WORK LOG%0D%0ASite: ${activeSite.name}%0D%0ADuration: ${mins} mins%0D%0A%0D%0A--- FIELD DATA ---%0D%0A`;
    let failed = false;

    db.forEach(f => {
        if(!f.tenantVisible) return;
        const el = document.getElementById(`work-${f.id}`);
        if(el) {
            const val = el.value;
            if(f.tenantMandatory && (!val || val === "")) { 
                alert(`Please complete the required field: ${f.label}`); 
                failed = true; 
            }
            body += `${f.label}: ${val || 'N/A'}%0D%0A`;
        }
    });

    if(failed) return;

    const desc = document.getElementById('work-desc').value;
    const mats = document.getElementById('work-materials').value;
    
    body += `%0D%0A--- NOTES ---%0D%0ADescription: ${desc}%0D%0AExtra Materials: ${mats}`;
    
    window.location.href = `mailto:tracktagstgs@gmail.com?subject=Work Log: ${activeSite.name}&body=${body}`;
    
    stopLiveTimer();
    closeOverlay('work');
}

function pauseInsp() {
    const elapsed = new Date() - inspState.startTime;
    const pausedJob = { site: activeSite.name, type: 'INSPECTION', accumulated: inspState.accumulated + elapsed, pausedAt: new Date().toLocaleString('en-NZ') };
    let bank = JSON.parse(localStorage.getItem('tt_jobbank') || '[]');
    bank.unshift(pausedJob);
    localStorage.setItem('tt_jobbank', JSON.stringify(bank));
    
    stopLiveTimer();
    closeOverlay('inspection');
}

function submitInsp() {
    const totalMs = (new Date() - inspState.startTime) + inspState.accumulated;
    const mins = Math.round(totalMs / 60000);
    
    const srnEl = document.getElementById('insp-srn');
    const srn = (srnEl && srnEl.style.display !== 'none') ? srnEl.value : 'N/A';
    const notes = document.getElementById('insp-notes').value;
    
    const body = `INSPECTION LOG%0D%0ASite: ${activeSite.name}%0D%0ASRN: ${srn || 'N/A'}%0D%0ADuration: ${mins} mins%0D%0ANotes: ${notes}`;
    window.location.href = `mailto:tracktagstgs@gmail.com?subject=Inspection Log: ${activeSite.name}&body=${body}`;
    
    stopLiveTimer();
    closeOverlay('inspection');
}

function renderJobBank() {
    const list = document.getElementById('job-bank-list');
    const data = JSON.parse(localStorage.getItem('tt_jobbank') || '[]');
    if (data.length === 0) { list.innerHTML = '<p style="text-align:center; color:#666;">No paused jobs.</p>'; return; }
    list.innerHTML = data.map((item, i) => `
        <div style="background:#f1f2f6; margin-bottom:10px; padding:15px; border-radius:10px; cursor:pointer;" onclick="resumeAny(${i})">
            <strong style="color:#2980b9;">${item.type}</strong>: ${item.site}<br>
            <small style="color:#666;">Paused: ${item.pausedAt}</small>
        </div>`).join('');
}

function resumeAny(index) {
    let bank = JSON.parse(localStorage.getItem('tt_jobbank') || '[]');
    const job = bank[index];
    activeSite.name = job.site;
    
    if (job.type === 'INSPECTION') {
        inspState.startTime = new Date();
        inspState.accumulated = job.accumulated;
        inspState.hasStart = true;
        document.getElementById('btn-insp-start').classList.add('done');
        document.getElementById('time-insp-start').innerText = "RESUMED";
        openOverlay('inspection');
        startLiveTimer(inspState.startTime, inspState.accumulated);
    } else {
        workState.startTime = new Date();
        workState.accumulated = job.accumulated;
        workState.hasBefore = true;
        document.getElementById('btn-before').classList.add('done');
        document.getElementById('time-before').innerText = "RESUMED";
        openOverlay('work');
        startLiveTimer(workState.startTime, workState.accumulated);
    }
    
    bank.splice(index, 1);
    localStorage.setItem('tt_jobbank', JSON.stringify(bank));
}
