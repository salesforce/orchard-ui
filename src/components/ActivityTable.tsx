import { Activity } from '@/lib/models';
import { fetcher, hourSpan, renderDate } from '@/lib/utils';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Collapse, Container, IconButton, Link, TableCell, TableRow } from '@mui/material';
import * as React from 'react';
import useSWR from 'swr';
import { SortedTable, SortedTableField } from './SortedTable';
import StatusDisplay from './StatusDisplay';

function Row({ workflow, act }) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <TableRow
        sx={{ '& > *': { borderBottom: 'unset' } }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Link href={`/workflow/${workflow.id}/activity/${act.activityId}`}>
            {act.activityId}
          </Link>
        </TableCell>
        <TableCell>{act.name}</TableCell>
        <TableCell>{act.activityType}</TableCell>
        <TableCell align="center"><StatusDisplay status={act.status} hourSpan={hourSpan(act.activatedAt, act.terminatedAt)} /></TableCell>
        <TableCell>{act.maxAttempt}</TableCell>
        <TableCell><Link href={`/workflow/${workflow.id}/resource/${act.resourceId}`}>{act.resourceId}</Link></TableCell>
        <TableCell>{renderDate(act.createdAt)}</TableCell>
        <TableCell>{renderDate(act.activatedAt)}</TableCell>
        <TableCell>{renderDate(act.terminatedAt)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Container fixed sx={{ margin: 0 }}>
              <Box sx={{ margin: 1 }}>
                <pre>
                  {JSON.stringify(act.activitySpec, null, 2)}
                </pre>
              </Box>
            </Container>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

const fields: SortedTableField<Activity>[] = [
  {
    key: null,
    name: null,
  },
  {
    key: "activityId",
    name: "Activity ID"
  },
  {
    key: "name",
    name: "Name"
  },
  {
    key: "activityType",
    name: "Type"
  },
  {
    key: "status",
    name: "Status"
  },
  {
    key: "maxAttempt",
    name: "Max Attempt"
  },
  {
    key: "resourceId",
    name: "Resource ID"
  },
  {
    key: "createdAt",
    name: "Created At"
  },
  {
    key: "activatedAt",
    name: "Activated At"
  },
  {
    key: "terminatedAt",
    name: "Terminated At"
  }
]

export default function ActivityTable({ workflowId }: { workflowId: string }) {

  const { data, error } = useSWR(`/api/workflow/${workflowId}/activities`, fetcher)
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  const renderRow = (r: Activity) => {
    return <Row workflow={data.workflow} act={r} />
  }

  return (
    <SortedTable<Activity>
      rows={data.activities}
      defaultOrder={'desc'}
      defaultOrderBy={'activatedAt'}
      renderRow={renderRow}
      fields={fields}
    />
  )
}
