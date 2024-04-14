'use client'
import { Button, Grid, Stack, TextField, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

export default function VideoCall() {
  const router = useRouter()
  const [channelName, setChannelName] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    router.push(`/channel/${channelName}`)
  }

  return (
    <Stack justifyContent='center' alignItems='center' spacing={2} mt={8}>
      <Typography variant='h5' component='h1' gutterBottom>
        Create Room
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack alignItems='center' width='400px' spacing={2}>
          <TextField
            label='Channel Name'
            id='channelName'
            type='text'
            name='channel'
            value={channelName}
            onChange={event => setChannelName(event.target.value)}
            placeholder='Enter channel name'
            required
            fullWidth
          />
          <Button type='submit' variant='contained' color='primary'>
            Join
          </Button>
        </Stack>
      </form>
    </Stack>
  )
}
