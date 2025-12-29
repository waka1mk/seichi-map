import { supabase } from "./utils.js";
import { map } from "./map.js";

let lat = null;
let lng = null;

window.addEventListener("DOMContentLoaded", () => {
  const fab = document.getElementById("fab");
  const modal = document.getElementById("postModal");
  const cancel = document.getElementById("cancel");
  const submit = document.getElementById("submit");
  const getLocation = document.getElementById("getLocation");

  fab.onclick = () => modal.classList.remove("hidden");
  cancel.onclick = () => modal.classList.add("hidden");

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

    if (!lat || !lng) {
      alert("現在地を取得してください");
      return;
    }

    const { data, error } = await supabase.from("posts").insert([
      { title, comment, lat, lng }
    ]).select().single();

    if (error) {
      alert("投稿失敗");
      return;
    }

    // 即ピン追加
    L.marker([lat, lng])
      .addTo(map)
      .bindPopup(`<b>${title}</b><br>${comment}`)
      .openPopup();

    modal.classList.add("hidden");
  };
});
