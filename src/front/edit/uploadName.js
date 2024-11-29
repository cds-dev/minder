const fixName = (e) => {
  const uplbtns = document.querySelectorAll('.fileButtons button.upload')
  uplbtns.forEach(x => {
    const value = x.previousElementSibling.value.split('\\')[2]
    const input = x.parentElement.parentElement.querySelector('input')
    input.value = value
  })
}

const uploadName = () => {
  const uplinputs = document.querySelectorAll('.fileButtons input[type="file"]')

  //fixName()
  uplinputs.forEach(x => {
    x.addEventListener('change', fixName)
  })
}

export default uploadName