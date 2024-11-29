const saveCookie = view => {
  const date = new Date(2147483647 * 1000).toUTCString()
  document.cookie = `displayStyle=${view};SameSite=Lax;expires=${date}`
}

const showGrid = (data) => {
  const grid = document.querySelector('.displayGrid')
  //const table = document.querySelector('tbody')
  if (grid) { // table || 
    //table.classList.add('hide')
    grid.style.display = 'grid'
  }
}

const showList = (data) => {
  //const table = document.querySelector('tbody')
  const grid = document.querySelector('.displayGrid')
  if (grid) { // table || 
    grid.style.display = 'none'
    //table.classList.remove('hide')
  }
}


const changeView = async view => {
  if(view == 'list') {
    showList()
  }
  else {
    showGrid()
  }
}

// adds class "active" to clicked button and invokes other f-ions
const switchClasses = e => {
  const both = document.querySelectorAll('.displayStyleWrapper span')
  const classes = [...e.target.classList]

  if (!classes.includes('active')) { // inactive btn clicked
    both.forEach(btn => {
      if (btn == e.target) {
        btn.classList.add('active')
        saveCookie(btn.id)
        changeView(btn.id)
      } else {
        btn.classList.remove('active')
      }
    })
  }
}

// determine if view should be grid, or list
const viewStyle = () => {
  let view
  if (document.cookie.includes('list')) {
    view = 'list'
  }
  else {
    view = 'grid'
  }
  return view
}

export default (async () => {
  const view = viewStyle()
  // two btns to switch view:
  const displyaStyle = document.querySelectorAll('.displayStyleWrapper span')

  displyaStyle.forEach(x => {
    if (x.id == view) {
      x.classList.add('active')
    } else {
      x.classList.remove('active')
    }
    x.addEventListener('click', switchClasses)
  })

  changeView(view)
})()