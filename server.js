const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de PostgreSQL
const pool = new Pool({
  connectionString: 'postgresql://postgres:zWvCimOFvUXPSXDPiJBKkqPvgboEtGvv@gondola.proxy.rlwy.net:56083/railway',
  ssl: { rejectUnauthorized: false }
});

// Middleware
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
    console.log('Tabla verificada o creada con éxito');
  } catch (error) {
    console.error('Error al crear tabla:', error.message);
  }
})();

// Obtener registros
app.get('/registro', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM registro ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al consultar registros:', err.message);
    res.status(500).send('Error al consultar registros');
  }
});

// Agregar nuevo registro
app.post('/registro', async (req, res) => {
  const { nombre, valor } = req.body;
  if (!nombre || !valor) {
    return res.status(400).send('Nombre y valor son obligatorios');
  }

  try {
    await pool.query('INSERT INTO registro (nombre, valor) VALUES ($1, $2)', [nombre, valor]);
    res.status(201).send('Registro agregado');
  } catch (err) {
    console.error('Error al agregar registro:', err.message);
    res.status(500).send('Error al agregar registro');
  }
});

// Editar registro existente
app.put('/registro/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, valor } = req.body;

  if (!nombre || !valor) {
    return res.status(400).send('Nombre y valor son obligatorios');
  }

  try {
    const result = await pool.query(
      'UPDATE registro SET nombre = $1, valor = $2 WHERE id = $3',
      [nombre, valor, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).send('Registro no encontrado');
    }
    res.status(200).send('Registro actualizado');
  } catch (err) {
    console.error('Error al actualizar registro:', err.message);
    res.status(500).send('Error al actualizar registro');
  }
});

// Eliminar registro
app.delete('/registro/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM registro WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).send('Registro no encontrado');
    }
    res.status(200).send('Registro eliminado');
  } catch (err) {
    console.error('Error al eliminar registro:', err.message);
    res.status(500).send('Error al eliminar registro');
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
