const upTheDb = async id => {
  const res = await fetch(`/kanban/default/${id}`)
  const j = await res.json()
  window.location.reload()
}


const findA = el => {
  if (!el.parentNode.tagName == 'A') {
    return findA(el.parentNode)
  }
  else {
    return el.parentNode
  }
}


const switchBoard = e => {
  const aElement = findA(e.target)
  if (aElement.dataset.id !== localStorage.getItem('mainKanban')) {
    upTheDb(aElement.dataset.id)
  }
  localStorage.setItem('mainKanban', aElement.dataset.id)
}


export default (() => {
  const boardSwitcher = async () => {
    const sub = document.querySelectorAll('.submenu a')
    sub.forEach(x => {
      x.addEventListener('click', switchBoard)
    })

    if(localStorage.getItem('mainKanban')) {
      // console.info(localStorage.getItem('mainKanban'))
    }
    else { // THISIS: first load
      const response = await fetch('/kanban/default/')
      const data = await response.json()
      const main = data.board
      localStorage.setItem('mainKanban', main)
      boardSwitcher()
    }
  }
  if (document.querySelector('.listAllkanban')) {
    boardSwitcher()
  }
})()