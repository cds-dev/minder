import markDays from "/front/utils/markDays.js"


const daysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate()
}


const drawCalendar = (month, year) => {
  const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec',]
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

  // significant data:
  const numberOfDaysCurrentMonth = daysInMonth(month, year)
  const numberOfDaysPreviousMonth = daysInMonth(month - 1, year)

  // Creating the calendar frame
  const calendar = document.querySelector('.calendar')
  if(calendar) {
    calendar.innerHTML = ''

    const table = document.createElement('table')
    table.className = 'calendarTable'
    calendar.appendChild(table)

    // #regeion TABLE HEADER
    const thead = document.createElement('thead')
    table.appendChild(thead)

    const monthNameRow = document.createElement('tr')
    const weekDayRow = document.createElement('tr')
    monthNameRow.className = 'monthNameRow'
    weekDayRow.className = 'weekDayRow'

    thead.appendChild(monthNameRow)
    thead.appendChild(weekDayRow)

    const prevMonthBtn = document.createElement('th')
    const currMonthName = document.createElement('th')
    const nextMonthBtn = document.createElement('th')

    monthNameRow.dataset.month = month
    monthNameRow.dataset.year = year

    prevMonthBtn.className = 'prevMonthBtn'
    currMonthName.className = 'currMonthName'
    currMonthName.colSpan = 5
    nextMonthBtn.className = 'nextMonthBtn'

    prevMonthBtn.innerHTML = '<span class="spanCover"><</span>'
    nextMonthBtn.innerHTML = '<span class="spanCover">></span>'

    monthNameRow.appendChild(prevMonthBtn)
    monthNameRow.appendChild(currMonthName)
    monthNameRow.appendChild(nextMonthBtn)

    // insert name of the current month
    currMonthName.innerHTML = `${months[month]} (${year})`

    // create weekday header
    for(let i = 0; i < days.length; i++) {
      const newTh = document.createElement('th')
      weekDayRow.append(newTh)
      newTh.innerHTML = days[i]
    }

    /* TABLE BODY */
    const tbody = document.createElement('tbody')
    table.appendChild(tbody)

    // let numberOfRows = Math.ceil(numberOfDaysCurrentMonth / 7)

    let numberOfRows = Math.ceil((numberOfDaysCurrentMonth + new Date(year, month, 1).getDay()) / 7)

    for (let row = 0; row < numberOfRows; row++) {
      const newRow = document.createElement('tr');
      tbody.appendChild(newRow);

      for (let wday = 0; wday < 7; wday++) {
        const dayBox = document.createElement('td');
        newRow.appendChild(dayBox);
        const link = document.createElement('a');
        dayBox.appendChild(link);
      }
    }

    // populate current month
    const weeks = document.querySelectorAll('.calendar tbody tr')
    let week = 0

    // go through each day of the month
    for (let day = 1; day <= numberOfDaysCurrentMonth; day++) {
      // gets which day of the week it is
      const currentDay = new Date(year, month, day).getDay()
      // find daysBoxes for current week
      const daysBoxes = weeks[week].querySelectorAll('td')

      // Populate dates for previous month
      if (day == 1 && currentDay != 0) {
        for (let prev = numberOfDaysPreviousMonth - currentDay + 1; prev <= numberOfDaysPreviousMonth; prev++) {
          const dayOfWeek = new Date(year, month - 1, prev).getDay()
          daysBoxes[dayOfWeek].childNodes[0].innerHTML = prev
          daysBoxes[dayOfWeek].className = 'otherMonth'
          daysBoxes[dayOfWeek].dataset.reference = `/diary/${prev}/${('0' + (month)).slice(-2)}/${year}/`
        }
      }

      daysBoxes[currentDay].childNodes[0].innerHTML = day
      daysBoxes[currentDay].dataset.reference = `/diary/${('0' + day).slice(-2)}/${('0' + (month + 1)).slice(-2)}/${year}/`

      if (day == numberOfDaysCurrentMonth && currentDay !== 6) {
        for (let next = 1; next <= (6 - currentDay); next++) {
          daysBoxes[currentDay + next].childNodes[0].innerHTML = next
          daysBoxes[currentDay + next].className = 'otherMonth' 
          daysBoxes[currentDay + next].dataset.reference = `/diary/0${next}/${('0' + (month + 2)).slice(-2)}/${year}/`
        }
      }

      if(currentDay == 6) week++
    }

    prevMonthBtn.addEventListener('click', goToPreviousMonth)
    nextMonthBtn.addEventListener('click', goToNextMonth)
    markDays()
  }
  
}


const findData = element => {
  if (element.parentElement.className == 'monthNameRow') return element.parentElement
  else return findData(element.parentElement)
}


const goToPreviousMonth = e => {
  const data = findData(e.target)
  let month = Number(data.dataset.month)
  let year = Number(data.dataset.year)

  if (month == 0) {
    month = 11
    year--
  } else {
    month--
  }
  drawCalendar(month, year)
}


const goToNextMonth = e => {
  const data = findData(e.target)
  let month = Number(data.dataset.month)
  let year = Number(data.dataset.year)

  if (month == 11) {
    month = 0
    year++
  } else {
    month++
  }
  drawCalendar(month, year)
}


const calendar = (() => {
  const today = new Date()
  const month = new Date().getMonth()
  const year = new Date().getFullYear()

  drawCalendar(month, year)
})()

export default calendar