'use client'

import { fetcher } from '@/lib/utils';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import useSWR from 'swr';

interface DailyCount {
  date: string,
  status: string,
  count: number
}

interface DailyStatusCount {
  date: string,
  finished: number,
  failed: number,
  canceled: number
}

function WorkflowStatusChart({ data }: { data: DailyCount[] }) {

  const dailyStatuses: DailyStatusCount[] =
    pivotToDailyStatusCount(data).sort((a, b) => a.date.localeCompare(b.date))

  return (
    <ResponsiveContainer height={350}>
      <BarChart data={dailyStatuses}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="finished" stackId="a" fill="#2e7d32" />
        <Bar dataKey="failed" stackId="a" fill="#d32f2f" />
        <Bar dataKey="canceled" stackId="a" fill="#ed6c02" />
      </BarChart>
    </ResponsiveContainer>
  )

}

const dcCompare = (a: DailyCount, b: DailyCount) => a.date.localeCompare(b.date)

function pivotToDailyStatusCount(dailyCounts: DailyCount[]) {
  const pivatedTable = dailyCounts.reduce((accu, dc) => {
    if (!accu[dc.date]) accu[dc.date] = {
      finished: 0,
      failed: 0,
      canceled: 0
    }
    accu[dc.date][dc.status] = dc.count
    return accu
  }, {})

  const days = Array.from({ length: 30 }, (_, idx) => {
    const d = new Date()
    d.setDate(d.getDate() - idx)
    return `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}`
  })

  return days.map((d) => {
    if (pivatedTable[d]) {
      return {
        date: d,
        ...pivatedTable[d]
      }
    }
    return {
      date: d,
      finished: 0,
      failed: 0,
      canceled: 0
    }
  })
}

export default function Stats() {

  const { data, error } = useSWR<DailyCount[]>(`/api/stats/daily`, fetcher)
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  data.sort(dcCompare)

  return (
    <>
      <WorkflowStatusChart data={data} />
    </>
  )

}
