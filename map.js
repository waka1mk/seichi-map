const map = L.map("map").setView([33.5, 133.5], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

async function loadPosts() {
  const { data, error } = await window.supabaseClient
    .from("posts")
    .select("*");

  if (error) {
    console.error(error);
    return;
  }

  data.forEach(post => {
    if (!post.lat || !post.lng || !post.title) return;

    const marker = L.marker([post.lat, post.lng]).addTo(map);
    marker.bindPopup(`
      <strong>${post.title}</strong><br>
      ${post.comment ?? ""}
      <br>
      <a href="./place.html?title=${encodeURIComponent(post.title)}">
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
