let storeClasses = []
const btnClicked = e => {
  e.target.classList.forEach(x => {
    storeClasses.push(x)
  })

  if ([...e.target.classList].includes('icons')) {
    e.target.classList = ''
    e.target.classList.add('icons')
    e.target.classList.add('drain')
  }

  setTimeout(() => {
    e.target.classList = ''
    storeClasses.forEach(x => {
      e.target.classList.add(x)
    })
  }, 2000)
}

const btnClick = (() => {
  const btns = document.querySelectorAll('button')

  if (btns.length) {
    btns.forEach(x => {
      x.addEventListener('click', btnClicked)
    })
  }
})()

export default btnClick