const box = document.getElementById("myposts");

if (box) {
  async function loadMyPosts() {
    const { data } = await window.supabaseClient
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    box.innerHTML = "";

    data?.forEach(p => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <h3>${p.title || "場所名なし"}</h3>
        <p>${p.content || "内容なし"}</p>
        <span>❤️ ${p.likes ?? 0}</span>
      `;
      box.appendChild(div);
    });
  }

  loadMyPosts();
}
