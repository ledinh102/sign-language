'use client'
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

export default function VideoCall() {
  const [channel, setChannel] = useState('')
  const [user, setUser] = useState('normal')
  const router = useRouter()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser(event.target.value)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    router.push(`/video-call/channel/${channel}${user === 'deaf-dumb' ? '/?user=dd' : ''}`)
  }

  return (
    <Stack justifyContent='center' alignItems='center' spacing={2} height='80vh'>
      <Paper sx={{ p: 3 }} elevation={12}>
        <Typography variant='h5' component='h1' gutterBottom>
          Create Room
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack alignItems='center' width='400px' spacing={2}>
            <TextField
              label='Channel Name'
              type='text'
              value={channel}
              onChange={event => setChannel(event.target.value)}
              placeholder='Enter channel name'
              required
              size='small'
              fullWidth
            />
            <FormControl fullWidth sx={{ pl: 0.5 }}>
              <FormLabel>User type</FormLabel>
              <RadioGroup row value={user} onChange={handleChange}>
                <FormControlLabel value='normal' control={<Radio />} label='Normal' />
                <FormControlLabel value='deaf-dumb' control={<Radio />} label='Deaf-dumb' />
              </RadioGroup>
            </FormControl>
            <Button type='submit' variant='contained' color='primary'>
              Join
            </Button>
          </Stack>
        </form>
      </Paper>
    </Stack>
  )
}
