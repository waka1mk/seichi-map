// map.js
const map = L.map("map").setView([35.681236, 139.767125], 6);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

const markers = new Map();

async function loadPostsOnMap() {
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, comment, lat, lng, likes");

  if (error) {
    console.error(error);
    return;
  }

  console.log(data[0]); // ← 1回だけ確認

  data.forEach(post => {
    if (!post.lat || !post.lng) return;

    if (markers.has(post.id)) return;

    const marker = L.marker([post.lat, post.lng]).addTo(map);
    marker.bindPopup(`
      <strong>${post.title ?? "無題"}</strong><br>
      ${post.comment ?? ""}<br>
      ❤️ <span id="like-${post.id}">${post.likes ?? 0}</span>
    `);

    markers.set(post.id, marker);
  });
}

loadPostsOnMap();

/* Realtime：新規投稿・いいね反映 */
supabase
  .channel("posts-map")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "posts" },
    payload => {
      loadPostsOnMap();
      const p = payload.new;
      const el = document.getElementById(`like-${p.id}`);
      if (el) el.innerText = p.likes ?? 0;
    }
  )
  .subscribe();
