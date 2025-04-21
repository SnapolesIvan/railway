const express = require('express');
const { Pool } = require('pg'); // Cliente de PostgreSQL
const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de conexión a PostgreSQL en Railway
const pool = new Pool({
  connectionString: 'postgresql://postgres:zWvCimOFvUXPSXDPiJBKkqPvgboEtGvv@postgres.railway.internal:5432/railway',
  ssl: { rejectUnauthorized: false } // Habilita SSL para conexiones seguras
});

// Middleware para manejar solicitudes JSON
app.use(express.json());

// Probar la conexión
app.get('/prueba', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.status(200).send(`Conexión exitosa: ${result.rows[0].now}`);
  } catch (err) {
    console.error('Error en la conexión:', err.message);
    res.status(500).send('Error al conectar con la base de datos');
  }
});

// Consultar todos los registros
app.get('/registro', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM registro ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al consultar registros:', err.message);
    res.status(500).send('Error al consultar registros');
  }
});

// Agregar un registro
app.post('/registro', async (req, res) => {
  const { nombre, valor } = req.body;

  if (!nombre || !valor) {
    return res.status(400).send('Los campos nombre y valor son obligatorios');
  }

  try {
    await pool.query('INSERT INTO registro (nombre, valor) VALUES ($1, $2)', [nombre, valor]);
    res.status(201).send('Registro agregado con éxito');
  } catch (err) {
    console.error('Error al agregar registro:', err.message);
    res.status(500).send('Error al agregar registro');
  }
});

// Editar un registro
app.put('/registro/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, valor } = req.body;

  if (!nombre || !valor) {
    return res.status(400).send('Los campos nombre y valor son obligatorios');
  }

  try {
    const result = await pool.query(
      'UPDATE registro SET nombre = $1, valor = $2 WHERE id = $3',
      [nombre, valor, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send('El registro no existe');
    }

    res.status(200).send('Registro actualizado con éxito');
  } catch (err) {
    console.error('Error al actualizar registro:', err.message);
    res.status(500).send('Error al actualizar registro');
  }
});

// Eliminar un registro
app.delete('/registro/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM registro WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).send('El registro no existe');
    }

    res.status(200).send('Registro eliminado con éxito');
  } catch (err) {
    console.error('Error al eliminar registro:', err.message);
    res.status(500).send('Error al eliminar registro');
  }
});

// Iniciar el servidor
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
