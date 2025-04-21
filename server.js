const express = require('express');
const { Pool } = require('pg');
const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  user: 'tu_usuario',
  host: 'tu_host',
  database: 'tu_base_de_datos',
  password: 'tu_contraseña',
  port: 5432,
});

app.use(express.json());

app.get('/registros', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM registros ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al consultar los registros');
  }
});

app.post('/registros', async (req, res) => {
  const { nombre, valor } = req.body;
  if (!nombre || !valor) return res.status(400).send('Los campos son obligatorios');
  try {
    await pool.query('INSERT INTO registros (nombre, valor) VALUES ($1, $2)', [nombre, valor]);
    res.status(201).send('Registro agregado');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al agregar el registro');
  }
});

app.put('/registros/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, valor } = req.body;
  try {
    const result = await pool.query(
      'UPDATE registros SET nombre = $1, valor = $2 WHERE id = $3',
      [nombre, valor, id]
    );
    if (result.rowCount === 0) return res.status(404).send('Registro no encontrado');
    res.send('Registro actualizado');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al actualizar el registro');
  }
});

app.delete('/registros/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM registros WHERE id = $1', [id]);
    if (result.rowCount === 0) return res.status(404).send('Registro no encontrado');
    res.send('Registro eliminado');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar el registro');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
