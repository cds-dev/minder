const stepNumbers = () => {
  const references = document.querySelectorAll('.stepReference')

  references.forEach(x => {
    const stepNo = x.dataset.find
    const step = document.getElementById(stepNo)
    const stepRef = x.querySelector('.stepRef')
    const insertStepName = x.querySelector('.insertStepName')
    const stepName = step.querySelector('.stepName')
    insertStepName.innerHTML = stepName.innerHTML
    stepRef.innerHTML = step.dataset.step
  })
}

export default (() => { stepNumbers() })()