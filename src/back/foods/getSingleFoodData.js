const F = require('../../db/models/foodModel')
const C = require('../../db/models/cuisineModel')
const A = require('../../db/models/actionModel')
const Ppl = require('../../db/models/peopleModel')
const Cat = require('../../db/models/utils/categoryModel')



const getSingleFoodData = async (id, edit) => {
  // #region populate
  const food = await F.findById(id)
  .populate('ingredients.ingredient')
  .populate('related.item')
  .populate('cuisine')
  .populate('ingredients.unit')
  .populate('category')
  .populate('myExperience')
  .populate('season')
  .populate('keep.at')
  .populate('cook')
  .populate('steps.range.units')
  // #endregion


  // #region related
  if (edit) {
    const relatedTypes = []
    const allTypes = ['related', 'substitute', 'variant', 'pair'] // 'sub', 
    for ( const r of food.related) {
      if (!relatedTypes.includes(r.category)) {
        relatedTypes.push(r.category)
      }
    }

    allTypes.forEach(x => {
      if(!relatedTypes.includes(x)) {
        food.related.push({
          item: '',
          category: x
        })
      }
    })
    // #region old recipes that contained ingredients w/o steps, need this fix...
    if(!food.steps.length && food.ingredients) {
      food.steps = []
      food.steps[0] = {}
      food.steps[0].elements = []
      food.ingredients.forEach(x => {
        const element = {
          element: x.ingredient._id,
          elementRef: 'Food'
        }
        food.steps[0].elements.push(element)
      })
    }
    // #endregion
  }
  // #endregion


  try {
    // #region
    const stepsPromise = (async () => {
      return await Promise.all(food.steps.map(async (stepObj) => {
        for (let x in stepObj.elements) {
          if (stepObj.elements[x].elementRef == 'Action') {
            const id = stepObj.elements[x].element
            const method = await A.findById(id).exec()
            stepObj.elements[x].name = method.name
            stepObj.elements[x].picture = method.picture
          }
          else if (stepObj.elements[x].elementRef == 'Food') {
            const id = stepObj.elements[x].element
            const ingredient = await F.findById(id).exec()
            stepObj.elements[x].name = ingredient.name
            stepObj.elements[x].picture = ingredient.picture
          }
          else if (stepObj.elements[x].elementRef == 'Step') {
            const id = stepObj.elements[x].element
          }
        }
      }))
    })()
    await Promise.all([stepsPromise])
    // #endregion
    return food
  } catch (err) {
    console.error(err)
    return null
  }
}

module.exports = {
  getSingleFoodData
}