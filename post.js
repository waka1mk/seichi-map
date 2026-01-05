document.getElementById("postBtn").addEventListener("click", () => {
  const content = document.getElementById("content").value;
  const user_name = localStorage.getItem("user_name");

  if (!content) {
    alert("内容を書いてください");
    return;
  }

  navigator.geolocation.getCurrentPosition(async pos => {
    const { latitude, longitude } = pos.coords;

    const { error } = await supabaseClient.from("posts").insert([{
      content,
      lat: latitude,
      lng: longitude,
      user_name,
      likes: 0
    }]);

    if (error) {
      console.error(error);
      alert("投稿に失敗しました");
      return;
    }

    alert("あなたの加入を歓迎します");
    location.href = "index.html";
  });
});
