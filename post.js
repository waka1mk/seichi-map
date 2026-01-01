document.getElementById("postBtn").addEventListener("click", async () => {
  const content = document.getElementById("content").value;

  if (!content) {
    alert("内容を書いてください");
    return;
  }

  const { error } = await supabase
    .from("posts")
    .insert([{ content }]);

  if (error) {
    alert("投稿に失敗しました");
    console.error(error);
    return;
  }

  document.getElementById("content").value = "";
  alert("投稿しました");
});
