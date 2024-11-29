// #region IMORTS
const express = require('express')
const mongoose = require('../db/mongoose')
const { ObjectID } = require('mongodb')

const F = require('../db/models/foodModel')
const Cal = require('../db/models/calendarModel')
const Cat = require('../db/models/utils/categoryModel')
const C = require('../db/models/cuisineModel')
const Ppl = require('../db/models/peopleModel')
const A = require('../db/models/actionModel')

const app = express.Router()


// HELPER:s
const { getSingleFoodData } = require('../back/foods/getSingleFoodData')
const { formatDate } = require('../back/utils/formatDate')
const { sortData } = require('../back/utils/sortData')
const { fixRelatedRecipes } = require('../back/foods/fixRelatedRecipes')
const { imageResize } = require('../back/utils/imageResize')

// const cacheMiddleware = require('../back/utils/cacheMiddleware')

// #endregion


const dom = 'recipe'



// #region HELPER: GET:
// app.get('/recipe/cuisineless', async (req, res) => {
//   const data1 = await F.find({cuisine: "63d9078863025583ba873410"})
//   const data2 = await F.find({cuisine: { $exists: false }})

//   const data = [...data1, ...data2]

//   return res.render('mains/list/index', {
//     title: `All recipes lacking cuisine`, total: data.length, dom, data
//   })
// })



app.get('/recipe/scavenge/', async (req, res) => {
  const ingredients = await F.find().select('name picture _id').sort({number: -1, name: 1})
  res.render('utils/raid', {title: "Scavenge the fridge", ingredients})
})



// #endregion


// #region HELPER: POST:





// TODO:
app.post('/recipe/raid/', async (req, res) => {
  const recArray = []
  const weightArray = []
  for(const id of req.body) {
    const rec = await Recipe.find({'ingredients.ingredient': id})
    rec.forEach(x => {
      const test = recArray.some(item => item._id.toString() === x._id.toString())
      if(test) {
        const index = recArray.findIndex(item => item._id.toString() === x._id.toString())
        weightArray[index] = weightArray[index] + 1
      }
      else {
        recArray.push(x)
        weightArray.push(1)
      }
    })
  }
  const totalArray = recArray.map((r, index) => ({ r, weight: weightArray[index] }))

  totalArray.sort((a, b) => b.weight - a.weight)

  const sortedRec = totalArray.map(itemObj => itemObj.r)
  const sortedWeights = totalArray.map(itemObj => itemObj.weight)

  res.send({sortedRec, sortedWeights})
})


// app.post('/recipe/linkUsed/', async (req, res) => {
//   const r = await F.findOne({site: req.body.url})
//   if(r) {
//     res.send(true)
//   }
//   else res.send(false)
// })
// #endregion



// #region FETCH: data 

// #endregion


module.exports = app