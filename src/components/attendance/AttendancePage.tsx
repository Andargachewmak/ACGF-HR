import { useState } from 'react'
import { Card, CardHeader, CardBody, Badge, Button, Avatar, Progress, Table, Th, Td, Skeleton, Modal, Input, Select } from '@/components/ui'
import { useLeaveRequests, useUpdateLeaveStatus, useCreateLeaveRequest, useEmployees } from '@/hooks'
import { cn, formatDate, statusLabel, calcWorkingDays } from '@/lib/utils'
import toast from 'react-hot-toast'

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTH = 'March 2026'

// Build calendar data for March 2026
function buildCalendar() {
  const days = []
  const firstDay = new Date(2026, 2, 1).getDay() // 0 = Sunday
  for (let i = 0; i < firstDay; i++) days.push({ day: 0, type: 'empty' })
  const leave = [12, 14, 19, 20, 21]
  const wfh = [3, 10, 17, 24]
  const holiday = [22]
  const today = 13
  for (let d = 1; d <= 31; d++) {
    const type = d === today ? 'today'
      : leave.includes(d) ? 'leave'
      : wfh.includes(d) ? 'wfh'
      : holiday.includes(d) ? 'holiday'
      : 'normal'
    days.push({ day: d, type })
  }
  return days
}

