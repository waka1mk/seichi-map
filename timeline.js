const timeline = document.getElementById("timeline");

async function loadTimeline() {
  const { data } = await window.supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  timeline.innerHTML = "";

  data.forEach(post => {
    const card = document.createElement("div");
    card.className = "post-card";

    card.innerHTML = `
      <p>${post.comment ?? ""}</p>
      <button class="like-btn">❤️ <span>${post.likes ?? 0}</span></button>
    `;

    const btn = card.querySelector(".like-btn");
    const span = btn.querySelector("span");

    btn.onclick = async () => {
      const newLikes = (post.likes ?? 0) + 1;
      await window.supabase
        .from("posts")
        .update({ likes: newLikes })
        .eq("id", post.id);

      post.likes = newLikes;
      span.innerText = newLikes;
      btn.classList.add("jump");
      setTimeout(() => btn.classList.remove("jump"), 300);
    };

    timeline.appendChild(card);
  });
}

loadTimeline();
