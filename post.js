// post.js
import { supabase } from "./utils.js";

const form = document.getElementById("post-form");
const locBtn = document.getElementById("get-location");

let lat = null;
let lng = null;

locBtn.onclick = () => {
  navigator.geolocation.getCurrentPosition(
    pos => {
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
      alert("現在地を取得しました");
    },
    () => alert("位置情報取得失敗")
  );
};

form.onsubmit = async (e) => {
  e.preventDefault();

  if (!lat || !lng) {
    alert("位置情報を取得してください");
    return;
  }

  const title = document.getElementById("title").value;
  const comment = document.getElementById("comment").value;

  const { error } = await supabase.from("posts").insert([
    { title, comment, latitude: lat, longitude: lng }
  ]);

  if (error) {
    console.error(error);
    alert("保存失敗");
    return;
  }

  alert("投稿完了！");
  location.href = "index.html";
};
