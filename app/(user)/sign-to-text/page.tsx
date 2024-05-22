// SignToText.tsx
'use client'
import { Box } from '@mui/material'
import { Suspense, useCallback, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import Content from '../../components/content/content'
import LanguageList from '../../components/language_list/language_list'
import OptionList from '../../components/option_list/option_list'

interface SignToTextProps {}

export default function SignToText(props: SignToTextProps) {
  const isRevert: boolean = true
  const webcamRef = useRef<Webcam>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [capturing, setCapturing] = useState<boolean>(false)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  const [uploading, setUploading] = useState<boolean>(false)

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
        const filename = 'recorded_video.webm'
        const blob = new Blob(recordedChunks, {
          type: 'video/webm'
        })
        const formData = new FormData()
        formData.append('video', blob, filename)

        const response = await fetch('http://localhost:8000/translate/upload', {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          console.log('Video uploaded successfully')
        } else {
          console.error('Failed to upload video')
        }
      } catch (error) {
        console.error('Error uploading video:', error)
      } finally {
        setUploading(false)
        setRecordedChunks([])
      }
    }
  }, [recordedChunks])

  return (
    <Box>
      <OptionList
        isRevert={isRevert}
        capturing={capturing}
        handleStartCaptureClick={handleStartCaptureClick}
        handleStopCaptureClick={handleStopCaptureClick}
        handleUpload={handleUpload}
      />
      <Suspense>
        <LanguageList isRevert={isRevert} />
      </Suspense>
      <Suspense>
        <Content isRevert={isRevert} webcamRef={webcamRef} />
      </Suspense>
    </Box>
  )
}
