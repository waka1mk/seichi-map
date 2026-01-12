const timeline = document.getElementById("timeline");

async function loadTimeline() {
  const { data, error } = await window.supabaseClient
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    timeline.innerHTML = "読み込み失敗";
    return;
  }

  timeline.innerHTML = "";
  data.forEach(post => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <p>${post.content || "内容なし"}</p>
      <small>❤️ ${post.likes ?? 0}</small>
    `;
    timeline.appendChild(div);
  });
}

loadTimeline();
