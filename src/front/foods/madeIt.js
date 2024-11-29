const madeIt = () => {
  /** added if block cause there's no such form except on recipes */
  const form = document.querySelector('form.madeit')
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault()
      const id = e.target.id

      try {
        const response = await fetch(`/recipe/madeIt/${id}`, { method: 'POST' })
        const data = await response.json()
        try {
          document.querySelector('.titleImage .number').innerHTML = data.newValue
        } catch (err) {
          const number = document.createElement('p')
          number.classList.add('number')
          const titleImage = document.querySelector('.titleImage')
          titleImage.appendChild(number)
          number.innerHTML = data.newValue
          console.error(err)
        }
      } catch (er) {
        console.error(er)
      }
    })
  }
}

export default (() => { madeIt() })()