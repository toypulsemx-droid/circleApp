const mongoose = require('mongoose')

// ── Sub-esquema: boleto por zona ──────────────────────────────
const zonaSchema = new mongoose.Schema(
  {
    zona:     { type: String, required: true },
    precio:   { type: Number, required: true },
    cantidad: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true },
  },
  { _id: false }
)

// ── Esquema principal ─────────────────────────────────────────
const orderSchema = new mongoose.Schema(
  {
    // ── Relación con User ──────────────────────────────────────
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    userEmail: {
      type:      String,
      required:  true,
      lowercase: true,
      trim:      true,
    },

    // ── Identificador legible ──────────────────────────────────
    numeroPedido: {
      type:     String,
      required: true,
      unique:   true,
      trim:     true,
    },

    // ── Datos del comprador (formulario checkout) ──────────────
    comprador: {
      nombre:   { type: String, required: true, trim: true },
      apellido: { type: String, required: true, trim: true },
      email:    { type: String, required: true, trim: true, lowercase: true },
      telefono: { type: String, required: true, trim: true },
      curp:     { type: String, default: null,  trim: true },
    },

    // ── Evento ─────────────────────────────────────────────────
    evento: {
      eventoId: { type: String, required: true },
      artista:  { type: String, required: true },
      tour:     { type: String, default: null  },
      fecha:    { type: String, required: true },
      recinto:  { type: String, required: true },
      ciudad:   { type: String, required: true },
      imagen:   { type: String, default: null  },
    },

    // ── Detalle de zonas / boletos ─────────────────────────────
    zonas: {
      type:     [zonaSchema],
      required: true,
    },

    // ── Totales ────────────────────────────────────────────────
    subtotal:      { type: Number, required: true },
    cargoServicio: { type: Number, required: true, default: 180 },
    total:         { type: Number, required: true },

    // ── Pago ───────────────────────────────────────────────────
    tipoPago: {
      type:     String,
      required: true,
      enum:     ['tarjeta', 'transferencia'],
    },

    comprobante: {
      type:    String,
      default: null,
    },

    // ── Código promocional aplicado ────────────────────────────
    codigoPromo: {
      type:    String,
      default: null,
      trim:    true,
    },

    // ── Estatus ────────────────────────────────────────────────
    estatus: {
      type:    String,
      enum:    ['pendiente', 'pagado', 'cancelado', 'expirado', 'procesando'],
      default: 'pendiente',
    },
  },
  {
    timestamps: true,
  }
)

// ── Índices ───────────────────────────────────────────────────
orderSchema.index({ userId:    1 })
orderSchema.index({ userEmail: 1 })
orderSchema.index({ estatus:   1 })

const Order = mongoose.model('Order', orderSchema)
module.exports = Order