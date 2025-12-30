import { supabase } from "./supabase.js";
import { map } from "./map.js";

let lat = null;
let lng = null;

document.getElementById("getLocation").onclick = () => {
  navigator.geolocation.getCurrentPosition(pos => {
    lat = pos.coords.latitude;
    lng = pos.coords.longitude;
    alert("位置取得OK");
  });
};

document.getElementById("submit").onclick = async () => {
  const title = document.getElementById("title").value;
  const comment = document.getElementById("comment").value;
  const user_name = localStorage.getItem("user_name") || "demo";

  if (!lat || !lng) return alert("位置を取得してね");

  const { error } = await supabase
    .from("posts")
    .insert([{ title, comment, lat, lng, user_name }]);

  if (error) {
    alert("投稿失敗");
    return;
  }

  L.circleMarker([lat, lng], {
    radius: 8,
    color: "#4CAF50",
    fillOpacity: 0.8
  })
    .addTo(map)
    .bindPopup(title)
    .openPopup();
};
