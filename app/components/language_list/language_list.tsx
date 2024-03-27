'use client'
import { ExpandMoreRounded, SwapHorizRounded } from '@mui/icons-material'
import { TabContext, TabList } from '@mui/lab'
import { Box, IconButton, Stack, Tab } from '@mui/material'
import { useState } from 'react'
import styles from './language_list.module.scss'

export interface LanguageListProps {}

export default function LanguageList(props: LanguageListProps) {
  const [value, setValue] = useState('1')
  const [expanded, setExpanded] = useState(false)

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  const handleToggleExpand = () => {
    setExpanded(!expanded)
  }

  return (
    <Stack direction='row' alignItems='center' mt={1.5} mx={1.5}>
      <Box flex='1'>
        <TabContext value={value}>
          <Box sx={{ display: 'inline-block' }}>
            <TabList onChange={handleChange}>
              <Tab label='Detect language' value='1' />
              <Tab label='English' value='2' />
            </TabList>
          </Box>
          <IconButton sx={{ ml: 1 }} onClick={handleToggleExpand}>
            <ExpandMoreRounded className={`${styles['expand-icon']} ${expanded ? styles['rotate180'] : ''}`} />
          </IconButton>
        </TabContext>
      </Box>
      <Box>
        <IconButton>
          <SwapHorizRounded />
        </IconButton>
      </Box>
      <Box flex='1'>
        <TabContext value={'1'}>
          <Box>
            <TabList onChange={handleChange}>
              <Tab label='Sign language' value='1' />
            </TabList>
          </Box>
        </TabContext>
      </Box>
    </Stack>
  )
}
