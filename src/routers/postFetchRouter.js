// #region
const express = require('express')
const app = express.Router()


const Cal = require('../db/models/calendarModel')
const Cat = require('../db/models/utils/categoryModel')
const F = require('../db/models/foodModel')
const S = require('../db/models/shoppingModel')
const I = require('../db/models/itemModel')


const { formatDate } = require('../back/utils/formatDate')
const { getModel } = require('../back/utils/getModel')
// #endregion


// #region
app.post('/diary/submit/:v?', async (req, res) => {
  try {
    let diary = new Cal()
    diary.notes = req.body.notes || ' '

    diary.variety = req.params.v || 'diary'

    const allDates = await Cal.distinct('date')

    diary.date = formatDate()

    if (req.params.v == 'stool') {
      diary.stool = {
        hardness: req.body.hardness || 3,
        quantity: req.body.quantity || 2,
        color: req.body.color || '#531202',
        shape: req.body.shape || 1,
        satisfaction: req.body.satisfaction || 2,
      }
    }

    if (req.params.v == 'measurments') {
      diary.measurments = {
        weight: Number(req.body.weight),
        arm: Number(req.body.arm),
        chest: Number(req.body.chest),
        waist: Number(req.body.waist),
        hhip: Number(req.body.hhip),
        lhip: Number(req.body.lhip),
        leg: Number(req.body.leg)
      }
    }
    if (!req.body.notes) diary.notes = req.params.v

    if (req.params.v == 'food') {
      if (req.body.food) {
        const food = await F.findOne({name : req.body.food})
        diary.food = food._id
        diary.notes = req.body.ref
      }
    }

    await diary.save()

    if(diary.picture && diary.picture.includes('/')) diary.icon = false
    else diary.icon = true

    if (req.params.v == 'food') {
      diary = await Cal.findById(diary._id)
      .populate('food')
    }
    res.send(diary)
  } catch (err) {
    console.error(err)
    res.status(500).send('Internal Server Error')
  }
})


app.post('/shoppingList/', async (req, res) => {
  if (req.body.length - 1) {
    const page = req.body[0].split('/')[2]
    const itemId = req.body[0].split('/')[3]
    const allSL = await S.find()
    const M = await getModel(page)
    const relevantLists = req.body.slice(1)
    if (page == 'item') {
      const item = await I.findById(itemId)
      for (const currentList of allSL) {
        const allItemsInCurrentList = []
        // THISIS: shopping list that this item should be on
        if (relevantLists.includes(currentList._id.valueOf())) {
          currentList.items.forEach(x => {
            allItemsInCurrentList.push(x.item.valueOf())
          })
          if (!allItemsInCurrentList.includes(itemId)) {
            currentList.items.push({ item: item._id })
            currentList.number = currentList.items.length
            await currentList.save()
          }
        } else {
          // THISIS: shopping list that shouldn't include this item
          currentList.items.forEach(x => {
            allItemsInCurrentList.push(x.item.valueOf())
          })
          console.log(allItemsInCurrentList)
          if (allItemsInCurrentList.includes(itemId)) {
            const index2Remove = allItemsInCurrentList.indexOf(itemId)
            currentList.items.splice(index2Remove, 1)
            currentList.number = currentList.items.length
            await currentList.save()
            console.log(index2Remove)
          }
        }
      }
    } else {
      const original = await M.findById(itemId)
      let item = await I.findOne({name: original.name})
      if (!item) {
        item = new I()
        item.name = original.name
        item.picture = original.picture
        if (page == 'ingredient') {
          const category = await Cat.findOne({name: 'groceries', category: 'item'})
          item.category = category._id
        } if (page == 'note') {
          const bookNote = await Cat.findOne({name: 'book', category: 'note'})
          const bookItem = await Cat.findOne({name: 'book', category: 'item'})
            console.log(bookNote._id)
            console.log(bookItem._id)
            console.log(original.category[0])
          if (original.category[0].equals(bookNote._id)) {
            console.log('it\'s a book')
          }
          
        }
      }
      console.log(item)
    }
  }
  res.send(true)
})


app.get('/fix/', async (req, res) => {
  const bookItem = await Cat.findOne({name: 'book', category: 'item'})
  const data = await Cal.find({variety: 'note', category: bookItem._id})
  console.log(data.length)
  for (const d of data) {
    const bookNote = await Cat.findOne({name: 'book', category: 'note'})
  }
})


app.post('/checklink/:page/', async (req, res) => {
  const MODEL = await getModel(req.params.page)
  const check = await MODEL.findOne({ site: req.body.url })

  if (check) {
    res.send(true)
  }
  else res.send('false')
})


app.post('/deactivate/:page/:id', async (req, res) => {
  if (req.params.page) {
    const MODEL = await getModel(req.params.page)

    if (req.params.id) {
      const data = await MODEL.findById(req.params.id)
      data.minder.active = false
      await data.save()
    }
  }
  
})


// made it number of times
app.post('/recipe/madeIt/:id', async (req, res) => {
  try {
    const recipe = await F.findById(req.params.id)

    recipe.number++
    // value to send back as a response
    const newValue = recipe.number
    await recipe.save()

    const foodDiary = new Cal()

    const today = new Date()
    const date = formatDate()

    foodDiary.name = recipe.name
    foodDiary.time = today
    foodDiary.date = date
    foodDiary.variety = 'food'
    foodDiary.food = recipe._id


    await foodDiary.save()
    res.status(200).send({ newValue })
  } catch (err) {
    console.error(err)
    res.status(500).send('Error updating recipe')
  }
})


// make this recipe suggestible, or not
app.post('/recipe/suggest/:id', async (req, res) => {
  try {
    const recipe = await F.findById(req.params.id)
    if(recipe.rotation) {
      recipe.rotation = false
      await recipe.save()
    } else {
      recipe.rotation = true
      await recipe.save()
    }

    res.status(200).send(recipe.rotation)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error updating recipe')
  }
})
// #endregion


module.exports = app