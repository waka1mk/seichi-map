// --- posts の読み込み ---
function loadPostsToMap(){
  let posts = JSON.parse(localStorage.getItem("posts") || "[]");
  if(!window.markersLayer) return;
  window.markersLayer.clearLayers();

  posts.forEach(post=>{
    if(post.lat && post.lng){
      const marker = L.marker([post.lat, post.lng]).addTo(window.markersLayer);
      marker.bindPopup(`<b>${post.title}</b><br>${post.comment || ""}`);
    }
  });
}

// --- Map 初期化 ---
function initMap(){
  if(window.map) return;
  window.map = L.map('map').setView([33.6,133.5], 8);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom:19
  }).addTo(window.map);

  window.markersLayer = L.layerGroup().addTo(window.map);
  loadPostsToMap();
  setTimeout(()=>window.map.invalidateSize(),200);
}

document.addEventListener('DOMContentLoaded', ()=>{
  initMap();
});

// 戻り時に再描画（bfcache対策）
window.addEventListener("pageshow",(e)=>{
  setTimeout(()=>{
    if(window.map) window.map.invalidateSize();
    else initMap();
  },120);
});
