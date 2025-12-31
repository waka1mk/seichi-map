import { supabase } from "./supabase.js";

const userName = localStorage.getItem("user_name");
const box = document.getElementById("my-posts");
document.getElementById("username").textContent = `ログイン中：${userName}`;

async function loadMyPosts() {
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("user_name", userName)
    .order("id", { ascending: false });

  box.innerHTML = "";

  if (data.length === 0) {
    box.innerHTML = "<p>投稿がありません</p>";
    return;
  }

  data.forEach(p => {
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `
      <p>${p.comment}</p>
      <p>❤️ ${p.likes}</p>
      <hr>
    `;
    box.appendChild(div);
  });
}

loadMyPosts();
