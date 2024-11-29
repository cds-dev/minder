const mongoose = require('mongoose')
const Schema = mongoose.Schema
const storeSchema = require('./utils/storeSchema')


const ingredientSchema = new Schema({
  ingredient: {
    type: Schema.Types.ObjectId,
    ref: 'Food'
  },
  amount: { type: Number },
  unit: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Food'
  }, // this would be name of the step, so you can group things that go into broth, or into sauce, or we
  required: { type: Boolean }
})


const timeRangeSchema = new mongoose.Schema({
  duration: {
    type: Number,
  },
  units: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  max: { type: Boolean }
})


const keepForSchema = new mongoose.Schema({
  for: { type: String },
  at: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }
})


const nutrientSchema = new mongoose.Schema({})

// TODO: https://chat.openai.com/share/2d52765e-dd8c-4f7d-b7fa-8291a6c1cf91
const stepSchema = new Schema({
  name: { type: String },
  range: [timeRangeSchema],
  temperatureI: { type: Number },
  temperatureS: { type: Number },
  elements: [{
    element: {
      type: Schema.Types.ObjectId,
      refPath: 'elements.elementRef'
    },
    elementRef: {
      type: String,
      required: true,
      enum: ['Food', 'Action', 'Step']
    }
  }],
  stepNotes: { type: String },
})


const foodSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true,
    background: true
  },
  variety: {
    type: String,
    enum: ['ingredient', 'recipe', 'secondary'],
    default: 'recipe'
  },
  category: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  url: {
    type: String
  },
  site: {
    type: String
  },
  picture: {
    type: String,
    required: true
  },
  icon: { type: Boolean },
  stores: [storeSchema],
  notes: {
    type: [String]
  },
  temporary: {
    type: String
  },
  myExperience: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: "66432fc0cdfba5aa4849efd4" // yet to try
  },
  season: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  cuisine: { 
    type: Schema.Types.ObjectId,
    ref: 'Cuisine'
  },
  ingredients: [
    ingredientSchema
  ],
  number: {
    type: Number,
    default: 0
  },
  steps: [stepSchema],
  // stores: [storeSchema],
  related: [{
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food'
    },
    category: {
      type: String,
      enum: ['related', 'substitute', 'sub', 'variant', 'pair'],
      default: 'related'
    }
  }], // seasalt is sub of salt...
  rotation: {
    type: Boolean,
    default: false
  },
  conversion: { // how many g in a cup
    quantity: { type: Number, default: 240 },
    unit: { type: String, enum: ['g', 'ml'], default: 'ml' }
  },
  keep: [keepForSchema],
  cook: {
    type: Schema.Types.ObjectId,
    ref: 'People',
    index: true
  },
  protein30: { // for ingr how many of this cooked is 30g of protein
    type: Number
  },
  internalT: { type: Number }, // for meats and stuff
  nutrients: { type: nutrientSchema },
  backlink: { type: String } // store url of shopping item with same name
})


module.exports = mongoose.model('Food', foodSchema)