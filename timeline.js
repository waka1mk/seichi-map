const timeline = document.getElementById("timeline");

async function loadTimeline() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  data.forEach(post => {
    const div = document.createElement("div");
    div.className = "post-item";
    div.innerHTML = `<p>${post.content}</p>`;
    timeline.appendChild(div);
  });
}

loadTimeline();
