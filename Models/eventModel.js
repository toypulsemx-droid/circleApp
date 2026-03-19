const mongoose = require('mongoose')

const zonaSchema = new mongoose.Schema(
  {
    nombre: { type: String, trim: true },
    precio: { type: Number, min: 0 },
    color:  { type: String, trim: true, default: '#00d4d4' }, // ← color hex de la zona
  },
  { _id: false }
);

const eventoSchema = new mongoose.Schema(
  {
    artista:     { type: String, trim: true },
    tour:        { type: String, trim: true },
    fecha:       { type: String, trim: true },
    ciudad:      { type: String, trim: true },
    recinto:     { type: String, trim: true },
    boletera:    { type: String, trim: true },
    descripcion: { type: String, trim: true },
    categoria:   { type: String, trim: true },
    genero:      { type: String, trim: true },
    prioridad:   { type: String, trim: true },
    section:     { type: String, trim: true },
    ULR_IMG_1:   { type: String, trim: true },
    ULR_IMG_2:   { type: String, trim: true },
    ULR_MAP:     { type: String, trim: true },
    modal:       { type: String, trim: true },
    promocion:   { type: String, trim: true, default: null },
    zonas:       { type: [zonaSchema], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventoSchema);