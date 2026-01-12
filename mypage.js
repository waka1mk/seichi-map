document.addEventListener("DOMContentLoaded", () => {
  const box = document.getElementById("myposts");
  if (!box) return;

  loadMyPosts();

  async function loadMyPosts() {
    const { data } = await window.supabaseClient
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    box.innerHTML = "";

    data.forEach(post => {
      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <p>${post.content || "（内容なし）"}</p>
        <button data-id="${post.id}">
          ❤️ ${post.likes ?? 0}
        </button>
      `;

      div.querySelector("button").onclick = () =>
        likePost(post.id, post.likes ?? 0);

      box.appendChild(div);
    });
  }

  async function likePost(id, likes) {
    await window.supabaseClient
      .from("posts")
      .update({ likes: likes + 1 })
      .eq("id", id);

    loadMyPosts();
  }
});
