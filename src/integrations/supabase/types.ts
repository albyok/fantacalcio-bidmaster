export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type Database = {
    public: {
        Tables: {
            players: {
                Row: {
                    average_fantavote: number | null;
                    average_vote: number | null;
                    created_at: string;
                    fantaprice: number | null;
                    fantasy_team_id: string | null;
                    fantateam: string | null;
                    id: string;
                    mantra_role: string | null;
                    name: string;
                    out_of_list: boolean | null;
                    played_matches: number | null;
                    role: string;
                    team: string;
                    updated_at: string;
                    player_id: number;
                };
                Insert: {
                    average_fantavote?: number | null;
                    average_vote?: number | null;
                    created_at?: string;
                    fantaprice?: number | null;
                    fantasy_team_id?: string | null;
                    fantateam?: string | null;
                    id?: string;
                    mantra_role?: string | null;
                    name: string;
                    out_of_list?: boolean | null;
                    played_matches?: number | null;
                    role: string;
                    team: string;
                    updated_at?: string;
                    player_id?: number;
                };
                Update: {
                    average_fantavote?: number | null;
                    average_vote?: number | null;
                    created_at?: string;
                    fantaprice?: number | null;
                    fantasy_team_id?: string | null;
                    fantateam?: string | null;
                    id?: string;
                    mantra_role?: string | null;
                    name?: string;
                    out_of_list?: boolean | null;
                    played_matches?: number | null;
                    role?: string;
                    team?: string;
                    updated_at?: string;
                    player_id?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: "players_fantasy_team_id_fkey";
                        columns: ["fantasy_team_id"];
                        isOneToOne: false;
                        referencedRelation: "teams";
                        referencedColumns: ["id"];
                    }
                ];
            };
            profiles: {
                Row: {
                    created_at: string;
                    email: string;
                    id: string;
                    is_admin: boolean | null;
                    role: Database["public"]["Enums"]["user_role"];
                    updated_at: string;
                };
                Insert: {
                    created_at?: string;
                    email: string;
                    id: string;
                    is_admin?: boolean | null;
                    role?: Database["public"]["Enums"]["user_role"];
                    updated_at?: string;
                };
                Update: {
                    created_at?: string;
                    email?: string;
                    id?: string;
                    is_admin?: boolean | null;
                    role?: Database["public"]["Enums"]["user_role"];
                    updated_at?: string;
                };
                Relationships: [];
            };
            teams: {
                Row: {
                    budget: number;
                    created_at: string;
                    id: string;
                    name: string;
                    updated_at: string;
                };
                Insert: {
                    budget?: number;
                    created_at?: string;
                    id?: string;
                    name: string;
                    updated_at?: string;
                };
                Update: {
                    budget?: number;
                    created_at?: string;
                    id?: string;
                    name?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            user_teams: {
                Row: {
                    team_id: string;
                    user_id: string;
                };
                Insert: {
                    team_id: string;
                    user_id: string;
                };
                Update: {
                    team_id?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "user_teams_team_id_fkey";
                        columns: ["team_id"];
                        isOneToOne: false;
                        referencedRelation: "teams";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "user_teams_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    }
                ];
            };
            bids: {
                Row: {
                    id: string;
                    user_id: string;
                    player_id: number;
                    bid_amount: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    player_id: number;
                    bid_amount: number;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    player_id?: number;
                    bid_amount?: number;
                    created_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "bids_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "profiles";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "bids_player_id_fkey";
                        columns: ["player_id"];
                        isOneToOne: false;
                        referencedRelation: "players";
                        referencedColumns: ["id"];
                    }
                ];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            get_team_id_by_name: {
                Args: {
                    team_name: string;
                };
                Returns: string;
            };
        };
        Enums: {
            user_role: "admin" | "user";
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
    PublicTableNameOrOptions extends
        | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
              Database[PublicTableNameOrOptions["schema"]]["Views"])
        : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
          Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
          Row: infer R;
      }
        ? R
        : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
          PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
          PublicSchema["Views"])[PublicTableNameOrOptions] extends {
          Row: infer R;
      }
        ? R
        : never
    : never;

export type TablesInsert<
    PublicTableNameOrOptions extends
        | keyof PublicSchema["Tables"]
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Insert: infer I;
      }
        ? I
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
          Insert: infer I;
      }
        ? I
        : never
    : never;

export type TablesUpdate<
    PublicTableNameOrOptions extends
        | keyof PublicSchema["Tables"]
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Update: infer U;
      }
        ? U
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
          Update: infer U;
      }
        ? U
        : never
    : never;

export type Enums<
    PublicEnumNameOrOptions extends
        | keyof PublicSchema["Enums"]
        | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
        : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
        | keyof PublicSchema["CompositeTypes"]
        | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
        : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
