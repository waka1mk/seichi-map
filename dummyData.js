import { map, markers } from "./map.js";

const dummyPosts = [
  { lat: 35.6895, lng: 139.6917, title: "第1話の交差点", comment: "有名なシーン" },
  { lat: 35.6762, lng: 139.6503, title: "EDの橋", comment: "夕方が綺麗" },
  { lat: 35.6938, lng: 139.7034, title: "聖地カフェ", comment: "ファン多い" },
  { lat: 35.6995, lng: 139.7741, title: "最終回の場所", comment: "感動" },
  { lat: 35.7074, lng: 139.7528, title: "通学路モデル", comment: "雰囲気一致" },
  { lat: 35.6586, lng: 139.7454, title: "神社シーン", comment: "定番" },
  { lat: 35.6655, lng: 139.7297, title: "背景モデル公園", comment: "静か" },
  { lat: 35.6733, lng: 139.7104, title: "名シーンの坂", comment: "写真映え" },
];

dummyPosts.forEach(p => {
  const marker = L.marker([p.lat, p.lng])
    .addTo(map)
    .bindPopup(`<strong>${p.title}</strong><br>${p.comment}`);
  markers.push(marker);
});
