const container = document.getElementById("timeline");

async function loadTimeline() {
  container.innerHTML = "";
  const posts = await supabase.from("posts").select();

  posts.reverse().forEach((p) => {
    const div = document.createElement("div");
    div.className = "post";

    const likeBtn = document.createElement("button");
    likeBtn.textContent = `❤️ ${p.likes || 0}`;

    likeBtn.onclick = async () => {
      const newLikes = (p.likes || 0) + 1;

      await fetch(
        `${SUPABASE_URL}/rest/v1/posts?id=eq.${p.id}`,
        {
          method: "PATCH",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ likes: newLikes }),
        }
      );

      likeBtn.textContent = `❤️ ${newLikes}`;
      p.likes = newLikes;
    };

    div.innerHTML = `
      <p><b>${p.user_name}</b></p>
      <p>${p.comment}</p>
    `;
    div.appendChild(likeBtn);
    container.appendChild(div);
  });
}

loadTimeline();
