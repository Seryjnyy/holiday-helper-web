import { Enums, Tables } from "./supabase/database.types";

export type Group = Tables<"group">;
export type GroupUser = Tables<"group_user">;
export type GroupRole = Enums<"group_user_role">;
export type SplitType = Enums<"split_type">;
// export type GroupUser = Tables<"group_user">;
