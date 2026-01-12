// map.js
const mapEl = document.getElementById("map");

if (mapEl) {
  const map = L.map("map").setView([35.681236, 139.767125], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  const sheet = document.getElementById("post-sheet");

  function openPostSheet(post) {
    if (!sheet) return;

    sheet.classList.remove("hidden");
    sheet.innerHTML = `
      <div class="card">
        <h3>${post.title || "場所名なし"}</h3>
        <p>${post.content || "内容なし"}</p>
        <span>❤️ ${post.likes ?? 0}</span>
        <br>
        <a href="place.html?title=${encodeURIComponent(post.title)}">
          この場所を見る →
        </a>
      </div>
    `;
  }

  async function loadPosts() {
    const { data, error } = await window.supabaseClient
      .from("posts")
      .select("*");

    if (error || !data) return;

    data.forEach(post => {
      if (!post.lat || !post.lng) return;

      const marker = L.marker([post.lat, post.lng]).addTo(map);
      marker.on("click", () => openPostSheet(post));
    });
  }

  loadPosts();

  map.on("click", e => {
    sessionStorage.setItem("postLat", e.latlng.lat);
    sessionStorage.setItem("postLng", e.latlng.lng);
    location.href = "post.html";
  });
}
