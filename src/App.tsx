import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import { Layout } from '@/components/layout/Layout'
import { RequireAuth } from '@/components/auth/RequireAuth'
import { LoginPage } from '@/components/auth/LoginPage'
import { DashboardPage } from '@/components/dashboard/DashboardPage'
import { EmployeesPage } from '@/components/employees/EmployeesPage'
import { RecruitmentPage } from '@/components/recruitment/RecruitmentPage'
import { AttendancePage } from '@/components/attendance/AttendancePage'
import { PayrollPage } from '@/components/payroll/PayrollPage'
import { PerformancePage } from '@/components/performance/PerformancePage'
import { AnalyticsPage } from '@/components/analytics/AnalyticsPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
            <Route path="/" element={<DashboardPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/recruitment" element={<RecruitmentPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/payroll" element={<PayrollPage />} />
            <Route path="/performance" element={<PerformancePage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/documents" element={<PlaceholderPage title="Documents" icon="📄" />} />
            <Route path="/settings" element={<PlaceholderPage title="Settings" icon="⚙️" />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1a1c23',
            color: '#f1f5f9',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 12,
            fontSize: 13,
          },
          success: { iconTheme: { primary: '#3dd68c', secondary: '#1a1c23' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#1a1c23' } },
        }}
      />

      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}

function PlaceholderPage({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
      <span className="text-5xl opacity-30">{icon}</span>
      <p className="font-display text-lg font-semibold text-white opacity-40">{title}</p>
      <p className="text-sm text-slate-600">Coming soon</p>
    </div>
  )
}
