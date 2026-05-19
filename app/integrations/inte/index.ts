import { supabase } from "../supabase/client";

type SignInOptions = {
  redirect_uri?: string;
};

export const auth = {
  signInWithOAuth: async (
    provider: "google" | "apple" | "azure",
    opts?: SignInOptions
  ) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: opts?.redirect_uri,
      },
    });

    if (error) {
      return { error };
    }

    return { data };
  },

  signOut: async () => {
    return await supabase.auth.signOut();
  },

  getSession: async () => {
    return await supabase.auth.getSession();
  },
};