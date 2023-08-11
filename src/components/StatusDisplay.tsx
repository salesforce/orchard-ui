import { Cancel, CheckCircle, Error, Pending } from "@mui/icons-material";
import { Box, LinearProgress, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 15,
  borderRadius: 5,
}));

export default function StatusDisplay({ status, hourSpan }) {

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
        <BorderLinearProgress color="info" />
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
