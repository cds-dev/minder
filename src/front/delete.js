import menu from "/front/utils/flipMenu.js"

const del = document.querySelector('.delete')

del.addEventListener('click', async e => {
  const h1 = document.querySelector('h1')
  const id = h1.id
  const dom = h1.dataset.dom
  const url = `/delete/${dom}/${id}`


  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    console.info(`${dom} deleted successfully!`)
    window.location = `/list/${dom}/`
  })
  .catch(error => {
    console.error('There was a problem deleting:', error);
  })
})