(() => {
  const timeline = document.getElementById("timeline");
  if (!timeline) return;

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
      const card = document.createElement("div");
      card.className = "card";

      const title = post.title || "（場所名未設定）";
      const comment =
        post.comment && post.comment.trim() !== ""
          ? post.comment
          : "（コメントはまだありません）";

      card.innerHTML = `
        <h3>${title}</h3>
        <p>${comment}</p>
        <button>❤️ ${post.likes ?? 0}</button>
      `;

      const btn = card.querySelector("button");
      btn.onclick = async () => {
        await window.supabaseClient
          .from("posts")
          .update({ likes: (post.likes ?? 0) + 1 })
          .eq("id", post.id);
        loadTimeline();
      };

      timeline.appendChild(card);
    });
  }

  loadTimeline();
})();
