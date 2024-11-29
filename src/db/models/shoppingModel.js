const mongoose = require('mongoose')
const Schema = mongoose.Schema



const shoppingSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  items: [{
    item: {
      type: Schema.Types.ObjectId,
      ref: 'Shopping'
    }
  }],
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stores'
  },
  category: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    index: true
  }],
  number: { type: Number },
  picture: { type: String },
  icon: { type: Boolean },
  notes: { type: [String] },
  url: { type: String }
})



module.exports = mongoose.model('Shopping', shoppingSchema)