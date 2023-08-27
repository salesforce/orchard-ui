'use client'

import { fetcher } from '@/lib/utils';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from 'recharts';
import useSWR from 'swr';

const data01 = [
  { hour: '12a', index: 1, value: 170 },
  { hour: '1a', index: 1, value: 180 },
  { hour: '2a', index: 1, value: 150 },
  { hour: '3a', index: 1, value: 120 },
  { hour: '4a', index: 1, value: 200 },
  { hour: '5a', index: 1, value: 300 },
  { hour: '6a', index: 1, value: 400 },
  { hour: '7a', index: 1, value: 200 },
  { hour: '8a', index: 1, value: 100 },
  { hour: '9a', index: 1, value: 150 },
  { hour: '10a', index: 1, value: 160 },
  { hour: '11a', index: 1, value: 170 },
  { hour: '12a', index: 1, value: 180 },
  { hour: '1p', index: 1, value: 144 },
  { hour: '2p', index: 1, value: 166 },
  { hour: '3p', index: 1, value: 145 },
  { hour: '4p', index: 1, value: 150 },
  { hour: '5p', index: 1, value: 170 },
  { hour: '6p', index: 1, value: 180 },
  { hour: '7p', index: 1, value: 165 },
  { hour: '8p', index: 1, value: 130 },
  { hour: '9p', index: 1, value: 140 },
  { hour: '10p', index: 1, value: 170 },
  { hour: '11p', index: 1, value: 180 },
];

const data02 = [
  { hour: '12a', index: 1, value: 160 },
  { hour: '1a', index: 1, value: 180 },
  { hour: '2a', index: 1, value: 150 },
  { hour: '3a', index: 1, value: 120 },
  { hour: '4a', index: 1, value: 200 },
  { hour: '5a', index: 1, value: 300 },
  { hour: '6a', index: 1, value: 100 },
  { hour: '7a', index: 1, value: 200 },
  { hour: '8a', index: 1, value: 100 },
  { hour: '9a', index: 1, value: 150 },
  { hour: '10a', index: 1, value: 160 },
  { hour: '11a', index: 1, value: 160 },
  { hour: '12a', index: 1, value: 180 },
  { hour: '1p', index: 1, value: 144 },
  { hour: '2p', index: 1, value: 166 },
  { hour: '3p', index: 1, value: 145 },
  { hour: '4p', index: 1, value: 150 },
  { hour: '5p', index: 1, value: 160 },
  { hour: '6p', index: 1, value: 180 },
  { hour: '7p', index: 1, value: 165 },
  { hour: '8p', index: 1, value: 130 },
  { hour: '9p', index: 1, value: 140 },
  { hour: '10p', index: 1, value: 160 },
  { hour: '11p', index: 1, value: 180 },
];


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
        <Bar dataKey="canceled" stackId="a" fill="#ed7c02" />
      </BarChart>
    </ResponsiveContainer>
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

function WorkflowPatternBubbleChart2() {
  const parseDomain = () => [
    0,
    Math.max(
      Math.max.apply(
        null,
        data01.map((entry) => entry.value),
      ),
      Math.max.apply(
        null,
        data02.map((entry) => entry.value),
      ),
    ),
  ];

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

  const domain = parseDomain();
  const range = [16, 225];

  return (
    <div style={{ width: '100%' }}>
      <ResponsiveContainer width="100%" height={60}>
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
            interval={0}
            tick={{ fontSize: 0 }}
            tickLine={{ transform: 'translate(0, -6)' }}
          />
          <YAxis
            type="number"
            dataKey="index"
            name="sunday"
            height={10}
            width={80}
            tick={false}
            tickLine={false}
            axisLine={false}
            label={{ value: 'Sunday', position: 'insideRight' }}
          />
          <ZAxis type="number" dataKey="value" domain={domain} range={range} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />
          <Scatter data={data01} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={60}>
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
            tick={{ fontSize: 0 }}
            tickLine={{ transform: 'translate(0, -6)' }}
          />
          <YAxis
            type="number"
            dataKey="index"
            height={10}
            width={80}
            tick={false}
            tickLine={false}
            axisLine={false}
            label={{ value: 'Monday', position: 'insideRight' }}
          />
          <ZAxis type="number" dataKey="value" domain={domain} range={range} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />
          <Scatter data={data02} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={60}>
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
            tick={{ fontSize: 0 }}
            tickLine={{ transform: 'translate(0, -6)' }}
          />
          <YAxis
            type="number"
            dataKey="index"
            height={10}
            width={80}
            tick={false}
            tickLine={false}
            axisLine={false}
            label={{ value: 'Tuesday', position: 'insideRight' }}
          />
          <ZAxis type="number" dataKey="value" domain={domain} range={range} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />
          <Scatter data={data01} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={60}>
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
            tick={{ fontSize: 0 }}
            tickLine={{ transform: 'translate(0, -6)' }}
          />
          <YAxis
            type="number"
            dataKey="index"
            height={10}
            width={80}
            tick={false}
            tickLine={false}
            axisLine={false}
            label={{ value: 'Wednesday', position: 'insideRight' }}
          />
          <ZAxis type="number" dataKey="value" domain={domain} range={range} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />
          <Scatter data={data02} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={60}>
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
            tick={{ fontSize: 0 }}
            tickLine={{ transform: 'translate(0, -6)' }}
          />
          <YAxis
            type="number"
            dataKey="index"
            height={10}
            width={80}
            tick={false}
            tickLine={false}
            axisLine={false}
            label={{ value: 'Thursday', position: 'insideRight' }}
          />
          <ZAxis type="number" dataKey="value" domain={domain} range={range} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />
          <Scatter data={data01} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={60}>
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
            tick={{ fontSize: 0 }}
            tickLine={{ transform: 'translate(0, -6)' }}
          />
          <YAxis
            type="number"
            dataKey="index"
            height={10}
            width={80}
            tick={false}
            tickLine={false}
            axisLine={false}
            label={{ value: 'Friday', position: 'insideRight' }}
          />
          <ZAxis type="number" dataKey="value" domain={domain} range={range} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />
          <Scatter data={data02} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={60}>
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
            tickLine={{ transform: 'translate(0, -6)' }}
          />
          <YAxis
            type="number"
            dataKey="index"
            height={10}
            width={80}
            tick={false}
            tickLine={false}
            axisLine={false}
            label={{ value: 'Saturday', position: 'insideRight' }}
          />
          <ZAxis type="number" dataKey="value" domain={domain} range={range} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 100 }} content={renderTooltip} />
          <Scatter data={data01} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
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
      <WorkflowPatternBubbleChart />
    </>
  )

}
