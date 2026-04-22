
let timerInterval;
let activeSite = { name: "", type: "" };
let layers = {};

// Work & Insp States
let workState = { startTime: null, accumulated: 0, hasBefore: false, hasAfter: false };
let inspState = { startTime: null, accumulated: 0, hasStart: false, hasEnd: false };

// Update Menu Clock
function updateClock() {
    const now = new Date();
    document.getElementById('menu-clock').innerText = now.toLocaleString('en-NZ', { dateStyle: 'medium', timeStyle: 'short' });
}
updateClock();
setInterval(updateClock, 1000);

const map = L.map('map', { zoomControl: false }).setView([-41.135, 174.84], 14);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Breadcrumb Trail
let trail = L.polyline([], {color: '#ff4757', weight: 4, dashArray: '10, 10', opacity: 0.7}).addTo(map);

// GPS Tracking
map.locate({setView: false, watch: true, enableHighAccuracy: true});
let userMarker = L.marker([0,0], { icon: L.divIcon({ className: 'van-icon', html: '🚐', iconSize: [40,40], iconAnchor: [20,20] }) }).addTo(map);

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
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
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

// Live Timer Logic
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

// Work Photo Handling
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

// Insp Photo Handling
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

// Pause & Submit Logic (Work)
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

// Pause & Submit Logic (Insp)
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

// KML Config with Specific Icons
const config = [
    { file: 'Assets Map- Alleyway sites.csv.kml', label: 'Alleyway', color: '#ff00ff', icon: '🛣️', isPath: true },
    { file: 'Wellington Electricity substation sites.kml', label: 'Substation', color: '#f1c40f', icon: '⚡' },
    { file: 'PCC Underpasses.kml', label: 'Underpass', color: '#e74c3c', icon: '🌉' },
    { file: 'Thompson Property Group & Unique Paint SItes.kml', label: 'Unique', color: '#9b59b6', icon: '💎' },
    { file: 'Traffic Light Box Sites.kml', label: 'Traffic', color: '#2ecc71', icon: '🚦' },
    { file: 'Community Buildings.kml', label: 'Community', color: '#3498db', icon: '🏠' },
    { file: 'PCC Mural Sites.kml', label: 'Mural', color: '#d35400', icon: '🖼️' },
    { file: 'Power Pole Area Sweeps.kml', label: 'Power Pole', color: '#000000', icon: '💈', isPath: true },
    { file: 'PCC Off-street Carparks.kml', label: 'Carpark', color: '#34495e', icon: '🚗' }
];

const container = document.getElementById('layer-container');

config.forEach(item => {
    const group = L.geoJson(null, {
        style: () => ({ color: item.color, weight: 8, opacity: 0.6 }),
        pointToLayer: (f, ll) => L.marker(ll, {
            icon: L.divIcon({
                className: 'm-icon',
                html: `<div style="background:${item.color}; width:32px; height:32px; display:flex; align-items:center; justify-content:center; border-radius:50%; border:2px solid #fff;">${item.icon}</div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16]
            })
        }),
        onEachFeature: (f, l) => {
            if (item.isPath && f.geometry.type === "LineString") {
                const coords = f.geometry.coordinates;
                const mid = [coords[Math.floor(coords.length/2)][1], coords[Math.floor(coords.length/2)][0]];
                L.marker(mid, {
                    icon: L.divIcon({
                        className: 'm-icon',
                        html: `<div style="background:${item.color}; width:28px; height:28px; display:flex; align-items:center; justify-content:center; border-radius:8px; border:2px solid #fff; font-size:14px;">${item.icon}</div>`,
                        iconSize: [28, 28]
                    })
                }).addTo(group).on('click', (e) => {
                    L.DomEvent.stopPropagation(e);
                    activeSite.name = f.properties.name || "Unknown Path";
                    activeSite.type = item.label;
                    document.getElementById('s-name').innerText = activeSite.name;
                    document.getElementById('s-type').innerText = activeSite.type;
                    document.getElementById('site-info').style.display = 'block';
                });
            }
            l.on('click', (e) => {
                L.DomEvent.stopPropagation(e);
                activeSite.name = f.properties.name || "Unknown Site";
                activeSite.type = item.label;
                document.getElementById('s-name').innerText = activeSite.name;
                document.getElementById('s-type').innerText = activeSite.type;
                document.getElementById('site-info').style.display = 'block';
            });
        }
    });
    
    omnivore.kml(item.file, null, group).addTo(map);
    layers[item.label] = group;

    // Build Layer List explicitly inside the load logic
    const div = document.createElement('div');
    div.className = 'layer-item';
    div.innerHTML = `<input type="checkbox" checked onchange="toggleLayer('${item.label}', this.checked)"> <span style="font-size:16px; margin-right:5px;">${item.icon}</span> ${item.label}`;
    container.appendChild(div);
});
