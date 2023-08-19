'use client';

import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import useSWR from 'swr';
import { fetcher, hourSpan, renderDate } from '@/lib/utils';
import StatusDisplay from './StatusDisplay';

export function BasicTable({ statuses }) {

  const { data, error } = useSWR(`/api?statuses=${statuses.join(',')}`, fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Workflow ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Activated At</TableCell>
            <TableCell>Terminated At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Link href={`/workflow/${row.id}`}>{row.id}</Link>
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell align="center"><StatusDisplay status={row.status} hourSpan={hourSpan(row.activatedAt, row.terminatedAt)} /></TableCell>
              <TableCell>{renderDate(row.createdAt)}</TableCell>
              <TableCell>{renderDate(row.activatedAt)}</TableCell>
              <TableCell>{renderDate(row.terminatedAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
