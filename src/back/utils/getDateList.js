const Cal = require('../../db/models/calendarModel')
const Cat = require('../../db/models/utils/categoryModel')



const getDateList = async (page, req) => {
  //console.info('getDateList called')
  //console.info('Request headers:', req.headers)
  //console.info('Referer', req.referer)
  //console.info('Request params:', req.params)
  if (!req.params == {}) return
  else {
    const query = {}
    switch (page) {
      case 'food':
        page = 'fooddiary'
      case 'story':
      case 'diary':
      case 'period':
      case 'stool':
      case 'measurments':
        const cat = await Cat.findOne({ name: page })
        query.variety = cat._id
        break
      case 'bio':
        //TODO:
        break
      default:
        break
    }
    const data = await Cal.find(query)
    const allDates = await Cal.find(query).distinct('date')
    return allDates
  }
  
}

module.exports = {
  getDateList
}