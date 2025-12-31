document.getElementById("postBtn").onclick = async () => {
  const content = document.getElementById("content").value;

  navigator.geolocation.getCurrentPosition(async pos => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    await supabase.from("posts").insert([
      { content, lat, lng }
    ]);

    const toast = document.getElementById("toast");
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
      document.body.classList.add("page-leave");

      setTimeout(() => {
        location.href = "index.html";
      }, 200);
    }, 1200);
  });
};
