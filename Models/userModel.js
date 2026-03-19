const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    email: {
      type:      String,
      required:  true,
      unique:    true,
      lowercase: true,
      trim:      true,
    },

    codigo: {
      type:    String,   // hash bcrypt del OTP
      default: null,
    },

    expiresAt: {
      type:    Date,
      default: null,
    },

    intentos: {
      type:    Number,
      default: 0,
    },

    verified: {
      type:    Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// ── TTL: solo borra documentos donde expiresAt tiene fecha
// Si expiresAt es null, MongoDB lo ignora y NO borra el documento
userSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// ── Limpia el OTP después de verificar ────────────────────────
// Poner expiresAt en null es crítico para que el TTL no borre el usuario
userSchema.methods.clearOtp = async function () {
  this.codigo    = null
  this.expiresAt = null
  this.intentos  = 0
  await this.save()
}

// ── Verifica si el OTP expiró ──────────────────────────────────
userSchema.methods.otpExpirado = function () {
  if (!this.expiresAt) return true
  return new Date() > this.expiresAt
}

const User = mongoose.model('User', userSchema)
module.exports = User