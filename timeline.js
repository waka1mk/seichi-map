const timeline = document.getElementById("timeline");
let currentOrder = "created_at";

async function loadTimeline() {
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order(currentOrder, { ascending: false });

  timeline.innerHTML = "";

  data.forEach(p => {
    const div = document.createElement("div");
    div.className = "post-card";
    div.innerHTML = `
      <h3>${p.title ?? "無題"}</h3>
      <p>${p.comment ?? ""}</p>
      <div class="actions">
        <button class="like-btn" data-id="${p.id}">
          ❤️ <span>${p.likes ?? 0}</span>
        </button>
        <button onclick="location.href='index.html?post=${p.id}'">🗺️ 地図</button>
      </div>
    `;

    div.querySelector(".like-btn").onclick = async () => {
      await supabase
        .from("posts")
        .update({ likes: (p.likes ?? 0) + 1 })
        .eq("id", p.id);
    };

    timeline.appendChild(div);
  });
}

document.getElementById("sort-latest").onclick = () => {
  currentOrder = "created_at";
  loadTimeline();
};

document.getElementById("sort-popular").onclick = () => {
  currentOrder = "likes";
  loadTimeline();
};

loadTimeline();
