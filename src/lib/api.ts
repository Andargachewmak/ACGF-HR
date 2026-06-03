/**
 * Nexus HR — Supabase API Layer
 * All data fetching goes through these functions.
 * Falls back to mock data when Supabase is not configured.
 */

import { supabase } from './supabase'
import * as mock from './mock-data'
import type {
  Employee, LeaveRequest, JobPosting, Candidate,
  PayrollRecord, PerformanceReview, Goal, Attendance,
  LeaveStatus, CandidateStage, EmployeeStatus,
} from '@/types'

const IS_MOCK = !import.meta.env.VITE_SUPABASE_URL

// ─── Employees ───────────────────────────────────────────────────────────────

export async function fetchEmployees(filters?: {
  department?: string
  status?: EmployeeStatus
  search?: string
}): Promise<Employee[]> {
  if (IS_MOCK) {
    let data = mock.MOCK_EMPLOYEES
    if (filters?.department) data = data.filter(e => e.department === filters.department)
    if (filters?.status) data = data.filter(e => e.status === filters.status)
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      data = data.filter(e =>
        `${e.first_name} ${e.last_name}`.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.job_title.toLowerCase().includes(q)
      )
    }
    return data.map(e => ({ ...e, full_name: `${e.first_name} ${e.last_name}` }))
  }

  let query = supabase
    .from('employees')
    .select('*')
    .order('start_date', { ascending: false })

  if (filters?.department) query = query.eq('department', filters.department)
  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.search) query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)

  const { data, error } = await query
  if (error) throw error
  return (data ?? []).map(e => ({ ...e, full_name: `${e.first_name} ${e.last_name}` })) as Employee[]
}

