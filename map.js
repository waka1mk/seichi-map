// 地図初期化（Leaflet はグローバル L）
const map = L.map("map").setView([35.681236, 139.767125], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

// モーダル制御
const fab = document.getElementById("fab");
const modal = document.getElementById("postModal");
const cancelBtn = document.getElementById("cancel");

fab.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

cancelBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// 背景クリックで閉じる
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});
