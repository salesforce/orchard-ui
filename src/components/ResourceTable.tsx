import * as React from 'react';
import useSWR from 'swr';
import { SortedTable, SortedTableField } from "./SortedTable"
import { fetcher, hourSpan, renderDate } from '@/lib/utils';
import { Resource } from '@/lib/models';
import { Box, Collapse, Container, IconButton, Link, TableCell, TableRow } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import StatusDisplay from './StatusDisplay';

function Row({ workflow, rsc }) {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell><Link href={`/workflow/${workflow.id}/resource/${rsc.resourceId}`}>{rsc.resourceId}</Link></TableCell>
        <TableCell>{rsc.name}</TableCell>
        <TableCell>{rsc.resourceType}</TableCell>
        <TableCell align="center">
          <StatusDisplay status={rsc.status} hourSpan={hourSpan(rsc.activatedAt, rsc.terminatedAt)} />
        </TableCell>
        <TableCell>{rsc.maxAttempt}</TableCell>
        <TableCell>{rsc.terminateAfter}</TableCell>
        <TableCell>{renderDate(rsc.createdAt)}</TableCell>
        <TableCell>{renderDate(rsc.createdAt)}</TableCell>
        <TableCell>{renderDate(rsc.terminatedAt)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Container fixed sx={{ margin: 0 }}>
              <Box sx={{ margin: 1 }}>
                <pre>
                  {JSON.stringify(rsc.resourceSpec, null, 2)}
                </pre>
              </Box>
            </Container>
          </Collapse>
        </TableCell>
      </TableRow>

    </>
  )
}

const fields: SortedTableField<Resource>[] = [
  {
    key: null,
    name: null,
  },
  {
    key: 'resourceId',
    name: 'Resource ID'
  },
  {
    key: 'name',
    name: 'Name'
  },
  {
    key: 'resourceType',
    name: 'Type'
  },
  {
    key: 'status',
    name: 'Status',
  },
  {
    key: 'maxAttempt',
    name: 'Max Attempt'
  },
  {
    key: 'terminateAfter',
    name: 'Terminate After'
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

export default function ResourceTable({ workflowId }) {

  const { data, error } = useSWR(`/api/workflow/${workflowId}/resources`, fetcher)
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  const renderRow = (r: Resource) => {
    return <Row workflow={data.workflow} rsc={r} />
  }

  return (
    <SortedTable<Resource>
      rows={data.resources}
      defaultOrder={'desc'}
      defaultOrderBy={'activatedAt'}
      renderRow={renderRow}
      fields={fields}
    />
  )

}
