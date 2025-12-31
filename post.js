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

    location.href = "index.html";
  });
};
