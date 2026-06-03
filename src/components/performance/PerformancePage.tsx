import { useState } from 'react'
import { Card, CardHeader, CardBody, Badge, Avatar, Progress, StatCard, Skeleton } from '@/components/ui'
import { usePerformanceReviews, useGoals, useUpdateGoalProgress } from '@/hooks'
import toast from 'react-hot-toast'
import { cn, formatDate } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const SCORE_DIST = [
  { range: '1–3', count: 8, color: '#EF4444' },
  { range: '4–5', count: 19, color: '#F59E0B' },
  { range: '6', count: 38, color: '#3B82F6' },
  { range: '7', count: 62, color: '#00D4AA' },
  { range: '8', count: 88, color: '#8B85FF' },
  { range: '9', count: 97, color: '#6C63FF' },
  { range: '10', count: 44, color: '#3DD68C' },
]

const SKILL_MATRIX = {
  employees: ['Tyler K.', 'Aisha R.', 'Jordan L.', 'Priya N.', 'Marcus C.'],
  skills: ['TypeScript', 'Rust', 'Python', 'Go', 'SQL', 'React', 'DevOps', 'ML/AI'],
  data: [
    [4, 2, 3, 1, 3, 4, 2, 1],
    [3, 4, 2, 2, 3, 2, 4, 2],
    [2, 1, 4, 1, 2, 1, 2, 4],
    [3, 2, 3, 2, 4, 3, 1, 2],
    [4, 1, 3, 2, 4, 4, 3, 2],
  ],
}

const LEVEL_COLORS = ['bg-white/5', 'bg-brand-500/20', 'bg-brand-500/45', 'bg-brand-500/70', 'bg-brand-500']

