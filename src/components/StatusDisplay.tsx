import { Box, LinearProgress, Typography } from "@mui/material";

export default function StatusDisplay({ status, hourSpan }) {

  if (status === 'running')
    return (
      <>
        <LinearProgress />
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${hourSpan} hrs`}</Typography>
        </Box>
      </>
    )

  if (status === 'finished')
    return (
      <>
        <LinearProgress variant="determinate" color="success" value={100} />
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${hourSpan} hrs`}</Typography>
        </Box>
      </>
    )

  return (
    <>
      {status} ({hourSpan} hrs)
    </>
  )
}
