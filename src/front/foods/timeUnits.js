const preselectMinutes = e => {
    const selectUnit = e.target.parentElement
  if (e.target.value) {
    const prevMarked = selectUnit.querySelector('.selectedUnit')
  } else if (selectUnit.querySelector('.selectedUnit')) {
    selectUnit.querySelector('.selectedUnit').classList.remove('selectedUnit')
  }
}

const selectUnit = e => {
  if (e.target.value) {
    let select
  switch (e.key) {
  case 's':
    e.preventDefault()
    select = "second"
    break
  case 'm':
    e.preventDefault()
    select = "month"
    break
  case 'h':
    e.preventDefault()
    select = "hour"
    break
  case 'd':
    e.preventDefault()
    select = "day"
    break
  case 'M':
    e.preventDefault()
    select = "month"
    break
  case 'y':
    e.preventDefault()
    select = "year"
    break
  }

  const selectUnit = e.target.parentElement
  const prevMarked = selectUnit.querySelector('.selectedUnit')
  if(select && prevMarked) {
    prevMarked.classList.remove('selectedUnit')
  }

  if (select) {
    const markSelected = selectUnit.querySelector(`[data-unit="${select}"]`)
    markSelected.classList.add('selectedUnit')
  }

  if (e.key == 'Tab' && !prevMarked) {
    selectUnit.querySelector(`[data-unit="minute"]`).classList.add('selectedUnit')
  }
  }
}

// applies class on mouse click
const handleEvent = e => {
  const wrapper = e.target.parentElement
  const allUnits = wrapper.querySelectorAll('.timeUnits')

  allUnits.forEach(x => {
    if (x.classList.contains('selectedUnit')) {
      x.classList.remove('selectedUnit')
    }
  })
  e.target.classList.add('selectedUnit')
}


export default () => {
  const timeUnits = (() => {
    // entire row that repeats minus the one that gets cloned
    const timeWrapper = Array.from(document.querySelectorAll('#timePlus')).slice(1)
    // the very input fields within time wrapper
    const timeInputs = document.querySelectorAll('#duration')

    // all of the possible time units to click on, all of them
    let timeUnits = []
    timeWrapper.forEach(x => {
      const temp = x.querySelectorAll('.timeUnits')
      timeUnits = [...timeUnits, ...temp]
    })

    timeUnits.forEach(x => {
      x.addEventListener('click', handleEvent)
    })

    timeInputs.forEach(x => {
      x.addEventListener('blur', preselectMinutes)

      x.addEventListener('keydown', selectUnit)
    })
  })()
}