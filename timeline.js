async function loadTimeline() {
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  const list = document.getElementById("list");

  data.forEach(p => {
    const div = document.createElement("div");
    div.textContent = `${p.user_name}: ${p.title}`;
    list.appendChild(div);
  });
}

loadTimeline();
