// ログイン処理
document.getElementById("loginBtn").addEventListener("click", () => {
  const name = document.getElementById("usernameInput").value.trim();
  if (name) {
    localStorage.setItem("username", name);
    document.getElementById("loginScreen").classList.remove("active");
    initMap();
  } else {
    alert("ユーザー名を入力してください");
  }
});

// 地図初期化
function initMap() {
  const map = L.map("map").setView([33.6, 133.6], 8);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  fetch("posts.json")
    .then(res => res.json())
    .then(posts => {
      posts.forEach(p => {
        const marker = L.marker([p.lat, p.lng]).addTo(map);
        marker.bindPopup(`<b>${p.title}</b><br>${p.work}<br>${p.comment}`);
      });
    });
}
