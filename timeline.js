window.addEventListener("DOMContentLoaded", () => {
  const timeline = document.getElementById("timeline");
  if (!timeline) return;

  async function loadTimeline() {
    const { data, error } = await window.supabase
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
      div.className = "post-card";
      div.innerHTML = `
        <p>${p.comment}</p>
        <button class="like-btn" data-id="${p.id}">
          ❤️ <span>${p.likes ?? 0}</span>
        </button>
      `;
      timeline.appendChild(div);

      const btn = div.querySelector(".like-btn");
      btn.addEventListener("click", async () => {
        const span = btn.querySelector("span");
        const next = Number(span.innerText) + 1;
        span.innerText = next;
        span.classList.add("jump");

        await window.supabase
          .from("posts")
          .update({ likes: next })
          .eq("id", p.id);
      });
    });
  }

  loadTimeline();
});