export function AttendancePage() {
  const [tab, setTab] = useState<'overview' | 'requests'>('overview')
  const [reqOpen, setReqOpen] = useState(false)
  const { data: leaveRequests, isLoading: leaveLoading } = useLeaveRequests()
  const updateLeave = useUpdateLeaveStatus()

  const calendar = buildCalendar()

  async function handleLeaveAction(id: string, status: 'approved' | 'denied') {
    try {
      await updateLeave.mutateAsync({ id, status })
      toast.success(`Leave request ${status}`)
    } catch {
      toast.error('Action failed')
    }
  }

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex gap-1 bg-surface-2 rounded-xl p-1 w-fit">
        {(['overview', 'requests'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn('px-4 py-2 rounded-lg text-sm transition-all capitalize', tab === t
              ? 'bg-surface-1 text-white font-medium shadow'
              : 'text-slate-500 hover:text-slate-300'
            )}
          >
            {t === 'requests' ? `Leave Requests ${leaveRequests?.filter(r => r.status === 'pending').length ? `(${leaveRequests.filter(r => r.status === 'pending').length})` : ''}` : 'Overview'}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            {/* Calendar */}
            <Card>
              <CardHeader>
                <div>
                  <h3 className="font-display font-semibold text-white text-sm">{MONTH}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Leave & attendance calendar</p>
                </div>
                <div className="flex gap-3">
                  {[
                    { color: 'bg-teal-500/30 border border-teal-500/50', label: 'Leave' },
                    { color: 'bg-amber-500/30 border border-amber-500/50', label: 'WFH' },
                    { color: 'bg-red-500/30 border border-red-500/50', label: 'Holiday' },
                  ].map(({ color, label }) => (
                    <span key={label} className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span className={cn('w-3 h-3 rounded', color)} />{label}
                    </span>
                  ))}
                </div>
              </CardHeader>
              <CardBody>
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {DAYS.map(d => (
                    <div key={d} className="text-center text-xs text-slate-600 font-medium py-1">{d}</div>
                  ))}
                </div>
                {/* Day cells */}
                <div className="grid grid-cols-7 gap-1">
                  {calendar.map((cell, i) => (
                    <div
                      key={i}
                      className={cn(
                        'aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all',
                        cell.type === 'empty' ? '' :
                        cell.type === 'today' ? 'bg-brand-500 text-white ring-2 ring-brand-500/50' :
                        cell.type === 'leave' ? 'bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 cursor-pointer' :
                        cell.type === 'wfh' ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 cursor-pointer' :
                        cell.type === 'holiday' ? 'bg-red-500/20 text-red-400' :
                        'text-slate-400 hover:bg-white/5 cursor-pointer'
                      )}
                    >
                      {cell.day || ''}
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Today's attendance breakdown */}
            <Card>
              <CardHeader>
                <h3 className="font-display font-semibold text-white text-sm">Today's Attendance</h3>
                <Badge status="active">Live</Badge>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-surface-2 rounded-xl p-4 text-center">
                    <p className="font-display text-3xl font-semibold text-emerald-400">221</p>
                    <p className="text-xs text-slate-500 mt-1">Present</p>
                  </div>
                  <div className="bg-surface-2 rounded-xl p-4 text-center">
                    <p className="font-display text-3xl font-semibold text-amber-400">27</p>
                    <p className="text-xs text-slate-500 mt-1">Absent / Leave</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5"><span className="text-slate-400">In Office</span><span className="font-medium text-white">142 (57%)</span></div>
                    <Progress value={57} color="bg-brand-500" height="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5"><span className="text-slate-400">Remote / WFH</span><span className="font-medium text-white">79 (32%)</span></div>
                    <Progress value={32} color="bg-amber-500" height="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5"><span className="text-slate-400">On Leave</span><span className="font-medium text-white">27 (11%)</span></div>
                    <Progress value={11} color="bg-teal-500" height="h-2" />
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {tab === 'requests' && (
        <Card>
          <CardHeader>
            <h3 className="font-display font-semibold text-white text-sm">Leave Requests</h3>
            <Button variant="primary" size="sm" onClick={() => setReqOpen(true)}>+ New Request</Button>
          </CardHeader>
          {leaveLoading ? (
            <CardBody><div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div></CardBody>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Employee</Th>
                  <Th>Leave Type</Th>
                  <Th>Dates</Th>
                  <Th>Days</Th>
                  <Th>Reason</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests?.map(req => (
                  <tr key={req.id} className="hover:bg-white/2 transition-colors">
                    <Td>
                      <div className="flex items-center gap-2">
                        <Avatar name={`${req.employee?.first_name} ${req.employee?.last_name}`} size="xs" />
                        <span className="text-sm text-white">{req.employee?.first_name} {req.employee?.last_name}</span>
                      </div>
                    </Td>
                    <Td className="capitalize">{statusLabel(req.leave_type)}</Td>
                    <Td className="text-slate-300">{formatDate(req.start_date, 'short')} – {formatDate(req.end_date, 'short')}</Td>
                    <Td>{req.days}d</Td>
                    <Td className="max-w-xs truncate">{req.reason ?? '—'}</Td>
                    <Td><Badge status={req.status} /></Td>
                    <Td>
                      {req.status === 'pending' ? (
                        <div className="flex gap-1.5">
                          <Button
                            size="sm"
                            variant="success"
                            loading={updateLeave.isPending}
                            onClick={() => handleLeaveAction(req.id, 'approved')}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            loading={updateLeave.isPending}
                            onClick={() => handleLeaveAction(req.id, 'denied')}
                          >
                            Deny
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-600">—</span>
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      )}

      <NewLeaveModal open={reqOpen} onClose={() => setReqOpen(false)} />
    </div>
  )
}

// ─── New Leave Request Modal ──────────────────────────────────────────────────
const LEAVE_TYPES = [
  { value: 'annual', label: 'Annual' },
  { value: 'sick', label: 'Sick' },
  { value: 'personal', label: 'Personal' },
  { value: 'maternity', label: 'Maternity' },
  { value: 'paternity', label: 'Paternity' },
  { value: 'unpaid', label: 'Unpaid' },
] as const

function NewLeaveModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: employees } = useEmployees()
  const create = useCreateLeaveRequest()
  const [employeeId, setEmployeeId] = useState('')
  const [leaveType, setLeaveType] = useState<typeof LEAVE_TYPES[number]['value']>('annual')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [reason, setReason] = useState('')

  const empOptions = [
    { value: '', label: 'Select employee…' },
    ...(employees ?? []).map(e => ({ value: e.id, label: `${e.first_name} ${e.last_name}` })),
  ]
  const days = start && end && new Date(end) >= new Date(start) ? calcWorkingDays(start, end) : 0

  async function submit() {
    if (!employeeId) { toast.error('Please select an employee'); return }
    if (!start || !end) { toast.error('Start and end dates are required'); return }
    if (days <= 0) { toast.error('End date must be on or after start date'); return }
    try {
      await create.mutateAsync({
        employee_id: employeeId,
        leave_type: leaveType,
        start_date: start,
        end_date: end,
        days,
        reason: reason || undefined,
        status: 'pending',
      })
      toast.success('Leave request submitted')
      onClose()
      setEmployeeId(''); setLeaveType('annual'); setStart(''); setEnd(''); setReason('')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to submit request')
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="New leave request" size="md">
      <div className="flex flex-col gap-4">
        <Select label="Employee" value={employeeId} onChange={setEmployeeId} options={empOptions} />
        <div className="grid grid-cols-2 gap-4">
          <Select label="Leave Type" value={leaveType} onChange={(v) => setLeaveType(v as typeof leaveType)} options={LEAVE_TYPES.map(t => ({ value: t.value, label: t.label }))} />
          <Input label="Working Days" value={days ? `${days}` : '—'} readOnly />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Start Date" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          <Input label="End Date" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>
        <Input label="Reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Optional" />
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" loading={create.isPending} onClick={submit}>Submit request</Button>
        </div>
      </div>
    </Modal>
  )
}
