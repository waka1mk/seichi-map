import { supabase } from "./utils.js";

const submitBtn = document.getElementById("submit");

submitBtn.addEventListener("click", async () => {
  const title = document.getElementById("title").value;
  const comment = document.getElementById("comment").value;

  // 仮の位置情報（東京駅）
  const lat = 35.681236;
  const ing = 139.767125;

  const { error } = await supabase
    .from("posts")
    .insert([
      {
        title,
        comment,
        lat,
        ing, // ← ここ重要
      }
    ]);

  if (error) {
    console.error("投稿失敗", error);
    alert("投稿に失敗しました");
  } else {
    alert("投稿成功！");
    document.getElementById("postModal").classList.add("hidden");
  }
});
