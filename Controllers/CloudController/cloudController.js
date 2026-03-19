const cloudinary = require('../../Config/clouDinaryConnect')

const subirComprobante = async (req, res) => {
  try {
    // Tomar el primer archivo recibido
    const archivo = req.files && req.files[0]

    if (!archivo) {
      return res.status(400).json({ message: 'No se recibió ninguna imagen' })
    }

    // Convertir buffer a base64
    const base64 = archivo.buffer.toString('base64')
    const dataURI = `data:${archivo.mimetype};base64,${base64}`

    // Subir a Cloudinary
    const resultado = await cloudinary.uploader.upload(dataURI, {
      folder: 'comprobantes_spei',
      resource_type: 'auto'
    })

    return res.status(200).json({
      message: 'Imagen subida correctamente',
      url: resultado.secure_url,
      public_id: resultado.public_id
    })

  } catch (error) {
  console.error('Error completo:', error)
  return res.status(500).json({
    message: 'Error al subir imagen',
    error: error.message
  })
}
}

module.exports = subirComprobante
