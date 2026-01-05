const map = L.map("map").setView([35.681236, 139.767125], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

async function loadPostsOnMap() {
  const { data, error } = await supabaseClient
    .from("posts")
    .select("id, content, lat, lng, likes");

  if (error) {
    console.error(error);
    return;
  }

  data.forEach(post => {
    if (post.lat == null || post.lng == null) return;

    const marker = L.marker([post.lat, post.lng]).addTo(map);
    marker.bindPopup(`
      <div>
        <p>${post.content}</p>
        <p>❤️ ${post.likes ?? 0}</p>
      </div>
    `);
  });
}

loadPostsOnMap();
