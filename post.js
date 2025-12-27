import { supabase } from "./utils.js";

const submitBtn = document.getElementById("submitPost");
const cancelBtn = document.getElementById("cancelPost");

submitBtn.addEventListener("click", async () => {
  const title = document.getElementById("title").value;
  const comment = document.getElementById("comment").value;

  if (!title || !comment) {
    alert("タイトルと感想を入力してください");
    return;
  }

  const { error } = await supabase
    .from("posts")
    .insert([
      {
        title: title,
        comment: comment,
        lat: 35.681236,
        lng: 139.767125
      }
    ]);

  if (error) {
    console.error(error);
    alert("保存に失敗しました");
  } else {
    alert("投稿を保存しました！");
    location.href = "index.html";
  }
});

cancelBtn.addEventListener("click", () => {
  location.href = "index.html";
});
