const Event = require("../../Models/eventModel");

const getEvents = async (req, res) => {
  try {
    const eventos = await Event.find().sort({ createdAt: -1 });

    res.status(200).json({
      ok: true,
      total: eventos.length,
      data: eventos
    });
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    res.status(500).json({
      ok: false,
      message: "Error al obtener eventos",
      error: error.message
    });
  }
};

module.exports = getEvents
