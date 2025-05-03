const BASE_URL = 'https://entorno-web.up.railway.app';

// Consultar registros
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
        <p><strong>ID:</strong> ${registro.id} | <strong>Nombre:</strong> ${registro.nombre} | <strong>Valor:</strong> ${registro.valor}</p>
        <div class="buttons">
          <button onclick="editarRegistro(${registro.id})">Editar</button>
          <button onclick="eliminarRegistro(${registro.id})">Eliminar</button>
        </div>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    console.error('Error al consultar:', error.message);
    alert('No se pudieron obtener los registros.');
  }
}

// Agregar registro
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
    console.error('Error al agregar registro:', error.message);
    alert('No se pudo agregar el registro.');
  }
}

// Editar registro
async function editarRegistro(id) {
  const nombre = prompt('Nuevo nombre:');
  const valor = prompt('Nuevo valor:');

  if (!nombre || !valor) {
    alert('Todos los campos son obligatorios');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/registro/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, valor })
    });

    if (!response.ok) throw new Error('Error al editar');

    alert('Registro editado correctamente');
    consultarRegistro();
  } catch (error) {
    console.error('Error al editar registro:', error.message);
    alert('No se pudo editar el registro.');
  }
}

// Eliminar registro
async function eliminarRegistro(id) {
  const confirmar = confirm(`¿Estás seguro de eliminar el registro con ID ${id}?`);
  if (!confirmar) return;

  try {
    const response = await fetch(`${BASE_URL}/registro/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Error al eliminar');

    alert('Registro eliminado correctamente');
    consultarRegistro();
  } catch (error) {
    console.error('Error al eliminar registro:', error.message);
    alert('No se pudo eliminar el registro.');
  }
}

// Cargar registros al iniciar
window.onload = consultarRegistro;