export async function fetchEmployee(id: string): Promise<Employee | null> {
  if (IS_MOCK) {
    const emp = mock.MOCK_EMPLOYEES.find(e => e.id === id)
    if (!emp) return null
    const manager = emp.manager_id ? mock.MOCK_EMPLOYEES.find(e => e.id === emp.manager_id) : undefined
    return { ...emp, full_name: `${emp.first_name} ${emp.last_name}`, manager }
  }

  const { data, error } = await supabase
    .from('employees')
    .select('*, manager:manager_id(id, first_name, last_name, job_title, avatar_url)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Employee
}

export async function createEmployee(emp: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee> {
  if (IS_MOCK) {
    const newEmp = { ...emp, id: Date.now().toString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    mock.MOCK_EMPLOYEES.push(newEmp as Employee)
    return newEmp as Employee
  }
  const { data, error } = await supabase.from('employees').insert(emp).select().single()
  if (error) throw error
  return data as Employee
}

export async function updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee> {
  if (IS_MOCK) {
    const idx = mock.MOCK_EMPLOYEES.findIndex(e => e.id === id)
    if (idx === -1) throw new Error('Employee not found')
    mock.MOCK_EMPLOYEES[idx] = { ...mock.MOCK_EMPLOYEES[idx], ...updates, updated_at: new Date().toISOString() }
    return mock.MOCK_EMPLOYEES[idx]
  }
  const { data, error } = await supabase.from('employees').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) throw error
  return data as Employee
}

export async function deleteEmployee(id: string): Promise<void> {
  if (IS_MOCK) {
    const idx = mock.MOCK_EMPLOYEES.findIndex(e => e.id === id)
    if (idx !== -1) mock.MOCK_EMPLOYEES.splice(idx, 1)
    return
  }
  const { error } = await supabase.from('employees').delete().eq('id', id)
  if (error) throw error
}

// ─── Dashboard Stats ─────────────────────────────────────────────────────────

export async function fetchDashboardStats() {
  if (IS_MOCK) {
    return {
      total_employees: 248,
      attendance_rate: 94.2,
      open_positions: 17,
      turnover_rate: 3.2,
      headcount_change: 12,
      attendance_change: 1.8,
      new_positions: 5,
      turnover_change: -0.4,
      dept_headcount: mock.DEPT_HEADCOUNT,
      headcount_trend: mock.HEADCOUNT_TREND,
      turnover_trend: mock.TURNOVER_TREND,
      activity_feed: mock.ACTIVITY_FEED,
      upcoming_events: mock.UPCOMING_EVENTS,
    }
  }

  const { data, error } = await supabase.rpc('get_dashboard_stats')
  if (error) throw error
  return data
}

// ─── Leave Requests ──────────────────────────────────────────────────────────

export async function fetchLeaveRequests(filters?: { status?: LeaveStatus; employee_id?: string }): Promise<LeaveRequest[]> {
  if (IS_MOCK) {
    let data = mock.MOCK_LEAVE_REQUESTS
    if (filters?.status) data = data.filter(l => l.status === filters.status)
    if (filters?.employee_id) data = data.filter(l => l.employee_id === filters.employee_id)
    return data
  }

  let query = supabase
    .from('leave_requests')
    .select('*, employee:employee_id(id, first_name, last_name, department, avatar_url)')
    .order('created_at', { ascending: false })

  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.employee_id) query = query.eq('employee_id', filters.employee_id)

  const { data, error } = await query
  if (error) throw error
  return data as LeaveRequest[]
}

export async function updateLeaveStatus(id: string, status: LeaveStatus, approved_by?: string): Promise<void> {
  if (IS_MOCK) {
    const req = mock.MOCK_LEAVE_REQUESTS.find(l => l.id === id)
    if (req) { req.status = status; if (approved_by) req.approved_by = approved_by }
    return
  }
  const { error } = await supabase.from('leave_requests').update({ status, approved_by }).eq('id', id)
  if (error) throw error
}

export async function createLeaveRequest(req: Omit<LeaveRequest, 'id' | 'created_at'>): Promise<LeaveRequest> {
  if (IS_MOCK) {
    const newReq = { ...req, id: Date.now().toString(), created_at: new Date().toISOString() }
    mock.MOCK_LEAVE_REQUESTS.push(newReq)
    return newReq
  }
  const { data, error } = await supabase.from('leave_requests').insert(req).select().single()
  if (error) throw error
  return data as LeaveRequest
}

// ─── Attendance ──────────────────────────────────────────────────────────────

export async function fetchAttendance(date?: string): Promise<Attendance[]> {
  if (IS_MOCK) {
    const today = date || new Date().toISOString().split('T')[0]
    return mock.MOCK_EMPLOYEES.map(emp => ({
      id: `att-${emp.id}-${today}`,
      employee_id: emp.id,
      date: today,
      type: emp.status === 'wfh' ? 'wfh' as const :
            emp.status === 'on_leave' ? 'leave' as const :
            emp.status === 'active' ? 'office' as const : 'absent' as const,
      employee: emp,
    }))
  }

  const query = date
    ? supabase.from('attendance').select('*, employee:employee_id(*)').eq('date', date)
    : supabase.from('attendance').select('*, employee:employee_id(*)').order('date', { ascending: false }).limit(100)

  const { data, error } = await query
  if (error) throw error
  return data as Attendance[]
}

// ─── Job Postings ─────────────────────────────────────────────────────────────

export async function fetchJobPostings(filters?: { status?: string; department?: string }): Promise<JobPosting[]> {
  if (IS_MOCK) {
    let data = mock.MOCK_JOB_POSTINGS
    if (filters?.status) data = data.filter(j => j.status === filters.status)
    if (filters?.department) data = data.filter(j => j.department === filters.department)
    return data
  }

  let query = supabase.from('job_postings').select('*').order('created_at', { ascending: false })
  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.department) query = query.eq('department', filters.department)

  const { data, error } = await query
  if (error) throw error
  return data as JobPosting[]
}

