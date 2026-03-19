const Order                  = require('../../Models/orderNodel')
const sendOrderNotification  = require('../Sendordernotification/sendordernotification')

// ── Crear orden ───────────────────────────────────────────────
const createOrder = async (req, res) => {
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
    } = req.body

    // ── Validaciones básicas ───────────────────────────────────
    if (!numeroPedido) {
      return res.status(400).json({ ok: false, message: 'El número de pedido es requerido' })
    }

    if (!comprador?.nombre || !comprador?.apellido || !comprador?.email || !comprador?.telefono) {
      return res.status(400).json({ ok: false, message: 'Los datos del comprador son incompletos' })
    }

    if (!evento?.eventoId || !evento?.artista || !evento?.fecha || !evento?.recinto || !evento?.ciudad) {
      return res.status(400).json({ ok: false, message: 'Los datos del evento son incompletos' })
    }

    if (!zonas || !Array.isArray(zonas) || zonas.length === 0) {
      return res.status(400).json({ ok: false, message: 'Debe incluir al menos una zona' })
    }

    for (const zona of zonas) {
      if (!zona.zona || zona.precio == null || zona.cantidad == null || zona.subtotal == null) {
        return res.status(400).json({ ok: false, message: `Zona inválida: "${zona.zona || 'Sin nombre'}"` })
      }
    }

    if (!tipoPago || !['tarjeta', 'transferencia'].includes(tipoPago)) {
      return res.status(400).json({ ok: false, message: 'El tipo de pago debe ser "tarjeta" o "transferencia"' })
    }

    // ── Comprobante placeholder ────────────────────────────────
    const comprobante = tipoPago === 'transferencia' ? 'archivo_cargado' : null

    // ── Usuario logueado ───────────────────────────────────────
    const { _id: userId, email: userEmail } = req.user

    // ── Verificar que el pedido no exista ya ───────────────────
    const existe = await Order.findOne({ numeroPedido })
    if (existe) {
      return res.status(409).json({ ok: false, message: `El pedido ${numeroPedido} ya existe` })
    }

    // ── Crear y guardar la orden ───────────────────────────────
    const nuevaOrden = await Order.create({
      userId,
      userEmail,
      numeroPedido,
      comprador,
      evento,
      zonas,
      subtotal,
      cargoServicio: cargoServicio ?? 180,
      total,
      tipoPago,
      comprobante,
      codigoPromo:   codigoPromo || null,
      estatus:       'pendiente',
    })

    // ── Enviar notificación por correo ─────────────────────────
    // Se ejecuta después de guardar — no bloquea la respuesta si falla
    await sendOrderNotification(nuevaOrden)

    res.status(201).json({
      ok:      true,
      message: 'Orden creada correctamente',
      data:    nuevaOrden,
    })

  } catch (error) {
    console.error('Error al crear la orden:', error)
    res.status(500).json({
      ok:      false,
      message: 'Error al crear la orden',
      error:   error.message,
    })
  }
}

// ── Obtener órdenes del usuario logueado ──────────────────────
const getMyOrders = async (req, res) => {
  try {
    const ordenes = await Order
      .find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('-__v')

    res.status(200).json({
      ok:    true,
      total: ordenes.length,
      data:  ordenes,
    })

  } catch (error) {
    console.error('Error al obtener órdenes:', error)
    res.status(500).json({
      ok:      false,
      message: 'Error al obtener las órdenes',
      error:   error.message,
    })
  }
}

// ── Obtener una orden por numeroPedido ────────────────────────
const getOrderByNumber = async (req, res) => {
  try {
    const { numeroPedido } = req.params

    const orden = await Order
      .findOne({ numeroPedido, userId: req.user._id })
      .select('-__v')

    if (!orden) {
      return res.status(404).json({ ok: false, message: 'Orden no encontrada' })
    }

    res.status(200).json({ ok: true, data: orden })

  } catch (error) {
    console.error('Error al obtener la orden:', error)
    res.status(500).json({
      ok:      false,
      message: 'Error al obtener la orden',
      error:   error.message,
    })
  }
}

module.exports = { createOrder, getMyOrders, getOrderByNumber }