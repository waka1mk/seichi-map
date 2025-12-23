// =====================
// Supabase（自分の値）
/* ===================== */
const SUPABASE_URL = "あなたのURL";
const SUPABASE_ANON_KEY = "あなたのANON_KEY";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// =====================
// Map（四国固定）
/* ===================== */
const map = L.map("map").setView([33.7, 133.5], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap",
}).addTo(map);

// =====================
// 投稿読み込み
/* ===================== */
async function loadPosts() {
  const { data, error } = await supabaseClient
    .from("posts")
    .select("*");

  if (error) {
    console.error("投稿取得エラー", error);
    return;
  }

  data.forEach(post => {
    if (!post.latitude || !post.longitude) return;

    L.marker([post.latitude, post.longitude])
      .addTo(map)
      .bindPopup(`
        <strong>${post.title}</strong><br>
        ${post.place || ""}
      `);
  });
}

loadPosts();
