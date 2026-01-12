document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("post-form");
  if (!form) return;

  const lat = sessionStorage.getItem("postLat");
  const lng = sessionStorage.getItem("postLng");

  form.addEventListener("submit", async e => {
    e.preventDefault();

    const content = document.getElementById("content").value;

    const { error } = await window.supabaseClient
      .from("posts")
      .insert([{
        content,
        lat: lat ? Number(lat) : null,
        lng: lng ? Number(lng) : null,
        likes: 0
      }]);

    if (error) {
      console.error(error);
      alert("投稿失敗");
      return;
    }

    location.href = "index.html";
  });
});
