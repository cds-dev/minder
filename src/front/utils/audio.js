const audio = (() => {
  let mediaRecorder
  let audioChunks = []
  let recording = false

  const saveAudio = () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
    const audioUrl = URL.createObjectURL(audioBlob)
    const link = document.createElement('a')
    link.href = audioUrl
    link.download = 'recording.wav'
    link.click()
  }

  const flipButton = () => {
    const btn = document.querySelector('#recordAudio')
    if (btn) {
      if (recording) {
        btn.removeEventListener('click', startRecording)
        btn.addEventListener('click', stopRecording)
        recording = false
      } else {
        btn.removeEventListener('click', stopRecording)
        btn.addEventListener('click', startRecording)
        recording = true
      }
    }

    return recording
  }

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream)

    mediaRecorder.ondataavailable = event => audioChunks.push(event.data)
    mediaRecorder.onstop = saveAudio
  
    audioChunks = []
    mediaRecorder.start()
    console.info("Recording started...")
    recording = flipButton(recording)
  }

  const stopRecording = async () => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      console.info("Recording stopped.")
    }
    recording = flipButton(recording)
  }


  recording = flipButton(recording)
})()

export default audio