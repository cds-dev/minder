import uploadName from "/front/edit/uploadName.js"

const uploadButton = (() => {
  const btns = document.querySelectorAll('.fileButtons .upload')

  btns.forEach(btn => {
    btn.addEventListener('click', e => {
      const input = btn.previousElementSibling
      input.click()

      uploadName()
    })
  })
})()

export default uploadButton