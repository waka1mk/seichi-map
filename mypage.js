import { supabase } from "./utils.js";

const username = localStorage.getItem("username");
if (!username) location.href = "login.html";

document.getElementById("user").textContent = `${username} の投稿`;

document.getElementById("logout").onclick = () => {
  localStorage.clear();
  location.href = "login.html";
};

const { data } = await supabase
  .from("posts")
  .select("*")
  .eq("username", username);

data.forEach(p => {
  document.getElementById("myPosts").innerHTML += `
    <div>
      <b>${p.title}</b> ${p.image_url ? "📸" : ""}
      <p>${p.comment || ""}</p>
    </div>
  `;
});
