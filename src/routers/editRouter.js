// #region imports
const express = require('express')
const app = express.Router()
const { ObjectID } = require('mongodb')

const { getModel } = require('../back/utils/getModel')
const { getSteps } = require('../back/foods/getSteps')
const { sortData } = require('../back/utils/sortData')
const { formatDate } = require('../back/utils/formatDate')
const { populate } = require('../back/utils/populate')

const I = require('../db/models/itemModel')
// #endregion



// #region GET:
app.get('/add/:page/', async (req, res) => {
  const MODEL = await getModel(req.params.page)
  if (MODEL) {
    res.render('mains/add', {
      title: `Add new ${req.params.page}`,
      dom: req.params.page
    })
  }
})


app.get('/edit/?:page/?:id', async (req, res) => {
  const { id, page } = req.params

  if (page && (!id || !ObjectID.isValid(id))) {
    req.session.message = 'Entry not found'
    return res.redirect(`/list/${page}`)
  }

  const MODEL = await getModel(page)
  if (MODEL) {
    const search = MODEL.findById(id)

    await populate(search, page, true)

    const data = await search.exec()

    // #region related
    if (data.related && data.related.length) {
      const relatedTypes = []
      const allTypes = ['related', 'substitute', 'variant', 'pair']

      for (const r of data.related) {
        if (!relatedTypes.includes(r.category)) {
          relatedTypes.push(r.category)
        }
      }

      allTypes.forEach(x => {
        if(!relatedTypes.includes(x)) {
          data.related.push({
            item: '',
            category: x
          })
        }
      })

      // #region old recipes that contained ingredients w/o steps, need this fix...
      if(data.steps && !data.steps.length && data.ingredients) {
        data.steps = []
        data.steps[0] = {}
        data.steps[0].elements = []
        data.ingredients.forEach(x => {
          const element = {
            element: x.ingredient._id,
            elementRef: 'F'
          }
          data.steps[0].elements.push(element)
        })
      }
      // #endregion
    }
    // #endregion

    // #region
    switch (page) {
      case 'recipe':
        await getSteps(id, data)
        break
      case 'ingredient':
        const item = await I.findOne({name: data.name}).populate('stores.store')
        break
      default:
        break
    }
    // #endregion


    res.render('mains/edit', {
      dom : page,
      title: `Editing ${data.name}`,
      data
    })
  }
  
})
// #endregion



// #region POST:
app.post('/add/?:page/', async (req, res) => {
  const page = req.params.page
  const id = req.params.id
  const MODEL = await getModel(page)

  if (MODEL) {
    const unsaved = await sortData(req.body, id, page)
    const data = await new MODEL(unsaved)

    await data.save()

    res.send(data)
  }
})

app.post('/edit/?:page/?:id', async (req, res) => {
  // #region prep
  const { id, page } = req.params

  if (page && (!id || !ObjectID.isValid(id))) {
    req.session.message = 'Entry not found'
    return res.redirect(`/list/${page}`)
  }
  // #endregion

  const data = await sortData(req.body, id, page)


  await data.save()

  res.send(data)
})
// #endregion




module.exports = app