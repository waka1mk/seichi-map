(() => {
  const timeline = document.getElementById("timeline");
  if (!timeline) {
    console.warn("timeline element not found");
    return;
  }

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

      card.innerHTML = `
        <h3>${post.title ?? "（無題）"}</h3>
        <p>${post.comment ?? ""}</p>
        <button class="like-btn">❤️ ${post.likes}</button>
      `;

      card.querySelector(".like-btn").onclick = async () => {
        await window.supabaseClient
          .from("posts")
          .update({ likes: post.likes + 1 })
          .eq("id", post.id);
        loadTimeline();
      };

      timeline.appendChild(card);
    });
  }

  loadTimeline();
})();
