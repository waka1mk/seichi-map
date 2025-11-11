// ============================
// ユーザー情報の管理
// ============================
let currentUser = JSON.parse(localStorage.getItem("user")) || null;

// 起動時にログインチェック
window.addEventListener("load", () => {
  if (!currentUser) showLoginModal();
  updateHeader();
});

// ============================
// ログイン / ログアウト
// ============================
function showLoginModal() {
  const modal = document.getElementById("loginModal");
  modal.classList.add("active");
}

function loginUser() {
  const name = document.getElementById("loginName").value.trim();
  if (name === "") return alert("ユーザー名を入力してください。");
  currentUser = {
    id: Date.now(),
    name: name,
    memo: "",
    avatar: "https://placekitten.com/100/100"
  };
  localStorage.setItem("user", JSON.stringify(currentUser));
  document.getElementById("loginModal").classList.remove("active");
  updateHeader();
}

function logoutUser() {
  if (confirm("ログアウトしますか？")) {
    localStorage.removeItem("user");
    location.reload();
  }
}

function updateHeader() {
  const menu = document.getElementById("userMenu");
  if (currentUser) {
    menu.innerHTML = `
      ようこそ、${currentUser.name} さん
      <button onclick="openMypage()">マイページ</button>
      <button onclick="logoutUser()">ログアウト</button>
    `;
  } else {
    menu.innerHTML = `<button onclick="showLoginModal()">ログイン</button>`;
  }
}

// ============================
// マイページ表示
// ============================
function openMypage() {
  const modal = document.getElementById("mypageModal");
  const nameField = document.getElementById("mypageName");
  const memoField = document.getElementById("mypageMemo");
  const avatarImg = document.getElementById("mypageAvatar");

  nameField.value = currentUser.name;
  memoField.value = currentUser.memo;
  avatarImg.src = currentUser.avatar;
  modal.classList.add("active");
}

function saveMypage() {
  currentUser.name = document.getElementById("mypageName").value;
  currentUser.memo = document.getElementById("mypageMemo").value;
  localStorage.setItem("user", JSON.stringify(currentUser));
  updateHeader();
  document.getElementById("mypageModal").classList.remove("active");
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active");
}

// ============================
// コメント関連
// ============================
const commentsData = JSON.parse(localStorage.getItem("comments")) || [];

function openCommentsPanel(postId) {
  const panel = document.getElementById("commentsPanel");
  panel.classList.add("open");
  panel.dataset.postId = postId;
  renderComments(postId);
}

function closeCommentsPanel() {
  document.getElementById("commentsPanel").classList.remove("open");
}

function renderComments(postId) {
  const container = document.getElementById("commentsContainer");
  container.innerHTML = "";
  const postComments = commentsData.filter(c => c.postId === postId);

  postComments.forEach(c => {
    const div = document.createElement("div");
    div.className = "comment";
    div.innerHTML = `
      <strong>${c.user}</strong><br>
      ${c.text}
      <span class="like" onclick="toggleLike(${c.id})">♡ ${c.likes}</span>
    `;
    container.appendChild(div);
  });
}

function addComment() {
  const input = document.getElementById("commentInput");
  const text = input.value.trim();
  if (!text) return;

  // ネガティブワードのフィルタ（例: 単純バージョン）
  const banned = ["死ね", "バカ", "最悪", "ゴミ"];
  if (banned.some(b => text.includes(b))) {
    alert("不適切な表現が含まれています。");
    return;
  }

  const postId = document.getElementById("commentsPanel").dataset.postId;
  const newComment = {
    id: Date.now(),
    postId,
    user: currentUser.name,
    text,
    likes: 0
  };
  commentsData.push(newComment);
  localStorage.setItem("comments", JSON.stringify(commentsData));
  input.value = "";
  renderComments(postId);
}

function toggleLike(commentId) {
  const comment = commentsData.find(c => c.id === commentId);
  if (!comment) return;
  comment.likes++;
  localStorage.setItem("comments", JSON.stringify(commentsData));
  renderComments(comment.postId);
}

// ============================
// 地図＆投稿ダミーデータ
// ============================
let map;

function initMap() {
  map = L.map("map").setView([33.5587, 133.5311], 8);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  const demoPosts = [
    { id: 1, title: "金刀比羅宮（香川）", lat: 34.1914, lng: 133.8089 },
    { id: 2, title: "道後温泉本館（愛媛）", lat: 33.8522, lng: 132.7765 },
    { id: 3, title: "桂浜（高知）", lat: 33.4965, lng: 133.5785 }
  ];

  demoPosts.forEach(post => {
    const marker = L.marker([post.lat, post.lng])
      .addTo(map)
      .bindPopup(`<b>${post.title}</b><br><button onclick="openCommentsPanel(${post.id})">コメントを見る</button>`);
  });
}

// ============================
// FAB（＋ボタン）動作
// ============================
function toggleFab() {
  document.getElementById("fab").classList.toggle("open");
}
