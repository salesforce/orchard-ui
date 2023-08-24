import { Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material'
import * as React from 'react'

type Order = 'asc' | 'desc'

export interface SortedTableField<R> {
  key: keyof R | null
  name: string
}

interface SortedTableProps<R> {
  rows: Array<R>
  defaultOrder: Order
  defaultOrderBy: keyof R
  renderRow: (r: R) => React.JSX.Element
  fields: SortedTableField<R>[]
}

interface SortedTableHeadProps<R extends object> {
  orderBy: keyof R
  order: Order
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof R) => void
  fields: SortedTableField<R>[]
}

function SortedTableHead<R extends object>(props: SortedTableHeadProps<R>) {
  const createSortHandler = (property: keyof R) => (event: React.MouseEvent<unknown>) => {
    props.onRequestSort(event, property)
  }

  return (
    <TableHead>
      {
        props.fields.map((f, i) => {
          if (!f.key) return <TableCell key={`_empty-${i}`} />

          return (
            <TableCell
              key={f.key.toString()}
              sortDirection={props.orderBy === f.key ? props.order : false}
            >
              <TableSortLabel
                active={props.orderBy === f.key}
                direction={props.orderBy == f.key ? props.order : 'desc'}
                onClick={createSortHandler(f.key)}
              >
                {f.name}
              </TableSortLabel>
            </TableCell>
          )
        })
      }
    </TableHead>
  )
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (!a[orderBy]) {
    return 1
  }
  if (!b[orderBy]) {
    return -1
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
  // a: { [key in Key]: number | string | null},
  // b: { [key in Key]: number | string | null}
  a: any,
  b: any
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

export function SortedTable<R extends object>(props: SortedTableProps<R>) {

  const { rows, defaultOrder, defaultOrderBy, renderRow, fields } = props
  const [order, setOrder] = React.useState<Order>(defaultOrder);
  const [orderBy, setOrderBy] = React.useState<keyof R>(defaultOrderBy)
  const sortedRows = React.useMemo(
    () => rows.slice().sort(getComparator(order, orderBy)), [order, orderBy]
  )

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof R) => {
    const isDesc = orderBy === property && order === 'desc'
    setOrder(isDesc ? 'asc' : 'desc')
    setOrderBy(property)
  }

  const renderedRow = (
    <>
      {sortedRows.map((row: R) => renderRow(row))}
    </>
  )

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <SortedTableHead<R>
          orderBy={orderBy}
          order={order}
          onRequestSort={handleRequestSort}
          fields={fields}
        />
        <TableBody>
          {renderedRow}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
