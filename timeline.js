import { supabase } from "./supabase.js";

const timeline = document.getElementById("timeline");

async function loadTimeline() {
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("id", { ascending: false });

  timeline.innerHTML = "";

  data.forEach(p => {
    const div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
      <p><strong>${p.user_name}</strong></p>
      <p>${p.comment}</p>
      <button class="like" data-id="${p.id}">❤️ ${p.likes}</button>
      <hr>
    `;

    timeline.appendChild(div);
  });

  document.querySelectorAll(".like").forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      const newLikes = Number(btn.textContent.replace("❤️", "")) + 1;

      const { data } = await supabase
        .from("posts")
        .update({ likes: newLikes })
        .eq("id", id)
        .select()
        .single();

      btn.textContent = `❤️ ${data.likes}`;
    };
  });
}

loadTimeline();
