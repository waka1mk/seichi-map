// map.js
import { supabase } from "./utils.js";

const map = L.map("map").setView([33.8, 133.5], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap",
}).addTo(map);

// 県別色
const colorByPref = {
  香川: "green",
  愛媛: "blue",
  徳島: "orange",
  高知: "red",
};

function pinIcon(color) {
  return L.divIcon({
    className: "custom-pin",
    html: `<div style="background:${color}"></div>`,
    iconSize: [16, 16],
  });
}

async function loadPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("*");

  if (error) {
    console.error(error);
    return;
  }

  data.forEach(post => {
    if (!post.latitude || !post.longitude) return;

    L.marker(
      [post.latitude, post.longitude],
      { icon: pinIcon(colorByPref[post.prefecture] || "gray") }
    )
      .addTo(map)
      .bindPopup(`
        <strong>${post.title}</strong><br>
        ${post.place}<br>
        ${post.prefecture}
      `);
  });
}

loadPosts();

// ＋メニュー
const fab = document.getElementById("fab");
const menu = document.getElementById("fab-menu");
fab.onclick = () => menu.classList.toggle("hidden");
