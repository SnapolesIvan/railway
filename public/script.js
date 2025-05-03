const BASE_URL = '';

async function consultarRegistros() {
  try {
    const res = await fetch(`${BASE_URL}/registro`);
    const datos = await res.json();

    const contenedor = document.getElementById('registros-container');
    contenedor.innerHTML = '';

    datos.forEach(reg => {
      const div = document.createElement('div');
      div.innerHTML = `
        <p><strong>ID:</strong> ${reg.id} | <strong>Nombre:</strong> ${reg.nombre} | <strong>Valor:</strong> ${reg.valor}</p>
        <button onclick="editarRegistro(${reg.id}, '${reg.nombre}', '${reg.valor}')">Editar</button>
        <button onclick="eliminarRegistro(${reg.id})">Eliminar</button>
        <hr>
      `;
      contenedor.appendChild(div);
    });
  } catch (err) {
    alert('No se pudieron cargar los registros');
  }
}

async function agregarRegistro() {
  const nombre = prompt('Nombre:');
  const valor = prompt('Valor:');
  if (!nombre || !valor) return alert('Campos obligatorios');

  try {
    await fetch(`${BASE_URL}/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, valor })
    });
    consultarRegistros();
  } catch (err) {
    alert('Error al agregar');
  }
}

async function editarRegistro(id, nombreActual, valorActual) {
  const nombre = prompt('Nuevo nombre:', nombreActual);
  const valor = prompt('Nuevo valor:', valorActual);
  if (!nombre || !valor) return alert('Campos requeridos');

  try {
    await fetch(`${BASE_URL}/registro/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, valor })
    });
    consultarRegistros();
  } catch (err) {
    alert('Error al editar');
  }
}

async function eliminarRegistro(id) {
  if (!confirm('¿Eliminar este registro?')) return;

  try {
    await fetch(`${BASE_URL}/registro/${id}`, { method: 'DELETE' });
    consultarRegistros();
  } catch (err) {
    alert('Error al eliminar');
  }
}

window.onload = consultarRegistros;
