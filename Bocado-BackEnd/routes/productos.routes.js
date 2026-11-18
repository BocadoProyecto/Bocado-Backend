// IMPORTANTE: en index.js estas rutas se montan en "/productos",
// así que acá "/" significa "/productos" y "/:id" significa
// "/productos/:id".

const express = require("express");
const router = express.Router();

const {
  obtenerProductos,

  obtenerCategorias,
  obtenerProductoPorId,
  agregarProducto,
  modificarProducto,
  eliminarProducto
} = require("../controllers/productos.controller");

//        MÉTODO   RUTA            FUNCIÓN DEL CONTROLLER
router.get(    "/",           obtenerProductos);      // Listar todos (con filtros)

router.get(    "/categorias", obtenerCategorias);     // Lista de categorías (ANTES de "/:id")
router.get(    "/:id",        obtenerProductoPorId);  // Buscar uno
router.post(   "/",           agregarProducto);       // Agregar
router.put(    "/:id",        modificarProducto);     // Modificar
router.delete( "/:id",        eliminarProducto);      // Eliminar

module.exports = router;