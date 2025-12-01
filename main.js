// ====== 地図表示 ======
const map = L.map('map').setView([35.6812, 139.7671], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// ====== 投稿ボタン操作 ======
const modal = document.getElementById('modal');
document.getElementById('openModal').addEventListener('click', () => {
  modal.style.display = 'block';
});
document.getElementById('closeModal').addEventListener('click', () => {
  modal.style.display = 'none';
});

// ====== 現在地取得 ======
let currentLocation = null;
document.getElementById('getLocation').addEventListener('click', () => {
  if (!navigator.geolocation) {
    alert('位置情報が使えません');
    return;
  }
  navigator.geolocation.getCurrentPosition(pos => {
    currentLocation = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
    };
    map.setView([currentLocation.lat, currentLocation.lng], 16);
    L.marker([currentLocation.lat, currentLocation.lng]).addTo(map)
      .bindPopup("現在地 📍").openPopup();
  });
});

// ====== Supabase 読込＆投稿 ======
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_PUBLIC_API_KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

// DBからピンを表示
async function loadPins() {
  const { data } = await supabase.from("posts").select("*");
  data.forEach(p => {
    L.marker([p.lat, p.lng]).addTo(map)
      .bindPopup(`<b>${p.title}</b><br>${p.description}`);
  });
}
loadPins();

// 新規投稿
document.getElementById('submitPost').addEventListener('click', async () => {
  const title = document.getElementById('title').value;
  const desc = document.getElementById('desc').value;
  if (!currentLocation) {
    alert("位置情報を取得してください");
    return;
  }

  await supabase.from("posts").insert({
    title,
    description: desc,
    lat: currentLocation.lat,
    lng: currentLocation.lng,
  });

  alert("投稿完了！");
  modal.style.display = "none";
  location.reload();
});
