const params = new URLSearchParams(location.search);
const title = params.get("title");

document.getElementById("place-title").textContent = title;

const map = L.map("place-map").setView([35.681236, 139.767125], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

async function loadPlace() {
  const { data } = await window.supabaseClient
    .from("posts")
    .select("*")
    .eq("title", title);

  const box = document.getElementById("place-posts");
  box.innerHTML = "";

  data.forEach(p => {
    if (p.lat && p.lng) {
      L.marker([p.lat, p.lng]).addTo(map);
    }
    box.innerHTML += `<div class="card">${p.content}</div>`;
  });
}

loadPlace();
