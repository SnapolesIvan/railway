const BASE_URL = 'https://entorno-web.up.railway.app';

// Mostrar todos los registros
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
        const div = document.createElement('div');
        div.className = 'registro-item';
        div.innerHTML = `
          <span><strong>ID:</strong> ${registro.id} | <strong>Nombre:</strong> ${registro.nombre} | <strong>Valor:</strong> ${registro.valor}</span>
          <button onclick="editarRegistro(${registro.id})">Editar</button>
          <button onclick="eliminarRegistro(${registro.id})">Eliminar</button>
        `;
        registrosContainer.appendChild(div);
      });
    }
  } catch (error) {
    console.error('Error al consultar:', error.message);
    alert('No se pudieron obtener los registros.');
  }
}

// Agregar registro
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

// Editar registro
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

// Eliminar registro
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

// Ejecutar al cargar
window.onload = consultarRegistro;
