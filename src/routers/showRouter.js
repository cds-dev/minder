// #region imports
const express = require('express')
const app = express.Router()


const { getModel } = require
('../back/utils/getModel')
const { ObjectID } = require('mongodb')
const { getSteps } = require
('../back/foods/getSteps')
const { populate } = require('../back/utils/populate')
// #endregion


// #region MODELS:
// const { Model } = require('mongoose')
const A = require('../db/models/actionModel')
const Cat = require('../db/models/utils/categoryModel')
const F = require('../db/models/foodModel')
const I = require('../db/models/itemModel')
const L = require('../db/models/placeModel')
const S = require('../db/models/shoppingModel')
// #endregion




// #region GET:
app.get('/show/:page/:id?', async (req, res) => {
  const id = req.params.id
  const page = req.params.page
  if (!id || !ObjectID.isValid(id)) {
    req.session.message = 'Entry not found'
    return res.redirect(`/list/${page}/`)
  }

  const MODEL = await getModel(page)
  const search = MODEL.findById(id)


  await populate(search, page, true)



  const data = await search.exec()

  if (!data) {
    req.session.message = 'Entry not found'
    return res.redirect(`/list/${page}/`)
  }


  // #region statuses wa
  let statuses
  switch (page) {
    case 'item':
      statuses = await Cat.find({category: 'purchase'})
      break
    case 'kanban':
      statuses = await Cat.find({category: 'status'})
      break
    case 'monitor':
      //statuses = await Cat.find({category: 'purchase'})
      break
    default:
      break
  }
  // #endregion


  // #region items
  let items
  let backlink
  switch (page) {
    case 'recipe':
      await getSteps(id, data)
      break
    case 'ingredient':
      items = await getRecipesWIngredient(id)
      backlink = await I.findOne({name: data.name})

      if (backlink)
      data.backlink = `/show/item/${backlink._id}`
      break
    case 'chef':
      items = await F.find({cook: id}).sort({number: -1})
      items.forEach(x => {
        x.url = `/show/recipe/${x._id}`
      })
      break
    case 'technique':
      items = await getRecipesWTechnique(id)
      items.forEach(x => {
        x.url = `/show/recipe/${x._id}`
      })
      break
    case 'shopping':
      items = await getitemsInList(id)
      break
    case 'item':
      items = await getStoresWItem(id)
      backlink = await F.findOne({name: data.name})
      if (backlink)
      data.backlink = `/show/ingredient/${backlink._id}`
      break
    case 'store':
      items = await getitemsInStore(id)
      break
    default:
      break
  }
  // #endregion

  if (data.picture && data.picture.includes('/')) {
    data.icon = false
  }
  else {data.icon = true}

  // #region shopping lists
  let lists
  let included
  if ( page == 'item' || page == 'ingredient' || page == 'note' ) {
    lists = await S.find()
    if (page == 'item') {
      included = await S.find({'items.item': id})
    } else {
      const current = await MODEL.findById(id)
      const corresponding = await I.findOne({name: current.name})
      if (corresponding) {
        included = await S.find({
          items: {
            $elemMatch: {
              item: corresponding._id
            }
          }
        }).select('name')
      }
    }
  }
  // #endregion


  res.render('mains/show', {
    data, items, statuses, lists,
    dom: page, included,
    title: `Showing ${data.name}`
  })
})
// #endregion



// #region HELPER:
// THISIS: for technicues:
const getRecipesWTechnique = async id => {
  items = await F.find({'steps.elements.element' : id})
  return items
}

// THISIS: for ingredients:
const getRecipesWIngredient = async (id) => {
  let startitems = await F.find({'ingredients.ingredient': id}).select('name picture number url')
  // THISIS: find ingredients that are subs of this ingredient
  const subs = await F.find({
    'related': {
      $elemMatch: {
        "item": id,
        "category": "sub"
      }
    }
  })
  // THISIS: add recipes that use the subs of this ingredient
  for (const s of subs) {
    const current = await F.find({ 'ingredients.ingredient': s._id }).select('name picture number url')
    startitems = [...startitems, ...current]
  }
  // removal of duplicate results as in recipe uses both ingr and its sub, that recipe would show up twice
  const itemsMap = new Map()
  startitems.forEach(item => {
    itemsMap.set(item._id.toString(), item)
  })
  const items = Array.from(itemsMap.values())
  items.forEach(x => {
    x.url = `/show/recipe/${x._id}`
  })


    // sort expanded items by number
  items.sort((a, b) => {
    const num = b.number - a.number
    if(num) {return num}
    else {return a.name.localeCompare(b.name)}
  })
  return items
}


const getStoresWItem = async id => {
  const items = []
  const item = await I.findById(id)
  for (const d of item.stores) {
    const store = await L.findById(d.store)
    d.address ? d.address : item.site

    items.push({
      url: d.address,
      name: store.name,
      picture: store.picture,
      number: `${d.price.value}${d.price.unit}`
    })
  }
  return items
}


const getitemsInList = async id => {
  items = []
  const item = await S.findById(id)

  const relCategories = ['active', 'urgent', 'repeated']
  const ids = []
  for (const r of relCategories) {
    const current = await Cat.findOne({name: r})
    ids.push(current._id)
  }

  for (const i of item.items) {
    const item = await I.findById(i.item)

    ids.some(id => {
      if(item.status.equals(id)) {
        items.push(item)
        return true
      }
    })
  }

  items.forEach(x => {
    x.url = `/show/item/${x._id}`
  })
  return items
}


const getitemsInStore = async id => {
  const items = await I.find({"stores.store": id})
  items.forEach(x => {
    x.url = `/show/item/${x._id}`
  })
  return items
}
// #endregion



module.exports = app