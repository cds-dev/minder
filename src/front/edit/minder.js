import uploadName from "/front/edit/uploadName.js"



const quickDings = e => {
  const add = Number(e.target.dataset.minutes)
  const timeInput = document.querySelector("#time")
  let [hours, minutes] = timeInput.value.split(":").map(Number)
  minutes += add

  if (minutes >= 60) {
    minutes -= 60
    hours = (hours + 1) % 24 // Wrap around to 0 if hours go over 23
  }

  const newTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
  timeInput.value = newTime
}


const setDefaultSnooze = e => {
  const add = Number(e.target.dataset.minutes)
  const input = document.querySelector('#snooze')
  input.value = input.value || 0
  const snooze = Number(input.value) + Number(add)
  input.value = snooze
}


const minder = (() => {
  if (document.querySelector('#date')) {
    // #region input current date
    const today = new Date().toISOString().split('T')[0]
    document.querySelector('#date').value = document.querySelector('#date').value || today
    // #endregion

    // #region input current time
    const now = new Date()
    const formattedTime = now.toTimeString().slice(0, 5)
    document.querySelector("#time").value = document.querySelector("#time").value || formattedTime
    // #endregion

    // #region dingin event listener
    const dingins = document.querySelectorAll('.dingins .quickTimeWrapper div button')
    dingins.forEach(x => {
      x.addEventListener('click', quickDings)
    })
    // #endregion

    // #region snooze for
    const snoozes = document.querySelectorAll('.snoozeMe .quickTimeWrapper div button')
    snoozes.forEach(x => {
      x.addEventListener('click', setDefaultSnooze)
    })
    // #endregion

    uploadName()
  }
})()


export default minder