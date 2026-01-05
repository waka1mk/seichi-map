window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("post-form");
  if (!form) return;

  const btn = document.getElementById("submit-btn");
  let isPosting = false;

  form.addEventListener("submit", e => {
    e.preventDefault();
    if (isPosting) return;

    const comment = document.getElementById("comment").value.trim();
    if (!comment) return;

    isPosting = true;
    btn.disabled = true;
    btn.innerText = "記録中…";

    navigator.geolocation.getCurrentPosition(async pos => {
      await window.supabase.from("posts").insert({
        comment,
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        likes: 0
      });

      location.href = "index.html";
    });
  });
});
