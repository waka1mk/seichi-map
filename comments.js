// comments.js

// 🔹 ユーザー登録（初回時のみニックネーム入力）
if (!localStorage.getItem("user")) {
  const name = prompt("ニックネームを入力してください：") || "名無し";
  const user = { id: "u_" + Date.now(), name };
  localStorage.setItem("user", JSON.stringify(user));
}
const currentUser = JSON.parse(localStorage.getItem("user"));

// 🔹 禁止ワードフィルタ
const badWords = ["死ね", "バカ", "最悪", "きもい", "うざい"];

// 🔹 コメント描画
function renderCommentSection(containerId, post, index) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  if (!post.comments) post.comments = [];

  post.comments.forEach((cmt, i) => {
    const cDiv = document.createElement("div");
    cDiv.className = "comment";
    cDiv.innerHTML = `<b>${cmt.user.name}：</b> ${cmt.text}`;

    // 🔸 返信ボタン
    const replyBtn = document.createElement("button");
    replyBtn.textContent = "返信";
    replyBtn.style.marginLeft = "10px";
    replyBtn.onclick = () => addReply(containerId, post, index, i);
    cDiv.appendChild(replyBtn);

    // 🔸 返信を表示
    if (cmt.replies) {
      cmt.replies.forEach(rep => {
        const rDiv = document.createElement("div");
        rDiv.className = "reply";
        rDiv.innerHTML = `<b>${rep.user.name}：</b> ${rep.text}`;
        cDiv.appendChild(rDiv);
      });
    }

    container.appendChild(cDiv);
  });

  // 🔹 コメント入力欄
  const input = document.createElement("textarea");
  input.placeholder = "コメントを書く...";
  const btn = document.createElement("button");
  btn.textContent = "送信";
  btn.onclick = () => {
    const text = input.value.trim();
    if (!text) return alert("コメントを入力してください。");
    if (badWords.some(w => text.includes(w))) {
      alert("不適切な表現が含まれています。");
      return;
    }

    post.comments.push({
      user: currentUser,
      text,
      replies: []
    });

    localStorage.setItem("posts", JSON.stringify(posts));
    renderCommentSection(containerId, post, index);
    input.value = "";
  };

  container.appendChild(input);
  container.appendChild(btn);
}

// 🔹 返信追加
function addReply(containerId, post, postIndex, commentIndex) {
  const text = prompt("返信内容を入力：");
  if (!text) return;
  if (badWords.some(w => text.includes(w))) {
    alert("不適切な表現が含まれています。");
    return;
  }

  post.comments[commentIndex].replies.push({
    user: currentUser,
    text
  });

  localStorage.setItem("posts", JSON.stringify(posts));
  renderCommentSection(containerId, post, postIndex);
}
