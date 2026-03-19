const jwt  = require('jsonwebtoken')
const User = require('../Models/userModel')

const authMiddleware = async (req, res, next) => {
  try {
    // ── Extraer token del header ───────────────────────────────
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ ok: false, message: 'Token no proporcionado' })
    }

    const token = authHeader.split(' ')[1]

    // ── Verificar y decodificar ────────────────────────────────
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // ── Buscar usuario en BD ───────────────────────────────────
    const user = await User.findById(decoded._id).select('-codigo -expiresAt -intentos')

    if (!user) {
      return res.status(401).json({ ok: false, message: 'Usuario no encontrado' })
    }

    // ── Inyectar usuario en el request ────────────────────────
    req.user = user
    next()

  } catch (error) {
    // Token expirado o malformado
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ ok: false, message: 'La sesión ha expirado' })
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ ok: false, message: 'Token inválido' })
    }

    console.error('Error en authMiddleware:', error)
    res.status(500).json({ ok: false, message: 'Error de autenticación' })
  }
}

module.exports = authMiddleware