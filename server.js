const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración PostgreSQL Railway
const pool = new Pool({
  connectionString: 'TU_URL_DE_CONEXIÓN',
  ssl: { rejectUnauthorized: false },
});

app.use(cors());
app.use(express.json());

// Crear tabla si no existe
(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS registro (
      id SERIAL PRIMARY KEY,
      nombre TEXT NOT NULL,
      valor TEXT NOT NULL
    );
  `);
})();

// Rutas
app.get('/', (req, res) => {
  res.send('Backend funcionando correctamente');
});

app.get('/registro', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM registro ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Error al obtener registros');
  }
});

app.post('/registro', async (req, res) => {
  const { nombre, valor } = req.body;
  try {
    await pool.query('INSERT INTO registro (nombre, valor) VALUES ($1, $2)', [nombre, valor]);
    res.status(201).send('Registro agregado');
  } catch (err) {
    res.status(500).send('Error al agregar');
  }
});

app.put('/registro/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, valor } = req.body;
  try {
    await pool.query('UPDATE registro SET nombre=$1, valor=$2 WHERE id=$3', [nombre, valor, id]);
    res.send('Registro actualizado');
  } catch (err) {
    res.status(500).send('Error al editar');
  }
});

app.delete('/registro/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM registro WHERE id=$1', [id]);
    res.send('Registro eliminado');
  } catch (err) {
    res.status(500).send('Error al eliminar');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
