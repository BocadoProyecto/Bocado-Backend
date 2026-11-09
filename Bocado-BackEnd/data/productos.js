// ============================================================
// data/productos.js  →  LOS DATOS
// ------------------------------------------------------------
// Acá viven los productos. Por ahora es un array en memoria:
// si apagás el servidor, los cambios se pierden y vuelve a
// arrancar con estos productos. (Más adelante esto será una
// base de datos, pero la idea es la misma.)
// ============================================================

const productos = [
  { id: 1, nombre: "Remera" },
  { id: 2, nombre: "Pantalón" },
  { id: 3, nombre: "Campera" }
];

// Exportamos el array para que el controller lo pueda usar.
module.exports = productos;
