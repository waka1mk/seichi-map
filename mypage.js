import { supabase } from "./utils.js";

const username = localStorage.getItem("username");
const container = document.getElementById("myposts");

if (!container) {
  console.warn("myposts element not found");
} else {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("username", username);

  if (error) {
    console.error(error);
  } else if (data) {
    data.forEach(post => {
      const div = document.createElement("div");
      div.textContent = post.title;
      container.appendChild(div);
    });
  }
}
