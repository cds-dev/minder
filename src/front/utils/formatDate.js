const formatDate = (() => {
  const dates = document.querySelectorAll('.formatDate')
  dates.forEach(x => {
    const date = new Date(x.dataset.date)
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    x.innerHTML = `${day}/${month}/${year}`
  })
})()


export default formatDate