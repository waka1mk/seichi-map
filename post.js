const plusBtn = document.getElementById("plusBtn");
const modal = document.getElementById("postModal");

plusBtn.onclick = () => modal.classList.remove("hidden");
closePost.onclick = () => modal.classList.add("hidden");

sendPost.onclick = async () => {
  const user = localStorage.getItem("username") || "匿名";

  await supabase.from("posts").insert({
    title: title.value,
    content: content.value,
    lat: lat.value,
    lng: lng.value,
    user_name: user
  });

  location.reload();
};
