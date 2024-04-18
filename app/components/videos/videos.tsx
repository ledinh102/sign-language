'use client'
import { Box, Button, Card, IconButton, Stack } from '@mui/material'
import {
  LocalUser,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteAudioTracks,
  useRemoteUsers
} from 'agora-rtc-react'

import useSpeechToText from '@/hooks/useSpeechToText'
import { MicNoneRounded, MicOffRounded, VideocamOffRounded, VideocamRounded } from '@mui/icons-material'
import { useRouter, useSearchParams } from 'next/navigation'
import { createElement, useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'

export default function Videos(props: { channelName: string; AppID: string }) {
  const router = useRouter()
  const { AppID, channelName } = props
  const searchParams = useSearchParams()
  const [micOn, setMic] = useState(true)
  const [cameraOn, setCamera] = useState(true)
  const [activeConnection, setActiveConnection] = useState(true)
  const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack(micOn)
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack(cameraOn)
  const remoteUsers = useRemoteUsers()
  const { audioTracks } = useRemoteAudioTracks(remoteUsers)

  const { isListening, transcript, startListening, stopListening } = useSpeechToText({
    lang: 'en',
    continuous: true
  })

  const [query] = useDebounce(encodeURIComponent(transcript), 2000)
  useEffect(() => {
    // check user type
    const userType = searchParams.get('user')
    console.log('check user: ', userType === 'dd')
    if (userType === 'dd') startListening()
  }, [])

  usePublish([localMicrophoneTrack, localCameraTrack])
  useJoin(
    {
      appid: AppID,
      channel: channelName,
      token: null
    },
    activeConnection
  )

  audioTracks.map(track => track.play())
  const deviceLoading = isLoadingMic || isLoadingCam
  if (deviceLoading) return <div className='flex flex-col items-center pt-40'>Loading devices...</div>
  return (
    <Box width='800px' mx='auto' position='relative'>
      <Card sx={{ width: '100%', aspectRatio: 4 / 3 }}>
        {query && (
          <Card sx={{ position: 'absolute', zIndex: 5, width: '200px', left: 20, top: 20 }}>
            {createElement('pose-viewer', {
              loop: true,
              src: `https://us-central1-sign-mt.cloudfunctions.net/spoken_text_to_signed_pose?text=${query}&spoken=en&signed=ase`
            })}
          </Card>
        )}
        <Card sx={{ position: 'absolute', zIndex: 5, width: '200px', aspectRatio: 4 / 3, right: 20, top: 20 }}>
          <LocalUser
            audioTrack={localMicrophoneTrack}
            videoTrack={localCameraTrack}
            cameraOn={cameraOn}
            micOn={micOn}
            playAudio={micOn}
            playVideo={cameraOn}
          />
        </Card>
        {remoteUsers.map(user => (
          <Box key={user.uid} sx={{ width: '100%', height: '100%' }}>
            <RemoteUser user={user} />
          </Box>
        ))}
      </Card>
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        sx={{
          position: 'absolute',
          width: '100%',
          px: 3,
          height: '80px',
          bottom: 0,
          backgroundColor: 'rgba(0,0,0, 0.4)',
          borderRadius: 1,
          zIndex: 3
        }}
      >
        <Box>
          <IconButton color={micOn ? 'info' : 'error'} onClick={() => setMic(prevMicOn => !prevMicOn)}>
            {micOn ? <MicNoneRounded /> : <MicOffRounded />}
          </IconButton>
          <IconButton color={cameraOn ? 'info' : 'error'} sx={{ ml: 2 }} onClick={() => setCamera(prev => !prev)}>
            {cameraOn ? <VideocamRounded /> : <VideocamOffRounded />}
          </IconButton>
        </Box>
        <Button
          variant='contained'
          color='error'
          onClick={() => {
            setActiveConnection(false)
            router.push('/video-call')
          }}
        >
          End
        </Button>
      </Stack>
    </Box>
  )
}
