const { Schema, model } = require('mongoose');

const stockSchema = new Schema(
  {
    stockName: String,
    stockNumber: Number,
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