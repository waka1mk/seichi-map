const input = document.getElementById("usernameInput");
const button = document.getElementById("loginBtn");
const welcome = document.getElementById("welcomeText");

button.addEventListener("click", () => {
  const name = input.value.trim();

  if (!name) {
    alert("名前を入力してください");
    return;
  }

  localStorage.setItem("username", name);

  welcome.classList.remove("hidden");

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
});
