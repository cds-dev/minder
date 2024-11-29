const mongoose = require('mongoose')
const Schema = mongoose.Schema

const peopleSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  category: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    index: true
  }],
  // variety: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Category',
  //   index: true
  // },
  variety: { type: String },
  picture: {type: String},
  icon: { type: Boolean },
  number: {
    type: Number,
    default: 0
  },
  site: {type: String},
  url: {type: String},
  birthday: {type: Date},
  related: [{
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'People'
    },
    category: {
      type: String,
      enum: ['colleague', 'organization'],
      default: 'colleague'
    }
  }],
  note: { type: String },
  notes: [ String ]
})

module.exports = mongoose.model('People', peopleSchema)