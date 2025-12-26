const submitBtn = document.getElementById("submitPost");

submitBtn.addEventListener("click", async () => {
  const title = document.getElementById("workTitle").value;
  const comment = document.getElementById("comment").value;
  const photoFile = document.getElementById("photo").files[0];

  if (!title || !comment) {
    alert("作品名とコメントは必須です");
    return;
  }

  // 現在地取得
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    // posts に保存
    const { data: post, error } = await supabase
      .from("posts")
      .insert([{
        title,
        comment,
        lat,
        lng
      }])
      .select()
      .single();

    if (error) {
      alert("投稿に失敗しました");
      return;
    }

    // 画像があれば保存
    if (photoFile) {
      const filePath = `${post.id}/${photoFile.name}`;

      await supabase.storage
        .from("post-images")
        .upload(filePath, photoFile);

      await supabase.from("post_images").insert([{
        post_id: post.id,
        storage_path: filePath
      }]);
    }

    // モーダル閉じる
    document.getElementById("postModal").classList.add("hidden");

    alert("投稿完了！");
  });
});
