const form = document.getElementById("post-form");
if (!form) return;

const lat = sessionStorage.getItem("postLat");
const lng = sessionStorage.getItem("postLng");

form.addEventListener("submit", async e => {
  e.preventDefault();

  if (!lat || !lng) {
    alert("マップで位置を選択してから投稿してください");
    return;
  }

  const content = document.getElementById("content").value;

  const { data, error } = await window.supabaseClient
    .from("posts")
    .insert([{ content, lat, lng, likes: 0 }]);

  if (error) {
    console.error(error);
    alert("投稿に失敗しました");
    return;
  }

  document.getElementById("success").classList.remove("hidden");

  setTimeout(() => {
    location.href = "index.html";
  }, 1000);
});
