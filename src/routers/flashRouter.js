// #region IMPORTS
const express = require('express')
const mongoose = require('../db/mongoose')
const Flash = require('../db/models/flashModel')
const Cat = require('../db/models/utils/categoryModel')


const { formatDate } = require('../back/utils/formatDate')


const app = express.Router()
const dom = 'flash'
// #endregion




// #region HELPER:s
app.get('/study/', async (req, res) => {
  //show all dates in the past or today and
  // for said category...
  Flash.find({
    date: { $lte: getStartOfToday() }
  })
  .then(docs => {
  })
  .catch(err => {
    console.error('Error:', err)
  })

  const all = await Flash.find()
  .populate('category')

  const submenu = await Cat.find({category: 'flash'})

  const rand = Math.floor(Math.random() * all.length)
  const data = all[rand]
  res.render('utils/study', {
    dom, title: 'Study session', submenu,
    data
  })
})
// #endregion


// #region FETCH:
app.post(`/study/rate/`, async (req, res) => {
  // super memo 2 algorithm
  // https://en.wikipedia.org/wiki/SuperMemo
  const { rating, id } = req.body
  const card = await Flash.findById(id)
  const date = new Date()

  if(rating == 'more' && card.grade < 5) {
    card.grade++
  }
  if (rating == 'less' && card.grade > 0) {
    card.grade--
  }

  card.easynessFactor = card.easynessFactor + (0.1 - (5 - card.grade) * (0.08 + (5 - card.grade) * 0.02))
  if(card.easynessFactor < 1.3) {
    card.easynessFactor = 1.3
  }

  if(card.grade >= 3) {
    if(card.number = 0) {
      card.interval = 1
    }
    else if (card.number = 1) {
      card.interval = 6
    }
    else {
      card.interval = Math.round(card.interval * card.easynessFactor)
    }
    card.number++
  }
  else {
    card.number = 0
    card.interval = 1
  }

  card.date = new Date(date.setDate(date.getDate() + card.interval))

  await card.save()
  res.send({data: card.grade})
})

app.get('/study/answer/:id', async (req, res) => {
  const answer = await Flash.findById(req.params.id)
  res.send({data: answer.details})
})
// #endregion




// #region HELPER:
// this is for study route
const getStartOfToday = () => {
  const today = new Date()
  //today.setHours(0, 0, 0, 0)
  return today
}
// #endregion




module.exports = app