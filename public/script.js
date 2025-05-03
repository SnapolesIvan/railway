const BASE_URL = 'https://entorno-web.up.railway.app';

// Mostrar todos los registros
async function consultarRegistro() {
  try {
    const response = await fetch(`${BASE_URL}/registro`);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();

    const container = document.getElementById('registros-container');
    container.innerHTML = '';

    if (data.length === 0) {
      container.innerHTML = '<p>No hay registros disponibles.</p>';
    } else {
      data.forEach(registro => {
        const div = document.createElement('div');
        div.className = 'registro-item';
        div.innerHTML = `
          <span><strong>ID:</strong> ${registro.id} | <strong>Nombre:</strong> ${registro.nombre} | <strong>Valor:</strong> ${registro.valor}</span>
          <button class="editar-btn" onclick="editarRegistro(${registro.id})">Editar</button>
          <button class="eliminar-btn" onclick="eliminarRegistro(${registro.id})">Eliminar</button>
        `;
        container.appendChild(div);
      });
    }
  } catch (error) {
    console.error('Error al consultar:', error.message);
    alert('No se pudieron obtener los registros.');
  }
}

async function agregarRegistro() {
  const nombre = prompt('Introduce el nombre del registro:');
  const valor = prompt('Introduce el valor del registro:');

  if (!nombre || !valor) return alert('Ambos campos son obligatorios.');

  try {
    const response = await fetch(`${BASE_URL}/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, valor })
    });

    if (!response.ok) throw new Error(await response.text());

    alert('Registro agregado con éxito');
    consultarRegistro();
  } catch (error) {
    console.error('Error al agregar:', error.message);
    alert('No se pudo agregar el registro.');
  }
}

async function editarRegistro(id) {
  const nombre = prompt('Nuevo nombre:');
  const valor = prompt('Nuevo valor:');

  if (!nombre || !valor) return alert('Todos los campos son obligatorios.');

  try {
    const response = await fetch(`${BASE_URL}/registro/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, valor })
    });

    if (!response.ok) throw new Error(await response.text());

    alert('Registro actualizado correctamente');
    consultarRegistro();
  } catch (error) {
    console.error('Error al editar:', error.message);
    alert('No se pudo editar el registro.');
  }
}

async function eliminarRegistro(id) {
  if (!confirm('¿Estás seguro de eliminar este registro?')) return;

  try {
    const response = await fetch(`${BASE_URL}/registro/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error(await response.text());

    alert('Registro eliminado correctamente');
    consultarRegistro();
  } catch (error) {
    console.error('Error al eliminar:', error.message);
    alert('No se pudo eliminar el registro.');
  }
}

window.onload = consultarRegistro;

