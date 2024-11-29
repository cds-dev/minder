const fixorder = () => {
  const orders = document.querySelectorAll('.orderNumber')
  for (let i = 0; i < orders.length; i++) {
    orders[i].innerHTML = i
  }
}

const showtitle = e => {
  const all = document.querySelectorAll('.showtitle')
  if(all.length) {
    all.forEach(x => {
      if (x.innerHTML) {
        x.style.visibility = 'visible'
        x.style.paddingInline = '1rem'
        x.style.width = 'max-content'
        x.style.zIndex = 4
      }
    })
  }
}

const hidetitle = e => {
  const all = document.querySelectorAll('.showtitle')
  if(all.length) {
    all.forEach(x => {
      x.style.visibility = 'hidden'
      x.style.width = '0'
      x.style.paddingInline = '0'
      x.style.zIndex = 0
    })
  }
}

const updatetitle = e => {
  const title = e.target.value

  const order = e.target.parentElement.parentElement.childNodes[3].childNodes[1].innerText
  const change = document.querySelector(`.stepTo${order}`)
  change.innerHTML = title
  if (!title) {
    change.style.visibility = "hidden"
  }
}

export default () => {
  const stepJumper = (() => {
    const steps = document.querySelectorAll('#positional')
    fixorder()
    const guide = document.querySelector('.jumpTo')

    const top = document.querySelector('.goToTop').parentElement.cloneNode(true)
    guide.innerHTML = ''
    guide.appendChild(top)

    for (let i = 1; i < steps.length; i++) {
      steps[i].childNodes[5].id = `stepTo${i}`
      steps[i].childNodes[5].style.paddingTop = '8rem'
      steps[i].childNodes[5].style.marginTop = '-8rem'
      const anchor = document.createElement('a')
      anchor.href = `#stepTo${i}`

      const div = document.createElement('div')
      div.className = 'stepJump'
      div.title = steps[i].childNodes[5].childNodes[3].value
      div.innerHTML = i
      anchor.appendChild(div)

      const title = document.createElement('div')
      title.classList.add(`stepTo${i}`)
      if(steps[i].childNodes[5].childNodes[3].value) {
        title.innerHTML = steps[i].childNodes[5].childNodes[3].value
      }
      title.classList.add('showtitle')
      guide.prepend(title)
      guide.prepend(anchor)

      div.addEventListener('mouseover', showtitle)

      div.addEventListener('mouseout', hidetitle)

      steps[i].childNodes[5].childNodes[3].addEventListener('blur', updatetitle)
    }
  })()
}