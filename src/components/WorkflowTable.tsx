'use client';

import { visuallyHidden } from '@mui/utils';
import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import useSWR from 'swr';
import { fetcher, hourSpan, renderDate } from '@/lib/utils';
import StatusDisplay from './StatusDisplay';
import { Workflow } from '@/lib/models';
import { Box, TableSortLabel } from '@mui/material';


type Order = 'asc' | 'desc'

interface WorkflowTableProps {
  orderBy: string
  order: Order
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Workflow) => void
}

interface HeadCell {
  id: keyof Workflow
  name: string
}

const headCells: readonly HeadCell[] = [
  {
    id: 'id',
    name: 'Workflow ID'
  },
  {
    id: 'name',
    name: 'Name'
  },
  {
    id: 'status',
    name: 'Status'
  },
  {
    id: 'createdAt',
    name: 'Created At'
  },
  {
    id: 'activatedAt',
    name: 'Activated At'
  },
  {
    id: 'terminatedAt',
    name: 'Terminated At'
  }
]

function WorkflowTableHead(props: WorkflowTableProps) {
  const createSortHandler = (property: keyof Workflow) => (event: React.MouseEvent<unknown>) => {
    props.onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {
          headCells.map((c) => (
            <TableCell
              key={c.id}
              sortDirection={props.orderBy === c.id ? props.order : false}
            >
              <TableSortLabel
                active={props.orderBy === c.id}
                direction={props.orderBy == c.id ? props.order : 'desc'}
                onClick={createSortHandler(c.id)}
              >
                {c.name}
              </TableSortLabel>
            </TableCell>
          ))
        }
      </TableRow>
    </TableHead>
  )
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (!a[orderBy]) {
    return -1
  }
  if (!b[orderBy]) {
    return 1
  }
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0
}

function getComparator<Key extends keyof any>(order: Order, orderBy: Key): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

export default function WorkflowTable({ statuses, search }) {

  const [order, setOrder] = React.useState<Order>('desc');
  const [orderBy, setOrderBy] = React.useState<keyof Workflow>('createdAt')

  const url = `/api?` + new URLSearchParams({
    statuses: statuses.join(','),
    like: search
  })

  const { data, error } = useSWR<[Workflow]>(url, fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Workflow) => {
    const isDesc = orderBy === property && order === 'desc'
    setOrder(isDesc ? 'asc' : 'desc')
    setOrderBy(property)
  }

  const sortedRows = data.slice().sort(getComparator(order, orderBy))
  // const sortedRows = React.useMemo(
  //   () => data.slice().sort(getComparator(order, orderBy)), [order, orderBy]
  // )

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <WorkflowTableHead orderBy={orderBy} order={order} onRequestSort={handleRequestSort} />
        <TableBody>
          {sortedRows.map((row: Workflow) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Link href={`/workflow/${row.id}`}>{row.id}</Link>
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell align="center"><StatusDisplay status={row.status} hourSpan={hourSpan(row.activatedAt, row.terminatedAt)} /></TableCell>
              <TableCell>{renderDate(row.createdAt)}</TableCell>
              <TableCell>{renderDate(row.activatedAt)}</TableCell>
              <TableCell>{renderDate(row.terminatedAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
