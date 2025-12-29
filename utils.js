import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const supabase = createClient(
  "https://ncqfaerpznsopgbpiiso.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jcWZhZXJwem5zb3BnYnBpaXNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NDMwMzMsImV4cCI6MjA3OTAxOTAzM30.K3GOyrE3XVqJtF2fNXYgromkU93es8ag660nHO1Db1g"
);

// ピン追加共通関数
export function addPin(map, post) {
  const marker = L.marker([post.lat, post.lng]).addTo(map);
  marker.bindPopup(`
    <strong>${post.title}</strong><br/>
    ${post.comment}
  `);
}
