'use client'

import Title from '@/components/Title';
import { fetcher } from '@/lib/utils';
import { Grid, Paper } from '@mui/material';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from 'recharts';
import useSWR from 'swr';

interface DailyCount {
  date: string,
  status: string,
  count: number
}

interface DayHourPattern {
  dow: number,
  hour: number,
  count: number
}

interface DailyStatusCount {
  date: string,
  running: number,
  finished: number,
  failed: number,
  canceled: number
}

function pivotToDailyStatusCount(dailyCounts: DailyCount[]) {
  const pivatedTable = dailyCounts.reduce((accu, dc) => {
    if (!accu[dc.date]) accu[dc.date] = {
      running: 0,
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
    return `${d.getUTCFullYear()}-${('0' + (d.getUTCMonth() + 1)).slice(-2)}-${('0' + d.getUTCDate()).slice(-2)}`
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
      running: 0,
      finished: 0,
      failed: 0,
      canceled: 0
    }
  })
}

function WorkflowStatusChart() {

  const { data, error } = useSWR<DailyCount[]>(`/api/stats/daily`, fetcher)
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  const dailyStatuses: DailyStatusCount[] =
    pivotToDailyStatusCount(data).sort((a, b) => a.date.localeCompare(b.date))

  return (
    <>
      <Title>Daily Worfklow Count</Title>
      <ResponsiveContainer height={350}>
        <BarChart data={dailyStatuses}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="finished" stackId="a" fill="#2e7d32" />
          <Bar dataKey="failed" stackId="a" fill="#d32f2f" />
          <Bar dataKey="canceled" stackId="a" fill="#ed7c02" />
          <Bar dataKey="running" stackId="a" fill="#0288d1" />
        </BarChart>
      </ResponsiveContainer>
    </>
  )

}

interface BubbleChartRow {
  hour: string,
  index: number,
  value: number
}

const renderDOW = (dow: number) => {
  switch (dow) {
    case 0:
      return 'Sun'
    case 1:
      return 'Mon'
    case 2:
      return 'Tue'
    case 3:
      return 'Wed'
    case 4:
      return 'Thu'
    case 5:
      return 'Fri'
    case 6:
      return 'Sat'
    default:
      return 'N/A'
  }
}

function WorkflowPatternBubbleChart() {

  const { data, error } = useSWR<DayHourPattern[]>(`/api/stats/pattern`, fetcher)
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  const initArray: BubbleChartRow[] = Array.from({ length: 24 }, (_, idx) => ({
    hour: idx.toString(),
    index: 1,
    value: 0
  }))

  const pivoted = data.reduce((accu, d) => {
    const dow = renderDOW(d.dow)
    const r: BubbleChartRow = {
      hour: d.hour.toString(),
      index: 1,
      value: d.count
    }
    if (!accu[dow]) {
      accu[dow] = initArray.slice()
    }

    accu[dow] = accu[dow].map((x: BubbleChartRow) => {
      if (x.hour == r.hour) {
        return r
      }
      return x
    })

    return accu
  }, {})

  const domain = [0, Math.max.apply(null, data.map((e) => e.count))]
  const range = [0, 255]
  const renderTooltip = (props) => {
    const { active, payload } = props;

    if (active && payload && payload.length) {
      const data = payload[0] && payload[0].payload;

      return (
        <div
          style={{
            backgroundColor: '#fff',
            border: '1px solid #999',
            margin: 0,
            padding: 10,
          }}
        >
          <p>{data.hour}</p>
          <p>
            <span>value: </span>
            {data.value}
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <Title>Activated Workflows Weekly Pattern</Title>
      <div style={{ width: '100%' }}>
        {
          Object.keys(pivoted).map((k) =>
          (
            <ResponsiveContainer width="100%" height={60} key={k}>
              <ScatterChart
                width={800}
                height={60}
                margin={{
                  top: 10,
                  right: 0,
                  bottom: 0,
                  left: 0,
                }}
              >
                <XAxis
                  type="category"
                  dataKey="hour"
                  name="hour"
                  interval={0}
                  tick={{ fontSize: (k == 'Sat' ? 16 : 0) }}
                  tickLine={{ transform: 'translate(0, -6)' }}
                />
                <YAxis
                  type="number"
                  dataKey="index"
                  name={k}
                  height={10}
                  width={80}
                  tick={false}
                  tickLine={false}
                  axisLine={false}
                  label={{ value: k, position: 'insideRight' }}
                />
                <ZAxis type="number" dataKey="value" domain={domain} range={range} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />
                <Scatter data={pivoted[k]} fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
          )
          )
        }
      </div>
    </>
  )

}

export default function Stats() {

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }} >
            <WorkflowStatusChart />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <WorkflowPatternBubbleChart />
          </Paper>
        </Grid>
      </Grid>
    </>
  )

}
