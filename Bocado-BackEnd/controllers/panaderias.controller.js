const panaderias = require("../data/panaderias");
const { calcularDistanciaKm } = require("../utils/distancia");

function obtenerPanaderias(req, res) {
  const { lat, lng, radio } = req.query;

  // sin parámetros: devolvemos todas
  if (lat === undefined && lng === undefined && radio === undefined) {
    return res.json(panaderias);
  }

  const latUsuario = Number(lat);
  const lngUsuario = Number(lng);
  const radioKm = Number(radio);

  if (isNaN(latUsuario) || isNaN(lngUsuario) || isNaN(radioKm)) {
    return res.status(400).json({ mensaje: "Faltan lat, lng o radio (tienen que ser números)" });
  }

  const cercanas = [];

  for (const p of panaderias) {
    const distancia = calcularDistanciaKm(latUsuario, lngUsuario, p.latitud, p.longitud);

    if (distancia <= radioKm) {
      cercanas.push({
        id: p.id,
        nombre: p.nombre,
        telefono:p.telefono,
        direccion: p.direccion,
        horario: p.horario,
        distancia
      });
    }
  }

  cercanas.sort((a, b) => a.distancia - b.distancia);

  res.json(cercanas);
}

module.exports = { obtenerPanaderias };