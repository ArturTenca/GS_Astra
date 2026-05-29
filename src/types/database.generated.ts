/**
 * Replace with `supabase gen types typescript` after linking your project.
 * Minimal schema for Phase 0 / Auth foundation.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          role: Database['public']['Enums']['app_role'];
          status: Database['public']['Enums']['profile_status'];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          role?: Database['public']['Enums']['app_role'];
          status?: Database['public']['Enums']['profile_status'];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          role?: Database['public']['Enums']['app_role'];
          status?: Database['public']['Enums']['profile_status'];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      activate_own_profile_if_confirmed: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      app_role:
        | 'viewer'
        | 'operator'
        | 'mission_lead'
        | 'colony_admin'
        | 'security_officer'
        | 'system_admin';
      profile_status: 'active' | 'suspended' | 'pending';
    };
    CompositeTypes: Record<string, never>;
  };
};
