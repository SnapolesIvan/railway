const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Configurar la conexión con Railway PostgreSQL
const pool = new Pool({
  connectionString: 'postgresql://postgres:zWvCimOFvUXPSXDPiJBKkqPvgboEtGvv@gondola.proxy.rlwy.net:56083/railway',
  ssl: { rejectUnauthorized: false }
});

// Middleware
app.use(express.json());
app.use(cors());

// (Opcional) Crear tabla si no existe
const crearTabla = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS registro (
        id SERIAL PRIMARY KEY,
        nombre TEXT NOT NULL,
        valor TEXT NOT NULL
      )
    `);
    console.log('Tabla verificada o creada con éxito');
  } catch (error) {
    console.error('Error al crear tabla:', error.message);
  }
};
crearTabla();

// Rutas
app.get('/registro', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM registro ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al consultar registros:', err.message);
    res.status(500).send('No se pueden consultar los registros');
  }
});

app.post('/registro', async (req, res) => {
  const { nombre, valor } = req.body;
  if (!nombre || !valor) return res.status(400).send('Faltan campos obligatorios');

  try {
    await pool.query('INSERT INTO registro (nombre, valor) VALUES ($1, $2)', [nombre, valor]);
    res.status(201).send('Registro agregado exitosamente');
  } catch (err) {
    console.error('Error al agregar registro:', err.message);
    res.status(500).send('No se pudo agregar el registro');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

