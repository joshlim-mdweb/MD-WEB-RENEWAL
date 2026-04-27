export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1";
  };
  public: {
    Tables: {
      answers: {
        Row: {
          id: string;
          question_id: string;
          response_id: string;
          value: Json;
        };
        Insert: {
          id?: string;
          question_id: string;
          response_id: string;
          value: Json;
        };
        Update: {
          id?: string;
          question_id?: string;
          response_id?: string;
          value?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "answers_question_id_fkey";
            columns: ["question_id"];
            isOneToOne: false;
            referencedRelation: "questions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "answers_response_id_fkey";
            columns: ["response_id"];
            isOneToOne: false;
            referencedRelation: "responses";
            referencedColumns: ["id"];
          },
        ];
      };
      point_ledger: {
        Row: {
          amount: number;
          created_at: string;
          id: string;
          source_id: string | null;
          source_type: string;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          id?: string;
          source_id?: string | null;
          source_type: string;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          id?: string;
          source_id?: string | null;
          source_type?: string;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      poll_comments: {
        Row: {
          id: string;
          poll_id: string;
          user_id: string | null;
          parent_id: string | null;
          content: string;
          upvotes: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          poll_id: string;
          user_id?: string | null;
          parent_id?: string | null;
          content: string;
          upvotes?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          poll_id?: string;
          user_id?: string | null;
          parent_id?: string | null;
          content?: string;
          upvotes?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      poll_comment_votes: {
        Row: {
          id: string;
          comment_id: string;
          user_id: string;
          vote: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          comment_id: string;
          user_id: string;
          vote: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          comment_id?: string;
          user_id?: string;
          vote?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      poll_responses: {
        Row: {
          created_at: string;
          id: string;
          poll_id: string;
          selected_option: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          poll_id: string;
          selected_option: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          poll_id?: string;
          selected_option?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "poll_responses_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "polls";
            referencedColumns: ["id"];
          },
        ];
      };
      polls: {
        Row: {
          created_at: string;
          creator_id: string;
          id: string;
          options: Json;
          question: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          creator_id: string;
          id?: string;
          options?: Json;
          question: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          creator_id?: string;
          id?: string;
          options?: Json;
          question?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profile: {
        Row: {
          created_at: string | null;
          email: string;
          id: number;
          nick_name: string;
          signup_type: string | null;
          status: string | null;
          uuid: string | null;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          id?: number;
          nick_name: string;
          signup_type?: string | null;
          status?: string | null;
          uuid?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          id?: number;
          nick_name?: string;
          signup_type?: string | null;
          status?: string | null;
          uuid?: string | null;
        };
        Relationships: [];
      };
      questions: {
        Row: {
          config: Json | null;
          created_at: string;
          id: string;
          next_target: Json | null;
          options: Json | null;
          order_index: number;
          required: boolean | null;
          section_id: string | null;
          survey_id: string;
          title: string;
          type: string;
          updated_at: string;
        };
        Insert: {
          config?: Json | null;
          created_at?: string;
          id?: string;
          next_target?: Json | null;
          options?: Json | null;
          order_index?: number;
          required?: boolean | null;
          section_id?: string | null;
          survey_id: string;
          title?: string;
          type: string;
          updated_at?: string;
        };
        Update: {
          config?: Json | null;
          created_at?: string;
          id?: string;
          next_target?: Json | null;
          options?: Json | null;
          order_index?: number;
          required?: boolean | null;
          section_id?: string | null;
          survey_id?: string;
          title?: string;
          type?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "questions_section_id_fkey";
            columns: ["section_id"];
            isOneToOne: false;
            referencedRelation: "sections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "questions_survey_id_fkey";
            columns: ["survey_id"];
            isOneToOne: false;
            referencedRelation: "surveys";
            referencedColumns: ["id"];
          },
        ];
      };
      responses: {
        Row: {
          created_at: string;
          id: string;
          respondent_ip: unknown;
          respondent_ua: string | null;
          share_id: string | null;
          started_at: string | null;
          survey_id: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          respondent_ip?: unknown;
          respondent_ua?: string | null;
          share_id?: string | null;
          started_at?: string | null;
          survey_id: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          respondent_ip?: unknown;
          respondent_ua?: string | null;
          share_id?: string | null;
          started_at?: string | null;
          survey_id?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "responses_share_id_fkey";
            columns: ["share_id"];
            isOneToOne: false;
            referencedRelation: "survey_shares";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "responses_survey_id_fkey";
            columns: ["survey_id"];
            isOneToOne: false;
            referencedRelation: "surveys";
            referencedColumns: ["id"];
          },
        ];
      };
      sections: {
        Row: {
          border_color: string | null;
          color: string | null;
          created_at: string;
          description: string | null;
          id: string;
          order_index: number;
          survey_id: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          border_color?: string | null;
          color?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          order_index?: number;
          survey_id: string;
          title?: string;
          updated_at?: string;
        };
        Update: {
          border_color?: string | null;
          color?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          order_index?: number;
          survey_id?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sections_survey_id_fkey";
            columns: ["survey_id"];
            isOneToOne: false;
            referencedRelation: "surveys";
            referencedColumns: ["id"];
          },
        ];
      };
      survey_shares: {
        Row: {
          created_at: string;
          created_by: string;
          expires_at: string | null;
          id: string;
          max_responses: number | null;
          response_count: number;
          survey_id: string;
          token: string;
        };
        Insert: {
          created_at?: string;
          created_by: string;
          expires_at?: string | null;
          id?: string;
          max_responses?: number | null;
          response_count?: number;
          survey_id: string;
          token: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          expires_at?: string | null;
          id?: string;
          max_responses?: number | null;
          response_count?: number;
          survey_id?: string;
          token?: string;
        };
        Relationships: [
          {
            foreignKeyName: "survey_shares_survey_id_fkey";
            columns: ["survey_id"];
            isOneToOne: false;
            referencedRelation: "surveys";
            referencedColumns: ["id"];
          },
        ];
      };
      surveys: {
        Row: {
          created_at: string;
          creator_id: string;
          description: string | null;
          end_date: string | null;
          estimated_time: number | null;
          id: string;
          max_participants: number | null;
          max_responses: number | null;
          reward_amount: number | null;
          reward_type: string;
          reward_winner_count: number | null;
          status: string;
          purpose: string | null;
          tags: string[] | null;
          target_participant_count: number | null;
          thumbnail_url: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          creator_id: string;
          description?: string | null;
          end_date?: string | null;
          estimated_time?: number | null;
          id?: string;
          max_participants?: number | null;
          max_responses?: number | null;
          reward_amount?: number | null;
          reward_type?: string;
          reward_winner_count?: number | null;
          status?: string;
          purpose?: string | null;
          tags?: string[] | null;
          target_participant_count?: number | null;
          thumbnail_url?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          creator_id?: string;
          description?: string | null;
          end_date?: string | null;
          estimated_time?: number | null;
          id?: string;
          max_participants?: number | null;
          max_responses?: number | null;
          reward_amount?: number | null;
          reward_type?: string;
          reward_winner_count?: number | null;
          status?: string;
          purpose?: string | null;
          tags?: string[] | null;
          target_participant_count?: number | null;
          thumbnail_url?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      withdrawals: {
        Row: {
          amount: number;
          created_at: string;
          id: string;
          payout_info: Json | null;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          id?: string;
          payout_info?: Json | null;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          id?: string;
          payout_info?: Json | null;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_sections_order_index: {
        Args: { p_min_order_index: number; p_survey_id: string };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
