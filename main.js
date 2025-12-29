// 地図初期化
window.map = L.map("map").setView([33.8, 133.5], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap",
}).addTo(map);

// FAB を最前面に
const fab = document.getElementById("fab");
fab.style.zIndex = 1000;

// モーダル制御
const modal = document.getElementById("postModal");
document.getElementById("cancel").onclick = () => modal.classList.add("hidden");
fab.onclick = () => modal.classList.remove("hidden");

// 試遊用ダミーデータ
const demoPosts = [
  [34.34, 134.04, "香川の聖地"],
  [33.84, 132.77, "愛媛の舞台"],
  [34.07, 134.55, "徳島ロケ地"],
  [33.56, 133.53, "高知の巡礼地"],
];

demoPosts.forEach(p => {
  L.marker([p[0], p[1]]).addTo(map).bindPopup(p[2]);
});
