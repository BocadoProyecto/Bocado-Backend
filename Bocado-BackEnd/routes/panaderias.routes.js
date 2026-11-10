const express = require("express");
const router = express.Router();
const { obtenerPanaderias } = require("../controllers/panaderias.controller");

router.get("/", obtenerPanaderias);

module.exports = router;