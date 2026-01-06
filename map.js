const user = localStorage.getItem("user_name");
if (!user) location.href = "login.html";

const map = L.map("map").setView([35.681, 139.767], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

async function loadPosts() {
  const { data } = await window.supabase.from("posts").select("*");

  data.forEach(p => {
    const m = L.marker([p.lat, p.lng]).addTo(map);
    m.on("click", () => {
      alert(p.content + "\n❤️ " + (p.likes ?? 0));
    });
  });
}

map.on("click", e => {
  localStorage.setItem("post_lat", e.latlng.lat);
  localStorage.setItem("post_lng", e.latlng.lng);
  location.href = "post.html";
});

loadPosts();
