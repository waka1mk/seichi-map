const map = L.map("map").setView([35.681236, 139.767125], 6);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

async function loadPins() {
  const { data, error } = await supabase
    .from("posts")
    .select("id, content, lat, lng");

  if (error) {
    console.error(error);
    return;
  }

  data.forEach(p => {
    if (p.lat && p.lng) {
      L.marker([p.lat, p.lng])
        .addTo(map)
        .bindPopup(p.content);
    }
  });
}

loadPins();
