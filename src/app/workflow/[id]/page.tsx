'use client'

import ActivityTable from '@/components/ActivityTable'
import ResourceTable from '@/components/ResourceTable'
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material'
import * as React from 'react'

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

  return (
    <>
      <div>Workflow ID: {params.id}</div>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
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
