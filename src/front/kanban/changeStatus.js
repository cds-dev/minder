const changeStatus = async e => {
  e.preventDefault()
  const newStatus = e.target.dataset.id

  const status = document.querySelector('.greenDot')
  status.remove()
  const parent = e.target.parentElement
  parent.prepend(status)

  const current = window.location.pathname

  const data = {current}

  const dom = current.split('/')[2]

  const url = `/status/${dom}/${newStatus}`
  console.log(url)

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    return response.json()
  })
  .then(json => {
    //window.location = `/recipe/show/${json._id}`
    return json
  })
  .catch(error => {
    console.error("Error:", error)
  })
}

export default (() => {
    // if (document.querySelector('.showonekanban') || document.querySelector('.showoneitem')) {
    if (document.querySelector('.statuses')) {
      const btns = document.querySelectorAll('.submenu form')

      btns.forEach(x => {
        x.addEventListener('click', changeStatus)
      })
    }
})()