const mongoose = require('mongoose')
const Schema = mongoose.Schema

const notesSchema = new Schema({
  name: { type: String,
    index: true },
  type: { type: [String] },
  picture: { type: String },
  icon: { type: Boolean },
  notes: { type: String },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    index: true
  }
})

module.exports = mongoose.model('Note', notesSchema)