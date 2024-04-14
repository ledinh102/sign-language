'use client'
import { useEffect, useRef } from 'react'
import { randomID } from '@/lib/utils'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'
import { Box } from '@mui/material'

export interface VideoCallProps {}

export default function VideoCall(props: VideoCallProps) {
  // Create a ref to hold the DOM element
  // const videoCallRef = useRef<HTMLDivElement | null>(null)

  // function getUrlParams(url = window.location.href) {
  //   let urlStr = url.split('?')[1]
  //   return new URLSearchParams(urlStr)
  // }

  // const roomID = getUrlParams().get('roomID') || randomID(5)

  // const myMeeting = async () => {
  //   if (typeof window !== 'undefined') {
  //     // Check for client-side execution
  //     // generate Kit Token
  //     const appID = Number(process.env.NEXT_PUBLIC_APP_ID)
  //     const serverSecret = process.env.NEXT_PUBLIC_SERVER_SECRET
  //     const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
  //       appID,
  //       serverSecret!,
  //       roomID,
  //       randomID(5),
  //       randomID(5)
  //     )

  //     // Create ZegoUIKitPrebuilt instance and initiate the call
  //     const zegoInstance = ZegoUIKitPrebuilt.create(kitToken)
  //     if (videoCallRef.current) {
  //       zegoInstance.joinRoom({
  //         container: videoCallRef.current,
  //         sharedLinks: [
  //           {
  //             name: 'Personal link',
  //             url:
  //               window.location.protocol + '//' + window.location.host + window.location.pathname + '?roomID=' + roomID
  //           }
  //         ],
  //         scenario: {
  //           mode: ZegoUIKitPrebuilt.OneONoneCall
  //         }
  //       })
  //     } else {
  //       console.error('Element reference not available')
  //     }
  //   }
  // }

  return (
    // <Box className='myCallContainer' ref={videoCallRef} sx={{ width: '100%', height: '80vh' }}>
    //   {/* ... content or children of the video call container */}
    // </Box>
    <h1>hello</h1>
  )
}
