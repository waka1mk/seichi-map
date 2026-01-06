document.addEventListener("DOMContentLoaded", () => {
  const userName = localStorage.getItem("user_name");
  const list = document.getElementById("my-posts");
  const title = document.getElementById("mypage-username");

  if (!list || !title) {
    console.warn("mypage DOM not found");
    return;
  }

  if (!userName) {
    title.innerText = "ログインしてください";
    return;
  }

  title.innerText = userName;

  window.supabase
    .from("posts")
    .select("*")
    .eq("user_name", userName)
    .order("created_at", { ascending: false })
    .then(({ data, error }) => {
      if (error) {
        list.innerHTML = "<p>読み込みエラー</p>";
        return;
      }

      if (!data || data.length === 0) {
        list.innerHTML = "<p>まだ巡礼記録がありません</p>";
        return;
      }

      list.innerHTML = "";

      data.forEach(post => {
        const div = document.createElement("div");
        div.className = "post-card";
        div.innerHTML = `
          <p>${post.content}</p>
          <small>${new Date(post.created_at).toLocaleString()}</small>
        `;
        list.appendChild(div);
      });
    });
});
