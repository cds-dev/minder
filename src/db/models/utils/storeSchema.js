const mongoose = require('mongoose')
const Schema = mongoose.Schema

const storeSchema = new Schema({
  store: {
    type: Schema.Types.ObjectId,
    ref: 'Place'
  },
  price: {
    value: { type: Number },
    unit: {
      type: String,
      enum: ['RSD', 'EUR', 'USD', 'GBP'],
      default: 'RSD'
    }
  },
  quantity: {
    value: { type: Number },
    unit: {
      type: String,
      enum: ['g', 'pcs', 'pc', 'cm', 'ml', 'l', 'kg'],
      default: 'pc'
    }
  },
  address: {
    type: String
  }
})

module.exports = storeSchema