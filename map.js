// === 地図初期化（四国固定・見やすい）===
const map = L.map("map").setView([33.8, 133.5], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap",
  maxZoom: 18,
  minZoom: 6,
}).addTo(map);

// === 仮投稿（デモ用）===
const demoPosts = [
  {
    title: "アニメA 第1話の神社",
    latitude: 34.3401,
    longitude: 134.0433,
    place: "香川",
  },
  {
    title: "ゲームB 聖地の橋",
    latitude: 33.8416,
    longitude: 132.7657,
    place: "愛媛",
  },
];

demoPosts.forEach(post => {
  L.marker([post.latitude, post.longitude])
    .addTo(map)
    .bindPopup(`
      <strong>${post.title}</strong><br>
      ${post.place}
    `);
});
