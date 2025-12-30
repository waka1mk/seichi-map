// post.js
document.addEventListener("DOMContentLoaded", () => {
  const submit = document.getElementById("submit");
  const getLocation = document.getElementById("getLocation");

  // ここで存在チェック（重要）
  if (!submit || !getLocation) {
    console.error("post.html に必要な要素がありません");
    return;
  }

  let lat = null;
  let lng = null;

  getLocation.onclick = () => {
    navigator.geolocation.getCurrentPosition(pos => {
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
      alert("現在地を取得しました");
    });
  };

  submit.onclick = async () => {
    const title = document.getElementById("title").value;
    const comment = document.getElementById("comment").value;
    const user_name = localStorage.getItem("user_name") || "demo";

    if (!lat || !lng) {
      alert("先に現在地を取得してね");
      return;
    }

    const { error } = await supabase
      .from("posts")
      .insert([{ title, comment, lat, lng, user_name }]);

    if (error) {
      alert("投稿に失敗しました");
      console.error(error);
      return;
    }

    alert("投稿できました！");
    location.href = "index.html";
  };
});
