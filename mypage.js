const box = document.getElementById("myposts");
if (!box) return;

async function loadMyPosts() {
  const { data, error } = await window.supabaseClient
    .from("posts")
    .select("*");

  if (error) {
    console.error(error);
    box.innerHTML = "<p>読み込みに失敗しました</p>";
    return;
  }

  box.innerHTML = "";

  data?.forEach(p => {
    box.innerHTML += `
      <div class="card">
        <p>${p.content || "内容なし"}</p>
        <span>❤️ ${p.likes ?? 0}</span>
      </div>
    `;
  });
}

loadMyPosts();
