// ======================
// Supabase（※自分の値に）
// ======================
const SUPABASE_URL = "あなたのURL";
const SUPABASE_ANON_KEY = "あなたのKEY";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// ======================
// 地図初期化（四国固定）
// ======================
const map = L.map("map").setView([33.7, 133.8], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

let markers = [];

// 県別色
function getColor(place) {
  if (place.includes("香川")) return "red";
  if (place.includes("徳島")) return "blue";
  if (place.includes("愛媛")) return "green";
  if (place.includes("高知")) return "orange";
  return "gray";
}

// ======================
// 投稿読み込み
// ======================
async function loadPosts(keyword = "") {
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  const timeline = document.getElementById("timeline");
  timeline.innerHTML = "";

  data
    .filter(p =>
      p.title.includes(keyword) || p.place.includes(keyword)
    )
    .forEach(post => {
      const marker = L.circleMarker(
        [post.latitude, post.longitude],
        {
          radius: 8,
          color: getColor(post.place)
        }
      )
        .addTo(map)
        .bindPopup(`<b>${post.title}</b><br>${post.place}`);

      markers.push(marker);

      const div = document.createElement("div");
      div.className = "post";
      div.textContent = `${post.title}（${post.place}）`;
      timeline.appendChild(div);
    });
}

loadPosts();

// ======================
// 検索
// ======================
document.getElementById("search").addEventListener("input", e => {
  loadPosts(e.target.value);
});

// ======================
// ＋メニュー
// ======================
const plusBtn = document.getElementById("plus-btn");
const plusMenu = document.getElementById("plus-menu");

plusBtn.onclick = () => {
  plusMenu.classList.toggle("hidden");
};

document.getElementById("close-menu").onclick = () => {
  plusMenu.classList.add("hidden");
};

document.getElementById("toggle-timeline").onclick = () => {
  document.getElementById("timeline").classList.toggle("hidden");
};

document.getElementById("go-post").onclick = () => {
  location.href = "post.html";
};
