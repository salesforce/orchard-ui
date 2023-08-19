import { hourSpan, renderDate } from '@/lib/utils';
import { CheckCircle, Pending, Error, Cancel, Loop } from '@mui/icons-material';
import { Box, CircularProgress } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

function StatusDisplay({ status, hourSpan }) {

  if (status === 'pending')
    return (
      <>
        <Pending color="secondary" />
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">pending</Typography>
        </Box>
      </>
    )

  if (status === 'running')
    return (
      <>
        <Loop color="info" />
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${hourSpan} h`}</Typography>
        </Box>
      </>
    )

  if (status === 'finished')
    return (
      <>
        <CheckCircle color="success" />
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${hourSpan} h`}</Typography>
        </Box>
      </>
    )

  if (status === 'failed')
    return (
      <>
        <Error color="error" />
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${hourSpan} h`}</Typography>
        </Box>
      </>
    )

  if (status === 'canceled')
    return (
      <>
        <Cancel color="warning" />
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${hourSpan} h`}</Typography>
        </Box>
      </>
    )

  return (
    <>
      {status}
      ({hourSpan} hrs)
    </>
  )
}
export default function WorkflowCard({ workflow }) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {workflow.id}
        </Typography>
        <Typography variant="h5" component="div">
          {workflow.name} <StatusDisplay status={workflow.status} hourSpan={hourSpan(workflow.activatedAt, workflow.terminatedAt)} />
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Created: {renderDate(workflow.createdAt)}
        </Typography>
        <Typography variant="body2">
          Activated: {renderDate(workflow.activatedAt)}
          <br />
          Terminated: {renderDate(workflow.terminatedAt)}
        </Typography>
      </CardContent>
      <CardActions>
      </CardActions>
    </Card>
  );
}
