(function () {
  const form = document.getElementById("post-form");
  if (!form) return;

  const lat = sessionStorage.getItem("postLat");
  const lng = sessionStorage.getItem("postLng");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title")?.value;
    const comment = document.getElementById("comment")?.value;

    if (!title || !lat || !lng) {
      alert("場所名と位置情報は必須です");
      return;
    }

    const { error } = await window.supabaseClient
      .from("posts")
      .insert([{
        title,
        comment,
        lat: Number(lat),
        lng: Number(lng),
        likes: 0
      }]);

    if (error) {
      console.error(error);
      alert("投稿に失敗しました");
      return;
    }

    document.getElementById("success")?.classList.remove("hidden");

    setTimeout(() => {
      location.href = "./index.html";
    }, 1200);
  });
})();
