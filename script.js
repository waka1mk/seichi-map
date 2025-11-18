// script.js
// Leaflet マップ初期化 + ログイン / 投稿 / タイムライン処理

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM ---
  const loginScreen = document.getElementById('loginScreen');
  const loginBtn = document.getElementById('loginBtn');
  const usernameInput = document.getElementById('usernameInput');
  const userInfo = document.getElementById('userInfo');

  const postModal = document.getElementById('postModal');
  const submitPost = document.getElementById('submitPost');
  const closePostModal = document.getElementById('closePostModal');
  const postTitle = document.getElementById('postTitle');
  const postContent = document.getElementById('postContent');
  const postsContainer = document.getElementById('postsContainer');

  const timelinePanel = document.getElementById('timelinePanel');
  const timelineBtn = document.getElementById('timelineBtn');
  const mapBtn = document.getElementById('mapBtn');
  const postBtn = document.getElementById('postBtn');
  const fabMain = document.getElementById('fab');

  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');

  // --- マップ初期化 ---
  // 四国の中心付近
  const initialCenter = [34.065, 133.844];
  const map = L.map('map', {
    center: initialCenter,
    zoom: 9,
    preferCanvas: true
  });

  // OSM タイルレイヤー
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // マーカー用グループ
  const markers = L.layerGroup().addTo(map);

  // リサイズ時にマップを適切に再描画するヘルパー
  function refreshMap() {
    setTimeout(() => {
      map.invalidateSize();
    }, 120);
  }

  // --- ローカルストレージ読み込み/保存（簡易） ---
  function savePostsToStorage(posts) {
    localStorage.setItem('shikoku_posts_v1', JSON.stringify(posts));
  }
  function loadPostsFromStorage() {
    const raw = localStorage.getItem('shikoku_posts_v1');
    if (!raw) return [];
    try { return JSON.parse(raw); } catch (e) { return []; }
  }
  function loadUsername() {
    return localStorage.getItem('shikoku_username') || null;
  }
  function saveUsername(name) {
    localStorage.setItem('shikoku_username', name);
  }

  // --- 投稿描画 ---
  function renderPosts() {
    postsContainer.innerHTML = '';
    const posts = loadPostsFromStorage().slice().reverse(); // 新しい順
    posts.forEach((p) => {
      const el = document.createElement('div');
      el.className = 'post';
      el.innerHTML = `
        <strong>${escapeHtml(p.title)}</strong>
        <div style="font-size:13px;color:#666;margin:6px 0">${escapeHtml(p.username)} • ${new Date(p.created).toLocaleString()}</div>
        <div style="white-space:pre-wrap">${escapeHtml(p.content)}</div>
      `;
      postsContainer.appendChild(el);
    });
  }

  // マーカーを表示
  function renderMarkers() {
    markers.clearLayers();
    const posts = loadPostsFromStorage();
    posts.forEach(p => {
      if (!p.lat || !p.lng) return;
      const m = L.marker([p.lat, p.lng]);
      m.bindPopup(`<strong>${escapeHtml(p.title)}</strong><br>${escapeHtml(p.username)}`);
      markers.addLayer(m);
    });
  }

  // HTML エスケープ（簡易）
  function escapeHtml(s) {
    if (!s) return '';
    return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  }

  // --- ログイン処理 ---
  const storedName = loadUsername();
  if (storedName) {
    // 既にログイン済み
    loginScreen.classList.remove('active');
    loginScreen.setAttribute('aria-hidden', 'true');
    userInfo.textContent = storedName;
  } else {
    loginScreen.classList.add('active');
    loginScreen.setAttribute('aria-hidden', 'false');
  }

  loginBtn.addEventListener('click', () => {
    const name = (usernameInput.value || '').trim();
    if (!name) {
      alert('ユーザー名を入力してください');
      return;
    }
    saveUsername(name);
    userInfo.textContent = name;
    loginScreen.classList.remove('active');
    loginScreen.setAttribute('aria-hidden', 'true');
  });

  // --- 投稿モーダル制御 ---
  function openPostModal() {
    postModal.classList.add('active');
    postModal.setAttribute('aria-hidden', 'false');
    refreshMap();
  }
  function closePostModalFn() {
    postModal.classList.remove('active');
    postModal.setAttribute('aria-hidden', 'true');
    postTitle.value = '';
    postContent.value = '';
  }

  postBtn.addEventListener('click', () => {
    if (!loadUsername()) {
      alert('投稿するにはユーザー名の入力が必要です。');
      return;
    }
    openPostModal();
  });
  fabMain.addEventListener('click', () => {
    if (!loadUsername()) {
      alert('投稿するにはユーザー名の入力が必要です。');
      return;
    }
    openPostModal();
  });
  closePostModal.addEventListener('click', closePostModalFn);

  // 投稿処理（地図中心の位置を使う）
  submitPost.addEventListener('click', () => {
    const title = postTitle.value.trim();
    const content = postContent.value.trim();
    if (!title) {
      alert('タイトルを入力してください');
      return;
    }
    const username = loadUsername() || '匿名';
    const center = map.getCenter();
    const posts = loadPostsFromStorage();
    posts.push({
      id: Date.now(),
      title,
      content,
      username,
      lat: center.lat,
      lng: center.lng,
      created: Date.now()
    });
    savePostsToStorage(posts);
    renderPosts();
    renderMarkers();
    closePostModalFn();
    // 軽くポップで知らせる
    alert('投稿が保存されました（地図中心の位置に登録）');
  });

  // --- タイムライン表示切り替え ---
  timelineBtn.addEventListener('click', () => {
    timelinePanel.classList.toggle('active');
    const isActive = timelinePanel.classList.contains('active');
    timelinePanel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    refreshMap();
  });

  // --- 地図ボタン（拡大/中心へ） ---
  mapBtn.addEventListener('click', () => {
    map.flyTo(initialCenter, 9, { duration: 0.6 });
  });

  // --- 検索（簡易）: 作品名で既存投稿のタイトルを検索してマーカーを開く ---
  searchBtn.addEventListener('click', () => {
    const q = (searchInput.value || '').trim().toLowerCase();
    if (!q) return;
    const posts = loadPostsFromStorage();
    const found = posts.find(p => (p.title || '').toLowerCase().includes(q));
    if (found) {
      map.flyTo([found.lat, found.lng], 14, { duration: 0.6 });
      // 開くポップアップを探す（markers レイヤーから）
      markers.eachLayer(layer => {
        const ll = layer.getLatLng();
        if (Math.abs(ll.lat - found.lat) < 0.0001 && Math.abs(ll.lng - found.lng) < 0.0001) {
          layer.openPopup();
        }
      });
    } else {
      alert('一致する投稿が見つかりませんでした');
    }
  });

  // Enter で検索
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchBtn.click();
    }
  });

  // --- 初回ロードで既存の投稿を描画 ---
  renderPosts();
  renderMarkers();

  // マップクリックで位置を緑の一時マーカーにセット（任意の UX）
  let tempMarker = null;
  map.on('click', (ev) => {
    if (tempMarker) markers.removeLayer(tempMarker);
    tempMarker = L.marker(ev.latlng, { opacity: 0.7 }).addTo(markers);
    // 移動後にその位置で投稿することを促す
    if (confirm('ここに投稿しますか？（「いいえ」でキャンセル、続けると投稿モーダルを開きます）')) {
      // 移動して投稿モーダルを開き、マップ中心をクリック位置に移す
      map.panTo(ev.latlng);
      openPostModal();
    } else {
      // leave marker as hint for 4s then remove
      setTimeout(() => { if (tempMarker) markers.removeLayer(tempMarker); tempMarker = null; }, 4000);
    }
  });

  // 画面リサイズでマップを再描画
  window.addEventListener('resize', refreshMap);

});
