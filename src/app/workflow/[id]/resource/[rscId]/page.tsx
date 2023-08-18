'use client'

import * as React from 'react';
import { fetcher, renderDate } from '@/lib/utils';
import { Box, Collapse, Container, IconButton, Link, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import useSWR from 'swr';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { ResourceInstance } from '@/lib/models';

function Row({ inst }) {
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
        <TableCell>{inst.instanceAttempt}</TableCell>
        <TableCell>{inst.status}</TableCell>
        <TableCell>{inst.errorMessage}</TableCell>
        <TableCell>{renderDate(inst.createdAt)}</TableCell>
        <TableCell>{renderDate(inst.createdAt)}</TableCell>
        <TableCell>{renderDate(inst.terminatedAt)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Container fixed sx={{ margin: 0 }}>
              <Box sx={{ margin: 1 }}>
                <pre>
                  {JSON.stringify(inst.instanceSpec, null, 2)}
                </pre>
              </Box>
            </Container>
          </Collapse>
        </TableCell>
      </TableRow>

    </>
  )
}

export default function ResourcePage({ params }) {
  const { data, error } = useSWR(`/api/workflow/${params.id}/resource/${params.rscId}`, fetcher)
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <>
      <Box>Resource ID: <Link href={`/workflow/${params.id}/resources`}>{data.resource.resourceId}</Link></Box>
      <TableContainer component={Paper}>
        <TableHead>
          <TableCell />
          <TableCell>Instance Attempt No.</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Error Message</TableCell>
          <TableCell>Created At</TableCell>
          <TableCell>Activated At</TableCell>
          <TableCell>Terminated At</TableCell>
        </TableHead>
        <TableBody>
          {data.instances.map((inst: ResourceInstance) => (
            <Row inst={inst} key={inst.instanceAttempt} />
          ))}
        </TableBody>
      </TableContainer>
    </>
  )
}
