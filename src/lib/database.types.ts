// Auto-generated from Supabase schema
// Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      employees: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          avatar_url: string | null
          department: string
          job_title: string
          employment_type: string
          status: string
          location: string
          start_date: string
          salary: number
          manager_id: string | null
          bio: string | null
          skills: string[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          avatar_url?: string | null
          department: string
          job_title: string
          employment_type?: string
          status?: string
          location: string
          start_date: string
          salary: number
          manager_id?: string | null
          bio?: string | null
          skills?: string[] | null
        }
        Update: Partial<Database['public']['Tables']['employees']['Insert']>
      }
      leave_requests: {
        Row: {
          id: string
          created_at: string
          employee_id: string
          leave_type: string
          start_date: string
          end_date: string
          days: number
          reason: string | null
          status: string
          approved_by: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          employee_id: string
          leave_type: string
          start_date: string
          end_date: string
          days: number
          reason?: string | null
          status?: string
          approved_by?: string | null
        }
        Update: Partial<Database['public']['Tables']['leave_requests']['Insert']>
      }
      attendance: {
        Row: {
          id: string
          employee_id: string
          date: string
          check_in: string | null
          check_out: string | null
          type: string
          notes: string | null
        }
        Insert: {
          id?: string
          employee_id: string
          date: string
          check_in?: string | null
          check_out?: string | null
          type?: string
          notes?: string | null
        }
        Update: Partial<Database['public']['Tables']['attendance']['Insert']>
      }
      job_postings: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          department: string
          location: string
          employment_type: string
          description: string
          requirements: string[]
          salary_min: number
          salary_max: number
          status: string
          applicant_count: number
          recruiter_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          department: string
          location: string
          employment_type?: string
          description: string
          requirements?: string[]
          salary_min: number
          salary_max: number
          status?: string
          applicant_count?: number
          recruiter_id?: string | null
        }
        Update: Partial<Database['public']['Tables']['job_postings']['Insert']>
      }
      candidates: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          job_id: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          resume_url: string | null
          linkedin_url: string | null
          stage: string
          score: number | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          job_id: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          resume_url?: string | null
          linkedin_url?: string | null
          stage?: string
          score?: number | null
          notes?: string | null
        }
        Update: Partial<Database['public']['Tables']['candidates']['Insert']>
      }
      payroll_records: {
        Row: {
          id: string
          created_at: string
          employee_id: string
          period_start: string
          period_end: string
          base_salary: number
          bonus: number
          deductions: number
          net_pay: number
          status: string
          processed_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          employee_id: string
          period_start: string
          period_end: string
          base_salary: number
          bonus?: number
          deductions?: number
          net_pay: number
          status?: string
          processed_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['payroll_records']['Insert']>
      }
      performance_reviews: {
        Row: {
          id: string
          created_at: string
          employee_id: string
          reviewer_id: string
          period: string
          score: number
          goals_score: number
          skills_score: number
          culture_score: number
          comments: string | null
          status: string
        }
        Insert: {
          id?: string
          created_at?: string
          employee_id: string
          reviewer_id: string
          period: string
          score: number
          goals_score: number
          skills_score: number
          culture_score: number
          comments?: string | null
          status?: string
        }
        Update: Partial<Database['public']['Tables']['performance_reviews']['Insert']>
      }
      goals: {
        Row: {
          id: string
          created_at: string
          employee_id: string
          title: string
          description: string | null
          target_date: string
          progress: number
          status: string
        }
        Insert: {
          id?: string
          created_at?: string
          employee_id: string
          title: string
          description?: string | null
          target_date: string
          progress?: number
          status?: string
        }
        Update: Partial<Database['public']['Tables']['goals']['Insert']>
      }
    }
    Views: {
      employee_stats: {
        Row: {
          total: number
          active: number
          on_leave: number
          wfh: number
        }
      }
    }
    Functions: {
      get_dashboard_stats: {
        Args: Record<string, never>
        Returns: {
          total_employees: number
          attendance_rate: number
          open_positions: number
          turnover_rate: number
        }
      }
      get_headcount_by_department: {
        Args: Record<string, never>
        Returns: { department: string; count: number }[]
      }
      get_monthly_headcount: {
        Args: { months?: number }
        Returns: { month: string; count: number }[]
      }
    }
    Enums: {}
  }
}
