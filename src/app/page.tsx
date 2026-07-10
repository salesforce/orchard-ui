'use client'

import WorkflowTable from '@/components/WorkflowTable';
import { Search } from '@mui/icons-material';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { Box, Divider, IconButton, InputBase, Paper, Typography } from '@mui/material';
import * as React from 'react';

export default function OrchardHome() {

  const [pipelineNameSearch, setPipelineNameSearch] = React.useState('%')
  const [workflowIdSearch, setWorkflowIdSearch] = React.useState('')

  function submitPipelineNameSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPipelineNameSearch(`%${event.currentTarget.elements['search'].value}%`)
    setWorkflowIdSearch('') // Clear workflow ID search when using pipeline search
    return false
  }

  function submitWorkflowIdSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setWorkflowIdSearch(event.currentTarget.elements['workflowIdSearch'].value.trim())
    setPipelineNameSearch('%') // Clear pipeline search when using workflow ID search
    return false
  }

  return (
    <>
      <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', maxWidth: 1000, mb: 2 }}
        onSubmit={submitPipelineNameSearch}
      >
        <IconButton sx={{ p: '10px' }} aria-label="menu">
          <Search />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Pipeline Name"
          name="search"
          inputProps={{ 'aria-label': 'search pipeline name' }}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions" type="submit">
          <KeyboardReturnIcon />
        </IconButton>
      </Paper>
      
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          my: 2,
          maxWidth: 1000
        }}
      >
        <Divider sx={{ flex: 1 }} />
        <Typography
          variant="body2"
          sx={{
            mx: 2,
            color: 'text.secondary',
            fontWeight: 'medium',
            fontSize: '0.875rem'
          }}
        >
          OR
        </Typography>
        <Divider sx={{ flex: 1 }} />
      </Box>
      
      <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', maxWidth: 1000, mb: 2 }}
        onSubmit={submitWorkflowIdSearch}
      >
        <IconButton sx={{ p: '10px' }} aria-label="menu">
          <Search />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Workflow ID"
          name="workflowIdSearch"
          inputProps={{ 'aria-label': 'search workflow id' }}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton color="primary" sx={{ p: '10px' }} aria-label="search workflow id" type="submit">
          <KeyboardReturnIcon />
        </IconButton>
      </Paper>
      
      <WorkflowTable statuses={[]} pipelineNameSearch={pipelineNameSearch} workflowIdSearch={workflowIdSearch} />
    </>
  );
}
