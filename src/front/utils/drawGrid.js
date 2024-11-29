const drawGrid = (data, overwrite) => {
  const wrapper = document.querySelector('.displayGrid')
  const dom = document.location.pathname[1]

  if (overwrite) {
    wrapper.innerHTML = ''
  }

  for (const i in data) {
    const itemCard = document.createElement('div')
    itemCard.classList.add('itemCard')
    if(overwrite) {
      itemCard.tabIndex = i + 1
    }

    const anchor = document.createElement('a')
    anchor.title = data[i].name || data[i].variety
    anchor.href = data[i].url
    itemCard.append(anchor)

    const itemName = document.createElement('div')
    itemName.classList.add('itemName')
    itemName.classList.add('ellipsis')
    if (data[i].name) {
      itemName.innerHTML = data[i].name
    } else if (data[i].notes) {
      itemName.classList.add('notesInsteadOfName')
      itemName.innerHTML = data[i].notes[0]
    } else {
      itemName.innerHTML = data[i].variety
    }
      anchor.append(itemName)

    if (data[i].variety == 'stool') {
      const img = document.createElement('img')
      img.src = `/imgs/diary/${data[i].stool.shape}.png`
      img.alt = 'sample'
      anchor.append(img)
      itemName.innerHTML = `${data[i].date}`
    } else if (data[i].variety == 'food') {
      const img = document.createElement('img')
      img.src = data[i].food.picture
      img.alt = data[i].food.name
      anchor.append(img)
      itemName.innerHTML = `${data[i].date} ${data[i].food.name}`
      // TODO: name and date and border
    } else if (data[i].variety == 'measurments') {
      const img = document.createElement('img')
      img.src = '/imgs/measurments.svg'
      img.alt = 'measurments'
      anchor.append(img)
      itemName.innerHTML = `${data[i].date} measurments`
    } else if (data[i].variety == 'period') {
      itemName.innerHTML = `${data[i].date} period`
    } else {
      if (data[i].picture && data[i].picture.includes('/')) {
        const img = document.createElement('img')
        img.src = data[i].picture
        img.alt = data[i].name
        anchor.append(img)
      } else {
        if (data[i].variety && itemName.innerHTML == '') {
          itemName.innerHTML = `${data[i].variety}`
        }
        const img = document.createElement('span')
        img.classList.add('icons')
        img.classList.add(data[i].picture)
        img.classList.add(data[i].variety)
        img.classList.add('iconCard')
        anchor.append(img)
      }
    }

    if (data[i].number) {
      const made = document.createElement('div')
      made.classList.add('made')
      let check = ''
      if (data[i].rotation) { check = '✔ ' }
      made.innerHTML = `${check}${data[i].number}`
      anchor.append(made)
    }

    wrapper.append(itemCard)

    if (data[i].cook && dom !== 'chef') {
      const cookWrapper = document.createElement('div')
      cookWrapper.classList.add('cookWrapper')
      itemCard.append(cookWrapper)

      const anc = document.createElement('a')
      anc.href = `/show/chef/${data[i].cook._id}`
      anc.title = data[i].cook.name
      cookWrapper.append(anc)

      const img = document.createElement('img')
      img.src = data[i].cook.picture
      img.alt = data[i].cook.name
      anc.append(img)
    }

    
  }
}

export default drawGrid