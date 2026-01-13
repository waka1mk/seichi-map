const map = L.map("map").setView([35.681236, 139.767125], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

async function loadPosts() {
  const { data, error } = await window.supabaseClient
    .from("posts")
    .select("*");

  if (error || !data) return;

  data.forEach(post => {
    if (post.lat == null || post.lng == null) return;

    const title = post.title || "不明な場所";
    const content = post.content || "内容なし";

    const marker = L.marker([
      Number(post.lat),
      Number(post.lng)
    ]).addTo(map);

    marker.bindPopup(`
      <strong>${title}</strong><br>
      ${content}<br>
      <a href="./place.html?title=${encodeURIComponent(title)}">
        この場所を見る →
      </a>
    `);
  });
}

loadPosts();

map.on("click", e => {
  sessionStorage.setItem("postLat", e.latlng.lat);
  sessionStorage.setItem("postLng", e.latlng.lng);
  location.href = "./post.html";
});
