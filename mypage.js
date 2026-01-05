const myPostsEl = document.getElementById("my-posts");
if (!myPostsEl) return;

const userName = localStorage.getItem("user_name");

async function loadMyPosts() {
  const { data } = await window.supabase
    .from("posts")
    .select("*")
    .eq("user_name", userName);

  myPostsEl.innerHTML = "";

  data.forEach(p => {
    const div = document.createElement("div");
    div.className = "post-card";
    div.innerText = p.comment ?? "";
    myPostsEl.appendChild(div);
  });
}

loadMyPosts();
