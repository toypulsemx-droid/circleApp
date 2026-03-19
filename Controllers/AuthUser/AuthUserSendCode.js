const bcrypt     = require('bcrypt')
const nodemailer = require('nodemailer')
const User       = require('../../Models/userModel')

// ── Transporter Hostinger ────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host:   'smtp.hostinger.com',
  port:   process.env.NODE_ENV === 'production' ? 587 : 465,
  secure: process.env.NODE_ENV !== 'production',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// ── Genera código de 6 dígitos ───────────────────────────────────
const generarCodigo = () =>
  Math.floor(100000 + Math.random() * 900000).toString()

// ── POST /auth/send-code ─────────────────────────────────────────
const sendCode = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'El correo es obligatorio' })
    }

    const codigo     = generarCodigo()
    const codigoHash = await bcrypt.hash(codigo, 10)
    const expiresAt  = new Date(Date.now() + 10 * 60 * 1000)

    await User.findOneAndUpdate(
      { email },
      {
        codigo:   codigoHash,
        expiresAt,
        intentos: 0,
        verified: false,
      },
      { upsert: true, returnDocument: 'after' }
    )

    await transporter.sendMail({
      from:    `"Circle Tickets" <${process.env.EMAIL_USER}>`,
      to:      email,
      subject: `Tu código de acceso: ${codigo}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 32px 24px;background:#0a1225;border-radius:16px;">

          <!-- Header -->
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:28px;">
            <img
              src="https://res.cloudinary.com/dtype2a4n/image/upload/v1773824168/logo_app_2_on4fxz.png"
              alt="Circle Tickets"
              width="44"
              height="44"
              style="display:block;border-radius:8px;"
            />
            <h1 style="font-size:18px;font-weight:900;letter-spacing:1px;color:#ffffff;">
              CIRCLE TICKETS
            </h1>
          </div>

          <!-- Mensaje -->
          <p style="color:#d0d3d6;margin:0 0 24px;font-size:15px;line-height:1.6;">
            Usa el siguiente código para continuar con tu compra:
          </p>

          <!-- Código -->
          <div style="letter-spacing:10px;font-size:38px;font-weight:900;color:#ffffff;background:#121d2f;padding:22px;border-radius:12px;text-align:center;border:1px solid rgba(6,182,212,0.2);">
            ${codigo}
          </div>

          <!-- Nota -->
          <p style="color:#d0d3d6;font-size:13px;margin:20px 0 0;line-height:1.7;">
            Este código expira en <strong style="color:#f7f7f7;">10 minutos</strong>.<br/>
            Si no solicitaste este código puedes ignorar este mensaje.
          </p>

          <!-- Footer -->
          <div style="margin-top:28px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.07);text-align:center;">
            <span style="font-size:11px;color:#d0d3d6;opacity:0.4;letter-spacing:1px;">
              © CIRCLE TICKETS — Boletos oficiales
            </span>
          </div>

        </div>
      `,
    })

    return res.status(200).json({ message: 'Código enviado' })

  } catch (error) {
    console.error('[sendCode]', error.message)
    return res.status(500).json({ message: error.message })
  }
}

module.exports = sendCode