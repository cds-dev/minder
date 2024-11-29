const F = require('../../db/models/foodModel')
const A = require('../../db/models/actionModel')
const P = require('../../db/models/peopleModel')
const L = require('../../db/models/placeModel')
const I = require('../../db/models/itemModel')

const process = async () => {}

const counter = async (data, page) => {
  try {
    switch (page) {
      case 'recipe':
        for (const step of data.steps) {
          for (const element of step.elements) {
            if (element.elementRef == 'Action') {
              const current = await A.findById(element.element)
              const number = await F.countDocuments({'steps.elements.element' : element.element})
              current.number = number
              await current.save()
            }
            else if (element.elementRef == 'Food') {
              const current = await F.findById(element.element)
              const number = await F.countDocuments({'steps.elements.element' : element.element})
              current.number = number
              await current.save()
            }
          }
        }
        if ( data.cook ) {
          const cook = await P.findById(data.cook)
          const number = await F.countDocuments({'cook' : data.cook})
          cook.number = number
          await cook.save()
        }
        break
      case 'item':
        for (const store of data.stores) {
          const current = await L.findById(store.store)
          const number = await I.countDocuments({'stores.store' : store.store})
          current.number = number
          await current.save()
        }
        break
      default:
        break
    }
  } catch (err) {
    console.error(err)
  }
  return
}


module.exports = {
  counter
}