export function PerformancePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'goals'>('overview')
  const { data: reviews, isLoading: reviewsLoading } = usePerformanceReviews()
  const { data: goals, isLoading: goalsLoading } = useGoals()
  const updateGoal = useUpdateGoalProgress()

  async function nudgeGoal(id: string, current: number, delta: number) {
    const next = Math.max(0, Math.min(100, current + delta))
    try {
      await updateGoal.mutateAsync({ id, progress: next })
      toast.success(`Progress updated to ${next}%`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to update progress')
    }
  }

  const avgScore = reviews?.length
    ? (reviews.reduce((s, r) => s + r.score, 0) / reviews.length).toFixed(1)
    : '—'

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Avg. Performance Score" value={`${avgScore}/10`} change="+0.6 vs Q1 2025" changeType="up" icon="⭐" accent="bg-brand-500" />
        <StatCard label="Reviews Completed" value={`${reviews?.filter(r => r.status === 'submitted').length ?? 0}/248`} change="75% completion rate" icon="📋" accent="bg-teal-500" />
        <StatCard label="Goals On Track" value="72%" change="Of 892 active goals" changeType="up" icon="🎯" accent="bg-amber-500" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-2 rounded-xl p-1 w-fit">
        {(['overview', 'reviews', 'goals'] as const).map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={cn('px-4 py-2 rounded-lg text-sm transition-all capitalize', activeTab === t
              ? 'bg-surface-1 text-white font-medium shadow'
              : 'text-slate-500 hover:text-slate-300'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            {/* Score Distribution */}
            <Card>
              <CardHeader><h3 className="font-display font-semibold text-white text-sm">Score Distribution</h3></CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={SCORE_DIST} margin={{ top: 4, right: 0, left: -30, bottom: 0 }}>
                    <XAxis dataKey="range" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#1a1c23', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, fontSize: 12 }} />
                    <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                      {SCORE_DIST.map((d, i) => <Cell key={i} fill={d.color} fillOpacity={0.8} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>

            {/* Top Performers */}
            <Card>
              <CardHeader>
                <h3 className="font-display font-semibold text-white text-sm">Top Performers</h3>
                <Badge status="active" className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20">Q1 2026</Badge>
              </CardHeader>
              {reviewsLoading ? (
                <CardBody><Skeleton className="h-40" /></CardBody>
              ) : (
                <div className="divide-y divide-white/4">
                  {reviews?.filter(r => r.status === 'submitted').sort((a, b) => b.score - a.score).slice(0, 4).map((rev, i) => {
                    const medals = ['🥇', '🥈', '🥉', '4']
                    const colors = ['text-amber-400', 'text-slate-300', 'text-amber-600', 'text-slate-500']
                    const emp = rev.employee
                    return (
                      <div key={rev.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/2 transition-colors">
                        <span className="text-base w-6 text-center">{medals[i]}</span>
                        <Avatar name={`${emp?.first_name} ${emp?.last_name}`} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white">{emp?.first_name} {emp?.last_name}</p>
                          <p className="text-xs text-slate-500">{emp?.department}</p>
                        </div>
                        <div className="text-right">
                          <p className={cn('font-display text-lg font-semibold', colors[i])}>{rev.score}</p>
                          <p className="text-xs text-slate-600">score</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* Skill Matrix */}
          <Card>
            <CardHeader>
              <h3 className="font-display font-semibold text-white text-sm">Skill Proficiency Matrix</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Low</span>
                {[0, 1, 2, 3, 4].map(l => (
                  <div key={l} className={cn('w-3.5 h-3.5 rounded', LEVEL_COLORS[l])} />
                ))}
                <span className="text-xs text-slate-500">Expert</span>
              </div>
            </CardHeader>
            <CardBody className="overflow-x-auto">
              <div className="inline-block min-w-full">
                <div className="grid gap-1" style={{ gridTemplateColumns: `160px repeat(${SKILL_MATRIX.employees.length}, 40px)` }}>
                  <div />
                  {SKILL_MATRIX.employees.map(e => (
                    <div key={e} className="text-xs text-slate-500 text-center truncate px-0.5">{e.split(' ')[0]}</div>
                  ))}
                  {SKILL_MATRIX.skills.map((skill, si) => (
                    <>
                      <div key={`sk-${si}`} className="text-xs text-slate-400 flex items-center pr-2">{skill}</div>
                      {SKILL_MATRIX.data.map((empData, ei) => (
                        <div
                          key={`${si}-${ei}`}
                          title={`${skill}: Level ${empData[si]}/4`}
                          className={cn('w-9 h-9 rounded-lg flex items-center justify-center text-xs font-medium cursor-pointer transition-all hover:scale-110', LEVEL_COLORS[empData[si]])}
                        />
                      ))}
                    </>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {activeTab === 'reviews' && (
        <Card>
          <CardHeader><h3 className="font-display font-semibold text-white text-sm">Performance Reviews — Q1 2026</h3></CardHeader>
          {reviewsLoading ? (
            <CardBody><Skeleton className="h-40" /></CardBody>
          ) : (
            <div className="divide-y divide-white/4">
              {reviews?.map(rev => {
                const emp = rev.employee
                return (
                  <div key={rev.id} className="flex items-start gap-4 px-5 py-4 hover:bg-white/2 transition-colors">
                    <Avatar name={`${emp?.first_name} ${emp?.last_name}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-white text-sm">{emp?.first_name} {emp?.last_name}</p>
                        <span className="text-xs text-slate-500">{emp?.job_title}</span>
                        <Badge status={rev.status} />
                      </div>
                      {rev.comments && <p className="text-xs text-slate-400 leading-relaxed">{rev.comments}</p>}
                      <div className="flex gap-4 mt-2">
                        {[
                          { label: 'Goals', val: rev.goals_score },
                          { label: 'Skills', val: rev.skills_score },
                          { label: 'Culture', val: rev.culture_score },
                        ].map(({ label, val }) => (
                          <div key={label} className="text-xs">
                            <span className="text-slate-600">{label}: </span>
                            <span className="text-slate-300 font-medium">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-2xl font-semibold text-white">{rev.score}</p>
                      <p className="text-xs text-slate-600">/10</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'goals' && (
        <Card>
          <CardHeader><h3 className="font-display font-semibold text-white text-sm">Active Goals</h3></CardHeader>
          {goalsLoading ? (
            <CardBody><Skeleton className="h-40" /></CardBody>
          ) : (
            <div className="divide-y divide-white/4">
              {goals?.map(goal => {
                const emp = goal.employee
                const statusColors: Record<string, string> = {
                  on_track: 'bg-emerald-500', at_risk: 'bg-amber-500',
                  completed: 'bg-teal-500', overdue: 'bg-red-500',
                }
                return (
                  <div key={goal.id} className="flex items-start gap-4 px-5 py-4 hover:bg-white/2 transition-colors">
                    <Avatar name={`${emp?.first_name} ${emp?.last_name}`} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-white text-sm">{goal.title}</p>
                        <Badge status={goal.status} />
                      </div>
                      <p className="text-xs text-slate-500 mb-2">{emp?.first_name} {emp?.last_name} · Due {formatDate(goal.target_date)}</p>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={goal.progress}
                          color={statusColors[goal.status] ?? 'bg-brand-500'}
                          height="h-1.5"
                          className="flex-1"
                        />
                        <span className="text-xs text-slate-500 font-medium w-9 text-right">{goal.progress}%</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => nudgeGoal(goal.id, goal.progress, -10)}
                            disabled={updateGoal.isPending || goal.progress <= 0}
                            className="w-6 h-6 rounded-lg bg-surface-2 border border-white/8 text-slate-400 hover:text-white hover:border-white/20 disabled:opacity-40 transition-all flex items-center justify-center text-sm"
                          >−</button>
                          <button
                            onClick={() => nudgeGoal(goal.id, goal.progress, 10)}
                            disabled={updateGoal.isPending || goal.progress >= 100}
                            className="w-6 h-6 rounded-lg bg-surface-2 border border-white/8 text-slate-400 hover:text-brand-300 hover:border-brand-500/30 disabled:opacity-40 transition-all flex items-center justify-center text-sm"
                          >+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
