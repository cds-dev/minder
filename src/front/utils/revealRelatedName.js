const hideName = e => {
  const item = e.target
  const name = item.querySelector('.itemName')
  name.classList.add('hide')
}

const showName = e => {
  const item = e.target
  const name = item.querySelector('.itemName')
  name.classList.remove('hide')
  item.addEventListener('mouseleave', hideName)
}

const revealName = (() => {
  const items = document.querySelectorAll('.item')
  items.forEach(x => {
    x.addEventListener('mouseenter', showName)
  })
})()

export default revealName