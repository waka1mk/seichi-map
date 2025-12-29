import { supabase } from "./utils.js";

export const map = L.map("map").setView([35.681236, 139.767125], 13);

L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  { attribution: "© OpenStreetMap" }
).addTo(map);

// 既存投稿を表示
const loadPins = async () => {
  const { data } = await supabase.from("posts").select("*");
  data.forEach(p => {
    L.marker([p.lat, p.lng])
      .addTo(map)
      .bindPopup(`<b>${p.title}</b><br>${p.comment}`);
  });
};

loadPins();
