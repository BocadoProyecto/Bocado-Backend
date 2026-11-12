const express = require("express");
const router = express.Router();
const { crearIntentoDePago } = require("../controllers/pagos.controller");

router.post("/crear-intento", crearIntentoDePago);

module.exports = router;