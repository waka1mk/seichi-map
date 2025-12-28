// post.js
import { supabase } from "./utils.js";

const submitBtn = document.getElementById("submit");

let currentLat = null;
let currentLng = null;

// ① 位置情報取得
navigator.geolocation.getCurrentPosition(
  (pos) => {
    currentLat = pos.coords.latitude;
    currentLng = pos.coords.longitude;
    console.log("位置情報OK", currentLat, currentLng);
  },
  () => {
    alert("位置情報が取得できません");
  }
);

// ② 投稿処理
submitBtn.addEventListener("click", async () => {
  const title = document.getElementById("title").value;
  const comment = document.getElementById("comment").value;

  if (!title || !comment) {
    alert("未入力があります");
    return;
  }

  const { error } = await supabase.from("posts").insert([
    {
      title,
      comment,
      lat: currentLat,
      lng: currentLng,
    },
  ]);

  if (error) {
    console.error(error);
    alert("保存失敗");
  } else {
    console.log("保存成功");
    alert("投稿しました！");
    document.getElementById("postModal").classList.add("hidden");
  }
});
