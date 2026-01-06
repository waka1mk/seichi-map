const userName = localStorage.getItem("user_name");
const list = document.getElementById("my-posts");
const title = document.getElementById("mypage-username");

/* 🛡 DOM保険：無かったら即終了 */
if (!list || !title) {
  console.warn("mypage DOM not ready");
  return;
}

/* ログインしてなかったら戻す */
if (!userName) {
  location.href = "login.html";
}

title.innerText = userName;

async function loadMyPosts() {
  const { data, error } = await window.supabase
    .from("posts")
    .select("*")
    .eq("user_name", userName)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    list.innerHTML = "<p>読み込みに失敗しました</p>";
    return;
  }

  if (!data || data.length === 0) {
    list.innerHTML = "<p>まだ巡礼の記録がありません</p>";
    return;
  }

  list.innerHTML = "";

  data.forEach(post => {
    const div = document.createElement("div");
    div.className = "post-card";
    div.innerHTML = `
      <div class="place">📍 聖地</div>
      <div class="content">${post.content}</div>
      <div class="meta">
        <span>${new Date(post.created_at).toLocaleDateString()}</span>
        <button onclick="location.href='index.html?lat=${post.lat}&lng=${post.lng}'">
          地図で見る
        </button>
      </div>
    `;
    list.appendChild(div);
  });
}

loadMyPosts();
