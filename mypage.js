const box = document.getElementById("mypage");

async function loadMyPage() {
  const { data } = await window.supabaseClient
    .from("posts")
    .select("*");

  box.innerHTML = "";

  data.forEach(p => {
    box.innerHTML += `
      <div class="card">
        <strong>${p.title}</strong>
        <p>${p.content}</p>
        <span>❤️ ${p.likes}</span>
      </div>
    `;
  });
}

loadMyPage();
