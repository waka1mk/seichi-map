// js/map.js

window.addEventListener("DOMContentLoaded", async () => {
  if (!window.supabase) {
    console.error("❌ Supabase が初期化されていません");
    return;
  }

  // =========================
  // 地図初期化（Leaflet想定）
  // =========================
  const map = L.map("map").setView([35.681236, 139.767125], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  // =========================
  // 投稿カード（下から出るUI）
  // =========================
  const sheet = document.getElementById("post-sheet");
  const sheetContent = document.getElementById("sheet-content");

  function openPostSheet(post) {
    if (!sheet || !sheetContent) return;

    sheetContent.innerHTML = `
      <div class="sheet-card">
        <p class="user">👤 ${post.user_name ?? "unknown"}</p>
        <p class="content">${post.content}</p>
        <p class="likes">❤️ ${post.likes ?? 0}</p>
      </div>
    `;

    sheet.classList.add("open");
  }

  function closePostSheet() {
    if (!sheet) return;
    sheet.classList.remove("open");
  }

  if (sheet) {
    sheet.addEventListener("click", closePostSheet);
  }

  // =========================
  // 投稿を取得してピン表示
  // =========================
  console.log("📡 投稿取得開始");

  const { data: posts, error } = await window.supabase
    .from("posts")
    .select("id, content, lat, lng, likes, user_name")
    .not("lat", "is", null)
    .not("lng", "is", null);

  if (error) {
    console.error("❌ 投稿取得エラー", error);
    return;
  }

  console.log("✅ 投稿取得成功:", posts.length);

  posts.forEach((post) => {
    if (!post.lat || !post.lng) return;

    const marker = L.marker([post.lat, post.lng]).addTo(map);

    marker.on("click", () => {
      console.log("📍 ピンクリック:", post.id);
      openPostSheet(post);
    });
  });

  console.log("🗺 マップ描画完了");
});
