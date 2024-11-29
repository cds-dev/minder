const checkInput = e => {
  const inputValue = e.target.value

  if (inputValue) {
    const list = e.target.list.id
    const correctValues = document.querySelectorAll(`#${list} option`)

    if(correctValues.length) {
      const correct = [...correctValues].some(x => {
        return x.value == inputValue
      })
      if(correct) {
        e.target.classList.remove('wrongInput')
      }
      if(!correct) {
        e.target.classList.add('wrongInput')
      }
    }
  }

  if(Number(inputValue) && document.URL.includes('recipe') && e.target.id == 'element') {
    e.target.classList.remove('wrongInput')
  } else if (!inputValue) {
    e.target.classList.remove('wrongInput')
  }
}

const wrongInputs = () => {
  const checks = document.querySelectorAll('input[list]')


  checks.forEach(x => {
    x.addEventListener('blur', checkInput)
  })

  
}

export default wrongInputs