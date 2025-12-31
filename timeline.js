const container = document.getElementById("timeline");

async function loadTimeline() {
  const posts = await supabase.from("posts").select();

  posts.reverse().forEach((p) => {
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `
      <p><b>${p.user_name}</b></p>
      <p>${p.content}</p>
      <button>❤️ ${p.likes || 0}</button>
    `;
    container.appendChild(div);
  });
}

loadTimeline();
