const BASE_URL = 'https://entorno-web.up.railway.app';

async function consultarRegistro() {
  try {
    const response = await fetch(`${BASE_URL}/registro`);
    const data = await response.json();
    const container = document.getElementById('registros-container');
    container.innerHTML = '';

    if (data.length === 0) {
      container.innerHTML = '<p>No hay registros disponibles.</p>';
      return;
    }

    data.forEach(registro => {
      const div = document.createElement('div');
      div.innerHTML = `
        <p><strong>ID:</strong> ${registro.id}</p>
        <p><strong>Nombre:</strong> ${registro.nombre}</p>
        <p><strong>Valor:</strong> ${registro.valor}</p>
        <button onclick="editarRegistro(${registro.id})">Editar</button>
        <button onclick="eliminarRegistro(${registro.id})">Eliminar</button>
        <hr/>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error('Error al consultar:', err.message);
    alert('No se pudieron obtener los registros.');
  }
}

async function agregarRegistro() {
  const nombre = prompt('Nombre del registro:');
  const valor = prompt('Valor del registro:');

  if (!nombre || !valor) {
    alert('Ambos campos son obligatorios');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, valor })
    });

    if (!response.ok) throw new Error('Error al agregar');
    alert('Registro agregado');
    consultarRegistro();
  } catch (err) {
    console.error('Error al agregar registro:', err.message);
    alert('No se pudo agregar el registro.');
  }
}

async function editarRegistro(id) {
  const nombre = prompt('Nuevo nombre:');
  const valor = prompt('Nuevo valor:');

  if (!nombre || !valor) {
    alert('Ambos campos son obligatorios');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/registro/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, valor })
    });

    if (!response.ok) throw new Error('Error al editar');
    alert('Registro editado');
    consultarRegistro();
  } catch (err) {
    console.error('Error al editar:', err.message);
    alert('No se pudo editar el registro.');
  }
}

async function eliminarRegistro(id) {
  const confirmacion = confirm('¿Estás seguro de eliminar este registro?');
  if (!confirmacion) return;

  try {
    const response = await fetch(`${BASE_URL}/registro/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Error al eliminar');
    alert('Registro eliminado');
    consultarRegistro();
  } catch (err) {
    console.error('Error al eliminar:', err.message);
    alert('No se pudo eliminar el registro.');
  }
}

window.onload = consultarRegistro;

