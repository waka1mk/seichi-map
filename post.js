document.getElementById("postBtn").onclick = () => {
  navigator.geolocation.getCurrentPosition(async (pos) => {

    await supabase.from("posts").insert([
      {
        user_name: localStorage.getItem("user_name"),
        content: document.getElementById("content").value,
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      },
    ]);

    const msg = document.getElementById("postComplete");
    msg.classList.add("show");

    setTimeout(() => {
      location.href = "index.html";
    }, 1600);
  });
};
