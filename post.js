import { supabase } from "./utils.js";

const modal = document.getElementById("postModal");
const fab = document.getElementById("fab");
const submit = document.getElementById("submit");
const cancel = document.getElementById("cancel");

fab.onclick = () => modal.classList.remove("hidden");
cancel.onclick = () => modal.classList.add("hidden");

// 投稿
submit.onclick = async () => {
  if (!navigator.geolocation) {
    alert("位置情報が使えません");
    return;
  }

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    const title = document.getElementById("title").value;
    const comment = document.getElementById("comment").value;

    const { error } = await supabase.from("posts").insert({
      title,
      comment,
      lat,
      lng,
    });

    if (error) {
      alert("投稿失敗");
      console.error(error);
      return;
    }

    // ★ 即マップ反映
    window.addPostMarker(lat, lng, title, comment);
    modal.classList.add("hidden");
  });
};
