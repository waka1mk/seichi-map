const timeline = document.getElementById("timeline");

const dummyPosts = [
  "この場所、誰かの記憶になりました",
  "初めて来た時の空気が忘れられない"
];

dummyPosts.forEach(text => {
  const div = document.createElement("div");
  div.className = "post-item";
  div.innerHTML = `<p>${text}</p><div class="meta">記憶</div>`;
  timeline.appendChild(div);
});
