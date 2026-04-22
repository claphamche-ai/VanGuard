let workState = { startTime: null, accumulated: 0, hasBefore: false, hasAfter: false };

function handleWorkPhoto(step) {
    const now = new Date();
    document.getElementById('btn-' + step).classList.add('done');
    document.getElementById('hint-' + step).innerText = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    if (step === 'before') {
        workState.startTime = now;
        workState.hasBefore = true;
        document.getElementById('pause-work-btn').disabled = false;
        startLiveTimer(now, workState.accumulated);
    } else {
        workState.hasAfter = true;
        document.getElementById('submit-work-btn').disabled = false;
    }
}

function pauseJob() {
    const elapsed = new Date() - workState.startTime;
    const pausedJob = { site: activeSiteData.name, type: 'WORK', accumulated: workState.accumulated + elapsed, desc: document.getElementById('work-desc').value, mats: document.getElementById('work-materials').value, pausedAt: new Date().toLocaleString() };
    let bank = JSON.parse(localStorage.getItem('tt_jobbank') || '[]');
    bank.unshift(pausedJob);
    localStorage.setItem('tt_jobbank', JSON.stringify(bank));
    stopLiveTimer();
    resetWorkForm();
    closeOverlay('work');
}

function submitWorkLog() {
    const totalMs = (new Date() - workState.startTime) + workState.accumulated;
    const mins = Math.round(totalMs / 60000);
    const extra = document.getElementById('photo-work-extra').files.length;
    const body = `WORK LOG%0D%0ASite: ${activeSiteData.name}%0D%0ADuration: ${mins} mins%0D%0AExtra Photos: ${extra}%0D%0ADesc: ${document.getElementById('work-desc').value}`;
    window.location.href = `mailto:tracktagstgs@gmail.com?subject=Work Log: ${activeSiteData.name}&body=${body}`;
    stopLiveTimer();
    resetWorkForm();
    closeOverlay('work');
}

function resetWorkForm() {
    workState = { startTime: null, accumulated: 0, hasBefore: false, hasAfter: false };
    document.getElementById('btn-before').classList.remove('done');
    document.getElementById('btn-after').classList.remove('done');
    document.getElementById('hint-before').innerText = "Take photo to start.";
    document.getElementById('hint-after').innerText = "(Complete work)";
    document.getElementById('work-extra-count').innerText = "0 extra photos added";
    document.getElementById('work-extra-count').style.color = "#888";
    document.getElementById('submit-work-btn').disabled = true;
    document.getElementById('pause-work-btn').disabled = true;
}

function renderJobBank() {
    const list = document.getElementById('job-bank-list');
    const data = JSON.parse(localStorage.getItem('tt_jobbank') || '[]');
    if (data.length === 0) { list.innerHTML = '<p style="text-align:center;">Empty</p>'; return; }
    list.innerHTML = data.map((item, i) => `<div class="list-item" style="background:#fff; margin:10px; padding:15px; border-radius:10px;" onclick="resumeAny(${i})"><b>${item.type}:</b> ${item.site}<br><small>Paused: ${item.pausedAt}</small></div>`).join('');
}

function resumeAny(index) {
    let bank = JSON.parse(localStorage.getItem('tt_jobbank') || '[]');
    const job = bank[index];
    activeSiteData.name = job.site;
    if (job.type === 'INSPECTION') {
        inspState.startTime = new Date(); inspState.accumulated = job.accumulated; inspState.hasStart = true;
        document.getElementById('insp-comments').value = job.desc;
        document.getElementById('btn-insp-start').classList.add('done');
        document.getElementById('hint-insp-start').innerText = "RESUMED";
        openOverlay('inspection');
        startLiveTimer(inspState.startTime, inspState.accumulated);
    } else {
        workState.startTime = new Date(); workState.accumulated = job.accumulated; workState.hasBefore = true;
        document.getElementById('work-desc').value = job.desc;
        document.getElementById('btn-before').classList.add('done');
        document.getElementById('hint-before').innerText = "RESUMED";
        openOverlay('work');
        startLiveTimer(workState.startTime, workState.accumulated);
    }
    bank.splice(index, 1);
    localStorage.setItem('tt_jobbank', JSON.stringify(bank));
} 