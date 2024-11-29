const textArea = () => {
  const areas = document.querySelectorAll('textarea')

  const resize = (e) => {
    areas.forEach (x => {
      x.style.height = "6rem"
      x.style.height = `${x.scrollHeight}px`
    })
  }

  if (areas.length) {
    areas.forEach(x => {
      resize(x)
      x.addEventListener('input', resize)
    })


    window.addEventListener("resize", resize)
  }
}

export default textArea