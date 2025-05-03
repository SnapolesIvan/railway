const BASE_URL = "https://entorno-web.up.railway.app";

// Consultar todos los registros
async function consultarRegistro() {
  try {
    const response = await fetch(`${BASE_URL}/registro`);
    const data = await response.json();

    const container = document.getElementById("registros-container");
    container.innerHTML = "";

    if (data.length === 0) {
      container.innerHTML = "<p>No hay registros disponibles.</p>";
      return;
    }

    data.forEach(registro => {
      const div = document.createElement("div");
      div.className = "registro";
      div.innerHTML = `
        <p><strong>ID:</strong> ${registro.id}</p>
        <p><strong>Nombre:</strong> ${registro.nombre}</p>
        <p><strong>Valor:</strong> ${registro.valor}</p>
        <button class="editar" onclick="editarRegistro(${registro.id})">Editar</button>
        <button class="eliminar" onclick="eliminarRegistro(${registro.id})">Eliminar</button>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    console.error("Error al consultar registros:", error);
    alert("Error al obtener registros.");
  }
}

// Agregar nuevo registro
async function agregarRegistro() {
  const nombre = prompt("Introduce el nombre:");
  const valor = prompt("Introduce el valor:");
  if (!nombre || !valor) return alert("Todos los campos son obligatorios.");

  try {
    const response = await fetch(`${BASE_URL}/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, valor }),
    });

    if (!response.ok) throw new Error("Error al agregar registro.");
    alert("Registro agregado.");
    consultarRegistro();
  } catch (error) {
    console.error(error);
    alert("Error al agregar registro.");
  }
}

// Editar registro
async function editarRegistro(id) {
  const nuevoNombre = prompt("Nuevo nombre:");
  const nuevoValor = prompt("Nuevo valor:");
  if (!nuevoNombre || !nuevoValor) return alert("Todos los campos son obligatorios.");

  try {
    const response = await fetch(`${BASE_URL}/registro/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: nuevoNombre, valor: nuevoValor }),
    });

    if (!response.ok) throw new Error("Error al editar registro.");
    alert("Registro editado.");
    consultarRegistro();
  } catch (error) {
    console.error(error);
    alert("Error al editar registro.");
  }
}

// Eliminar registro
async function eliminarRegistro(id) {
  if (!confirm("¿Seguro que deseas eliminar este registro?")) return;

  try {
    const response = await fetch(`${BASE_URL}/registro/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Error al eliminar registro.");
    alert("Registro eliminado.");
    consultarRegistro();
  } catch (error) {
    console.error(error);
    alert("Error al eliminar registro.");
  }
}

window.onload = consultarRegistro;
