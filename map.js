// Supabase（自分用では実キーを入れる）
const SUPABASE_URL = "あなたのURL";
const SUPABASE_ANON_KEY = "あなたのanon key";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// === 四国固定 ===
const SHIKOKU_CENTER = [33.8, 133.5];
const map = L.map("map").setView(SHIKOKU_CENTER, 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap",
}).addTo(map);

// === 投稿取得＆ピン表示 ===
async function loadPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  data.forEach((post) => {
    if (!post.latitude || !post.longitude) return;

    L.marker([post.latitude, post.longitude])
      .addTo(map)
      .bindPopup(
        `<strong>${post.title}</strong><br>
         ${post.place}<br>
         投稿者：${post.username || "名無し"}`
      );
  });
}

loadPosts();

// === ＋メニュー制御（壊れない版）===
const fabMain = document.getElementById("fabMain");
const fabMenu = document.getElementById("fabMenu");

fabMain.addEventListener("click", () => {
  fabMenu.classList.toggle("hidden");
});

document.getElementById("goPost").onclick = () => {
  location.href = "post.html";
};
