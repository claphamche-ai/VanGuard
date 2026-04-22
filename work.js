let workState = { startTime: null, accumulated: 0, hasBefore: false, hasAfter: false };

function handleWorkPhoto(step) {
    const now = new Date();
    document.getElementById('btn-' + step).classList.add('done');
    document.getElementById('time-' + step).innerText = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    if (step === 'before') {
        workState.startTime = now;
        workState.hasBefore = true;
        document.getElementById('pause-work-btn').disabled = false;
    } else {
        workState.hasAfter = true;
        const totalMs = (now - workState.startTime) + workState.accumulated;
        const totalMins = Math.round(totalMs / 60000);
        document.getElementById('timing-display').style.display = 'block';
        document.getElementById('time-calc').innerText = totalMins + " minutes";
        document.getElementById('submit-work-btn').disabled = false;
    }
}

function pauseJob() {
    const elapsed = new Date() - workState.startTime;
    const pausedJob = {
        site: activeSiteData.name,
        accumulated: workState.accumulated + elapsed,
        desc: document.getElementById('work-desc').value,
        mats: document.getElementById('work-materials').value,
        pausedAt: new Date().toLocaleString()
    };

    let bank = JSON.parse(localStorage.getItem('tt_jobbank') || '[]');
    bank.unshift(pausedJob);
    localStorage.setItem('tt_jobbank', JSON.stringify(bank));

    alert("Job Paused. Moved to Job Bank.");
    resetWorkForm();
    closeOverlay('work');
}

function resumeJob(index) {
    let bank = JSON.parse(localStorage.getItem('tt_jobbank') || '[]');
    const job = bank[index];
    
    activeSiteData.name = job.site;
    workState.startTime = new Date();
    workState.accumulated = job.accumulated;
    workState.hasBefore = true;

    document.getElementById('work-desc').value = job.desc;
    document.getElementById('work-materials').value = job.mats;
    document.getElementById('btn-before').classList.add('done');
    document.getElementById('time-before').innerText = "RESUMED";
    document.getElementById('pause-work-btn').disabled = false;

    bank.splice(index, 1);
    localStorage.setItem('tt_jobbank', JSON.stringify(bank));
    openOverlay('work');
}

function submitWorkLog() {
    const finalMins = Math.round(((new Date() - workState.startTime) + workState.accumulated) / 60000);
    const desc = document.getElementById('work-desc').value;
    
    const entry = { site: activeSiteData.name, duration: finalMins, date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString() };
    let history = JSON.parse(localStorage.getItem('tt_history') || '[]');
    history.unshift(entry);
    localStorage.setItem('tt_history', JSON.stringify(history.slice(0, 20)));

    window.location.href = `mailto:tracktagstgs@gmail.com?subject=Work Log: ${activeSiteData.name}&body=Site: ${activeSiteData.name}%0D%0AActive Time: ${finalMins} mins%0D%0ADesc: ${desc}`;
    
    resetWorkForm();
    closeOverlay('work');
}

function resetWorkForm() {
    workState = { startTime: null, accumulated: 0, hasBefore: false, hasAfter: false };
    document.getElementById('btn-before').classList.remove('done');
    document.getElementById('btn-after').classList.remove('done');
    document.getElementById('time-before').innerText = "(Required)";
    document.getElementById('time-after').innerText = "(Final Step)";
    document.getElementById('work-desc').value = "";
    document.getElementById('work-materials').value = "";
    document.getElementById('timing-display').style.display = 'none';
    document.getElementById('submit-work-btn').disabled = true;
    document.getElementById('pause-work-btn').disabled = true;
}

function renderJobBank() {
    const list = document.getElementById('job-bank-list');
    const data = JSON.parse(localStorage.getItem('tt_jobbank') || '[]');
    if (data.length === 0) { list.innerHTML = '<p style="text-align:center; color:#888;">Job Bank is empty.</p>'; return; }
    list.innerHTML = data.map((item, i) => `
        <div class="list-item paused" onclick="resumeJob(${i})">
            <div class="list-title">${item.site}</div>
            <div class="list-meta">Paused: ${item.pausedAt} | Active: ${Math.round(item.accumulated/60000)}m</div>
        </div>
    `).join('');
}

function renderHistory() {
    const list = document.getElementById('history-list');
    const data = JSON.parse(localStorage.getItem('tt_history') || '[]');
    if (data.length === 0) { list.innerHTML = '<p style="text-align:center; color:#888;">No history yet.</p>'; return; }
    list.innerHTML = data.map(item => `
        <div class="list-item">
            <div class="list-title">${item.site}</div>
            <div class="list-meta">${item.date} @ ${item.time} | Duration: ${item.duration} mins</div>
        </div>
    `).join('');
}

function clearHistory() { localStorage.removeItem('tt_history'); renderHistory(); }