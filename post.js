import { supabase, addPin } from "./utils.js";
import { map } from "./map.js";

const submit = document.getElementById("submit");

submit.addEventListener("click", async () => {
  const title = document.getElementById("title").value;
  const comment = document.getElementById("comment").value;

  // 位置情報取得
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    const { data, error } = await supabase
      .from("posts")
      .insert([{ title, comment, lat, lng }])
      .select()
      .single();

    if (error) {
      alert("投稿失敗");
      console.error(error);
      return;
    }

    // 🌟 即マップ反映
    addPin(map, data);

    document.getElementById("postModal").classList.add("hidden");
  });
});
