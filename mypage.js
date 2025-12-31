async function loadMyPosts() {
  const user = localStorage.getItem("user_name") || "guest";

  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("user_name", user);

  const list = document.getElementById("list");

  data.forEach(p => {
    const div = document.createElement("div");
    div.textContent = p.title;
    list.appendChild(div);
  });
}

loadMyPosts();
