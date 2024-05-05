import { Box } from '@mui/material'
import Content from './components/content/content'
import LanguageList from './components/language_list/language_list'
import OptionList from './components/option_list/option_list'

export default function Home() {
  const isRevert = false
  return (
    <Box pt={2}>
      <OptionList isRevert={isRevert} />
      <LanguageList isRevert={isRevert} />
      <Content isRevert={isRevert} isWebcamOn={false} />
    </Box>
  )
}
