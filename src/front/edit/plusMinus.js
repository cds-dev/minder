// #region imports
import stepJumper from "/front/utils/stepJumper.js"
import timeUnits from "/front/foods/timeUnits.js"
import wrongInputs from "/front/utils/wrongInputs.js"
import secondThat from "/front/foods/secondThat.js"
import textArea from "/front/edit/textArea.js"
import fixElements from "/front/foods/fixElements.js"


stepJumper()
const runner = () => {
  timeUnits()
  appendEventListeners()
  wrongInputs()
  secondThat()
  textArea()
}
// #endregion







const findTargetForm = el => {
  if(el.id == "positional") {
    return el
  }
  else {
    return findTargetForm(el.parentElement)
  }
}



const removeInput = e => {
  const box = findTarget(e.target.parentElement)

  const check = [...box.querySelectorAll('input'), ...box.querySelectorAll('textarea')]

  if (check.some(x => x.value !== '')) {
    alert(`can't remove this one, all fields must be empty`)
  } else {
    box.remove()
  }
}





const addElements = targetForm => {
  const newLine = document.querySelector(`#${targetForm.id}`).cloneNode(true)
  const addTo = targetForm.parentNode.insertBefore(newLine, targetForm.nextSibling)

  runner()


  if(targetForm.id == 'substep') {
    newLine.childNodes[1].addEventListener('input', fixElements)
  }
  
  if(targetForm.id == 'positional') {
    stepJumper()
    newLine.querySelectorAll('#element').forEach(x => {
      x.addEventListener('input', fixElements)
    })
  }

  if(targetForm.id === 'timePlus') {
    const pluses = targetForm.parentElement.querySelectorAll('.plus')
    if(pluses.length > 1) {
      pluses.forEach(x => {
        x.classList.add('disableBtn')
        x.removeEventListener('click', multiplyInputs)
      })
    }
  }
}



const addStep = async e => {
  const targetForm = await findTargetForm(e.target)
  addElements(targetForm)
}



const makeAStep = e => {
  if(e.key === '*') {
    e.preventDefault()
    addStep(e)
  }
}



const findTarget = el => {
  if(el.id) {
    return el
  }
  else {
    return findTarget(el.parentElement)
  }
}



const multiplyInputs = e => {
  const targetForm = findTarget(e.target.parentElement)
  addElements(targetForm)
}



const plusKeyPress = e => {
  if(e.key === '+') {
    e.preventDefault()
    multiplyInputs(e)
  }
  if(e.key === '-') {
    e.preventDefault()
  }
}



const appendEventListeners = () => {
  const pluses = document.querySelectorAll('.plus')
  const minuses = document.querySelectorAll('.minus')
  const stepses = document.querySelectorAll('.steps')
  const additives = [...pluses, ...stepses]

  const amount = document.querySelectorAll('#amount')
  const unit = document.querySelectorAll('#unit')


  // this adds all the input fields from snippets that can be duplicated into one flattened array "keyPlus"
  let keyPlus = []
  pluses.forEach(x => {
    keyPlus = [...keyPlus, ...x.parentElement.querySelectorAll('input'), ...x.parentElement.querySelectorAll('textarea'), ...amount, ...unit]
  })

  keyPlus.forEach(x => {
    x.addEventListener('keydown', plusKeyPress)
  })

  stepses.forEach(step => {
    step.parentElement.addEventListener('keydown', makeAStep)
  })

  additives.forEach(plus => {
    plus.addEventListener('click', multiplyInputs)
  })

  minuses.forEach(minus => {
    minus.addEventListener('click', removeInput)
  })
}



export default (() => {
  runner()
  fixElements()
})()




// TODO: event delegation https://www.youtube.com/watch?v=cOoP8-NPLSo