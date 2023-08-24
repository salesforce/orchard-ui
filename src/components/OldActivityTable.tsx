'use client'

import * as React from 'react';
import useSWR from 'swr';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { fetcher, hourSpan, renderDate } from '@/lib/utils';
import { Box, Collapse, Container, IconButton } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Link from 'next/link';
import { Activity } from '@/lib/models';
import StatusDisplay from './StatusDisplay';
import { SortedTable } from './SortedTable';

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

export default function ActivityTable({ workflowId }: { workflowId: string }) {

  const { data, error } = useSWR(`/api/workflow/${workflowId}/activities`, fetcher)
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Activity ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>maxAttempt</TableCell>
              <TableCell>resourceId</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Activated At</TableCell>
              <TableCell>Terminated At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.activities.map((act: Activity) => (
              <Row workflow={data.workflow} act={act} key={act.activityId} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
