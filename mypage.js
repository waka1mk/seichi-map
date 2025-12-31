const box = document.getElementById("myposts");
const me = localStorage.getItem("user_name");

async function loadMyPosts() {
  const posts = await supabase.from("posts").select();
  posts.filter(p => p.user_name === me).forEach(p => {
    const div = document.createElement("div");
    div.textContent = p.comment;
    box.appendChild(div);
  });
}

loadMyPosts();
