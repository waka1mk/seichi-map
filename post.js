const form = document.getElementById("post-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userName = localStorage.getItem("user_name");
  if (!userName) {
    location.href = "login.html";
    return;
  }

  const comment = document.getElementById("comment").value;

  navigator.geolocation.getCurrentPosition(async pos => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    const { error } = await window.supabase
      .from("posts")
      .insert({
        user_name: userName,
        comment,
        lat,
        lng
      });

    if (!error) {
      showToast("あなたの巡礼を記録しました");
      setTimeout(() => {
        location.href = "index.html";
      }, 1200);
    }
  });
});

function showToast(text) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = text;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 1500);
}
