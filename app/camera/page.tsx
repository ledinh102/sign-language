'use client'
import React, { useState, useEffect, useRef } from 'react'

const CameraApp: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const photoRef = useRef<HTMLImageElement>(null)
  const [width, setWidth] = useState<number>(320)
  const [height, setHeight] = useState<number>(0)
  const [streaming, setStreaming] = useState<boolean>(false)

  const showViewLiveResultButton = () => {
    if (window.self !== window.top) {
      document.querySelector('.contentarea')?.remove()
      const button = document.createElement('button')
      button.textContent = 'View live result of the example code above'
      document.body.append(button)
      button.addEventListener('click', () => window.open(location.href))
      return true
    }
    return false
  }

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current

    const startup = async () => {
      if (showViewLiveResultButton()) {
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      video!.srcObject = stream
      video!.play()

      video!.addEventListener('canplay', () => {
        if (!streaming) {
          const height = video!.videoHeight / (video!.videoWidth / width)
          setHeight(height || width / (4 / 3))
          setStreaming(true)
        }
      })
    }

    startup()
  }, [width, streaming])

  const takePicture = async () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    const photo = photoRef.current

    const context = canvas!.getContext('2d')
    if (width && height) {
      canvas!.width = width
      canvas!.height = height
      context!.drawImage(video!, 0, 0, width, height)
      const data = canvas!.toDataURL('image/png')

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
        console.log(base64String)
        photo!.setAttribute('src', 'data:image/png;base64,' + base64String)
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }

  const clearPhoto = () => {
    const canvas = canvasRef.current
    const context = canvas!.getContext('2d')
    context!.fillStyle = '#AAA'
    context!.fillRect(0, 0, canvas!.width, canvas!.height)
    const data = canvas!.toDataURL('image/png')
    photoRef.current!.setAttribute('src', data)
  }

  const stopCamera = () => {
    const video = videoRef.current
    const stream = video!.srcObject as MediaStream
    if (stream) {
      const tracks = stream.getTracks()
      tracks.forEach(track => track.stop())
      video!.srcObject = null
      setStreaming(false)
    }
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      takePicture()
    }, 1000) // Adjust the photo capture interval

    return () => clearInterval(intervalId)
  }, [])

  const dataURLtoFile = (dataURL: string, filename: string) => {
    const arr = dataURL.split(',')
    const mime = arr[0].match(/:(.*?);/)![1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }

  return (
    <div className='contentarea'>
      <div className='camera'>
        <video id='video' ref={videoRef}>
          Video stream not available.
        </video>
        <button id='startbutton' onClick={takePicture}>
          Take photo
        </button>
        <button onClick={stopCamera}>Turn off camera</button>
      </div>
      <canvas id='canvas' ref={canvasRef}></canvas>
      <div className='output'>
        <img id='photo' alt='The screen capture will appear in this box.' ref={photoRef} />
      </div>
    </div>
  )
}

export default CameraApp
