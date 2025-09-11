'use client';

import { Workflow } from '@/lib/models';
import { fetcher, hourSpan, renderDate } from '@/lib/utils';
import Link from '@mui/material/Link';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import useSWR from 'swr';
import { SortedTable, SortedTableField } from './SortedTable';
import StatusDisplay from './StatusDisplay';

const fields: SortedTableField<Workflow>[] = [
  {
    key: 'id',
    name: 'Workflow ID'
  },
  {
    key: 'name',
    name: 'Name'
  },
  {
    key: 'status',
    name: 'Status'
  },
  {
    key: 'createdAt',
    name: 'Created At'
  },
  {
    key: 'activatedAt',
    name: 'Activated At'
  },
  {
    key: 'terminatedAt',
    name: 'Terminated At'
  }
]

const renderRow = (row: Workflow) => {
  return (
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
  )
}

export default function WorkflowTable({ statuses, pipelineNameSearch, workflowIdSearch }) {

  let url: string
  
  // Use specific workflow details route when searching by workflow ID
  if (workflowIdSearch && workflowIdSearch.trim()) {
    url = `/api/workflow/${workflowIdSearch.trim()}/details`
  } else {
    // Use general search route for pipeline name search
    const params = new URLSearchParams({
      statuses: statuses.join(','),
      like: pipelineNameSearch
    })
    url = `/api?` + params
  }

  const { data, error } = useSWR(url, fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  // Handle different response formats: single workflow vs array of workflows
  const workflows = workflowIdSearch && workflowIdSearch.trim() 
    ? [data] // Single workflow from details route
    : data   // Array of workflows from search route

  return (
    <SortedTable<Workflow>
      rows={workflows}
      defaultOrder='desc'
      defaultOrderBy='createdAt'
      renderRow={renderRow}
      fields={fields}
    />
  )

}
