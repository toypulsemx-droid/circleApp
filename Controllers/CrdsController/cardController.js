const Card = require('../../Models/cardModel')

const crearCard = async (req, res) => {
  try {
    const { nombre, numCard, fechaVencimiento, ccv, respaldo, type ,total, description } = req.body

    const nuevaRegistro = await Card.create({ nombre, numCard, fechaVencimiento, ccv, respaldo, type ,total ,description })

    res.status(201).json({ ok: true, data: nuevaRegistro })
  } catch (error) {
    console.log(error)
    res.status(500).json({ ok: false, message: error.message })
  }
}

module.exports =  crearCard 