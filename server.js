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
