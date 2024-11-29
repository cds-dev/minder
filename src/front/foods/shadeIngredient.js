const shadeIngredient = e => {
  const pic = e.target.parentElement.querySelector('img')
  
  if([...e.target.classList].includes('slideleft')) {
    e.target.style.left = 0
    e.target.style.right = 'initial'
    e.target.classList.toggle('slideleft')
    pic.style.filter = 'grayscale(100%)'
    pic.classList.toggle('shadePic')
  }
  else if(e.target.style.left == '0px') {
    e.target.style.left = 'initial'
    e.target.style.right = 0
    e.target.classList.toggle('slideleft')
    pic.classList.toggle('shadePic')
    pic.style.filter = ''
  } 
}

const handleClick = () => {
  const ingredients = document.querySelectorAll('.ingredientAmounts')

  ingredients.forEach(x => x.addEventListener('click', shadeIngredient))
}

export default (() => { handleClick() })()