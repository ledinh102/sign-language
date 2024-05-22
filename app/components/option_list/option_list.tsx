// OptionList.tsx
import { TranslateRounded, VideocamOffRounded, VideocamRounded, CloudUploadRounded } from '@mui/icons-material'
import { Box, Button } from '@mui/material'
import colors from '../../constants.module.scss'

export interface OptionListProps {
  isRevert: boolean
  capturing?: boolean
  handleStartCaptureClick?: () => void
  handleStopCaptureClick?: () => void
  handleUpload?: () => void
}

export default function OptionList({
  isRevert,
  capturing,
  handleStartCaptureClick,
  handleStopCaptureClick,
  handleUpload
}: OptionListProps) {
  return (
    <Box pt={2}>
      {!isRevert && (
        <Button
          startIcon={<TranslateRounded />}
          variant='outlined'
          sx={{ background: colors.primaryColorActive, textTransform: 'none' }}
        >
          Text
        </Button>
      )}
      {isRevert && (
        <>
          <Button
            onClick={handleStartCaptureClick}
            startIcon={<VideocamRounded />}
            variant='outlined'
            disabled={capturing}
            sx={{ background: colors.primaryColorActive, textTransform: 'none' }}
          >
            Start recording
          </Button>
          <Button
            onClick={handleStopCaptureClick}
            startIcon={<VideocamOffRounded />}
            variant='outlined'
            disabled={!capturing}
            sx={{ ml: 2, background: colors.primaryColorActive, textTransform: 'none' }}
          >
            Stop recording
          </Button>
          <Button
            onClick={handleUpload}
            startIcon={<CloudUploadRounded />}
            variant='outlined'
            sx={{ ml: 2, background: colors.primaryColorActive, textTransform: 'none' }}
          >
            Upload
          </Button>
        </>
      )}
    </Box>
  )
}
