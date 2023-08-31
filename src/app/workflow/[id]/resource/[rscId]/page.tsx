'use client'

import * as React from 'react';
import { fetcher, hourSpan, renderDate } from '@/lib/utils';
import { Box, Collapse, Container, IconButton, Link, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import useSWR from 'swr';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { ResourceInstance } from '@/lib/models';
import StatusDisplay from '@/components/StatusDisplay';

function AWSLink({ rscType, spec }) {

  if (!spec) return <></>

  let url: string = null
  if (rscType == 'aws.resource.EmrResource') {
    url = `https://console.aws.amazon.com/emr/home?region=us-east-1#/clusterDetails/${spec.clusterId}`
  } else if (rscType == 'aws.resource.Ec2Resource') {
    url = `https://console.aws.amazon.com/ec2/home?region=us-east-1#InstanceDetails:instanceId=${spec.ec2InstanceId}`
  }

  if (url) {
    return (
      <a target="_blank" href={url}>External Link</a>
    )
  }

  return <></>
}

function Row({ rsc, inst }) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            disabled={inst.instanceSpec == null}
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{inst.instanceAttempt}</TableCell>
        <TableCell align="center"><StatusDisplay status={inst.status} hourSpan={hourSpan(inst.activatedAt, inst.terminatedAt)} /></TableCell>
        <TableCell>{inst.errorMessage}</TableCell>
        <TableCell>{renderDate(inst.createdAt)}</TableCell>
        <TableCell>{renderDate(inst.activatedAt)}</TableCell>
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
              <AWSLink rscType={rsc.resourceType} spec={inst.instanceSpec} />
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
            <Row rsc={data.resource} inst={inst} key={inst.instanceAttempt} />
          ))}
        </TableBody>
      </TableContainer>
    </>
  )
}
