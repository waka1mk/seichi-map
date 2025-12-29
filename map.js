import { supabase, addPin } from "./utils.js";

// 地図初期化（見やすいタイル）
export const map = L.map("map").setView([35.681236, 139.767125], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

// 既存投稿を読み込み
async function loadPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("title, comment, lat, lng");

  if (error) {
    console.error(error);
    return;
  }

  data.forEach(post => addPin(map, post));
}

loadPosts();

// 🔹 仮投稿（DB空でも見せる用）
const demoPosts = [
  {
    title: "〇〇アニメ聖地",
    comment: "実際に来ると感動しました",
    lat: 35.681236,
    lng: 139.767125
  },
  {
    title: "△△映画ロケ地",
    comment: "広くて雰囲気が良い場所",
    lat: 35.6895,
    lng: 139.6917
  }
];

demoPosts.forEach(post => addPin(map, post));

// モーダル制御
const fab = document.getElementById("fab");
const modal = document.getElementById("postModal");
const cancel = document.getElementById("cancel");

fab.onclick = () => modal.classList.remove("hidden");
cancel.onclick = () => modal.classList.add("hidden");
