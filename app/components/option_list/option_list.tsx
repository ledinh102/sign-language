import { TranslateRounded, VideocamRounded } from '@mui/icons-material'
import Option from './option'
import { Box } from '@mui/material'

export interface OptionListProps {
  isRevert: boolean
  toggleWebcam?: () => void
}

export default function OptionList({ isRevert, toggleWebcam }: OptionListProps) {
  return (
    <Box>
      <Option
        toggleWebcam={toggleWebcam!}
        text={isRevert ? 'Webcam' : 'Text'}
        icon={isRevert ? <VideocamRounded /> : <TranslateRounded />}
      />
    </Box>
  )
}
