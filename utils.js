// -------------------------------
// ユーザー情報の保存
// -------------------------------
function saveUser(name) {
  const id = "user_" + Math.random().toString(36).substring(2, 12);

  const userData = {
    id: id,
    name: name
  };

  localStorage.setItem("currentUser", JSON.stringify(userData));
}


// -------------------------------
// 現在のユーザー取得
// -------------------------------
function getUser() {
  const data = localStorage.getItem("currentUser");
  if (!data) return null;
  return JSON.parse(data);
}


// -------------------------------
// ログインしているかチェック
// -------------------------------
function requireLogin() {
  const user = getUser();
  if (!user) {
    location.href = "login.html";
  }
}


// -------------------------------
// ログアウト
// -------------------------------
function logout() {
  localStorage.removeItem("currentUser");
  location.href = "login.html";
}
