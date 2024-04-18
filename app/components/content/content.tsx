'use client'
import useSpeechToText from '@/hooks/useSpeechToText'
import { dataURLtoFile } from '@/lib/utils'
import { Box, Stack, TextField } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ChangeEvent, createElement, useCallback, useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { useDebounce } from 'use-debounce'
import MicroAndCountText from '../micro/micro'
import styles from './content.module.scss'

export interface ContentProps {
  isRevert: boolean
  isWebcamOn: boolean
}

export default function Content({ isRevert, isWebcamOn }: ContentProps) {
  const { isListening, transcript, startListening, stopListening } = useSpeechToText({ continuous: false })
  const [text, setText] = useState('')
  const [query] = useDebounce(encodeURIComponent(text), 1000)
  const router = useRouter()
  const webcamRef = useRef<Webcam | null>(null)
  const [imgSrc, setImgSrc] = useState<string | null>(null)

  useEffect(() => {
    setText(transcript)
  }, [transcript])

  const startStopListening = () => {
    isListening ? stopVoice() : startListening()
  }

  const stopVoice = () => {
    setText(prev => {
      const newText = prev + (transcript.length ? (prev.length ? ' ' : '') + transcript : '')
      return newText
    })
    stopListening()
  }

  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newText = e.target.value
    if (newText.length <= 500) {
      setText(newText)
      router.push(newText ? `/?text=${encodeURIComponent(newText)}` : '/')
    }
  }

  const displayPhoto = async (data: string) => {
    try {
      const formData = new FormData()
      formData.append('my_file', dataURLtoFile(data, 'photo.png'))
      const response = await fetch('http://127.0.0.1:8000/file', {
        method: 'POST',
        body: formData
      })
      if (!response.ok) {
        throw new Error('Failed to upload photo')
      }
      const responseData = await response.json()
      const base64String = responseData.image_base64
      setImgSrc('data:image/png;base64,' + base64String)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const capture = useCallback(async () => {
    if (isWebcamOn) {
      if (webcamRef.current) {
        try {
          const imageSrc = webcamRef.current.getScreenshot()
          if (imageSrc) {
            await displayPhoto(imageSrc)
          } else {
            console.error('Failed to capture image: Screenshot is null')
          }
        } catch (error) {
          console.error('Error capturing image:', error)
        }
      } else {
        console.error('Webcam reference is null')
      }
    }
  }, [isWebcamOn])

  useEffect(() => {
    const interval = setInterval(capture, 500)
    return () => clearInterval(interval)
  })

  return (
    <Stack direction='row' spacing={1.5}>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative'
        }}
      >
        {isRevert ? (
          <Box className={styles.webcamContainer}>
            {isWebcamOn ? (
              <Webcam
                ref={webcamRef}
                className={styles.webcam}
                audio={false}
                screenshotFormat='image/jpeg'
                videoConstraints={{
                  facingMode: 'user'
                }}
              />
            ) : null}
          </Box>
        ) : (
          <TextField
            multiline
            rows={14}
            fullWidth
            defaultValue={text}
            disabled={isListening}
            // value={isListening ? text + (transcript.length ? (text.length ? ' ' : '') + transcript : '') : text}
            value={text}
            InputProps={{
              sx: {
                borderRadius: '12px',
                fontSize: '1.2rem'
              }
            }}
            onChange={handleTextChange}
          />
        )}
        <MicroAndCountText
          text={text}
          isRevert={isRevert}
          isListening={isListening}
          startStopListening={startStopListening}
        />
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
        <Box
          width={isRevert ? '100%' : '74%'}
          height={isRevert ? '100%' : '90%'}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {imgSrc ? <Image className={styles.imgResult} src={imgSrc!} fill={true} alt='Picture of the author' /> : null}
          {query &&
            createElement('pose-viewer', {
              loop: true,
              src: `https://us-central1-sign-mt.cloudfunctions.net/spoken_text_to_signed_pose?text=${query}&spoken=en&signed=ase`
            })}
        </Box>
      </Box>
    </Stack>
  )
}