export async function createJobPosting(
  job: Omit<JobPosting, 'id' | 'created_at' | 'updated_at' | 'applicant_count' | 'recruiter'>,
): Promise<JobPosting> {
  if (IS_MOCK) {
    const newJob = {
      ...job,
      id: Date.now().toString(),
      applicant_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as JobPosting
    mock.MOCK_JOB_POSTINGS.unshift(newJob)
    return newJob
  }
  const { data, error } = await supabase.from('job_postings').insert(job).select().single()
  if (error) throw error
  return data as JobPosting
}

export async function fetchCandidates(jobId?: string): Promise<Candidate[]> {
  if (IS_MOCK) {
    return jobId
      ? mock.MOCK_CANDIDATES.filter(c => c.job_id === jobId)
      : mock.MOCK_CANDIDATES
  }

  let query = supabase.from('candidates').select('*, job:job_id(*)').order('created_at', { ascending: false })
  if (jobId) query = query.eq('job_id', jobId)

  const { data, error } = await query
  if (error) throw error
  return data as Candidate[]
}

export async function updateCandidateStage(id: string, stage: CandidateStage): Promise<void> {
  if (IS_MOCK) {
    const c = mock.MOCK_CANDIDATES.find(c => c.id === id)
    if (c) c.stage = stage
    return
  }
  const { error } = await supabase.from('candidates').update({ stage, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}

// ─── Payroll ──────────────────────────────────────────────────────────────────

export async function fetchPayrollRecords(period?: string): Promise<PayrollRecord[]> {
  if (IS_MOCK) {
    const records = mock.MOCK_PAYROLL.map(p => ({
      ...p,
      employee: mock.MOCK_EMPLOYEES.find(e => e.id === p.employee_id),
    }))
    return period ? records.filter(p => p.period_start.startsWith(period)) : records
  }

  let query = supabase
    .from('payroll_records')
    .select('*, employee:employee_id(*)')
    .order('period_start', { ascending: false })
  if (period) query = query.ilike('period_start', `${period}%`)

  const { data, error } = await query
  if (error) throw error
  return data as PayrollRecord[]
}

export async function processPayroll(employeeIds: string[], period_start: string, period_end: string): Promise<void> {
  if (IS_MOCK) { return }
  const records = employeeIds.map(id => ({
    employee_id: id, period_start, period_end,
    base_salary: 0, bonus: 0, deductions: 0, net_pay: 0,
    status: 'pending' as const,
  }))
  const { error } = await supabase.from('payroll_records').insert(records)
  if (error) throw error
}

// ─── Performance ─────────────────────────────────────────────────────────────

export async function fetchPerformanceReviews(filters?: { period?: string; employee_id?: string }): Promise<PerformanceReview[]> {
  if (IS_MOCK) {
    let data = mock.MOCK_REVIEWS.map(r => ({
      ...r,
      employee: mock.MOCK_EMPLOYEES.find(e => e.id === r.employee_id),
      reviewer: mock.MOCK_EMPLOYEES.find(e => e.id === r.reviewer_id),
    }))
    if (filters?.period) data = data.filter(r => r.period === filters.period)
    if (filters?.employee_id) data = data.filter(r => r.employee_id === filters.employee_id)
    return data
  }

  let query = supabase
    .from('performance_reviews')
    .select('*, employee:employee_id(*), reviewer:reviewer_id(*)')
    .order('created_at', { ascending: false })
  if (filters?.period) query = query.eq('period', filters.period)
  if (filters?.employee_id) query = query.eq('employee_id', filters.employee_id)

  const { data, error } = await query
  if (error) throw error
  return data as PerformanceReview[]
}

export async function fetchGoals(employee_id?: string): Promise<Goal[]> {
  if (IS_MOCK) {
    const data = mock.MOCK_GOALS.map(g => ({
      ...g,
      employee: mock.MOCK_EMPLOYEES.find(e => e.id === g.employee_id),
    }))
    return employee_id ? data.filter(g => g.employee_id === employee_id) : data
  }

  let query = supabase.from('goals').select('*, employee:employee_id(*)').order('target_date')
  if (employee_id) query = query.eq('employee_id', employee_id)

  const { data, error } = await query
  if (error) throw error
  return data as Goal[]
}

export async function updateGoalProgress(id: string, progress: number): Promise<void> {
  if (IS_MOCK) {
    const g = mock.MOCK_GOALS.find(g => g.id === id)
    if (g) { g.progress = progress; g.status = progress >= 100 ? 'completed' : g.status }
    return
  }
  const status = progress >= 100 ? 'completed' : undefined
  const { error } = await supabase.from('goals').update({ progress, ...(status ? { status } : {}) }).eq('id', id)
  if (error) throw error
}
