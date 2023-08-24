'use client'

import * as React from 'react';
import WorkflowTable from '@/components/WorkflowTable';
import { Directions, Search } from '@mui/icons-material';
import { Divider, IconButton, InputBase, Paper } from '@mui/material';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

export default function OrchardHome() {

  const [search, setSearch] = React.useState('%')

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSearch(`%${event.currentTarget.elements['search'].value}%`)
    return false
  }

  return (
    <>
      <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', maxWidth: 1000 , mb: 2}}
        onSubmit={submitSearch}
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
      <WorkflowTable statuses={[]} search={search} />
    </>
  );
}
