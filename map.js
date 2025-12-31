const map = L.map("map").setView([33.6, 133.5], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap",
}).addTo(map);

const recentBox = document.getElementById("recent-posts");
const filterSelect = document.getElementById("workFilter");

let allPosts = [];
let markers = [];

async function loadPosts() {
  allPosts = await supabase.from("posts").select();
  renderMarkers(allPosts);
  renderRecent(allPosts);
  buildWorkFilter(allPosts);
}

function renderMarkers(posts) {
  markers.forEach((m) => map.removeLayer(m));
  markers = [];

  posts.forEach((p) => {
    const marker = L.marker([p.lat, p.lng])
      .addTo(map)
      .bindPopup(`
        <b>${p.user_name}</b><br>
        ${p.content}<br>
        ${p.image_url ? `<img src="${p.image_url}" width="150">` : ""}
      `);

    markers.push(marker);
  });
}

function renderRecent(posts) {
  recentBox.innerHTML = "";

  posts.slice(-5).reverse().forEach((p) => {
    const div = document.createElement("div");
    div.className = "recent-item";

    div.innerHTML = `
      ${p.image_url ? `<img src="${p.image_url}" class="thumb">` : ""}
      <div class="text">
        <b>${p.user_name}</b>
        <div>${p.content.slice(0, 20)}…</div>
      </div>
    `;

    div.onclick = () => {
      map.setView([p.lat, p.lng], 14);
    };

    recentBox.appendChild(div);
  });
}

function buildWorkFilter(posts) {
  const works = [...new Set(posts.map(p => p.work_title).filter(Boolean))];

  works.forEach((w) => {
    const opt = document.createElement("option");
    opt.value = w;
    opt.textContent = w;
    filterSelect.appendChild(opt);
  });
}

filterSelect.onchange = () => {
  const v = filterSelect.value;
  renderMarkers(v ? allPosts.filter(p => p.work_title === v) : allPosts);
};

loadPosts();
