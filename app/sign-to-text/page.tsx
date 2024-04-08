'use client'
import { Box } from '@mui/material'
import OptionList from '../components/option_list/option_list'
import LanguageList from '../components/language_list/language_list'
import Content from '../components/content/content'
import { useState } from 'react'

export interface SignToTextProps {}

export default function SignToText(props: SignToTextProps) {
  const isRevert = true
  const [isWebcamOn, setIsWebcamOn] = useState<boolean>(false)
  const toggleWebcam = () => {
    if (isRevert) setIsWebcamOn(prevState => !prevState)
  }
  return (
    <Box>
      <OptionList isRevert={isRevert} toggleWebcam={toggleWebcam} />
      <LanguageList isRevert={isRevert} />
      <Content isRevert={isRevert} isWebcamOn={isWebcamOn} />
    </Box>
  )
}
