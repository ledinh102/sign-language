import { Button } from '@mui/material'
import { ReactNode } from 'react'
import colors from '../../constants.module.scss'

export interface OptionProps {
  text: string
  icon: ReactNode
}

export default function Option({ text, icon }: OptionProps) {
  return (
    <Button startIcon={icon} variant='outlined' sx={{ background: colors.primaryColorActive }}>
      {text}
    </Button>
  )
}
