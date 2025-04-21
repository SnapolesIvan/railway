const express = require('express');
const { Pool } = require('pg'); // PostgreSQL client
const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de la conexión a PostgreSQL (Railway)
const pool = new Pool({
  connectionString: 'postgresql://postgres:zWvCimOFvUXPSXDPiJBKkqPvgboEtGvv@gondola.proxy.rlwy.net:56083/railway',
  ssl: {
    rejectUnauthorized: false
  }
});

// Middleware para manejar JSON
app.use(express.json());

// Probar la conexión a la base de datos
app.get('/prueba', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()'); // Consulta básica para verificar conexión
    res.status(200).send(`Conexión exitosa: ${result.rows[0].now}`);
  } catch (err) {
    console.error('Error en la conexión:', err.message);
    res.status(500).send('Error en la conexión a la base de datos');
  }
});

// Ruta para obtener todos los registros
app.get('/registros', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM registros ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al consultar registros:', err.message);
    res.status(500).send('No se pueden consultar los registros en este momento');
  }
});

// Ruta para agregar un nuevo registro
app.post('/registros', async (req, res) => {
  const { nombre, valor } = req.body;

  if (!nombre || !valor) {
    return res.status(400).send('Los campos nombre y valor son obligatorios');
  }

  try {
    await pool.query('INSERT INTO registros (nombre, valor) VALUES ($1, $2)', [nombre, valor]);
    res.status(201).send('Registro agregado exitosamente');
  } catch (err) {
    console.error('Error al insertar registro:', err.message);
    res.status(500).send('No se pudo agregar el registro');
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
      return res.status(404).send('El registro no existe');
    }

    res.status(200).send('Registro actualizado exitosamente');
  } catch (err) {
    console.error('Error al actualizar registro:', err.message);
    res.status(500).send('No se pudo actualizar el registro');
  }
});

// Ruta para eliminar un registro existente
app.delete('/registros/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM registros WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).send('El registro no existe');
    }

    res.status(200).send('Registro eliminado exitosamente');
  } catch (err) {
    console.error('Error al eliminar registro:', err.message);
    res.status(500).send('No se pudo eliminar el registro');
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
