import { supabase } from "@/supabase/supabaseClient";

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

// export const getGroupsForUsesr = async (userID: string) => {
//   const { error, data } = await supabase.from("group").select();
//   if (error) {
//     return { data: null, error: error.message };
//   }
//   if (!data) {
//     return { data: null, error: null };
//   }
//   return { data: data, error: null };
// };

export async function getGroup(groupID: string) {
  const { error, data } = await supabase
    .from("group")
    .select()
    .eq("id", groupID)
    .limit(1)
    .single();
  if (error) {
    return Promise.reject(new Error(error.message));
  }
  if (!data) {
    return Promise.reject(new Error("Data is missing"));
  }

  return data;
}

export async function getGroupUsers(groupID: string) {
  const { error, data } = await supabase
    .from("group_user")
    .select()
    .eq("group_id", groupID);

  if (error) {
    return Promise.reject(new Error(error.message));
  }
  if (!data) {
    return Promise.reject(new Error("Data is missing"));
  }

  return data;
}

// Calls with empty values could be made, waste of request, could make sure they have values before hand
export async function getGroupUser(groupID: string, userID: string) {
  const { error, data } = await supabase
    .from("group_user")
    .select()
    .eq("group_id", groupID)
    .eq("user_id", userID)
    .limit(1)
    .single();

  if (error) {
    return Promise.reject(new Error(error.message));
  }
  if (!data) {
    return Promise.reject(new Error("Data is missing"));
  }

  return data;
}
