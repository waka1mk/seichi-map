(() => {
  const mypage = document.getElementById("mypage");
  if (!mypage) return;

  async function loadMyPage() {
    const { data, error } = await window.supabaseClient
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    mypage.innerHTML = "";

    data.forEach(post => {
      const title = post.title || "（場所名未設定）";
      const comment =
        post.comment && post.comment.trim() !== ""
          ? post.comment
          : "（コメントはまだありません）";

      mypage.innerHTML += `
        <div class="card">
          <h3>${title}</h3>
          <p>${comment}</p>
          <span>❤️ ${post.likes ?? 0}</span>
        </div>
      `;
    });
  }

  loadMyPage();
})();
