export default (() => {
  const related = document.querySelector('.relatedItems')
  if (related && related.scrollLeftMax > related.clientWidth) {
    related.addEventListener('wheel', e => {
      e.preventDefault()
      related.scrollLeft += e.deltaY > 0 ? 100 : -100
    })
  }
})()