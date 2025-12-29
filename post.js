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
    navigator.geolocation.getCurrentPosition(
      pos => {
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
        alert("現在地を取得しました");
      },
      () => {
        alert("位置情報の取得に失敗しました");
      }
    );
  };

  submit.onclick = async () => {
    const title = document.getElementById("title").value.trim();
    const comment = document.getElementById("comment").value.trim();

    if (!title || !comment) {
      alert("タイトルとコメントを入力してください");
      return;
    }

    if (lat === null || lng === null) {
      alert("現在地を取得してください");
      return;
    }

    const { data, error } = await supabase
      .from("posts")
      .insert([
        { title, comment, lat, lng }
      ])
      .select();

    if (error) {
      console.error(error);
      alert("投稿に失敗しました");
      return;
    }

    // 即座にピン反映
    L.marker([lat, lng])
      .addTo(map)
      .bindPopup(`<b>${title}</b><br>${comment}`)
      .openPopup();

    modal.classList.add("hidden");
  };
});
