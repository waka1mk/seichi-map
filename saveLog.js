import { supabase } from "./supabase.js";

export async function saveLog(user_name, action) {
  const { error } = await supabase
    .from("logs")
    .insert([
      {
        user_name: user_name,
        action: action
      }
    ]);

  if (error) {
    console.error("log error", error);
  }
}
