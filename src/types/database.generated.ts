/**
 * Replace with `supabase gen types typescript` after linking your project.
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
      missions: {
        Row: {
          id: string;
          name: string;
          code: string;
          description: string | null;
          status: Database['public']['Enums']['mission_status'];
          start_at: string | null;
          end_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
      colonies: {
        Row: {
          id: string;
          mission_id: string;
          name: string;
          code: string;
          location_label: string | null;
          status: Database['public']['Enums']['colony_status'];
          environment_summary: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
      incidents: {
        Row: {
          id: string;
          mission_id: string;
          colony_id: string | null;
          reporter_id: string;
          title: string;
          description: string;
          severity: Database['public']['Enums']['incident_severity'];
          status: Database['public']['Enums']['incident_status'];
          latitude: number | null;
          longitude: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          mission_id: string;
          colony_id?: string | null;
          reporter_id: string;
          title: string;
          description: string;
          severity?: Database['public']['Enums']['incident_severity'];
          status?: Database['public']['Enums']['incident_status'];
          latitude?: number | null;
          longitude?: number | null;
        };
        Update: {
          status?: Database['public']['Enums']['incident_status'];
        };
        Relationships: [];
      };
      incident_status_history: {
        Row: {
          id: string;
          incident_id: string;
          changed_by: string;
          from_status: Database['public']['Enums']['incident_status'] | null;
          to_status: Database['public']['Enums']['incident_status'];
          note: string | null;
          created_at: string;
        };
        Insert: Record<string, unknown>;
        Update: {
          note?: string | null;
        };
        Relationships: [];
      };
      mission_members: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown>; Relationships: [] };
      colony_members: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown>; Relationships: [] };
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
      mission_status: 'planned' | 'active' | 'completed' | 'aborted';
      colony_status: 'operational' | 'degraded' | 'critical' | 'offline';
      incident_severity: 'low' | 'medium' | 'high' | 'critical';
      incident_status: 'open' | 'investigating' | 'resolved' | 'closed';
      membership_role: 'viewer' | 'operator' | 'lead';
    };
    CompositeTypes: Record<string, never>;
  };
};
