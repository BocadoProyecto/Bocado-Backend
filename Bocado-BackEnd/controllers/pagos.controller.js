const Stripe = require("stripe");
const productos = require("../data/productos");

const MONEDA = "brl";

function obtenerStripe() {
  const clave = process.env.STRIPE_SECRET_KEY;
  if (!clave) {
    return null;
  }
  return new Stripe(clave);
}

async function crearIntentoDePago(req, res) {
  const { ids } = req.body || {};

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ mensaje: "El carrito está vacío" });
  }

  let total = 0;
  for (const idCrudo of ids) {
    const id = Number(idCrudo);
    const producto = productos.find((p) => p.id === id);

    if (!producto) {
      return res
        .status(400)
        .json({ mensaje: `El producto ${idCrudo} no existe` });
    }

    total = total + producto.precio;
  }

  const stripe = obtenerStripe();
  if (!stripe) {
    return res
      .status(500)
      .json({ mensaje: "Falta STRIPE_SECRET_KEY en el archivo .env del backend" });
  }

  try {
    const intento = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Stripe usa centavos
      currency: MONEDA,
      automatic_payment_methods: { enabled: true, allow_redirects: "never" },
    });

    res.json({ clientSecret: intento.client_secret, total });
  } catch (error) {
    console.error("Error de Stripe:", error.message);
    res
      .status(500)
      .json({ mensaje: `No se pudo iniciar el pago: ${error.message}` });
  }
}

module.exports = { crearIntentoDePago };