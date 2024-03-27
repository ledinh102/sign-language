'use client'
import { MicNoneRounded } from '@mui/icons-material'
import { Box, IconButton, Stack, TextField, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'

export interface ContentProps {}

export default function Content(props: ContentProps) {
  const [text, setText] = useState('')
  const [query] = useDebounce(encodeURIComponent(text), 1000)
  const router = useRouter()

  useEffect(() => {
    const { search } = window.location
    if (search != '') {
      const query = search.split('=')[1]
      setText(decodeURIComponent(query))
    }
  }, [])

  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newText = e.target.value
    if (newText.length <= 500) {
      setText(newText)
      router.push(newText ? `/?text=${encodeURIComponent(newText)}` : '/')
    }
  }

  return (
    <Stack direction='row' spacing={1.5}>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative'
        }}
      >
        <TextField
          multiline
          rows={14}
          fullWidth
          defaultValue={text}
          value={text}
          InputProps={{
            sx: {
              borderRadius: '12px',
              fontSize: '1.2rem'
            }
          }}
          onChange={handleTextChange}
        />
        <IconButton sx={{ position: 'absolute', bottom: 4, left: 4 }}>
          <MicNoneRounded />
        </IconButton>
        <Typography
          component='span'
          variant='body1'
          sx={{ color: 'GrayText', fontSize: '0.8rem', position: 'absolute', bottom: 12, right: 20 }}
        >
          {`${text.length} / 500`}
        </Typography>
      </Box>
      <Box
        sx={{
          width: '100%',
          background: 'rgba(0,0,0, 0.1)',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box width='74%' height='90%' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <pose-viewer
            loop
            src={
              text &&
              `https://us-central1-sign-mt.cloudfunctions.net/spoken_text_to_signed_pose?text=${query}&spoken=en&signed=ase`
            }
          />
        </Box>
        {/* <Typography>{query}</Typography> */}
      </Box>
    </Stack>
  )
}
