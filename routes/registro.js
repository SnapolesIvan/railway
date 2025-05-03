const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

// Configuración del pool (mismo connectionString que en server.js)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// GET /registro
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM registro ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al consultar registros');
  }
});

// POST /registro
router.post('/', async (req, res) => {
  const { nombre, valor } = req.body;
  if (!nombre || !valor) return res.status(400).send('Campos faltantes');
  try {
    await pool.query('INSERT INTO registro (nombre, valor) VALUES ($1,$2)', [nombre, valor]);
    res.status(201).send('Creado');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al agregar');
  }
});

// PUT /registro/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, valor } = req.body;
  if (!nombre || !valor) return res.status(400).send('Campos faltantes');
  try {
    const r = await pool.query('UPDATE registro SET nombre=$1, valor=$2 WHERE id=$3', [nombre, valor, id]);
    if (r.rowCount === 0) return res.status(404).send('No existe');
    res.send('Actualizado');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al actualizar');
  }
});

// DELETE /registro/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const r = await pool.query('DELETE FROM registro WHERE id=$1', [id]);
    if (r.rowCount === 0) return res.status(404).send('No existe');
    res.send('Eliminado');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar');
  }
});

module.exports = router;
