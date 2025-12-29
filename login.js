if (!localStorage.getItem("username")) {
  const name = prompt("ユーザー名を入力してください");
  if (name) localStorage.setItem("username", name);
}
