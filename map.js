import { supabase } from "./utils.js";
import L from "https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js";

// === 四国固定 ===
const map = L.map("map").setView([33.8, 133.5], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap",
}).addTo(map);

// ===== 作品別カラー =====
const COLORS = ["#4CAF50", "#2196F3", "#FF9800", "#9C27B0", "#F44336"];
const workColorMap = {};

function getColor(title) {
  if (!workColorMap[title]) {
    const i = Object.keys(workColorMap).length % COLORS.length;
    workColorMap[title] = COLORS[i];
  }
  return workColorMap[title];
}

function pinIcon(color) {
  return L.divIcon({
    className: "work-pin",
    html: `<div style="
      width:14px;height:14px;
      background:${color};
      border-radius:50%;
      border:2px solid #fff;"></div>`,
    iconSize: [18, 18],
  });
}

// ===== ピン追加（即反映対応）=====
window.addPostMarker = (lat, lng, title, comment) => {
  const color = getColor(title);
  const marker = L.marker([lat, lng], { icon: pinIcon(color) })
    .addTo(map)
    .bindPopup(`
      <b>${title}</b><br>
      ${comment}<br><br>
      <button onclick="jumpToSameWork('${title}')">
        この作品の別の聖地はこちら！
      </button>
    `);

  map.setView([lat, lng], 16);
  marker.openPopup();
};

// ===== 既存投稿読み込み =====
async function loadPosts() {
  const { data, error } = await supabase.from("posts").select("*");

  if (error) {
    console.error(error);
    return;
  }

  data.forEach(p => {
    if (!p.lat || !p.lng) return;
    window.addPostMarker(p.lat, p.lng, p.title, p.comment);
  });
}
loadPosts();

// ===== 同一作品ジャンプ =====
window.jumpToSameWork = async (title) => {
  const { data } = await supabase
    .from("posts")
    .select("lat, lng")
    .eq("title", title);

  if (!data || !data.length) return;

  const bounds = L.latLngBounds(data.map(p => [p.lat, p.lng]));
  map.fitBounds(bounds, { padding: [40, 40] });
};
