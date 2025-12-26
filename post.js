// post.js
import { supabase } from "./utils.js";

const form = document.getElementById("postForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const f = e.target;

  const { error } = await supabase
    .from("posts")
    .insert([{
      title: f.title.value,
      place: f.place.value,
      prefecture: f.prefecture.value,
      latitude: parseFloat(f.lat.value),
      longitude: parseFloat(f.lng.value),
    }]);

  if (error) {
    alert("保存失敗");
    console.error(error);
  } else {
    location.href = "index.html"; // ← これが無いと「保存されたのに消えた」に見える
  }
});
