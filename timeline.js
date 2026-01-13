const timeline = document.getElementById("timeline");

async function loadTimeline() {
  const { data } = await window.supabaseClient
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  const groups = {};

  data.forEach(p => {
    if (!groups[p.title]) groups[p.title] = [];
    groups[p.title].push(p);
  });

  timeline.innerHTML = "";

  Object.keys(groups).forEach(title => {
    timeline.innerHTML += `
      <section class="card">
        <h2>${title}</h2>
        ${groups[title].map(p => `<p>${p.content}</p>`).join("")}
        <a href="./place.html?title=${encodeURIComponent(title)}">
          この場所を見る →
        </a>
      </section>
    `;
  });
}

loadTimeline();
