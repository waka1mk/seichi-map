import { supabase } from "./utils.js";

const list = document.getElementById("list");

async function load() {
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  data.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.title}（${p.prefecture}）`;
    list.appendChild(li);
  });
}

load();
