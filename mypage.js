// mypage.js
const userName = localStorage.getItem("user_name");
const myPostsEl = document.getElementById("my-posts");

if (!userName) {
  myPostsEl.innerText = "ユーザー名が未設定です";
} else {
  loadMyPosts();
}

async function loadMyPosts() {
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("user_name", userName)
    .order("created_at", { ascending: false });

  myPostsEl.innerHTML = "";

  data.forEach(p => {
    const div = document.createElement("div");
    div.className = "post-item";
    div.innerHTML = `
      <strong>${p.title ?? "無題"}</strong>
      <p>${p.comment ?? ""}</p>
      ❤️ ${p.likes ?? 0}
    `;
    myPostsEl.appendChild(div);
  });
}
