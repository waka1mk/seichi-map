const myposts = document.getElementById("myposts");

async function loadMyPosts() {
  const { data, error } = await window.supabaseClient
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    myposts.innerHTML = "読み込み失敗";
    return;
  }

  myposts.innerHTML = "";
  data.forEach(post => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <p>${post.content || "内容なし"}</p>
      <small>❤️ ${post.likes ?? 0}</small>
    `;
    myposts.appendChild(div);
  });
}

loadMyPosts();
