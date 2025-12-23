// =============================
// ① Supabase（実キーに差し替え）
// =============================
const SUPABASE_URL = "https://ncqfaerpznsopgbpiiso.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jcWZhZXJwem5zb3BnYnBpaXNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NDMwMzMsImV4cCI6MjA3OTAxOTAzM30.K3GOyrE3XVqJtF2fNXYgromkU93es8ag660nHO1Db1g";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// =============================
// ② 地図（四国固定）
// =============================
const SHIKOKU_CENTER = [33.8, 133.5];
const map = L.map("map").setView(SHIKOKU_CENTER, 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap",
}).addTo(map);

// =============================
// ③ 投稿読み込み & ピン表示
// =============================
async function loadPosts() {
  const { data, error } = await supabaseClient
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("投稿取得エラー", error);
    return;
  }

  console.log("取得した投稿", data);

  data.forEach((post) => {
    if (!post.latitude || !post.longitude) return;

    L.marker([post.latitude, post.longitude])
      .addTo(map)
      .bindPopup(`
        <strong>${post.title || "タイトルなし"}</strong><br>
        ${post.place || ""}<br>
        ${post.tag || ""}
      `);
  });
}

loadPosts();

// =============================
// ④ ＋ボタンUI（完全修正版）
// =============================
const plusBtn = document.getElementById("plus-btn");
const plusMenu = document.getElementById("plus-menu");
const closeMenu = document.getElementById("close-menu");
const goPost = document.getElementById("go-post");

plusBtn.addEventListener("click", () => {
  plusMenu.classList.toggle("hidden");
});

closeMenu.addEventListener("click", () => {
  plusMenu.classList.add("hidden");
});

goPost.addEventListener("click", () => {
  location.href = "post.html";
});
