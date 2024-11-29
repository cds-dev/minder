// #region IMPORTS
const F = require('../../db/models/foodModel')
const M = require('../../db/models/flashModel')
const A = require('../../db/models/actionModel')
const P = require('../../db/models/peopleModel')
const L = require('../../db/models/placeModel')
const I = require('../../db/models/itemModel')
const C = require('../../db/models/cuisineModel')
const Cat = require('../../db/models/utils/categoryModel')

const { counter } = require('./counter')
const isValidURL = require('../utils/isValidUrl')
const { getModel } = require('../utils/getModel')
const { imageResize } = require('../utils/imageResize')

// #endregion


const sortData = async (body, id, page) => {
  const MODEL = getModel(page)

  try {
    const data = await MODEL.findById(id) || new MODEL()

    // #region MAIN DATA
    data.name = body.name
    data.picture = body.picture
    data.site = body.site
    data.tag = body.tag
    data.variety = page
    if (body.keepFor) data.keepFor = body.keepFor

    data.category = []
    for (let c of body.category) {
      const current = await Cat.findOne({name: c})
      if (current) data.category.push(current._id)
      if (c == 'secondary') {
        data.variety = c
      }
    }

    if (Number(body.protein30)) data.protein30 = Number(body.protein30)

    // #region cook
    if (!body.cook) {
      data.cook = null
    }
    else {
      const cook = await P.findOne({name: body.cook})
      if (cook) data.cook = cook._id
    }
    // #endregion

    // #endregion

    // #region MISCELLANEOUS
    data.rotation = body.rotation

    if(!body.myExperience) body.myExperience = 'yetToTry'
    const exp = await Cat.findOne({picture: body.myExperience})
    data.myExperience = exp._id

    const season = await Cat.findOne({name: body.season}) || await Cat.findOne({name: 'all'})
    if(season) {
      data.season = season._id
    }

    const cuisine = await C.findOne({name: body.cuisine})
    if (cuisine) data.cuisine = cuisine._id

    data.conversion = {
      quantity: Number(body?.conversion?.quantity) || 240,
      unit: body?.conversion?.unit || 'ml'
    }

    // TODO:
    data.grade = body.grade || 0
    // #endregion

    // #region minders
    if (body.minder) {
      data.minder = {
        type: body.minder.type,
        repeats: body.minder.repeats,
        active: body.minder.active,
        audio: body.minder.audio,
        defaultSnooze: body.minder.defaultSnooze,
        time: body.minder.time,
        date: body.minder.date,
        targetDate: body.minder.targetDate,
      }
    }
    // #endregion
    
    // #region STEPS
    data.steps = []
    const ingredients = body.ingredients.map(x => x.ingredient)

    data.ingredients = []
    for (const step of body.steps) {
      const generate = new F()
      const current = {}
      current._id = generate._id
      current.name = step.name
      current.temperatureI = step.temperatureI
      current.temperatureS = step.temperatureS
      current.stepNotes = step.stepNotes

      // #region step duration
      current.range = []
      for (const t of step.duration) {
        if(t.duration) {
          const duration = {
            duration: t.duration
          }
          const unit = await Cat.findOne({name: t.unit})
          if (unit) {
            duration.units = unit._id
          }
          if (current?.range?.length) {
            duration.max = true
          }
          if (t.duration && t.unit) {
            current.range.push(duration)
          }
        }
      }
      // #endregion
    
      current.elements = []
      for (const e of step.elements) {
        if(e.element) {
          let MODEL
          if (e.elementRef == 'Food') {
            MODEL = F
          } else if (e.elementRef == 'Action') {
            MODEL = A
          }

          if(MODEL) {
            const element = await MODEL.findOne({name: e.element})
            const currentEl = {
              element: element._id,
              elementRef: e.elementRef
            }

            const index = ingredients.indexOf(e.element)
            if (index + 1) {
              if(body.ingredients[index].unit == 'cup' || body.ingredients[index].unit == 'cups') {
                const convert = element.conversion
                body.ingredients[index].unit = convert.unit
                body.ingredients[index].amount = Math.round((Number(body.ingredients[index].amount) * Number(convert.quantity)) / 10) * 10
              }

              const unit = await Cat.findOne({name: body.ingredients[index].unit})
              currIngr = {}
              currIngr.ingredient = element._id
              currIngr.required = body.ingredients[index].required

              if (e.elementRef == 'Food') {
                currIngr.amount = body.ingredients[index].amount
                currIngr.group = current._id
                if(unit?._id) {
                  currIngr.unit = unit._id
                }
                data.ingredients.push(currIngr)
                ingredients[index] = 'used'
              }
            }
            
            current.elements.push(currentEl)
          }

          else if (e.elementRef == 'Step') {
            const refs = data.steps.map(x => x._id)
            if (refs[e.element - 1]) {
              const currentEl = {
                element: refs[e.element - 1],
                elementRef: 'Step'
              }
              current.elements.push(currentEl)
            }
          }
        }
      }

      data.steps.push(current)
    }

    // #endregion

    // #region
    if (!data.status) {
      let status = await Cat.findOne({name: 'active'})
      if (page == 'monitor') {
        status = await Cat.findOne({name: 'active', category: 'check'})
      } if (page == 'kanban') {
        status = await Cat.findOne({name: 'idea'})
      }
      data.status = status._id
    }
    
    // #endregion


    data.stores = []
    // #region STORES
    if (body.stores?.length) {
      let item = await I.findOne({name : body.name})
      if(!item) item = new I()
      
      if (page = 'item') data.number = 999_999

      if(page == 'ingredient') {
        item.number = 999_999
        item.picture = body.picture
        item.name = body.name
        const category = await Cat.findOne({name: 'groceries'})
        item.category.push(category._id)
        item.status = status._id
        item.stores = []
      }

      for (const s of body.stores) {
        const current = {}

        const store = await L.findOne({name: s.name})
        if (store) {
          current.store = store._id
        }

        current.price = {}
        current.address = s.address
        if (Number(s.price)) {
          current.price = {
            value: Number(s.price),
            unit: 'RSD'
          }
          if(page == 'ingredinet' && item.number > Number(s.price) || page == 'item' && data.number > Number(s.price)) {
            if (isValidURL(s.address)) {
              item.site = s.address
              if (page = 'item') data.site = s.address
              data.address = s.address
            }
            // else {
            //   item.address = s.address
            //   if (page = 'item') data.address = s.address
            // }
            item.number = Number(s.price)
            if (page = 'item') data.number = Number(s.price)
          }
        } else if (page == 'ingredinet' && Number(s.price.slice(0, -1)) || page == 'item' && data.number > Number(s.price.slice(0, -1))) {
          current.price.value = Number(s.price.slice(0, -1))

          if(item.number > Number(s.price.slice(0, -1))) {
            if (isValidURL(s.address)) {
              item.site = s.address
              if (page = 'item') data.site = s.address
            }
            else {
              item.address = s.address
              if (page = 'item') data.address = s.address
            }
            item.number = Number(s.price.slice(0, -1))
            if (page = 'item') data.number = Number(s.price.slice(0, -1))
          }

          if (s.price.slice(-1) == 'e' || s.price.slice(-1) == 'E' || s.price.slice(-1) == '€') {
            current.price.unit = 'EUR'
          }
          if (s.price.slice(-1) == 's' || s.price.slice(-1) == 'S' || s.price.slice(-1) == '$') {
            current.price.unit = 'USD'
          }
          if (s.price.slice(-1) == 'l' || s.price.slice(-1) == 'L' || s.price.slice(-1) == '£') {
            current.price.unit = 'GBP'
          }
        }

        current.quantity = {
          value : Number(s.amount) || 1,
          unit : s.unit || 'pc'
        }
        
        data.stores.push(current)
        item.stores.push(current)

        if(page == 'ingredient') {
          await item.save()
        }
      }
    }
    // #endregion

    // #region CONCLUSION
    if (page !== 'monitor') data.notes = []
    body.notes.forEach(x => {data.notes.push(x)})

    data.related = []
    if (body.sub) {
        const item = await F.findOne({name: body.sub})
        data.related.push({
          item: item._id,
          category: 'sub'
        })
    }
      for(let x of body.variant) {
        const current = await F.findOne({name: x})

        try {
          if(current) {
            data.related.push({
              item: current._id,
              category: 'variant'
            })
          }
          else {
            throw new Error(`The "variant" ${body.variant} can't be found`)
          }
        } catch (error) {
          if (error.message.includes('The "variant" ')) {
            console.error(error.message)
            console.error(error.stack.split('\n')[0])
          } else {
            console.error(error) // Log full error details for other cases
          }
        }
      }
      for(let x of body.pair) {
        const current = await F.findOne({name: x})

        data.related.push({
          item: current._id,
          category: 'pair'
        })
      }
      for(let x of body.related) {
        const current = await F.findOne({name: x})
        data.related.push({
          item: current._id,
          category: 'related'
        })
      }
      for(let x of body.substitute) {
        const current = await F.findOne({name: x})
        data.related.push({
          item: current._id,
          category: 'substitute'
        })
      }

      // #region keep
      const countertop = await Cat.findOne({name: 'counter'})
      const fridge = await Cat.findOne({name: 'fridge'})
      const freezer = await Cat.findOne({name: 'freezer'})
      data.keep = [{
        for: body.counter,
        at: countertop._id
      }, {
        for: body.fridge,
        at: fridge._id
      }, {
        for: body.freezer,
        at: freezer._id
      }]
      // #endregion

    // #endregion

    // #region
    if (body.bus && body.bus.length) {
      data.bus = []
      body.bus.forEach(x => {
        data.bus.push({
          address: x.address,
          line: x.line,
          stop: x.stop
        })
      })
    }
    // #endregion
    try {
      await imageResize(body.picture)
    } catch (err) {
      console.error(err)
    }

    await counter(data, page)

    return data
  } catch (err) {
    console.error(err)
  }
}


module.exports = {
  sortData
}