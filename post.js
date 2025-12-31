import { supabase } from "./supabase.js";

let lat = null;
let lng = null;

document.getElementById("getLocation").onclick = () => {
  navigator.geolocation.getCurrentPosition(pos => {
    lat = pos.coords.latitude;
    lng = pos.coords.longitude;
    alert("現在地を取得しました");
  });
};

document.getElementById("submit").onclick = async () => {
  const comment = document.getElementById("comment").value;
  const user_name = localStorage.getItem("user_name");

  if (!comment || lat === null || lng === null) {
    alert("未入力があります");
    return;
  }

  const { error } = await supabase.from("posts").insert([{
    user_name,
    comment,
    lat,
    lng,
    likes: 0
  }]);

  if (error) {
    alert("投稿失敗");
    return;
  }

  location.href = "index.html";
};
