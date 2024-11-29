import { handleClick } from "/front/utils/flipMenu.js"


const shortcuts = e => {
  const dom = window.location.pathname.split('/')[2]
  const crud = window.location.pathname.split('/')[1]
  const id = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1]

  

  const url = document.URL
  if (url.includes('list') || url.includes('show') ) {
    if(e.key == '+') {
    window.location = `/add/${dom}/`
  }
  }
  if (e.key == '\\') {
    handleClick()
  }
  else if (crud == 'show') {
    if (e.key == '*' && id) {
      window.location = `/edit/${dom}/${id}`
    }
    // else if (e.key == 'x') {
    //   window.location = `/delete/${dom}/${id}`
    // }
    
  } else if (crud == 'list') {}
  else if (crud == 'add') {}
  else if (crud == 'edit') {}
}


const runShortcuts = (() => {
  document.addEventListener('keyup', shortcuts)

  const search = document.querySelector('#searchBox')
  if(search) search.removeEventListener('keyup', shortcuts)
})()

export default runShortcuts