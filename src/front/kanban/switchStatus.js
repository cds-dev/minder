// on list page, moves the dot and changes the displayed ideas

const switchStatus = async e => {
  e.preventDefault()
  const status = e.target.dataset.id

  const dom = document.URL.split('/')[document.URL.split('/').length - 2]
  const url = `/status/${dom}/${status}`

  const greenDot = document.querySelector('.greenDot')
  greenDot.remove()

  e.target.parentElement.prepend(greenDot)

  const response = await fetch(url)
  const data = await response.json()

  const total = document.querySelector('.total')
  total.innerHTML = `${data.length}`

  const displayGrid = document.querySelector('.displayGrid')

  const close = displayGrid.querySelectorAll('.itemCard')
  close.forEach(x => {
    x.remove()
  })

  for(const d in data) {
    const itemCard = document.createElement('div')
    itemCard.classList.add('itemCard')
    itemCard.tabIndex = d + 1
    itemCard.draggable = true

    const anchor = document.createElement('a')
    anchor.href = `/show/${dom}/${data[d]._id}`
    itemCard.appendChild(anchor)


    if(dom == 'kanban') {
      const span = document.createElement('span')
      span.classList.add('icons')
      span.classList.add('iconCard')
      span.classList.add(`${data[d].picture}`)
      anchor.appendChild(span)
    }
    else {
      const pic = document.createElement('img')
      pic.src = data[d].picture
      pic.alt = data[d].name
      anchor.appendChild(pic)
    }


    const itemName = document.createElement('div')
    itemName.classList.add('itemName')
    itemName.innerHTML = data[d].name
    anchor.appendChild(itemName)

    if (data[d].number) {
      const made = document.createElement('div')
      made.className = 'made'
      made.innerHTML = data[d].number
      anchor.appendChild(made)
    }

    const itemStatus = document.createElement('div')
    itemStatus.classList.add('itemStatus')
    itemStatus.classList.add('icons')
    itemStatus.classList.add(`${data[d].status.picture}`)
    
    anchor.appendChild(itemStatus)


    displayGrid.appendChild(itemCard)
  }
}


export default (() => {
  if(document.querySelector('.statusMenu')) {
    const statuses = document.querySelectorAll('.statusMenu form')
    statuses.forEach(x => {
      x.addEventListener('click', switchStatus)
    })
  }
})()