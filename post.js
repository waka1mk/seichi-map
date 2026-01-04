if (!localStorage.getItem("user_name")) {
  location.href = "login.html";
}

const form = document.getElementById("post-form");

form.onsubmit = e => {
  e.preventDefault();

  navigator.geolocation.getCurrentPosition(async pos => {
    await supabase.from("posts").insert({
      title: form.title.value,
      comment: form.comment.value,
      user_name: localStorage.getItem("user_name"),
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    });

    alert("📍 新しい聖地を記録しました");
    location.href = "index.html";
  });
};
