import { hourSpan, renderDate } from '@/lib/utils';
import { CheckCircle, Pending, Error, Cancel, Loop } from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import { Box, Breadcrumbs, CircularProgress, Link } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import StatusDisplay from './StatusDisplay';

export default function WorkflowCard({ workflow }) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Breadcrumbs aria-label="breadcrum">
          <Typography
            color="text.primary"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <HomeIcon fontSize="inherit" sx={{ mr: 0.5 }} />
            Workflow ({workflow.id})
          </Typography>
        </Breadcrumbs>
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
