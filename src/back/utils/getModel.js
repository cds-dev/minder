// #region models
const { Model } = require('mongoose')
const A = require('../../db/models/actionModel')
const Cat = require('../../db/models/utils/categoryModel')
const D = require('../../db/models/calendarModel')
const F = require('../../db/models/foodModel')
const I = require('../../db/models/itemModel')
const J = require('../../db/models/utils/cronModel')
const K = require('../../db/models/kanbanModel')
const L = require('../../db/models/placeModel')
const M = require('../../db/models/flashModel')
const N = require('../../db/models/-noteModel')
const P = require('../../db/models/peopleModel')
const S = require('../../db/models/shoppingModel')
// #endregion


const getModel = page => {
  let MODEL

  switch (page) {
    case 'technique':
      MODEL = A
      break
    case 'minder':
    case 'story':
    case 'diary':
    case 'food':
    case 'bio':
    case 'measurments':
    case 'period':
    case 'stool':
    case 'note':
      MODEL = D
      break
    case 'recipe':
    case 'ingredient':
      MODEL = F
      break
    case 'item':
      MODEL = I
      break
    case 'monitor':
      MODEL = J
      break
    case 'kanban':
      MODEL = K
      break
    case 'store':
    case 'organization':
    case 'private':
      MODEL = L
      break
    case 'flash':
      MODEL = M
      break
    case 'chef':
    case 'friend':
      MODEL = P
      break
    case 'shopping':
      MODEL = S
      break
    default:
      MODEL = null
  }

  return MODEL
}


module.exports = {
  getModel
}