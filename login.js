document.getElementById("loginBtn").onclick = () => {
  const name = document.getElementById("nameInput").value;
  if (!name) return;

  localStorage.setItem("user_name", name);
  location.href = "index.html";
};
