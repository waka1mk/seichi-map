import { supabase } from "./utils.js";

const submitBtn = document.getElementById("submit");

submitBtn.addEventListener("click", async () => {
  const title = document.getElementById("title").value;
  const comment = document.getElementById("comment").value;

  if (!title) {
    alert("作品名を入力してください");
    return;
  }

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    const { error } = await supabase.from("posts").insert([
      {
        title,
        comment,
        lat,
        lng
      }
    ]);

    if (error) {
      alert("投稿失敗");
      console.error(error);
      return;
    }

    alert("投稿完了！");
    location.reload();
  });
});
