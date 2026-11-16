const fs = require("fs");
const path = require("path");
const productos = require("../data/productos");
const { panaderiasRegistradas } = require("../data/registros");

const CARPETA_IMAGENES = path.join(__dirname, "..", "public", "Imagenes", "Productos");

// Guarda una foto que llega como "data:image/png;base64,...." y devuelve el nombre del archivo
function guardarImagen(dataUrl, id) {
  const coincidencia = /^data:image\/(png|jpe?g|webp);base64,(.+)$/.exec(dataUrl || "");
  if (!coincidencia) return null;
  const extension = coincidencia[1] === "jpeg" ? "jpg" : coincidencia[1];
  const nombreArchivo = `producto-${id}.${extension}`;
  fs.writeFileSync(
    path.join(CARPETA_IMAGENES, nombreArchivo),
    Buffer.from(coincidencia[2], "base64"),
  );
  return nombreArchivo;
}

function obtenerProductos(req, res) {
  const { panaderia, categoria } = req.query;

  const resultado = productos.filter((p) => {
    const cumplePanaderia =
      !panaderia || panaderia === "todas" || p.panaderia === panaderia;
    const cumpleCategoria =
      !categoria || categoria === "todas" || p.categoria === categoria;
    return cumplePanaderia && cumpleCategoria;
  });

  res.json(resultado);
}

function obtenerPanaderias(req, res) {
  res.json([...new Set(productos.map((p) => p.panaderia))].sort());
}

function obtenerCategorias(req, res) {
  res.json([...new Set(productos.map((p) => p.categoria))].sort());
}

function obtenerProductoPorId(req, res) {

  const id = Number(req.params.id);

  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    return res.status(404).json({ mensaje: "Producto no encontrado" });
  }

  res.json(producto);
}


function agregarProducto(req, res) {

  const { nombre, panaderia, categoria, precio, precioOriginal, disponibles } =
    req.body || {};

  if (
    !nombre ||
    !panaderia ||
    !categoria ||
    precio == null ||
    precioOriginal == null
  ) {
    return res.status(400).json({ mensaje: "Faltan datos del producto" });
  }

  const ultimoId =
    productos.length > 0 ? Math.max(...productos.map((p) => p.id)) : 0;

  const nuevoProducto = {
    id: ultimoId + 1,
    nombre,
    panaderia,
    categoria,
    precio: Number(precio),
    precioOriginal: Number(precioOriginal),
    disponibles: Number(disponibles) || 0,
  };

  productos.push(nuevoProducto);

  res.status(201).json(nuevoProducto);
}

function modificarProducto(req, res) {
  const id = Number(req.params.id);

  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    return res.status(404).json({ mensaje: "Producto no encontrado" });
  }

  const { nombre, panaderia, categoria, precio, precioOriginal, disponibles } =
    req.body || {};

  if (nombre !== undefined) producto.nombre = nombre;
  if (panaderia !== undefined) producto.panaderia = panaderia;
  if (categoria !== undefined) producto.categoria = categoria;
  if (precio !== undefined) producto.precio = Number(precio);
  if (precioOriginal !== undefined)
    producto.precioOriginal = Number(precioOriginal);
  if (disponibles !== undefined) producto.disponibles = Number(disponibles);

  res.json(producto);
}

function eliminarProducto(req, res) {
  const id = Number(req.params.id);

  const posicion = productos.findIndex((p) => p.id === id);

  if (posicion === -1) {
    return res.status(404).json({ mensaje: "Producto no encontrado" });
  }

  const eliminado = productos.splice(posicion, 1);

  res.json({ mensaje: "Producto eliminado", producto: eliminado[0] });
}

module.exports = {
  obtenerProductos,
  obtenerPanaderias,
  obtenerCategorias,
  obtenerProductoPorId,
  agregarProducto,
  modificarProducto,
  eliminarProducto,
};