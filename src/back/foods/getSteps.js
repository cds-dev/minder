const A = require('../../db/models/actionModel')
const F = require('../../db/models/foodModel')



const getSteps = async (id, data) => {
  const stepsPromise = (async () => {
    return await Promise.all(data.steps.map(async (stepObj) => {
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
  return await Promise.all([stepsPromise])
}


module.exports = {
  getSteps
}