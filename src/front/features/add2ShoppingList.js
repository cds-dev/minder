import { doFetch } from "/front/utils/fetchPost.js"


const listIt = async e => {
  const element = e.target.parentElement
  const hasDot = element.querySelector('.redDot')
  if (hasDot) {
    hasDot.remove()
  } else {
    addDot(element)
  }
  const selectedElements = document.querySelectorAll('.addToList .selectItem .redDot')
  const data = []
  data.push(document.location.pathname)
  const url = `/shoppingList/`
  selectedElements.forEach(x => {
    data.push(x.parentElement.dataset.select)
  })
  const res = await doFetch(data, url)
  console.log(res)
}

const addDot = el => {
  const dot = document.createElement('span')
  dot.classList.add('redDot')
  el.appendChild(dot)
}

// preselected
const markSelected = () => {
  const preselected = document.querySelectorAll('.pre-name')
  preselected.forEach(x => {
    const target = document.querySelector(`[data-select="${x.dataset.id}"]`)

    addDot(target)
  })
}

// close list
document.addEventListener('click', e => {
  const list = document.querySelector('.addToList')
  const modal = document.querySelector('.selectList')
  if (!modal.contains(e.target)) {
    list.style.display = 'none'
  }
})

const openList = e => {
  e.preventDefault()
  e.stopPropagation()
  const list = document.querySelector('.addToList')
  const modal = document.querySelector('.selectList')

  list.style.display = 'flex'
}

const add2SL = (() => {
  const cart = document.querySelector('.cart')
  const lists = document.querySelectorAll('.selectItem')

  if (cart) {
    cart.addEventListener('click', openList)
    markSelected()
  }

  if (lists) {
    lists.forEach(x => {
      x.addEventListener('click', listIt)
    })
  }

})()


export default add2SL