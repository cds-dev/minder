const openItems = elements => {
  elements.forEach(x => {
    x.style.display = "inline-block"
    // x.children[0].style.color = '#f2a61d'
    x.children[0].classList.remove('pinkBorder')
    x.children[0].classList.remove('colorPink')
  })
}

export default (() => {
  // * means: "anywhere in style attr"
  //const mainItems = document.querySelectorAll('.submenu a:not([style*="display: none"])')

  // find category from page url
  const cat = document.URL.split('/')[document.URL.split('/').length - 1]
  // find submenu item that coresponds to category
  const active = document.querySelector(`[title="${cat}"] span`)

  const position = []

  if (active) {
    active.classList.add('active')
    const target = active?.parentElement.dataset?.hidden
    if (target) {
      position.push(target)
      openItems(document.querySelectorAll(`.submenu a[data-hidden="${target}"]`))
    }

    openItems(document.querySelectorAll(`.submenu a[data-hidden="${cat}"]`))
  }

  
})()