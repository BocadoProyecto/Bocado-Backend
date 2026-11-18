const fs = require("fs");
// Devuelve un mensaje de error si los números no sirven, o "" si está todo bien
function validarNumeros(precio, precioOriginal, disponibles) {
  if (isNaN(precio) || precio <= 0) {
    return "El precio tiene que ser un número mayor a 0";
  }
  if (isNaN(precioOriginal) || precioOriginal <= 0) {
    return "El precio original tiene que ser un número mayor a 0";
  }
  if (precio > precioOriginal) {
    return "El precio de excedente no puede ser mayor al original";
  }
  if (isNaN(disponibles) || disponibles < 0) {
    return "Las unidades disponibles no pueden ser negativas";
  }
  return "";
}
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
    const stock = disponibles === undefined ? 0 : Number(disponibles);
  const mensajeError = validarNumeros(Number(precio), Number(precioOriginal), stock);
  if (mensajeError) {
    return res.status(400).json({ mensaje: mensajeError });
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

  // calculamos cómo quedaría el producto ANTES de guardarlo
  const nuevoPrecio = precio !== undefined ? Number(precio) : producto.precio;
  const nuevoOriginal =
    precioOriginal !== undefined ? Number(precioOriginal) : producto.precioOriginal;
  const nuevoStock =
    disponibles !== undefined ? Number(disponibles) : producto.disponibles;

  const mensajeError = validarNumeros(nuevoPrecio, nuevoOriginal, nuevoStock);
  if (mensajeError) {
    return res.status(400).json({ mensaje: mensajeError });
  }

  // si todo está bien, recién ahora guardamos
  if (nombre !== undefined) producto.nombre = nombre;
  if (panaderia !== undefined) producto.panaderia = panaderia;
  if (categoria !== undefined) producto.categoria = categoria;
  producto.precio = nuevoPrecio;
  producto.precioOriginal = nuevoOriginal;
  producto.disponibles = nuevoStock;

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