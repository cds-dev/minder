// exported cause /utils/keyboardShortcuts calls it too
export const handleClick = (e) => {
  const hlist = document.querySelectorAll('.mainNav .closedMenu')
  const slist = document.querySelectorAll('.mainNav .shownMenu')
  if (hlist[0]?.classList.contains('closedMenu')) {
    hlist.forEach(x => {
      x.classList.remove('closedMenu')
      x.classList.add('shownMenu')
    })
  } else if ((slist[0]?.classList.contains('shownMenu'))) {
    slist.forEach(x => {
      x.classList.add('closedMenu')
      x.classList.add('closedMenu')
    })
  }
}

const menu = (() => {
  const burger = document.querySelector('.list')
  burger.addEventListener('click', handleClick)
})()

export default menu