'use client'
import { useState } from 'react'

function App() {
  const [ourText, setOurText] = useState('')
  let msg = null

  if (typeof window !== 'undefined' && typeof window.SpeechSynthesisUtterance !== 'undefined') {
    msg = new SpeechSynthesisUtterance()
  }

  const speechHandler = () => {
    if (msg) {
      msg.text = ourText
      window.speechSynthesis.speak(msg)
    } else {
      console.error('SpeechSynthesisUtterance is not supported in this environment.')
    }
  }

  return (
    <div className='App'>
      <h1>React Text to Speech App</h1>
      <input type='text' value={ourText} placeholder='Enter Text' onChange={e => setOurText(e.target.value)} />
      <button onClick={speechHandler}>SPEAK</button>
    </div>
  )
}

export default App
