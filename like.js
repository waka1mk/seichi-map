function getDeviceId() {
  let id = localStorage.getItem("device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("device_id", id);
  }
  return id;
}

async function loadLikeCount(postId, countEl) {
  const { count } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  countEl.textContent = count;
}

async function toggleLike(postId, btn, countEl) {
  const deviceId = getDeviceId();

  const { data } = await supabase
    .from("likes")
    .select("id")
    .eq("post_id", postId)
    .eq("device_id", deviceId)
    .maybeSingle();

  if (data) {
    await supabase.from("likes").delete().eq("id", data.id);
    countEl.textContent--;
    btn.classList.remove("liked");
  } else {
    await supabase.from("likes").insert({ post_id: postId, device_id: deviceId });
    countEl.textContent++;
    btn.classList.add("liked");
  }
}
