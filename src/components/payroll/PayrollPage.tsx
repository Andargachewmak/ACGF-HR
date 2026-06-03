import { Card, CardHeader, CardBody, Badge, Button, StatCard, Avatar, Progress, Table, Th, Td, Skeleton } from '@/components/ui'
import toast from 'react-hot-toast'
import { usePayroll } from '@/hooks'
import { formatCurrency, formatDate } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const DEPT_PAYROLL = [
  { dept: 'Engineering', amount: 412000, pct: 33, color: '#6C63FF' },
  { dept: 'Sales & Marketing', amount: 298000, pct: 24, color: '#00D4AA' },
  { dept: 'Finance', amount: 218000, pct: 18, color: '#FF5F5F' },
  { dept: 'Operations', amount: 168000, pct: 14, color: '#F5A623' },
  { dept: 'Design & Product', amount: 98000, pct: 8, color: '#E86FA0' },
  { dept: 'HR', amount: 46000, pct: 4, color: '#3DD68C' },
]

const MONTHLY_PAYROLL = [
  { month: 'Oct', amount: 1.18 }, { month: 'Nov', amount: 1.19 },
  { month: 'Dec', amount: 1.21 }, { month: 'Jan', amount: 1.20 },
  { month: 'Feb', amount: 1.21 }, { month: 'Mar', amount: 1.24 },
]

export function PayrollPage() {
  const { data: records, isLoading } = usePayroll()

  const totalPayroll = records?.reduce((s, r) => s + r.net_pay, 0) ?? 0
  const totalBonus = records?.reduce((s, r) => s + r.bonus, 0) ?? 0
  const totalDeductions = records?.reduce((s, r) => s + r.deductions, 0) ?? 0

  function exportCsv() {
    if (!records?.length) { toast.error('No records to export'); return }
    const header = ['Employee', 'Department', 'Base Salary', 'Bonus', 'Deductions', 'Net Pay', 'Status']
    const rows = records.map(r => [
      `${r.employee?.first_name ?? ''} ${r.employee?.last_name ?? ''}`.trim(),
      r.employee?.department ?? '',
      r.base_salary, r.bonus, r.deductions, r.net_pay, r.status,
    ])
    const csv = [header, ...rows].map(line => line.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'payroll-march-2026.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Payroll exported')
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="March Total Payroll" value="$1.24M" change="+2.3% vs Feb" changeType="up" icon="💰" accent="bg-teal-500" />
        <StatCard label="Avg. Salary" value="$147K" change="Across 248 employees" icon="📊" accent="bg-brand-500" />
        <StatCard label="Bonuses Paid" value="$186K" change="Q1 performance bonuses" changeType="up" icon="🎯" accent="bg-amber-500" />
        <StatCard label="Benefits Cost" value="$324K" change="+1.1% vs Feb" changeType="down" icon="🛡" accent="bg-red-500" />
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Top Compensations */}
        <Card>
          <CardHeader>
            <h3 className="font-display font-semibold text-white text-sm">Top Compensations</h3>
            <Badge status="processed" className="bg-brand-500/15 text-brand-400 border-brand-500/20">March 2026</Badge>
          </CardHeader>
          {isLoading ? (
            <CardBody><div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div></CardBody>
          ) : (
            <div className="divide-y divide-white/4">
              {records?.sort((a, b) => (b.base_salary + b.bonus) - (a.base_salary + a.bonus)).slice(0, 6).map((rec, i) => {
                const emp = rec.employee
                if (!emp) return null
                const gross = rec.base_salary + rec.bonus
                return (
                  <div key={rec.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/2 transition-colors">
                    <span className="text-sm text-slate-600 w-4 text-center font-mono">{i + 1}</span>
                    <Avatar name={`${emp.first_name} ${emp.last_name}`} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{emp.first_name} {emp.last_name}</p>
                      <p className="text-xs text-slate-500">{emp.job_title} · {emp.department}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-sm font-semibold text-white">{formatCurrency(gross)}</p>
                      {rec.bonus > 0 && <p className="text-xs text-emerald-400">+{formatCurrency(rec.bonus)} bonus</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        {/* Payroll by Department */}
        <Card>
          <CardHeader>
            <h3 className="font-display font-semibold text-white text-sm">Payroll by Department</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            {DEPT_PAYROLL.map(d => (
              <div key={d.dept}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400">{d.dept}</span>
                  <span className="text-white font-medium">{formatCurrency(d.amount)} · {d.pct}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${d.pct}%`, background: d.color }} />
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <h3 className="font-display font-semibold text-white text-sm">Monthly Payroll Trend</h3>
          <span className="text-xs text-slate-500">Last 6 months ($M)</span>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={MONTHLY_PAYROLL} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} domain={[1.1, 1.3]} tickFormatter={v => `$${v}M`} />
              <Tooltip
                contentStyle={{ background: '#1a1c23', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, fontSize: 12 }}
                formatter={(v: number) => [`$${v}M`, 'Payroll']}
              />
              <Bar dataKey="amount" fill="#6C63FF" radius={[4, 4, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Full Payroll Table */}
      <Card>
        <CardHeader>
          <h3 className="font-display font-semibold text-white text-sm">Payroll Records — March 2026</h3>
          <div className="flex items-center gap-2">
            <Badge status="processed">All Processed</Badge>
            <Button size="sm" variant="ghost" onClick={exportCsv}>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <Table>
          <thead>
            <tr>
              <Th>Employee</Th>
              <Th>Base Salary</Th>
              <Th>Bonus</Th>
              <Th>Deductions</Th>
              <Th>Net Pay</Th>
              <Th>Status</Th>
              <Th>Processed</Th>
            </tr>
          </thead>
          <tbody>
            {records?.map(rec => {
              const emp = rec.employee
              if (!emp) return null
              return (
                <tr key={rec.id} className="hover:bg-white/2 transition-colors">
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <Avatar name={`${emp.first_name} ${emp.last_name}`} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-white">{emp.first_name} {emp.last_name}</p>
                        <p className="text-xs text-slate-500">{emp.department}</p>
                      </div>
                    </div>
                  </Td>
                  <Td className="font-mono text-xs">{formatCurrency(rec.base_salary)}</Td>
                  <Td className="font-mono text-xs text-emerald-400">{rec.bonus > 0 ? `+${formatCurrency(rec.bonus)}` : '—'}</Td>
                  <Td className="font-mono text-xs text-red-400">-{formatCurrency(rec.deductions)}</Td>
                  <Td className="font-mono text-xs font-semibold text-white">{formatCurrency(rec.net_pay)}</Td>
                  <Td><Badge status={rec.status} /></Td>
                  <Td className="text-xs">{rec.processed_at ? formatDate(rec.processed_at) : '—'}</Td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </Card>
    </div>
  )
}
