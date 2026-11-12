const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const app = express();
const productosRoutes = require("./routes/productos.routes");
const panaderiasRoutes = require("./routes/panaderias.routes");
const pagosRoutes = require("./routes/pagos.routes");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bienvenido a mi backend");
});

app.use("/productos", productosRoutes);
app.use("/panaderias", panaderiasRoutes);
app.use("/pagos", pagosRoutes);

app.use((req, res) => {
  res.status(404).json({ mensaje: "Ruta no encontrada" });
});

const PUERTO = 3000;
app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
});