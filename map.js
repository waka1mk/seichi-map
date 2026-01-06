const map = L.map("map").setView([35.681236, 139.767125], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

const sheet = document.getElementById("post-sheet");

function openPostSheet(post) {
  if (!sheet) return;
  sheet.classList.remove("hidden");
  sheet.innerHTML = `
    <div class="card">
      <p>${post.content || "内容なし"}</p>
      <span>❤️ ${post.likes ?? 0}</span>
    </div>
  `;
}

async function loadPostsOnMap() {
  const { data, error } = await window.supabaseClient
    .from("posts")
    .select("*");

  if (error) {
    console.error(error);
    return;
  }

  data.forEach(post => {
    if (!post.lat || !post.lng) return;
    const marker = L.marker([post.lat, post.lng]).addTo(map);
    marker.on("click", () => openPostSheet(post));
  });
}

loadPostsOnMap();

map.on("click", e => {
  sessionStorage.setItem("postLat", e.latlng.lat);
  sessionStorage.setItem("postLng", e.latlng.lng);
  location.href = "post.html";
});
