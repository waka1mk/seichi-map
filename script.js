// ログイン処理
const loginBtn = document.getElementById("loginBtn");
loginBtn.addEventListener("click", () => {
  const name = document.getElementById("usernameInput").value.trim();
  if (name) {
    localStorage.setItem("username", name);
    document.getElementById("loginScreen").classList.remove("active");
    document.getElementById("userInfo").innerText = `👤 ${name}`;
  }
});

// Leafletマップ初期化
const map = L.map('map').setView([33.5597, 133.5311], 8);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 投稿を読み込み
fetch("posts.json")
  .then(res => res.json())
  .then(posts => {
    posts.forEach(p => {
      const marker = L.marker([p.lat, p.lng]).addTo(map);
      marker.bindPopup(`<b>${p.title}</b><br>${p.content}`);
    });
  });

// サイドパネル切替
const timelinePanel = document.getElementById("timelinePanel");
document.getElementById("timelineBtn").addEventListener("click", () => {
  timelinePanel.classList.toggle("active");
});

// 投稿フォーム開閉
document.getElementById("fab").addEventListener("click", () => {
  document.getElementById("postModal").classList.add("active");
});
document.getElementById("closePostModal").addEventListener("click", () => {
  document.getElementById("postModal").classList.remove("active");
});
