import { doFetch } from "/front/utils/fetchPost.js"


const drawToday = data => {
  const item = document.createElement('div')
  item.classList.add('item')
  item.classList.add('relativize')

  const itemList = document.querySelector('.relatedItems')
  itemList.prepend(item)

  console.log(data)


  const anchor = document.createElement('a')
  item.appendChild(anchor)
  const img = document.createElement('img')

  const itemCard = document.createElement('div')
  itemCard.classList.add('itemCard')
  anchor.appendChild(itemCard)

  if (data.icon) {
    const icon = document.createElement('span')
    icon.classList.add('icons')
    icon.classList.add(data.variety)
    icon.classList.add('iconCard')
    itemCard.appendChild(icon)
  } else {
    img.src = data.picture
    img.alt = data.name || data.variety
    itemCard.appendChild(img)
  }
  if ( data.variety == 'diary' || data.variety == 'story' ) {
    anchor.href = `/show/${data.variety}/${data._id}`
  }
  else if ( data.variety == 'food') {
    anchor.href = `/show/${data.food.variety}/${data.food._id}`
    img.src = data.food.picture
    img.alt = data.food.name
    img.style.width = '8rem'
    img.style.height = '8rem'

    const itemName = document.createElement('div')
    itemName.classList.add('itemName')
    itemName.innerHTML = data.food.name
    itemCard.appendChild(itemName)
  }
  if (data.name) {
    //
  } else if (data.notes && !data.food) {
    const iconNote = document.createElement('div')
    iconNote.classList.add('iconNote')
    iconNote.innerHTML = data.notes[0]
    anchor.appendChild(iconNote)
  }
}


const quickRun = async e => {
  e.preventDefault()
  const body = {}
  let url = e.target.attributes.action.value
  if ( url == '/diary/submit/food' ) {
    const data = e.target.querySelector('#fooddiary').value
    body.food = data
  } else if ( url == '/diary/submit/diary' ) {
    const diary = document.querySelector('.diaryForm')
    const text = diary.querySelector('textarea')
    const story = diary.querySelector('#story').checked
    if (story) url = '/diary/submit/story'
    body.notes = text.value

    text.value = ''
  } else if ( url == '/diary/submit/measurments' ) {
    body.weight = document.querySelector('#weight').value
    body.arm = document.querySelector('#arm').value
    body.chest = document.querySelector('#chest').value
    body.waist = document.querySelector('#waist').value
    body.hhip = document.querySelector('#hhip').value
    body.lhip = document.querySelector('#lhip').value
    body.leg = document.querySelector('#leg').value

    document.querySelector('.measModalContainer').style.display = 'none'
  }
  
  const data = await doFetch(body, url)

  drawToday(data)
}


const loadMeasures = e => {
  e.preventDefault()

  const measurmentsWrapper = document.querySelector('.measModalContainer')
  const modal = document.querySelector('.measurmentsWrapper')
  
  document.addEventListener('click', e => {
    if (!modal.contains(e.target)) {
      measurmentsWrapper.style.display = 'none'
    }
  })

  measurmentsWrapper.style.display = 'grid'
  measurmentsWrapper.style.position = 'fixed'
  measurmentsWrapper.style.width = '100cqw'
  measurmentsWrapper.style.height = '100cqh'
  measurmentsWrapper.style.inset = '0'
  measurmentsWrapper.style.display = 'flex'
  measurmentsWrapper.style.justifyContent = 'center'
  measurmentsWrapper.style.background = '#dc143c42'
  measurmentsWrapper.style.paddingBlock = '1rem'
}



export default (() => {
  const run = document.querySelector('.mydiary')
  if (run) {
    const diary = (() => {
      const quick = document.querySelectorAll('form.qdiary')

      quick.forEach(x => {
        x.addEventListener('submit', quickRun)
      })


      const measurments = document.querySelector('.loadQMeasurments')

      measurments.addEventListener('submit', loadMeasures)
    })()
  }
})()