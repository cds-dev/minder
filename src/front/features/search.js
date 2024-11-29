import drawGrid from "/front/utils/drawGrid.js"
import { doFetch } from "/front/utils/fetchPost.js"


export default (async () => {
  const search = async (e) => {
    e.preventDefault()
    const url = document.location.pathname

    if (e.target[0].value) {
      const body = {search: e.target[0].value}
      localStorage.setItem('search', e.target[0].value)

      try {
        await doFetch(body, url)
       .then(json => {
          document.querySelector('.total').innerHTML = json.total
          drawGrid(json.data, true)
        })
      } catch (err) {
        console.error(err)
      }
    }
  }

  const handleSearch = (() => {
    window.onload = function() {
      localStorage.removeItem('search')
      const searchBox = document.querySelector('.searchBox')
      if (searchBox) {
        document.querySelector('#searchBox').focus()

        searchBox.value = ''
        searchBox.addEventListener('submit', search)
      }
    }
  })()
})