const map = L.map("map").setView([33.6, 133.5], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap",
}).addTo(map);

async function loadPosts() {
  const posts = await supabase.from("posts").select();

  posts.forEach((post) => {
    L.marker([post.lat, post.lng])
      .addTo(map)
      .bindPopup(`<b>${post.user_name}</b><br>${post.content}`);
  });
}

loadPosts();
