import { Card, CardHeader, CardBody, StatCard, Progress } from '@/components/ui'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, RadarChart,
  Radar, PolarGrid, PolarAngleAxis
} from 'recharts'

const TURNOVER_DATA = [
  { month: 'Apr', rate: 4.8 }, { month: 'May', rate: 4.5 }, { month: 'Jun', rate: 5.1 },
  { month: 'Jul', rate: 5.3 }, { month: 'Aug', rate: 4.7 }, { month: 'Sep', rate: 4.2 },
  { month: 'Oct', rate: 4.0 }, { month: 'Nov', rate: 3.7 }, { month: 'Dec', rate: 3.5 },
  { month: 'Jan', rate: 3.3 }, { month: 'Feb', rate: 3.1 }, { month: 'Mar', rate: 3.2 },
]

const ENPS_TREND = [
  { q: 'Q2 25', score: 32 }, { q: 'Q3 25', score: 38 },
  { q: 'Q4 25', score: 41 }, { q: 'Q1 26', score: 47 },
]

const DIVERSITY = [
  { name: 'Asian', value: 38, color: '#6C63FF' },
  { name: 'White', value: 29, color: '#00D4AA' },
  { name: 'Hispanic/Latino', value: 18, color: '#F5A623' },
  { name: 'Black/African American', value: 10, color: '#E86FA0' },
  { name: 'Other/Mixed', value: 5, color: '#4FA3E8' },
]

const ENGAGEMENT_RADAR = [
  { metric: 'Work-Life Balance', value: 78 },
  { metric: 'Compensation', value: 72 },
  { metric: 'Growth Opp.', value: 85 },
  { metric: 'Team Culture', value: 90 },
  { metric: 'Management', value: 82 },
  { metric: 'Mission Alignment', value: 88 },
]

const AGE_DATA = [
  { range: '20–25', count: 28 },
  { range: '26–30', count: 62 },
  { range: '31–35', count: 74 },
  { range: '36–40', count: 48 },
  { range: '41–45', count: 22 },
  { range: '46+', count: 14 },
]

const HIRE_SOURCE = [
  { source: 'LinkedIn', pct: 38, color: '#6C63FF' },
  { source: 'Referrals', pct: 28, color: '#00D4AA' },
  { source: 'Job Boards', pct: 18, color: '#F5A623' },
  { source: 'Agency', pct: 10, color: '#E86FA0' },
  { source: 'Other', pct: 6, color: '#4FA3E8' },
]

