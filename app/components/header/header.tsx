'use client'
import { AppsRounded, MenuRounded, SettingsOutlined } from '@mui/icons-material'
import { Box, Button, Divider, IconButton, Stack, Typography } from '@mui/material'
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

export default function Header() {
  const { data } = useSession()

  // useEffect(() => {
  //   if (data?.user?.name) toast.success('Sign in successfully')
  // }, [data?.user?.name])

  return (
    <Box position='fixed' width='100%' zIndex={1000} top={0} sx={{ backgroundColor: 'white' }}>
      <Stack direction='row' px={1.5} py={1.5} justifyContent='space-between'>
        <Stack direction='row' alignItems='center'>
          <Box>
            <IconButton aria-label='menu'>
              <MenuRounded />
            </IconButton>
          </Box>
          <Box>
            <Link href='/' prefetch={true}>
              <Image width={200} height={40} priority src='/logo.png' style={{ objectFit: 'contain' }} alt='logo' />
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
          {data?.user ? (
            <Stack direction='row' alignItems='center' spacing={2}>
              <Typography component='p'>{'Hello, ' + data.user.name}</Typography>
              <Button variant='contained' color='error' href='/api/auth/signout'>
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
