document.addEventListener("DOMContentLoaded", () => {
  const timeline = document.getElementById("timeline");
  if (!timeline) return;

  loadTimeline();

  async function loadTimeline() {
    const { data, error } = await window.supabaseClient
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      timeline.innerHTML = "読み込み失敗";
      return;
    }

    timeline.innerHTML = "";

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

      timeline.appendChild(div);
    });
  }

  async function likePost(id, likes) {
    const { error } = await window.supabaseClient
      .from("posts")
      .update({ likes: likes + 1 })
      .eq("id", id);

    if (!error) loadTimeline();
  }
});
