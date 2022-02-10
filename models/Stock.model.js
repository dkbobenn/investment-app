const { Schema, model } = require('mongoose');

const stockSchema = new Schema(
  {
    stockName: String,
    stockNumber: {type: Number, min: 1},
    buyingPrice : Number,
    currentStockValue: Number,
    highestDayValue: Number,
    lowestDayValue: Number
  },
  {
    timestamps: true
  }
);

module.exports = model('Stocks', stockSchema);