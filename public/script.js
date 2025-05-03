const BASE_URL = 'https://entorno-web.up.railway.app';
let registroSeleccionadoId = null;

async function consultarRegistro() {
  try {
    const response = await fetch(`${BASE_URL}/registro`);
    const registros = await response.json();

    const container = document.getElementById('registros-container');
    container.innerHTML = '';

    if (registros.length === 0) {
      container.innerHTML = '<p>No hay registros disponibles.</p>';
      return;
    }

    registros.forEach(registro => {
      const div = document.createElement('div');
      div.classList.add('registro-item');
      div.innerHTML = `
        <p onclick="seleccionarRegistro(${registro.id})" style="cursor: pointer;">
          <strong>ID:</strong> ${registro.id} | <strong>Nombre:</strong> ${registro.nombre} | <strong>Valor:</strong> ${registro.valor}
        </p>
      `;
      if (registro.id === registroSeleccionadoId) {
        div.style.backgroundColor = '#e0e0e0';
      }
      container.appendChild(div);
    });
  } catch (error) {
    console.error('Error al consultar:', error.message);
    alert('No se pudieron obtener los registros.');
  }
}

function seleccionarRegistro(id) {
  registroSeleccionadoId = id;
  consultarRegistro();
}

async function agregarRegistro() {
  const nombre = prompt('Introduce el nombre del registro:');
  const valor = prompt('Introduce el valor del registro:');

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
    alert('Registro agregado con éxito');
    consultarRegistro();
  } catch (error) {
    alert('No se pudo agregar el registro.');
  }
}

async function editarRegistroSeleccionado() {
  if (!registroSeleccionadoId) {
    alert('Selecciona un registro primero');
    return;
  }

  const nombre = prompt('Nuevo nombre:');
  const valor = prompt('Nuevo valor:');

  if (!nombre || !valor) {
    alert('Todos los campos son obligatorios');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/registro/${registroSeleccionadoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, valor })
    });

    if (!response.ok) throw new Error('Error al editar');
    alert('Registro editado correctamente');
    consultarRegistro();
  } catch (error) {
    alert('No se pudo editar el registro.');
  }
}

async function eliminarRegistroSeleccionado() {
  if (!registroSeleccionadoId) {
    alert('Selecciona un registro primero');
    return;
  }

  const confirmar = confirm(`¿Eliminar el registro con ID ${registroSeleccionadoId}?`);
  if (!confirmar) return;

  try {
    const response = await fetch(`${BASE_URL}/registro/${registroSeleccionadoId}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Error al eliminar');
    alert('Registro eliminado correctamente');
    registroSeleccionadoId = null;
    consultarRegistro();
  } catch (error) {
    alert('No se pudo eliminar el registro.');
  }
}

window.onload = consultarRegistro;

