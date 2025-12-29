let lat = null;
let lng = null;
let imageUrl = null;

// 現在地
document.getElementById("getLocation").onclick = () => {
  navigator.geolocation.getCurrentPosition(pos => {
    lat = pos.coords.latitude;
    lng = pos.coords.longitude;
    alert("現在地を取得しました");
  });
};

// 画像アップロード
document.getElementById("image").onchange = async e => {
  const file = e.target.files[0];
  if (!file) return;

  const name = crypto.randomUUID();
  await supabaseClient.storage.from("post-images").upload(name, file);
  imageUrl = supabaseClient.storage.from("post-images")
    .getPublicUrl(name).data.publicUrl;
};

// 投稿
document.getElementById("submitPost").onclick = async () => {
  const title = document.getElementById("title").value;
  const comment = document.getElementById("comment").value;

  const { error } = await supabaseClient.from("posts").insert({
    title,
    comment,
    lat,
    lng,
    image_url: imageUrl,
  });

  if (error) {
    alert("投稿失敗");
    console.error(error);
    return;
  }

  // 即ピン追加
  L.marker([lat, lng]).addTo(map).bindPopup(title);

  document.getElementById("postModal").classList.add("hidden");
};
