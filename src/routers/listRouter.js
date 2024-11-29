// #region imports
const express = require('express')
const app = express.Router()
const { ObjectID } = require('mongodb')


const { getModel } = require('../back/utils/getModel')
const { getDateList } = require('../back/utils/getDateList')
const { populate } = require('../back/utils/populate')
// #endregion


// #region MODELS:
const { Model } = require('mongoose')
const A = require('../db/models/actionModel')
const Cat = require('../db/models/utils/categoryModel')
const Cal = require('../db/models/calendarModel')
const D = require('../db/models/calendarModel')
const F = require('../db/models/foodModel')
const I = require('../db/models/itemModel')
const J = require('../db/models/utils/cronModel')
const K = require('../db/models/kanbanModel')
const L = require('../db/models/placeModel')
const M = require('../db/models/flashModel')
const P = require('../db/models/peopleModel')
const S = require('../db/models/shoppingModel')
// #endregion



// #region GET:
app.get('/list/:page?/:cat?/', async (req, res) => {
  await getData(req, res)
})
// #endregion



// #region POST:
app.post('/list/:page/:cat?/', async (req, res) => {
  await getData(req, res)
})
// #endregion



// #region HELPER:
const getData = async (req, res) => {
  // #region prep
  const page = req.params.page
  const skip = req.body.position || 0
  const cat = req.params.cat
  const MODEL = getModel(page)
  if (!MODEL) {
    req.session.message = 'App∀ not found'
    return res.redirect('/')
  }
  const limit = 50
  const query = await getQuery(page, cat)
  if (req.body.search) {
    query.name = new RegExp(req.body.search, 'i')
  }

  const search = MODEL.find(query)

  if (!page == 'story food')
  search.select('name number category picture rotation')
  search.skip(skip)
  search.limit(limit)

  await populate(search, page, false)
  // #endregion

  // #region sort switch
  switch (page) {
  case 'story':
  case 'bio':
  case 'food':
  case 'diary':
  case 'period':
  case 'stool':
  case 'measurments':
    search.sort({time: -1})
    break
  default:
    search.sort({number: -1, name: 1})
  }
  // #endregion

  // #region other sends
  const statuses = await Cat.find({statusOf: page})
  console.log(statuses.length)
  // if (page == 'item') statuses = await Cat.find({category: 'purchase'})
  // if (page == 'kanban') statuses = await Cat.find({category: 'status'})


  const submenu = await Cat.find({category: page}).sort({number: 1}).populate('sub')


  let allDates
  if (MODEL == Cal) {
    allDates = await getDateList(page, req)
  }
  else allDates = null
  // #endregion

  const data = await search.exec()

  data.forEach(x => {
    x.url = `/show/${page}/${x._id}`
    if (x.picture && x.picture.includes('/')) x.icon = false
    else x.icon = true
  })

  const total = await MODEL.countDocuments(query)

  // so it doesn't show up as undefined:
  req.params.cat = req.params.cat || ''
  const message = req.session.message
  delete req.session.message

  if(req.body.search) {
    res.send({data, total})
  }
  else if(!skip) {
    res.render('mains/list', {
      dom : page,
      message,
      total,
      data,
      statuses,
      submenu,
      allDates,
      title: `Showing all ${page}s`
    })
  } else {
    res.send(data)
  }
}




const getQuery = async (page, cat) => {
  const exclude = await Cat.findOne({name: 'politics', category: page})

  const query = {}

  switch (page) {
    case 'ingredient':
      query.variety = {
        $in: [
          page,
          'secondary'
        ]
      }
      break
    case 'bio':
      const find = ['stool', 'period', 'food', 'cramp', 'headache', 'jointache', 'chestache', 'bellyache', 'backache', 'shivers', 'measurments', 'drank']

      query.variety = {
        $in: find
      }
      break
    case 'recipe':
    case 'chef':
    case 'note':
    case 'diary':
    case 'story':
    case 'period':
    case 'stool':
    case 'minder':
    case 'measurments':
    case 'food':
    case 'store':
    case 'organization':
    case 'private':
      query.variety = page
      break
    default:
      break
  }

  const category = await Cat.findOne({name: cat})
  if (category?._id) query.category = category
  else if (exclude) {
    query.category = {
      $ne: exclude
    }
  }

  const def = await Cat.findOne({category: page, main: true})


  if (page == 'item') {
    const active = await Cat.findOne({name: 'active'})
    query.status = active._id
  } else if (page == 'kanban') {
    const progress = await Cat.findOne({name: 'progress'})
    cat = cat || def._id

    const current = await Cat.findById(cat)

    if (ObjectID.isValid(cat)
      && !def._id.equals(cat)) {
      flipDefault(def, current)
    }

    query.category = cat
    query.status = progress._id
  } else if (page == 'flash') {
    if (category?._id && !def?._id.equals(category?._id)) {
      flipDefault(def, category)
    }
    else {
      const current = await Cat.findOne({category: page, main: true})
      query.category = current._id
    }
  }

  return query
}




const flipDefault = async (def, current) => {
  def.main = false
  await def.save()
  current.main = true
  await current.save()
}
// #endregion



module.exports = app