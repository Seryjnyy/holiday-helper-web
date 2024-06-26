import { supabase } from "../supabase/supabaseClient";

export const getGroupsForUser = async (userID: string) => {
  console.log("🚀 ~ getGroupsForUser ~ userID:", userID);
  const { error, data } = await supabase
    .from("group_user")
    .select("group(*)")
    .eq("user_id", userID);

  if (error) {
    return { error: error.message, data: null };
  }
  if (!data) {
    return { error: null, data: null };
  }

  // return {error:null, data:data.filter(group => group.group != null)};
  return { error: null, data: data };
};

export const getGroupsForUsesr = async (userID: string) => {
  const { error, data } = await supabase.from("group").select();
  if (error) {
    return { data: null, error: error.message };
  }
  if (!data) {
    return { data: null, error: null };
  }
  return { data: data, error: null };
};
