async function loadTimeline() {
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("id", { ascending: false });

  const tl = document.getElementById("timeline");
  tl.innerHTML = "";

  data.forEach(p => {
    const div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
      <div class="content">${p.content}</div>
      <button class="like">❤️</button>
    `;

    div.querySelector(".like").onclick = e => {
      e.target.classList.toggle("liked");
    };

    tl.appendChild(div);
  });
}

loadTimeline();
