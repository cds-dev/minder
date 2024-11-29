// #region imports
const express = require('express')
const app = express.Router()

const { getSeason } = require('../back/foods/getSeason')


const Cal = require('../db/models/calendarModel')
const F = require('../db/models/foodModel')

// #endregion


app.get('/reminders/', async (req, res) => {
  const data = await Cal.find({
    variety: 'minder',
    "minder.active": true
  })
  res.send(data)
})


app.get('/recipe/recommend/', async (req, res) => {
  const season = await getSeason()
  
  const data = await F.find({rotation: true, variety: 'recipe'}).select('name picture number _id cook number')
  .populate('cook')
  res.send(data)
})



module.exports = app