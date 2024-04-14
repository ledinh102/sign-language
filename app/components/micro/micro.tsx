import { MicNoneRounded } from '@mui/icons-material'
import { IconButton, Typography } from '@mui/material'

export interface MicroProps {
  isRevert: boolean
  text: string
  startStopListening: () => void
}

export default function Micro({ text, isRevert, startStopListening }: MicroProps) {
  if (isRevert) return
  return (
    <>
      <IconButton sx={{ position: 'absolute', bottom: 4, left: 4 }} onClick={() => startStopListening()}>
        <MicNoneRounded />
      </IconButton>
      <Typography
        component='span'
        variant='body1'
        sx={{ color: 'GrayText', fontSize: '0.8rem', position: 'absolute', bottom: 12, right: 20 }}
      >
        {`${text.length} / 500`}
      </Typography>
    </>
  )
}
