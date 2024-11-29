export default () => {
  const listOfDateElements = document.querySelectorAll('.allDates p')
  const listOfDates = [...listOfDateElements].map(x => `/diary/${x.innerHTML}/`)
  const calendar = document.querySelectorAll('tbody td')
  calendar.forEach(x => {
    if(listOfDates.includes(x.dataset.reference)) {
      x.childNodes[0].href = x.dataset.reference
      x.childNodes[0].classList.add('filledDay')
    }
  })

  /* INDICATE 10th AND TODAY */

  const today = new Date()

  const dayToday = today.getDate()
  const monToday = today.getMonth()
  const yearToday = today.getFullYear()
  const dateToday = `/diary/${dayToday}/${('0' + (monToday + 1)).slice(-2)}/${yearToday}/`

  const tenth = `/diary/10/${('0' + (monToday + 1)).slice(-2)}/${yearToday}/`

  const findToday = document.querySelector(`[data-reference="${dateToday}"]`)

  const findTenth = document.querySelector(`[data-reference="${tenth}"]`)

  if(findToday) {
    findToday.childNodes[0].classList.add('circleToday')
  }

  if(findTenth) {
    findTenth.childNodes[0].classList.add('markTenth')
  }
}