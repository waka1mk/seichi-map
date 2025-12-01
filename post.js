document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById("submitBtn");
  const locBtn = document.getElementById("getLocationBtn");

  let lat = null, lng = null;

  locBtn.addEventListener("click", ()=>{
    navigator.geolocation.getCurrentPosition(pos=>{
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
      alert("現在地を取得しました！");
    },()=>alert("取得に失敗しました"));
  });

  btn.addEventListener("click", async ()=>{
    const title = document.getElementById("workTitle").value.trim();
    const comment = document.getElementById("commentInput").value.trim();
    const visitDate = new Date().toISOString().split('T')[0]; // 自動取得
    const file = document.getElementById("imageInput").files[0];

    if(!title){
      alert("作品名は必須です");
      return;
    }

    let imgData = "";
    if(file){
      imgData = await compressImage(file);
    }

    let posts = JSON.parse(localStorage.getItem("posts") || "[]");
    posts.push({
      title,
      comment,
      lat, lng,
      img: imgData,
      date: visitDate
    });

    localStorage.setItem("posts", JSON.stringify(posts));
    location.href="index.html";
  });
});

// ★画像圧縮（200px程度）
function compressImage(file){
  return new Promise(resolve=>{
    const reader = new FileReader();
    reader.onload = e=>{
      const img = new Image();
      img.onload = ()=>{
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const maxW = 200;
        const scale = maxW / img.width;
        canvas.width = maxW;
        canvas.height = img.height * scale;

        ctx.drawImage(img,0,0,canvas.width,canvas.height);
        resolve(canvas.toDataURL("image/jpeg",0.7));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
