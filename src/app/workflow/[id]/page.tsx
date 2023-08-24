'use client'

import ActivityTable from '@/components/ActivityTable';
import ResourceTable from '@/components/ResourceTable';
import WorkflowCard from '@/components/WorkflowCard';
import { fetcher } from '@/lib/utils';
import { Box, Container, Divider, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';
import * as React from 'react';
import useSWR from 'swr';

function EntityTable({ selection, workflowId }) {
  if (selection === 'resources') {
    return <ResourceTable workflowId={workflowId} />
  }

  return <ActivityTable workflowId={workflowId} />
}

export default function WorfklowPage({ params }) {

  const [selection, setSelection] = React.useState('activities')
  const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
    setSelection(newAlignment);
  }

  const { data, error } = useSWR(`/api/workflow/${params.id}/activities`, fetcher)
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <>
      <Paper elevation={3}>
        <WorkflowCard workflow={data.workflow} />
      </Paper>
      <Box sx={{mt:5}}>
        <Divider />
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{mt: 5}}
      >
        <ToggleButtonGroup
          color="primary"
          value={selection}
          exclusive
          onChange={handleChange}
          aria-label="Workflow Entities"
        >
          <ToggleButton value="activities">Activities</ToggleButton>
          <ToggleButton value="resources">Resources</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <EntityTable selection={selection} workflowId={params.id} />
    </>
  )
}
