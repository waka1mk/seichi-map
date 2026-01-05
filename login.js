// ① すでにログイン済みならスキップ
const savedName = localStorage.getItem("user_name");
if (savedName) {
  location.href = "index.html";
}

// ② 初回ログイン処理
document.getElementById("loginBtn").onclick = () => {
  const name = document.getElementById("nameInput").value.trim();
  if (!name) return;

  localStorage.setItem("user_name", name);

  // 切り替え演出用（今は簡易）
  alert("あなたの加入を歓迎します");

  location.href = "index.html";
};
