// timeline.js
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

  timeline.innerHTML = "";

  data.forEach(p => {
    const div = document.createElement("div");
    div.className = "post-item";
    div.innerHTML = `
      <h3>${p.title ?? "無題"}</h3>
      <p>${p.comment ?? ""}</p>
      <button data-id="${p.id}">
        ❤️ <span>${p.likes ?? 0}</span>
      </button>
    `;

    div.querySelector("button").onclick = async () => {
      await supabase
        .from("posts")
        .update({ likes: (p.likes ?? 0) + 1 })
        .eq("id", p.id);
    };

    timeline.appendChild(div);
  });
}

loadTimeline();

/* Realtime */
supabase
  .channel("posts-timeline")
  .on(
    "postgres_changes",
    { event: "UPDATE", schema: "public", table: "posts" },
    payload => {
      const p = payload.new;
      document
        .querySelectorAll(`[data-id="${p.id}"] span`)
        .forEach(el => el.innerText = p.likes ?? 0);
    }
  )
  .subscribe();
