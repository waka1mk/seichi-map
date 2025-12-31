const workSelect = document.getElementById("workSelect");
const workInput = document.getElementById("workInput");
const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");

async function loadWorks() {
  const posts = await supabase.from("posts").select();
  const works = [...new Set(posts.map(p => p.work_title).filter(Boolean))];

  works.forEach(w => {
    const opt = document.createElement("option");
    opt.value = w;
    opt.textContent = w;
    workSelect.appendChild(opt);
  });
}
loadWorks();

workInput.oninput = () => workSelect.disabled = !!workInput.value;
workSelect.onchange = () => workInput.disabled = !!workSelect.value;

imageInput.onchange = () => {
  const file = imageInput.files[0];
  if (!file) return;
  preview.src = URL.createObjectURL(file);
  preview.style.display = "block";
};

function getWorkTitle() {
  return workInput.value.trim() || workSelect.value || null;
}

async function uploadImage(file) {
  const name = `${Date.now()}_${file.name}`;
  await fetch(
    `${SUPABASE_URL}/storage/v1/object/post-images/${name}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${SUPABASE_KEY}` },
      body: file,
    }
  );
  return `${SUPABASE_URL}/storage/v1/object/public/post-images/${name}`;
}

document.getElementById("postBtn").onclick = () => {
  navigator.geolocation.getCurrentPosition(async (pos) => {
    let imageUrl = null;
    if (imageInput.files[0]) {
      imageUrl = await uploadImage(imageInput.files[0]);
    }

    await supabase.from("posts").insert([{
      user_name: localStorage.getItem("user_name"),
      content: document.getElementById("content").value,
      work_title: getWorkTitle(),
      image_url: imageUrl,
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
    }]);

    location.href = "index.html";
  });
};
