const container = document.getElementById("timeline");

async function loadTimeline() {
  const posts = await supabase.from("posts").select();
  container.innerHTML = "";

  posts.reverse().forEach((p) => {
    const div = document.createElement("div");
    div.className = "post";

    const likeBtn = document.createElement("button");
    likeBtn.textContent = `❤️ ${p.likes || 0}`;

    likeBtn.onclick = async () => {
      const newLikes = (p.likes || 0) + 1;
      await supabase.from("posts").update(p.id, { likes: newLikes });
      p.likes = newLikes;
      likeBtn.textContent = `❤️ ${newLikes}`;
    };

    div.innerHTML = `
      <p><b>${p.user_name}</b></p>
      <p>${p.content}</p>
      ${p.image_url ? `<img src="${p.image_url}" style="width:100%">` : ""}
    `;

    div.appendChild(likeBtn);
    container.appendChild(div);
  });
}

loadTimeline();
