window.SUPABASE_URL = "https://ncqfaerpznsopgbpiiso.supabase.co";
window.SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jcWZhZXJwem5zb3BnYnBpaXNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NDMwMzMsImV4cCI6MjA3OTAxOTAzM30.K3GOyrE3XVqJtF2fNXYgromkU93es8ag660nHO1Db1g";

window.supabase = window.supabase.createClient(
  window.SUPABASE_URL,
  window.SUPABASE_ANON_KEY
);
