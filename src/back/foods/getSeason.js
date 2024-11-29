const getSeason = async () => {
  const date = new Date()
  const month = date.getMonth()
  let current
  if(month >= 2 && month <= 4) {
    current = 'spring'
  }
  else if(month >= 5 && month <= 7) {
    current = 'summer'
  }
  else if(month >= 8 && month <= 10) {
    current = 'fall'
  }
  else {
    current = 'winter'
  }
  //const a = await Cat.findOne({name: current})
}



module.exports = {
  getSeason
}