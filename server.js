const express = require('express');
const { Pool } = require('pg'); // Cliente de PostgreSQL
const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: 'tu_usuario', // Usuario de PostgreSQL proporcionado por Railway
  host: 'tu_host',    // Host de PostgreSQL proporcionado por Railway
  database: 'tu_base_de_datos', // Nombre de la base de datos proporcionado
  password: 'tu_contraseña', // Contraseña de PostgreSQL proporcionada
  port: 5432, // Puerto predeterminado de PostgreSQL
});

// Middleware para permitir JSON en las solicitudes
app.use(express.json());

// Ruta para consultar todos los registros
app.get('/registros', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM registros'); // Consulta todos los registros
    res.json(result.rows); // Devuelve los registros como JSON
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al consultar los registros');
  }
});

// Ruta para consultar un registro individual por ID
app.get('/registros/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM registros WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).send('Registro no encontrado');
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al consultar el registro');
  }
});

// Ruta para agregar un nuevo registro
app.post('/registros', async (req, res) => {
  const { nombre, valor } = req.body;
  try {
    await pool.query('INSERT INTO registros (nombre, valor) VALUES ($1, $2)', [nombre, valor]);
    res.status(201).send('Registro agregado');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al agregar el registro');
  }
});

// Ruta para editar un registro existente
app.put('/registros/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, valor } = req.body;
  try {
    const result = await pool.query('UPDATE registros SET nombre = $1, valor = $2 WHERE id = $3', [nombre, valor, id]);
    if (result.rowCount === 0) {
      res.status(404).send('Registro no encontrado');
    } else {
      res.send('Registro actualizado');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al actualizar el registro');
  }
});

// Ruta para eliminar un registro por ID
app.delete('/registros/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM registros WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      res.status(404).send('Registro no encontrado');
    } else {
      res.send('Registro eliminado');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar el registro');
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
