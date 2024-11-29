// #region
const express = require('express')
const app = express.Router()
// #endregion


// #region models
const Cal = require('../db/models/calendarModel')
const F = require('../db/models/foodModel')

// #endregion


app.get('/diary/', async (req, res) => {
  const today = new Date()
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

  const query = {
    time: {
      $gte: startOfDay,
      $lt: endOfDay
    }
  }

  const data = await Cal.find(query).sort({_id: -1})
  .populate('food')

  data.forEach(x => {
    if (x.picture && x.picture.includes('/')) x.icon = false
    else x.icon = true
  })

  const allDates = await Cal.distinct('date')
  const recipes = await F.find()
  res.render('features/diary', {total: data.length, dom: 'diary', data, title: 'Diary app', allDates, recipes})
})


module.exports = app