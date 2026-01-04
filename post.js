// post.js
const form = document.getElementById("post-form");

form.onsubmit = async e => {
  e.preventDefault();

  const title = form.title.value;
  const comment = form.comment.value;
  const user_name = localStorage.getItem("user_name") ?? "guest";

  navigator.geolocation.getCurrentPosition(async pos => {
    await supabase.from("posts").insert({
      title,
      comment,
      user_name,
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    });

    alert("投稿しました！");
    location.href = "index.html";
  });
};
