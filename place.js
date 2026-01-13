(() => {
  const titleEl = document.getElementById("place-title");
  const postsEl = document.getElementById("place-posts");
  const mapEl = document.getElementById("place-map");

  const params = new URLSearchParams(location.search);
  const title = params.get("title");

  // 🔒 title がない場合は即終了（error出さない）
  if (!title) {
    titleEl.textContent = "場所が指定されていません";
    return;
  }

  titleEl.textContent = title;

  // Leaflet icon 404 対策
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });

  async function loadPlace() {
    const { data, error } = await window.supabaseClient
      .from("posts")
      .select("*")
      .eq("title", title)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      postsEl.innerHTML = "<p>投稿が見つかりません</p>";
      return;
    }

    // 🗺 地図生成（最初の投稿位置）
    const first = data[0];
    const map = L.map(mapEl).setView([first.lat, first.lng], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);

    data.forEach(post => {
      if (post.lat && post.lng) {
        L.marker([post.lat, post.lng]).addTo(map);
      }

      const comment =
        post.comment && post.comment.trim() !== ""
          ? post.comment
          : "（コメントはまだありません）";

      postsEl.innerHTML += `
        <div class="card">
          <p>${comment}</p>
          <span>❤️ ${post.likes ?? 0}</span>
        </div>
      `;
    });
  }

  loadPlace();
})();
