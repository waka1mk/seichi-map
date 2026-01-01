const map = L.map("map").setView([35.681236, 139.767125], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

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
      .bindPopup(post.content);
  });
}

loadPosts();
