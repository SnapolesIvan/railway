const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: 'postgresql://postgres:zWvCimOFvUXPSXDPiJBKkqPvgboEtGvv@gondola.proxy.rlwy.net:56083/railway',
  ssl: { rejectUnauthorized: false }
});

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Crear tabla si no existe
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS registro (
        id SERIAL PRIMARY KEY,
        nombre TEXT NOT NULL,
        valor TEXT NOT NULL
      );
    `);
    console.log('Tabla creada/verificada');
  } catch (error) {
    console.error('Error al crear tabla:', error.message);
  }
})();

// Rutas API
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
  if (!nombre || !valor) return res.status(400).send('Nombre y valor son requeridos');
  try {
    await pool.query('INSERT INTO registro (nombre, valor) VALUES ($1, $2)', [nombre, valor]);
    res.status(201).send('Registro agregado');
  } catch (err) {
    res.status(500).send('Error al agregar registro');
  }
});

app.put('/registro/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, valor } = req.body;
  try {
    await pool.query('UPDATE registro SET nombre=$1, valor=$2 WHERE id=$3', [nombre, valor, id]);
    res.send('Registro actualizado');
  } catch (err) {
    res.status(500).send('Error al actualizar');
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

// Ruta para servir HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});


