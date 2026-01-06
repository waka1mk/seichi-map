const form = document.getElementById("post-form");
if (!form) return;

const lat = sessionStorage.getItem("postLat");
const lng = sessionStorage.getItem("postLng");

form.addEventListener("submit", async e => {
  e.preventDefault();

  console.log("📤 投稿開始");

  const content = document.getElementById("content").value;

  const { data, error } = await window.supabaseClient
    .from("posts")
    .insert([{ content, lat, lng, likes: 0 }]);

  if (error) {
    console.error(error);
    return;
  }

  console.log("✅ 投稿成功", data);

  document.getElementById("success").classList.remove("hidden");

  setTimeout(() => {
    location.href = "index.html";
  }, 1500);
});
