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
      return;
    }

    timeline.innerHTML = "";

    data.forEach(post => {
      const div = document.createElement("div");
      div.className = "card";

      const content =
        post.content ||
        post.text ||
        post.body ||
        "（内容なし）";

      div.innerHTML = `
        <p>${content}</p>
        <button data-id="${post.id}">
          ❤️ ${post.likes ?? 0}
        </button>
      `;

      div.querySelector("button").addEventListener("click", () => {
        likePost(post.id, post.likes ?? 0);
      });

      timeline.appendChild(div);
    });
  }

  async function likePost(id, currentLikes) {
    const { error } = await window.supabaseClient
      .from("posts")
      .update({ likes: currentLikes + 1 })
      .eq("id", id);

    if (!error) loadTimeline();
  }
});
