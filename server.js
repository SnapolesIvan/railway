const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: 'postgresql://postgres:zWvCimOFvUXPSXDPiJBKkqPvgboEtGvv@gondola.proxy.rlwy.net:56083/railway',
  ssl: { rejectUnauthorized: false }
});

app.use(express.json());
app.use(cors());

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
    console.log('✅ Tabla lista');
  } catch (error) {
    console.error('❌ Error al crear tabla:', error.message);
  }
})();

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Backend funcionando correctamente 🚀');
});

// Obtener todos los registros
app.get('/registro', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM registro ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).send('No se pueden consultar los registros');
  }
});

// Obtener registro por ID
app.get('/registro/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM registro WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).send('Registro no encontrado');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Error al obtener el registro');
  }
});

// Agregar nuevo registro
app.post('/registro', async (req, res) => {
  const { nombre, valor } = req.body;
  if (!nombre || !valor) return res.status(400).send('Faltan campos obligatorios');
  try {
    await pool.query('INSERT INTO registro (nombre, valor) VALUES ($1, $2)', [nombre, valor]);
    res.status(201).send('Registro agregado exitosamente');
  } catch (err) {
    res.status(500).send('No se pudo agregar el registro');
  }
});

// Editar registro
app.put('/registro/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, valor } = req.body;
  try {
    await pool.query('UPDATE registro SET nombre = $1, valor = $2 WHERE id = $3', [nombre, valor, id]);
    res.send('Registro actualizado exitosamente');
  } catch (err) {
    res.status(500).send('Error al actualizar el registro');
  }
});

// Eliminar registro
app.delete('/registro/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM registro WHERE id = $1', [id]);
    res.send('Registro eliminado correctamente');
  } catch (err) {
    res.status(500).send('Error al eliminar el registro');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});

