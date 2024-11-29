const killThisMinder = async e => {
  e.preventDefault()
  const id = e.target.parentElement.childNodes[1].dataset.id
  e.target.parentElement.parentElement.removeChild(e.target.parentElement)
  await fetch (`/deactivate/minder/${id}`, {
    method: 'POST'
  })
}

const snoozThisMinder = e => {
  e.preventDefault()
}

export default (async () => {
  const data = await fetch('/reminders/')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  })
  
  .catch(error => {
    console.error('There was a problem deleting:', error);
  })

  if(data.length) {
    const mindersWrapper = document.createElement('div')
    mindersWrapper.classList.add('mindersWrapper')

    data.forEach(x => {
      const minderControls = document.createElement('div')
      minderControls.classList.add('minderControls')
      mindersWrapper.appendChild(minderControls)
      const minder = document.createElement('a')

      const killMinder = document.createElement('form')
      killMinder.classList.add('killMinder')
      minderControls.appendChild(killMinder)

      const killBtn = document.createElement('button')
      killBtn.classList.add('killBtn')
      killBtn.innerHTML = 'X'
      killMinder.appendChild(killBtn)
      killMinder.addEventListener('submit', killThisMinder)

      minder.href = x.site
      if (x.minder.type == 'urlmonitor') {
        minder.target = '_blank'
      }
      minder.classList.add('reminder')
      minder.classList.add('ellipsis')
      minder.dataset.id = x._id
      minderControls.appendChild(minder)

      const pic = document.createElement('img')
      pic.src = x.picture
      pic.alt = x.name
      pic.style.width = '3rem'
      minder.appendChild(pic)
      
      const text = document.createElement('div')
      minder.appendChild(text)

      const title = document.createElement('div')
      title.classList.add('minderTitle')
      title.innerHTML = x.name
      text.appendChild(title)

      const desc = document.createElement('div')
      desc.classList.add('minderDesc')

      if(x.minder.diff.length) {
        const translate = document.createElement('div')
        translate.innerHTML = x.minder.diff[0].value

        desc.innerHTML = translate.innerText
      }
      else {
        desc.innerHTML = x.minder.type
      }
      text.appendChild(desc)

      const snoozeMinder = document.createElement('form')
      snoozeMinder.classList.add('snoozeMinder')
      minderControls.appendChild(snoozeMinder)

      const snzBtn = document.createElement('button')
      snzBtn.classList.add('snzBtn')
      snzBtn.innerHTML = 'Z'
      snoozeMinder.appendChild(snzBtn)
      snoozeMinder.addEventListener('submit', snoozThisMinder)
    })

    document.body.appendChild(mindersWrapper)
  }
})()