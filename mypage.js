const user = localStorage.getItem("username");

async function loadMyPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("user_name", user);

  const container = document.getElementById("posts");

  data.forEach(p => {
    const div = document.createElement("div");
    div.innerHTML = `<h3>${p.title}</h3><p>${p.content}</p>`;
    container.appendChild(div);
  });
}

loadMyPosts();
