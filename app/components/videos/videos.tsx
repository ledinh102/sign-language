'use client'
import { MicNoneRounded, MicOffRounded, VideocamOffRounded, VideocamRounded } from '@mui/icons-material'
import { Box, Button, Card, IconButton, Stack, Tooltip, Typography } from '@mui/material'
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
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, createElement, use, useCallback, useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import LinearProgressCustom from '../loading/LinearProgressCustom'
import styles from './videos.module.scss'

export default function Videos(props: { channelName: string; AppID: string }) {
  const router = useRouter()
  const userType = useSearchParams().get('user')
  const { AppID, channelName } = props
  const [micOn, setMic] = useState(userType === 'dd' ? false : true)
  const [cameraOn, setCamera] = useState(true)
  // const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack(micOn)
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack(cameraOn)
  const remoteUsers = useRemoteUsers()
  const { audioTracks } = useRemoteAudioTracks(remoteUsers)
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [query, setQuery] = useState('')

  // Webcam and Media Recorder refs and state
  const webcamRef = useRef<Webcam>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [capturing, setCapturing] = useState<boolean>(false)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  const [uploading, setUploading] = useState<boolean>(false)
  const [uploadComplete, setUploadComplete] = useState<boolean>(false)

  // Establish websocket connection
  useEffect(() => {
    const clientID = Date.now()
    const socket = new WebSocket(`ws://192.168.1.44:8000/video-call/${clientID}/${userType}`)
    setWs(socket)

    socket.onmessage = function (event) {
      console.log('query: ', event.data)
      if (userType === 'dd') setQuery(encodeURIComponent(event.data))
    }
  }, [channelName])

  // Capture handlers
  const handleDataAvailable = useCallback(
    ({ data }: { data: BlobPart }) => {
      if (data instanceof Blob && data.size > 0) {
        setRecordedChunks(prev => [...prev, data])
      }
    },
    [setRecordedChunks]
  )

  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true)
    if (webcamRef.current) {
      const stream: MediaStream | undefined = webcamRef.current.stream!
      if (stream) {
        mediaRecorderRef.current = new MediaRecorder(stream, {
          mimeType: 'video/webm'
        })
        mediaRecorderRef.current.addEventListener('dataavailable', handleDataAvailable)
        mediaRecorderRef.current.start()
      }
    }
  }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable])

  const handleStopCaptureClick = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setCapturing(false)
    }
  }, [mediaRecorderRef, setCapturing])

  const handleUpload = useCallback(async () => {
    console.log(recordedChunks)
    if (recordedChunks.length) {
      try {
        setUploading(true)
        const filename = 'audio.webm'
        const blob = new Blob(recordedChunks, {
          type: 'video/webm'
        })
        const formData = new FormData()
        formData.append('video', blob, filename)

        const response = await fetch('http://192.168.1.44:8000/audioToText', {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          const result = await response.json()
          console.log('Result:', result)
          if (result.text) ws?.send(result.text)
          console.log('Video uploaded successfully')
          setUploadComplete(true)
        } else {
          console.error('Failed to upload video')
        }
      } catch (error) {
        console.error('Error uploading video:', error)
      } finally {
        setUploading(false)
        setRecordedChunks([])
        setCapturing(false) // Reset capturing state here
        setUploadComplete(false) // Reset uploadComplete state here
      }
    }
  }, [recordedChunks])

  // Join Agora RTC channel
  // usePublish([localMicrophoneTrack, localCameraTrack])
  usePublish([localCameraTrack])
  useJoin({ appid: AppID, channel: channelName, token: null })

  audioTracks.map(track => track.play())
  // const deviceLoading = isLoadingMic || isLoadingCam
  const deviceLoading = isLoadingCam
  if (deviceLoading) return <LinearProgressCustom />

  return (
    <Box width='780px' mx='auto' pt={2} position='relative'>
      <Card sx={{ width: '100%', aspectRatio: 4 / 3 }}>
        {userType === 'dd' && query && (
          <Card sx={{ position: 'absolute', zIndex: 5, width: '200px', left: 20, top: 36 }}>
            {createElement('pose-viewer', {
              loop: true,
              src: `https://us-central1-sign-mt.cloudfunctions.net/spoken_text_to_signed_pose?text=${query}&spoken=en&signed=ase`
            })}
          </Card>
        )}
        <Card
          sx={
            remoteUsers.length === 1
              ? { position: 'absolute', zIndex: 5, width: '200px', aspectRatio: 4 / 3, right: 20, top: 36 }
              : { height: '100%' }
          }
        >
          <LocalUser
            // audioTrack={localMicrophoneTrack}
            videoTrack={localCameraTrack}
            cameraOn={cameraOn}
            micOn={micOn}
            playAudio={micOn}
            playVideo={cameraOn}
          />
          <Suspense>
            {userType === 'normal' && <Typography className={styles.caption}>helaos jdfojasdo ifjsaod</Typography>}
          </Suspense>
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
          backgroundColor: 'rgba(0,0,0, 0.6)',
          borderRadius: 1,
          zIndex: 3
        }}
      >
        <Box>
          <Tooltip title={micOn ? 'Mute Microphone' : 'Unmute Microphone'}>
            <IconButton color={micOn ? 'info' : 'error'} onClick={() => setMic(prevMicOn => !prevMicOn)}>
              {micOn ? <MicNoneRounded /> : <MicOffRounded />}
            </IconButton>
          </Tooltip>
          <Tooltip title={cameraOn ? 'Turn Off Camera' : 'Turn On Camera'}>
            <IconButton color={cameraOn ? 'info' : 'error'} sx={{ ml: 2 }} onClick={() => setCamera(prev => !prev)}>
              {cameraOn ? <VideocamRounded /> : <VideocamOffRounded />}
            </IconButton>
          </Tooltip>
        </Box>
        <Box>
          {!capturing && recordedChunks.length === 0 && (
            <Tooltip title='Start Recording'>
              <Button variant='contained' color='primary' onClick={handleStartCaptureClick}>
                Start Capture
              </Button>
            </Tooltip>
          )}
          {capturing && !uploadComplete && (
            <Tooltip title='Stop Recording'>
              <Button variant='contained' color='secondary' onClick={handleStopCaptureClick}>
                Stop Capture
              </Button>
            </Tooltip>
          )}
          {!capturing && recordedChunks.length > 0 && !uploadComplete && (
            <Tooltip title='Upload Recorded Video'>
              <Button variant='contained' color='success' onClick={handleUpload}>
                Upload Capture
              </Button>
            </Tooltip>
          )}
        </Box>
        <Button
          variant='contained'
          color='error'
          onClick={() => {
            router.push('/video-call')
          }}
        >
          End
        </Button>
      </Stack>
      <Webcam audio={userType === 'dd' ? false : true} ref={webcamRef} style={{ display: 'none' }} />
    </Box>
  )
}
