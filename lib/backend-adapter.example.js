/**
 * OPTIONAL BACKEND ADAPTER (multi-device sync)
 * -------------------------------------------
 * The app works out-of-the-box with localStorage (lib/store.js). To sync accounts
 * and progress across devices, wire this Supabase adapter and swap the function
 * bodies in lib/store.js to call these instead.
 *
 * 1) Create a free project at https://supabase.com
 * 2) Run this SQL in the Supabase SQL editor:
 *
 *    create table profiles (
 *      id uuid references auth.users primary key,
 *      name text,
 *      created_at timestamptz default now()
 *    );
 *    create table attempts (
 *      id uuid primary key default gen_random_uuid(),
 *      user_id uuid references auth.users not null,
 *      title text, type text,
 *      total_questions int, correct int, wrong int, skipped int,
 *      score numeric, max numeric, accuracy int,
 *      per_section jsonb, per_topic jsonb, time_spent_sec int,
 *      created_at timestamptz default now()
 *    );
 *    alter table attempts enable row level security;
 *    create policy "own attempts" on attempts
 *      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
 *
 * 3) npm i @supabase/supabase-js
 * 4) Add env: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

// import { createClient } from "@supabase/supabase-js";
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// );

export async function registerUserRemote(name, email, password) {
  // const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
  // if (error) throw error;
  // return { name, email };
  throw new Error("Backend adapter not enabled. See lib/backend-adapter.example.js");
}

export async function loginUserRemote(email, password) {
  // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  // if (error) throw error;
  // return { name: data.user.user_metadata.name, email };
  throw new Error("Backend adapter not enabled.");
}

export async function saveAttemptRemote(attempt) {
  // const { data: { user } } = await supabase.auth.getUser();
  // await supabase.from("attempts").insert({ user_id: user.id, ...mapToColumns(attempt) });
}

export async function getAttemptsRemote() {
  // const { data } = await supabase.from("attempts").select("*").order("created_at", { ascending: false });
  // return (data || []).map(mapFromColumns);
  return [];
}
