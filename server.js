const express = require('express');
const { Pool } = require('pg'); // Cliente de PostgreSQL
const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de conexión a PostgreSQL en Railway
const pool = new Pool({
  connectionString: 'postgresql://postgres:zWvCimOFvUXPSXDPiJBKkqPvgboEtGvv@gondola.proxy.rlwy.net:56083/railway',
  ssl: {
    rejectUnauthorized: false // Habilita SSL para conexiones seguras en Railway
  }
});

// Middleware para manejar solicitudes JSON
app.use(express.json());

// Ruta para consultar todos los registros
app.get('/registros', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM registros ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al consultar registros:', err);
    res.status(500).send('Error al consultar registros');
  }
});

// Ruta para agregar un registro
app.post('/registros', async (req, res) => {
  const { nombre, valor } = req.body;

  if (!nombre || !valor) {
    return res.status(400).send('Los campos nombre y valor son obligatorios');
  }

  try {
    await pool.query('INSERT INTO registros (nombre, valor) VALUES ($1, $2)', [nombre, valor]);
    res.status(201).send('Registro agregado con éxito');
  } catch (err) {
    console.error('Error al agregar registro:', err);
    res.status(500).send('Error al agregar registro');
  }
});

// Ruta para editar un registro existente
app.put('/registros/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, valor } = req.body;

  if (!nombre || !valor) {
    return res.status(400).send('Los campos nombre y valor son obligatorios');
  }

  try {
    const result = await pool.query(
      'UPDATE registros SET nombre = $1, valor = $2 WHERE id = $3',
      [nombre, valor, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send('Registro no encontrado');
    }

    res.send('Registro actualizado');
  } catch (err) {
    console.error('Error al actualizar registro:', err);
    res.status(500).send('Error al actualizar registro');
  }
});

// Ruta para eliminar un registro
app.delete('/registros/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM registros WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).send('Registro no encontrado');
    }

    res.send('Registro eliminado');
  } catch (err) {
    console.error('Error al eliminar registro:', err);
    res.status(500).send('Error al eliminar registro');
  }
});

// Inicialización del servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
