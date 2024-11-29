const markCheckboxes = number => {
  const labels = document.querySelectorAll('.keepFor div label')


  for (let i = labels.length - 1; i >= 0; i--) {
    if (number >= Number(labels[i].innerHTML)) {
      labels[i].previousElementSibling.checked = true
      number -= labels[i].innerHTML
      if (number > 0) markCheckboxes(number)
    }
  }
}

const keepFor = (() => {
  const keepFor = Number(document.querySelector('.keepFor')?.dataset?.keepfor)

  if (keepFor) markCheckboxes(keepFor)
})()

export default keepFor