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
      checkpoint_timing: {
        Row: {
          checkpoint_number: number
          created_at: string | null
          duration_seconds: number | null
          end_time: string | null
          id: string
          invalid_attempt_penalty: number | null
          invalid_attempts_count: number | null
          lifeline_penalty: number | null
          lifelines_used_count: number | null
          net_score: number | null
          session_id: string
          start_time: string | null
          time_score: number | null
        }
        Insert: {
          checkpoint_number: number
          created_at?: string | null
          duration_seconds?: number | null
          end_time?: string | null
          id?: string
          invalid_attempt_penalty?: number | null
          invalid_attempts_count?: number | null
          lifeline_penalty?: number | null
          lifelines_used_count?: number | null
          net_score?: number | null
          session_id: string
          start_time?: string | null
          time_score?: number | null
        }
        Update: {
          checkpoint_number?: number
          created_at?: string | null
          duration_seconds?: number | null
          end_time?: string | null
          id?: string
          invalid_attempt_penalty?: number | null
          invalid_attempts_count?: number | null
          lifeline_penalty?: number | null
          lifelines_used_count?: number | null
          net_score?: number | null
          session_id?: string
          start_time?: string | null
          time_score?: number | null
        }
        Relationships: []
      }
      game_progress: {
        Row: {
          checkpoint_duration_seconds: number | null
          checkpoint_end_time: string | null
          checkpoint_score: number | null
          checkpoint_start_time: string | null
          completed_checkpoints: string[] | null
          created_at: string | null
          current_checkpoint: number | null
          game_completed: boolean | null
          id: string
          invalid_attempt_penalty: number | null
          invalid_attempts_count: number | null
          lifelines_remaining: number | null
          mission_start_time: string | null
          session_id: string
          total_mission_time_seconds: number | null
          updated_at: string | null
        }
        Insert: {
          checkpoint_duration_seconds?: number | null
          checkpoint_end_time?: string | null
          checkpoint_score?: number | null
          checkpoint_start_time?: string | null
          completed_checkpoints?: string[] | null
          created_at?: string | null
          current_checkpoint?: number | null
          game_completed?: boolean | null
          id?: string
          invalid_attempt_penalty?: number | null
          invalid_attempts_count?: number | null
          lifelines_remaining?: number | null
          mission_start_time?: string | null
          session_id: string
          total_mission_time_seconds?: number | null
          updated_at?: string | null
        }
        Update: {
          checkpoint_duration_seconds?: number | null
          checkpoint_end_time?: string | null
          checkpoint_score?: number | null
          checkpoint_start_time?: string | null
          completed_checkpoints?: string[] | null
          created_at?: string | null
          current_checkpoint?: number | null
          game_completed?: boolean | null
          id?: string
          invalid_attempt_penalty?: number | null
          invalid_attempts_count?: number | null
          lifelines_remaining?: number | null
          mission_start_time?: string | null
          session_id?: string
          total_mission_time_seconds?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      invalid_attempts: {
        Row: {
          attempt_time: string | null
          attempted_code: string
          checkpoint_number: number
          id: string
          penalty_applied: number | null
          session_id: string
        }
        Insert: {
          attempt_time?: string | null
          attempted_code: string
          checkpoint_number: number
          id?: string
          penalty_applied?: number | null
          session_id: string
        }
        Update: {
          attempt_time?: string | null
          attempted_code?: string
          checkpoint_number?: number
          id?: string
          penalty_applied?: number | null
          session_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
