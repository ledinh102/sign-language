'use client'
import AgoraRTC, { AgoraRTCProvider, useRTCClient } from 'agora-rtc-react'
import Videos from '../videos/videos'

export default function Call(props: { appId: string; channelName: string }) {
  const client = useRTCClient(AgoraRTC.createClient({ codec: 'vp8', mode: 'rtc' }))

  return (
    <AgoraRTCProvider client={client}>
      <Videos channelName={props.channelName} AppID={props.appId} />
    </AgoraRTCProvider>
  )
}
