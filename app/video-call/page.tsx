'use client'
import { useEffect, useRef } from 'react'
import { randomID } from '@/lib/utils'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'
import { Box } from '@mui/material'

export interface VideoCallProps {}

export function getUrlParams(url = window.location.href) {
  let urlStr = url.split('?')[1]
  return new URLSearchParams(urlStr)
}

export default function VideoCall(props: VideoCallProps) {
  const roomID = getUrlParams().get('roomID') || randomID(5)
  const zegoInstanceRef = useRef<any>(null)

  useEffect(() => {
    const myMeeting = async (element: HTMLDivElement) => {
      // generate Kit Token
      const appID = Number(process.env.NEXT_PUBLIC_APP_ID)
      const serverSecret = process.env.NEXT_PUBLIC_SERVER_SECRET
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret!, roomID, randomID(5), randomID(5))

      // Create instance object from Kit Token.
      zegoInstanceRef.current = ZegoUIKitPrebuilt.create(kitToken)

      // start the call
      zegoInstanceRef.current.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: 'Personal link',
            url: window.location.protocol + '//' + window.location.host + window.location.pathname + '?roomID=' + roomID
          }
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall
        }
      })
    }

    const divElement = document.querySelector('.myCallContainer') as HTMLDivElement
    if (divElement) {
      myMeeting(divElement)
    }
  }, [roomID])

  return <Box className='myCallContainer' sx={{ width: '100%', height: '80vh' }} />
}
