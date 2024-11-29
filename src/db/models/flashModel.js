const mongoose = require('mongoose')
const Schema = mongoose.Schema


const subFlashSchema = new Schema({
  answer: { type: String },
  notes: [{
    type: String,
    required: true
  }],
  category: [{ // sub cat basically
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }], 
  number: { // successful recalls (graded 3 or more)
    type: Number,
    default: 0
   },
  grade: { // user rates the hardness 1 - 5, if grade is 3 or more, number increases
    type: Number,
    enum: [0, 1, 2, 3, 4, 5],
    default: 0
  },
  easynessFactor: {
    type: Number,
    default: 2.5
  },
  interval: {
    type: Number,
    default: 1
  },
  date: { // show next, so, basically, show all where this date is in the past...
    type: Date
  },
  // default: {
  //   type: Boolean,
  //   default: false
  // },
  picture: {type: String},
  icon: { type: Boolean },
  flash: { type: Boolean } // to differentiate between different notes
})


const flashSchema = new Schema({
  notes: [{
    type: String,
    required: true
  }],
  name: {
    type: String,
    required: true,
    index: true
  },
  site: {
    type: String
  },
  category: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    index: true
  }],
  details: [subFlashSchema],
  picture: {type: String},

  // variety: { // sub cat basically
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Category'
  // },
  // number: { // successful recalls (graded 3 or more)
  //   type: Number,
  //   default: 0
  //  },
  // grade: { // user rates the hardness 1 - 5, if grade is 3 or more, number increases
  //   type: Number,
  //   enum: [0, 1, 2, 3, 4, 5],
  //   default: 0
  // },
  // easynessFactor: {
  //   type: Number,
  //   default: 2.5
  // },
  // interval: {
  //   type: Number,
  //   default: 1
  // },
  // date: { // show next, so, basically, show all where this date is in the past...
  //   type: Date
  // },
})


module.exports = mongoose.model('Flash', flashSchema)