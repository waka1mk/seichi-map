const map = L.map("map").setView([33.5, 133.5], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

// 画面入場の“間”
window.addEventListener("load", () => {
  document.body.classList.add("page-enter");
  requestAnimationFrame(() => {
    document.body.classList.remove("page-enter");
  });
});

async function loadPosts() {
  const { data } = await supabase
    .from("posts")
    .select("*");

  data.forEach(p => {
    const pin = L.circleMarker([p.lat, p.lng], {
      radius: 8,
      fillColor: "#5f7c6a",
      color: "#3e4f45",
      weight: 1,
      fillOpacity: 0.85
    });

    pin
      .addTo(map)
      .bindPopup(`<b>${p.content}</b>`);
  });
}

loadPosts();
