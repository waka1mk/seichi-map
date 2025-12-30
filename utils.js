import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

export const supabase = createClient(
  "https://ncqfaerpznsopgbpiiso.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jcWZhZXJwem5zb3BnYnBpaXNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NDMwMzMsImV4cCI6MjA3OTAxOTAzM30.K3GOyrE3XVqJtF2fNXYgromkU93es8ag660nHO1Db1g"
);

export async function saveLog(action) {
  const username = localStorage.getItem("user_name") || "guest";
  await supabase.from("logs").insert([{ user_name, action }]);
}
