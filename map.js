import { supabase } from "./supabase.js";

const map = L.map("map").setView([35.681236, 139.767125], 13);

L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  { attribution: "© OpenStreetMap" }
).addTo(map);

async function loadPosts() {
  const { data, error } = await supabase.from("posts").select("*");
  if (error) return;

  data.forEach(p => {
    L.marker([p.lat, p.lng])
      .addTo(map)
      .bindPopup(`<b>${p.user_name}</b><br>${p.comment}`);
  });
}

loadPosts();
