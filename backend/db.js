const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Debug check
console.log("Supabase URL:", process.env.SUPABASE_URL);
console.log("Supabase Key exists?", !!process.env.SUPABASE_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = supabase;
