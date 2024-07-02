import { supabase } from "@/supabase/supabaseClient";
import { GroupRole } from "@/types";

export const getGroupsForUser = async (userID: string) => {
  const { error, data } = await supabase
    .from("group_user")
    .select("group(*)")
    .eq("user_id", userID);

  if (error) {
    return Promise.reject(new Error(error.message));
  }
  if (!data) {
    return Promise.reject(new Error("Data is missing"));
  }

  return data;
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

export async function getGroupActivity(groupID: string) {
  const { error, data } = await supabase
    .from("activity")
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

// TODO : Currently not inserting profile image
export async function addGroupUser(
  groupID: string,
  username: string,
  profileImage: string,
  role: GroupRole
) {
  const { error } = await supabase.from("group_user").insert({
    group_id: groupID,
    role: role,
    name: username,
    user_created: true,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
