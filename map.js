const map = L.map("map").setView([35.681236, 139.767125], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

const markers = [];

async function loadPostsOnMap() {
  const { data, error } = await window.supabase
    .from("posts")
    .select("*");

  if (error) {
    console.error(error);
    return;
  }

  markers.forEach(m => map.removeLayer(m));
  markers.length = 0;

  data.forEach(post => {
    if (post.lat == null || post.lng == null) return;

    const marker = L.marker([post.lat, post.lng]).addTo(map);
    markers.push(marker);

    marker.on("click", () => {
      openPostSheet(post);
    });
  });
}

loadPostsOnMap();

/* 下から出る投稿カード */
function openPostSheet(post) {
  const sheet = document.getElementById("post-sheet");
  sheet.classList.add("open");

  document.getElementById("sheet-title").innerText = post.title ?? "";
  document.getElementById("sheet-comment").innerText = post.comment ?? "";
  document.getElementById("sheet-likes").innerText = post.likes ?? 0;

  const likeBtn = document.getElementById("like-btn");
  likeBtn.onclick = async () => {
    const newLikes = (post.likes ?? 0) + 1;

    await window.supabase
      .from("posts")
      .update({ likes: newLikes })
      .eq("id", post.id);

    post.likes = newLikes;
    animateLike();
    document.getElementById("sheet-likes").innerText = newLikes;
  };
}

function animateLike() {
  const el = document.getElementById("sheet-likes");
  el.classList.add("jump");
  setTimeout(() => el.classList.remove("jump"), 300);
}
