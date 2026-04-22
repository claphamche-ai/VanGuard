
const BRAND_NAME = "VanGuard";

document.getElementById('page-title').innerText = `${BRAND_NAME} | Field Ops v2.5`;
document.getElementById('brand-name').innerText = BRAND_NAME;

let timerInterval;
let activeSite = { name: "", type: "" };
let layers = {};

let workState = { startTime: null, accumulated: 0, hasBefore: false, hasAfter: false };
let inspState = { startTime: null, accumulated: 0, hasStart: false, hasEnd: false };

function updateClock() {
    const now = new Date();
    document.getElementById('menu-clock').innerText = now.toLocaleString('en-NZ', { dateStyle: 'medium', timeStyle: 'short' });
}
updateClock();
setInterval(updateClock, 1000);

const map = L.map('map', { zoomControl: false }).setView([-41.135, 174.84], 14);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let trail = L.polyline([], {color: '#ff4757', weight: 4, dashArray: '10, 10', opacity: 0.7}).addTo(map);

map.locate({setView: false, watch: true, enableHighAccuracy: true});
let userMarker = L.marker([0,0], { 
    icon: L.divIcon({ 
        className: 'van-icon', 
        html: '<div style="font-size: 40px; filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.7)); display: flex; align-items: center; justify-content: center;">🚐</div>', 
        iconSize: [40,40], 
        iconAnchor: [20,20] 
    }) 
}).addTo(map);

map.on('locationfound', e => { 
    userMarker.setLatLng(e.latlng); 
    trail.addLatLng(e.latlng);
});

function centerGPS() {
    const coords = userMarker.getLatLng();
    if(coords.lat !== 0) {
        map.setView(coords, 16);
    } else {
        alert("Acquiring GPS signal...");
    }
}

function toggleFS() {
    const doc = window.document;
    const docEl = doc.documentElement;
    const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    const cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
    
    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        requestFullScreen.call(docEl);
        document.getElementById('fs-btn').innerText = "🗗 EXIT FS";
    } else {
        cancelFullScreen.call(doc);
        document.getElementById('fs-btn').innerText = "🔲 FULL SCREEN";
    }
}

function openSidebar() { document.getElementById('sidebar').classList.add('open'); }
function closeSidebar() { document.getElementById('sidebar').classList.remove('open'); }
function toggleLayerList() {
    const el = document.getElementById('layer-container');
    el.style.display = (el.style.display === 'block') ? 'none' : 'block';
}

function toggleLayer(name, show) {
    if(show) {
        map.addLayer(layers[name]);
    } else {
        map.removeLayer(layers[name]);
    }
}

function openOverlay(type) { 
    document.querySelectorAll('.full-overlay').forEach(o => o.style.display = 'none');
    document.getElementById(type + '-overlay').style.display = 'flex'; 
    document.querySelectorAll('.site-display').forEach(el => el.innerText = activeSite.name);
    document.getElementById('site-info').style.display = 'none';
    if(type === 'jobbank') renderJobBank();
}
function closeOverlay(type) { document.getElementById(type + '-overlay').style.display = 'none'; }

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
    } else {
        workState.hasAfter = true;
        document.getElementById('submit-work-btn').disabled = false;
    }
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
        const val = prompt("Enter new type:");
        if(val) {
            const opt = document.createElement("option"); opt.text = val; opt.value = val;
            el.add(opt, el.options[el.options.length-1]); el.value = val;
        } else {
            el.value = "";
        }
    }
}

function updateExtraCount(type) {
    const input = document.getElementById('photo-'+type+'-extra');
    document.getElementById(type+'-extra-count').innerText = input.files.length + " extra photos added";
    document.getElementById(type+'-extra-count').style.color = '#2ecc71';
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
    const med = document.getElementById('work-medium').value;
    const sur = document.getElementById('work-surface').value;
    const prop = document.getElementById('work-property').value;
    
    if(!med || !sur || !prop) { alert("Please complete dropdown selections."); return; }
    
    const body = `WORK LOG%0D%0ASite: ${activeSite.name}%0D%0ADuration: ${mins} mins%0D%0AMedium: ${med}%0D%0ASurface: ${sur}%0D%0AProperty: ${prop}`;
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
    const notes = document.getElementById('insp-notes').value;
    
    const body = `INSPECTION LOG%0D%0ASite: ${activeSite.name}%0D%0ADuration: ${mins} mins%0D%0ANotes: ${notes}`;
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

// ==============================================================
// BASELINE KML LOADER - NO ENCODING HACKS
// ==============================================================
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
    // 1. Build menu
    const div = document.createElement('div');
    div.className = 'layer-item';
    div.innerHTML = `<label style="display:flex; align-items:center; cursor:pointer;"><input type="checkbox" checked onchange="toggleLayer('${item.label}', this.checked)" style="margin-right:10px; width:18px; height:18px;"> <span style="font-size:18px; margin-right:8px;">${item.icon}</span> ${item.label}</label>`;
    container.appendChild(div);

    // 2. Setup group
    const group = L.featureGroup();
    layers[item.label] = group;

    // 3. Setup Custom Layer parsing
    const customLayer = L.geoJson(null, {
        style: function() { return { color: item.color, weight: 6, opacity: 0.7 }; },
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                icon: L.divIcon({
                    className: 'custom-div-icon',
                    html: `<div style="background-color: ${item.color}; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.5); font-size: 18px;">${item.icon}</div>`,
                    iconSize: [38, 38],
                    iconAnchor: [19, 19]
                })
            });
        },
        onEachFeature: function(feature, layer) {
            layer.on('click', function(e) {
                L.DomEvent.stopPropagation(e);
                activeSite.name = feature.properties.name || "Unknown Site";
                activeSite.type = item.label;
                document.getElementById('s-name').innerText = activeSite.name;
                document.getElementById('s-type').innerText = activeSite.type;
                document.getElementById('site-info').style.display = 'block';
            });
        }
    });

    // 4. Pass the EXACT string name to omnivore. Browsers handle fetch encoding natively.
    const runLayer = omnivore.kml(item.file, null, customLayer);
    
    runLayer.on('ready', function() {
        runLayer.eachLayer(function(layer) {
            if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
                const center = layer.getBounds().getCenter();
                const centerMarker = L.marker(center, {
                    icon: L.divIcon({
                        className: 'custom-div-icon',
                        html: `<div style="background-color: ${item.color}; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.5); font-size: 18px;">${item.icon}</div>`,
                        iconSize: [38, 38],
                        iconAnchor: [19, 19]
                    })
                });
                centerMarker.on('click', function(e) {
                    L.DomEvent.stopPropagation(e);
                    activeSite.name = layer.feature.properties.name || "Unknown Area";
                    activeSite.type = item.label;
                    document.getElementById('s-name').innerText = activeSite.name;
                    document.getElementById('s-type').innerText = activeSite.type;
                    document.getElementById('site-info').style.display = 'block';
                });
                group.addLayer(centerMarker);
            }
        });
        map.addLayer(group);
    }).on('error', function(e) {
        console.error("Failed to load: " + item.file, e);
    });
    
    group.addLayer(runLayer);
});
