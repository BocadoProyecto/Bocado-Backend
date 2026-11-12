const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const productosRoutes = require("./routes/productos.routes");
const panaderiasRoutes = require("./routes/panaderias.routes");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Bienvenido a mi backend");
});

app.use("/productos", productosRoutes);
app.use("/panaderias", panaderiasRoutes);

app.use((req, res) => {
  res.status(404).json({ mensaje: "Ruta no encontrada" });
});

const PUERTO = 3000;
app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
});



// ============================================================
// index.js  →  EL SERVIDOR (punto de entrada)
// ------------------------------------------------------------
// Este archivo arranca todo: crea el servidor, lo prepara
// y conecta las rutas. Se ejecuta con:  node index.js
// ============================================================

// 1) Traemos Express y creamos la app (Ficha 1)
/*const express = require("express");
const app = express();

// 2) Traemos las rutas de productos (Ficha 3)
const productosRoutes = require("./routes/productos.routes");

// 3) Permite que el servidor entienda JSON en el body (Ficha 2)
//    Sin esto, req.body llega vacío en POST y PUT.
app.use(express.json());

// 4) Ruta principal (Ficha 1)
app.get("/", (req, res) => {
  res.send("Bienvenido a mi backend");
});

// 5) Todo lo que empiece con /productos lo manejan estas rutas
app.use("/productos", productosRoutes);

// 6) Si piden una ruta que no existe, respondemos 404
app.use((req, res) => {
  res.status(404).json({ mensaje: "Ruta no encontrada" });
});

// 7) Encendemos el servidor (Ficha 1)
const PUERTO = 3000;

app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
});
*/
