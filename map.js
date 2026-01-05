window.addEventListener("DOMContentLoaded", () => {
  const postSheet = document.getElementById("post-sheet");
  if (!postSheet) return;

  const map = L.map("map").setView([35.68, 139.76], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap"
  }).addTo(map);

  async function loadPostsOnMap() {
    const { data, error } = await window.supabase
      .from("posts")
      .select("*");

    if (error) {
      console.error(error);
      return;
    }

    data.forEach(p => {
      const marker = L.marker([p.lat, p.lng]).addTo(map);
      marker.on("click", () => openPostSheet(p));
    });
  }

  function openPostSheet(post) {
    postSheet.innerHTML = `
      <div class="sheet-inner post-card">
        <p>${post.comment}</p>
        <button class="like-btn" data-id="${post.id}">
          ❤️ <span>${post.likes ?? 0}</span>
        </button>
      </div>
    `;
    postSheet.classList.add("open");

    const btn = postSheet.querySelector(".like-btn");
    btn.addEventListener("click", async () => {
      const span = btn.querySelector("span");
      const next = Number(span.innerText) + 1;
      span.innerText = next;
      span.classList.add("jump");

      await window.supabase
        .from("posts")
        .update({ likes: next })
        .eq("id", post.id);
    });
  }

  loadPostsOnMap();
});
