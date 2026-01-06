document.getElementById("loginBtn").onclick = () => {
  const name = document.getElementById("name").value.trim();
  if (!name) return alert("名前を入力してください");

  localStorage.setItem("user_name", name);

  document.getElementById("welcome").classList.remove("hidden");

  setTimeout(() => {
    location.href = "index.html";
  }, 1200);
};
