// ===== Leaflet Map =====
let map;

// ===== 起動時 =====
window.onload = () => {
  initLogin();
  initMap();
  loadPosts();  // ← posts.json を読む
};

// =====================
// ログイン管理
// =====================
function initLogin() {
  const saved = localStorage.getItem("username");

  if (saved) {
    document.getElementById("loginScreen").classList.remove("active");
    document.getElementById("userInfo").innerText = `こんにちは ${saved} さん`;
  }

  document.getElementById("loginBtn").onclick = () => {
    const name = document.getElementById("usernameInput").value;
    if (!name) return;

    localStorage.setItem("username", name);
    document.getElementById("loginScreen").classList.remove("active");
    document.getElementById("userInfo").innerText = `こんにちは ${name} さん`;
  };
}

// =====================
// 地図初期化
// =====================
function initMap() {
  map = L.map('map').setView([33.6, 133.5], 8); // 四国中心

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
  }).addTo(map);
}

// =====================
// posts.json 読み込み
// =====================
async function loadPosts() {
  try {
    const res = await fetch("posts.json");
    const posts = await res.json();

    const container = document.getElementById("postsContainer");
    container.innerHTML = "";

    posts.forEach(post => {
      const div = document.createElement("div");
      div.className = "post-item";
      div.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content}</p>
      `;
      container.appendChild(div);

      // ピン追加
      L.marker([post.lat, post.lng])
        .addTo(map)
        .bindPopup(`<b>${post.title}</b><br>${post.content}`);
    });

  } catch (e) {
    console.error("posts.json が読み込めません", e);
  }
}

// =====================
// UI メニュー
// =====================
const fab = document.getElementById("fab");
const mapBtn = document.getElementById("mapBtn");
const tlBtn = document.getElementById("timelineBtn");
const postBtn = document.getElementById("postBtn");
const timelinePanel = document.getElementById("timelinePanel");
const postModal = document.getElementById("postModal");

fab.onclick = () => {
  mapBtn.classList.toggle("hidden");
  tlBtn.classList.toggle("hidden");
  postBtn.classList.toggle("hidden");
};

// 地図
mapBtn.onclick = () => {
  timelinePanel.classList.remove("active");
  postModal.classList.remove("active");
};

// タイムライン
tlBtn.onclick = () => {
  timelinePanel.classList.toggle("active");
};

// 投稿モーダル
postBtn.onclick = () => {
  postModal.classList.add("active");
};

document.getElementById("closePostModal").onclick = () => {
  postModal.classList.remove("active");
};

// =====================
// 新規投稿（ローカルのみ）
// =====================
document.getElementById("submitPost").onclick = () => {
  alert("投稿機能は今ローカル保存のみ。Supabase つなぐ時に本実装する！");
  postModal.classList.remove("active");
};
