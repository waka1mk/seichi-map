document.addEventListener("DOMContentLoaded", () => {

  /* ---------------- 地図 ---------------- */
  const map = L.map("map").setView([34.0, 134.0], 7);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19
  }).addTo(map);

  function loadPostsToMap() {
    let posts = JSON.parse(localStorage.getItem("posts") || "[]");
    posts.forEach(p => {
      L.marker([p.lat, p.lng]).addTo(map).bindPopup(`
        <b>${p.place || "不明な場所"}</b><br>
        ${p.comment}<br>
        ${p.image ? `<img src="${p.image}" style="width:100%; border-radius:10px;">` : ""}
      `);
    });
  }
  loadPostsToMap();

  /* ---------------- タイムライン ---------------- */
  function loadTimeline() {
    let box = document.getElementById("timelineList");
    box.innerHTML = "";

    let posts = JSON.parse(localStorage.getItem("posts") || "[]");
    posts.reverse().forEach(p => {
      let div = document.createElement("div");
      div.className = "post";
      div.innerHTML = `
        <p>${p.place || "場所なし"}</p>
        <p>${p.comment}</p>
        ${p.image ? `<img src="${p.image}">` : ""}
      `;
      box.appendChild(div);
    });
  }

  /* ---------------- FAB メニュー ---------------- */
  const mainFab = document.getElementById("mainFab");
  const fabMenu = document.getElementById("fabMenu");

  mainFab.addEventListener("click", () => {
    fabMenu.classList.toggle("hidden");
  });

  document.getElementById("btnMap").onclick = () => {
    fabMenu.classList.add("hidden");
    document.getElementById("timelinePanel").classList.remove("open");
  };

  document.getElementById("btnTimeline").onclick = () => {
    loadTimeline();
    fabMenu.classList.add("hidden");
    document.getElementById("timelinePanel").classList.add("open");
  };

  document.getElementById("btnPost").onclick = () => {
    window.location.href = "post.html";
  };
});
