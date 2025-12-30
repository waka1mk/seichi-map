export function addTimelineItem(post) {
  const tl = document.getElementById("timeline");
  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `
    <b>${post.title}</b> ${post.image_url ? "📸" : ""}
    <p>${post.comment || ""}</p>
  `;
  tl.prepend(div);
}
