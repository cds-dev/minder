const mongoose = require('mongoose')
const Schema = mongoose.Schema


const cronSchema = new Schema({
  name: { type: String, index: true },
  site: { type: String, index: true },
  tag: { type: String },
  notes: { type: String },
  hash: { type: String },
  diff: { type: Object },
  picture: { type: String },
  number: { type: Number, default: 0 },
  expiry: { type: Date },
  keepFor: { type: Number },
  category: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  status: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
})


module.exports = mongoose.model('Cron', cronSchema)