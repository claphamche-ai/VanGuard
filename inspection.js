let inspState = { startTime: null, accumulated: 0, hasStart: false, hasEnd: false };

function handleInspPhoto(step) {
    const now = new Date();
    document.getElementById('btn-insp-' + step).classList.add('done');
    document.getElementById('hint-insp-' + step).innerText = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    if (step === 'start') {
        inspState.startTime = now;
        inspState.hasStart = true;
        document.getElementById('pause-insp-btn').disabled = false;
        startLiveTimer(now, inspState.accumulated);
    } else {
        inspState.hasEnd = true;
        document.getElementById('submit-insp-btn').disabled = false;
    }
}

function pauseInsp() {
    const elapsed = new Date() - inspState.startTime;
    const pausedJob = { site: activeSiteData.name, type: 'INSPECTION', accumulated: inspState.accumulated + elapsed, desc: document.getElementById('insp-comments').value, pausedAt: new Date().toLocaleString() };
    let bank = JSON.parse(localStorage.getItem('tt_jobbank') || '[]');
    bank.unshift(pausedJob);
    localStorage.setItem('tt_jobbank', JSON.stringify(bank));
    stopLiveTimer();
    resetInspForm();
    closeOverlay('inspection');
}

function submitInspection() {
    const totalMs = (new Date() - inspState.startTime) + inspState.accumulated;
    const mins = Math.round(totalMs / 60000);
    const cond = document.querySelector('input[name="condition"]:checked').value;
    const extra = document.getElementById('photo-insp-extra').files.length;
    const body = `INSPECTION REPORT%0D%0ASite: ${activeSiteData.name}%0D%0ACondition: ${cond}%0D%0ADuration: ${mins} mins%0D%0AExtra Photos: ${extra}%0D%0AComments: ${document.getElementById('insp-comments').value}`;
    window.location.href = `mailto:tracktagstgs@gmail.com?subject=Inspection: ${activeSiteData.name}&body=${body}`;
    stopLiveTimer();
    resetInspForm();
    closeOverlay('inspection');
}

function resetInspForm() {
    inspState = { startTime: null, accumulated: 0, hasStart: false, hasEnd: false };
    document.getElementById('btn-insp-start').classList.remove('done');
    document.getElementById('btn-insp-end').classList.remove('done');
    document.getElementById('hint-insp-start').innerText = "Take photo to start.";
    document.getElementById('hint-insp-end').innerText = "(Walk length)";
    document.getElementById('insp-extra-count').innerText = "0 extra photos added";
    document.getElementById('insp-extra-count').style.color = "#888";
    document.getElementById('submit-insp-btn').disabled = true;
    document.getElementById('pause-insp-btn').disabled = true;
} 