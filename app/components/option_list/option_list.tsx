import { TranslateRounded } from '@mui/icons-material'
import Option from './option'

export interface OptionListProps {}

export default function OptionList(props: OptionListProps) {
  return <Option text='Text' icon={<TranslateRounded />} />
}
