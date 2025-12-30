// map.js
const map = L.map("map", {
  zoomControl: false,
  attributionControl: false
}).setView([35.681, 139.767], 13);

L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  { maxZoom: 18 }
).addTo(map);

async function loadPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("*");

  if (error) {
    console.error(error);
    return;
  }

  data.forEach(p => {
    L.circleMarker([p.lat, p.lng], {
      radius: 6,
      color: "#4CAF50",
      fillOpacity: 0.8
    })
    .addTo(map)
    .bindPopup(p.title);
  });
}

loadPosts();
