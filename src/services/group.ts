import { supabase } from "../supabase/supabaseClient";

export const getGroupsForUser = async (userID: string) => {
  const { error, data } = await supabase.from("group").select();

  return;
};

export const getGroupsForUser = async (userID: string) => {
  const { error, data } = await supabase.from("group").select();
  if (error) {
    return { data: null, error: error.message };
  }
  if (!data) {
    return { data: null, error: null };
  }
  return { data: data, error: null };
};
