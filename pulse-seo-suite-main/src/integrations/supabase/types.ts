export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string | null
          severity: string | null
          title: string
          type: string
          website_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string | null
          severity?: string | null
          title: string
          type: string
          website_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string | null
          severity?: string | null
          title?: string
          type?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_reports: {
        Row: {
          created_at: string
          data: Json | null
          errors_count: number | null
          id: string
          passed_count: number | null
          status: string | null
          type: string
          warnings_count: number | null
          website_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          errors_count?: number | null
          id?: string
          passed_count?: number | null
          status?: string | null
          type: string
          warnings_count?: number | null
          website_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          errors_count?: number | null
          id?: string
          passed_count?: number | null
          status?: string | null
          type?: string
          warnings_count?: number | null
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_reports_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      backlinks: {
        Row: {
          anchor_text: string | null
          created_at: string
          domain_authority: number | null
          first_seen_at: string | null
          id: string
          is_dofollow: boolean | null
          last_seen_at: string | null
          source_url: string
          spam_score: number | null
          status: string | null
          target_url: string
          website_id: string
        }
        Insert: {
          anchor_text?: string | null
          created_at?: string
          domain_authority?: number | null
          first_seen_at?: string | null
          id?: string
          is_dofollow?: boolean | null
          last_seen_at?: string | null
          source_url: string
          spam_score?: number | null
          status?: string | null
          target_url: string
          website_id: string
        }
        Update: {
          anchor_text?: string | null
          created_at?: string
          domain_authority?: number | null
          first_seen_at?: string | null
          id?: string
          is_dofollow?: boolean | null
          last_seen_at?: string | null
          source_url?: string
          spam_score?: number | null
          status?: string | null
          target_url?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "backlinks_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      competitors: {
        Row: {
          created_at: string
          domain: string
          id: string
          website_id: string
        }
        Insert: {
          created_at?: string
          domain: string
          id?: string
          website_id: string
        }
        Update: {
          created_at?: string
          domain?: string
          id?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "competitors_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      content_plans: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          scheduled_date: string | null
          status: string | null
          target_keyword: string | null
          title: string
          updated_at: string
          website_id: string
          word_count_target: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          scheduled_date?: string | null
          status?: string | null
          target_keyword?: string | null
          title: string
          updated_at?: string
          website_id: string
          word_count_target?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          scheduled_date?: string | null
          status?: string | null
          target_keyword?: string | null
          title?: string
          updated_at?: string
          website_id?: string
          word_count_target?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "content_plans_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_config: {
        Row: {
          config_key: string
          config_value: Json
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          config_key: string
          config_value?: Json
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          config_key?: string
          config_value?: Json
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      keywords: {
        Row: {
          cpc: number | null
          created_at: string
          difficulty: number | null
          id: string
          intent: string | null
          is_primary: boolean | null
          keyword: string
          mapped_page_id: string | null
          search_volume: number | null
          updated_at: string
          website_id: string
        }
        Insert: {
          cpc?: number | null
          created_at?: string
          difficulty?: number | null
          id?: string
          intent?: string | null
          is_primary?: boolean | null
          keyword: string
          mapped_page_id?: string | null
          search_volume?: number | null
          updated_at?: string
          website_id: string
        }
        Update: {
          cpc?: number | null
          created_at?: string
          difficulty?: number | null
          id?: string
          intent?: string | null
          is_primary?: boolean | null
          keyword?: string
          mapped_page_id?: string | null
          search_volume?: number | null
          updated_at?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "keywords_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          created_at: string
          h1: string | null
          id: string
          index_status: string | null
          last_crawled_at: string | null
          meta_description: string | null
          seo_score: number | null
          title: string | null
          updated_at: string
          url: string
          website_id: string
          word_count: number | null
        }
        Insert: {
          created_at?: string
          h1?: string | null
          id?: string
          index_status?: string | null
          last_crawled_at?: string | null
          meta_description?: string | null
          seo_score?: number | null
          title?: string | null
          updated_at?: string
          url: string
          website_id: string
          word_count?: number | null
        }
        Update: {
          created_at?: string
          h1?: string | null
          id?: string
          index_status?: string | null
          last_crawled_at?: string | null
          meta_description?: string | null
          seo_score?: number | null
          title?: string | null
          updated_at?: string
          url?: string
          website_id?: string
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pages_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      rank_history: {
        Row: {
          device: string | null
          id: string
          keyword_id: string
          location: string | null
          position: number | null
          serp_features: string[] | null
          tracked_at: string
        }
        Insert: {
          device?: string | null
          id?: string
          keyword_id: string
          location?: string | null
          position?: number | null
          serp_features?: string[] | null
          tracked_at?: string
        }
        Update: {
          device?: string | null
          id?: string
          keyword_id?: string
          location?: string | null
          position?: number | null
          serp_features?: string[] | null
          tracked_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rank_history_keyword_id_fkey"
            columns: ["keyword_id"]
            isOneToOne: false
            referencedRelation: "keywords"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          primary_color: string | null
          site_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          site_name?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          site_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      websites: {
        Row: {
          business_type: string | null
          created_at: string
          domain: string
          health_score: number | null
          id: string
          language: string | null
          name: string | null
          status: string | null
          target_country: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          business_type?: string | null
          created_at?: string
          domain: string
          health_score?: number | null
          id?: string
          language?: string | null
          name?: string | null
          status?: string | null
          target_country?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          business_type?: string | null
          created_at?: string
          domain?: string
          health_score?: number | null
          id?: string
          language?: string | null
          name?: string | null
          status?: string | null
          target_country?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "seo_manager" | "client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "seo_manager", "client"],
    },
  },
} as const
