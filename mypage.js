const box = document.getElementById("myposts");
if (!box) return;

async function loadMyPosts() {
  const { data } = await window.supabaseClient
    .from("posts")
    .select("*");

  box.innerHTML = "";
  data?.forEach(p => {
    box.innerHTML += `<div class="card">${p.content}</div>`;
  });
}

loadMyPosts();
