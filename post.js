import { supabase } from "./utils.js";
import { map } from "./map.js";

let lat = null;
let lng = null;

const fab = document.getElementById("fab");
const modal = document.getElementById("postModal");

fab.onclick = () => modal.classList.remove("hidden");
cancel.onclick = () => modal.classList.add("hidden");

getLocation.onclick = () => {
  navigator.geolocation.getCurrentPosition(pos => {
    lat = pos.coords.latitude;
    lng = pos.coords.longitude;
    alert("現在地OK");
  });
};

submit.onclick = async () => {
  const title = document.getElementById("title").value;
  const comment = document.getElementById("comment").value;
  const genre = document.getElementById("genre").value;

  const { data, error } = await supabase.from("posts").insert([{
    title, comment, genre, lat, lng,
    username: localStorage.getItem("username") || "demo"
  }]).select().single();

  if (error) {
    alert("投稿失敗");
    return;
  }

  const color =
    genre === "アニメ" ? "red" :
    genre === "ゲーム" ? "blue" : "green";

  L.circleMarker([lat, lng], {
    radius: 10,
    color
  }).addTo(map).bindPopup(title);

  modal.classList.add("hidden");
};
