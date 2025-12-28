// map.js
const map = L.map("map").setView([35.681236, 139.767125], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

// モーダル制御
const fab = document.getElementById("fab");
const modal = document.getElementById("postModal");
const cancel = document.getElementById("cancel");

fab.onclick = () => modal.classList.remove("hidden");
cancel.onclick = () => modal.classList.add("hidden");
