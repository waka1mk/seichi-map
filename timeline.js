const timeline = document.getElementById("timeline");
if (!timeline) return;

async function loadTimeline() {
  const { data, error } = await window.supabaseClient
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    timeline.innerHTML = "<p>読み込みに失敗しました</p>";
    return;
  }

  timeline.innerHTML = "";

  data?.forEach(p => {
    timeline.innerHTML += `
      <div class="card">
        <p>${p.content || "内容なし"}</p>
        <span>❤️ ${p.likes ?? 0}</span>
      </div>
    `;
  });
}

loadTimeline();
