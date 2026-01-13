const form = document.getElementById("post-form");
if (!form) return;

const lat = sessionStorage.getItem("postLat");
const lng = sessionStorage.getItem("postLng");

form.addEventListener("submit", async e => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  const { error } = await window.supabaseClient
    .from("posts")
    .insert([{
      title,
      content,
      lat,
      lng,
      likes: 0
    }]);

  if (error) return;

  document.getElementById("success").classList.remove("hidden");

  setTimeout(() => {
    location.href = "./index.html";
  }, 1200);
});
