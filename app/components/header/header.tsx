import { AppsRounded, MenuRounded, SettingsOutlined } from '@mui/icons-material'
import { Avatar, Box, Divider, IconButton, Stack } from '@mui/material'
import { deepOrange } from '@mui/material/colors'
import Image from 'next/image'

export default function Header() {
  return (
    <Box>
      <Stack direction='row' px={1.5} py={1.5} justifyContent='space-between'>
        <Stack direction='row' alignItems='center'>
          <Box>
            <IconButton aria-label='menu'>
              <MenuRounded />
            </IconButton>
          </Box>
          <Box width='200px' height='40px' position='relative'>
            <Image fill priority src='/logo.png' alt='logo' />
          </Box>
        </Stack>
        <Stack direction='row' alignItems='center' spacing={1} mr={1.5}>
          <Box>
            <IconButton aria-label='menu'>
              <SettingsOutlined />
            </IconButton>
          </Box>
          <Box>
            <IconButton aria-label='menu'>
              <AppsRounded />
            </IconButton>
          </Box>
          <Box>
            <Avatar sx={{ ml: '8px', bgcolor: deepOrange[500], width: '32px', height: '32px', fontSize: '1.1rem' }}>
              N
            </Avatar>
          </Box>
        </Stack>
      </Stack>
      <Divider />
    </Box>
  )
}
