const F = require('../../db/models/foodModel')

const fixRelatedRecipes = async recipe => {
  const relatives = []
  relatives.push(recipe._id)

  for(const R of recipe.related) {
    if(R.category === 'variant' && !relatives.includes(R.item)) {
      relatives.push(R.item)
    }
    // if it is a variant, and it's not already included in the relatives array
  }

  if(relatives.length > 1) {
    for(const R of relatives) {
      const current = await F.findById(R)
      // this saves pairs otherwise they get overwritten with relateds...
      const pairs = []
      if(current) {
        current.related.forEach(x => {
          if(x && x.category == 'related' && !relatives.includes(x)) {
            relatives.push(x.item)
          }
        })
        current.related.forEach(x => {
          if(x && x.category == 'pair') {
            pairs.push(x)
          }
        })
        current.related = [...pairs]

        for (const r of relatives) {
          if(!current._id.equals(r)) {
            current.related.push({
              item: r,
              category: 'variant'
            })
          }
        }

        await current.save()
      }
    }
  }
}



module.exports = {
  fixRelatedRecipes
}