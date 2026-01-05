const container = document.getElementById("mypage-content");
const user_name = localStorage.getItem("user_name");

if (!container) {
  console.error("mypage-content が存在しません");
}

async function loadMyPosts() {
  const { data, error } = await supabaseClient
    .from("posts")
    .select("*")
    .eq("user_name", user_name);

  if (error) {
    console.error(error);
    return;
  }

  container.innerHTML = `<h2>${user_name} の投稿</h2>`;

  data.forEach(p => {
    const div = document.createElement("div");
    div.className = "post-item";
    div.innerHTML = `<p>${p.content}</p>`;
    container.appendChild(div);
  });
}

loadMyPosts();
