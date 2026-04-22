function updatePhotoCount(type) {
    const count = document.getElementById('insp-photo-upload').files.length;
    document.getElementById('insp-photo-status').innerText = count > 0 ? `✅ ${count} Photos Selected` : "📷 Tap to Add Photos";
}

function submitInspection() {
    const cond = document.querySelector('input[name="condition"]:checked').value;
    const comments = document.getElementById('insp-comments').value;
    const photos = document.getElementById('insp-photo-upload').files.length;

    const body = `INSPECTION REPORT%0D%0A-------------------%0D%0ASite: ${activeSiteData.name}%0D%0ACondition: ${cond}%0D%0AGPS: ${vanPos.lat}, ${vanPos.lng}%0D%0APhotos Selected: ${photos}%0D%0A%0D%0AComments: ${comments}`;
    
    window.location.href = `mailto:tracktagstgs@gmail.com?subject=Inspection: ${activeSiteData.name} [${cond}]&body=${body}`;
    alert("Inspection ready. Remember to attach photos in your email app.");
    closeOverlay('inspection');
}