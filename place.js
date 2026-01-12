const params = new URLSearchParams(location.search);
const title = params.get("title");

const titleEl = document.getElementById("place-title");
const postsEl = document.getElementById("place-posts");

if (!title || title === "場所名なし") {
  titleEl.textContent = "場所が特定できません";
} else {
  titleEl.textContent = title;
  loadPlace();
}

async function loadPlace() {
  const { data, error } = await window.supabaseClient
    .from("posts")
    .select("*")
    .eq("title", title);

  if (error || !data) return;

  postsEl.innerHTML = "";

  data.forEach(p => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <p>${p.comment || "内容なし"}</p>
      <span>❤️ ${p.likes ?? 0}</span>
    `;
    postsEl.appendChild(div);
  });

  // 地図
  if (data[0]?.lat && data[0]?.lng) {
    const map = L.map("place-map").setView(
      [data[0].lat, data[0].lng],
      15
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap"
    }).addTo(map);

    L.marker([data[0].lat, data[0].lng]).addTo(map);
  }
}
