const mongoose = require('mongoose')
const Schema = mongoose.Schema


const statusSchema = new Schema ({
  selection: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  number: { type: Number }
})


const categorySchema = new Schema({
  name: {
    type: String,
    index: true
  },
  category: {
    type: String,
    index: true
  },
  sub: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  picture: {
    type: String
  },
  number: { type: Number },
  main: { type: Boolean },
  statuses: [statusSchema],
  statusOf: {
    type: String
  }
})





module.exports = mongoose.model('Category', categorySchema)