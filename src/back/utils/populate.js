// #region IMPORTS
const F = require('../../db/models/foodModel')
const M = require('../../db/models/flashModel')
const A = require('../../db/models/actionModel')
const P = require('../../db/models/peopleModel')
const L = require('../../db/models/placeModel')
const I = require('../../db/models/itemModel')
const C = require('../../db/models/cuisineModel')
const Cat = require('../../db/models/utils/categoryModel')
// #endregion


const populate = (search, page, full) => {
  if (full) {
    search.populate('category')
    switch (page) {
      case 'recipe':
        search.populate('ingredients.ingredient')
        .populate('related.item')
        .populate('cuisine')
        .populate('ingredients.unit')
        .populate('myExperience')
        .populate('season')
        .populate('keep.at')
        .populate('cook')
        .populate('steps.range.units')
        break
      case 'ingredient':
      case 'chef':
        search.populate('related.item')
        break
      case 'item':
        search.populate('status')
        .populate('stores.store')
        break
      case 'kanban':
        search.populate('status')
        break
      default:
        break
    }
  }
  else {
    switch (page) {
    case 'recipe':
      search.populate('cook')
      break
    case 'kanban':
      search.populate('status')
      break
    case 'story':
    case 'measurments':
    case 'period':
    case 'stool':
      search.populate('variety')
      break
    case 'bio':
    case 'food':
      search.populate('food')
      search.populate('variety')
      break
    default:
      //
    }
  }
  
}


module.exports = {
  populate
}