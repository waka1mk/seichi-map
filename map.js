// ログインチェック
if (!localStorage.getItem("user_name")) {
  location.href = "login.html";
}

async function loadPostsOnMap() {
  const { data, error } = await window.supabaseClient
    .from("posts")
    .select("id, content, lat, lng, likes");

  if (error) {
    console.error(error);
    return;
  }

  console.log(data[0]); // ← 確認用（1回だけ）

  data.forEach(post => {
    if (!post.lat || !post.lng) return;

    const marker = L.marker([post.lat, post.lng]).addTo(map);

    marker.on("click", () => {
      showPostCard(post); // ← 下からカード出す想定
    });
  });
}

loadPostsOnMap();
