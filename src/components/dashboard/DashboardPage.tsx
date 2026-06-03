import { useNavigate } from 'react-router-dom'
import { StatCard, Card, CardHeader, CardBody, Badge, Avatar, Progress, Skeleton } from '@/components/ui'
import { useDashboard } from '@/hooks'
import { formatCurrency } from '@/lib/utils'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'

export function DashboardPage() {
  const navigate = useNavigate()
  const { data, isLoading } = useDashboard()

  if (isLoading) return <DashboardSkeleton />

  const stats = data!

  return (
    <div className="space-y-6">
      {/* Announcement Banner */}
      <div onClick={() => navigate('/performance')} className="flex items-start gap-4 bg-brand-500/8 border border-brand-500/20 rounded-2xl px-5 py-4 cursor-pointer hover:border-brand-500/35 transition-colors group">
        <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center text-base flex-shrink-0">📣</div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm mb-0.5">Q2 2026 Performance Reviews Open</p>
          <p className="text-sm text-slate-400">All managers must complete performance evaluations by March 28, 2026. 186 of 248 reviews submitted.</p>
        </div>
        <Badge status="pending" className="flex-shrink-0 mt-0.5">Deadline in 15d</Badge>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Total Employees"
          value="248"
          change="+12 this quarter"
          changeType="up"
          icon="👥"
          accent="bg-brand-500"
        />
        <StatCard
          label="Attendance Rate"
          value="94.2%"
          change="+1.8% vs last month"
          changeType="up"
          icon="✓"
          accent="bg-teal-500"
        />
        <StatCard
          label="Open Positions"
          value="17"
          change="5 new this week"
          changeType="down"
          icon="⚡"
          accent="bg-amber-500"
        />
        <StatCard
          label="Turnover Rate"
          value="3.2%"
          change="Down 0.4% YoY"
          changeType="up"
          icon="↓"
          accent="bg-red-500"
        />
      </div>

      {/* Row 2: Charts */}
      <div className="grid grid-cols-2 gap-5">
        {/* Headcount by Department */}
        <Card>
          <CardHeader>
            <div>
              <h3 className="font-display font-semibold text-white text-sm">Headcount by Department</h3>
              <p className="text-xs text-slate-500 mt-0.5">As of March 2026</p>
            </div>
            <Badge status="active">Live</Badge>
          </CardHeader>
          <CardBody>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie data={stats.dept_headcount} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="count" paddingAngle={2}>
                    {stats.dept_headcount.map((entry: { color: string }, i: number) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2 flex-1">
                {stats.dept_headcount.map((d: { department: string; count: number; color: string }) => (
                  <div key={d.department} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: d.color }} />
                    <span className="text-xs text-slate-400 flex-1 truncate">{d.department}</span>
                    <span className="text-xs font-semibold text-white">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Headcount Trend */}
        <Card>
          <CardHeader>
            <div>
              <h3 className="font-display font-semibold text-white text-sm">Headcount Trend</h3>
              <p className="text-xs text-slate-500 mt-0.5">Last 12 months</p>
            </div>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={130}>
              <AreaChart data={stats.headcount_trend} margin={{ top: 4, right: 0, left: -30, bottom: 0 }}>
                <defs>
                  <linearGradient id="headGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip
                  contentStyle={{ background: '#1a1c23', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, fontSize: 12, color: '#e2e8f0' }}
                  cursor={{ stroke: 'rgba(108,99,255,0.3)', strokeWidth: 1 }}
                />
                <Area type="monotone" dataKey="count" stroke="#6C63FF" strokeWidth={2} fill="url(#headGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex justify-between text-xs text-slate-500 mt-1 px-1">
              <span>218 employees</span>
              <span className="text-emerald-400">+30 in 12 mo (+13.8%)</span>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Row 3: Activity + Upcoming */}
      <div className="grid grid-cols-2 gap-5">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <h3 className="font-display font-semibold text-white text-sm">Recent Activity</h3>
            <button onClick={() => navigate('/analytics')} className="text-xs text-brand-400 hover:text-brand-300 transition-colors">View all →</button>
          </CardHeader>
          <CardBody className="p-0">
            {stats.activity_feed.map((item: { id: number; text: string; time: string; dept: string; color: string }, i: number) => (
              <div key={item.id} className={`flex gap-3 px-5 py-3.5 ${i < stats.activity_feed.length - 1 ? 'border-b border-white/4' : ''}`}>
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{
                    __html: item.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-medium">$1</strong>')
                  }} />
                  <p className="text-xs text-slate-600 mt-0.5">{item.time} · {item.dept}</p>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <h3 className="font-display font-semibold text-white text-sm">Upcoming This Week</h3>
            <Badge status="active" className="bg-teal-500/15 text-teal-400 border-teal-500/20">5 events</Badge>
          </CardHeader>
          <CardBody className="p-0">
            {stats.upcoming_events.map((evt: { id: number; title: string; date: string; time: string; detail: string; color: string }, i: number) => (
              <div key={evt.id} className={`flex gap-3 px-5 py-3.5 ${i < stats.upcoming_events.length - 1 ? 'border-b border-white/4' : ''}`}>
                <div className={`w-0.5 self-stretch rounded-full flex-shrink-0 ${evt.color.replace('border-', 'bg-')}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{evt.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{evt.date} · {evt.time} · {evt.detail}</p>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      {/* Row 4: KPIs */}
      <div className="grid grid-cols-3 gap-5">
        <Card>
          <CardHeader><h3 className="font-display font-semibold text-white text-sm">Today's Presence</h3></CardHeader>
          <CardBody className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1.5"><span className="text-slate-400">In Office</span><span className="font-medium text-white">142 (57%)</span></div>
              <Progress value={57} color="bg-brand-500" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5"><span className="text-slate-400">Remote / WFH</span><span className="font-medium text-white">79 (32%)</span></div>
              <Progress value={32} color="bg-amber-500" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5"><span className="text-slate-400">On Leave</span><span className="font-medium text-white">27 (11%)</span></div>
              <Progress value={11} color="bg-teal-500" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><h3 className="font-display font-semibold text-white text-sm">Turnover Trend</h3></CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={90}>
              <BarChart data={stats.turnover_trend} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1a1c23', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, fontSize: 11, color: '#e2e8f0' }} />
                <Bar dataKey="rate" fill="#EF4444" opacity={0.6} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-emerald-400 mt-2 text-center">↓ Declining — down 3.8% since Apr 2025</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><h3 className="font-display font-semibold text-white text-sm">2026 Workforce Goals</h3></CardHeader>
          <CardBody className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5"><span className="text-slate-400">Headcount Target</span><span className="font-medium text-white">248 / 300</span></div>
              <Progress value={248} max={300} height="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5"><span className="text-slate-400">Training Hours</span><span className="font-medium text-white">24h / 40h</span></div>
              <Progress value={24} max={40} color="bg-amber-500" height="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5"><span className="text-slate-400">eNPS Target</span><span className="font-medium text-white">+47 / +60</span></div>
              <Progress value={47} max={60} color="bg-teal-500" height="h-2" />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-16 rounded-2xl" />
      <div className="grid grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}</div>
      <div className="grid grid-cols-2 gap-5">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-52 rounded-2xl" />)}</div>
      <div className="grid grid-cols-2 gap-5">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-52 rounded-2xl" />)}</div>
    </div>
  )
}
