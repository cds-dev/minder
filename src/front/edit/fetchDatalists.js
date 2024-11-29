const doFetch = async () => {
  const dom = window.location.pathname.split('/')[2]
  const url = `/datalists/${dom}/`
  const response = await fetch(url)
  const data = await response.json()
  return data
}


export default (async () => {
  const datalists = document.querySelectorAll('datalist')

  if(datalists.length) {
    const data = await doFetch()

    datalists.forEach(x => {
      if(data[x.id]) {
        data[x.id].forEach(opt => {
          const optEl = document.createElement('option')
          optEl.value = opt.name
          optEl.id = opt._id
          optEl.dataset.cls = opt.category
          x.appendChild(optEl)
        })
      } else {
        const substepsDone = new CustomEvent('substepsDone', { })
        document.dispatchEvent(substepsDone)
      }
    })
  }
})()