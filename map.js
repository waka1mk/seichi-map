console.log("map.js loaded");

const mapEl = document.getElementById("map");
if (!mapEl) {
  console.warn("map element not found");
} else {
  const map = L.map("map").setView([35.681236, 139.767125], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map);

  async function loadPosts() {
    const { data, error } = await window.supabaseClient
      .from("posts")
      .select("*");

    if (error) {
      console.error(error);
      return;
    }

    data.forEach(post => {
      if (post.lat == null || post.lng == null) return;

      const marker = L.marker([
        Number(post.lat),
        Number(post.lng)
      ]).addTo(map);

      marker.on("click", () => {
        alert(post.content || "内容なし");
      });
    });
  }

  loadPosts();

  map.on("click", e => {
    sessionStorage.setItem("postLat", e.latlng.lat);
    sessionStorage.setItem("postLng", e.latlng.lng);
    location.href = "./post.html";
  });
}
