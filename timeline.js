const timeline = document.getElementById("timeline");

async function loadTimeline() {
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  timeline.innerHTML = "";

  data.forEach(post => {
    const div = document.createElement("div");
    div.className = "post-item";
    div.id = `post-${post.id}`;

    div.innerHTML = `
      <p>${post.content}</p>
      <span class="category-tag category-${post.category}">${post.category}</span>
      <button class="like-btn" data-post-id="${post.id}">
        ❤️ <span class="like-count">0</span>
      </button>
    `;

    timeline.appendChild(div);

    const btn = div.querySelector(".like-btn");
    const countEl = btn.querySelector(".like-count");

    loadLikeCount(post.id, countEl);
    btn.onclick = () => toggleLike(post.id, btn, countEl);
  });
}

loadTimeline();

/* Realtime */
supabase
  .channel("likes-realtime")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "likes" },
    payload => {
      const postId = payload.new?.post_id || payload.old?.post_id;
      const btn = document.querySelector(`.like-btn[data-post-id="${postId}"]`);
      if (btn) loadLikeCount(postId, btn.querySelector(".like-count"));
    }
  )
  .subscribe();
