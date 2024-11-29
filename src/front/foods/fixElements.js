const fixElements = (e) => {
  const single = e => {}
  // all actions and ingredients
  const availableItems = [...document.querySelectorAll('#substeps option')]
  const names = availableItems.map(x => x.value)

  const active = e => {
    const index = names.indexOf(e.target.value)

    if (index + 1) {
      e.target.className = availableItems[index].dataset.cls
      e.target.dataset.ref = availableItems[index].id
      if(availableItems[index].dataset.cls == 'Food') {
        e.target.parentElement.querySelector('#amount').classList.remove('hide')
        e.target.parentElement.querySelector('#unit').classList.remove('hide')
      }
      else {
        e.target.parentElement.querySelector('#amount').value = ''
        e.target.parentElement.querySelector('#amount').classList.add('hide')
        e.target.parentElement.querySelector('#unit').value = ''
        e.target.parentElement.querySelector('#unit').classList.add('hide')
        // these two fields need to be cleared out, or you can't (-) empty fields
      }
    }
    else if (Number(e.target.value)) {
      const stepsSoFar = document.querySelectorAll('#positional')
      if(Number(e.target.value) < stepsSoFar.length) {
        e.target.className = 'Step'
      }
    }
    if(!(index + 1)) {
      e.target.parentElement.querySelector('#amount').value = ''
      e.target.parentElement.querySelector('#amount').classList.add('hide')
      e.target.parentElement.querySelector('#unit').value = ''
      e.target.parentElement.querySelector('#unit').classList.add('hide')
      // if(e.target.parentElement.querySelector('.removeStepName')) e.target.parentElement.querySelector('.removeStepName').classList.add('hide')
    }
  }


  const initial = () => {
    // ingredients that are already saved to db
    const savedIngredients = [...document.querySelectorAll('.sIngr')]
    // just the names of ingredients already in db
    const names = savedIngredients.map(x =>
      x.querySelector('.ingredientName').innerHTML
    )

    // all step/element fields on the page
    const savedElements = document.querySelectorAll('form #substep #element')
    savedElements.forEach(x => {
      x.addEventListener('input', fixElements)
      if (x.className) {
        if (x.className == 'Step') {
          // the field that contains referenced order number based on id
          const step = document.querySelector(`#step${x.dataset.ref}`)
          // referenced order number
          const order = step.querySelector('.orderNumber').innerHTML
          x.value = order
          // if(step.parentElement.querySelector('#stepName').value) {
          //   const span = document.createElement('span')
          //   span.className = 'removeStepName'
          //   span.innerHTML = step.parentElement.querySelector('#stepName').value
          //   x.parentNode.insertBefore(span, x.nextSibling)
          // }
          
        }
        if (x.className == 'Food') {
          const ingredient = x.value
          const index = names.indexOf(ingredient)
          const amount = x.parentElement.querySelector('#amount')
          const unit = x.parentElement.querySelector('#unit')
          if (index + 1) {
            amount.value = savedIngredients[index].querySelector('.ingredientAmount').innerHTML
            unit.value = savedIngredients[index].querySelector('.ingredientUnit').innerHTML
          }
        }
        // if (x.className !== 'Step') {
        //   x.parentElement.querySelectorAll('.removeStepName').forEach(x => {
        //     x.style.display = 'none'
        //   })
        // }
      }
    })
  }



  if(!e) {
    // fired from fetchDatalists so it doesn't load until all datalists are loaded
    document.addEventListener('substepsDone',initial)
  } else {
    active(e)
  }
}


export default fixElements