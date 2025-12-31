document.getElementById("postBtn").onclick = () => {
  navigator.geolocation.getCurrentPosition(async (pos) => {

    const userName = localStorage.getItem("user_name") || "anonymous";
    const content = document.getElementById("content").value.trim();

    if (!content) {
      alert("内容を入力してください");
      return;
    }

    await supabase.from("posts").insert([
      {
        user_name: userName,
        content: content,
        lat: Number(pos.coords.latitude),
        lng: Number(pos.coords.longitude),
        likes: 0
      },
    ]);

    const msg = document.getElementById("postComplete");
    msg.classList.add("show");

    setTimeout(() => {
      location.href = "index.html";
    }, 1600);
  });
};
