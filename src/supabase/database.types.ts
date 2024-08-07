export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity: {
        Row: {
          created_at: string
          creator_group_id: string
          extras: Json | null
          group_id: string
          id: string
          type: Database["public"]["Enums"]["activity_type"]
        }
        Insert: {
          created_at?: string
          creator_group_id: string
          extras?: Json | null
          group_id: string
          id?: string
          type: Database["public"]["Enums"]["activity_type"]
        }
        Update: {
          created_at?: string
          creator_group_id?: string
          extras?: Json | null
          group_id?: string
          id?: string
          type?: Database["public"]["Enums"]["activity_type"]
        }
        Relationships: [
          {
            foreignKeyName: "activity_creator_group_id_fkey"
            columns: ["creator_group_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group"
            referencedColumns: ["id"]
          },
        ]
      }
      group: {
        Row: {
          created_at: string
          creator_id: string | null
          description: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          creator_id?: string | null
          description?: string
          id?: string
          name?: string
        }
        Update: {
          created_at?: string
          creator_id?: string | null
          description?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      group_user: {
        Row: {
          created_at: string
          group_id: string
          id: string
          name: string | null
          role: Database["public"]["Enums"]["group_user_role"]
          user_created: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: string
          name?: string | null
          role: Database["public"]["Enums"]["group_user_role"]
          user_created?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: string
          name?: string | null
          role?: Database["public"]["Enums"]["group_user_role"]
          user_created?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_users_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profile: {
        Row: {
          created_at: string
          display_name: string
          id: string
          user_group_id: string
        }
        Insert: {
          created_at?: string
          display_name: string
          id?: string
          user_group_id: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          user_group_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_user_group_id_fkey"
            columns: ["user_group_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      activity_type:
        | "user_join"
        | "user_leave"
        | "user_removed"
        | "user_added"
        | "charge_created"
        | "charge_modified"
        | "charge_deleted"
      group_user_role: "creator" | "admin" | "user" | "bot"
      split_type: "equal" | "custom"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
