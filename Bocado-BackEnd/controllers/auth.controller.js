const crypto = require("crypto");
const { usuarios, panaderiasRegistradas } = require("../data/registros");

// Token según el tipo de cuenta
const TOKEN_USUARIO = 1;
const TOKEN_PANADERIA = 2;

function hashearContrasena(contrasena, salt) {
  return crypto.scryptSync(contrasena, salt, 64).toString("hex");
}

function contrasenaCorrecta(contrasena, registro) {
  const hash = hashearContrasena(contrasena, registro.salt);
  return crypto.timingSafeEqual(
    Buffer.from(hash),
    Buffer.from(registro.contrasena),
  );
}

function buscarPorNombre(lista, nombre) {
  const buscado = nombre.trim().toLowerCase();
  return lista.find((r) => r.nombre.toLowerCase() === buscado);
}

// ---------- REGISTRO ----------
function crearRegistro(lista, camposExtra) {
  return function (req, res) {
    const { nombre, contrasena } = req.body || {};

    if (
      typeof nombre !== "string" ||
      nombre.trim() === "" ||
      typeof contrasena !== "string" ||
      contrasena === ""
    ) {
      return res.status(400).json({ mensaje: "Faltan nombre o contrasena" });
    }

    if (buscarPorNombre(lista, nombre)) {
      return res
        .status(409)
        .json({ mensaje: "Ya existe una cuenta con ese nombre" });
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const nuevo = {
      id: lista.length + 1,
      nombre: nombre.trim(),
      contrasena: hashearContrasena(contrasena, salt),
      salt,
    };

    // guardamos los campos extra que lleguen del front (email, direccion, etc.)
    for (const campo of camposExtra) {
      if (req.body[campo] !== undefined) {
        nuevo[campo] = req.body[campo];
      }
    }

    lista.push(nuevo);
    res.status(201).json({ mensaje: "Cuenta creada" });
  };
}

const registrarUsuario = crearRegistro(usuarios, ["email"]);
const registrarPanaderia = crearRegistro(panaderiasRegistradas, [
  "email",
  "telefono",
  "direccion",
]);

// ---------- INICIO DE SESIÓN ----------
function crearLogin(lista, token) {
  return function (req, res) {
    const { nombre, contrasena } = req.body || {};

    if (typeof nombre !== "string" || typeof contrasena !== "string") {
      return res.status(400).json({ mensaje: "Faltan nombre o contrasena" });
    }

    const registro = buscarPorNombre(lista, nombre);

    if (!registro || !contrasenaCorrecta(contrasena, registro)) {
      return res
        .status(401)
        .json({ ok: false, mensaje: "Nombre o contraseña incorrectos" });
    }

    res.json({
      ok: true,
      mensaje: "Inicio de sesión correcto",
      token,
      nombre: registro.nombre,
    });
  };
}

const loginUsuario = crearLogin(usuarios, TOKEN_USUARIO);
const loginPanaderia = crearLogin(panaderiasRegistradas, TOKEN_PANADERIA);

module.exports = {
  registrarUsuario,
  registrarPanaderia,
  loginUsuario,
  loginPanaderia,
};
