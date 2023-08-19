'use client'

import * as React from 'react';
import { fetcher, hourSpan, renderDate } from '@/lib/utils';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Collapse, Container, IconButton, Link, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import useSWR from 'swr';
import { ActivityAttempt } from '@/lib/models';
import StatusDisplay from '@/components/StatusDisplay';

function Row({ workflowId, attempt }) {
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
        <TableCell>{attempt.attempt}</TableCell>
        <TableCell><StatusDisplay status={attempt.status} hourSpan={hourSpan(attempt.activatedAt, attempt.terminatedAt)} /></TableCell>
        <TableCell>{attempt.errorMessage}</TableCell>
        <TableCell><Link href={`/workflow/${workflowId}/resource/${attempt.resourceId}`}>{attempt.resourceId}</Link></TableCell>
        <TableCell>{attempt.resourceInstanceAttempt}</TableCell>
        <TableCell>{renderDate(attempt.createdAt)}</TableCell>
        <TableCell>{renderDate(attempt.activatedAt)}</TableCell>
        <TableCell>{renderDate(attempt.terminatedAt)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Container fixed sx={{ margin: 0 }}>
              <Box sx={{ margin: 1 }}>
                <pre>
                  {JSON.stringify(attempt.attemptSpec, null, 2)}
                </pre>
              </Box>
            </Container>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default function ActivityPage({ params }: { params: {id: string, actId: string}}) {
  const { data, error } = useSWR(`/api/workflow/${params.id}/activity/${params.actId}`, fetcher)
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <>
      <Box>Activity ID: <Link href={`/workflow/${params.id}/activities`}>{data.activity.activityId}</Link></Box>
      <TableContainer component={Paper}>
        <TableHead>
          <TableCell />
          <TableCell>Attempt No.</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Error Message</TableCell>
          <TableCell>Resource ID</TableCell>
          <TableCell>Resource Instance Attempt</TableCell>
          <TableCell>Created At</TableCell>
          <TableCell>Activated At</TableCell>
          <TableCell>Terminated At</TableCell>
        </TableHead>
        <TableBody>
          {data.attempts.map((attempt: ActivityAttempt) => (
            <Row workflowId={params.id} attempt={attempt} key={attempt.attempt} />
          ))}
        </TableBody>
      </TableContainer>
    </>
  )
}