const TOOLTIP_STYLE = {
  background: '#1a1c23',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 12,
  fontSize: 12,
  color: '#e2e8f0',
}

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Top KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="eNPS Score" value="+47" change="+8 vs 2025" changeType="up" icon="📈" accent="bg-teal-500" />
        <StatCard label="Engagement Rate" value="82%" change="Industry avg 68%" changeType="up" icon="💡" accent="bg-brand-500" />
        <StatCard label="Avg. Tenure" value="3.4y" change="+0.3y vs last year" changeType="up" icon="⏳" accent="bg-amber-500" />
        <StatCard label="Training Hours/Emp" value="24h" change="Annual target: 40h" icon="🎓" accent="bg-emerald-500" />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-2 gap-5">
        {/* Turnover */}
        <Card>
          <CardHeader>
            <h3 className="font-display font-semibold text-white text-sm">Turnover Rate Trend</h3>
            <span className="text-xs text-slate-500">Last 12 months (%)</span>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={TURNOVER_DATA} margin={{ top: 4, right: 0, left: -30, bottom: 0 }}>
                <defs>
                  <linearGradient id="turnGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} domain={[2, 6]} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${v}%`, 'Turnover']} />
                <Area type="monotone" dataKey="rate" stroke="#EF4444" strokeWidth={2} fill="url(#turnGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-xs text-emerald-400 text-center mt-1">↓ Down 3.8% since April 2025</p>
          </CardBody>
        </Card>

        {/* eNPS Trend */}
        <Card>
          <CardHeader>
            <h3 className="font-display font-semibold text-white text-sm">eNPS Trend</h3>
            <span className="text-xs text-slate-500">Employee Net Promoter Score</span>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={ENPS_TREND} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="q" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="score" fill="#6C63FF" radius={[4, 4, 0, 0]}>
                  {ENPS_TREND.map((_, i) => (
                    <Cell key={i} fillOpacity={i === ENPS_TREND.length - 1 ? 1 : 0.5} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-brand-400 text-center mt-1">Industry benchmark: +32 · We're 47% above</p>
          </CardBody>
        </Card>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-3 gap-5">
        {/* Diversity pie */}
        <Card>
          <CardHeader><h3 className="font-display font-semibold text-white text-sm">Ethnicity Breakdown</h3></CardHeader>
          <CardBody>
            <div className="flex flex-col items-center gap-4">
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie data={DIVERSITY} cx="50%" cy="50%" outerRadius={52} dataKey="value" paddingAngle={2}>
                    {DIVERSITY.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="w-full space-y-2">
                {DIVERSITY.map(d => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: d.color }} />
                    <span className="text-xs text-slate-400 flex-1">{d.name}</span>
                    <span className="text-xs font-semibold text-white">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Gender Balance */}
        <Card>
          <CardHeader><h3 className="font-display font-semibold text-white text-sm">Gender Balance</h3></CardHeader>
          <CardBody className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-display font-semibold text-white">51%</span>
              <div className="flex-1">
                <Progress value={51} color="bg-brand-500" height="h-3" />
              </div>
              <span className="text-2xl font-display font-semibold text-teal-400">49%</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Women · 127</span>
              <span>Men · 121</span>
            </div>
            <div className="pt-3 border-t border-white/5">
              <p className="text-xs text-slate-500 mb-3">Leadership Positions</p>
              <div className="space-y-2">
                {[
                  { level: 'C-Suite', w: 40, m: 60 },
                  { level: 'VP+', w: 45, m: 55 },
                  { level: 'Director', w: 52, m: 48 },
                  { level: 'Manager', w: 54, m: 46 },
                ].map(row => (
                  <div key={row.level} className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 w-16">{row.level}</span>
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-500 rounded-full" style={{ width: `${row.w}%` }} />
                    </div>
                    <span className="text-slate-400 w-8">{row.w}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Engagement Radar */}
        <Card>
          <CardHeader><h3 className="font-display font-semibold text-white text-sm">Engagement Radar</h3></CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={ENGAGEMENT_RADAR}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#475569', fontSize: 9 }} />
                <Radar name="Score" dataKey="value" stroke="#6C63FF" fill="#6C63FF" fillOpacity={0.2} strokeWidth={1.5} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
              </RadarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Row 4 */}
      <div className="grid grid-cols-2 gap-5">
        {/* Age distribution */}
        <Card>
          <CardHeader>
            <h3 className="font-display font-semibold text-white text-sm">Age Distribution</h3>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={AGE_DATA} margin={{ top: 4, right: 0, left: -30, bottom: 0 }}>
                <XAxis dataKey="range" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="count" fill="#6C63FF" radius={[3, 3, 0, 0]} opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-slate-500 mt-2 text-center">Median age: 33 · Strong millennial-majority workforce</p>
          </CardBody>
        </Card>

        {/* Hire Sources */}
        <Card>
          <CardHeader><h3 className="font-display font-semibold text-white text-sm">Hire Sources</h3></CardHeader>
          <CardBody className="space-y-3">
            {HIRE_SOURCE.map(s => (
              <div key={s.source}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400">{s.source}</span>
                  <span className="font-medium text-white">{s.pct}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      {/* Workforce Goals */}
      <Card>
        <CardHeader><h3 className="font-display font-semibold text-white text-sm">2026 Workforce Goals</h3></CardHeader>
        <CardBody>
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: 'Headcount Target', current: 248, target: 300, color: 'bg-brand-500' },
              { label: 'Training Hours / Emp', current: 24, target: 40, unit: 'h', color: 'bg-amber-500' },
              { label: 'eNPS Target', current: 47, target: 60, prefix: '+', color: 'bg-teal-500' },
              { label: 'Women in Leadership', current: 45, target: 50, unit: '%', color: 'bg-pink-500' },
              { label: 'Internal Promotions', current: 62, target: 80, unit: '%', color: 'bg-emerald-500' },
              { label: 'Offer Acceptance Rate', current: 88, target: 95, unit: '%', color: 'bg-blue-500' },
            ].map(g => (
              <div key={g.label}>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-400">{g.label}</span>
                  <span className="font-medium text-white">
                    {g.prefix}{g.current}{g.unit} / {g.prefix}{g.target}{g.unit}
                  </span>
                </div>
                <Progress value={g.current} max={g.target} color={g.color} height="h-2" />
                <p className="text-xs text-slate-600 mt-1">{Math.round((g.current / g.target) * 100)}% of target</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
