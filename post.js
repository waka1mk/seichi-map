// =============================
// ① Supabase（★あなたの値を入れる）
// =============================
const SUPABASE_URL = "https://ncqfaerpznsopgbpiiso.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jcWZhZXJwem5zb3BnYnBpaXNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NDMwMzMsImV4cCI6MjA3OTAxOTAzM30.K3GOyrE3XVqJtF2fNXYgromkU93es8ag660nHO1Db1g";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// =============================
// ② DOM
// =============================
const form = document.getElementById("post-form");
const getLocationBtn = document.getElementById("get-location");

let currentLat = null;
let currentLng = null;

// =============================
// ③ 現在地取得
// =============================
getLocationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("位置情報が使えません");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      currentLat = pos.coords.latitude;
      currentLng = pos.coords.longitude;
      alert("現在地を取得しました");
      console.log("LAT LNG:", currentLat, currentLng);
    },
    (err) => {
      alert("位置情報の取得に失敗しました");
      console.error(err);
    }
  );
});

// =============================
// ④ 投稿送信
// =============================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // 入力値
  const title = document.getElementById("title").value;
  const place = document.getElementById("place").value;
  const tag = document.getElementById("tag").value;

  // 🔴 必須チェック
  if (!title || !place) {
    alert("タイトルと場所を入力してください");
    return;
  }

  if (currentLat === null || currentLng === null) {
    alert("📍現在地を取得してください");
    return;
  }

  // =============================
  // ⑤ Supabase insert
  // =============================
  const { error } = await supabase.from("posts").insert([
    {
      title: title,
      place: place,
      tag: tag,
      latitude: currentLat,
      longitude: currentLng,
      visited_at: new Date(),
    },
  ]);

  // =============================
  // ⑥ 結果
  // =============================
  if (error) {
    console.error("❌ 保存失敗:", error);
    alert("投稿に失敗しました（console を確認）");
    return;
  }

  alert("✅ 投稿完了！");
  location.href = "index.html"; // 地図へ戻る
});
