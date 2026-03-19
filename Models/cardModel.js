const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
  nombre:           { type: String, required: true, trim: true },
  numCard:             { type: String, required: true ,trim:true },
  fechaVencimiento:   { type: String, required: true },
  ccv:            { type: String, required: true, trim: true },
  type:{ type: String, trim: true },
  respaldo: { type: String, trim: true },
  description: { type: String, trim: true },
  total:{ type: Number, required: true, trim: true },
}, { timestamps: true })

module.exports = mongoose.model('Card', cardSchema)