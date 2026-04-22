let inspState = { startTime: null, accumulated: 0, hasStart: false, hasEnd: false };
function handleInspPhoto(step) {
    const now = new Date();
    document.getElementById('btn-insp-' + step).classList.add('done');
    if (step === 'start') { inspState.startTime = now; inspState.hasStart = true; document.getElementById('pause-insp-btn').disabled = false; startLiveTimer(now, inspState.accumulated); }
    else { inspState.hasEnd = true; document.getElementById('submit-insp-btn').disabled = false; }
}
function pauseInsp() { stopLiveTimer(); closeOverlay('inspection'); }
function submitInspection() { stopLiveTimer(); closeOverlay('inspection'); } 