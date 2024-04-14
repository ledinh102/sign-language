'use client'

import { Box, Stack } from '@mui/material'
import AgoraRTC, {
  AgoraRTCProvider,
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteAudioTracks,
  useRemoteUsers
} from 'agora-rtc-react'

import Link from 'next/link'
import styles from './call.module.scss'

function Call(props: { appId: string; channelName: string }) {
  const client = useRTCClient(AgoraRTC.createClient({ codec: 'vp8', mode: 'rtc' }))

  return (
    <AgoraRTCProvider client={client}>
      <Videos channelName={props.channelName} AppID={props.appId} />
      {/* <div>
        <Link href='/'>End Call</Link>
      </div> */}
    </AgoraRTCProvider>
  )
}

function Videos(props: { channelName: string; AppID: string }) {
  const { AppID, channelName } = props
  const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack()
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack()
  const remoteUsers = useRemoteUsers()
  const { audioTracks } = useRemoteAudioTracks(remoteUsers)

  usePublish([localMicrophoneTrack, localCameraTrack])
  useJoin({
    appid: AppID,
    channel: channelName,
    token: null
  })

  audioTracks.map(track => track.play())
  const deviceLoading = isLoadingMic || isLoadingCam
  if (deviceLoading) return <div className='flex flex-col items-center pt-40'>Loading devices...</div>

  return (
    <Box>
      <Box maxWidth={remoteUsers.length === 0 ? '800px' : '1200px'} mx='auto' className={styles.cam}>
        <Stack direction='row' width='100%' spacing={2} sx={{ aspectRatio: remoteUsers.length > 0 ? 8 / 3 : 8 / 6 }}>
          <LocalVideoTrack track={localCameraTrack} play={true} style={{ borderRadius: '16px', overflow: 'hidden' }} />
          {remoteUsers.map((user, idx) => (
            <Box key={idx} sx={{ width: '100%', borderRadius: 4, overflow: 'hidden' }}>
              <RemoteUser user={user} />
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}

export default Call
