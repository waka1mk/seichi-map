const container = document.getElementById("timeline");

async function loadTimeline() {
  const posts = await supabase.from("posts").select();
  posts.reverse().forEach(p => {
    const div = document.createElement("div");
    div.className = "post";

    const btn = document.createElement("button");
    btn.textContent = `❤️ ${p.likes}`;

    btn.onclick = async () => {
      const newLikes = p.likes + 1;
      await supabase.from("posts").update(p.id, { likes: newLikes });
      btn.textContent = `❤️ ${newLikes}`;
      p.likes = newLikes;
    };

    div.innerHTML = `<b>${p.user_name}</b><p>${p.comment}</p>`;
    div.appendChild(btn);
    container.appendChild(div);
  });
}

loadTimeline();
