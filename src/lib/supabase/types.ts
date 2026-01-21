import { ResearchResponse } from '../types';

export interface DatabaseUser {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseProfile {
  id: string; // References auth.users(id)
  email: string | null;
  has_completed_onboarding: boolean;
  onboarding_path: 'direct' | 'discovery' | null;
  created_at: string;
  updated_at: string;
}

export type ResearchStatus = 'pending' | 'processing' | 'completed' | 'error';

export interface DatabaseReport {
  id: string;
  user_id: string;
  name: string;
  request_email: string;
  request_pdf_filename: string;
  request_business_context: string;
  request_research_priority: string;
  response_data: ResearchResponse | null;
  google_doc_url: string | null;
  research_status: ResearchStatus;
  research_error: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateReportInput {
  user_id: string;
  name: string;
  request_email: string;
  request_pdf_filename: string;
  request_business_context?: string;
  request_research_priority?: string;
  response_data: ResearchResponse;
  google_doc_url?: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: DatabaseUser;
        Insert: Omit<DatabaseUser, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DatabaseUser, 'id'>>;
      };
      profiles: {
        Row: DatabaseProfile;
        Insert: Omit<DatabaseProfile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DatabaseProfile, 'id'>>;
      };
      reports: {
        Row: DatabaseReport;
        Insert: Omit<DatabaseReport, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DatabaseReport, 'id'>>;
      };
    };
  };
}
