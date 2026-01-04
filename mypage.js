const name = localStorage.getItem("user_name");
document.getElementById("username").innerText = name;

const postsEl = document.getElementById("posts");

async function loadMyPosts() {
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("user_name", name)
    .order("created_at", { ascending: false });

  postsEl.innerHTML = "";

  data.forEach(p => {
    const div = document.createElement("div");
    div.className = "post-card";
    div.innerHTML = `
      <h3>${p.title}</h3>
      <p>${p.comment}</p>
      ❤️ ${p.likes ?? 0}
    `;
    postsEl.appendChild(div);
  });
}

loadMyPosts();

/* タブ切り替え */
document.querySelectorAll(".tab").forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.add("hidden"));

    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.remove("hidden");
  };
});
