const mongoose = require('mongoose')
const Schema = mongoose.Schema
const storeSchema = require('./utils/storeSchema')




const itemSchema = new Schema({
  name: {
    type: String,
    required: true,
    alias: 'item',
    index: true
  },
  category: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    index: true
  }],
  stores: [storeSchema],
  url: { type: String },
  backlink: { type: String },
  site: { type: String },
  address: { type: String },
  picture: { type: String },
  icon: { type: Boolean },
  notes: [ String ],
  number: { type: Number },
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }
})




module.exports = mongoose.model('Item', itemSchema)