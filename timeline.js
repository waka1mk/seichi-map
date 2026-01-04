// timeline.js

const timeline = document.getElementById("timeline");

// ===== タイムライン読み込み =====
async function loadTimeline() {
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, comment, lat, lng, likes, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("timeline取得エラー:", error);
    return;
  }

  timeline.innerHTML = "";

  data.forEach((post, index) => {
    // 🔍 デバッグ用（最初の1件だけ）
    if (index === 0) {
      console.log("timeline.js post確認:", post);
    }

    const div = document.createElement("div");
    div.className = "post-item";

    div.innerHTML = `
      <h3>${post.title ?? "タイトルなし"}</h3>
      <p>${post.comment ?? ""}</p>
      <p>📍 ${post.lat && post.lng ? `${post.lat}, ${post.lng}` : "位置情報なし"}</p>
      <p>❤️ ${post.likes ?? 0}</p>
    `;

    timeline.appendChild(div);
  });
}

loadTimeline();
