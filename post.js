document.getElementById("submit").onclick = async () => {
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const user_name = localStorage.getItem("user_name") || "guest";

  navigator.geolocation.getCurrentPosition(async pos => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    const { error } = await supabase.from("posts").insert([
      { title, content, lat, lng, user_name }
    ]);

    if (!error) location.href = "index.html";
  });
};
