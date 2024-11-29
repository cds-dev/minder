

const ruckus = (() => {
  const getDings = async () => {
  const response = await fetch('/audio-files/')
  const dings = await response.json()
  return dings
}


let intervalId


const playDing = (ding) => {
  const audio = new Audio(`../audio/${ding}`)
  audio.play()
  clearTimeout(intervalId)
  localStorage.removeItem('dingNext')
  // const show = ding.split('.')[0].replaceAll('-', ' ')
  //showTone.innerHTML = show
  saveLocal()
}


const elsilencio = () => {
  localStorage.removeItem('dingNext')
  clearTimeout(intervalId)
}

const ding = () => {
  const nextTime = new Date(localStorage.getItem('dingNext'))
  const currentTime = new Date()
  const interval = nextTime.getTime() - currentTime.getTime()

  const nextDing = localStorage.getItem('ding')
  intervalId = setTimeout(() => playDing(nextDing), interval)
}

const saveLocal = async () => {
  if (localStorage.getItem('dingNext')) {
    elsilencio()
  }
  else {
    // wide time range, cause if the low time is too long, then you know that after a ding you have at least that long, and you wonder off, and top time has to be long, otherwise, it dings way too often
    const topTime = 5 * 60_000
    const lowTime = 2 * 60_000

    const randomInterval = Math.floor(Math.random() * (topTime - lowTime + 1)) + lowTime
    const currentTime = new Date()
    const nextTime = new Date(currentTime.getTime() + randomInterval)
    localStorage.setItem('dingNext', nextTime)

    await getDings()
    .then(dings => {
      const randomFile = dings[Math.floor(Math.random() * dings.length)]
      localStorage.setItem('ding', randomFile)
    })
    ding()
  }
}
  const btn = document.querySelector('.toneTape')
  if (localStorage.getItem('dingNext')) {
    ding()
  }
  btn.addEventListener('click', saveLocal)
})()

export default ruckus