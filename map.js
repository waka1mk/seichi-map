const map = L.map("map").setView([35.6812, 139.7671], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

const modal = document.getElementById("post-modal");
const modalBody = document.getElementById("modal-body");
document.getElementById("modal-close").onclick = () => modal.classList.add("hidden");

async function loadPostsOnMap() {
  const { data } = await supabase.from("posts").select("*");

  data.forEach(post => {
    if (!post.lat || !post.lng) return;

    const marker = L.circleMarker(
      [post.lat, post.lng],
      { radius:8, color:"#4caf50", fillOpacity:.8 }
    ).addTo(map);

    marker.on("click", () => {
      modalBody.innerHTML = `
        <p>${post.content}</p>
        <button class="like-btn" data-post-id="${post.id}">
          ❤️ <span class="like-count">0</span>
        </button>
        <span class="category-tag category-${post.category}">
          ${post.category}
        </span>
      `;

      modal.classList.remove("hidden");

      const btn = modalBody.querySelector(".like-btn");
      const countEl = btn.querySelector(".like-count");

      loadLikeCount(post.id, countEl);
      btn.onclick = () => toggleLike(post.id, btn, countEl);
    });
  });
}

loadPostsOnMap();
