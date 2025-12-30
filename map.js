// map.js

// ===== 地図初期化 =====
const map = L.map("map", {
  zoomControl: false,
  attributionControl: false
}).setView([35.681, 139.767], 13);

// やさしい緑系タイル（前の雰囲気）
L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  { maxZoom: 18 }
).addTo(map);

// ピン管理用
const markers = [];

// ===== 投稿読み込み =====
async function loadPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  // 既存ピン削除
  markers.forEach(m => map.removeLayer(m));
  markers.length = 0;

  data.forEach(p => {
    const marker = L.circleMarker([p.lat, p.lng], {
      radius: 7,
      color: "#2e7d32",
      fillColor: "#66bb6a",
      fillOpacity: 0.85
    })
      .addTo(map)
      .bindPopup(`
        <b>${p.title}</b><br>
        ${p.comment || ""}<br>
        <small>${p.user_name || "demo"}</small>
      `);

    markers.push(marker);
  });
}

loadPosts();

// ===== ＋ボタン =====
const fab = document.getElementById("fab");
if (fab) {
  fab.onclick = () => {
    location.href = "post.html";
  };
}

// 投稿後戻ってきたとき用
window.addEventListener("focus", () => {
  loadPosts();
});
