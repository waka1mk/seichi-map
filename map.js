document.addEventListener("DOMContentLoaded", () => {
  // =============================
  // ① Map 初期化
  // =============================
  const mapEl = document.getElementById("map");
  if (!mapEl) return;

  const map = L.map("map").setView([35.681236, 139.767125], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  const sheet = document.getElementById("post-sheet");

  // =============================
  // ② 投稿一覧を地図に表示
  // =============================
  loadPosts();

  async function loadPosts() {
    const { data, error } = await window.supabaseClient
      .from("posts")
      .select("*");

    if (error) {
      console.error(error);
      return;
    }

    data.forEach(post => {
      if (post.lat == null || post.lng == null) return;

      const marker = L.marker([post.lat, post.lng]).addTo(map);

      marker.on("click", () => {
        openPostSheet(post);
      });
    });
  }

  // =============================
  // ③ 投稿シート表示
  // =============================
  function openPostSheet(post) {
    if (!sheet) return;

    const content =
      post.comment ||
      post.content ||
      "（内容なし）";

    sheet.classList.remove("hidden");
    sheet.innerHTML = `
      <div class="card">
        <p>${content}</p>
        <button id="like-btn">❤️ ${post.likes ?? 0}</button>
      </div>
    `;

    const likeBtn = document.getElementById("like-btn");
    likeBtn.addEventListener("click", () => {
      likePost(post.id, post.likes ?? 0);
    });
  }

  // =============================
  // ④ いいね処理
  // =============================
  async function likePost(id, likes) {
    const { error } = await window.supabaseClient
      .from("posts")
      .update({ likes: likes + 1 })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    // シートを一度閉じて再読み込み
    sheet.classList.add("hidden");
    sheet.innerHTML = "";
    map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });
    loadPosts();
  }

  // =============================
  // ⑤ 地図クリック → 投稿画面へ
  // =============================
  map.on("click", e => {
    sessionStorage.setItem("postLat", e.latlng.lat);
    sessionStorage.setItem("postLng", e.latlng.lng);
    location.href = "post.html";
  });
});
