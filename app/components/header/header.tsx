'use client'
import { AppsRounded, MenuRounded, SettingsOutlined } from '@mui/icons-material'
import { Avatar, Box, Button, Divider, IconButton, Stack, Typography } from '@mui/material'
import { blue } from '@mui/material/colors'
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  const { data: session } = useSession()
  console.log(session)
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
            <Link href='/' prefetch={true}>
              <Image fill priority src='/logo.png' sizes='10' alt='logo' />
            </Link>
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
          {session?.user ? (
            <Stack direction='row' alignItems='center' spacing={2}>
              <Typography component='p'>{'Hello, ' + session.user.name}</Typography>
              <Button variant='contained' color='error' onClick={() => signOut({ callbackUrl: '/', redirect: false })}>
                Signout
              </Button>
            </Stack>
          ) : (
            <Button variant='contained' onClick={() => signIn()}>
              Sign In
            </Button>
          )}
        </Stack>
      </Stack>
      <Divider />
    </Box>
  )
}
