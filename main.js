// ===============================
// 四国聖地巡礼マップ main.js 完成版
// ===============================

// -------------------------------
// ① 地図初期化（四国固定）
// -------------------------------
const SHIKOKU_CENTER = [33.7, 133.5]; // 四国中央
const SHIKOKU_ZOOM = 7;

let map;

document.addEventListener("DOMContentLoaded", () => {
  initMap();
  initFabMenu();
});

// -------------------------------
// ② 地図生成
// -------------------------------
function initMap() {
  map = L.map("map", {
    center: SHIKOKU_CENTER,
    zoom: SHIKOKU_ZOOM,
    zoomControl: true,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);
}

// -------------------------------
// ③ ＋ボタン & メニュー制御
// -------------------------------
function initFabMenu() {
  const fabMain = document.getElementById("fab-main");
  const fabMenu = document.getElementById("fab-menu");

  if (!fabMain || !fabMenu) return;

  let isOpen = false;

  fabMain.addEventListener("click", () => {
    isOpen = !isOpen;
    fabMenu.style.display = isOpen ? "flex" : "none";
    fabMain.textContent = isOpen ? "×" : "＋";
  });
}

// -------------------------------
// ④ メニュー遷移
// -------------------------------
function goMap() {
  // 地図は常に表示されているので何もしない
  closeFab();
}

function goPost() {
  window.location.href = "post.html";
}

function goTimeline() {
  window.location.href = "comments.html";
}

function closeFab() {
  const fabMenu = document.getElementById("fab-menu");
  const fabMain = document.getElementById("fab-main");
  if (fabMenu && fabMain) {
    fabMenu.style.display = "none";
    fabMain.textContent = "＋";
  }
}
