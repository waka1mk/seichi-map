import { supabase } from "./supabase.js";

const timeline = document.getElementById("timeline");

// 念のためのガード（要素がないときに落ちない）
if (!timeline) {
  console.warn("timeline element not found");
}

// 投稿を読み込む
async function loadTimeline() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("load error", error);
    return;
  }

  timeline.innerHTML = "";

  data.forEach(post => {
    const div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
      <p><strong>${post.user_name}</strong></p>
      <p>${post.comment}</p>

      <button class="like-btn" data-id="${post.id}">
        ❤️ ${post.likes ?? 0}
      </button>
      <hr>
    `;

    timeline.appendChild(div);
  });

  setLikeEvents();
}

// いいね処理
function setLikeEvents() {
  document.querySelectorAll(".like-btn").forEach(btn => {
    btn.onclick = async () => {
      const postId = btn.dataset.id;

      const { data, error } = await supabase
        .from("posts")
        .update({ likes: Number(btn.textContent.replace("❤️", "")) + 1 })
        .eq("id", postId)
        .select()
        .single();

      if (error) {
        console.error("like error", error);
        return;
      }

      // 表示だけ更新
      btn.textContent = `❤️ ${data.likes}`;
    };
  });
}

loadTimeline();
