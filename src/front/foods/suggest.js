// puts a recipe into rotation, or removes it... 
const suggest = () => {
  const form = document.querySelector('form.suggestion')
  if (form) {
    form.addEventListener('change', async e => {
      const id = e.target.parentElement.id

      try {
        const response = await fetch(`/recipe/suggest/${id}`, { method: 'POST' })
        const data = await response.json()
        e.target.checked = data
      } catch (err) {
        console.error(err)
      }
    })
  }
}



export default (() => { suggest() })()