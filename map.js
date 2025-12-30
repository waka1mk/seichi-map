const map = L.map("map").setView([34.3, 134.0], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

async function loadPosts() {
  const { data } = await supabase.from("posts").select("*");

  data.forEach(post => {
    L.marker([post.lat, post.lng])
      .addTo(map)
      .bindPopup(`<b>${post.title}</b><br>${post.content}`);
  });
}

loadPosts();
