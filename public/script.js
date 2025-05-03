const BASE_URL = 'https://entorno-web.up.railway.app';

async function consultarRegistro() {
  try {
    const response = await fetch(`${BASE_URL}/registro`);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();

    const registrosContainer = document.getElementById('registros-container');
    registrosContainer.innerHTML = '';

    if (data.length === 0) {
      registrosContainer.innerHTML = '<p>No hay registros disponibles.</p>';
    } else {
      data.forEach(registro => {
        const item = document.createElement('div');
        item.classList.add('registro-item');
        item.innerHTML = `
          <strong>ID:</strong> ${registro.id}, 
          <strong>Nombre:</strong> ${registro.nombre}, 
          <strong>Valor:</strong> ${registro.valor}
          <button onclick="editarRegistro(${registro.id}, '${registro.nombre}', '${registro.valor}')">Editar</button>
          <button onclick="eliminarRegistro(${registro.id})">Eliminar</button>
        `;
        registrosContainer.appendChild(item);
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

    if (!response.ok) throw new Error(await response.text());

    alert('Registro agregado con éxito');
    consultarRegistro();
  } catch (error) {
    console.error('Error al agregar registro:', error.message);
    alert('No se pudo agregar el registro.');
  }
}

async function editarRegistro(id, nombreActual, valorActual) {
  const nuevoNombre = prompt('Nuevo nombre:', nombreActual);
  const nuevoValor = prompt('Nuevo valor:', valorActual);

  if (!nuevoNombre || !nuevoValor) {
    alert('Todos los campos son obligatorios');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/registro/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nuevoNombre, valor: nuevoValor })
    });

    if (!response.ok) throw new Error(await response.text());

    alert('Registro editado correctamente');
    consultarRegistro();
  } catch (error) {
    console.error('Error al editar registro:', error.message);
    alert('No se pudo editar el registro.');
  }
}

async function eliminarRegistro(id) {
  if (!confirm(`¿Estás seguro de eliminar el registro con ID ${id}?`)) return;

  try {
    const response = await fetch(`${BASE_URL}/registro/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error(await response.text());

    alert('Registro eliminado correctamente');
    consultarRegistro();
  } catch (error) {
    console.error('Error al eliminar registro:', error.message);
    alert('No se pudo eliminar el registro.');
  }
}

window.onload = consultarRegistro;

