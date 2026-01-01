const SUPABASE_URL = "あなたのURL";
const SUPABASE_ANON_KEY = "あなたのANON_KEY";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

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
    L.marker([post.lat, post.lng])
      .addTo(map)
      .bindPopup(`<b>${post.title}</b><br>${post.comment}`);
  });
}

loadPosts();
