const map = L.map("map").setView([35.681236, 139.767125], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

async function loadMapPosts() {
  const posts = await supabase.from("posts").select();

  posts.forEach((p) => {
    if (!p.lat || !p.lng) return;

    L.marker([p.lat, p.lng])
      .addTo(map)
      .bindPopup(`
        <b>${p.user_name}</b><br>
        ${p.content}<br>
        ${p.image_url ? `<img src="${p.image_url}" width="150">` : ""}
        <div>❤️ ${p.likes || 0}</div>
      `);
  });
}

loadMapPosts();
