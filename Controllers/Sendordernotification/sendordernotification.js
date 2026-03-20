const { Resend } = require('resend')

// ── Variables de entorno ──────────────────────────────────────
const LOGO_URL   = process.env.LOGO_URL   || 'https://res.cloudinary.com/dtype2a4n/image/upload/v1773824168/logo_app_2_on4fxz.png'
const SITE_URL   = process.env.SITE_URL   || '#'
const COLOR_BASE = process.env.COLOR_BASE || '#0a1225'
const COLOR_SEC  = process.env.COLOR_SEC  || '#121d2f'
const COLOR_LINK = process.env.COLOR_LINK || '#06B6D4'
const COLOR_TEXT = process.env.COLOR_TEXT || '#f7f7f7'
const COLOR_SUB  = process.env.COLOR_SUB  || '#d0d3d6'

// ── Configuración Resend ──────────────────────────────────────
const client = new Resend(process.env.RESEND_API_KEY)

// ── Enviar notificación de orden ──────────────────────────────
const sendOrderNotification = async (orden) => {
  try {
    const {
      numeroPedido,
      comprador,
      evento,
      zonas,
      subtotal,
      cargoServicio,
      total,
      tipoPago,
      codigoPromo,
      estatus,
      userEmail,
    } = orden

    const destinatario = userEmail

    // ── Filas de zonas ────────────────────────────────────────
    const filasZonas = zonas.map(z => `
      <tr>
        <td style="padding:10px 16px;font-size:13px;color:${COLOR_SUB};border-bottom:1px solid rgba(255,255,255,0.05);">
          ${z.zona}
        </td>
        <td style="padding:10px 16px;font-size:13px;color:${COLOR_SUB};border-bottom:1px solid rgba(255,255,255,0.05);text-align:center;">
          ${z.cantidad}
        </td>
        <td style="padding:10px 16px;font-size:13px;color:${COLOR_TEXT};border-bottom:1px solid rgba(255,255,255,0.05);text-align:right;font-weight:700;">
          $${z.subtotal.toLocaleString('es-MX')} MXN
        </td>
      </tr>
    `).join('')

    // ── Fila código promo ─────────────────────────────────────
    const filaPromo = codigoPromo ? `
      <tr>
        <td colspan="2" style="padding:10px 16px;font-size:12px;color:${COLOR_LINK};">
          Código aplicado: <strong>${codigoPromo}</strong>
        </td>
        <td style="padding:10px 16px;font-size:12px;color:${COLOR_LINK};text-align:right;font-weight:700;">
          Descuento incluido
        </td>
      </tr>
    ` : ''

    await client.emails.send({
      from:    'Circle Tickets <hola@circletickets.store>',
      to:      destinatario,
      subject: `Confirmación de pedido ${numeroPedido} — Circle Tickets`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 32px 24px;background:${COLOR_BASE};border-radius:16px;">

          <!-- Header -->
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:28px;">
            <img src="${LOGO_URL}" alt="Circle Tickets" width="44" height="44"
              style="display:block;border-radius:8px;" />
            <h1 style="font-size:18px;font-weight:900;letter-spacing:1px;color:${COLOR_TEXT};margin:0;">
              CIRCLE TICKETS
            </h1>
          </div>

          <!-- Saludo -->
          <p style="color:${COLOR_SUB};margin:0 0 6px;font-size:15px;line-height:1.6;">
            Hola <strong style="color:${COLOR_TEXT};">${comprador.nombre} ${comprador.apellido}</strong>,
          </p>
          <p style="color:${COLOR_SUB};margin:0 0 24px;font-size:15px;line-height:1.6;">
            Hemos recibido tu pedido y está siendo procesado.
            Te notificaremos cuando sea confirmado.
          </p>

          <!-- Número de pedido -->
          <div style="background:${COLOR_SEC};border:1px solid rgba(6,182,212,0.2);border-radius:12px;padding:18px 22px;margin-bottom:24px;text-align:center;">
            <p style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${COLOR_SUB};opacity:0.6;margin:0 0 6px;">
              Número de pedido
            </p>
            <p style="font-size:22px;font-weight:900;letter-spacing:3px;color:${COLOR_LINK};margin:0;">
              ${numeroPedido}
            </p>
          </div>

          <!-- Imagen del evento -->
          ${evento.imagen ? `
          <div style="margin-bottom:24px;border-radius:12px;overflow:hidden;">
            <img src="${evento.imagen}" alt="${evento.artista}" width="100%"
              style="display:block;width:100%;max-height:220px;object-fit:cover;border-radius:12px;" />
          </div>
          ` : ''}

          <!-- Datos del evento -->
          <div style="background:${COLOR_SEC};border-radius:12px;padding:18px 22px;margin-bottom:24px;">
            <p style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${COLOR_LINK};margin:0 0 14px;opacity:0.8;">
              Evento
            </p>
            <p style="font-size:18px;font-weight:900;color:${COLOR_TEXT};margin:0 0 6px;">${evento.artista}</p>
            ${evento.tour ? `<p style="font-size:12px;color:${COLOR_LINK};margin:0 0 10px;opacity:0.8;">${evento.tour}</p>` : ''}
            <p style="font-size:13px;color:${COLOR_SUB};margin:0 0 4px;">📅 ${evento.fecha}</p>
            <p style="font-size:13px;color:${COLOR_SUB};margin:0;">📍 ${evento.recinto} · ${evento.ciudad}</p>
          </div>

          <!-- Detalle de boletos -->
          <div style="background:${COLOR_SEC};border-radius:12px;overflow:hidden;margin-bottom:24px;">
            <p style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${COLOR_LINK};margin:0;padding:14px 16px;opacity:0.8;border-bottom:1px solid rgba(255,255,255,0.06);">
              Detalle del pedido
            </p>
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="background:rgba(6,182,212,0.05);">
                  <th style="padding:10px 16px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${COLOR_SUB};opacity:0.5;text-align:left;">Zona</th>
                  <th style="padding:10px 16px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${COLOR_SUB};opacity:0.5;text-align:center;">Cant.</th>
                  <th style="padding:10px 16px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${COLOR_SUB};opacity:0.5;text-align:right;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${filasZonas}
                ${filaPromo}
              </tbody>
            </table>

            <!-- Totales -->
            <div style="padding:14px 16px;border-top:1px solid rgba(255,255,255,0.06);">
              <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                <span style="font-size:12px;color:${COLOR_SUB};opacity:0.5;">Subtotal</span>
                <span style="font-size:12px;color:${COLOR_SUB};">$${subtotal.toLocaleString('es-MX')} MXN</span>
              </div>
              <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
                <span style="font-size:12px;color:${COLOR_SUB};opacity:0.5;">Cargo por servicio (10%)</span>
                <span style="font-size:12px;color:${COLOR_SUB};">$${cargoServicio.toLocaleString('es-MX')} MXN</span>
              </div>
              <div style="display:flex;justify-content:space-between;">
                <span style="font-size:15px;font-weight:800;color:${COLOR_TEXT};">Total</span>
                <span style="font-size:15px;font-weight:900;color:${COLOR_LINK};">$${total.toLocaleString('es-MX')} MXN</span>
              </div>
            </div>
          </div>

          <!-- Método de pago y estatus -->
          <div style="background:${COLOR_SEC};border-radius:12px;padding:14px 18px;margin-bottom:24px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:0;">
                  <p style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${COLOR_SUB};opacity:0.5;margin:0 0 4px;">Método de pago</p>
                  <p style="font-size:14px;font-weight:700;color:${COLOR_TEXT};margin:0;text-transform:capitalize;">${tipoPago}</p>
                </td>
                <td style="padding:0;text-align:right;">
                  <p style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${COLOR_SUB};opacity:0.5;margin:0 0 4px;">Estatus</p>
                  <p style="font-size:13px;font-weight:800;color:${COLOR_LINK};margin:0;text-transform:capitalize;">${estatus}</p>
                </td>
              </tr>
            </table>
          </div>

          <!-- Consultar estatus -->
          <div style="text-align:center;margin-bottom:28px;">
            <a href="https://www.circletickets.store"
              style="display:inline-block;padding:13px 32px;background:${COLOR_LINK};color:#000;font-size:14px;font-weight:800;letter-spacing:0.5px;border-radius:10px;text-decoration:none;">
              Consultar estatus en tu perfil
            </a>
          </div>

          <!-- Footer -->
          <div style="padding-top:20px;border-top:1px solid rgba(255,255,255,0.07);text-align:center;">
            <p style="color:${COLOR_SUB};font-size:12px;margin:0 0 8px;line-height:1.7;opacity:0.6;">
              Circle Tickets es responsable del tratamiento y protección de tus datos personales.
              La información recabada se utilizará únicamente para la gestión de tus órdenes,
              atención a clientes y envío de información relevante sobre servicios y eventos.
            </p>
            <p style="font-size:11px;color:${COLOR_SUB};opacity:0.4;letter-spacing:1px;margin:0;">
              © CIRCLE TICKETS 2025 — Todos los derechos reservados.
            </p>
          </div>

        </div>
      `,
    })

    console.log(`[sendOrderNotification] Correo enviado a ${destinatario} — ${numeroPedido}`)

  } catch (error) {
    console.error('[sendOrderNotification] Error al enviar correo:', error.message)
  }
}

module.exports = sendOrderNotification