# Backend de Bocado

API hecha con Node.js + Express para Bocado, un e-commerce de excedentes de panadería.

## Cómo arrancarlo

```bash
npm install
```

Creá un archivo `.env` (copiá `.env.example`) y completá la clave secreta de Stripe de prueba:

```
STRIPE_SECRET_KEY=sk_test_...
```

```bash
node index.js
```

Tiene que aparecer: `Servidor corriendo en http://localhost:3000`

## Estructura

```
backend/
├── index.js        → arranca el servidor y conecta todo
├── routes/         → qué función se ejecuta en cada ruta
├── controllers/    → la lógica (productos, panaderías, auth, pagos)
├── data/           → los datos en memoria (productos, panaderías, registros)
└── utils/          → distancia.js (cálculo de distancia entre dos puntos)
```

## Endpoints

| Método | URL | Qué hace |
|---|---|---|
| GET | `/productos` | Lista productos (filtros: `?panaderia=` y `?categoria=`) |
| GET | `/productos/:id` | Trae un producto |
| POST | `/productos` | Agrega un producto |
| PUT | `/productos/:id` | Modifica un producto |
| DELETE | `/productos/:id` | Elimina un producto |
| GET | `/productos/categorias` | Lista de categorías |
| GET | `/panaderias` | Lista de panaderías (con `?lat=&lng=&radio=` ordena por cercanía) |
| POST | `/auth/usuarios/registro` | Registro de cliente |
| POST | `/auth/usuarios/login` | Login de cliente |
| POST | `/auth/panaderias/registro` | Registro de panadería |
| POST | `/auth/panaderias/login` | Login de panadería |
| POST | `/pagos/crear-intento` | Crea el pago con tarjeta en Stripe (modo de prueba) |

## Cuentas de prueba

- Cliente: `usuario1@bocado.com` / `1234`
- Panadería: `ClubDelPan@bocado.com` / `1234`

## Códigos de respuesta

`200` todo bien · `201` creado · `400` datos inválidos · `401` login incorrecto · `404` no existe · `409` la cuenta ya existe

> Los datos están en memoria: al reiniciar el servidor vuelven a los originales.