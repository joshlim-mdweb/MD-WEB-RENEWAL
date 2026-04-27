export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1";
  };
  public: {
    Tables: {
      ai_credit_transactions: {
        Row: {
          amount: number;
          created_at: string;
          id: string;
          source: string;
          type: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          id?: string;
          source: string;
          type: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          id?: string;
          source?: string;
          type?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      ai_credits: {
        Row: {
          balance: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          balance?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          balance?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
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
      billing_keys: {
        Row: {
          billing_key: string;
          card_company: string | null;
          card_number: string | null;
          created_at: string;
          id: string;
          is_active: boolean;
          user_id: string;
        };
        Insert: {
          billing_key: string;
          card_company?: string | null;
          card_number?: string | null;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          user_id: string;
        };
        Update: {
          billing_key?: string;
          card_company?: string | null;
          card_number?: string | null;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          user_id?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          amount: number;
          created_at: string;
          id: string;
          order_type: string;
          status: string;
          toss_order_id: string;
          toss_payment_key: string | null;
          toss_response: Json | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          id?: string;
          order_type: string;
          status?: string;
          toss_order_id: string;
          toss_payment_key?: string | null;
          toss_response?: Json | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          id?: string;
          order_type?: string;
          status?: string;
          toss_order_id?: string;
          toss_payment_key?: string | null;
          toss_response?: Json | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      payout_batches: {
        Row: {
          budget_id: string;
          created_at: string;
          created_by: string | null;
          id: string;
          notes: string | null;
          status: string;
          survey_id: string;
          total_amount: number;
          total_recipients: number;
          updated_at: string;
        };
        Insert: {
          budget_id: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          notes?: string | null;
          status?: string;
          survey_id: string;
          total_amount?: number;
          total_recipients?: number;
          updated_at?: string;
        };
        Update: {
          budget_id?: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          notes?: string | null;
          status?: string;
          survey_id?: string;
          total_amount?: number;
          total_recipients?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payout_batches_budget_id_fkey";
            columns: ["budget_id"];
            isOneToOne: false;
            referencedRelation: "reward_budgets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payout_batches_survey_id_fkey";
            columns: ["survey_id"];
            isOneToOne: false;
            referencedRelation: "surveys";
            referencedColumns: ["id"];
          },
        ];
      };
      point_ledger: {
        Row: {
          amount: number;
          created_at: string;
          id: string;
          processed_at: string | null;
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
          processed_at?: string | null;
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
          processed_at?: string | null;
          source_id?: string | null;
          source_type?: string;
          status?: string;
          updated_at?: string;
          user_id?: string;
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
          phone: string | null;
          plan: string;
          signup_type: string | null;
          status: string | null;
          uuid: string | null;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          id?: number;
          nick_name: string;
          phone?: string | null;
          plan?: string;
          signup_type?: string | null;
          status?: string | null;
          uuid?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          id?: number;
          nick_name?: string;
          phone?: string | null;
          plan?: string;
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
          status: string;
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
          status?: string;
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
          status?: string;
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
      reward_budgets: {
        Row: {
          created_at: string;
          creator_id: string;
          id: string;
          max_recipients: number;
          paid_at: string | null;
          payment_ref: string | null;
          per_response_amount: number;
          status: string;
          survey_id: string;
          total_amount: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          creator_id: string;
          id?: string;
          max_recipients: number;
          paid_at?: string | null;
          payment_ref?: string | null;
          per_response_amount: number;
          status?: string;
          survey_id: string;
          total_amount: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          creator_id?: string;
          id?: string;
          max_recipients?: number;
          paid_at?: string | null;
          payment_ref?: string | null;
          per_response_amount?: number;
          status?: string;
          survey_id?: string;
          total_amount?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reward_budgets_survey_id_fkey";
            columns: ["survey_id"];
            isOneToOne: true;
            referencedRelation: "surveys";
            referencedColumns: ["id"];
          },
        ];
      };
      reward_eligibility: {
        Row: {
          amount: number;
          budget_id: string;
          confirmed_at: string | null;
          created_at: string;
          disqualify_reason: string | null;
          id: string;
          paid_at: string | null;
          response_id: string;
          status: string;
          survey_id: string;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          amount: number;
          budget_id: string;
          confirmed_at?: string | null;
          created_at?: string;
          disqualify_reason?: string | null;
          id?: string;
          paid_at?: string | null;
          response_id: string;
          status?: string;
          survey_id: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          amount?: number;
          budget_id?: string;
          confirmed_at?: string | null;
          created_at?: string;
          disqualify_reason?: string | null;
          id?: string;
          paid_at?: string | null;
          response_id?: string;
          status?: string;
          survey_id?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "reward_eligibility_budget_id_fkey";
            columns: ["budget_id"];
            isOneToOne: false;
            referencedRelation: "reward_budgets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reward_eligibility_response_id_fkey";
            columns: ["response_id"];
            isOneToOne: false;
            referencedRelation: "responses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reward_eligibility_survey_id_fkey";
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
      subscriptions: {
        Row: {
          billing_key_id: string | null;
          created_at: string;
          expires_at: string | null;
          id: string;
          plan: string;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          billing_key_id?: string | null;
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          plan: string;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          billing_key_id?: string | null;
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          plan?: string;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_billing_key_id_fkey";
            columns: ["billing_key_id"];
            isOneToOne: false;
            referencedRelation: "billing_keys";
            referencedColumns: ["id"];
          },
        ];
      };
      survey_analyses: {
        Row: {
          created_at: string;
          creator_id: string;
          credit_tx_id: string | null;
          data_point: Json | null;
          id: string;
          prompt: string;
          sentence: string | null;
          status: string;
          survey_id: string;
        };
        Insert: {
          created_at?: string;
          creator_id: string;
          credit_tx_id?: string | null;
          data_point?: Json | null;
          id?: string;
          prompt: string;
          sentence?: string | null;
          status?: string;
          survey_id: string;
        };
        Update: {
          created_at?: string;
          creator_id?: string;
          credit_tx_id?: string | null;
          data_point?: Json | null;
          id?: string;
          prompt?: string;
          sentence?: string | null;
          status?: string;
          survey_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "survey_analyses_survey_id_fkey";
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
          purpose: string | null;
          reward_amount: number | null;
          reward_type: string;
          reward_winner_count: number | null;
          status: string;
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
          purpose?: string | null;
          reward_amount?: number | null;
          reward_type?: string;
          reward_winner_count?: number | null;
          status?: string;
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
          purpose?: string | null;
          reward_amount?: number | null;
          reward_type?: string;
          reward_winner_count?: number | null;
          status?: string;
          tags?: string[] | null;
          target_participant_count?: number | null;
          thumbnail_url?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_events: {
        Row: {
          created_at: string | null;
          event_name: string;
          id: string;
          properties: Json | null;
          session_id: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          event_name: string;
          id?: string;
          properties?: Json | null;
          session_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          event_name?: string;
          id?: string;
          properties?: Json | null;
          session_id?: string | null;
          user_id?: string | null;
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
      cleanup_expired_sessions: { Args: never; Returns: undefined };
      increment_sections_order_index: {
        Args: { p_min_order_index: number; p_survey_id: string };
        Returns: undefined;
      };
      spend_survey_access_points: {
        Args: { p_survey_id: string; p_user_id: string };
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
