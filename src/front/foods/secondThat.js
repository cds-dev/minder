const secondThat = () => {
  const seconds = document.querySelectorAll('.secondThis')
  seconds.forEach(x => {
    x.style.display = 'grid'
  })
}

export default () => {
  const isSecondary = document.querySelector('input#category[value="secondary"]')
  if(isSecondary) secondThat()
  const cats = document.querySelectorAll('input#category')
  cats.forEach(x => {
    x.addEventListener('keyup', e => {
      if(e.target.value == 'secondary') {
        secondThat()
      }
    })
  })
}