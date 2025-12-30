import { supabase, saveLog } from "./utils.js";
import { map } from "./map.js";
import { addTimelineItem } from "./timeline.js";

const PIN_COLORS = {
  emotion: "pink",
  holy: "blue",
  walk: "green",
  lively: "gold",
  future: "black"
};

let lat = null;
let lng = null;

const modal = document.getElementById("postModal");

document.getElementById("fab").onclick = () => {
  modal.classList.remove("hidden");
  saveLog("open_post_modal");
};

document.getElementById("cancel").onclick = () => {
  modal.classList.add("hidden");
};

document.getElementById("getLocation").onclick = () => {
  navigator.geolocation.getCurrentPosition(pos => {
    lat = pos.coords.latitude;
    lng = pos.coords.longitude;
    alert("現在地取得");
  });
};

async function uploadPhoto(file) {
  const name = `${Date.now()}_${file.name}`;
  await supabase.storage.from("post-images").upload(name, file);
  return supabase.storage.from("post-images").getPublicUrl(name).data.publicUrl;
}

document.getElementById("submit").onclick = async () => {
  const title = document.getElementById("title").value;
  const comment = document.getElementById("comment").value;
  const genre = document.getElementById("genre").value;
  const file = document.getElementById("photo").files[0];
  const username = localStorage.getItem("username");

  if (!title || !lat || !lng) return alert("必須項目不足");

  let image_url = null;
  if (file) image_url = await uploadPhoto(file);

  const { data } = await supabase.from("posts").insert([{
    title, comment, lat, lng, genre, image_url, username
  }]).select().single();

  addPin(data);
  addTimelineItem(data);
  saveLog("post_created");

  modal.classList.add("hidden");
};

function addPin(post) {
  const size = post.image_url ? 20 : 12;

  const icon = L.divIcon({
    html: `<div style="
      background:${PIN_COLORS[post.genre]};
      width:${size}px;
      height:${size}px;
      border-radius:50%;
      border:2px solid white;"></div>`
  });

  L.marker([post.lat, post.lng], { icon })
    .addTo(map)
    .bindPopup(`<b>${post.title}</b><br>${post.comment || ""}`);
}
