// main.js
// SPA: map, post, timeline, tags, image compression, posts.json preload
let map, markersLayer;

document.addEventListener('DOMContentLoaded', () => {
  // DOM refs
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
  const postLocation = document.getElementById('postLocation');
  const visitDate = document.getElementById('visitDate');
  const postTagsWrap = document.getElementById('tagList');
  const tagCustom = document.getElementById('tagCustom');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const locBtn = document.getElementById('locBtn');

  // Tag config (order B: genre first)
  const TAGS = [
    { id:'anime', label:'アニメ', color:'#4A90E2' },
    { id:'game', label:'ゲーム', color:'#D35454' },
    { id:'manga', label:'漫画', color:'#9B59B6' },
    { id:'pilgrimage', label:'聖地巡礼', color:'#2ECC71' },
    { id:'stage', label:'舞台探訪', color:'#27AE60' },
    { id:'reproduce', label:'作品再現', color:'#E67E22' },
    { id:'oshi', label:'推し旅', color:'#E84393' },
    { id:'first', label:'初巡礼！', color:'#F1C40F' }
  ];
  const MAX_TAGS = 3;

  // Populate prefecture select (B: plain names)
  const PREFS = ["北海道","青森","岩手","宮城","秋田","山形","福島","茨城","栃木","群馬","埼玉","千葉","東京","神奈川","新潟","富山","石川","福井","山梨","長野","岐阜","静岡","愛知","三重","滋賀","京都","大阪","兵庫","奈良","和歌山","鳥取","島根","岡山","広島","山口","徳島","香川","愛媛","高知","福岡","佐賀","長崎","熊本","大分","宮崎","鹿児島","沖縄"];
  PREFS.forEach(p=>{
    const opt = document.createElement('option');
    opt.value = p; opt.textContent = p;
    postLocation.appendChild(opt);
  });

  // default visitDate to today (yyyy-mm-dd)
  const today = new Date().toISOString().split('T')[0];
  visitDate.value = today;

  // tags UI
  let selectedTags = new Set(['pilgrimage']); // default ON
  function renderTagButtons(){
    postTagsWrap.innerHTML = '';
    TAGS.forEach(t=>{
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tag-btn';
      btn.style.background = selectedTags.has(t.id) ? t.color : '#fff';
      btn.style.color = selectedTags.has(t.id) ? '#fff' : '#333';
      btn.style.borderColor = t.color;
      btn.textContent = t.label;
      if(selectedTags.has(t.id)) btn.classList.add('on');
      btn.addEventListener('click', ()=>{
        if(selectedTags.has(t.id)){
          selectedTags.delete(t.id);
        } else {
          if(selectedTags.size >= MAX_TAGS){
            alert(`タグは最大 ${MAX_TAGS} つまでです`);
            return;
          }
          selectedTags.add(t.id);
        }
        renderTagButtons();
      });
      postTagsWrap.appendChild(btn);
    });
  }
  // handle custom tag add (user-defined)
  tagCustom.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter'){
      e.preventDefault();
      const v = tagCustom.value.trim();
      if(!v) return;
      // allow user tags (id generated)
      if(selectedTags.size >= MAX_TAGS){
        alert(`タグは最大 ${MAX_TAGS} つまでです`);
        return;
      }
      // add into selectedTags with synthetic id
      const id = 'u_' + Date.now();
      // create a temporary tag object and push to left
      TAGS.push({ id, label: v, color:'#8B8B8B' });
      selectedTags.add(id);
      tagCustom.value = '';
      renderTagButtons();
    }
  });

  renderTagButtons();

  // image preview + compression on load
  photoInput.addEventListener('change', () => {
    const f = photoInput.files && photoInput.files[0];
    imagePreviewWrap.innerHTML = '';
    if (!f) return;
    compressImageFile(f, 1024, 0.7).then(dataUrl=>{
      // store compressed in dataset
      photoInput.dataset.base64 = dataUrl;
      const img = document.createElement('img');
      img.src = dataUrl;
      imagePreviewWrap.appendChild(img);
    }).catch(err=>{
      console.error('compress error', err);
      const fr = new FileReader();
      fr.onload = e => {
        photoInput.dataset.base64 = e.target.result;
        const img = document.createElement('img');
        img.src = e.target.result;
        imagePreviewWrap.appendChild(img);
      };
      fr.readAsDataURL(f);
    });
  });

  // current location button
  locBtn.addEventListener('click', ()=>{
    locBtn.disabled = true;
    locBtn.textContent = '📍取得中…';
    if(!navigator.geolocation){
      alert('位置情報を利用できません');
      locBtn.disabled = false; locBtn.textContent = '📍現在地を取得';
      return;
    }
    navigator.geolocation.getCurrentPosition((pos)=>{
      latInput.value = pos.coords.latitude.toFixed(6);
      lngInput.value = pos.coords.longitude.toFixed(6);
      locBtn.disabled = false; locBtn.textContent = '📍現在地を取得';
    }, (err)=>{
      console.warn(err);
      alert('位置情報取得に失敗しました。ブラウザの許可設定を確認してください。');
      locBtn.disabled = false; locBtn.textContent = '📍現在地を取得';
    }, { enableHighAccuracy:true, timeout:8000 });
  });

  // submission
  submitPostBtn.addEventListener('click', ()=>{
    // gather data
    const title = postTitle.value.trim();
    const comment = postComment.value.trim();
    const location = postLocation.value || '';
    const lat = parseFloat(latInput.value) || null;
    const lng = parseFloat(lngInput.value) || null;
    const image = photoInput.dataset.base64 || '';
    const tags = Array.from(selectedTags);
    const visit = visitDate.value || today;
    const user = localStorage.getItem('username') || '匿名';

    if(!title && !comment){
      alert('タイトルまたはコメントを入力してください');
      return;
    }

    // basic post object
    const post = {
      id: Date.now(),
      user,
      title,
      comment,
      location,
      lat,
      lng,
      tags,
      visitDate: visit,
      createdAt: new Date().toISOString(),
      image
    };

    // save to localStorage (posts.json simulated)
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    posts.push(post);
    localStorage.setItem('posts', JSON.stringify(posts));

    // reset fields lightly
    postTitle.value=''; postComment.value=''; postLocation.selectedIndex=0; latInput.value=''; lngInput.value=''; photoInput.value=''; photoInput.dataset.base64=''; imagePreviewWrap.innerHTML='';
    selectedTags = new Set(['pilgrimage']); renderTagButtons();
    visitDate.value = today;

    // show "other spots" overlay and refresh map & timeline
    loadPostsToMap();
    renderTimeline();
    showOtherSpots(post);
    showView('map');
    alert('投稿が保存されました（ローカル保存）');
  });

  // search
  searchBtn.addEventListener('click', ()=>{
    const q = (searchInput.value || '').toLowerCase();
    if(!q) return;
    const posts = JSON.parse(localStorage.getItem('posts')||'[]');
    const found = posts.find(p => (p.title||'').toLowerCase().includes(q) || (p.location||'').toLowerCase().includes(q));
    if(found && found.lat && found.lng){
      map.flyTo([found.lat,found.lng], 13, {duration:0.6});
    } else alert('一致する投稿が見つかりませんでした');
  });

  // fab menu
  mainFab.addEventListener('click', ()=> fabMenu.classList.toggle('hidden'));
  fabMap.addEventListener('click', ()=> { fabMenu.classList.add('hidden'); showView('map'); timelinePanel.classList.remove('open'); });
  fabTimeline.addEventListener('click', ()=> { fabMenu.classList.add('hidden'); showView('map'); showTimeline(); });
  fabPost.addEventListener('click', ()=> { fabMenu.classList.add('hidden'); showView('post'); });

  backToMapBtn.addEventListener('click', ()=> showView('map'));

  // Views
  function showView(name){
    if(name==='map'){
      document.getElementById('mapView').classList.add('active');
      document.getElementById('postView').classList.remove('active');
      setTimeout(()=> map && map.invalidateSize(), 200);
    } else {
      document.getElementById('mapView').classList.remove('active');
      document.getElementById('postView').classList.add('active');
      // when entering post, fetch geolocation only if inputs empty
      if(!latInput.value || !lngInput.value){
        // do not auto-request; user can press locBtn
      }
    }
  }

  // Map init
  function initMap(){
    map = L.map('map', { zoomControl:true }).setView([33.6,133.5], 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:19 }).addTo(map);
    markersLayer = L.layerGroup().addTo(map);
    // preload posts.json into localStorage if empty
    preloadPostsJson().then(()=> loadPostsToMap());
  }

  // preload posts.json from server file if localStorage empty
  async function preloadPostsJson(){
    if(localStorage.getItem('posts')) return;
    try{
      const res = await fetch('posts.json');
      if(!res.ok) throw new Error('no posts.json');
      const arr = await res.json();
      // map to internal shape (keep tags)
      const mapped = arr.map(p=>({
        id: p.id || Date.now()+Math.random(),
        user: p.user || 'seed',
        title: p.title || '',
        comment: p.comment || '',
        location: p.location || '',
        lat: p.lat || null,
        lng: p.lng || null,
        tags: p.tags || p.tags || [],
        visitDate: p.date || p.visit || today,
        createdAt: new Date().toISOString(),
        image: p.image || ''
      }));
      localStorage.setItem('posts', JSON.stringify(mapped));
    }catch(e){
      console.warn('posts.json preload failed', e);
    }
  }

  // draw posts
  function loadPostsToMap(){
    markersLayer.clearLayers();
    const posts = JSON.parse(localStorage.getItem('posts')||'[]');
    posts.forEach(p=>{
      if(p.lat && p.lng){
        const m = L.marker([p.lat, p.lng]).addTo(markersLayer);
        const popup = buildPopupHtml(p);
        m.bindPopup(popup);
      }
    });
  }

  function buildPopupHtml(p){
    let html = `<strong>${escapeHtml(p.title||p.location||'投稿')}</strong><br>`;
    if(p.location) html += `${escapeHtml(p.location)}<br>`;
    if(p.visitDate) html += `訪問日: ${escapeHtml(p.visitDate)}<br>`;
    if(p.tags && p.tags.length) html += `<div style="margin-top:6px">${p.tags.map(t=> `<span class="badge mini" data-tag="${escapeHtml(t)}">${escapeHtml(getTagLabel(t)||t)}</span>`).join(' ')}</div>`;
    if(p.comment) html += `<div style="margin-top:6px">${escapeHtml(p.comment)}</div>`;
    if(p.image) html += `<div style="margin-top:6px;"><img src="${p.image}" style="width:140px;border-radius:8px;"></div>`;
    // "この作品の別の聖地はこちら！" — find others with same title or same tag
    const others = findRelatedPosts(p);
    if(others.length){
      html += `<div style="margin-top:8px;"><strong>この作品の別の聖地はこちら！</strong><ul>`;
      others.forEach(o=>{
        html += `<li><a href="#" data-id="${o.id}" class="nav-other">${escapeHtml(o.title||o.location)}</a></li>`;
      });
      html += `</ul></div>`;
    }
    return html;
  }

  // find related posts
  function findRelatedPosts(p){
    const posts = JSON.parse(localStorage.getItem('posts')||'[]');
    return posts.filter(o=>{
      if(o.id === p.id) return false;
      if(p.title && o.title && o.title === p.title) return true;
      // tag intersection
      if(p.tags && o.tags && p.tags.some(t=> o.tags.includes(t))) return true;
      return false;
    }).slice(0,6);
  }

  // when clicking nav-other in popups (delegate)
  document.addEventListener('click', (ev)=>{
    const a = ev.target.closest('.nav-other');
    if(!a) return;
    ev.preventDefault();
    const id = Number(a.dataset.id);
    const posts = JSON.parse(localStorage.getItem('posts')||'[]');
    const found = posts.find(x=> x.id === id);
    if(found && found.lat && found.lng){
      timelinePanel.classList.remove('open');
      map.flyTo([found.lat, found.lng], 13, {duration:0.6});
    } else {
      alert('位置情報がありません');
    }
  });

  // timeline rendering
  function renderTimeline(){
    timelineList.innerHTML = '';
    const posts = JSON.parse(localStorage.getItem('posts')||'[]').slice().reverse();
    if(posts.length===0){ timelineList.innerHTML = '<p>投稿がまだありません</p>'; return; }
    posts.forEach(p=>{
      const div = document.createElement('div'); div.className = 'tl-item';
      let title = escapeHtml(p.title || p.location || '（無題）');
      let thumbnails = p.image ? `<img src="${p.image}">` : '';
      div.innerHTML = `<strong>${title}</strong>
        <div style="font-size:13px;color:#666;margin-top:6px;">${p.visitDate?`訪問日: ${escapeHtml(p.visitDate)} • `:''}${new Date(p.createdAt||p.id||Date.now()).toLocaleString()}</div>
        <div style="margin-top:6px;">${escapeHtml(p.comment||'')}</div>
        ${thumbnails}
        <div style="margin-top:6px">${(p.tags||[]).map(t=> `<span class="badge" data-tag="${escapeHtml(t)}">${escapeHtml(getTagLabel(t)||t)}</span>`).join(' ')}</div>
      `;
      div.addEventListener('click', ()=>{
        if(p.lat && p.lng){ timelinePanel.classList.remove('open'); map.flyTo([p.lat,p.lng], 13, {duration:0.6}); }
        else alert('この投稿には位置情報がありません');
      });
      // also append "この作品の別の聖地はこちら！" directly in card
      const others = findRelatedPosts(p);
      if(others.length){
        const box = document.createElement('div');
        box.style.marginTop = '8px';
        box.innerHTML = `<strong>この作品の別の聖地はこちら！</strong><ul>${others.map(o=>`<li><a href="#" data-id="${o.id}" class="nav-other">${escapeHtml(o.title||o.location)}</a></li>`).join('')}</ul>`;
        div.appendChild(box);
      }
      timelineList.appendChild(div);
    });
  }

  // show timeline
  function showTimeline(){
    timelinePanel.classList.add('open'); renderTimeline();
  }

  // helper: get tag label from id or return id
  function getTagLabel(id){
    const t = TAGS.find(x=> x.id === id);
    return t ? t.label : null;
  }

  function escapeHtml(s){ if(!s) return ''; return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

  // show other spots overlay (simple alert-like panel)
  function showOtherSpots(post){
    const related = findRelatedPosts(post);
    if(related.length === 0) return;
    // small modal
    const modal = document.createElement('div');
    modal.className = 'modal temp';
    modal.innerHTML = `<div class="modal-content"><h3>この作品の別の聖地はこちら！</h3><ul>${related.map(r=>`<li><a href="#" data-id="${r.id}" class="nav-other">${escapeHtml(r.title||r.location)}</a></li>`).join('')}</ul><div style="margin-top:12px;text-align:right;"><button id="closeTempModal" class="btn-secondary">閉じる</button></div></div>`;
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    document.getElementById('closeTempModal').addEventListener('click', ()=> { modal.remove(); });
  }

  // utility: compress image file to dataURL (maxWidth, quality)
  function compressImageFile(file, maxWidth=1024, quality=0.7){
    return new Promise((resolve, reject)=>{
      const img = new Image();
      const fr = new FileReader();
      fr.onload = () => { img.src = fr.result; };
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, maxWidth / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img,0,0,canvas.width,canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      fr.onerror = reject;
      img.onerror = reject;
      fr.readAsDataURL(file);
    });
  }

  // preload posts file and then init map
  initMap();

}); // DOMContentLoaded end
