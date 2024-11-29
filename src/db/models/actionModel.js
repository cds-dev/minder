const mongoose = require('mongoose')
const Schema = mongoose.Schema



const actionSchema = new Schema({
  name: {
    type: String,
    index: true,
    required: true
  },
  variety: {
    type: String
  }, // such as recipe, exercise
  category: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    index: true
  }],
  picture: {
    type: String
  },
  icon: { type: Boolean },
  notes: {
    type: [String]
  },
  number: {
    type: Number
  },
  url: {
    type: String
  }
})




module.exports = mongoose.model('Action', actionSchema)