// SPA single-page script: map, timeline, post UI
let map;
let markersLayer;
document.addEventListener('DOMContentLoaded', () => {
  // DOM
  const mapView = document.getElementById('mapView');
  const postView = document.getElementById('postView');
  const mainFab = document.getElementById('mainFab');
  const fabMenu = document.getElementById('fabMenu');
  const fabMap = document.getElementById('fabMap');
  const fabTimeline = document.getElementById('fabTimeline');
  const fabPost = document.getElementById('fabPost');
  const timelinePanel = document.getElementById('timelinePanel');
  const timelineList = document.getElementById('timelineList');

  const backToMapBtn = document.getElementById('backToMap');
  const latInput = document.getElementById('lat');
  const lngInput = document.getElementById('lng');
  const photoInput = document.getElementById('photoInput');
  const imagePreviewWrap = document.getElementById('imagePreviewWrap');
  const submitPostBtn = document.getElementById('submitPost');
  const postTitle = document.getElementById('postTitle');
  const postComment = document.getElementById('postComment');
  const postPlace = document.getElementById('postPlace');
  const postTags = document.getElementById('postTags');
  const visitDate = document.getElementById('visitDate');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');

  // 初期表示：地図ビュー
  showView('map');

  // 初期化：Leaflet
  initMap();

  // FAB 主ボタン
  mainFab.addEventListener('click', () => {
    fabMenu.classList.toggle('hidden');
  });

  // FAB メニュー操作
  fabMap.addEventListener('click', () => {
    fabMenu.classList.add('hidden');
    // 地図ビューに戻す
    showView('map');
    timelinePanel.classList.remove('open');
  });
  fabTimeline.addEventListener('click', () => {
    fabMenu.classList.add('hidden');
    showTimeline();
  });
  fabPost.addEventListener('click', () => {
    fabMenu.classList.add('hidden');
    // 投稿ビューへ
    showView('post');
  });

  // 戻る（投稿ビュー→地図）
  backToMapBtn.addEventListener('click', () => {
    showView('map');
  });

  // 画像プレビュー (Base64準備は投稿時)
  photoInput.addEventListener('change', () => {
    const f = photoInput.files && photoInput.files[0];
    imagePreviewWrap.innerHTML = '';
    if (!f) return;
    const fr = new FileReader();
    fr.onload = e => {
      const img = document.createElement('img');
      img.src = e.target.result;
      imagePreviewWrap.appendChild(img);
      // keep dataURL in dataset for submit
      photoInput.dataset.base64 = e.target.result;
    };
    fr.readAsDataURL(f);
  });

  // 投稿処理
  submitPostBtn.addEventListener('click', async () => {
    // validate
    const title = postTitle.value.trim();
    const comment = postComment.value.trim();
    const lat = parseFloat(latInput.value) || null;
    const lng = parseFloat(lngInput.value) || null;
    if (!title && !comment) {
      alert('タイトルまたはコメントを入力してください');
      return;
    }

    // image base64 (may be in dataset)
    const base64 = photoInput.dataset.base64 || '';

    const newPost = {
      id: Date.now(),
      title,
      comment,
      place: postPlace.value.trim() || '',
      tags: (postTags.value || '').split(',').map(s=>s.trim()).filter(Boolean),
      visitDate: visitDate.value || '',
      createdAt: new Date().toISOString(),
      lat, lng,
      image: base64
    };

    // save to localStorage
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    posts.push(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));

    // reset form lightly
    postTitle.value=''; postComment.value=''; postPlace.value=''; postTags.value=''; visitDate.value='';
    photoInput.value=''; photoInput.dataset.base64=''; imagePreviewWrap.innerHTML='';

    // Return to map and refresh
    showView('map');
    loadPostsToMap();
    if (newPost.lat && newPost.lng) {
      map.flyTo([newPost.lat, newPost.lng], 14, {duration:0.6});
    }
    // toast
    alert('投稿が保存されました（ローカル保存）');
  });

  // 検索（タイトル/場所）
  searchBtn.addEventListener('click', () => {
    const q = (searchInput.value || '').toLowerCase();
    if (!q) return;
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const found = posts.find(p => (p.title||'').toLowerCase().includes(q) || (p.place||'').toLowerCase().includes(q));
    if (found && found.lat && found.lng) {
      map.flyTo([found.lat, found.lng], 13, {duration:0.6});
    } else {
      alert('一致する場所は見つかりませんでした（位置データが無い投稿もあります）');
    }
  });

  // タイムラインを開く
  function showTimeline(){
    timelinePanel.classList.add('open');
    renderTimeline();
    showView('map'); // ensure map is visible behind it
  }

  // ページビュー切替
  function showView(name){
    if(name==='map'){
      document.getElementById('mapView').classList.add('active');
      document.getElementById('postView').classList.remove('active');
      // invalidate size after short delay
      setTimeout(()=> { if(map) map.invalidateSize(); }, 200);
    } else if(name==='post'){
      document.getElementById('mapView').classList.remove('active');
      document.getElementById('postView').classList.add('active');
      // 投稿ビュー入室時に位置取得
      obtainGeolocation();
    }
  }

  // 位置情報取得（投稿ビューで呼ぶ）
  function obtainGeolocation(){
    latInput.value = ''; lngInput.value = '';
    if(!navigator.geolocation){
      alert('位置情報APIが利用できません');
      return;
    }
    navigator.geolocation.getCurrentPosition((pos)=>{
      latInput.value = pos.coords.latitude.toFixed(6);
      lngInput.value = pos.coords.longitude.toFixed(6);
    }, (err)=>{
      console.warn('位置情報取得エラー', err);
      // 取得できない場合は空欄のままにして、ユーザーが手入力できるようにする
      alert('位置情報を取得できませんでした（許可設定をご確認ください）');
    }, { enableHighAccuracy:true, timeout:8000 });
  }

  // 初期化 map
  function initMap(){
    // create map and markers layer
    map = L.map('map', { zoomControl:true }).setView([33.6,133.5], 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom:19, attribution:'© OpenStreetMap contributors'
    }).addTo(map);
    markersLayer = L.layerGroup().addTo(map);

    // load existing posts
    loadPostsToMap();

    // clicking marker popup behavior handled when creating markers
  }

  // Load posts and draw markers
  function loadPostsToMap(){
    markersLayer.clearLayers();
    const posts = JSON.parse(localStorage.getItem('posts')||'[]');
    posts.forEach(p => {
      if(p.lat && p.lng){
        const m = L.marker([p.lat, p.lng]);
        let popup = `<strong>${escapeHtml(p.title || p.place || '投稿')}</strong><br>`;
        if(p.place) popup += `${escapeHtml(p.place)}<br>`;
        if(p.visitDate) popup += `訪問日: ${escapeHtml(p.visitDate)}<br>`;
        if(p.tags && p.tags.length) popup += `タグ: ${escapeHtml(p.tags.join(', '))}<br>`;
        if(p.comment) popup += `<div style="margin-top:6px;">${escapeHtml(p.comment)}</div>`;
        if(p.image) popup += `<div style="margin-top:8px;"><img src="${p.image}" style="width:120px;border-radius:8px;"></div>`;
        m.bindPopup(popup);
        m.addTo(markersLayer);
      }
    });
  }

  // render timeline list
  function renderTimeline(){
    timelineList.innerHTML='';
    const posts = JSON.parse(localStorage.getItem('posts')||'[]').slice().reverse();
    if(posts.length===0){
      timelineList.innerHTML = '<p>投稿がまだありません</p>';
      return;
    }
    posts.forEach(p=>{
      const div = document.createElement('div');
      div.className = 'tl-item';
      let title = escapeHtml(p.title || p.place || '（無題）');
      div.innerHTML = `<strong>${title}</strong>
        <div style="font-size:13px;color:#666;margin-top:6px;">${p.visitDate?`訪問日: ${escapeHtml(p.visitDate)} • `:''}${new Date(p.createdAt||p.id||Date.now()).toLocaleString()}</div>
        <div style="margin-top:6px;">${escapeHtml(p.comment||'')}</div>
        ${p.image?`<img src="${p.image}">` : '' }
        ${p.tags && p.tags.length ? `<div style="margin-top:6px;font-size:13px;color:#444">タグ: ${escapeHtml(p.tags.join(', '))}</div>` : ''}
      `;
      // click to fly to marker if coords exist
      div.addEventListener('click', ()=>{
        if(p.lat && p.lng){
          timelinePanel.classList.remove('open');
          map.flyTo([p.lat,p.lng], 13, {duration:0.6});
        } else {
          alert('この投稿には位置情報がありません');
        }
      });
      timelineList.appendChild(div);
    });
  }

  // Escape HTML
  function escapeHtml(s){
    if(!s) return '';
    return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  }

  // ensure posts shown on map at load
  loadPostsToMap();

  // close timeline when clicked outside (optional)
  document.addEventListener('click', (ev)=>{
    const inFab = ev.target.closest('#fabArea');
    const inTimeline = ev.target.closest('#timelinePanel');
    if(!inFab && !inTimeline){
      // don't auto-close timeline to avoid annoyance; left as-is
    }
  });

}); // DOMContentLoaded end
