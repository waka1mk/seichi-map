import { supabase } from "./utils.js";

// 地図初期化
const map = L.map("map").setView([35.681236, 139.767125], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

// 投稿取得してピン表示
async function loadPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("*");

  if (error) {
    console.error(error);
    return;
  }

  data.forEach(post => {
    if (!post.lat || !post.lng) return;

    L.marker([post.lat, post.lng])
      .addTo(map)
      .bindPopup(`
        <strong>${post.title}</strong><br>
        ${post.comment}
      `);
  });
}

loadPosts();

// モーダル制御
const fab = document.getElementById("fab");
const modal = document.getElementById("postModal");
const cancel = document.getElementById("cancel");

fab.onclick = () => modal.classList.remove("hidden");
cancel.onclick = () => modal.classList.add("hidden");
