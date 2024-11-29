const formatDate = (date) => {
  // const today = new Date()
  if (!date) date = new Date()
  return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear().toString()}`
}

module.exports = {
  formatDate
}