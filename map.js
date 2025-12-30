import L from "https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js";

export const map = L.map("map").setView([35.681236, 139.767125], 13);

L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
).addTo(map);
