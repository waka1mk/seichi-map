document.getElementById("login").onclick = () => {
  const name = document.getElementById("name").value;
  if (!name) {
    alert("名前を入力してください");
    return;
  }
  localStorage.setItem("user_name", name);
  location.href = "index.html";
};
