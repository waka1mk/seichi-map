const fab = document.getElementById("fab");
const modal = document.getElementById("postModal");
const cancelBtn = document.getElementById("cancel");
const submitBtn = document.getElementById("submit");

// モーダル開閉
fab.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

cancelBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// 投稿（今はデモ）
submitBtn.addEventListener("click", () => {
  const title = document.getElementById("title").value;

  if (!title) {
    alert("作品名を入れてください");
    return;
  }

  alert("投稿しました！（※今はデモ）");
  modal.classList.add("hidden");
});
