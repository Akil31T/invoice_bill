import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

export async function requireSupabaseAuth(token: string) {
  if (!token) {
    throw new Error("Unauthorized: No token provided");
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    throw new Error("Unauthorized: Invalid token");
  }

  return {
    user: data.user,
    userId: data.user.id,
  };
}