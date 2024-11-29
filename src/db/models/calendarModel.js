const mongoose = require('mongoose')
const Schema = mongoose.Schema


const stoolSchema = new Schema({
  hardness: {
    type: Number,
    enum: [ 0, 1, 2, 3, 4 ],
    default: 3
  },
  quantity: {
    type: Number,
    enum: [0, 1, 2, 3, 4 ],
    default: 2
  },
  color: {
    type: String,
    enum: ['#3D0D01', '#531202', '#6C1702', '#892C03', '#9C3103', '#BC6D03', '#8E0407', '#6F712B'],
    default: '#531202'
  },
  shape: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5, 6 ],
    default: 2
  },
  satisfaction: {
    type: Number,
    enum: [0, 1, 2],
    default: 1
  }
})


const measurmentsSchema = new Schema({
  weight: { type: Number },
  arm: { type: Number },
  chest: { type: Number },
  waist: { type: Number },
  hhip: { type: Number },
  lhip: { type: Number },
  leg: { type: Number }
})


const languageSchema = new Schema({})



const flashSchema = new Schema({
  answer: {type: String },
  notes: { type: [String]},
  number: { // successful recalls (graded 3 or more)
    type: Number,
    default: 0
  },
})



const minderSchema = new Schema({
  diff: [{
    count: { type: Number },
    added: { type: Boolean },
    value: { type: String }
  }],
  type: { type: String },
  expiry: {type: Date },
  targetDate: { type: Date },
  time: { type: String },
  date: { type: String },
  repeats: { type: String },
  dingAhead: { type: Number },
  endDate: { type: Date },
  active: {
    type: Boolean,
    default: true
  },
  audio: { type: String },
  defaultSnooze: { type: Number },
  location: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Places'
  }]
})



const calendarSchema = new Schema({
  time: {
    type: Date,
    default: Date.now,
    required: true
  },
  date: { type: String },
  notes: { type: [String] },
  name: { type: String, index: true },
  site: { type: String },
  category: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    index: true
  }],
  minder: { type: minderSchema },
  variety: { type: String },
  flash: [flashSchema],
  picture: { type: String },
  icon: { type: Boolean },
  stool: { type: stoolSchema},
  measurments: { type: measurmentsSchema },
  ref: { type: String },
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food'
  },
})


calendarSchema.pre('save', function(next) {
  const day = ('0' + this.time.getDate()).slice(-2)
  const month = ('0' + (this.time.getMonth() + 1)).slice(-2)
  const year = this.time.getFullYear().toString()

  this.date = `${day}/${month}/${year}`
  next()
})


module.exports = mongoose.model('Calendar', calendarSchema)