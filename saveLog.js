// saveLog.js
async function saveLog(user_name, action) {
  const { error } = await supabase
    .from("logs")
    .insert([{ user_name, action }]);

  if (error) {
    console.error("log error", error);
  }
}
