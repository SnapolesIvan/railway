const BASE_URL = 'https://entorno-web.up.railway.app';

async function consultarRegistro() {
  try {
    const response = await fetch(`${BASE_URL}/registro`);
    const data = await response.json();

    const container = document.getElementById('registros-container');
    container.innerHTML = '';

    if (data.length === 0) {
      container.innerHTML = '<p>No hay registros.</p>';
      return;
    }

    data.forEach(reg => {
      const div = document.createElement('div');
      div.innerHTML = `
        <p><strong>ID:</strong> ${reg.id} |
        <strong>Nombre:</strong> ${reg.nombre} |
        <strong>Valor:</strong> ${reg.valor}</p>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    console.error('Error al consultar registros:', error);
    alert('No se pudieron obtener los registros.');
  }
}

async function agregarRegistro() {
  const nombre = prompt('Nombre del registro:');
  const valor = prompt('Valor del registro:');

  if (!nombre || !valor) {
    alert('Todos los campos son obligatorios');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, valor })
    });

    if (!response.ok) throw new Error(await response.text());

    alert('Registro agregado exitosamente');
    consultarRegistro();
  } catch (err) {
    console.error('Error al agregar:', err);
    alert('No se pudo agregar el registro.');
  }
}

async function editarRegistro() {
  const id = prompt('ID del registro a editar:');
  const nombre = prompt('Nuevo nombre:');
  const valor = prompt('Nuevo valor:');

  if (!id || !nombre || !valor) {
    alert('Todos los campos son obligatorios');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/registro/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, valor })
    });

    if (!response.ok) throw new Error(await response.text());

    alert('Registro editado exitosamente');
    consultarRegistro();
  } catch (err) {
    console.error('Error al editar:', err);
    alert('No se pudo editar el registro.');
  }
}

async function eliminarRegistro() {
  const id = prompt('ID del registro a eliminar:');

  if (!id) {
    alert('Debes ingresar un ID');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/registro/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error(await response.text());

    alert('Registro eliminado exitosamente');
    consultarRegistro();
  } catch (err) {
    console.error('Error al eliminar:', err);
    alert('No se pudo eliminar el registro.');
  }
}

window.onload = consultarRegistro;

