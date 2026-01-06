const user = localStorage.getItem("user_name");
if (!user) location.href = "login.html";

const box = document.getElementById("my-posts");

(async () => {
  const { data } = await window.supabase
    .from("posts")
    .select("*")
    .eq("user_name", user)
    .order("created_at", { ascending: false });

  box.innerHTML = "";
  data.forEach(p => {
    const d = document.createElement("div");
    d.className = "card";
    d.innerHTML = `
      <p>${p.content}</p>
      <button onclick="location.href='index.html?lat=${p.lat}&lng=${p.lng}'">
        地図で見る
      </button>
    `;
    box.appendChild(d);
  });
})();
