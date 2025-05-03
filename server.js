const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;
const DB_URI = "mongodb+srv://usuario:contraseña@cluster.mongodb.net/registros";

app.use(express.json());
app.use(cors());

mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conectado a la base de datos"))
  .catch(err => console.error("Error al conectar con la DB:", err));

const registroSchema = new mongoose.Schema({
  nombre: String,
  valor: String,
});

const Registro = mongoose.model("Registro", registroSchema);

app.get("/registro", async (req, res) => {
  res.json(await Registro.find());
});

app.post("/registro", async (req, res) => {
  await new Registro(req.body).save();
  res.json({ mensaje: "Registro agregado exitosamente" });
});

app.put("/registro/:id", async (req, res) => {
  await Registro.findByIdAndUpdate(req.params.id, req.body);
  res.json({ mensaje: "Registro editado exitosamente" });
});

app.delete("/registro/:id", async (req, res) => {
  await Registro.findByIdAndDelete(req.params.id);
  res.json({ mensaje: "Registro eliminado exitosamente" });
});

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
