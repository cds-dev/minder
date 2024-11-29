const mongoose = require('mongoose')
const Schema = mongoose.Schema


const kanbanSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  notes: { type: [String] }, // description or list
  picture: { type: String },
  icon: { type: Boolean },
  site: { type: String },
  url: { type: String },
  category1: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }, // like different projects
  category: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }], // like different projects
  status: { // done, in progress...
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  time: {
    type: Date,
    default: Date.now,
    required: true
  }
})


module.exports = mongoose.model('Kanban', kanbanSchema)