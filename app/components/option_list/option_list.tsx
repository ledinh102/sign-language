import { TranslateRounded, VideocamRounded } from '@mui/icons-material'
import Option from './option'

export interface OptionListProps {
  isRevert: boolean
  toggleWebcam?: () => void
}

export default function OptionList({ isRevert, toggleWebcam }: OptionListProps) {
  return (
    <Option
      toggleWebcam={toggleWebcam!}
      text={isRevert ? 'Webcam' : 'Text'}
      icon={isRevert ? <VideocamRounded /> : <TranslateRounded />}
    />
  )
}
