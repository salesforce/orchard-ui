'use client'

import useSWR from 'swr';
import { fetcher } from '@/lib/utils';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export function Stats() {
  const { data, error } = useSWR('/api/stats/counts', fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <Grid container spacing={2}>
      <Grid item xs={1}>
      </Grid>
      <Grid item xs={2}>
        <Item>Pending: {data.pending}</Item>
      </Grid>
      <Grid item xs={2}>
        <Item>Running: {data.running}</Item>
      </Grid>
      <Grid item xs={2}>
        <Item>Finished: {data.finished}</Item>
      </Grid>
      <Grid item xs={2}>
        <Item>Failed: {data.failed}</Item>
      </Grid>
      <Grid item xs={2}>
        <Item>Canceled: {data.canceled}</Item>
      </Grid>
      <Grid item xs={1}>
      </Grid>
    </Grid>

  )
}
