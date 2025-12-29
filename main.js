// 地図（四国固定・見やすい）
const map = L.map("map").setView([33.8, 133.5], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap",
}).addTo(map);

// ダミーピン
const demoPosts = [
  [34.34, 134.04, "香川：うどん聖地"],
  [33.84, 132.77, "愛媛：アニメ舞台"],
  [34.07, 134.55, "徳島：ロケ地"],
  [33.56, 133.53, "高知：巡礼地"],
];

demoPosts.forEach(p => {
  L.marker([p[0], p[1]]).addTo(map).bindPopup(p[2]);
});

// FAB
const fab = document.getElementById("fab");
const menu = document.getElementById("fabMenu");

fab.onclick = () => menu.classList.toggle("hidden");

document.getElementById("openPost").onclick = () => {
  document.getElementById("postModal").classList.remove("hidden");
};
