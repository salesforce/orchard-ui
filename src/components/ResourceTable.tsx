import { Resource } from '@/lib/models';
import { fetcher, renderDate } from '@/lib/utils';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Collapse, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Link from 'next/link';
import * as React from 'react';
import useSWR from 'swr';

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
        <TableCell>{rsc.status}</TableCell>
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

export default function ResourceTable({ workflowId }) {

  const { data, error } = useSWR(`/api/workflow/${workflowId}/resources`, fetcher)
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Resource ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Max Attempt</TableCell>
              <TableCell>Terminate After</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Activated At</TableCell>
              <TableCell>Terminated At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.resources.map((rsc: Resource) => (
              <Row workflow={data.workflow} rsc={rsc} key={rsc.resourceId} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )

}
