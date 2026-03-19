const bcrypt = require('bcrypt')
const jwt    = require('jsonwebtoken')
const User   = require('../../Models/userModel')

const verifyCode = async (req, res) => {
  try {
    const { email, codigo } = req.body

    if (!email || !codigo) {
      return res.status(400).json({ message: 'Correo y código son obligatorios' })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    if (user.verified) {
      return res.status(400).json({ message: 'El código ya fue utilizado' })
    }

    if (user.expiresAt < new Date()) {
      return res.status(400).json({ message: 'El código ha expirado, solicita uno nuevo' })
    }

    if (user.intentos >= 3) {
      return res.status(400).json({ message: 'Demasiados intentos, solicita un nuevo código' })
    }

    const valido = await bcrypt.compare(codigo, user.codigo)

    if (!valido) {
      await User.findOneAndUpdate(
        { email },
        { $inc: { intentos: 1 } },
        { returnDocument: 'after' }
      )
      const restantes = 3 - (user.intentos + 1)
      return res.status(400).json({
        message: `Código incorrecto. Intentos restantes: ${restantes}`,
      })
    }

    // ── Código correcto — limpiar OTP y nulificar expiresAt ────
    // expiresAt: null es crítico para que el TTL no borre el documento
    await user.clearOtp()
    user.verified = true
    await user.save()

    // ── Generar JWT ────────────────────────────────────────────
    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    return res.status(200).json({
      message: 'Código verificado correctamente',
      token,
      user: {
        _id:   user._id,
        email: user.email,
      },
    })

  } catch (error) {
    console.error('[verifyCode]', error.message)
    return res.status(500).json({ message: error.message })
  }
}

module.exports = verifyCode