const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Verificar/crear tabla al iniciar
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
(async () => {
  await pool.query(`CREATE TABLE IF NOT EXISTS registro (id SERIAL PRIMARY KEY, nombre TEXT NOT NULL, valor TEXT NOT NULL);`);
})();

// Router API
const registroRouter = require('./routes/registro');
app.use('/registro', registroRouter);

// Ruta raíz
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
