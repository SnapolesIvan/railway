const express = require('express');
const { Pool } = require('pg'); // Cliente de PostgreSQL
const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de la conexión a la base de datos
const pool = new Pool({
  user: 'tu_usuario', // Cambia por tu usuario de PostgreSQL
  host: 'tu_host',    // Cambia por el host que proporciona Railway
  database: 'tu_base_de_datos', // Nombre de la base de datos
  password: 'tu_contraseña', // Contraseña de la base de datos
  port: 5432, // Puerto por defecto de PostgreSQL
});

// Middleware
app.use(express.json());

// Rutas
app.get('/registros', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM registros'); // Consulta todos los registros
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
});

app.get('/registros/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM registros WHERE id = $1', [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
});

app.post('/registros', async (req, res) => {
  const { nombre, valor } = req.body;
  try {
    await pool.query('INSERT INTO registros (nombre, valor) VALUES ($1, $2)', [nombre, valor]);
    res.status(201).send('Registro agregado');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
});

app.put('/registros/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, valor } = req.body;
  try {
    await pool.query('UPDATE registros SET nombre = $1, valor = $2 WHERE id = $3', [nombre, valor, id]);
    res.send('Registro actualizado');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
});

app.delete('/registros/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM registros WHERE id = $1', [id]);
    res.send('Registro eliminado');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
