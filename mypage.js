(function () {
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
      mypage.innerHTML += `
        <div class="card">
          <h3>${post.title ?? "（無題）"}</h3>
          <p>${post.comment ?? ""}</p>
          <span>❤️ ${post.likes}</span>
        </div>
      `;
    });
  }

  loadMyPage();
})();
