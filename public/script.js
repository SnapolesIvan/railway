const BASE_URL = 'https://entorno-web.up.railway.app';

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
  } catch (err) {
    console.error(err);
    alert('Error al consultar registros.');
  }
}

async function agregarRegistro() {
  const nombre = prompt('Ingrese el nombre:');
  const valor = prompt('Ingrese el valor:');
  if (!nombre || !valor) return alert('Ambos campos son obligatorios');

  try {
    const res = await fetch(`${BASE_URL}/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, valor })
    });
    if (!res.ok) throw new Error('Error al agregar');
    alert('Registro agregado exitosamente');
    consultarRegistro();
  } catch (err) {
    alert('No se pudo agregar el registro');
  }
}

async function editarRegistro(id) {
  const nombre = prompt('Nuevo nombre:');
  const valor = prompt('Nuevo valor:');
  if (!nombre || !valor) return alert('Todos los campos son obligatorios');

  try {
    const res = await fetch(`${BASE_URL}/registro/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, valor })
    });
    if (!res.ok) throw new Error('Error al actualizar');
    alert('Registro actualizado');
    consultarRegistro();
  } catch (err) {
    alert('No se pudo actualizar el registro');
  }
}

async function eliminarRegistro(id) {
  if (!confirm('¿Estás seguro de eliminar este registro?')) return;

  try {
    const res = await fetch(`${BASE_URL}/registro/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error al eliminar');
    alert('Registro eliminado');
    consultarRegistro();
  } catch (err) {
    alert('No se pudo eliminar el registro');
  }
}

window.onload = consultarRegistro;

