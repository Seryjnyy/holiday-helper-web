import { AuthError, Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { supabase } from "../supabase/supabaseClient";

// https://github.com/linus1703/expo-starter/blob/main/app/stores/AuthStore.ts
interface AuthState {
  session: Session | null;
  user: User | null;
  setSession: (session: Session | null) => void;
  login: (email: string, password: string) => Promise<User | AuthError | null>;
  register: (
    email: string,
    password: string
  ) => Promise<User | AuthError | null>;
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  setSession: (session) => set({ session: session }),
  login: async (email, password) => {
    if (!email) return Promise.reject("Email is required");
    if (!password) return Promise.reject("Password is required");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return Promise.reject(error);

    set({ session: data.session, user: data.user });
    return Promise.resolve(data.user);
  },
  register: async (email, password) => {
    if (!email) return Promise.reject("Email is required");
    if (!password) return Promise.reject("Password is required");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) return Promise.reject(error);

    set({ session: data.session, user: data.user });
    return Promise.resolve(data.user);
  },
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) return Promise.reject(error);
    set({ session: null, user: null });
    return Promise.resolve();
  },
}));

export default useAuthStore;
