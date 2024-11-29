const rate = async e => {
  e.preventDefault()
  const rating = e.target.className
  const flashCard = document.querySelector('.flashCard')
  const id = flashCard.id
  const data = {
    rating,
    id
  }
  const url = `/flash/rate/`
  try {
    await fetch(url, {
      method: 'POST',
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
      const grade = document.querySelector('.grade')
      grade.innerHTML = json.data
    })
  } catch (err) {
    console.error(err)
  }
}


const getAnswer = async e => {
  e.preventDefault()
  const id = e.target.parentElement.parentElement.id
  const url = `/flash/answer/${id}`

  const response = await fetch(url)
  const data = await response.json()

  const answer = document.querySelector('.answerMe')
  answer.classList.remove('hide')
  if(data.data.length == 1) {
    answer.prepend(data.data[0].answer)
  }
  
  e.target.children[0].disabled = true
}


export default (() => {
  const showanswer = document.querySelector('.showanswer')

  if (showanswer) {
    showanswer.addEventListener('submit', getAnswer)

    const more = document.querySelector('.more')
    const fewer = document.querySelector('.less')
    more.addEventListener('submit', rate)
    fewer.addEventListener('submit', rate)
  }
})()