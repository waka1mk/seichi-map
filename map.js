console.log("map.js alive");

const map = L.map("map").setView([35.681236, 139.767125], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

async function loadPosts() {
  const { data, error } = await window.supabaseClient
    .from("posts")
    .select("*"); // ★ title で絞らない

  if (error || !data) {
    console.error(error);
    return;
  }

  data.forEach(post => {
    if (post.lat == null || post.lng == null) return;

    const title = post.title || "（場所名なし）";
    const content = post.content || "内容なし";

    const marker = L.marker([
      Number(post.lat),
      Number(post.lng)
    ]).addTo(map);

    marker.bindPopup(`
      <strong>${title}</strong><br>
      ${content}
    `);
  });
}

loadPosts();

map.on("click", e => {
  sessionStorage.setItem("postLat", e.latlng.lat);
  sessionStorage.setItem("postLng", e.latlng.lng);
  location.href = "./post.html";
});
