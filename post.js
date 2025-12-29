let lat = null;
let lng = null;

// 現在地取得
document.getElementById("getLocation").onclick = () => {
  navigator.geolocation.getCurrentPosition(pos => {
    lat = pos.coords.latitude;
    lng = pos.coords.longitude;
    alert("現在地を取得しました");
  });
};

// 投稿
document.getElementById("submitPost").onclick = async () => {
  const title = document.getElementById("title").value;
  const comment = document.getElementById("comment").value;

  if (!lat || !lng) {
    alert("先に現在地を取得してください");
    return;
  }

  const { error } = await supabaseClient.from("posts").insert({
    title,
    comment,
    lat,
    ing: lng, // ← DB列名に合わせる（lngではない）
  });

  if (error) {
    console.error(error);
    alert("投稿に失敗しました");
    return;
  }

  // 即マップ反映
  L.marker([lat, lng]).addTo(map).bindPopup(title);

  document.getElementById("postModal").classList.add("hidden");
};
