// 'use client'
// import { MicNoneRounded, MicOffRounded, VideocamOffRounded, VideocamRounded } from '@mui/icons-material'
// import { Box, Button, Card, IconButton, Stack } from '@mui/material'
// import {
//   LocalUser,
//   RemoteUser,
//   useJoin,
//   useLocalCameraTrack,
//   useLocalMicrophoneTrack,
//   usePublish,
//   useRemoteAudioTracks,
//   useRemoteUsers
// } from 'agora-rtc-react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { Suspense, createElement, useEffect, useRef, useState } from 'react'
// import { AssemblyAI } from 'assemblyai'

// export default function Videos(props: { channelName: string; AppID: string }) {
//   const router = useRouter()
//   const userType = useSearchParams().get('user')
//   console.log('userType', userType)
//   const { AppID, channelName } = props
//   const [micOn, setMic] = useState(userType === 'dd' ? false : true)
//   const [cameraOn, setCamera] = useState(true)
//   const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack(micOn)
//   const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack(cameraOn)
//   const remoteUsers = useRemoteUsers()
//   const { audioTracks } = useRemoteAudioTracks(remoteUsers)
//   const [ws, setWs] = useState<WebSocket | null>(null)
//   const [query, setQuery] = useState('')
//   const client = new AssemblyAI({
//     apiKey: process.env.NEXT_PUBLIC_ASSEMBLY_API_KEY as string
//   })

//   const mediaRecorder = useRef<MediaRecorder | null>(null)
//   const recordedChunks = useRef<Blob[]>([])
//   const [isStartRecording, setIsStartRecording] = useState<boolean>(true)

//   // Establish websocket connection
//   useEffect(() => {
//     const clientID = Date.now()
//     const socket = new WebSocket(`ws://localhost:8000/video-call/${clientID}`)
//     setWs(socket)

//     socket.onmessage = function (event) {
//       console.log('query: ', event.data)
//       setQuery(encodeURIComponent(event.data))
//     }
//   }, [channelName])

//   // Join Agora RTC channel
//   usePublish([localMicrophoneTrack, localCameraTrack])
//   useJoin({ appid: AppID, channel: channelName, token: null })

//   audioTracks.map(track => track.play())
//   const deviceLoading = isLoadingMic || isLoadingCam
//   if (deviceLoading) return <div>Loading devices...</div>

//   // Start recording
//   const startRecording = (userType: string | null) => {
//     const mediaTracks = []

//     if (localCameraTrack) {
//       mediaTracks.push(localCameraTrack.getMediaStreamTrack())
//     }

//     if (localMicrophoneTrack) {
//       mediaTracks.push(localMicrophoneTrack.getMediaStreamTrack())
//     }

//     if (mediaTracks.length > 0) {
//       const stream = new MediaStream(mediaTracks)
//       mediaRecorder.current = new MediaRecorder(stream)

//       mediaRecorder.current.ondataavailable = event => {
//         if (event.data.size > 0) {
//           recordedChunks.current.push(event.data)
//         }
//       }

//       mediaRecorder.current.onstop = async () => {
//         console.log(userType)
//         const mimeType = userType === 'dd' ? 'video/webm' : 'audio/mp3'
//         const blob = new Blob(recordedChunks.current, { type: mimeType })
//         const url = URL.createObjectURL(blob)
//         const transcript = await client.transcripts.create({ audio_url: url })
//         console.log(transcript.text)
//         // const a = document.createElement('a')
//         // a.style.display = 'none'
//         // a.href = url
//         // a.download = userType === 'dd' ? 'recording.webm' : 'recording.mp3'
//         // document.body.appendChild(a)
//         // a.click()
//         // window.URL.revokeObjectURL(url)
//         recordedChunks.current = []
//       }

//       mediaRecorder.current.start()
//     } else {
//       console.error('No media tracks available for recording')
//     }
//     setIsStartRecording(false)
//     console.log('recording started')
//   }

//   // Stop recording
//   const stopRecording = (userType: string | null) => {
//     if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
//       mediaRecorder.current.stop()
//     }
//     setIsStartRecording(true)
//     console.log('recording stopped')
//   }

//   return (
//     <Box width='780px' mx='auto' pt={2} position='relative'>
//       <Card sx={{ width: '100%', aspectRatio: 4 / 3 }}>
//         {userType === 'dd' && query && (
//           <Card sx={{ position: 'absolute', zIndex: 5, width: '200px', left: 20, top: 36 }}>
//             {createElement('pose-viewer', {
//               loop: true,
//               src: `https://us-central1-sign-mt.cloudfunctions.net/spoken_text_to_signed_pose?text=${query}&spoken=en&signed=ase`
//             })}
//           </Card>
//         )}
//         <Card
//           sx={
//             remoteUsers.length === 1
//               ? { position: 'absolute', zIndex: 5, width: '200px', aspectRatio: 4 / 3, right: 20, top: 36 }
//               : { height: '100%' }
//           }
//         >
//           <LocalUser
//             audioTrack={localMicrophoneTrack}
//             videoTrack={localCameraTrack}
//             cameraOn={cameraOn}
//             micOn={micOn}
//             playAudio={micOn}
//             playVideo={cameraOn}
//           />
//         </Card>
//         {remoteUsers.map(user => (
//           <Box key={user.uid} sx={{ width: '100%', height: '100%' }}>
//             <RemoteUser user={user} />
//           </Box>
//         ))}
//       </Card>
//       <Stack
//         direction='row'
//         justifyContent='space-between'
//         alignItems='center'
//         sx={{
//           position: 'absolute',
//           width: '100%',
//           px: 3,
//           height: '80px',
//           bottom: 0,
//           backgroundColor: 'rgba(0,0,0, 0.4)',
//           borderRadius: 1,
//           zIndex: 3
//         }}
//       >
//         <Box>
//           <IconButton color={micOn ? 'info' : 'error'} onClick={() => setMic(prevMicOn => !prevMicOn)}>
//             {micOn ? <MicNoneRounded /> : <MicOffRounded />}
//           </IconButton>
//           <IconButton color={cameraOn ? 'info' : 'error'} sx={{ ml: 2 }} onClick={() => setCamera(prev => !prev)}>
//             {cameraOn ? <VideocamRounded /> : <VideocamOffRounded />}
//           </IconButton>
//         </Box>
//         <Box>
//           <Suspense>
//             <Button
//               variant='contained'
//               color={isStartRecording ? 'primary' : 'success'}
//               onClick={isStartRecording ? () => startRecording(userType) : () => stopRecording(userType)}
//             >
//               {isStartRecording ? 'Start Recording' : 'Send Recorded'}
//             </Button>
//           </Suspense>
//         </Box>
//         <Button
//           variant='contained'
//           color='error'
//           onClick={() => {
//             router.push('/video-call')
//           }}
//         >
//           End
//         </Button>
//       </Stack>
//     </Box>
//   )
// }
