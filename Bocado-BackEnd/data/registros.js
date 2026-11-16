const crypto = require("crypto");

// Registros guardados en memoria (igual que productos y panaderías):
// lo que se registre después se pierde al reiniciar el servidor,
// pero las cuentas de prueba de abajo siempre están.
// Cada objeto: { id, nombre, contrasena (hasheada), salt, ...datos opcionales }

function hashearContrasena(contrasena, salt) {
  return crypto.scryptSync(contrasena, salt, 64).toString("hex");
}

// Cuenta de prueba de usuario  -> nombre: "usuario1"   contrasena: "1234"
const saltUsuario = "salt-fijo-usuario1";
// Cuenta de prueba de panadería -> nombre: "Club del Pan" contrasena: "1234"
const saltPanaderia = "salt-fijo-ClubDelPan";

const usuarios = [
  {
    id: 1,
    nombre: "usuario1",
    contrasena: hashearContrasena("1234", saltUsuario),
    salt: saltUsuario,
    email: "usuario1@bocado.com",
  },
];

const panaderiasRegistradas = [
  {
    id: 1,
    nombre: "Club del Pan",
    contrasena: hashearContrasena("1234", saltPanaderia),
    salt: saltPanaderia,
    email: "ClubDelPan@bocado.com",
    telefono: "+598 2000 0000",
    direccion: "Av. 18 de Julio 1000, Montevideo",
  },
];

module.exports = { usuarios, panaderiasRegistradas };
