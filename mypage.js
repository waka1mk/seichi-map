document.addEventListener("DOMContentLoaded", () => {
  const box = document.getElementById("myposts");
  if (!box) return;

  loadMyPosts();

  async function loadMyPosts() {
    const { data, error } = await window.supabaseClient
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      box.innerHTML = "読み込み失敗";
      return;
    }

    box.innerHTML = "";

    data.forEach(post => {
      const content =
        post.comment ||
        post.content ||
        "（内容なし）";

      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <p>${content}</p>
        <button>❤️ ${post.likes ?? 0}</button>
      `;

      div.querySelector("button").addEventListener("click", () => {
        likePost(post.id, post.likes ?? 0);
      });

      box.appendChild(div);
    });
  }

  async function likePost(id, likes) {
    const { error } = await window.supabaseClient
      .from("posts")
      .update({ likes: likes + 1 })
      .eq("id", id);

    if (!error) loadMyPosts();
  }
});
