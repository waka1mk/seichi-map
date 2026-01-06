document.getElementById("postBtn").onclick = async () => {
  const content = document.getElementById("content").value;
  const lat = localStorage.getItem("post_lat");
  const lng = localStorage.getItem("post_lng");
  const user = localStorage.getItem("user_name");

  if (!content || !lat || !lng) {
    alert("投稿情報が不足しています");
    return;
  }

  const { error } = await window.supabase.from("posts").insert({
    content,
    lat,
    lng,
    user_name: user,
    likes: 0
  });

  if (error) {
    alert("投稿失敗");
    return;
  }

  alert("あなたの巡礼が地図に刻まれました");
  location.href = "index.html";
};
