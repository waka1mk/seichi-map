window.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("postBtn");
  const contentEl = document.getElementById("content");
  const toast = document.getElementById("toast");

  if (!btn || !contentEl) return;

  btn.addEventListener("click", () => {
    const content = contentEl.value.trim();
    if (!content) return;

    btn.disabled = true;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        const { error } = await window.supabase
          .from("posts")
          .insert({
            content,
            lat,
            lng,
            user_name: localStorage.getItem("user_name") || "guest"
          });

        if (error) {
          console.error("❌ 投稿失敗", error);
          btn.disabled = false;
          return;
        }

        console.log("✅ 投稿成功");

        toast.classList.remove("hidden");
        toast.classList.add("show");

        setTimeout(() => {
          location.href = "map.html";
        }, 1200);
      },
      () => {
        alert("位置情報が取得できませんでした");
        btn.disabled = false;
      }
    );
  });
});
