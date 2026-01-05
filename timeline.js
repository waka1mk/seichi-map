const timeline = document.getElementById("timeline");

async function loadTimeline() {
  const { data, error } = await supabaseClient
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  timeline.innerHTML = "";

  data.forEach(p => {
    const div = document.createElement("div");
    div.className = "post-item";

    div.innerHTML = `
      <p>${p.content}</p>
      <button>❤️ ${p.likes ?? 0}</button>
    `;

    div.querySelector("button").onclick = async () => {
      await supabaseClient
        .from("posts")
        .update({ likes: (p.likes ?? 0) + 1 })
        .eq("id", p.id);

      loadTimeline();
    };

    timeline.appendChild(div);
  });
}

loadTimeline();
