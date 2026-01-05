const form = document.getElementById("login-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("username").value.trim();
  if (!name) return;

  localStorage.setItem("user_name", name);

  const msg = document.getElementById("welcome");
  msg.innerText = "あなたの加入を歓迎します";

  setTimeout(() => {
    location.href = "index.html";
  }, 1000);
});
