const express = require('express');
const { Pool } = require('pg'); // Cliente de PostgreSQL
const cors = require('cors'); // Habilitar CORS para conexión con frontend
const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de conexión a PostgreSQL en Railway
const pool = new Pool({
  connectionString: 'postgresql://postgres:zWvCimOFvUXPSXDPiJBKkqPvgboEtGvv@gondola.proxy.rlwy.net:56083/railway',
  ssl: { rejectUnauthorized: false } // Habilitar SSL para conexiones seguras
});

// Middleware
app.use(express.json()); // Manejo de solicitudes JSON
app.use(cors()); // Habilita CORS para evitar problemas con el frontend

// **Prueba de conexión a la base de datos**
app.get('/prueba', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()'); // Verificar conexión
    res.status(200).send(`Conexión exitosa: ${result.rows[0].now}`);
  } catch (err) {
    console.error('Error al conectar con la base de datos:', err.message);
    res.status(500).send('Error al conectar con la base de datos');
  }
});

// **Consultar todos los registros**
app.get('/registro', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM registro ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al consultar registros:', err.message);
    res.status(500).send('No se pueden consultar los registros');
  }
});

// **Consultar un registro por ID**
app.get('/registro/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM registro WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Registro no encontrado');
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error al consultar el registro:', err.message);
    res.status(500).send('Error al consultar el registro');
  }
});

// **Agregar un nuevo registro**
app.post('/registro', async (req, res) => {
  const { nombre, valor } = req.body;

  if (!nombre || !valor) {
    return res.status(400).send('Los campos nombre y valor son obligatorios');
  }

  console.log('Datos recibidos:', req.body); // Verificación de datos en consola

  try {
    await pool.query('INSERT INTO registro (nombre, valor) VALUES ($1, $2)', [nombre, valor]);
    res.status(201).send('Registro agregado exitosamente');
  } catch (err) {
    console.error('Error al agregar registro:', err.message);
    res.status(500).send('No se pudo agregar el registro');
  }
});

// **Editar un registro existente**
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

    res.status(200).send('Registro actualizado exitosamente');
  } catch (err) {
    console.error('Error al actualizar registro:', err.message);
    res.status(500).send('No se pudo actualizar el registro');
  }
});

// **Eliminar un registro existente**
app.delete('/registro/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM registro WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).send('El registro no existe');
    }

    res.status(200).send('Registro eliminado exitosamente');
  } catch (err) {
    console.error('Error al eliminar registro:', err.message);
    res.status(500).send('No se pudo eliminar el registro');
  }
});

// **Iniciar el servidor**
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
