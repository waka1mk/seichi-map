// map.js
import { supabase } from "./utils.js";

// === 四国固定 ===
const map = L.map("map").setView([33.8, 133.5], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap",
}).addTo(map);

// === 投稿読み込み ===
async function loadPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("*");

  if (error) {
    console.error(error);
    return;
  }

  data.forEach(p => {
    if (!p.latitude || !p.longitude) return;

    L.marker([p.latitude, p.longitude])
      .addTo(map)
      .bindPopup(`<strong>${p.title}</strong><br>${p.comment || ""}`);
  });
}

loadPosts();

// === ＋ボタン制御 ===
const fab = document.getElementById("fab");
const modal = document.getElementById("postModal");
const closeBtn = document.getElementById("closeModal");

fab.onclick = () => modal.classList.remove("hidden");
closeBtn.onclick = () => modal.classList.add("hidden");
