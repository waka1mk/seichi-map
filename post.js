document.getElementById("postBtn").addEventListener("click", () => {
  const text = document.getElementById("content").value;
  if (!text) {
    alert("内容を書いてください");
    return;
  }
  alert("投稿しました（仮）");
  document.getElementById("content").value = "";
});
