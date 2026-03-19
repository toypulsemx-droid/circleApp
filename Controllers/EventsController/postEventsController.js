const Event = require("../../Models/eventModel");

const createEvents = async (req, res) => {
  try {
    const data = req.body;

    // Si viene un solo evento, lo convertimos en arreglo
    const eventos = Array.isArray(data) ? data : [data];

    if (eventos.length === 0) {
      return res.status(400).json({ message: "No se enviaron eventos" });
    }

    for (const evento of eventos) {
      if (!evento.zonas || !Array.isArray(evento.zonas) || evento.zonas.length === 0) {
        return res.status(400).json({
          message: `El evento "${evento.artista || "Sin nombre"}" debe tener al menos una zona`
        });
      }

      for (const zona of evento.zonas) {
        if (!zona.nombre || zona.precio == null || zona.precio < 0) {
          return res.status(400).json({
            message: `Zona inválida en el evento "${evento.artista || "Sin nombre"}"`
          });
        }

        // Validar que color sea un hex válido si viene en el payload
        if (zona.color && !/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(zona.color)) {
          return res.status(400).json({
            message: `Color inválido en zona "${zona.nombre}" del evento "${evento.artista || "Sin nombre"}". Usa formato hex: #fff o #ffffff`
          });
        }
      }
    }

    const eventosGuardados = await Event.insertMany(eventos);

    res.status(201).json({
      ok: true,
      message: `${eventosGuardados.length} evento(s) creado(s) correctamente`,
      total: eventosGuardados.length,
      data: eventosGuardados
    });

  } catch (error) {
    console.error("Error al crear eventos:", error);
    res.status(500).json({
      ok: false,
      message: "Error al crear eventos",
      error: error.message
    });
  }
};

module.exports = createEvents;