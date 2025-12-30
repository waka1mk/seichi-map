import { supabase } from "./supabase.js";

export const map = L.map("map", {
  zoomControl: false,
  attributionControl: false
}).setView([35.681, 139.767], 13);

// シンプルで目に優しい地図
L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  { maxZoom: 18 }
).addTo(map);

// 投稿読み込み
export async function loadPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("*");

  if (error) return;

  data.forEach(post => {
    L.circleMarker([post.lat, post.lng], {
      radius: 8,
      color: "#4CAF50",
      fillOpacity: 0.8
    })
      .addTo(map)
      .bindPopup(post.title);
  });
}
