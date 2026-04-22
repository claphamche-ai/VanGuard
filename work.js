let workState = { startTime: null, accumulated: 0, hasBefore: false, hasAfter: false };
function handleWorkPhoto(step) {
    const now = new Date();
    document.getElementById('btn-' + step).classList.add('done');
    if (step === 'before') { workState.startTime = now; workState.hasBefore = true; document.getElementById('pause-work-btn').disabled = false; startLiveTimer(now, workState.accumulated); }
    else { workState.hasAfter = true; document.getElementById('submit-work-btn').disabled = false; }
}
function pauseJob() { stopLiveTimer(); closeOverlay('work'); }
function submitWorkLog() {
    const medium = document.getElementById('work-medium').value;
    const surface = document.getElementById('work-surface').value;
    const prop = document.getElementById('work-property').value;
    if(!medium || !surface || !prop) { alert("Please complete all selections."); return; }
    
    const body = `WORK LOG%0D%0ASite: ${activeSiteData.name}%0D%0AMedium: ${medium}%0D%0ASurface: ${surface}%0D%0AProperty: ${prop}`;
    window.location.href = `mailto:tracktagstgs@gmail.com?subject=Work Log: ${activeSiteData.name}&body=${body}`;
    stopLiveTimer();
    closeOverlay('work');
}
function renderJobBank() { document.getElementById('job-bank-list').innerHTML = "Job Bank Active"; } 