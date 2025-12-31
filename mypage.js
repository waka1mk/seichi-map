const box = document.getElementById("myposts");
const me = localStorage.getItem("user_name");

async function loadMyPosts() {
  const posts = await supabase.from("posts").select();
  box.innerHTML = "";

  posts
    .filter(p => p.user_name === me)
    .forEach(p => {
      const div = document.createElement("div");
      div.className = "post";
      div.innerHTML = `
        <p>${p.content}</p>
        ${p.image_url ? `<img src="${p.image_url}" style="width:100%">` : ""}
        <div>❤️ ${p.likes || 0}</div>
      `;
      box.appendChild(div);
    });
}

loadMyPosts();
