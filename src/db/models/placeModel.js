const mongoose = require('mongoose')
const Schema = mongoose.Schema


const geoSchema = new Schema({
  type: {
    type: String,
    default: 'Point'
  },
  coordinates: {
    type: [Number],
    index: '2dsphere'
  }
})


const busSchema = new Schema({
  address: { type: String },
  line: {
    type: String
  },
  stop: {
    type: String
  },
  location: {
    type: geoSchema
  }
})


const placeSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  picture: {
    type: String
  },
  icon: { type: Boolean },
  site: { // their website
    type: String
  },
  // variety: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Category',
  // },
  variety: { type: String },
  category: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    index: true
  }],
  address: { // physical address
    type: String
  },
  location: {
    type: geoSchema
  },
  url: { // placeholder for url within this app to this place
    type: String
  },
  notes: {
    type: [String]
  },
  bus: {
    type: [busSchema]
  },
  number: {
    type: Number
  }
})




module.exports = mongoose.model('Place', placeSchema)