const timeline = document.getElementById("timeline");
if (!timeline) return;

async function loadTimeline() {
  const { data, error } = await window.supabaseClient
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return;

  timeline.innerHTML = "";
  data.forEach(p => {
    timeline.innerHTML += `
      <div class="card">
        <p>${p.content}</p>
        <span>❤️ ${p.likes}</span>
      </div>
    `;
  });
}

loadTimeline();
