const getData = async url => {
  const response = await fetch(url)
  const data = await response.json()
  return data
}

const select = (response, number) => {
  const data = []
  const selected = []

  const weights = []
  let weight = 0



  for (let i = 0; i < response.length; i++) {
    if (!response[i].number) response[i].number = 0
    weight += (response[i].number + 1)
    weights.push(weight)
  }


  const find1 = () => {
    const findWeight = Math.floor(Math.random() * weight)
    let index = 0

    for (let wIndex = 0; wIndex < weights.length; wIndex++) {
      if(weights[wIndex] >= findWeight) {
        index = wIndex
        break
      }
    }

    if (data.includes(index)) {
      find1()
    }
    else {
      data.push(index)
      selected.push(response[index])
    }
    if (data.length < number) find1()
    else { return }
  }
  find1()
  return selected
}

const choose = (async () => {
  const dice = document.querySelector('.dice')
  const number = document.querySelectorAll('.singleChoice').length

  const url = `/${document.querySelector('.switcherBox ').dataset.dom}/recommend/`

  const response = await getData(url)

  const roll = () => {
    const spinner = document.querySelectorAll('.recipeSpinner > div')

    const data = select(response, number)

    for (let i = 0; i < number; i++) {
      // #region anchor
      spinner[i].children[0].href = `/show/recipe/${data[i]._id}`
      // #endregion

      // #region picture
      spinner[i].children[0].children[0].alt = data[i].name
      spinner[i].children[0].children[0].src = data[i].picture
      spinner[i].children[0].children[0].classList.add('recomendRecipePic')
      // #endregion

      // #region texts
      spinner[i].children[0].children[1].innerHTML = data[i].name
      if (data[i].number) {
        spinner[i].children[0].children[2].innerHTML = data[i].number
        spinner[i].children[0].children[2].style.display = 'flex'
      } else {
        spinner[i].children[0].children[2].style.display = 'none'
      }
      
      // #endregion

      if(data[i].cook) {
        spinner[i].children[0].children[3].children[0].alt = data[i].cook.name
        spinner[i].children[0].children[3].children[0].src = data[i].cook.picture
        spinner[i].children[0].children[3].style.display = 'unset'
      } else {
        spinner[i].children[0].children[3].style.display = 'none'
      }
    }
  }

  roll()
  dice.addEventListener('click', roll)
})()

export default choose