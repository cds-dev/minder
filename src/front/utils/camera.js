const camera = (() => {
  const cam = document.querySelector('button#takePhoto')

  cam.addEventListener('click', e => {
    e.preventDefault()
    navigator.mediaDevices.getUserMedia({
      video: true
    })
    .then((stream) => {
      const videoElement = document.querySelector("video")
      videoElement.parentElement.style.display = 'block'
      videoElement.srcObject = stream
      videoElement.play()
    })
    .catch((error) => {
      console.error("Error accessing camera:", error)
    })
  })

  const capture = document.querySelector('.capture')
  capture.addEventListener('click', e => {
    const canvas = document.querySelector('.canvas')
    const video = document.querySelector('.video')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const context = canvas.getContext("2d")
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob((blob) => {
      const formData = new FormData()
      formData.append("image", blob, "captured-image.jpg")

      fetch('/save-image/', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => console.info("Image saved:", data))
      .catch(error => console.error("Error saving image:", error));
    }, "image/jpeg", 0.7)
  })
})()

export default camera