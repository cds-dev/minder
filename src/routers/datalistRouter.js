// #region
const express = require('express')
const app = express.Router()



const { getModel } = require
('../back/utils/getModel')
const { ObjectID } = require('mongodb')
const A = require('../db/models/actionModel')
const C = require('../db/models/cuisineModel')
const Cat = require('../db/models/utils/categoryModel')
const F = require('../db/models/foodModel')
const L = require('../db/models/placeModel')
const P = require('../db/models/peopleModel')
// #endregion



// #region FETCH:
app.get('/datalists/:page', async (req, res) => {
  const page = req.params.page
  const categories = await Cat.find({category: page}).sort({name: 1}).select('name')
  const cook = await Cat.findOne({name: 'chef'})

  let cooks
  let seasons
  let cuisines
  let foods
  let ingredients
  let actions
  let places
  const substeps = []

  switch (page) {
    case 'recipe':
      cooks = await P.find({variety: 'chef'}).sort({name: 1}).select('name')
    
      seasons = await Cat.find({category: 'season'}).sort({name: 1}).select('name')
      cuisines = await C.find({}).sort({name: 1}).select('name')
    
      foods = await F.find({}).sort({name: 1}).select('name')

      ingredients = await F.find({ variety: { $in: ['ingredient', 'secondary'] } }).sort({name: 1}).select('name number')
      actions = await A.find({}).sort({name: 1}).select('name number')

      ingredients.forEach (x => {
        current = {
          _id: x._id,
          name: x.name,
          number: x.number,
          category: 'Food'
        }
        substeps.push(current)
      })
      actions.forEach (x => {
        current = {
          _id: x._id,
          name: x.name,
          number: x.number,
          category: 'Action'
        }
        substeps.push(current)
      })
      substeps.sort((a, b) => b.number - a.number)
      break
    case 'ingredient':
      foods = await F.find({variety : {
        $in: [
          page,
          'secondary'
        ]
      }}).sort({number: -1}).select('name')
      break
    case 'chef':
      cooks = await P.find({category: cook._id}).sort({name: 1}).select('name')
      break
    case 'minder':
      const bnm = await Cat.findOne({name: 'brick & mortar'})
      const mixed = await Cat.findOne({name: 'mixed'})
      places = await L.find({category: {
        $in: [
          bnm._id,
          mixed._id
        ]
      }})
      break
    default:
      break
  }

  const measurements = await Cat.find({category: "measurement"}).sort({name: 1})



  const stores = await L.find({ variety: 'store'}).sort({name: 1})//.select('name number')

  

  const data = {
    categories,
    cooks,
    seasons,
    cuisines,
    foods,
    measurements,
    actions,
    ingredients,
    substeps,
    stores,
    places
  }

  res.send(data)
})
// #endregion



module.exports = app