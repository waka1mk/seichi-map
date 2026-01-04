const btn = document.getElementById("postBtn");

btn.onclick = async () => {
  const content = document.getElementById("content").value;

  if (!content) return alert("内容を書いてください");

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    location.href = "login.html";
    return;
  }

  const { error } = await supabase.from("posts").insert([
    {
      content,
      user_id: user.id
    }
  ]);

  if (error) {
    console.error(error);
    alert("投稿失敗");
    return;
  }

  document.getElementById("content").value = "";
  alert("投稿しました");
};
