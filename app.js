let timerInterval;
let activeSite = { name: "" };
let workState = { start: null, hasBefore: false, hasAfter: false };
let inspState = { start: null, hasStart: false, hasEnd: false };

const map = L.map('map', { zoomControl: false }).setView([-41.135, 174.84], 14);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

function openSidebar() { document.getElementById('sidebar').classList.add('open'); }
function closeSidebar() { document.getElementById('sidebar').classList.remove('open'); }

function openOverlay(type) {
    document.getElementById(type + '-overlay').style.display = 'flex';
    document.querySelectorAll('.site-display').forEach(el => el.innerText = activeSite.name);
    document.getElementById('site-info').style.display = 'none';
}
function closeOverlay(type) { document.getElementById(type + '-overlay').style.display = 'none'; }

function startTimer(startTime) {
    const widget = document.getElementById('live-timer-widget');
    widget.style.display = 'block';
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const diff = Math.floor((new Date() - startTime) / 1000);
        const m = Math.floor(diff / 60);
        const s = diff % 60;
        widget.innerText = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    }, 1000);
}

function handleWorkPhoto(step) {
    document.getElementById('btn-' + step).classList.add('done');
    if(step === 'before') {
        workState.start = new Date();
        workState.hasBefore = true;
        document.getElementById('pause-work-btn').disabled = false;
        startTimer(workState.start);
    } else {
        workState.hasAfter = true;
        document.getElementById('submit-work-btn').disabled = false;
    }
}

function handleInspPhoto(step) {
    document.getElementById('btn-insp-' + step).classList.add('done');
    if(step === 'start') {
        inspState.start = new Date();
        inspState.hasStart = true;
        document.getElementById('pause-insp-btn').disabled = false;
        startTimer(inspState.start);
    } else {
        inspState.hasEnd = true;
        document.getElementById('submit-insp-btn').disabled = false;
    }
}

function handleDropdown(el) {
    if(el.value === "ADD_NEW") {
        const val = prompt("Enter new item:");
        if(val) {
            const opt = document.createElement("option");
            opt.value = val; opt.text = val;
            el.add(opt, el.options[el.options.length - 1]);
            el.value = val;
        }
    }
}

function updateExtraCount(type) {
    const input = document.getElementById('photo-' + type + '-extra');
    document.getElementById(type + '-extra-count').innerText = input.files.length + " extra photos added";
}

function submitWork() {
    alert("Work submitted for " + activeSite.name);
    location.reload();
}

function submitInsp() {
    alert("Inspection submitted for " + activeSite.name);
    location.reload();
}

// Map Loading
const sites = [{ file: 'Assets Map- Alleyway sites.csv.kml', color: '#ff00ff' }];
sites.forEach(s => {
    const group = L.geoJson(null, {
        pointToLayer: (f, ll) => L.circleMarker(ll, { radius: 8, color: s.color, fillOpacity: 0.8 }),
        onEachFeature: (f, l) => l.on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            activeSite.name = f.properties.name || "Unknown Site";
            document.getElementById('s-name').innerText = activeSite.name;
            document.getElementById('s-type').innerText = "Alleyway";
            document.getElementById('site-info').style.display = 'block';
        })
    });
    omnivore.kml(s.file, null, group).addTo(map);
});
