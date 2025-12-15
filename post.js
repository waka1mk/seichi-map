// =============================
// ① あなたが用意するもの（ここを書き換える）
// =============================
const SUPABASE_URL = "https://ncqfaerpznsopgbpiiso.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jcWZhZXJwem5zb3BnYnBpaXNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NDMwMzMsImV4cCI6MjA3OTAxOTAzM30.K3GOyrE3XVqJtF2fNXYgromkU93es8ag660nHO1Db1g";

// =============================
// ② Supabase 初期化
// =============================
const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// =============================
// ③ DOM取得
// =============================
const form = document.getElementById("post-form");
const imageInput = document.getElementById("image");
const locationBtn = document.getElementById("get-location");

let currentLat = null;
let currentLng = null;
let uploadedImageUrl = null;

// =============================
// ④ 現在地取得ボタン
// =============================
locationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("位置情報が使えません");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      currentLat = pos.coords.latitude;
      currentLng = pos.coords.longitude;
      alert("現在地を取得しました");
    },
    () => {
      alert("現在地の取得に失敗しました");
    }
  );
});

// =============================
// ⑤ 画像アップロード（Supabase Storage）
// =============================
imageInput.addEventListener("change", async () => {
  const file = imageInput.files[0];
  if (!file) return;

  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("post-images")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    alert("画像アップロード失敗");
    console.error(error);
    return;
  }

  const { data } = supabase.storage
    .from("post-images")
    .getPublicUrl(fileName);

  uploadedImageUrl = data.publicUrl;
  alert("画像アップロード完了");
});

// =============================
// ⑥ 投稿送信
// =============================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const place = document.getElementById("place").value;
  const tag = document.getElementById("tag").value;

  if (!currentLat || !currentLng) {
    alert("現在地を取得してください");
    return;
  }

  const { error } = await supabase.from("posts").insert([
    {
      title,
      place,
      tag,
      latitude: currentLat,
      longitude: currentLng,
      image_url: uploadedImageUrl,
      visited_at: new Date(),
    },
  ]);

  if (error) {
    alert("投稿に失敗しました");
    console.error(error);
    return;
  }

  alert("投稿完了！");
  window.location.href = "index.html";
});
