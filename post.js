import { supabase } from "./utils.js";

const submitBtn = document.getElementById("submit");
const modal = document.getElementById("postModal");

submitBtn.addEventListener("click", async () => {
  const title = document.getElementById("title").value.trim();
  const comment = document.getElementById("comment").value.trim();

  if (!title || !comment) {
    alert("作品名と感想を入力してください");
    return;
  }

  // 位置情報取得
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      const { error } = await supabase
        .from("posts")
        .insert([
          {
            title,
            comment,
            lat,
            lng
          }
        ]);

      if (error) {
        alert("投稿に失敗しました");
        console.error(error);
        return;
      }

      // 成功
      modal.classList.add("hidden");
      document.getElementById("title").value = "";
      document.getElementById("comment").value = "";
      alert("投稿しました！");
    },
    () => {
      alert("位置情報を取得できませんでした");
    }
  );
});
