// map.js

// ===== 地図初期化 =====
const map = L.map("map").setView([35.681236, 139.767125], 12); // 東京駅あたり

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// ===== 投稿を地図に表示 =====
async function loadPostsOnMap() {
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, comment, lat, lng, likes");

  if (error) {
    console.error("posts取得エラー:", error);
    return;
  }

  data.forEach((post, index) => {
    // 🔍 デバッグ用（最初の1件だけ）
    if (index === 0) {
      console.log("map.js post確認:", post);
    }

    // lat / lng がある投稿だけピン表示
    if (post.lat && post.lng) {
      L.marker([post.lat, post.lng])
        .addTo(map)
        .bindPopup(`
          <strong>${post.title ?? "タイトルなし"}</strong><br>
          ${post.comment ?? ""}<br>
          ❤️ ${post.likes ?? 0}
        `);
    }
  });
}

loadPostsOnMap();
