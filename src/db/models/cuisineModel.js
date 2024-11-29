const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cuisineSchema = new Schema({
  name: {
    type: String, required: true, index: true
  },
  partOf: {
    type: String
  },
  notes: {
    type: [String]
  },
  picture: { type: String },
  icon: { type: Boolean }
})

module.exports = mongoose.model('Cuisine', cuisineSchema)