
let timerInterval;
let activeSite = { name: "" };

const map = L.map('map', { zoomControl: false }).setView([-41.135, 174.84], 14);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// GPS Tracking
map.locate({setView: true, watch: true, enableHighAccuracy: true});
let userMarker = L.circleMarker([0,0], {radius: 10, color: 'blue', fillColor: '#3388ff', fillOpacity: 0.8}).addTo(map);
map.on('locationfound', e => { userMarker.setLatLng(e.latlng); });

function openSidebar() { document.getElementById('sidebar').classList.add('open'); }
function closeSidebar() { document.getElementById('sidebar').classList.remove('open'); }
function openOverlay(type) { 
    document.getElementById(type + '-overlay').style.display = 'flex'; 
    document.querySelectorAll('.site-display').forEach(el => el.innerText = activeSite.name);
}
function closeOverlay(type) { document.getElementById(type + '-overlay').style.display = 'none'; }

function handleWorkPhoto(step) {
    document.getElementById('btn-' + step).classList.add('done');
    if(step === 'before') {
        const start = new Date();
        document.getElementById('live-timer-widget').style.display = 'block';
        document.getElementById('pause-work-btn').disabled = false;
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            const diff = Math.floor((new Date() - start)/1000);
            const m = Math.floor(diff/60); const s = diff%60;
            document.getElementById('live-timer-widget').innerText = m.toString().padStart(2,'0') + ":" + s.toString().padStart(2,'0');
        }, 1000);
    } else { document.getElementById('submit-work-btn').disabled = false; }
}

function handleInspPhoto(step) {
    document.getElementById('btn-insp-' + step).classList.add('done');
    if(step === 'start') {
        const start = new Date();
        document.getElementById('live-timer-widget').style.display = 'block';
        document.getElementById('pause-insp-btn').disabled = false;
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            const diff = Math.floor((new Date() - start)/1000);
            document.getElementById('live-timer-widget').innerText = Math.floor(diff/60).toString().padStart(2,'0') + ":" + (diff%60).toString().padStart(2,'0');
        }, 1000);
    } else { document.getElementById('submit-insp-btn').disabled = false; }
}

function handleDropdown(el) {
    if(el.value === "ADD_NEW") {
        const val = prompt("Enter new type:");
        if(val) {
            const opt = document.createElement("option"); opt.text = val; opt.value = val;
            el.add(opt, el.options[el.options.length-1]); el.value = val;
        }
    }
}

function updateExtraCount(type) {
    const input = document.getElementById('photo-'+type+'-extra');
    document.getElementById(type+'-extra-count').innerText = input.files.length + " extra photos";
}

const config = [
    { file: 'Assets Map- Alleyway sites.csv.kml', label: 'Alleyway', color: '#ff00ff' },
    { file: 'Wellington Electricity substation sites.kml', label: 'Substation', color: '#f1c40f' },
    { file: 'PCC Underpasses.kml', label: 'Underpass', color: '#e74c3c' },
    { file: 'Thompson Property Group & Unique Paint SItes.kml', label: 'Unique', color: '#9b59b6' },
    { file: 'Traffic Light Box Sites.kml', label: 'Traffic', color: '#2ecc71' },
    { file: 'Community Buildings.kml', label: 'Community', color: '#3498db' },
    { file: 'PCC Mural Sites.kml', label: 'Mural', color: '#d35400' },
    { file: 'Power Pole Area Sweeps.kml', label: 'Power Pole', color: '#000' },
    { file: 'PCC Off-street Carparks.kml', label: 'Carpark', color: '#34495e' }
];

config.forEach(item => {
    const group = L.geoJson(null, {
        pointToLayer: (f, ll) => L.marker(ll, {
            icon: L.divIcon({
                className: 'm-icon',
                html: `<div style="background:${item.color}; width:20px; height:20px;"></div>`,
                iconSize: [20, 20]
            })
        }),
        onEachFeature: (f, l) => l.on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            activeSite.name = f.properties.name || "Unknown";
            document.getElementById('s-name').innerText = activeSite.name;
            document.getElementById('site-info').style.display = 'block';
        })
    });
    omnivore.kml(item.file, null, group).addTo(map);
});
