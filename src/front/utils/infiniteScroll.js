import drawGrid from "/front/utils/drawGrid.js"
import { doFetch } from "/front/utils/fetchPost.js"


export default (() => {
  if (document.URL.includes('list')) {
    let isFetching = false
    const handleScroll = async e => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200 && !isFetching) {
        isFetching = true
        const body = {}

        body.search = localStorage.getItem('search')

        const position = document.querySelectorAll('.itemCard')
        body.position = position.length
        await fetch(document.URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })
        .then(json => {
          if (json?.data?.length) drawGrid(json.data, false)
          else if (!json.data) drawGrid(json, false)
        })
        .catch(error => {
          console.error('There was a problem fetching:', error)
        })
        .finally(() => {
          isFetching = false
        })
      }
    }

    window.addEventListener('scroll', handleScroll)
  }
})()