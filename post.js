import { map, markers } from "./map.js";

const fab = document.getElementById("fab");
const modal = document.getElementById("postModal");
const cancel = document.getElementById("cancel");
const submit = document.getElementById("submit");

let currentLatLng = null;

// モーダル制御
fab.onclick = () => modal.classList.remove("hidden");
cancel.onclick = () => modal.classList.add("hidden");

// 地図クリックで位置取得
map.on("click", e => {
  currentLatLng = e.latlng;
});

// 投稿
submit.onclick = () => {
  if (!currentLatLng) {
    alert("地図をタップしてください");
    return;
  }

  const title = document.getElementById("title").value;
  const comment = document.getElementById("comment").value;
  const imageFile = document.getElementById("image").files[0];

  let imageHTML = "";
  if (imageFile) {
    const url = URL.createObjectURL(imageFile);
    imageHTML = `<br><img src="${url}" width="150">`;
  }

  const marker = L.marker(currentLatLng)
    .addTo(map)
    .bindPopup(`<strong>${title}</strong><br>${comment}${imageHTML}`)
    .openPopup();

  markers.push(marker);

  map.setView(currentLatLng, 16);

  modal.classList.add("hidden");
};
