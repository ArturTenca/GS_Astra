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
        Insert: {
          name: string;
          code: string;
          description?: string | null;
          status?: Database['public']['Enums']['mission_status'];
          start_at?: string | null;
          end_at?: string | null;
        };
        Update: {
          name?: string;
          code?: string;
          description?: string | null;
          status?: Database['public']['Enums']['mission_status'];
          start_at?: string | null;
          end_at?: string | null;
        };
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
        Insert: {
          mission_id: string;
          name: string;
          code: string;
          location_label?: string | null;
          environment_summary?: string | null;
          status?: Database['public']['Enums']['colony_status'];
        };
        Update: {
          name?: string;
          code?: string;
          location_label?: string | null;
          environment_summary?: string | null;
          status?: Database['public']['Enums']['colony_status'];
        };
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
          mission_id?: string;
          colony_id?: string | null;
          title?: string;
          description?: string;
          severity?: Database['public']['Enums']['incident_severity'];
          status?: Database['public']['Enums']['incident_status'];
          latitude?: number | null;
          longitude?: number | null;
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
      incident_attachments: {
        Row: {
          id: string;
          incident_id: string;
          uploaded_by: string;
          storage_path: string;
          file_name: string;
          mime_type: string;
          file_size_bytes: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          incident_id: string;
          uploaded_by: string;
          storage_path: string;
          file_name: string;
          mime_type: string;
          file_size_bytes: number;
        };
        Update: Record<string, unknown>;
        Relationships: [];
      };
      mission_members: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown>; Relationships: [] };
      colony_members: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown>; Relationships: [] };
      alerts: {
        Row: {
          id: string;
          mission_id: string;
          colony_id: string | null;
          incident_id: string | null;
          title: string;
          message: string;
          severity: Database['public']['Enums']['alert_severity'];
          acknowledged_at: string | null;
          acknowledged_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          mission_id: string;
          colony_id?: string | null;
          incident_id?: string | null;
          title: string;
          message: string;
          severity?: Database['public']['Enums']['alert_severity'];
        };
        Update: {
          acknowledged_at?: string | null;
          acknowledged_by?: string | null;
        };
        Relationships: [];
      };
      colony_telemetry: {
        Row: {
          id: string;
          colony_id: string;
          metric_key: string;
          value: number;
          unit: string;
          recorded_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          colony_id: string;
          metric_key: string;
          value: number;
          unit: string;
          recorded_at?: string;
        };
        Update: Record<string, unknown>;
        Relationships: [];
      };
      audit_events: {
        Row: {
          id: string;
          actor_id: string | null;
          action: Database['public']['Enums']['audit_action'];
          resource_type: string | null;
          resource_id: string | null;
          metadata: Json;
          platform: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          actor_id: string;
          action: Database['public']['Enums']['audit_action'];
          resource_type?: string | null;
          resource_id?: string | null;
          metadata?: Json;
          platform?: string | null;
        };
        Update: Record<string, unknown>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      activate_own_profile_if_confirmed: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      can_read_audit_events: {
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
      alert_severity: 'info' | 'warning' | 'critical';
      audit_action:
        | 'auth.login'
        | 'auth.logout'
        | 'auth.mfa_enrolled'
        | 'auth.mfa_verified'
        | 'auth.mfa_removed'
        | 'incident.created'
        | 'incident.status_updated'
        | 'incident.attachment_uploaded'
        | 'security.access_denied';
    };
    CompositeTypes: Record<string, never>;
  };
};
