if (!localStorage.getItem("user_name")) {
  location.href = "login.html";
}

const map = L.map("map").setView([35.681236, 139.767125], 6);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

const markers = new Map();
const card = document.getElementById("post-card");

async function loadPostsOnMap() {
  const { data, error } = await supabase
    .from("posts")
    .select("*");

  if (error) {
    console.error(error);
    return;
  }

  data.forEach(post => {
    if (!post.lat || !post.lng) return;
    if (markers.has(post.id)) return;

    const marker = L.marker([post.lat, post.lng]).addTo(map);

    marker.on("click", () => {
      card.innerHTML = `
        <h3>${post.title ?? "無題"}</h3>
        <p>${post.comment ?? ""}</p>
        <button id="like-${post.id}" class="like-btn">
          ❤️ <span>${post.likes ?? 0}</span>
        </button>
      `;
      card.classList.add("show");

      document.getElementById(`like-${post.id}`).onclick = async () => {
        await supabase
          .from("posts")
          .update({ likes: (post.likes ?? 0) + 1 })
          .eq("id", post.id);
      };
    });

    markers.set(post.id, marker);
  });
}

loadPostsOnMap();

/* Realtime */
supabase
  .channel("posts-map")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "posts" },
    () => loadPostsOnMap()
  )
  .subscribe();
