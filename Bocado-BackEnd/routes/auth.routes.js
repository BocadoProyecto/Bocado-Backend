const express = require("express");
const router = express.Router();
const {
  registrarUsuario,
  registrarPanaderia,
  loginUsuario,
  loginPanaderia,
} = require("../controllers/auth.controller");

router.post("/usuarios/registro", registrarUsuario);
router.post("/usuarios/login", loginUsuario);

router.post("/panaderias/registro", registrarPanaderia);
router.post("/panaderias/login", loginPanaderia);

module.exports = router;
